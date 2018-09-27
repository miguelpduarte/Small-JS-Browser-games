/*
 ██████   █████  ███    ███ ███████      ██████  ██████  ███    ██ ███████ ████████  █████  ███    ██ ████████ ███████
██       ██   ██ ████  ████ ██          ██      ██    ██ ████   ██ ██         ██    ██   ██ ████   ██    ██    ██
██   ███ ███████ ██ ████ ██ █████       ██      ██    ██ ██ ██  ██ ███████    ██    ███████ ██ ██  ██    ██    ███████
██    ██ ██   ██ ██  ██  ██ ██          ██      ██    ██ ██  ██ ██      ██    ██    ██   ██ ██  ██ ██    ██         ██
 ██████  ██   ██ ██      ██ ███████      ██████  ██████  ██   ████ ███████    ██    ██   ██ ██   ████    ██    ███████
*/

const GRID_ITEM_HEIGHT = 36;
const GRID_ITEM_WIDTH = 36;

const GAME_HEIGHT_ITEMS = 8;
const GAME_HEIGHT = GAME_HEIGHT_ITEMS * GRID_ITEM_HEIGHT;
const GAME_WIDTH_ITEMS = 8;
const GAME_WIDTH = GAME_WIDTH_ITEMS * GRID_ITEM_WIDTH;

const MINE_R = 100;
const MINE_G = 100;
const MINE_B = 100;
const MINE_SIZE_PERCENT = 0.8;

/// GAME VARS
var mines = {};
var tiles = {};


/*
 ██████  █████  ███    ██ ██    ██  █████  ███████
██      ██   ██ ████   ██ ██    ██ ██   ██ ██
██      ███████ ██ ██  ██ ██    ██ ███████ ███████
██      ██   ██ ██  ██ ██  ██  ██  ██   ██      ██
 ██████ ██   ██ ██   ████   ████   ██   ██ ███████
*/

//Getting the canvas context to draw on
const canvas = document.getElementById("myCanvas");
//Chaning canvas size to match game requirements
canvas.height = GAME_HEIGHT;
canvas.width = GAME_WIDTH;
const ctx = canvas.getContext("2d");

///Classes
class Mine {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}


class Tile {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.clicked = false;
        this.number = 0;
    }

    click() {
        this.clicked = true;
    }

    setNumber(number) {
        this.number = number;
    }
}

//Event handling
const clickHandler = evt => {
    const real_x_px = evt.pageX - canvas.offsetLeft;
    const real_y_px = evt.pageY - canvas.offsetTop;
    const x = Math.floor(real_x_px/GRID_ITEM_WIDTH);
    const y = Math.floor(real_y_px/GRID_ITEM_HEIGHT);

    if(testMine(x, y)) {
        alert('you lose!');
    } else {
        toggleTile(x, y);
    }
}

canvas.addEventListener("click", clickHandler, false);

const testMine = (x, y) => {
    return !!mines[x][y];
}

const toggleTile = (x, y) => {
    const clicked_tile = tiles[x][y];
    // if(clicked_tile) {
        clicked_tile.click();
    // }
    // tiles.set({x, y}, clicked_tile);
}


/*
██████  ██████   █████  ██     ██ ██ ███    ██  ██████
██   ██ ██   ██ ██   ██ ██     ██ ██ ████   ██ ██
██   ██ ██████  ███████ ██  █  ██ ██ ██ ██  ██ ██   ███
██   ██ ██   ██ ██   ██ ██ ███ ██ ██ ██  ██ ██ ██    ██
██████  ██   ██ ██   ██  ███ ███  ██ ██   ████  ██████
*/

const drawBoop = boop => {
    ctx.beginPath();
    //- side/2 because arc takes in the center
    ctx.rect(boop.x * GRID_ITEM_WIDTH, boop.y * GRID_ITEM_HEIGHT, GRID_ITEM_WIDTH, GRID_ITEM_HEIGHT);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
}

const drawMine = mine => {
    ctx.beginPath();
    // side/2 because arc takes in the center
    ctx.arc(mine.x * GRID_ITEM_WIDTH + GRID_ITEM_WIDTH/2, mine.y * GRID_ITEM_HEIGHT + GRID_ITEM_HEIGHT/2, GRID_ITEM_WIDTH/2 * MINE_SIZE_PERCENT, 0, 2*Math.PI);
    ctx.fillStyle = `rgba(${MINE_R},${MINE_G},${MINE_B})`;
    ctx.fill();
    ctx.closePath();
}

