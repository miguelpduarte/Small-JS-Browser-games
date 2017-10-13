/*
 ██████   █████  ███    ███ ███████      ██████  ██████  ███    ██ ███████ ████████  █████  ███    ██ ████████ ███████
██       ██   ██ ████  ████ ██          ██      ██    ██ ████   ██ ██         ██    ██   ██ ████   ██    ██    ██
██   ███ ███████ ██ ████ ██ █████       ██      ██    ██ ██ ██  ██ ███████    ██    ███████ ██ ██  ██    ██    ███████
██    ██ ██   ██ ██  ██  ██ ██          ██      ██    ██ ██  ██ ██      ██    ██    ██   ██ ██  ██ ██    ██         ██
 ██████  ██   ██ ██      ██ ███████      ██████  ██████  ██   ████ ███████    ██    ██   ██ ██   ████    ██    ███████
*/

var BLOCKPADDINGPX = 18;
var BLOCKHEIGHT = 18;
var BLOCKWIDTH = 18;
var GAMEHEIGHTBLOCKS = 32;
var GAMEHEIGHT = GAMEHEIGHTBLOCKS * BLOCKHEIGHT;
var GAMEWIDTHBLOCKS = 15;
var GAMEWIDTH = GAMEWIDTHBLOCKS * BLOCKWIDTH;
var GAMEMIDDLE = Math.floor(GAMEWIDTHBLOCKS / 2) * BLOCKWIDTH;
var DROPTIME_SECS = 1;


/*
 ██████  █████  ███    ██ ██    ██  █████  ███████
██      ██   ██ ████   ██ ██    ██ ██   ██ ██
██      ███████ ██ ██  ██ ██    ██ ███████ ███████
██      ██   ██ ██  ██ ██  ██  ██  ██   ██      ██
 ██████ ██   ██ ██   ████   ████   ██   ██ ███████
*/

//Getting the canvas context to draw on
var canvas = document.getElementById("myCanvas");
//Chaning canvas size to match game requirements
canvas.height = GAMEHEIGHT;
canvas.width = GAMEWIDTH;
var ctx = canvas.getContext("2d");

/*
 ██████   █████  ███    ███ ███████      ██████  ██████  ███    ██ ███████ ██  ██████      ██    ██  █████  ██████  ███████
██       ██   ██ ████  ████ ██          ██      ██    ██ ████   ██ ██      ██ ██           ██    ██ ██   ██ ██   ██ ██
██   ███ ███████ ██ ████ ██ █████       ██      ██    ██ ██ ██  ██ █████   ██ ██   ███     ██    ██ ███████ ██████  ███████
██    ██ ██   ██ ██  ██  ██ ██          ██      ██    ██ ██  ██ ██ ██      ██ ██    ██      ██  ██  ██   ██ ██   ██      ██
 ██████  ██   ██ ██      ██ ███████      ██████  ██████  ██   ████ ██      ██  ██████        ████   ██   ██ ██   ██ ███████
*/

var score = 0;
var gamePaused = false;
//The var to use with setInterval and clearInterval, for dropping TPieces
var dropTPieces_intervalID;
////Block holding and config vars
//Array that will store the pieces as they drop
var currentTPiece = [];
//Array that holds the several sets of positions that make the different shapes
var TPieceTypes = [
	[new Position(0, 0), new Position(1, 0), new Position(1, 1), new Position(0, 1)], //square (O-block)
	[new Position(0, 0), new Position(1, 0), new Position(1, 1), new Position(2, 1)], //Z-block
	[new Position(0, 0), new Position(0, 1), new Position(-1, 1), new Position(1, 1)], //T-block
	[new Position(0, 0), new Position(1, 0), new Position(0, 1), new Position(-1, 1)], //S-block
	[new Position(0, 0), new Position(0, 1), new Position(1, 1), new Position(2, 1)], //J-block
	[new Position(0, 0), new Position(-2, 1), new Position(-1, 1), new Position(0, 1)], //L-block
	[new Position(0, 3), new Position(0, 2), new Position(0, 1), new Position(0, 0)] //I-block (vertical with 2 above canvas)
	];
