//Game constants
var GAMEHEIGHT = 800; // 32 * 25
var GAMEWIDTH = 425; // 17 * 25
var GAMEMIDDLE = 200; // Hardcoded so that the blocks would correctly "snap" to the grid (8 or 9 * 25)
var BLOCKPADDINGPX = 25;
var BLOCKHEIGHT = 25;
var BLOCKWIDTH = 25;
var DROPTIME_SECS = 1;

//Getting the canvas context to draw on
var canvas = document.getElementById("myCanvas");
//Chaning canvas size to match game requirements
canvas.height = GAMEHEIGHT;
canvas.width = GAMEWIDTH;
var ctx = canvas.getContext("2d");

////General game config vars
var score = 0;
var gamePaused = false;
//the height of the game grid, in blocks
var gamegridHeight = 32;
//the width of the game grid, in blocks
var gamegridWidth = 17;
////Block holding and config vars
//Array that will store the pieces as they drop
var TPieceArr = [];
//Array that holds the several sets of positions that make the different shapes
var TPieceTypes = [
	[new Position(0,0), new Position(1,0), new Position(1,1), new Position(0,1)], //square (O-block)
	[new Position(0,0), new Position(1,0), new Position(1,1), new Position(2,1)], //Z-block
	[new Position(0,0), new Position(0,1), new Position(-1,1), new Position(1,1)], //T-block
	[new Position(0,0), new Position(1,0), new Position(0,1), new Position(-1,1)], //S-block
	[new Position(0,0), new Position(0,1), new Position(1,1), new Position(2,1)], //J-block
	[new Position(0,0), new Position(-2,1), new Position(-1,1), new Position(0,1)], //L-block
	[new Position(0,-2), new Position(0,-1), new Position(0,0), new Position(0,1)] //I-block (vertical with 2 above canvas)
	];

////Keys

//var upPressed = false;
var downPressed = false;
//var leftPressed = false;
//var rightPressed = false;
var wPressed = false;
var sPressed = false;

var gamePaused = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
	//Escape
	if(e.keyCode == 27){
		//pause game
		gamePaused = !gamePaused;
	}

	//Up arrow
    if(e.keyCode == 38) {
    	rotateTPiecesCW();
	}
	//Down arrow
	else if(e.keyCode == 40) {
        downPressed = true;
    }
    //Left arrow
    else if(e.keyCode == 37){
    	shiftTPiecesLeft();
    }
    //Right arrow
    else if(e.keyCode == 39){
    	shiftTPiecesRight();
    }
    //W
    else if(e.keyCode == 87){
    	wPressed = true;
    }
    //S
    else if(e.keyCode == 83){
    	sPressed = true;
    }
}

function keyUpHandler(e) {
	//Up arrow
    if(e.keyCode == 38) {
    	//upPressed = false;
	}
	//Down arrow
	else if(e.keyCode == 40) {
        downPressed = false;
    }
    //Left arrow
    else if(e.KeyCode == 37){
    	//leftPressed = false;
    }
    //Right arrow
    else if(e.keyCode == 39){
    	//rightPressed = false;
    }
    //W
    else if(e.keyCode == 87){
    	wPressed = false;
    }
    //S
    else if(e.keyCode == 83){
    	sPressed = false;
    }
}

//Color is an object with the 3 color components for the piece (r,g,b)
function Color(r, g, b){
	this.r = r;
	this.g = g;
	this.b = b;
}

//relBlock is a block with relative positions, in relation to the block center
function relBlock(relX, relY){
	this.relX = relX;
	this.relY = relY;
}

//absBlock is a block and its absolute positions and color (to ease moving to backdrop)
function absBlock(absX, absY, color){
	this.absX = absX;
	this.absY = absY;
	this.color = color;
}

