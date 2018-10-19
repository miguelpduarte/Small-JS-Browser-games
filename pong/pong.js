//Getting the canvas context to draw on
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

////General config vars
var scoreP1 = 0;
var scoreP2 = 0;
var gamePaused = false;

//Keys
var upPressed = false;
var downPressed = false;
var wPressed = false;
var sPressed = false;

//Ball vars
var x = canvas.width/2;
var y = canvas.height/2;
var originaldx = 4;
var originaldy = -4;
var dx = originaldx;
var dy = originaldy;
var ballRadius = 8;

//Paddle vars
var paddleHeight = 75;
var paddleWidth = 10;
var paddleDYP1 = paddleDYP2 = 6;
var startingPaddleY = (canvas.height - paddleHeight)/2;
//P1
var paddleYP1 = startingPaddleY;
//P2
var paddleYP2 = startingPaddleY;

/*
Math.random() * 256
*/

////End of config vars

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

function drawBall(){
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI*2);
	ctx.fillStyle = "black";
	ctx.fill();
	ctx.closePath();
}

function drawPaddleP1(){
	ctx.beginPath();
	ctx.rect(0, paddleYP1, paddleWidth, paddleHeight);
	ctx.fillStyle = "black";
	ctx.fill();
	ctx.closePath();
}

function drawPaddleP2(){
	ctx.beginPath();
	ctx.rect(canvas.width - paddleWidth, paddleYP2, canvas.width, paddleHeight);
	ctx.fillStyle = "red";
	ctx.fill();
	ctx.closePath();
}

function drawScore(){
	ctx.font = "16px Arial";
	ctx.fillStyle = "#0095DD";
	ctx.fillText(scoreP1 + " - " + scoreP2, canvas.width/2 - 14, 22);
}

function drawPauseMenu(){
	if(gamePaused){
		ctx.font = "32px Arial";
		ctx.fillStyle = "black";
		ctx.fillText("PAUSED", canvas.width/2 - 50, canvas.height/2);
		ctx.fillText("Press Escape to resume.", canvas.width/2 - 150, canvas.height/2 + 40);
	}
}

function reset(){
	//Reset ball pos
	x = canvas.width/2;
	y = canvas.height/2;
	//Reset ball speeds
	dx = originaldx;
	dy = originaldy;
	//Reset paddle pos
	paddleYP1 = startingPaddleY;
	paddleYP2 = startingPaddleY;

	//Reset button presses
	upPressed = false;
	downPressed = false;
	wPressed = false;
	sPressed = false;
}

function update(){
	if(!gamePaused){

		////Collisions

		//top and bottom ball collision
		if(y + dy - ballRadius < 0 || y + dy + ballRadius > canvas.height)
			dy = -dy;

		//Side collision and scoring detection
		//Left
		if(x + dx - ballRadius < 0){
			//checking if ball is in contact with paddle
			if(y > paddleYP1 && y < paddleYP1 + paddleHeight)
				dx = -dx;
			else{
				scoreP2++;
				alert("P2 scored!");

				reset();
			}
		}

		//Right
		if(x + dx + ballRadius > canvas.width){
			//checking if ball is in contact with paddle
			if(y > paddleYP2 && y < paddleYP2 + paddleHeight)
				dx = -dx;
			else{
				scoreP1++;
				alert("P1 scored!");

				reset();
			}
		}

		////End of collisions

		//Paddle Movement

		if(downPressed && paddleYP2 + paddleHeight < canvas.height)
			paddleYP2 += paddleDYP2;
		else if(upPressed && paddleYP2 > 0)
			paddleYP2 -= paddleDYP2;

		if(wPressed && paddleYP1 > 0)
			paddleYP1 -= paddleDYP1;
		else if(sPressed && paddleYP1 + paddleHeight < canvas.height)
			paddleYP1 += paddleDYP1;

		//Ball movement
		x += dx;
		y += dy;
	}
}

//draw stuff here
function draw(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	update();

	drawBall();
	drawPaddleP1();
	drawPaddleP2();
	drawScore();
	drawPauseMenu();
	
	requestAnimationFrame(draw);
}

draw();