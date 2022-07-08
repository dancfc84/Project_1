

##Overview##

In my first project for the General Assembly Software Engineering Flex course, I was given the task of building an arcade game; I decided to choose Tetris.

##Brief##

- Render a game in the browser
- Use JavaScript, CSS and HTML
- Use JavaScript for DOM manipulation
- Deploy the game using GitHub pages

##Game Requirements##

- The game should stop if a Tetrimino fills the highest row of the game board
- The player should be able to rotate each Tetrimino around its own axis
- If a line is completed it should be removed and the pieces above should move down a row

##Technologies Used##

- HTML
- CSS
- JavaScript (ES6)
- Git
- GitHub Pages

##How the game works##

- When a start button is pressed a 10 x 20 grid is created
- This entails the creation of 200 divs, a class is added to them to style the grid. Each cell is then added to an array called cells.
- I also created a score, lines cleared count, stored the top score in the browser using localstorage and a display showing what level you are currently on

- The Tetriminos were created by setting the axis point of the Tetrimino to zero and then created the other three cells from that point. Each shape has four rotations

```
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

```

- Before the game starts, I need to create two shapes, the first shape for the main grid and the other for the next shape.
I used a setTimeout to move the Tetrimino one row at a time, the speed of the intervals between movements vary depending on the level you are on
The Tetrimino is added to the grid by assigning the specific class of the shape to the appropriate cells in relation to its current location, for example, ‘jshape’
Everytime the setTimeout method completes a cycle the shape is removed from the grid (class removed from those cells) and re-added one row below (class added to the new cells)
If arrowleft, arrowright or arrowdown are pressed the Tetrimino will move in the direction pressed on the keyboard, using the same method as stated above.
If arrowUp is pressed one will be added to the current rotation of the shape and the next entry in the shapes array will be used to add the class to the cells
Everytime a shape is removed, there are checks to see whether the future position of the Tetrimino is allowed and whether the current position, but one row down is allowed. If both of these checks find any cells with the full class we mark the current Tetriminos as full and create a new shape. If the shape can‘t move right or left or be rotated but can be moved down it continues its descent down the grid.

 ```
const removeShapeGrid = (currShape, currLoc, currRot, futLoc, futRot) => {
  
  const futShapeArr = [];
  const currShapeArr = []

  if (futRot > 3) { // if our rotation is over 3, change to 0
    futRot = 0
  }

  //testing takes place here regarding whether its future self can be placed...

  const array = eval(currShape)

  for (let i = 0; i < array.length; i++) {
    const futValue = cells[array[futRot][i] + futLoc].classList.contains('full') // adding true or false to an array for our future rotation
    futShapeArr.push(futValue); // Adds either true or false for each future element into the array
  }

  for (let i = 0; i < array.length; i++) {
    const currValue = cells[array[currRot][i] + currLoc  + width].classList.contains('full') // adding true or false to an array if the shape one line down is ok
    currShapeArr.push(currValue); // Adds either true or false for each future element into the array
  }

  const isTrue = (element) => element === true
  const isFalse = (element) => element === false

  if (futShapeArr.some(isTrue) && currShapeArr.some(isTrue)) { //If any elements in futshapearr and currShapeArr are true - true meaning they have the 'full' class
    for (let i = 0; i < array.length; i++) {
      cells[array[currRot][i] + currLoc].classList.add('full') //Mark the current four elements as 'full'
    }
    addNewShape() //add a new shape, create a new next shape
    
  } else {

    for (let i = 0; i < array.length; i++) {
      cells[array[currRot][i] + currLoc].classList.remove(currShape)
    }
    return (futShapeArr.some(isTrue) && (currShapeArr.every(isFalse)) ? false : true //return false if fut shape loc has full cells and curr shape but one down has no full
    )
  }
}

 ```


When the shape reaches the bottom of the grid or can’t move down past another Te
trimino the class ‘full’ is added to the cell and a new shape created.
Line Completion
I split the cells array into chunks of 10 which signifies a line in my grid, then a for loop iterates through each row of the chunks of 10 cells, if all the cells contain the class ‘full’ the row of cells are removed from the array and the line of divs are removed from the grid. I then used unshift to add the cells back to the array and then prepend to add the divs back to the grid at the top.
 

```
const checkLines = () => {
  const chunk = 10;
  let tempArray = [];
  let lineCheck = [];
  let linesCleared = 0;
  let rowNum = -1;
  const isFalse = (element) => element === false
  for (let i = 0; i < cells.length; i += chunk) {
    tempArray = cells.slice(i, i + chunk) //Temparray splits all the cells into blocks of 10 and puts them in temparray
    rowNum += 1;

    for (let i = 0; i < tempArray.length; i++) {
      const value = tempArray[i].classList.contains('full'); // Returns a true or false value depending on whether the full class added to any of the cells
      lineCheck.push(value) // adds it to lineCheck array

    }
    if (lineCheck.some(isFalse)) { //If any are false do nothing
      console.log('false');

    } else { // if true splice out the cells of the array
      cells.splice(rowNum * 10, 10)
      linesCleared += 1
      linesClearedTotal += 1 // This needs resetting on game over!!!
      clearSound()
      tempArray.forEach(cell => {
        
        cell.remove() //removes the cell one by one
        const newCell = document.createElement('div')
        newCell.classList.add('cell')
        //adds the new cells to both the grid and the cells array
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

```

Score/Level/Top Score/LinesCleared
Everytime a line is removed the score, and lines cleared is updated. If you get the top score this is updated as soon as you surpass it. The level is linked to how many rows you have cleared.

##Screenshots Final Product##


![Screenshot - game](https://github.com/dancfc84/Project_1/blob/master/screenshots/Picture%201.jpg)