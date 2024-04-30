// storing canvas and context in variables
const canvasElement = document.getElementById("game-canvas");
const ctx = canvasElement.getContext("2d");

// setting canvas dimensions
canvasElement.height = 300;
canvasElement.width = 300;

// position of ground
const ground_x = 0;
const ground_y = 250;

// position of user
const user_height = 50;
const user_width = 50;
let user_x = 20;
let user_y = ground_y - user_height;
let velocity = 0;

// position of obstacle
const obstacle_height = 10;
const obstacle_width = 5;
let obstacle_x = canvasElement.width;
const obstacle_y = ground_y - obstacle_height;

// game status
let start = false;
let game_over = false;
let score = 0;

// event listeners
window.addEventListener("keydown", catch_keydown);
canvasElement.addEventListener("click", catch_click);
//window.addEventListener("keyup", catch_keyup)

// user control
function catch_keydown(event){
	// right arrow is pressed
	/*if (event.keyCode == 39 && user_x < 250) {
		user_x += 5;
	}
	// left arrow is pressed
	if (event.keyCode == 37 && user_x > 0){
		user_x -= 5;
	}*/
	// up arrow is pressed
	// space is pressed
	if (event.keyCode == 32){
		if(!start){
			window.requestAnimationFrame(update_canvas);
			start = true;
		}
		if (user_y == ground_y - user_height && !game_over && start){
 			velocity = 15;
			score += 1;
	}
	}
}

draw_canvas();
ctx.font = "24px serif";
ctx.fillStyle = "#454545";
ctx.textAlign = "center";
ctx.fillText("press space start", canvasElement.width/2, canvasElement.height/2);
ctx.fillStyle = "black";

// start new game
function catch_click(event){
	if(game_over){
		game_over = false;
		obstacle_x = canvasElement.width;
		score = 0;
	}
}


function update_canvas(){

	// apply gravity
	user_y -= velocity;

	draw_canvas();

	// gravity
	if (user_y < ground_y - user_height) {
		velocity -= 1;
	}
	else{
		velocity = 0;
	}


	// collision
	if (user_x + user_width == obstacle_x && user_y + user_height > ground_y - obstacle_height){	
		game_over = true;
		ctx.font = "48px serif";
		ctx.textAlign = "center";
		ctx.strokeText("Game Over", canvasElement.width/2, canvasElement.height/2);
		ctx.font = "24px serif";
		ctx.fillStyle = "#454545";
		ctx.fillText("click to restart", canvasElement.width/2, canvasElement.height/2 + 35);
		ctx.fillStyle = "black";
	}
	
	if (!game_over){
		move_obstacle();
	}

	window.requestAnimationFrame(update_canvas);
}

function draw_canvas(){

	// fillRect( x, y, width, height)
	ctx.clearRect(0, 0, canvasElement.width, canvasElement.height); // clear canvas
	ctx.fillRect(ground_x, ground_y, 300, 300-ground_y); // draw ground
	ctx.strokeRect(user_x, user_y, user_width, user_height); // draw user
	ctx.fillRect(obstacle_x, obstacle_y, obstacle_width, obstacle_height); // draw obstacle
	
	// print score
	ctx.font = "16px serif";
	ctx.textAlign = "end";
	ctx.fillText(`score: ${score}`, canvasElement.width - 10, 20);

}

function move_obstacle(){
	// move obstacle
	if (obstacle_x > -obstacle_width){
		obstacle_x -= 5;
	}
	else{
		obstacle_x = canvasElement.width;
	}

}