//Map that holds the blocks after they have fallen
var blockMap = new Map();

//IDEA: Move to inside init ?
//Generating an empty blockMap to eventually hold the dropped absBlock
for (var i = 0; i < GAMEWIDTHBLOCKS; i++) {
  blockMap.set(i, new Map());
  for (var j = 0; j < GAMEHEIGHTBLOCKS; j++) {
    //Initializing with a 0 to make comparisons easier to know if there is an item there or not
    blockMap.get(i).set(j, 0);
  }
}

/*
██   ██ ███████ ██    ██     ██ ███    ██ ██████  ██    ██ ████████     ██   ██  █████  ███    ██ ██████  ██      ██ ███    ██  ██████
██  ██  ██       ██  ██      ██ ████   ██ ██   ██ ██    ██    ██        ██   ██ ██   ██ ████   ██ ██   ██ ██      ██ ████   ██ ██
█████   █████     ████       ██ ██ ██  ██ ██████  ██    ██    ██        ███████ ███████ ██ ██  ██ ██   ██ ██      ██ ██ ██  ██ ██   ███
██  ██  ██         ██        ██ ██  ██ ██ ██      ██    ██    ██        ██   ██ ██   ██ ██  ██ ██ ██   ██ ██      ██ ██  ██ ██ ██    ██
██   ██ ███████    ██        ██ ██   ████ ██       ██████     ██        ██   ██ ██   ██ ██   ████ ██████  ███████ ██ ██   ████  ██████
*/

//var upPressed = false;
//var downPressed = false;
//var leftPressed = false;
//var rightPressed = false;
var wPressed = false;
var sPressed = false;

var gamePaused = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
  //Escape
  if (e.keyCode == 27) {
    //pause game
    gamePaused = !gamePaused;
  }

  //Spacebar
  if (e.keyCode == 32) {
    hardDrop();
  }

  //Up arrow
  if (e.keyCode == 38) {
    rotateTPiecesCW();
  }
  //Down arrow
  else if (e.keyCode == 40) {
    //TODO: To decide if going to be done with bool or just for each keypress (aka while down)
    //NOTE: If going to do that don't forget to uncomment the necessary tidbits
    //downPressed = true;
    softDrop();
  }
  //Left arrow
  else if (e.keyCode == 37) {
    shiftTPiecesLeft();
  }
  //Right arrow
  else if (e.keyCode == 39) {
    shiftTPiecesRight();
  }
  //W
  else if (e.keyCode == 87) {
    wPressed = true;
  }
  //S
  else if (e.keyCode == 83) {
    sPressed = true;
  }
}

function keyUpHandler(e) {
  //Up arrow
  if (e.keyCode == 38) {
    //Unnecessary, for each press rotate instead
    //upPressed = false;
  }
  //Down arrow
  else if (e.keyCode == 40) {
    //downPressed = false;
  }
  //Left arrow
  else if (e.KeyCode == 37) {
    //leftPressed = false;
  }
  //Right arrow
  else if (e.keyCode == 39) {
    //rightPressed = false;
  }
  //W
  else if (e.keyCode == 87) {
    wPressed = false;
  }
  //S
  else if (e.keyCode == 83) {
    sPressed = false;
  }
}

/*
 ██████  ██████       ██ ███████  ██████ ████████ ███████
██    ██ ██   ██      ██ ██      ██         ██    ██
██    ██ ██████       ██ █████   ██         ██    ███████
██    ██ ██   ██ ██   ██ ██      ██         ██         ██
 ██████  ██████   █████  ███████  ██████    ██    ███████
*/

//Color is an object with the 3 color components for the piece (r,g,b)
function Color(r, g, b) {
  this.r = r;
  this.g = g;
  this.b = b;
}

//relBlock is a block with relative positions, in relation to the block center (relX, relY)
function relBlock(relX, relY) {
  this.relX = relX;
  this.relY = relY;
}

//absBlock is a block and its absolute positions and color (to ease moving to backdrop)
//absX, absY, color
function absBlock(absX, absY, color) {
  this.absX = absX;
  this.absY = absY;
  this.color = color;
}

//For use in the input for creating a TPiece
function Position(x, y) {
  this.x = x;
  this.y = y;
}

