/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Game{
  constructor(height, width){
    //initialize the size of the board
    this.height = height;
    this.width = width;
    //bool that switches false when the start button is clicked and true again when a player wins
    this.gameOver = true;
    //create two player objects that Game will switch between
    this.player1 = new Player(document.getElementById("player1").value, 1);
    this.player2 = new Player(document.getElementById("player2").value, 2);
    //update the style sheet to match the new player colors
    this.updateColors();
    this.currPlayer = this.player1;// active player: 1 or 2
    this.board = [];// array of rows, each row is array of cells  (board[y][x])
    //make the board in JavaScript and render it in HTML
    this.makeBoard();
    this.makeHtmlBoard();
  }

  updateColors(){
    for(let rule of document.styleSheets[0].cssRules){
      //console.log(rule);
      //update the css sheet based on the current player colors
      if(rule.selectorText === ".piece.p1") 
        rule.style.setProperty("background-color",this.player1.color);
      if(rule.selectorText === ".piece.p2") 
        rule.style.setProperty("background-color",this.player2.color);
      
    }
  }
  /** makeBoard: create in-JS board structure:
   *   board = array of rows, each row is array of cells  (board[y][x])
   */

  makeBoard() {
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */
  
  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  /** handleClick: handle click of column top to play piece */
  
  handleClick(evt) {
    // get x from ID of clicked cell
    const x = +evt.target.id;
  
    // get next spot in column (if none or if the game is over, ignore click)
    
    const y = this.findSpotForCol(x);
    if (y === null || this.gameOver) {
      return;
    }
  
    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);
    
    // check for win
    if (this.checkForWin()) {
      return this.endGame(`Player ${this.currPlayer.num} won!`);
    }
    
    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }
      
    // switch players
    this.currPlayer = this.currPlayer === this.player1 ? this.player2 : this.player1;
  }
  /** handleReset: Resets gameboard and gameover variables for a fresh game */
  handleReset(e){
    this.gameOver = false;//signals that the game can begin
    this.currPlayer = this.player1;// active player: 1 or 2
    this.board = [];// array of rows, each row is array of cells  (board[y][x])
    this.updateColors();//update colors if they were changed
    //make the board in JavaScript and render it in HTML
    this.makeBoard();
    this.makeHtmlBoard();
  }

  /** handColors: gets the colors from the UI and puts them in the player objects */
  handleColors(e){
    e.preventDefault();
    this.player1.color = document.getElementById("player1").value;
    this.player2.color = document.getElementById("player2").value;
  }
  /** makeHtmlBoard: make HTML table and row of column tops with a start/reset button under */
  makeHtmlBoard() {
    //attatch reset functionality to the reset button
    document.getElementById('reset').addEventListener('click', this.handleReset.bind(this));
    //attatch color changing functionality to the player color button
    document.getElementById("players").addEventListener('submit',this.handleColors.bind(this));

    const board = document.getElementById('board');
    //clear the old board to make room for the fresh one
    board.innerHTML = "";
  
    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', this.handleClick.bind(this));
  
    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }
  
    board.append(top);
  
    // make main part of board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');
  
      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }
  
      board.append(row);
    }
  }

  /** placeInTable: update DOM to place piece into HTML table of board */
  
  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.classList.add(`p${this.currPlayer.num}`);
    //piece.style.backgroundColor = this.currPlayer.color;
    piece.style.top = -50 * (y + 2);
  
    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  /** endGame: announce game end and switches the gameover bool*/
  endGame(msg) {
    this.gameOver = true;
    alert(msg);
  }
  /** checkForWin: check board cell-by-cell for "does a win start here?" */
  
  checkForWin() {
    
    function _win(cells) {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer
      
      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );
    }
    //bind the _win function to the greater Game context
    _win = _win.bind(this);
  
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
  
        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
}

class Player{
  constructor(color, num){
    this.color = color;
    this.num = num;
  }
}

new Game(6, 7);