//For use in the input for creating a TPiece
function Position(x, y){
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
function TPiece(color, relpositions){
	this.color = color;
	this.blocks = [];

	for(var i = 0; i < relpositions.length; i++){
		this.blocks.push(new relBlock(relpositions[i].x, relpositions[i].y));
	}

	this.centerX = GAMEMIDDLE;
	this.centerY = 0;

	this.rotateCW = function(){

		//rotating CW is x = -y and y = x

		for(var i = 0; i < this.blocks.length; i++){
			var oldX = TPieceArr[0].blocks[i].relX;
			this.blocks[i].relX = -this.blocks[i].relY;
			this.blocks[i].relY = oldX;
		}
	};

	this.rotateCCW = function(){
		
		//Simillarly, rotatin CCW is x = y and y = -x

		for(var i = 0; i < this.blocks.length; i++){
			var oldX = TPieceArr[0].blocks[i].relX;
			this.blocks[i].relX = this.blocks[i].relY;
			this.blocks[i].relY = -oldX;
		}
	};
}


//todo: write comment
function TPiecetoabsBlocks(tpiece){
	var absBlocks = [];

	for(var i = 0; i < tpiece.blocks.length; i++){
		absBlocks.push(new absBlock(tpiece.centerX + tpiece.blocks[i].relX * BLOCKPADDINGPX, tpiece.centerY + tpiece.blocks[i].relY * BLOCKPADDINGPX, tpiece.color));
	}

	return absBlocks;
}

function drawTPiece(tpiece){
	var blocks = TPiecetoabsBlocks(tpiece);

	for(var i = 0; i < blocks.length; i++){
		ctx.beginPath();
		ctx.rect(blocks[i].absX, blocks[i].absY, BLOCKWIDTH, BLOCKHEIGHT);
		ctx.fillStyle = "rgba(" + blocks[i].color.r + ", " + blocks[i].color.g + ", " + blocks[i].color.b +", "+"1.0)";
		ctx.fill();
		ctx.closePath();
	}
}

function checkIfTPieceDoesntHitBottom(absBlocks){
	for(var i = 0; i < absBlocks.length; i++){
		if(absBlocks[i].absY + BLOCKHEIGHT >= GAMEHEIGHT)
			return false;
	}

	return true;
}

function dropTPieces(){
	for(var i = 0; i < TPieceArr.length; i++){

		var blocks = TPiecetoabsBlocks(TPieceArr[i]);

		if(checkIfTPieceDoesntHitBottom(blocks)){
			//If the piece doesn't hit the bottom, then lower it
			TPieceArr[i].centerY += BLOCKHEIGHT;
		} else{
			//Put the blocks into the "background"
		}
		
	}
}

function rotateTPiecesCW(){
	for(var i = 0; i < TPieceArr.length; i++){
		TPieceArr[i].rotateCW();
	}
}

function rotateTPiecesCCW(){
	for(var i = 0; i < TPieceArr.length; i++){
		TPieceArr[i].rotateCCW();
	}
}

function checkIfTPieceDoesntHitRight(absBlocks){
	for(var i = 0; i < absBlocks.length; i++){
		if(absBlocks[i].absX + BLOCKWIDTH >= GAMEWIDTH)
			return false;
	}

	return true;
}

function shiftTPiecesRight(){
	for(var i = 0; i < TPieceArr.length; i++){

		var blocks = TPiecetoabsBlocks(TPieceArr[i]);

		if(checkIfTPieceDoesntHitRight(blocks)){
			//If the piece doesn't hit the right, then shift it
			TPieceArr[i].centerX += BLOCKWIDTH;
		}		
	}
}

function checkIfTPieceDoesntHitLeft(absBlocks){
	for(var i = 0; i < absBlocks.length; i++){
		if(absBlocks[i].absX - BLOCKWIDTH < 0)
			return false;
	}

	return true;
}

function shiftTPiecesLeft(){
	for(var i = 0; i < TPieceArr.length; i++){

		var blocks = TPiecetoabsBlocks(TPieceArr[i]);

		if(checkIfTPieceDoesntHitLeft(blocks)){
			//If the piece doesn't hit the left, then shift it
			TPieceArr[i].centerX -= BLOCKWIDTH;
		}		
	}
}

//Generating a random colored square piece - DEBUG 
TPieceArr.push(new TPiece(new Color(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)), TPieceTypes[Math.floor(Math.random() * TPieceTypes.length)]));

//draw stuff here
function draw(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	for(var i = 0; i < TPieceArr.length; i++){
		drawTPiece(TPieceArr[i]);
	}

	//drawPause();

	requestAnimationFrame(draw);
}

setInterval(dropTPieces, 1000 * DROPTIME_SECS);

draw();

//MIGHT BE NEEDED FOR DEBUG AGAIN
/*

//Paints all the centers white
function centerWhiteHighlighter(){
	for(var i = 0; i < TPieceArr[0].blocks.length; i++){
	if(TPieceArr[0].blocks[i].relX == 0 && TPieceArr[0].blocks[i].relY == 0){
		//Is center piece, paint white
		TPieceArr[0].blocks[i].color = new Color(255,255,255);
	}
}
}
*/