//Properties:
//color : piece color
//blocks : array of relBlocks
//centerX : center X position (abs)
//centerY : center Y position (abs)
//rotateCW() : rotates piece clockwise
//rotateCCW() : rotates piece counterclockwise
function TPiece(color, relpositions) {
  this.color = color;
  this.blocks = [];

  for (var i = 0; i < relpositions.length; i++) {
    this.blocks.push(new relBlock(relpositions[i].x, relpositions[i].y));
  }

  this.centerX = GAMEMIDDLE;
  this.centerY = 0;

	//In case the block is rotating out of the game screen, rotation kick
  this.kicks = function() {

		var blocks = TPiecetoabsBlocks(this);

    for (var i = 0; i < blocks.length; i++) {
			var blockXinBlocks = Math.floor(blocks[i].absX / BLOCKWIDTH);
			//var blockYinBlocks = Math.floor(this.blocks[i].absY / BLOCKHEIGHT);

      while (1) {
        //Block exits from the screen right, kick 1 block left
        if (blockXinBlocks >= GAMEWIDTHBLOCKS) {
					//Moving the TPiece
          this.centerX -= BLOCKWIDTH;
					//Updating the var for further comparisons
					blockXinBlocks--;
					//To check again for other conditions
          continue;
        }

        //Block exits from the screen left, kick 1 block right
        if (blockXinBlocks < 0) {
					//Moving the TPiece
          this.centerX += BLOCKWIDTH;
					//Updating the var for further comparisons
					blockXinBlocks++;
					//To check again for other conditions
					continue;
        }

				//TODO: floor kicks


				//If no test is run, no kicks are to be done anymore, break the loop
				break;
      }

    }
  };

  this.rotateCW = function() {

    //rotating CW is x = -y and y = x

    for (var i = 0; i < this.blocks.length; i++) {
      var oldX = currentTPiece.blocks[i].relX;
      this.blocks[i].relX = -this.blocks[i].relY;
      this.blocks[i].relY = oldX;
    }

		//Checking and executing floor and wall kicks
		this.kicks();
  };

  this.rotateCCW = function() {

    //Simillarly, rotating CCW is x = y and y = -x

    for (var i = 0; i < this.blocks.length; i++) {
      var oldX = currentTPiece.blocks[i].relX;
      this.blocks[i].relX = this.blocks[i].relY;
      this.blocks[i].relY = -oldX;
    }

		//Checking and executing floor and wall kicks
		this.kicks();
  };
}

/*
██   ██ ███████ ██      ██████  ███████ ██████      ███████ ██    ██ ███    ██  ██████ ████████ ██  ██████  ███    ██ ███████
██   ██ ██      ██      ██   ██ ██      ██   ██     ██      ██    ██ ████   ██ ██         ██    ██ ██    ██ ████   ██ ██
███████ █████   ██      ██████  █████   ██████      █████   ██    ██ ██ ██  ██ ██         ██    ██ ██    ██ ██ ██  ██ ███████
██   ██ ██      ██      ██      ██      ██   ██     ██      ██    ██ ██  ██ ██ ██         ██    ██ ██    ██ ██  ██ ██      ██
██   ██ ███████ ███████ ██      ███████ ██   ██     ██       ██████  ██   ████  ██████    ██    ██  ██████  ██   ████ ███████
*/

function TPiecetoabsBlocks(tpiece) {
  var absBlocks = [];

  for (var i = 0; i < tpiece.blocks.length; i++) {
    absBlocks.push(new absBlock(tpiece.centerX + tpiece.blocks[i].relX * BLOCKPADDINGPX, tpiece.centerY + tpiece.blocks[i].relY * BLOCKPADDINGPX, tpiece.color));
  }

  return absBlocks;
}

function absBlockstoBackground(blocks) {

  var blockXinBlocks;
  var blockYinBlocks;

  for (var i = 0; i < blocks.length; i++) {
    blockXinBlocks = blocks[i].absX / BLOCKWIDTH;
    blockYinBlocks = blocks[i].absY / BLOCKHEIGHT;
    blockMap.get(blockXinBlocks).set(blockYinBlocks, blocks[i]);
  }

}

