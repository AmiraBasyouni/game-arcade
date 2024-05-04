// assigning canvas and context to variables
const canvasElement = document.getElementById("game-canvas");
const ctx = canvasElement.getContext("2d");

// setting canvas dimensions
canvasElement.height = 500;
canvasElement.width = 500;

// game status;
let game_started = false;
let game_over = false;
let score = 0;

// position of obstacle
let pillar_obstacle = {
  x: canvasElement.width,
  y: 0,
  width: 60,
  height: canvasElement.height,
  gap_size: 80,
  gap_position: 0,
};

const INITIAL_USER_VELOCITY = 4; // prevents user from falling too quickly once game starts
const INITIAL_USER_X = 50;
const INITIAL_USER_Y = 150;

// position of user
const bird_img = new Image();
bird_img.src = "./bird.png";
let user = {
  x: INITIAL_USER_X,
  y: INITIAL_USER_Y,
  width: bird_img.width,
  height: bird_img.height,
  velocity: INITIAL_USER_VELOCITY,
};

const MIN_GAP_SIZE = user.height + 70;
const JUMP_UP_VELOCITY = 9;

const gravity = 1;

// event listeners
window.addEventListener("keydown", catch_keydown);
function catch_keydown(event) {
  // if spacebar is pressed
  if (event.keyCode == 32) {
    // start game once spacebar is pressed
    if (!game_started) {
      window.requestAnimationFrame(update_canvas);
      game_started = true;
    }
    // only respond to spacebar while within canvas and not game_over
    if (user.y < canvasElement.height && game_started && !game_over) {
      user.velocity = JUMP_UP_VELOCITY;
    }
  }
}

canvasElement.addEventListener("click", catch_click);
function catch_click(event) {
  if (game_over) {
    // I added 100 to account for user moving their hand from the mouse to the spacebar
    pillar_obstacle.x = canvasElement.width + 100;
    user.velocity = INITIAL_USER_VELOCITY * 2; // *2 for same reason
    user.x = INITIAL_USER_X;
    user.y = INITIAL_USER_Y;
    score = 0;
    game_over = false;
  }
}

function draw_pillar_obstacle(gap_y_position, gap_size) {
  if (gap_size < MIN_GAP_SIZE) {
    alert(
      "pillar height is insufficient, please increase gap size in game2.js",
    );
  }
  if (gap_y_position < 0 || gap_y_position > canvasElement - gap_size) {
    alert("gap is offscreen, please adjust gap's y position in game2.js");
  }
  ctx.fillRect(
    pillar_obstacle.x,
    pillar_obstacle.y,
    pillar_obstacle.width,
    gap_y_position,
  ); // top pillar
  ctx.fillRect(
    pillar_obstacle.x,
    gap_y_position + gap_size,
    pillar_obstacle.width,
    canvasElement.height - gap_y_position + gap_size,
  ); // bottom pillar
}

// renders canvas elements
function draw_canvas() {
  // fillRect(x, y, width, height)
  ctx.clearRect(0, 0, canvasElement.width, canvasElement.height); // clear canvas
  ctx.drawImage(bird_img, user.x, user.y);
  //ctx.fillRect(user.x, user.y, user.width, user.height);
  draw_pillar_obstacle(pillar_obstacle.gap_position, 120);
  draw_score();
}

function gravity_apply_falling(elem) {
  elem.y -= elem.velocity;
}

function gravity_adjust_fall_speed(elem) {
  if (elem.y < canvasElement.height) {
    elem.velocity -= gravity;
  } else {
    elem.velocity = 0;
  }
}

function within_x_position(obj1, obj2) {
  if (obj1.x < obj2.x && obj1.x + obj1.width > obj2.x) {
    //alert("1st cond");
    return true;
  }
  if (obj1.x == obj2.x) {
    //alert("obj1.x == obj2.x");
    return true;
  }
  if (obj1.x > obj2.x && obj1.x < obj2.x + obj2.width) {
    //alert("3rd cond");
    return true;
  }
}

function within_y_position(obj1, obj2) {
  if (obj1.y == obj2.y || (obj1.y > obj2.y && obj1.y < obj2.y + obj2.height)) {
    return true;
  }
}

function not_within_gap(obj1, obj2) {
  if (obj1.y < obj2.gap_position) {
    return true;
  }
  // I added 50 because the obj1.y + obj1.height probably was oddly larger than it should be
  // so I accounted for the error to the best of my ability
  if (obj1.y + obj1.height > obj2.gap_position + obj2.gap_size + 50) {
    //alert("cond2 not within gap");
    return true;
  }
}

// always assign obj1 to user
function pillar_collision_detected(obj1, obj2) {
  if (within_x_position(obj1, obj2) && not_within_gap(obj1, obj2)) {
    return true;
  }
}

function move_left(obj) {
  obj.x -= 5;
}

function offscreen_left(obj) {
  if (obj.x <= -obj.width) {
    return true;
  }
}

function position_right_offscreen(obj) {
  obj.x = canvasElement.width;
}

function update_canvas() {
  draw_canvas();
  // if obstacle went left offscreen, reposition to right offscreen
  if (offscreen_left(pillar_obstacle)) {
    position_right_offscreen(pillar_obstacle);
    score += 1;
    // assigns position of gap randomly between 0 and max gap position
    pillar_obstacle.gap_position =
      Math.random() * (canvasElement.height - pillar_obstacle.gap_size);
  }
  if (
    pillar_collision_detected(user, pillar_obstacle) ||
    user.y >= canvasElement.height
  ) {
    game_over = true;
  }
  if (game_over) {
    game_over_message();
  } else {
    gravity_apply_falling(user);
    gravity_adjust_fall_speed(user);
    move_left(pillar_obstacle);
  }
  window.requestAnimationFrame(update_canvas);
}

function game_over_message() {
  // writing game over
  ctx.font = "48px serif";
  ctx.textAlign = "center";
  ctx.fillStyle = "white";
  ctx.fillText("Game Over", canvasElement.width / 2, canvasElement.height / 2);
  ctx.fillStyle = "black";
  ctx.strokeText(
    "Game Over",
    canvasElement.width / 2,
    canvasElement.height / 2,
  );
  // writing click on canvas to restart
  ctx.font = "32px serif";
  ctx.fillStyle = "white";
  ctx.fillText(
    "click on canvas to restart",
    canvasElement.width / 2,
    canvasElement.height / 2 + 35,
  );
  ctx.strokeStyle = "#454545";
  ctx.strokeText(
    "click on canvas to restart",
    canvasElement.width / 2,
    canvasElement.height / 2 + 35,
  );
  ctx.strokeStyle = "black";
  ctx.fillStyle = "black";
}

function draw_startMessage() {
  ctx.font = "24px serif";
  ctx.fillStyle = "#454545";
  ctx.textAlign = "center";
  ctx.fillText(
    "press space to start",
    canvasElement.width / 2,
    canvasElement.height / 2,
  );
  ctx.fillStyle = "black";
}

function draw_score() {
  ctx.font = "16px serif";
  ctx.textAlign = "end";
  ctx.fillText(`score: ${score}`, canvasElement.width - 10, 20);
}

draw_canvas();
draw_startMessage();
