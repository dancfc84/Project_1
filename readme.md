
## Overview

In my first project for the General Assembly Software Engineering Flex course, I was given the task of building an arcade game; I decided to choose Tetris.

## Brief

- Render a game in the browser
- Use JavaScript, CSS and HTML
- Use JavaScript for DOM manipulation
- Deploy the game using GitHub pages

## Game Requirements

- The game should stop if a Tetrimino fills the highest row of the game board
- The player should be able to rotate each Tetrimino around its own axis
- If a line is completed it should be removed and the pieces above should move down a row

## Technologies Used

- HTML
- CSS
- JavaScript (ES6)
- DOM
- Git
- GitHub Pages

## How the game works

- When the start button is pressed a 10 x 20 grid is created

- This entails the creation of 200 divs, a class is added to each of them to style the grid. Each cell is then added to an array called cells.

- A current score, a lines cleared count, a top score (stored in the browser using localstorage) and a display showing what level you are currently on is also created

- The Tetriminos were created by setting the axis point of the Tetrimino to zero and then the other three cells were created from that point. Each shape has four rotations

![Screenshot - game](https://github.com/dancfc84/Project_1/blob/master/screenshots/Picture%203.jpg)


- Before the game starts, I need to create two shapes, the first shape for the main grid and the other for the next shape.
  I used a setTimeout to move the Tetrimino down one row at a time, the speed of the intervals between movements vary depending on the level you are on 

- The Tetrimino is added to the grid by assigning the specific class of the current shape to the appropriate cells in relation to its current location.

- The shape is removed from the grid (class removed from those cells) and re-added one row below (class added to the new cells)

- If arrowleft, arrowright or arrowdown are pressed the Tetrimino will move in the direction pressed on the keyboard

- If arrowUp is pressed one will be added to the current rotation of the shape and the next entry in the shapes array will be used to add the class back to the cells

- Everytime a shape is removed or rotated, there are checks to see whether the future position of the Tetrimino is allowed. If the future move cannot be made, the current cells are marked as full and a new shape is created. If the shape can‘t move right or left or be rotated but can be moved down it continues its descent down the grid.

### Challenge 1 - Removing Shapes and Re-adding them, checking whether the future move is possible

- This function receives several arguments, including the current shape, location and rotation and also what the future location will be (for example, if the user presses the    left arrow key, this will be the currLoc - 1)
- The function then finds the four future cells and iterates through them, checking whether the cells for the future location of the shape contain the "full" class
- It then finds the cells for the current location but one row down and iterates through the four cells to see whether they contain the "full" class
- If both the future shape array and the current shape one row down array have any cells with the full class, it marks the current cells as full and adds a new shape
- If that is not the case,  it will check if the move left or right or a rotation is possible, if possible,  it will allow that move and also move the Tetrimino down a row, if the move is not possible, it will just move the Tetrimino down one row anf ignore the key press.


![Screenshot - game](https://github.com/dancfc84/Project_1/blob/master/screenshots/Picture%204.jpg)

![Screenshot - game](https://github.com/dancfc84/Project_1/blob/master/screenshots/Picture%205.jpg)


### Challenge 2 - Line Completion

- I split the cells array into chunks of 10 which signifies a line in my grid, then a for loop iterates through each row of the chunks of 10 cells, if all the cells contain the class ‘full’ the row of cells are removed from the array and the line of divs are removed from the grid.

- I then used unshift to add the cells back to the array and then prepend to add the divs back to the grid at the top.
 
![Screenshot - game](https://github.com/dancfc84/Project_1/blob/master/screenshots/Picture%206.jpg)

- Everytime a line is removed the score and lines cleared are updated. If you get the top score this is updated as soon as you surpass it. The current level is linked to how many rows you have cleared.

- When a piece is spawned at the top of the grid which overlaps another piece the game ends


## Screenshots of Final Product

![Screenshot - game](https://github.com/dancfc84/Project_1/blob/master/screenshots/Picture%201.jpg)

![Screenshot - game](https://github.com/dancfc84/Project_1/blob/master/screenshots/Picture%202.jpg)