//Generates a random TPiece at the middle top of the game screen
function generateRandomTPiece() {
  currentTPiece = new TPiece(new Color(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)), TPieceTypes[Math.floor(Math.random() * TPieceTypes.length)]);
}

/*
 ██████  ██████  ██      ██      ██ ███████ ██  ██████  ███    ██      █████  ███    ██ ██████      ███    ███  ██████  ██    ██ ███████ ███    ███ ███████ ███    ██ ████████
██      ██    ██ ██      ██      ██ ██      ██ ██    ██ ████   ██     ██   ██ ████   ██ ██   ██     ████  ████ ██    ██ ██    ██ ██      ████  ████ ██      ████   ██    ██
██      ██    ██ ██      ██      ██ ███████ ██ ██    ██ ██ ██  ██     ███████ ██ ██  ██ ██   ██     ██ ████ ██ ██    ██ ██    ██ █████   ██ ████ ██ █████   ██ ██  ██    ██
██      ██    ██ ██      ██      ██      ██ ██ ██    ██ ██  ██ ██     ██   ██ ██  ██ ██ ██   ██     ██  ██  ██ ██    ██  ██  ██  ██      ██  ██  ██ ██      ██  ██ ██    ██
 ██████  ██████  ███████ ███████ ██ ███████ ██  ██████  ██   ████     ██   ██ ██   ████ ██████      ██      ██  ██████    ████   ███████ ██      ██ ███████ ██   ████    ██
*/

function hardDrop() {
  while (true) {

    var blocks = TPiecetoabsBlocks(currentTPiece);

    if (checkIfTPieceDoesntHitBottom(blocks) && checkIfTPieceDoesntHitBlocks(blocks)) {
      //If the piece doesn't hit the bottom, then lower it
      currentTPiece.centerY += BLOCKHEIGHT;
    } else {
      //TPiece has hit blocks or bottom, so:
      //Put the blocks into the "background"
      absBlockstoBackground(blocks);
      //Drop new random TPiece (also deletes current TPiece)
      generateRandomTPiece();
      //breaks the loop to stop further dropping
      break;
    }

  }
}

function softDrop() {
  dropTPieces();
}

//true means it doesn't hit blocks
function checkIfTPieceDoesntHitBlocks(absBlocks) {
  var blockXinBlocks;
  var blockYinBlocks;

  for (var i = 0; i < absBlocks.length; i++) {
    //Calculating the block x and y in blocks instead of pixels
    blockXinBlocks = absBlocks[i].absX / BLOCKWIDTH;
    blockYinBlocks = absBlocks[i].absY / BLOCKHEIGHT;

    //Checking if there is a background block on the block below using the blockMap
    if (blockMap.get(blockXinBlocks).get(blockYinBlocks + 1) != 0) {
      //If it is different than 0, there is a block there!
      //Thus, return false since we will hit a block
      return false;
    }
  }

  //No block that will drop will hit any background block, thus we can drop
  return true;
}

//true means it doesn't hit bottom
function checkIfTPieceDoesntHitBottom(absBlocks) {
  for (var i = 0; i < absBlocks.length; i++) {
    if (absBlocks[i].absY + BLOCKHEIGHT >= GAMEHEIGHT)
      return false;
  }

  return true;
}

function dropTPieces() {

  var blocks = TPiecetoabsBlocks(currentTPiece);

  if (checkIfTPieceDoesntHitBottom(blocks) && checkIfTPieceDoesntHitBlocks(blocks)) {
    //If the piece doesn't hit the bottom, then lower it
    currentTPiece.centerY += BLOCKHEIGHT;
  } else {
    //TPiece has hit blocks or bottom, so:
    //Put the blocks into the "background"
    absBlockstoBackground(blocks);
    //Drop new random TPiece (also deletes current TPiece)
    generateRandomTPiece();
  }
}

function rotateTPiecesCW() {
  currentTPiece.rotateCW();
}

function rotateTPiecesCCW() {
  currentTPiece.rotateCCW();
}

