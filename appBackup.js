
"use strict";

const grid = document.querySelector('.grid-container');
const infoContainer = document.querySelector('.nextShape-Score-Lines');
const topScoreElement = document.querySelector(".currTopScoreAmount")
const startBtn = document.querySelector("#startBtn")
const tryBtn = document.querySelector("#tryBtn")
const cells = [];
const nextShapeCells = [];
const shapes = ['ishape', 'jshape', 'oshape', 'lshape', 'zshape', 'tshape', 'sshape'];
const width = 10;
const height = 20;
let currLoc = 4;
let currRot = 0;
let currShape = '';
let nextShape = '';
let nextShapeLoc;
let futLoc;
let futRot;
let currScore = 0;
let linesClearedTotal = 0;
let intervalId;
let down = false;
let isGameOver = false;
let decision;
let timer; // current timeout id to clear
let currLevel = 1;

var time = 900; // dynamic interval
let currHighScore = JSON.parse(localStorage.getItem('highScore')) 

//makes sure top-left is always the first entry below, right position on far right
//Work out where it is compared to currLoc and then map positions correctly

//Shapes relative to the currLoc

const ishape =  [
  [-1, 0, 1, 2],
  [- width, 0, width , width * 2],
  [-1, 0, 1, 2],
  [- width, 0, width , width * 2]
]

const oshape = [
  [+ width, 0, + width + 1, 1],
  [+ width, 0, + width + 1, 1],
  [+ width, 0, + width + 1, 1],
  [+ width, 0, + width + 1, 1]
]

const lshape = [
  [-1, 0, width - 1, 1],
  [-width - 1, - width, 0, + width],
  [-1, 0, -width + 1, 1],
  [-width, 0, + width, + width + 1]
]

const jshape = [
  [-1, 0, 1, width + 1],
  [+ width - 1, 0, -width, + width],
  [-width - 1, 0, -1, 1],
  [-width, 0, +width, - width + 1]
]

const zshape = [
  [-width - 1, 0, - width, 1 ],
  [-1, 0, + width - 1, - width],
  [-width - 1, 0, - width, 1 ],
  [-1, 0, + width - 1, - width]
]

const tshape = [
  [-1, 0, + width, 1],
  [-1, 0, - width, + width],
  [-1, 0, -width, 1],
  [-width, 0, + width, 1]
]

const sshape = [
  [-1, 0, - width, - width + 1],
  [-width - 1, 0,  -1, + width],
  [-1, 0, - width, - width + 1],
  [-width - 1, 0,  -1, + width]

]

//Creates the grid 10 x 20

const createGrid = () => {
  startBtn.remove()
  for (let i = 0; i < 200; i++) {
    const cell = document.createElement('div')
    cell.classList.add('cell')
    grid.appendChild(cell)
    cells.push(cell)
  }
}

const checkLines = () => {
  const chunk = 10;
  let tempArray = [];
  let lineCheck = [];
  let linesCleared = 0;
  let rowNum = -1;
  const isFalse = (element) => element === false
  for (let i = 0; i < cells.length; i += chunk) {
    tempArray = cells.slice(i, i + chunk) //Temparray splits all the cells into blocks of 10
    rowNum += 1;

    for (let i = 0; i < tempArray.length; i++) {
      const value = tempArray[i].classList.contains('full'); // Returns a true or false value depending on whether the full class is attached
      lineCheck.push(value) // adds it to lineCheck array

    }
    if (lineCheck.some(isFalse)) {
      console.log('false');
    } else { // if true splice out the cells of the array
      cells.splice(rowNum * 10, 10)
      linesCleared += 1
      clearSound()
      linesClearedTotal += 1 // This needs resetting on game over!!!
      tempArray.forEach(cell => {
        
        cell.remove()
        const newCell = document.createElement('div')
        newCell.classList.add('cell')
        grid.prepend(newCell)
        cells.unshift(newCell)

      })
    }
    lineCheck = []
  }
  score(linesCleared, linesClearedTotal)
  levelFunc()
  topScore()

}

const music = () => {
  const audioElem = document.querySelector('audio')
  audioElem.src = 'tetris.mp3'
  audioElem.loop = true;
  audioElem.play()
}

