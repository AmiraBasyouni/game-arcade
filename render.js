var canvas = document.getElementsByTagName( 'canvas' )[ 0 ];
canvas.width = 300;
canvas.height = 600;
var ctx = canvas.getContext( '2d' );
var W = 300, H = 600;
var BLOCK_W = W / COLS, BLOCK_H = H / ROWS;

// draw a single square at (x, y)
function drawBlock( x, y ) {
    ctx.fillRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1 , BLOCK_H - 1 );
    ctx.strokeRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1 , BLOCK_H - 1 );
}

// draws the board and the moving shape
function render() {
    ctx.clearRect( 0, 0, W, H );

    ctx.strokeStyle = 'white';
    for ( var x = 0; x < COLS; ++x ) {
        for ( var y = 0; y < ROWS; ++y ) {
            if ( board[ y ][ x ] ) {
                ctx.fillStyle = "black";
                drawBlock( x, y );
            }
        }
    }

    ctx.fillStyle = 'black';
    ctx.strokeStyle = 'white';
    for ( var y = 0; y < 4; ++y ) {
        for ( var x = 0; x < 4; ++x ) {
            if ( current[ y ][ x ] ) {
                ctx.fillStyle = "black";
                drawBlock( currentX + x, currentY + y );
            }
        }
    }
	if(lose){
		game_over_message();
	}
}



let game_started = false;
// event listener to start the game
canvas.addEventListener("click", catch_click);

function catch_click(){
	if (!game_started){
		newGame();
		game_started = true;
	}
}


function start_game_message(){
	ctx.font= "24px serif";
	ctx.fillStyle = "#454545";
	ctx.textAlign = "center";
	ctx.fillText("click on canvas to start", canvas.width/2, canvas.height/2);
	ctx.fillStyle = "black";
}

function game_over_message(){
	// writing game over
	ctx.font = "40px serif";
	ctx.textAlign = "center";
	ctx.fillStyle = "white";
	ctx.fillText("Game Over", canvas.width/2, canvas.height/2);
	ctx.strokeStyle = "black"; 
	ctx.strokeText("Game Over", canvas.width/2, canvas.height/2);
	// writing click on canvas to restart
	ctx.font = "22px serif";
	ctx.fillStyle = "white";
	ctx.fillText("click on canvas to restart", canvas.width/2, canvas.height/2 + 35);
	ctx.strokeStyle = "#454545";
	ctx.strokeText("click on canvas to restart", canvas.width/2, canvas.height/2 + 35);
	ctx.strokeStyle = "black";
	ctx.fillStyle = "black"; 
}

start_game_message();
