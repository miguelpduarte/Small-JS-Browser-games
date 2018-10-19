	//Getting the canvas context to draw on
	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");

	////General config vars
	var refreshSpeedms = 10;
	var score = 0;
	var lives = 3;

	//Keys
	var rightPressed = false;
	var leftPressed = false;
	var rPressed = false;

	//Ball vars
	var x = canvas.width/2;
	var y = canvas.height-30;
	var dx = 2;
	var dy = -2;
	var ballRadius = 10;

	//Paddle vars
	var paddleHeight = 10;
	var paddleWidth = 75;
	var paddleX = (canvas.width - paddleWidth)/2;
	var paddledx = 7;
	var r, g, b;
	r = Math.random() * 256;
	g = Math.random() * 256;
	b = Math.random() * 256;

	//Brick vars
	var brickRowCount = 3;
	var brickColumnCount = 5;
	var brickWidth = 75;
	var brickHeight = 20;
	var brickPadding = 10;
	var brickOffsetTop = 30;
	var brickOffsetLeft = 30;

	////End of config vars

	//Generating bricks
	var bricks = [];
	for(c=0; c<brickColumnCount; c++) {
    	bricks[c] = [];
    	for(r=0; r<brickRowCount; r++) {
        	bricks[c][r] = { x: 0, y: 0, hit: 0 };
	    }
	}

	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);
	document.addEventListener("mousemove", mouseMoveHandler, false);

	function keyDownHandler(e) {
	    if(e.keyCode == 39) {
        	rightPressed = true;
    	}
    	else if(e.keyCode == 37) {
	        leftPressed = true;
	    }
	    else if(e.keyCode == 82){
	    	rPressed = true
	    }
	}

	function keyUpHandler(e) {
		if(e.keyCode == 39) {
    		rightPressed = false;
    	}
    	else if(e.keyCode == 37) {
	        leftPressed = false;
		}
		else if(e.keyCode == 82){
			rPressed = false;
		}
	}

	function mouseMoveHandler(e) {
    	var relativeX = e.clientX - canvas.offsetLeft;
    	if(relativeX > 0 && relativeX < canvas.width) {
        	paddleX = relativeX - paddleWidth/2;
	    }
	}

	//drawing a ball
	function drawBall(){
		ctx.beginPath();
		ctx.arc(x, y, ballRadius, 0, Math.PI*2);
		ctx.fillStyle = "#0095DD";
		ctx.fill();
		ctx.closePath();
	}

	function drawPaddle(){
		ctx.beginPath();
		ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);

		ctx.fillStyle = "rgba("+r+", "+g+", "+b+", "+"1.0)";
		ctx.fill();
		ctx.closePath();
	}

	function drawBricks(){
		for(c=0; c<brickColumnCount; c++){
			for(r=0; r<brickRowCount; r++){
				if(bricks[c][r].hit == 0){
					bricks[c][r].x = (c*(brickWidth + brickPadding)) + brickOffsetLeft;
					bricks[c][r].y = (r*(brickHeight + brickPadding)) + brickOffsetTop;
					ctx.beginPath();
					ctx.rect(bricks[c][r].x, bricks[c][r].y, brickWidth, brickHeight);
					ctx.fillStyle = "red";
					ctx.fill();
					ctx.closePath();
				}
			}
		}
	}

	function drawScore(){
		ctx.font = "16px Arial";
		ctx.fillStyle = "#0095DD";
		ctx.fillText("Score: " + score, 8, 20);
	}

	function drawLives(){
		ctx.font = "16px Arial";
 	    ctx.fillStyle = "#0095DD";
    	ctx.fillText("Lives: "+lives, canvas.width-65, 20);
	}

	function collision(){
		////Ball collisions
		//top and bottom/paddle collisions
		if(y + dy - ballRadius < 0)
			dy = - dy;
		else if( y + dy + ballRadius > canvas.height){
			if(x > paddleX && x < paddleX + paddleWidth) {
				dy = -dy;
			}
			else {
				lives--;
				if(!lives) {
    				alert("GAME OVER GGEZ");
    				document.location.reload();
				}
				else {
    				x = canvas.width/2;
    				y = canvas.height-30;
    				dx = 2;
	    			dy = -2;
    				paddleX = (canvas.width-paddleWidth)/2;
				}
			}
		}

		//sides collisions
		if(x + dx - ballRadius < 0 || x + dx + ballRadius > canvas.width)
			dx = - dx;

		////Paddle collisions
		if(rightPressed && paddleX < canvas.width-paddleWidth) {
    		paddleX += paddledx;
		}
		else if(leftPressed && paddleX > 0) {
    		paddleX -= paddledx;
		}

		////R pressings
		if(rPressed)
			randomPaddleColor();

		////Brick collisions
		for(c=0; c<brickColumnCount; c++){
			for(r=0; r<brickRowCount; r++){
				var b = bricks[c][r];
				if(b.hit == 0){
					if(x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight){
						dy = -dy;
						b.hit = 1;
						score++;
						if(score == brickRowCount * brickColumnCount){
							alert("you prolly win, all breeks deshtroid");
							document.location.reload();
						}
					}
				}
			}
		}
	}
	
	function randomPaddleColor(){
		r = Math.floor(Math.random() * 256);
		g = Math.floor(Math.random() * 256);
		b = Math.floor(Math.random() * 256);
	}

	//draw stuff here
	function draw(){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawBall();
		drawPaddle();
		drawBricks();
		drawScore();
		drawLives();
		collision();
		x += dx;
		y += dy;
		requestAnimationFrame(draw);
	}

	draw();