function checkIfTPieceDoesntHitRight(absBlocks) {
  for (var i = 0; i < absBlocks.length; i++) {
    if (absBlocks[i].absX + BLOCKWIDTH >= GAMEWIDTH)
      return false;
  }

  return true;
}

function shiftTPiecesRight() {
  var blocks = TPiecetoabsBlocks(currentTPiece);

  if (checkIfTPieceDoesntHitRight(blocks)) {
    //If the piece doesn't hit the right, then shift it
    currentTPiece.centerX += BLOCKWIDTH;
  }
}

function checkIfTPieceDoesntHitLeft(absBlocks) {
  for (var i = 0; i < absBlocks.length; i++) {
    if (absBlocks[i].absX - BLOCKWIDTH < 0)
      return false;
  }

  return true;
}

function shiftTPiecesLeft() {

  var blocks = TPiecetoabsBlocks(currentTPiece);

  if (checkIfTPieceDoesntHitLeft(blocks)) {
    //If the piece doesn't hit the left, then shift it
    currentTPiece.centerX -= BLOCKWIDTH;
  }
}

/*
██████  ██████   █████  ██     ██ ██ ███    ██  ██████
██   ██ ██   ██ ██   ██ ██     ██ ██ ████   ██ ██
██   ██ ██████  ███████ ██  █  ██ ██ ██ ██  ██ ██   ███
██   ██ ██   ██ ██   ██ ██ ███ ██ ██ ██  ██ ██ ██    ██
██████  ██   ██ ██   ██  ███ ███  ██ ██   ████  ██████
*/

function drawAbsBlock(block) {
  //Block itself
  ctx.beginPath();
  ctx.rect(block.absX, block.absY, BLOCKWIDTH, BLOCKHEIGHT);
  ctx.fillStyle = "rgba(" + block.color.r + ", " + block.color.g + ", " + block.color.b + ", " + "1.0)";
  ctx.fill();
  ctx.closePath();
  //Inner outline
  ctx.strokeRect(block.absX, block.absY, BLOCKWIDTH, BLOCKHEIGHT);
}

function drawTPiece(tpiece) {
  var blocks = TPiecetoabsBlocks(tpiece);

  for (var i = 0; i < blocks.length; i++) {
    drawAbsBlock(blocks[i]);
  }
}

function drawBackground() {
  for (var i = 0; i < GAMEWIDTHBLOCKS; i++) {
    for (var j = 0; j < GAMEHEIGHTBLOCKS; j++) {
      if (blockMap.get(i).get(j) != 0) {
        drawAbsBlock(blockMap.get(i).get(j));
      }
    }
  }
}

//draw stuff here
function draw() {
  //Clearing the screen
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //Drawing the piece that is currently dropping
  drawTPiece(currentTPiece);

  //drawPause(); //TODO

  //drawing the dropped pieces
  drawBackground();

  //Makes it so that the draw function is called whenever necessary - makes it so that there is no need to rely on a setInterval function
  requestAnimationFrame(draw);
}

/*
 ██████  ████████ ██   ██ ███████ ██████
██    ██    ██    ██   ██ ██      ██   ██
██    ██    ██    ███████ █████   ██████
██    ██    ██    ██   ██ ██      ██   ██
 ██████     ██    ██   ██ ███████ ██   ██
*/

function init() {
  //Setting the page title
  document.title = 'Tetris Clone!';

  //Getting the first piece to start the game
  generateRandomTPiece();

  //Getting the dropping to happen
  //Also storing the id in a global variable, so that it can be interrupted with clearInterval
  dropTPieces_intervalID = setInterval(dropTPieces, 1000 * DROPTIME_SECS);

  //Starting the drawing of the game - requestAnimationFrame is used inside draw so it doesn't need to be called repeatedly
  draw();
}

//Calling init so that the game actually starts
init();

//MIGHT BE NEEDED FOR DEBUG AGAIN
/*

//Paints all the centers white
function centerWhiteHighlighter(){
	for(var i = 0; i < currentTPiece.blocks.length; i++){
		if(currentTPiece.blocks[i].relX == 0 && currentTPiece.blocks[i].relY == 0){
			//Is center piece, paint white
			currentTPiece.blocks[i].color = new Color(255,255,255);
		}
	}
}
*/
