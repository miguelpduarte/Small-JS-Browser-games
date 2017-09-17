//Game constants
var GAMEHEIGHT = 800; // 32 * 25
var GAMEWIDTH = 420;
var GAMEMIDDLE = Math.floor(GAMEWIDTH / 2);
var BLOCKPADDINGPX = 25;
var BLOCKHEIGHT = 25;
var BLOCKWIDTH = 25;
var UPDATETIME_SECS = 1;

//Getting the canvas context to draw on
var canvas = document.getElementById("myCanvas");
//Chaning canvas size to match game requirements
canvas.height = GAMEHEIGHT;
canvas.width = GAMEWIDTH;
var ctx = canvas.getContext("2d");

////General game config vars
var score = 0;
var gamePaused = false;
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
var upPressed = false;
var downPressed = false;
var wPressed = false;
var sPressed = false;

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
    	upPressed = true;
	}
	//Down arrow
	else if(e.keyCode == 40) {
        downPressed = true;
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
    	upPressed = false;
	}
	//Down arrow
	else if(e.keyCode == 40) {
        downPressed = false;
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

function Block(color, relX, relY){
	this.color = color;
	this.relX = relX;
	this.relY = relY;
}

function Position(x, y){
	this.x = x;
	this.y = y;
}

//relpositions is the array of position objects, relative to the center, for each piece
//Note to future self: for ease of rendering, the center is always the topmost (1st) leftmost (2nd criteria) block
//Thus: only positive Xs and Ys, which in the canvas context mean to the right and downwards
function TPiece(Color, relpositions){
	this.color = Color;
	this.blocks = [];

	for(var i = 0; i < relpositions.length; i++){
		this.blocks.push(new Block(this.color, relpositions[i].x, relpositions[i].y));
	}

	this.centerX = GAMEMIDDLE;
	this.centerY = 0;

	this.rotateCW = function(){
		//Do stuff to rotate all blocks clockwise
	};

	this.rotateCCW = function(){
		//Do stuff to rotate all blocks counterclockwise
	};
}


function drawTPiece(tpiece){
	for(var i = 0; i < tpiece.blocks.length; i++){
		ctx.beginPath();
		ctx.rect(tpiece.centerX + tpiece.blocks[i].relX * BLOCKPADDINGPX, tpiece.centerY + tpiece.blocks[i].relY * BLOCKPADDINGPX, BLOCKWIDTH, BLOCKHEIGHT);
		ctx.fillStyle = "rgba(" + tpiece.blocks[i].color.r + ", " + tpiece.blocks[i].color.g + ", " + tpiece.blocks[i].color.b +", "+"1.0)";
		ctx.fill();
		ctx.closePath();
	}
}

function descendTPiece(tpiece){
	tpiece.centerY += BLOCKHEIGHT;
}

//Generating a random colored square piece - DEBUG
TPieceArr.push(new TPiece(new Color(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)), TPieceTypes[Math.floor(Math.random() * TPieceTypes.length)]));

function update(){
	for(var i = 0; i < TPieceArr.length; i++){
		if(TPieceArr[i].centerY + BLOCKHEIGHT < GAMEHEIGHT)
			descendTPiece(TPieceArr[i]);
		else{
			//Put the blocks into the "background"
		}
	}
}

//draw stuff here
function draw(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	for(var i = 0; i < TPieceArr.length; i++){
		drawTPiece(TPieceArr[i]);
	}

	requestAnimationFrame(draw);
}

setInterval(update, 1000 * UPDATETIME_SECS);

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