const gameOverMusic = () => {
  const audioElem = document.querySelector('audio')
  audioElem.src = 'game-over.mp3'
  audioElem.loop = false;
  audioElem.play()


}

const clearSound = () => {
  const clearSound = new Audio('clear.wav')
  clearSound.play()
} 


const score = (linesCleared, linesClearedTotal) => {
  if (linesCleared === 1) {
    currScore += 40
  } else if (linesCleared === 2) {
    currScore += 100
  } else if (linesCleared === 3) {
    currScore += 300
  } else if (linesCleared >= 4) {
    currScore += 1200
  }

  document.querySelector('.currScore').innerHTML = currScore
  document.querySelector('.currLineAmount').innerHTML = linesClearedTotal
}


const createNextShapeDisplay = () => {

  const nextShape = document.createElement('div')
  nextShape.classList.add('nextShape')
 
  infoContainer.append(nextShape)

  for (let i = 0; i < 60; i++) {
    const cell = document.createElement('div')
    cell.classList.add('cellNextShape')
    nextShape.appendChild(cell)
    nextShapeCells.push(cell)
  }

}


const createScoreLevelLinesDisplay = () => {

  const userInfo = document.createElement('div');
  userInfo.classList.add('userInfo')
  infoContainer.append(userInfo)

  const score = document.createElement('div');
  const scoreHeader = document.createElement('h4')
  const scoreParagraph = document.createElement('p');

  score.classList.add('scoreBoard');
  scoreHeader.innerHTML = 'Score';
  userInfo.append(score);
  score.append(scoreHeader)
  score.append(scoreParagraph)
  scoreParagraph.classList.add('currScore')
  scoreParagraph.innerHTML = currScore

  const lines = document.createElement('div');
  const linesHeader = document.createElement('h4')
  const linesParagraph = document.createElement('p');

  lines.classList.add('lines');
  linesHeader.innerHTML = 'Lines';
  userInfo.append(lines);
  lines.append(linesHeader)
  lines.append(linesParagraph)
  linesParagraph.classList.add('currLineAmount')
  linesParagraph.innerHTML = linesClearedTotal

  const topScore = document.createElement('div');
  const topScoreHeader = document.createElement('h4')
  const topScoreParagraph = document.createElement('p');

  topScore.classList.add('highScore');
  topScoreHeader.innerHTML = 'High Score';
  userInfo.append(topScore);
  topScore.append(topScoreHeader)
  topScore.append(topScoreParagraph)
  topScoreParagraph.classList.add('currTopScoreAmount')
  topScoreParagraph.innerHTML = currHighScore

  const level = document.createElement('div');
  const levelHeader = document.createElement('h4')
  const levelParagraph = document.createElement('p');

  level.classList.add('level');
  levelHeader.innerHTML = 'Level';
  userInfo.append(level);
  level.append(levelHeader)
  level.append(levelParagraph)
  levelParagraph.classList.add('currLevel')
  levelParagraph.innerHTML = currLevel
}


const addNewShape = () => {

  checkLines()
  currLoc = 4
  currRot = 0
  currShape = nextShape
  if (currShape === 'zshape' || currShape === 'sshape') {
    currLoc = 14
  }
  removeNextShape(nextShape)
  nextShape = createNextShape()
  gameOver()
  addShapeGrid()

}

//Creates a random shape

const createFirstShape = () => {

  const currShape = shapes[Math.floor(Math.random() * 7)]
  const array = eval(currShape)

  if ( currShape === ('zshape') ) { // Adds in Z Shape and S shape one row lower
    currLoc += width
  } else if (currShape === ('sshape')) {
    currLoc += width
  } 

  for (let i = 0; i < array.length; i++) {
    cells[array[currRot][i] + currLoc].classList.add(currShape) //This adds the currShape class to 4 of our divs in currLoc (<div class="cell">3</div> x 4)
  }
  return currShape
}


