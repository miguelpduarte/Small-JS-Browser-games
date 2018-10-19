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

const TILE_NON_CLICKED_COLOR = "grey";
const TILE_CLICKED_COLOR = "aquamarine";
const TILE_FONT_SIZE = GRID_ITEM_WIDTH - 16;
const TILE_FONT = `${TILE_FONT_SIZE}px serif`;
const TILE_FONT_COLOR = "salmon";

/// GAME VARS
var mines = {};
var tiles = {};
var request_animation_frame_id = null;


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

let game_running = true;

//Event handling
const clickHandler = evt => {
    if(!game_running) {
        return;
    }

    const real_x_px = evt.pageX - canvas.offsetLeft;
    const real_y_px = evt.pageY - canvas.offsetTop;
    const x = Math.floor(real_x_px/GRID_ITEM_WIDTH);
    const y = Math.floor(real_y_px/GRID_ITEM_HEIGHT);

    if(testMine(x, y)) {
        drawMines(false);
        stopGame();
        alert('You lose!');
    } else {
        toggleTile(x, y);
    }
}

canvas.addEventListener("click", clickHandler, false);

const testMine = (x, y) => {
    return mines[x] && mines[x][y];
}

const toggleTile = (x, y) => {
    const clicked_tile = tiles[x][y];
    // if(clicked_tile) {
        clicked_tile.click();
    // }
    // tiles.set({x, y}, clicked_tile);
}

const stopGame = () => {
    game_running = false;
    cancelAnimationFrame(request_animation_frame_id);
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

const drawMineAsTile = mine => {
    ctx.beginPath();
    ctx.rect(mine.x * GRID_ITEM_WIDTH, mine.y * GRID_ITEM_HEIGHT, GRID_ITEM_WIDTH, GRID_ITEM_HEIGHT);
    ctx.fillStyle = TILE_NON_CLICKED_COLOR;
    ctx.fill();
    ctx.closePath();
}

const drawMines = (asTile) => {
    for(let mine_line of Object.values(mines)) {
        for(let mine of Object.values(mine_line)) {
            if(asTile) {
                drawMineAsTile(mine);
            } else {
                drawMine(mine);
            }
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
    ctx.beginPath();
    ctx.rect(tile.x * GRID_ITEM_WIDTH, tile.y * GRID_ITEM_HEIGHT, GRID_ITEM_WIDTH, GRID_ITEM_HEIGHT);
    if(tile.clicked) {
        ctx.fillStyle = TILE_CLICKED_COLOR;
    } else {
        ctx.fillStyle = TILE_NON_CLICKED_COLOR;
    }
    ctx.fill();
    ctx.closePath();

    if(tile.clicked) {
        //Drawing text
        ctx.font = TILE_FONT;
        ctx.textAlign = "center";
        ctx.fillStyle = TILE_FONT_COLOR;
        ctx.fillText(tile.number, (tile.x + 1) * GRID_ITEM_WIDTH - GRID_ITEM_WIDTH/2, (tile.y + 1) * GRID_ITEM_HEIGHT - GRID_ITEM_HEIGHT/4);
    }
}

const drawTiles = () => {
    for(let tile_line of Object.values(tiles)) {
        for(let tile of Object.values(tile_line)) {
            drawTile(tile);
        }
    }
}

//draw stuff here
const draw = () => {
    //Clearing the screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawTiles();
    drawMines(true);
    // drawBoop({x: 0, y: 0});
    drawGrid();

    //drawPause(); //TODO

    //drawScore(); //TODO

    //Makes it so that the draw function is called whenever necessary - makes it so that there is no need to rely on a setInterval function
    request_animation_frame_id = requestAnimationFrame(draw);
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

    // console.log('tiles ', tiles);
    // console.log('mines ', mines);
}

const calculateTileNumbers = () => {
    for(let tile_line of Object.values(tiles)) {
        for(let tile of Object.values(tile_line)) {
            calculateTileNumbers_helper(tile);
        }
    }
}

const calculateTileNumbers_helper = tile => {
    let n = 0;

    for(let i = tile.x-1; i <= tile.x+1; ++i) {
        for(let j = tile.y-1; j <= tile.y+1; ++j) {
            if(i === tile.x && j === tile.y) {
                continue;
            }
            if(mines[i] && mines[i][j]) {
                n++;
            }
        }
    }

    tile.setNumber(n);
}

const init = () => {
    //Setting the page title
    document.title = 'BombSweeper!';

    populateGrid();
    calculateTileNumbers();

    //Starting the drawing of the game
    //requestAnimationFrame is also used inside draw so it doesn't need to be called repeatedly using setInterval or whatnot
    request_animation_frame_id = requestAnimationFrame(draw);
}

//Calling init so that the game actually starts
init();