const drawMines = () => {
    for(let mine_line of Object.values(mines)) {
        for(let mine of Object.values(mine_line)) {
            drawMine(mine);
            // if(mine.y === 1 && mine.x === 0) {
            //     console.log('mine: ', mine, pos);
            // }
        }
    }
}

const drawGrid = () => {
    for(let x = 0; x < GAME_WIDTH_ITEMS; ++x) {
        for(let y = 0; y < GAME_HEIGHT_ITEMS; ++y) {
            ctx.beginPath();
            ctx.rect(x * GRID_ITEM_WIDTH, y * GRID_ITEM_HEIGHT, GRID_ITEM_WIDTH, GRID_ITEM_HEIGHT);
            ctx.strokeStyle = "black";
            ctx.stroke();
            ctx.closePath();
        }
    }
}

const drawTile = tile => {
    //Drawing text
    ctx.font = '30px serif';
    ctx.fillStyle = "black";
    ctx.fillText(tile.number, tile.x * GRID_ITEM_WIDTH, tile.y * GRID_ITEM_HEIGHT);

    ctx.beginPath();
    ctx.rect(tile.x * GRID_ITEM_WIDTH, tile.y * GRID_ITEM_HEIGHT, GRID_ITEM_WIDTH, GRID_ITEM_HEIGHT);
    if(tile.clicked) {
        ctx.fillStyle = "blue";
    } else {
        ctx.fillStyle = "grey";
    }
    ctx.fill();
    ctx.closePath();
}

const drawTiles = () => {
    for(let tile_line of Object.values(tiles)) {
        for(let tile of Object.values(tile_line)) {
            drawTile(tile);
            // if(tile.y === 1 && tile.x === 0) {
            //     console.log('tile: ', tile, pos);
            // }
        }
    }
}

function drawAbsBlock(block) {
  //Block itself
  ctx.beginPath();
  ctx.rect(block.absX, block.absY, BLOCKWIDTH, BLOCKHEIGHT);
  ctx.fillStyle = "rgba(" + block.color.r + ", " + block.color.g + ", " + block.color.b + ", " + block.color.alpha + ")";
  ctx.fill();
  ctx.closePath();
  //Inner outline
	ctx.strokeStyle = "rgba(0, 0, 0, " + block.color.alpha + ")"; //The stroke uses the block alpha so that it will fade along with the regular block color
  ctx.strokeRect(block.absX, block.absY, BLOCKWIDTH, BLOCKHEIGHT);
}

function drawTPiece(tpiece) {
  var blocks = TPiecetoabsBlocks(tpiece);

  for (var i = 0; i < blocks.length; i++) {
    drawAbsBlock(blocks[i]);
  }
}

function drawBackground() {
  for (var x = 0; x < GAMEWIDTHBLOCKS; x++) {
    for (var y = 0; y < GAMEHEIGHTBLOCKS; y++) {
      if (blockMap.get(x).get(y) != 0) {
        drawBGBlock(x, y, blockMap.get(x).get(y));
      }
    }
  }
}

//draw stuff here
const draw = () => {
    //Clearing the screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawTiles();
    drawMines();
    // drawBoop({x: 0, y: 0});
    drawGrid();

    //drawPause(); //TODO

    //drawScore(); //TODO

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

const populateGrid = () => {
    for(let x = 0; x < GAME_WIDTH_ITEMS; ++x) {
        for(let y = 0; y < GAME_HEIGHT_ITEMS; ++y) {
            if(Math.random() > 0.7) {
                //Create mine
                let newMine = new Mine(x, y);
                if(!mines[x]) {
                    mines[x] = {};
                }
                mines[x][y] = newMine;
                // mines.set({x, y}, newMine);
            } else {
                //Create normal tile
                let newTile = new Tile(x, y);
                if(!tiles[x]) {
                    tiles[x] = {};
                }
                tiles[x][y] = newTile;
                // tiles.set({x, y}, newTile);
            }
        }
    }

    console.log('tiles ', tiles);
    console.log('mines ', mines);
}

const calculateTileNumbers = () => {
    for(let tile_line of Object.values(tiles)) {
        for(let tile of Object.values(tile_line)) {
            //TODO
        }
    }
}

const init = () => {
  //Setting the page title
  document.title = 'BombSweeper!';

  populateGrid();
  calculateTileNumbers();

  //Starting the drawing of the game - requestAnimationFrame is used inside draw so it doesn't need to be called repeatedly
  draw();
}

//Calling init so that the game actually starts
init();