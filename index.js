
const gameBoard = $('#gameboard')
const infoDisplay = $("#info")
const shapes = ['circle', 'cross']
const startCells = ["", "", "", "", "", "", "", "", ""]
const root = document.querySelector(":root")

const randomPerson = $('h2')[Math.floor(Math.random() * 2)]
const otherPerson = $('h2').not(randomPerson)
const randomOtherIndex = Math.floor(Math.random() * otherPerson.length)
const randomOtherPerson = otherPerson[randomOtherIndex]

let go = shapes[Math.floor(Math.random() * 2)]

const resetButton = $('.reset_button')
resetButton.on('click', playAgain_or_Reset)

function playAgain_or_Reset() {

    location.reload(true)
    // $('div.circle').remove()
    // $('div.cross').remove()
    // $('.winner_screen').remove()
    // $('.play_again_button').remove()
    // $('#choose_colors').show()
}

infoDisplay.text($(randomPerson).html() + " goes first.")

const addShape = $('<p>').addClass('smaller_' + go)

const otherShape = shapes.find(shape => shape !== go)
const addOtherShape = $('<p>').addClass('smaller_' + otherShape)

if ($(infoDisplay).text().includes('One')){
    $('.player1').after(addShape)
    $('.player2').after(addOtherShape)
} else if($(infoDisplay).text().includes('Two')){
    $('.player1').after(addOtherShape)
    $('.player2').after(addShape)
}

function createBoard() {
    startCells.forEach((_cell, index) => {
        const cellElement = $('<div>').addClass('square')
        $(cellElement).on('click', addGo)
        $(cellElement).attr('id', index)
        gameBoard.append(cellElement)
    })
}

createBoard()

function colorSelected1 (element) {
    if(($('div#player_one p.smaller_circle').length > 0)){
        $('.smaller_circle').css('borderColor', element.value)
        root.style.setProperty("--pseudo-bordercolor", element.value)
    } else if(($('div#player_one p.smaller_cross').length > 0)){
        root.style.setProperty("--pseudo-backgroundcolor", element.value)
    }
}

function colorSelected2 (element) {
    if(($('div#player_two p.smaller_circle').length > 0)){
        $('.smaller_circle').css('borderColor', element.value)
        root.style.setProperty("--pseudo-bordercolor", element.value)
    } else if(($('div#player_two p.smaller_cross').length > 0)){
        root.style.setProperty("--pseudo-backgroundcolor", element.value)
    }
}

function addGo(e) {
    $('#choose_colors').hide()

    const goDisplay = $('<div>').addClass(go)
    $(e.target).append(goDisplay)

    if(go === 'circle'){
        go = 'cross'
    } else{
        go = 'circle'
    }

    if(infoDisplay.text().includes($(randomPerson).html())){
        infoDisplay.text("It is now " + $(randomOtherPerson).html() + "'s turn")
    } else{
        infoDisplay.text("It is now " + $(randomPerson).html() + "'s turn")
    }

    $(e.target).off('click', addGo)
    checkScore()
  }

function checkScore() {
    const allSquares = $('.square')
    let crossWins = false
    let circleWins = false

    const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ]

    const winnerScreen = $('<div>').addClass('winner_screen')
            const winnerMessage = $('<h2>').addClass('winner_text')
            const playAgain = $('<button>').addClass('play_again_button')

    winningCombos.forEach(array => {
        const circleWins = array.every(cell =>
            allSquares[cell].firstChild?.classList.contains('circle'))

        if (circleWins){
            // infoDisplay.text('Circle wins!')
            const circleColor = $('.circle').css('--pseudo-bordercolor')
            playAgain.css('--pseudo-button-backgroundcolor', circleColor)
            $('.container').append(winnerScreen)
            $(winnerScreen).append((winnerMessage).text('Circle Wins!'))
            $(winnerScreen).append((playAgain).text('Play Again'))
            playAgain.on('click', playAgain_or_Reset)
            allSquares.forEach(square => square.replaceWith(square.cloneNode(true)))
        }
    })

    if (!circleWins) {
        winningCombos.forEach(array => {
          crossWins = crossWins || array.every(cell =>
            allSquares[cell].firstChild?.classList.contains('cross')
          )
    
          if (crossWins) {
            const crossColor = $('.cross').css('--pseudo-backgroundcolor')
            playAgain.css('--pseudo-button-backgroundcolor', crossColor)
            $('.container').append(winnerScreen)
            $(winnerScreen).append((winnerMessage).text('Cross Wins!'))
            $(winnerScreen).append((playAgain).text('Play Again'))
            playAgain.on('click', playAgain_or_Reset)
          }
        })
      }

    const isDraw = allSquares.toArray().every(square => $(square).children().length > 0)

    if (isDraw && !crossWins && !circleWins) {
        playAgain.addClass('draw')
        playAgain.css('--pseudo-button-backgroundcolor', 'seagreen')
        $('.container').append(winnerScreen)
        $(winnerScreen).append((winnerMessage).text('Draw!'))
        $(winnerScreen).append((playAgain).text('Play Again'))
        playAgain.on('click', playAgain_or_Reset)
    }
}