const createNextShape = () => {

  const nextShape = shapes[Math.floor(Math.random() * 7)]
  let nextShapeLoc = 24;
  const array = eval(nextShape)

  if (nextShape === 'zshape' || nextShape === 'sshape') {
    nextShapeLoc = 34
  }

  for (let i = 0; i < array.length; i++) {
    nextShapeCells[array[0][i] + nextShapeLoc].classList.add(nextShape) //This adds the currShape class to 4 of our divs in currLoc (<div class="cell">3</div> x 4)
  }
  return nextShape
  
}


const removeNextShape = (nextShape) => {

  let nextShapeLoc = 24;
  const array = eval(nextShape)

  if (nextShape === 'zshape' || nextShape === 'sshape') {
    nextShapeLoc = 34
  }
  for (let i = 0; i < array.length; i++) {
    nextShapeCells[array[0][i] + nextShapeLoc].classList.remove(nextShape) //remove the currShape class from the elements
  }
} 

const gameOver = () => {

  const shapeArr = [];
  if (currRot > 3) { // if our rotation is over 3, change to 0
    currRot = 0
  }
  const array = eval(currShape)

  for (let i = 0; i < array.length; i++) {
    const value = cells[array[currRot][i] + currLoc].classList.contains('full') //If they contain the class full, say true
    shapeArr.push(value);
  }
  const isTrue = (element) => element === true
  if (shapeArr.some(isTrue)) {
    isGameOver = 1

  }
}

const topScore = () => {
  if (currScore > currHighScore) {
    localStorage.setItem('highScore', currScore)
    currHighScore = JSON.parse(localStorage.getItem('highScore'))
    document.querySelector(".currTopScoreAmount").innerHTML = currHighScore
  }
}

const levelFunc = () => {

  switch (linesClearedTotal) {
    case 10:
      time = 600
      currLevel = 2
      break
    case 20:
      time = 500
      currLevel = 3
      break
    case 30:
      time = 300
      currLevel = 4
      break
    case 40:
      time = 150
      currLevel = 5
      break
    case 50:
      time = 125
      currLevel = 'Turbo'
      break

  }
  document.querySelector(".currLevel").innerHTML = currLevel
}

const removeShapeGrid = (currShape, currLoc, currRot, futLoc, futRot) => {
  
  const futShapeArr = [];
  const currShapeArr = []

  if (futRot > 3) { // if our rotation is over 3, change to 0
    futRot = 0
  }
  //testing takes place here whether it can be placed...

  const array = eval(currShape)

  for (let i = 0; i < array.length; i++) {
    const futValue = cells[array[futRot][i] + futLoc].classList.contains('full') // adding true or false to an array
    //console.log(cells[array[futRot][i] + futLoc]); //This returns the next div element using futLoc (<div class="cell">13</div>)
    futShapeArr.push(futValue); // Adds either true or false for each future element into the array
  }

  for (let i = 0; i < array.length; i++) {
    const currValue = cells[array[currRot][i] + currLoc  + width].classList.contains('full') // adding true or false to an array if the shape one line down is ok
    currShapeArr.push(currValue); // Adds either true or false for each future element into the array
  }


  const isTrue = (element) => element === true
  const isFalse = (element) => element === false

  //console.log(shapeArr);
  if (futShapeArr.some(isTrue) && currShapeArr.some(isTrue)) { //If any elements in futshapearr and currShapeArr are true - true meaning they have the 'full' class
    for (let i = 0; i < array.length; i++) {
      cells[array[currRot][i] + currLoc].classList.add('full') //Mark the current four elements as 'full'
    }
    addNewShape() //Then add a new shape
    
  } else if (futShapeArr.some(isTrue) && (currShapeArr.every(isFalse))) { //
    for (let i = 0; i < array.length; i++) {
      cells[array[currRot][i] + currLoc].classList.remove(currShape)
    }
    return false;

  } else {

    for (let i = 0; i < array.length; i++) {
      cells[array[currRot][i] + currLoc].classList.remove(currShape) //remove the currShape class from the elements
    }
    return true

  }
}


const addShapeGrid = () => {

  const array = eval(currShape)

  if (currRot > 3) { // if our rotation is over 3, change to 0
    currRot = 0
  }
  for (let i = 0; i < array.length; i++) {
    //console.log('2');
    cells[array[currRot][i] + currLoc].classList.add(currShape) //adds in shape in current location
  } 
}



