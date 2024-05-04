// storing canvas and context in variables
const canvasElement = document.getElementById("game-canvas");
const ctx = canvasElement.getContext("2d");

// setting canvas dimensions
canvasElement.height = 500;
canvasElement.width = 500;

// position of ground
const ground_x = 0;
const ground_height = 100;
const ground_y = canvasElement.height - ground_height;

// position of user
const img = new Image();
img.src = "./dino-bigger.png";
const user_height = img.height;
const user_width = img.width;
let user_x = 50;
let user_y = ground_y - user_height;
let velocity = 0;

// position of obstacle
const img_obstacle = new Image();
img_obstacle.src = "./obstacle.png";
const obstacle_height = 48;
const obstacle_width = 18;
let obstacle_x = canvasElement.width;
const obstacle_y = ground_y - obstacle_height;

// game status
let start = false;
let game_over = false;
let score = 0;
const init_difficulty = 4.5;
const increment_difficulty = 0.005;
let difficulty = init_difficulty; // speed of obstacle

// event listeners
window.addEventListener("keydown", catch_keydown);
canvasElement.addEventListener("click", catch_click);
//window.addEventListener("keyup", catch_keyup)

// user control
function catch_keydown(event) {
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
  if (event.keyCode == 32) {
    if (!start) {
      window.requestAnimationFrame(update_canvas);
      start = true;
    }
    if (user_y == ground_y - user_height && !game_over && start) {
      velocity = 15;
      score += 1;
    }
  }
}

draw_canvas();
ctx.font = "24px serif";
ctx.fillStyle = "#454545";
ctx.textAlign = "center";
ctx.fillText(
  "press space to start",
  canvasElement.width / 2,
  canvasElement.height / 2,
);
ctx.fillStyle = "black";

// start new game
function catch_click(event) {
  if (game_over) {
    game_over = false;
    obstacle_x = canvasElement.width + 100;
    velocity = 0;
    user_y = ground_y - user_height;
    score = 0;
    difficulty = init_difficulty;
  }
}

function update_canvas() {
  if (!game_over) {
    move_obstacle();

    // gravity: user descends
    user_y -= velocity;
    // gravity: if user is above ground, adjust fall speed
    if (user_y < ground_y - user_height) {
      velocity -= 1;
    } else {
      velocity = 0;
    }

    difficulty += increment_difficulty;
  }

  draw_canvas();

  // if collision occurs, game_over
  if (
    user_x + user_width > obstacle_x &&
    obstacle_x > user_x &&
    user_y > obstacle_y - obstacle_height
  ) {
    game_over = true;
    ctx.font = "48px serif";
    ctx.textAlign = "center";
    ctx.strokeText(
      "Game Over",
      canvasElement.width / 2,
      canvasElement.height / 2,
    );
    ctx.font = "24px serif";
    ctx.fillStyle = "#454545";
    ctx.fillText(
      "click to restart",
      canvasElement.width / 2,
      canvasElement.height / 2 + 35,
    );
    ctx.fillStyle = "black";
  }

  window.requestAnimationFrame(update_canvas);
}

// draws canvas, ground, user, obstacle, and score
function draw_canvas() {
  // fillRect( x, y, width, height)
  ctx.clearRect(0, 0, canvasElement.width, canvasElement.height); // clear canvas
  ctx.fillRect(ground_x, ground_y, canvasElement.width, ground_height); // draw ground
  //ctx.strokeRect(user_x, user_y, user_width, user_height); // draw user
  ctx.drawImage(img, user_x, user_y);
  ctx.drawImage(img_obstacle, obstacle_x, obstacle_y);
  //ctx.fillRect(obstacle_x, obstacle_y, obstacle_width, obstacle_height); // draw obstacle

  // print score
  ctx.font = "16px serif";
  ctx.textAlign = "end";
  ctx.fillText(`score: ${score}`, canvasElement.width - 10, 20);
}

function move_obstacle() {
  if (obstacle_x > -obstacle_width) {
    obstacle_x -= difficulty;
  } else {
    obstacle_x = canvasElement.width;
  }
}