function repeat() {
  if (isGameOver === 1) {
    console.log('gameover');
    cells.forEach(cell => {
      cell.classList.remove('full','ishape', 'jshape', 'oshape', 'lshape', 'zshape', 'tshape', 'sshape')
      cell.classList.add('gameOverCell')
    })
    const allCells = document.querySelectorAll('.cell')
    allCells.forEach(ele => {
      ele.remove()
    });
    gameOverMusic()
    const gameOverText = document.createElement('p')
    gameOverText.setAttribute('id','gameOverText')
    gameOverText.innerHTML = 'GAME OVER'
    grid.appendChild(gameOverText)
  } else {
    game();
    timer = setTimeout(repeat, time);
  }
}

const game =  () => {

  let rowPosition = currLoc % width
  let colPosition = Math.floor(currLoc / width)

  //Depending on rotation and the shape the if statement needs to be different, in place so that the shapes don't go past the bottom of the grid
  
  //if colposition is < 17,  is ishape and rotation 1 or 3 keep removing and creating
  if ((colPosition < height - 3) && (currShape === 'ishape') && (currRot === 1 || currRot === 3)) {
    removeShapeGrid(currShape, currLoc, currRot, currLoc += width, currRot) // currShape, currLoc, currRot, futLoc, futRot, last two are futureLoc and Rotations
    addShapeGrid()

  } else if ((colPosition < height - 2) && (currShape === 'lshape' || currShape === 'tshape' || currShape === 'jshape') && (currRot === 0 || currRot === 1 || currRot === 3)) {
    removeShapeGrid(currShape, currLoc, currRot, currLoc += width, currRot)
    addShapeGrid()

  } else if ((colPosition < height - 2) && (currShape === 'sshape' || currShape === 'zshape')  && 
              (currRot === 1 || currRot === 3)) {
    removeShapeGrid(currShape, currLoc, currRot, currLoc += width, currRot)
    addShapeGrid()

  } else if ((colPosition < height - 1) && (currShape === 'sshape' || currShape === 'zshape')  && 
      (currRot === 0 || currRot === 2)) {
    removeShapeGrid(currShape, currLoc, currRot, currLoc += width, currRot)
    addShapeGrid()

  } else if ((colPosition < height - 1) && (currShape === 'lshape' || currShape === 'jshape' || currShape === 'tshape') && (currRot === 2)) {
    removeShapeGrid(currShape, currLoc, currRot, currLoc += width, currRot)
    addShapeGrid()
  
  } else if (colPosition < height - 2 && currShape === 'oshape') {
    removeShapeGrid(currShape, currLoc, currRot, currLoc += width, currRot)
    addShapeGrid()

  } else if (colPosition < height - 1 && currShape === 'ishape' && (currRot === 0 || currRot === 2)) {
    removeShapeGrid(currShape, currLoc, currRot, currLoc += width, currRot)
    addShapeGrid()
  
  } else { //mark it as full and add new shape
    const array = eval(currShape)

    for (let i = 0; i < array.length; i++) {
      cells[array[currRot][i] + currLoc].classList.add('full')
    }

    addNewShape()

  }


  document.addEventListener('keydown', function (event) {

    if (down) return;
    down = true;

    const key = event.code

    rowPosition = currLoc % width
    colPosition = Math.floor(currLoc / width)

    //Arrowleft logic

    //If statements check that the move is allowed without going outside of the grid, removes, takes one from the currloc and recreates
    //if (!(cells[currloc - currShape[curRot][0]].classList.contains('full') 
  
    if (key === 'ArrowLeft' && rowPosition > 0 && (currShape === 'ishape') && (currRot === 1 || currRot === 3)) { 
      decision = removeShapeGrid(currShape, currLoc, currRot, currLoc - 1, currRot)
      console.log(`Here is my decision ${decision}`);
      if (decision === true) {
        currLoc -= 1
      } 
      addShapeGrid()

    } else if (key === 'ArrowLeft' && rowPosition > 0 && (currShape === 'lshape' || currShape === 'tshape' || currShape === 'jshape' ) && currRot === 3) {

      decision = removeShapeGrid(currShape, currLoc, currRot, currLoc - 1, currRot)
      if (decision === true) {
        currLoc -= 1
      } 
      addShapeGrid()

    } else if (key === 'ArrowLeft' && rowPosition > 0 && currShape === 'oshape') {

      decision = removeShapeGrid(currShape, currLoc, currRot, currLoc - 1, currRot)
      if (decision === true) {
        currLoc -= 1
      } 
      addShapeGrid()

    } else if (key === 'ArrowLeft' && rowPosition > 1) {

      decision = removeShapeGrid(currShape, currLoc, currRot, currLoc - 1, currRot)
      if (decision === true) {
        currLoc -= 1
      } 
      addShapeGrid()
    } 

    // ArrowRight
    //If statements check that the move is allowed without going outside of the grid, removes, adds one to the currloc and recreates


    if (key === 'ArrowRight' && rowPosition < 9 && currShape === 'ishape' && (currRot === 1 || currRot === 3)) {
      decision = removeShapeGrid(currShape, currLoc, currRot, currLoc + 1, currRot)
      if (decision === true) {
        currLoc += 1
      } 
      addShapeGrid() 

    } else if (key === 'ArrowRight' && rowPosition < 9 && (currShape === 'lshape' || currShape === 'tshape' || currShape === 'jshape') && currRot === 1) { // ! Right
      decision = removeShapeGrid(currShape, currLoc, currRot, currLoc + 1, currRot)
      if (decision === true) {
        currLoc += 1
      } 
      addShapeGrid() 
    } else if (key === 'ArrowRight' && rowPosition < 9 && (currShape === 'zshape' || currShape === 'sshape') && (currRot === 1 || currRot === 3)) { // ! Right
      decision = removeShapeGrid(currShape, currLoc, currRot, currLoc + 1, currRot)
      if (decision === true) {
        currLoc += 1
      } 
      addShapeGrid() 
    } else if (key === 'ArrowRight' && rowPosition < 7 && currShape === 'ishape' && (currRot === 0 || currRot === 2)) {
      decision = removeShapeGrid(currShape, currLoc, currRot, currLoc + 1, currRot)
      if (decision === true) {
        currLoc += 1
      } 
      addShapeGrid() 
    } else if (key === 'ArrowRight' && rowPosition < 8 && currShape !== 'ishape') {
      decision = removeShapeGrid(currShape, currLoc, currRot, currLoc + 1, currRot)
      if (decision === true) {
        currLoc += 1
      } 
      addShapeGrid() 
    } 
    
    //arrowdown logic

    //If statements check that the move is allowed without going outside of the grid, removes, adds width to the currloc and recreates

    if (key === 'ArrowDown' && (colPosition < height - 3) && (currShape === 'ishape') && (currRot === 1 || currRot === 3)) {
      removeShapeGrid(currShape, currLoc, currRot, currLoc += width, currRot)
      addShapeGrid()
  
    } else if (key === 'ArrowDown' && (colPosition < height - 2) && (currShape === 'lshape' || currShape === 'tshape' || currShape === 'jshape') && (currRot === 0 || currRot === 1 || currRot === 3)) {
      removeShapeGrid(currShape, currLoc, currRot, currLoc += width, currRot)
      addShapeGrid()
  
    } else if (key === 'ArrowDown' && (colPosition < height - 2) && (currShape === 'sshape' || currShape === 'zshape')  && 
                (currRot === 1 || currRot === 3)) {
      removeShapeGrid(currShape, currLoc, currRot, currLoc += width, currRot)
      addShapeGrid()
  
    } else if (key === 'ArrowDown' && (colPosition < height - 1) && (currShape === 'sshape' || currShape === 'zshape')  && 
        (currRot === 0 || currRot === 2)) {
      removeShapeGrid(currShape, currLoc, currRot, currLoc += width, currRot)
      addShapeGrid()
  
    } else if (key === 'ArrowDown' && (colPosition < height - 1) && (currShape === 'lshape' || currShape === 'jshape' || currShape === 'tshape') && (currRot === 2)) {
      removeShapeGrid(currShape, currLoc, currRot, currLoc += width, currRot)
      addShapeGrid()
    
    } else if (key === 'ArrowDown' && colPosition < height - 2 && currShape === 'oshape') {
      removeShapeGrid(currShape, currLoc, currRot, currLoc += width, currRot)
      addShapeGrid()
  
    } else if (key === 'ArrowDown' && colPosition < height - 1 && currShape === 'ishape' && (currRot === 0 || currRot === 2)) {
      removeShapeGrid(currShape, currLoc, currRot, currLoc += width, currRot)
      addShapeGrid()
    
    }

    // Rotation logic

    //If statements check that the rotation is allowed without going outside of the grid, removes, add one to the currrot and recreates
        
    if (key === 'ArrowUp' && rowPosition === 0 && currShape === 'ishape' && (currRot === 0 || currRot === 2)) { // ! Up
      decision = removeShapeGrid(currShape, currLoc, currRot, currLoc, currRot + 1)
      if (decision === true) {
        currRot += 1
        currLoc += 2 
      } 
      addShapeGrid()
    } else if (key === 'ArrowUp' && rowPosition === 0 && currShape === 'ishape' && (currRot === 1 || currRot === 3)) {

      decision = removeShapeGrid(currShape, currLoc, currRot, currLoc, currRot + 1)
      if (decision === true) {
        currRot += 1
        currLoc += 1 
      } 
      addShapeGrid()

    } else if (key === 'ArrowUp' && rowPosition === 8 && currShape === 'ishape' && (currRot === 1 || currRot === 3)) {
      decision = removeShapeGrid(currShape, currLoc, currRot, currLoc -= 1, currRot + 1)
      if (decision === true) {
        currRot += 1
        currLoc -= 1
      } 

      addShapeGrid()
    } else if (key === 'ArrowUp' && rowPosition === 9 && currShape === 'ishape' && (currRot === 1 || currRot === 3)) {
      decision = removeShapeGrid(currShape, currLoc, currRot, currLoc -= 2, currRot + 1)
      if (decision === true) {
        currRot += 1
        currLoc -= 2
      } 

      addShapeGrid()
    } else if (key === 'ArrowUp' && rowPosition === 0 && (currShape === 'tshape' || currShape === 'lshape' || currShape === 'jshape') && (currRot === 3)) {
      decision = removeShapeGrid(currShape, currLoc, currRot, currLoc += 1, currRot + 1)
      if (decision === true) {
        currRot += 1
        currLoc += 1
      } 
      addShapeGrid()
    } else if (key === 'ArrowUp' && rowPosition === 9 && (currShape === 'sshape' || currShape === 'zshape' || currShape === 'tshape' || currShape === 'lshape' || currShape === 'jshape') && (currRot === 1)) {
      decision = removeShapeGrid(currShape, currLoc, currRot, currLoc -= 1, currRot + 1)
      if (decision === true) {
        currRot += 1
        currLoc -= 1
      }
      addShapeGrid()
    } else if (key === 'ArrowUp' && rowPosition === 9 && (currShape === 'sshape' || currShape === 'zshape') && (currRot === 3)) {
      decision = removeShapeGrid(currShape, currLoc, currRot, currLoc -= 1, currRot + 1)
      if (decision === true) {
        currRot += 1
        currLoc -= 1
      }
      addShapeGrid()
    } else if (key === 'ArrowUp') {
      decision = removeShapeGrid(currShape, currLoc, currRot, currLoc, currRot + 1)
      if (decision === true) {
        currRot += 1
      }

      addShapeGrid()
    }
  }, false)

  document.addEventListener('keyup', function () {
    down = false;
  }, false);
}


const startGame = () => {

  createNextShapeDisplay()
  createScoreLevelLinesDisplay()

  startBtn.addEventListener('click', function () {
    music()
    createGrid()
    currShape = createFirstShape() //creates new shape
    nextShape = createNextShape()
    repeat()
  } )

}

//This runs on pressing the start button

//createGrid() // creates grid, just run once

startGame()



