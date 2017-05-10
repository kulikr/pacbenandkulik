// ************* View **********//
function changeView(toShow) {

  var viewDivs = $('.view');
  for (var index = 0; index < viewDivs.length; index++) {
    var element = viewDivs[index];
    $(element).css('visibility', 'hidden');
  }
  $("#" + toShow + "").css('visibility', 'visible');
}


var numDays = {
  '1': 31, '2': 28, '3': 31, '4': 30, '5': 31, '6': 30,
  '7': 31, '8': 31, '9': 30, '10': 31, '11': 30, '12': 31
};

function setDays(oMonthSel, oDaysSel, oYearSel) {
  var $this = $(this),
    label = $this.prev('label');
  label.removeClass('highlight');

  var nDays, oDaysSelLgth, opt, i = 1;
  nDays = numDays[oMonthSel[oMonthSel.selectedIndex].value];
  if (nDays == 28 && oYearSel[oYearSel.selectedIndex].value % 4 == 0)
    ++nDays;
  oDaysSelLgth = oDaysSel.length;
  if (nDays != oDaysSelLgth) {
    if (nDays < oDaysSelLgth)
      oDaysSel.length = nDays;
    else for (i; i < nDays - oDaysSelLgth + 1; i++) {
      opt = new Option(oDaysSelLgth + i, oDaysSelLgth + i);
      oDaysSel.options[oDaysSel.length] = opt;
    }
  }
}

//#endregion
class User {
  constructor(firstName, LastName, userName, email, password, birthDate) {
    this.firstName = firstName;
    this.LastName = LastName;
    this.userName = userName;
    this.email = email;
    this.password = password;
    this.birthDate = birthDate;
  }
}
// array of users
var users = [];
users[0] = new User("a", "a", "a", "a", "a", "a");
users[1] = new User("test2017", "test2017", "test2017", "test2017", "test2017", "test2017");
var activeUser = null;




/* validation *************************************************************************************************/

$.validator.addMethod("LettersAndDigits", function (user, element, regexpr) {
  var letterNumber = /^[0-9a-zA-Z]+$/;
  if (element.value.match(letterNumber)) {
    return true;
  }
  else {
    return false;
  }
}, "english letters and numbers only");

$.validator.addMethod("OneLetterAndDigit", function (user, element, regexpr) {
  var letterNumber = /[a-z].*[0-9]|[0-9].*[a-z]|[A-Z].*[0-9]|[0-9].*[A-Z]/i;
  if (element.value.match(letterNumber)) {
    return true;
  }
  else {
    return false;
  }
}, "contain at least one number and one letter");

$.validator.addMethod("onlyLetters", function (user, element, regexpr) {
  var letters = /^[a-zA-Z\s]*$/;
  if (element.value.match(letters)) {
    return true;
  }
  else {
    return false;
  }
}, "only english letters");

$.validator.addMethod("userNameFree", function (value, element) {
  var userName = value;
  for (var i = 0; i < users.length; i++) {
    var c = users[i].userName.localeCompare(userName);
    if (c == 0) {
      return false;
    }
  }
  return true;
}, "user name is taken");


$(function () {
  $("form[name='signup']").validate({
    // Specify validation rules
    rules: {
      firstName: {
        required: true,
        onlyLetters: true
      },
      lastName: {
        required: true,
        onlyLetters: true
      },
      email: {
        required: true,
        email: true
      },
      password: {
        required: true,
        LettersAndDigits: true,
        OneLetterAndDigit: true,
        minlength: 8,
      },
      userName: {
        required: true,
        userNameFree: true
      }
    },
    // Specify validation error messages
    messages: {
      firstName: {
        required: "Please enter your first name.",
        onlyLetters: "First name should contain only english letters."

      },
      lastName: {
        required: "Please enter your last name.",
        onlyLetters: "Last name should contain only english letters."
      },
      userName: {
        required: "Pleas enter your user name.",
        userNameFree: "User name is taken, choose another."
      },
      password: {
        required: "Please enter your password.",
        minlength: "Password must be at least 8 characters long.",
        OneLetterAndDigit: "Password must contain at least one number and one letter.",
        LettersAndDigits: "Password must be english letters and numbers only."
      },
      email: {
        email: "Please enter a valid email address.",
        required: "Please enter your email."
      }
    },

    errorPlacement: function (error, element) {
      error.addClass('invalid');
      error.appendTo(element.parent());
    },

    submitHandler: function (form) {
      // adding the new user
      var firstName = $(form).find('input[name="firstName"]').val();
      var lastName = $(form).find('input[name="lastName"]').val();
      var userName = $(form).find('input[name="userName"]').val();
      var password = $(form).find('input[name="password"]').val();
      var email = $(form).find('input[name="email"]').val();
      var birthDate = $("#month option:selected").val() + "." + $("#day option:selected").val() + "." + $("#year option:selected").val();
      userToAdd = new User(firstName, lastName, userName, email, password, birthDate);
      users[users.length] = userToAdd;
      activeUser = userToAdd;
      $("#label_user").text("Hi " + activeUser.userName);
      changeView('div_welcomeGame');
      form.submit();
    }
  });
});

/* login *************************************************************************************************/

function login() {
  var userName = $("#input_login_username").val();
  var password = $("#input_login_password").val();
  var found = false;
  var user;
  var index;
  //user dont exist
  for (index = 0; index < users.length && !(found); index++) {
    user = users[index];
    if (user.userName.localeCompare(userName) == 0)
      found = true;
  }

  if (!found) {
    alert("User name not found...");
    return;
  }

  if (user.password.localeCompare(password) != 0) {
    alert("Wrong password... (already forgot?)");
    return;
  }
  //wrong password
  activeUser = users[index - 1];
  $("#label_user").text("Hi " + activeUser.userName);
  changeView('div_welcomeGame');
}


/* GAME *****************************************************************************************************/

/******** Global  ********/
var board = [];
var ctx = canvas.getContext("2d");
var interval;
var numberOfMovements = 6;
var move_direction;
var current_direction;
var pacman_location;
var bonus_position;
var bonus_direction;
var move_counter;
var monstersPositions;
var monstersDirections;
var tunnel;
var isBonus;
var lives;
var score;
var time_elapsed;
var audio;
var numOfMonsters;
var total_food;
var total_time;
var wall_color;

function continueGame() {
  move_direction = 'stay';
  current_direction = 'stay';
  move_counter = numberOfMovements;
  pacman_location = new Object();
  bonus_position = new Object();
  bonus_direction = "left";
  tunnel = false;
  monstersPositions = [];
  monstersDirections = [];

  initKeysDown();
  locatePacman();
  locateMonsters(numOfMonsters);
  if (isBonus) {
    locateBonus();
  }
  Draw();

  setTimeout(function () { interval = setInterval(UpdatePosition, 35); }, 1500);

}

function Init_Board() {
  score = 0;
  game_time = total_time;
  //set values

  move_counter = numberOfMovements;
  move_direction = 'stay';
  current_direction = 'stay';
  pacman_location = new Object();
  bonus_position = new Object();
  bonus_direction = "left";
  tunnel = false;
  isBonus = true;
  monstersPositions = [];
  monstersDirections = [];
  start_time = new Date();
  initLives();

  var rawBoard = "5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,4,0,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,6k2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2k2,0,7,0,5,1,8,0,10,1,1,1,1,1,1,1,1,8,0,10,1,1,1,1,1,1,1,1,8,0,10,1,6,0,7,0,2k2,0,2,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,2,0,2k2,0,2,0,2,0,0,0,5,1,1,6,0,5,1,1,1,6,0,5,1,1,1,6,0,5,1,1,6,0,0,0,2,0,2,0,2k2,0,2,0,2,0,0,0,2,11,11,2,0,2,11,11,11,2,0,2,11,11,11,2,0,2,11,11,2,0,0,0,2,0,2,0,2k2,0,2,0,2,0,0,0,3,1,1,4,0,3,1,1,1,4,0,3,1,1,1,4,0,3,1,1,4,0,0,0,2,0,2,0,2k4,0,9,0,3,1,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,10,1,4,0,9,0,3k0,0,0,0,0,0,0,0,5,1,6,0,5,6,0,5,1,6,0,5,1,6,0,5,1,6,0,5,6,0,0,0,0,0,0,0,0k6,0,7,0,5,1,6,0,2,11,2,0,2,2,0,2,11,2,0,2,11,2,0,2,11,2,0,2,2,0,5,1,6,0,7,0,5k2,0,2,0,2,11,2,0,2,11,2,0,2,2,0,2,11,2,0,2,11,2,0,2,11,2,0,2,2,0,2,11,2,0,2,0,2k2,0,2,0,3,1,4,0,3,1,4,0,3,4,0,3,1,4,0,3,1,4,0,3,1,4,0,3,4,0,3,1,4,0,2,0,2k2,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,2k2,0,2,0,5,1,8,0,5,1,1,1,1,6,0,5,1,6,0,5,1,6,0,5,1,1,1,1,6,0,10,1,6,0,2,0,2k2,0,2,0,2,0,0,0,2,11,11,11,11,2,0,3,1,4,0,3,1,4,0,2,11,11,11,11,2,0,0,0,2,0,2,0,2k2,0,9,0,3,1,8,0,3,1,1,1,1,4,0,0,0,0,0,0,0,0,0,3,1,1,1,1,4,0,10,1,4,0,9,0,2k2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,1,6,0,5,1,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2k3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,4,11,2,0,2,11,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,4"
  var boardLines = rawBoard.split('k');
  for (var index = 0; index < boardLines.length; index++) {
    var line = boardLines[index].split(',');
    board.push(line);
  }

  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[i].length; j++) {
      if (board[i][j] == "0") {
        board[i][j] = 0;
      }
      if (board[i][j] == "1") {
        board[i][j] = 1;
      }
      if (board[i][j] == "2") {
        board[i][j] = 2;
      }
      if (board[i][j] == "3") {
        board[i][j] = 3;
      }
      if (board[i][j] == "4") {
        board[i][j] = 4;
      }
      if (board[i][j] == "5") {
        board[i][j] = 5;
      }
      if (board[i][j] == "6") {
        board[i][j] = 6;
      }
      if (board[i][j] == "7") {
        board[i][j] = 7;
      }
      if (board[i][j] == "8") {
        board[i][j] = 8;
      }
      if (board[i][j] == "9") {
        board[i][j] = 9;
      }
      if (board[i][j] == "10") {
        board[i][j] = 10;
      }
      if (board[i][j] == "11") {
        board[i][j] = 11;
      }
      if (board[i][j] == "food_25" || board[i][j] == "food_15" || board[i][j] == "food_5") {
        board[i][j] = 0;
      }
    }


  }
  var food_remain = total_food;
  locateFood(food_remain);
  locatePacman();
  locateMonsters(numOfMonsters);
  locateBonus();
  Draw();

  keysDown = {};
  initKeysDown();
  addEventListener("keydown", function (e) {
    initKeysDown();
    keysDown[e.keyCode] = true;
  }, false);

  audio = new Audio("./sounds/background_sound.mp3")
  audio.play();
  setTimeout(function () { interval = setInterval(UpdatePosition, 35); }, 1500);
}

function UpdatePosition() {

  move_direction = GetKeyPressed();


  if (move_counter == numberOfMovements) { //pacman arrived next cell
    pacman_location.x = Math.round(pacman_location.x);
    pacman_location.y = Math.round(pacman_location.y);
    setMonstersDirections();
    setBonusDirection();
    PacmanGoToTunnel();
    move_counter = 0;
    if (!tunnel) {
      updatePacmanCellArrival();
      if (pacman_location.y < 18 && !isLegalDirection()) {
        move_direction = 'stay';
      }
      current_direction = move_direction;
    }
  }

  if (current_direction == 'left') {
    pacman_location.x = pacman_location.x - 1 / numberOfMovements;
  }

  if (current_direction == 'right') {
    pacman_location.x = pacman_location.x + 1 / numberOfMovements;
  }

  if (current_direction == 'up') {
    pacman_location.y = pacman_location.y - 1 / numberOfMovements;
  }

  if (current_direction == 'down') {
    pacman_location.y = pacman_location.y + 1 / numberOfMovements;
  }

  for (var i = 0; i < monstersDirections.length; i++) {
    if (monstersDirections[i] == 'left') {
      monstersPositions[i].x = monstersPositions[i].x - 1 / numberOfMovements;
    }

    if (monstersDirections[i] == 'right') {
      monstersPositions[i].x = monstersPositions[i].x + 1 / numberOfMovements;
    }

    if (monstersDirections[i] == 'up') {
      monstersPositions[i].y = monstersPositions[i].y - 1 / numberOfMovements;
    }

    if (monstersDirections[i] == 'down') {
      monstersPositions[i].y = monstersPositions[i].y + 1 / numberOfMovements;
    }
  }

  if (isBonus) {
    moveBonus();
    eatBonus()
  }

  move_counter++;

  var currentTime = new Date();
  time_elapsed = (currentTime - start_time) / 1000;
  Draw();

  isGameOver();
}


function locateFood(food_remain) {
  var food_25 = food_remain * 0.1;
  var food_15 = food_remain * 0.3;
  var food_5 = food_remain - food_25 - food_15;

  while (food_remain > 0) {
    var emptyCell = findRandomEmptyCell(board);
    if (food_25 > 0) {
      board[emptyCell[0]][emptyCell[1]] = "food_25"; // 3==white coin
      food_25--;
    } else if (food_15 > 0) {
      board[emptyCell[0]][emptyCell[1]] = "food_15";
      food_15--;
    } else if (food_5 > 0) {
      board[emptyCell[0]][emptyCell[1]] = "food_5";
      food_5--;
    }
    food_remain--;
  }
}

function locatePacman() {
  var emptyCell = findRandomEmptyCell(board);
  pacman_location.y = 9;
  pacman_location.x = 18;
}

function locateBonus() {
  var emptyCell = findRandomEmptyCell(board);
  bonus_position.x = emptyCell[1];
  bonus_position.y = emptyCell[0];
}

function locateMonsters(numOfMonsters) {
  for (var index = 0; index < numOfMonsters; index++) {
    monstersDirections[index] = 'left';
    var position = new Object();
    if (index == 0) {
      position.x = 1;
      position.y = 1;
    }
    if (index == 1) {
      position.x = 35;
      position.y = 1;
    }
    if (index == 2) {
      position.x = 1;
      position.y = 16;
    }
    monstersPositions[index] = position;
  }

}

function initLives() {
  lives = 2;
  $('#lives').append("<img id='life1' src='pics/pacman.png' width='30' height='30'/><img id='life2' src='pics/pacman.png' width='30' height='30'/>");
}

function initKeysDown() {
  keysDown[37] = false;
  keysDown[38] = false;
  keysDown[39] = false;
  keysDown[40] = false;
}

function findRandomEmptyCell(board) {
  var i;
  var j;
  do {
    i = Math.floor((Math.random() * 17));
    j = Math.floor((Math.random() * 37));
  } while (board[i][j] != 0 && !(i == 9 && j == 18))
  return [i, j];
}

function GetKeyPressed() {
  if (keysDown[38]) {
    keysDown[37] = false;
    keysDown[39] = false;
    keysDown[40] = false;
    return 'up';
  }
  if (keysDown[40]) {
    keysDown[37] = false;
    keysDown[38] = false;
    keysDown[39] = false;
    return 'down';
  }
  if (keysDown[37]) {
    keysDown[38] = false;
    keysDown[39] = false;
    keysDown[40] = false;
    return 'left';
  }
  if (keysDown[39]) {
    keysDown[37] = false;
    keysDown[38] = false;
    keysDown[40] = false;
    return 'right';
  }
  return 'stay';
}

function setBonusDirection() {
  bonus_position.x = Math.round(bonus_position.x);
  bonus_position.y = Math.round(bonus_position.y);

  var directions = getBonusDirections();
  if (directions.length == 1) {
    bonus_direction = directions[0];
    return;
  }
  var opposite;
  if (bonus_direction == "right") {
    opposite = "left";
  }
  if (bonus_direction == "left") {
    opposite = "right";
  }
  if (bonus_direction == "up") {
    opposite = "down";
  }
  if (bonus_direction == "down") {
    opposite = "up";
  }
  var newDirection;
  do {
    newDirection = directions[Math.round((Math.random() * (directions.length - 1)))];
  } while (newDirection == opposite)
  bonus_direction = newDirection;
}

function getBonusDirections() {
  var direction = [];

  if (bonus_position.x != 0 && !isOutOfBounds(bonus_position, "left") && !isWall(bonus_position, "left")) {
    direction[direction.length] = "left";
  }
  if (bonus_position.x != 36 && !isOutOfBounds(bonus_position, "right") && !isWall(bonus_position, "right")) {
    direction[direction.length] = "right";
  }
  if (bonus_position.y != 0 && !isOutOfBounds(bonus_position, "up") && !isWall(bonus_position, "up")) {
    direction[direction.length] = "up";
  }
  if (bonus_position.y != 17 && !isOutOfBounds(bonus_position, "down") && !isWall(bonus_position, "down")) {
    direction[direction.length] = "down";
  }
  return direction;
}

function moveBonus() {
  if (bonus_direction == 'left') {
    bonus_position.x = bonus_position.x - 1 / numberOfMovements;
  }

  if (bonus_direction == 'right') {
    bonus_position.x = bonus_position.x + 1 / numberOfMovements;
  }

  if (bonus_direction == 'up') {
    bonus_position.y = bonus_position.y - 1 / numberOfMovements;
  }

  if (bonus_direction == 'down') {
    bonus_position.y = bonus_position.y + 1 / numberOfMovements;
  }
}

function isInt(n) {
  return Number(n) === n && n % 1 === 0;
}

function isNumber(n) {
  return Number(n) === n;
}

function PacmanGoToTunnel() {
  if (pacman_location.x < 0) {
    pacman_location.x = 36 + (numberOfMovements - 1) / numberOfMovements;
    tunnel = true;
    return;
  }
  if (pacman_location.x > 36) {
    pacman_location.x = 0 - (numberOfMovements - 1) / numberOfMovements;
    tunnel = true;
    return;
  }
  if (pacman_location.y < 0) {
    pacman_location.y = 17 + (numberOfMovements - 1) / numberOfMovements;
    tunnel = true;
    return;
  }
  if (pacman_location.y > 17) {
    pacman_location.y = 0 - (numberOfMovements - 1) / numberOfMovements;
    tunnel = true;
    return;
  }
  tunnel = false;
}

function updatePacmanCellArrival() {
  if (pacman_location.x < 0 || pacman_location.x > 36 || pacman_location.y < 0 || pacman_location.y > 17) {
    return;
  }
  if (board[pacman_location.y][pacman_location.x] == "food_5") {
    score = score + 5;
    board[pacman_location.y][pacman_location.x] = 0;
  }
  else if (board[pacman_location.y][pacman_location.x] == "food_15") {
    score = score + 15;
    board[pacman_location.y][pacman_location.x] = 0;
  }
  else if (board[pacman_location.y][pacman_location.x] == "food_25") {
    score = score + 25;
    board[pacman_location.y][pacman_location.x] = 0;
  }
}

function isLegalDirection() {
  if (!isWall(pacman_location, move_direction))
    return true;
  else
    return false;
}

function isWall(position, direction) {
  if (direction == 'left') {
    if (position.x > 0 && isNumber(board[position.y][position.x - 1]) && board[position.y][position.x - 1] != 0) {
      return true;
    }
  }
  if (direction == 'right') {
    if (position.x < 36 && isNumber(board[position.y][position.x + 1]) && board[position.y][position.x + 1] != 0) {
      return true;
    }
  }
  if (direction == 'up') {
    if (position.y > 0 && isNumber(board[position.y - 1][position.x]) && board[position.y - 1][position.x] != 0) {
      return true;
    }
  }
  if (direction == 'down') {
    if (position.y < 17 && isNumber(board[position.y + 1][position.x]) && board[position.y + 1][position.x] != 0) {
      return true;
    }
  }
  return false;
}

function setMonstersDirections() {
  for (var i = 0; i < monstersPositions.length; i++) {
    monstersPositions[i].x = Math.round(monstersPositions[i].x);
    monstersPositions[i].y = Math.round(monstersPositions[i].y);
  }

  for (var index = 0; index < monstersDirections.length; index++) {
    var directions = getPossibleDirections(index);
    if (directions.length == 1) {
      monstersDirections[index] = directions[0];
      continue;
    }
    var distance = getDistance(index);
    if (distance < 20) {
      chase(index, directions);
    }
    else {
      randomMovement(index, directions);
    }
  }
}

function chase(i, directions) {
  var toMove = [];
  if (pacman_location.x < monstersPositions[i].x && directions.indexOf("left") != -1) {
    toMove[toMove.length] = "left";
  }
  if (pacman_location.x > monstersPositions[i].x && directions.indexOf("right") != -1) {
    toMove[toMove.length] = "right";
  }
  if (pacman_location.y < monstersPositions[i].y && directions.indexOf("up") != -1) {
    toMove[toMove.length] = "up";
  }
  if (pacman_location.y > monstersPositions[i].y && directions.indexOf("down") != -1) {
    toMove[toMove.length] = "down";
  }
  if (toMove.length == 0) {
    randomMovement(i, directions);
  }
  else {
    monstersDirections[i] = toMove[Math.round((Math.random() * (toMove.length - 1)))];
  }
}

function getPossibleDirections(i) {
  var direction = [];

  if (monstersPositions[i].x != 0 && !isOutOfBounds(monstersPositions[i], "left") && !isWallMonster(i, "left")) {
    direction[direction.length] = "left";
  }
  if (monstersPositions[i].x != 36 && !isOutOfBounds(monstersPositions[i], "right") && !isWallMonster(i, "right")) {
    direction[direction.length] = "right";
  }
  if (monstersPositions[i].y != 0 && !isOutOfBounds(monstersPositions[i], "up") && !isWallMonster(i, "up")) {
    direction[direction.length] = "up";
  }
  if (monstersPositions[i].y != 17 && !isOutOfBounds(monstersPositions[i], "down") && !isWallMonster(i, "down")) {
    direction[direction.length] = "down";
  }
  return direction;
}

function isWallMonster(i, direction) {
  var board_val;
  if (direction == 'left') {
    board_val = board[monstersPositions[i].y][monstersPositions[i].x - 1];
  }
  if (direction == 'right') {
    board_val = board[monstersPositions[i].y][monstersPositions[i].x + 1];
  }
  if (direction == 'up') {
    board_val = board[monstersPositions[i].y - 1][monstersPositions[i].x];
  }
  if (direction == 'down') {
    board_val = board[monstersPositions[i].y + 1][monstersPositions[i].x];
  }
  if (isNumber(board_val) && board_val != 0) {
    return true;
  }
  return false;
}

function isOutOfBounds(position, direction) {
  if (direction == 'left') {
    if (position.x - 1 < 0) {
      return true;
    }
  }
  if (direction == 'right') {
    if (position.x + 1 > 36) {
      return true;
    }
  }
  if (direction == 'up') {
    if (position.y - 1 < 0) {
      return true;
    }
  }
  if (direction == 'down') {
    if (position.y + 1 > 17) {
      return true;
    }
  }
  return false;
}

function getDistance(i) {
  return Math.abs(pacman_location.x - monstersPositions[i].x) + Math.abs(pacman_location.y - monstersPositions[i].y);
}

function randomMovement(i, directions) {
  var opposite;
  if (monstersDirections[i] == "right") {
    opposite = "left";
  }
  if (monstersDirections[i] == "left") {
    opposite = "right";
  }
  if (monstersDirections[i] == "up") {
    opposite = "down";
  }
  if (monstersDirections[i] == "down") {
    opposite = "up";
  }
  var newDirection;
  do {
    newDirection = directions[Math.round((Math.random() * (directions.length - 1)))];
  } while (newDirection == opposite)
  monstersDirections[i] = newDirection;
}

function isGameOver() {
  if (Math.round(game_time - time_elapsed) <= 0) {
    window.clearInterval(interval);
    audio.pause();
    if (score < 150) {
      gameover_modal.style.display = "block";
      $("#label_gameover1").text("You can do better!");
      $("#label_gameover2").text("Your score is: " + score + "");
    }
    else {
      gameover_modal.style.display = "block";
      $("#label_gameover1").text("We Have a Winner!");
      $("#label_gameover2").text("Your score is: " + score + "");
    }
    return;
  }
  for (var i = 0; i < monstersPositions.length; i++) {
    var xDistance = Math.abs(monstersPositions[i].x - pacman_location.x);
    var yDistance = Math.abs(monstersPositions[i].y - pacman_location.y);
    if (xDistance < 1 / numberOfMovements && yDistance < 1 / numberOfMovements) {

      if (lives > 0) {
        lifeDown();
        window.clearInterval(interval);
        continueGame();
      }
      else {
        audio.pause();
        window.clearInterval(interval);
        gameover_modal.style.display = "block";
        $("#label_gameover1").text("You Lost!");
        $("#label_gameover2").text("Better Luck Next Time...");

      }
    }

  }
}

function lifeDown() {
  var life_id = 'life' + lives + '';
  var life_x = document.getElementById(life_id);
  if (life_x != null) {
    life_x.parentNode.removeChild(life_x);
    lives--;
    if (lives == 0) {
      $('#lives').addClass("no_lives");
    }
  }
}

function eatBonus() {
  var xDistance = Math.abs(bonus_position.x - pacman_location.x);
  var yDistance = Math.abs(bonus_position.y - pacman_location.y);
  if (xDistance < 1 / numberOfMovements && yDistance < 1 / numberOfMovements) {
    score += 50;
    isBonus = false;
  }
}

function restart_click() {
  window.clearInterval(interval);
  while (lives > 0) {
    var life_id = 'life' + lives + '';
    var life_x = document.getElementById(life_id);
    life_x.parentNode.removeChild(life_x);
    lives--;
  }
  Init_Board();
}

/* Draw functions *************************************************************************************/

function Draw() {
  canvas.width = canvas.width; //clean board

  var $score = $("#input_score");
  $score.text('' + score + '');
  var $time = $("#input_time");
  $time.text('' + Math.round(game_time - time_elapsed) + '');

  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[i].length; j++) {
      var center = new Object();
      center.y = i * 20 + 10;
      center.x = j * 20 + 10;

      if (board[i][j] == 1) {
        drawHorizontalWall(i, j);// "wall_horizontal";
      }
      if (board[i][j] == 2) {
        drawVerticalWall(i, j);
      }
      if (board[i][j] == 3) {
        drawBottomLeftCornerWall(i, j);
      }
      if (board[i][j] == 4) {
        drawBottomRightCornerWall(i, j);
      }
      if (board[i][j] == 5) {
        drawTopLeftCornerWall(i, j)
      }
      if (board[i][j] == 6) {
        drawTopRightCornerWall(i, j);
      }
      if (board[i][j] == 7) {
        drawUpperU(i, j);
      }
      if (board[i][j] == 8) {
        drawRightU(i, j);
      }
      if (board[i][j] == 9) {
        drawDownU(i, j);
      }
      if (board[i][j] == 10) {
        drawLeftU(i, j);
      }
      if (board[i][j] == "food_25") {
        drawFood25(center);
      }
      if (board[i][j] == "food_15") {
        drawFood15(center);
      }
      if (board[i][j] == "food_5") {
        drawFood5(center);
      }
      if (board[i][j] == "monster1") {
        drawMonster1(center);
      }
      if (board[i][j] == "monster2") {
        drawMonster2(center);
      }
    }
  }
  drawPacman();
  drawMonsters();
  if (isBonus) {
    drawBonus();
  }
}

function drawHorizontalWall(row, column) {
  ctx.beginPath();
  ctx.lineWidth = 12;
  ctx.strokeStyle = wall_color;
  ctx.moveTo(0 + column * 20, 10 + row * 20);
  ctx.lineTo(20 + column * 20, 10 + row * 20);
  ctx.stroke();
}

function drawVerticalWall(row, column) {
  ctx.beginPath();
  ctx.lineWidth = 12;
  ctx.strokeStyle = wall_color;
  ctx.moveTo(10 + column * 20, 0 + row * 20);
  ctx.lineTo(10 + column * 20, 20 + row * 20);
  ctx.stroke();
}

function drawTopRightCornerWall(row, column) {
  ctx.beginPath();
  ctx.lineWidth = 12;
  ctx.strokeStyle = wall_color;
  ctx.beginPath();
  ctx.moveTo(0 + column * 20, 10 + row * 20);
  ctx.lineTo(4 + column * 20, 10 + row * 20);
  ctx.arcTo(10 + column * 20, 10 + row * 20, 10 + column * 20, 16 + row * 20, 3);
  ctx.lineTo(10 + column * 20, 20 + row * 20);
  ctx.stroke();
}

function drawBottomRightCornerWall(row, column) {
  ctx.beginPath();
  ctx.lineWidth = 12;
  ctx.strokeStyle = wall_color;
  ctx.beginPath();
  ctx.moveTo(0 + column * 20, 10 + row * 20);
  ctx.lineTo(4 + column * 20, 10 + row * 20);
  ctx.arcTo(10 + column * 20, 10 + row * 20, 10 + column * 20, 4 + row * 20, 3);
  ctx.lineTo(10 + column * 20, 0 + row * 20);
  ctx.stroke();
}

function drawBottomLeftCornerWall(row, column) {
  ctx.beginPath();
  ctx.lineWidth = 12;
  ctx.strokeStyle = wall_color;
  ctx.beginPath();
  ctx.moveTo(10 + column * 20, 0 + row * 20);
  ctx.lineTo(10 + column * 20, 4 + row * 20);
  ctx.arcTo(10 + column * 20, 10 + row * 20, 16 + column * 20, 10 + row * 20, 3);
  ctx.lineTo(20 + column * 20, 10 + row * 20);
  ctx.stroke();
}

function drawTopLeftCornerWall(row, column) {
  ctx.lineWidth = 12;
  ctx.strokeStyle = wall_color;
  ctx.beginPath();
  ctx.moveTo(10 + column * 20, 20 + row * 20);
  ctx.lineTo(10 + column * 20, 16 + row * 20);
  ctx.arcTo(10 + column * 20, 10 + row * 20, 16 + column * 20, 10 + row * 20, 3);
  ctx.lineTo(20 + column * 20, 10 + row * 20);
  ctx.stroke();
}

function drawRightU(row, column) {
  ctx.beginPath();
  ctx.lineWidth = 12;
  ctx.strokeStyle = wall_color;
  ctx.moveTo(0 + column * 20, 10 + row * 20);
  ctx.lineTo(10 + column * 20, 10 + row * 20);
  ctx.stroke();
  ctx.beginPath();
  ctx = canvas.getContext("2d");
  ctx.lineWidth = 1;
  ctx.strokeStyle = wall_color;
  ctx.arc(10 + column * 20, 10 + row * 20, 5.5, (1.5 * Math.PI), (0.5 * Math.PI));
  ctx.fillStyle = wall_color;
  ctx.arc(10 + column * 20, 10 + row * 20, 5.5, 0, Math.PI);
  ctx.fill();
}

function drawDownU(row, column) {
  ctx.beginPath();
  ctx.lineWidth = 12;
  ctx.strokeStyle = wall_color;
  ctx.moveTo(10 + column * 20, 0 + row * 20);
  ctx.lineTo(10 + column * 20, 10 + row * 20);
  ctx.stroke();
  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.strokeStyle = wall_color;
  ctx.arc(10 + column * 20, 10 + row * 20, 5.5, 0, Math.PI);
  ctx.fillStyle = wall_color;
  ctx.arc(10 + column * 20, 10 + row * 20, 5.5, 0, Math.PI);
  ctx.fill();
}

function drawUpperU(row, column) {
  ctx.beginPath();
  ctx.lineWidth = 12;
  ctx.strokeStyle = wall_color;
  ctx.moveTo(10 + column * 20, 20 + row * 20);
  ctx.lineTo(10 + column * 20, 10 + row * 20);
  ctx.stroke();
  ctx.beginPath();
  ctx = canvas.getContext("2d");
  ctx.lineWidth = 1;
  ctx.strokeStyle = wall_color;
  ctx.arc(10 + column * 20, 10 + row * 20, 5.5, Math.PI, 2 * Math.PI);
  ctx.fillStyle = wall_color;
  ctx.fill();
}

function drawLeftU(row, column) {
  ctx.beginPath();
  ctx.lineWidth = 12;
  ctx.strokeStyle = wall_color;
  ctx.moveTo(20 + column * 20, 10 + row * 20);
  ctx.lineTo(10 + column * 20, 10 + row * 20);
  ctx.stroke();
  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.strokeStyle = wall_color;
  ctx.arc(10 + column * 20, 10 + row * 20, 5.5, 0.5 * (Math.PI), 1.5 * (Math.PI));
  ctx.fillStyle = wall_color;
  ctx.fill();
}

function drawPacman(center) {
  if (current_direction == 'right' || current_direction == 'stay') {
    ctx.beginPath();
    ctx.arc(pacman_location.x * 20 + 10, pacman_location.y * 20 + 10, 10, 0.25 * Math.PI, 1.25 * Math.PI, false);
    ctx.fillStyle = "rgb(255, 255, 0)";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(pacman_location.x * 20 + 10, pacman_location.y * 20 + 10, 10, 0.75 * Math.PI, 1.75 * Math.PI, false);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(pacman_location.x * 20 + 10, pacman_location.y * 20 + 10 * 0.55, 1, 0, 2 * Math.PI, false);
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fill();
  }
  if (current_direction == 'left') {
    ctx.beginPath();
    ctx.arc(pacman_location.x * 20 + 10, pacman_location.y * 20 + 10, 10, 1.75 * Math.PI, 0.75 * Math.PI, false);
    ctx.fillStyle = "rgb(255, 255, 0)";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(pacman_location.x * 20 + 10, pacman_location.y * 20 + 10, 10, 1.25 * Math.PI, 0.25 * Math.PI, false);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(pacman_location.x * 20 + 10, pacman_location.y * 20 + 10 * 0.55, 1, 0, 2 * Math.PI, false);
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fill();
  }
  if (current_direction == 'up') {
    ctx.beginPath();
    ctx.arc(pacman_location.x * 20 + 10, pacman_location.y * 20 + 10, 10, 1.75 * Math.PI, 0.75 * Math.PI, false);
    ctx.fillStyle = "rgb(255, 255, 0)";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(pacman_location.x * 20 + 10, pacman_location.y * 20 + 10, 10, 0.25 * Math.PI, 1.25 * Math.PI, false);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(pacman_location.x * 20 + 10 * 0.55, pacman_location.y * 20 + 10, 1, 0, 2 * Math.PI, false);
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fill();
  }
  if (current_direction == 'down') {
    ctx.beginPath();
    ctx.arc(pacman_location.x * 20 + 10, pacman_location.y * 20 + 10, 10, 1.25 * Math.PI, 0.25 * Math.PI, false);
    ctx.fillStyle = "rgb(255, 255, 0)";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(pacman_location.x * 20 + 10, pacman_location.y * 20 + 10, 10, 0.75 * Math.PI, 1.75 * Math.PI, false);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(pacman_location.x * 20 + 10 * 1.55, pacman_location.y * 20 + 10, 1, 0, 2 * Math.PI, false);
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fill();
  }
}

function drawFood15(position) {
  ctx.beginPath();
  ctx.arc(position.x, position.y, 7, 0, 2 * Math.PI);
  ctx.fillStyle = "darkgreen";
  ctx.fill();

  ctx.font = "bold 9px Comic Sans MS";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText("15", position.x, position.y + 4);
}

function drawFood25(position) {
  ctx.beginPath();
  ctx.arc(position.x, position.y, 9, 0, 2 * Math.PI);
  ctx.fillStyle = "darkred";
  ctx.fill();

  ctx.font = "bold 10px Comic Sans MS";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText("25", position.x, position.y + 3);
}

function drawFood5(position) {
  ctx.beginPath();
  ctx.arc(position.x, position.y, 6, 0, 2 * Math.PI);
  ctx.fillStyle = "blue";
  ctx.fill();

  ctx.font = "bold 10px Comic Sans MS";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText("5", position.x, position.y + 3);
}

function drawMonsters() {
  for (var index = 0; index < monstersPositions.length; index++) {
    drawMonster(index);
  }
}

function drawMonster(index) {
  var imageName = "./pics/monster_" + index + ".png";
  var imageObject = new Image();
  imageObject.src = imageName;
  imageObject.width = "20px";
  imageObject.height = "20px";
  ctx.drawImage(imageObject, monstersPositions[index].x * 20, monstersPositions[index].y * 20, 20, 20);
}

function drawBonus() {
  var imageName = "./pics/bonus.png";
  var imageObject = new Image();
  imageObject.src = imageName;
  imageObject.width = "20px";
  imageObject.height = "20px";
  ctx.drawImage(imageObject, bonus_position.x * 20, bonus_position.y * 20, 20, 20);
}

function setValues(points, monsters, time, wall) {
  numOfMonsters = monsters.value;
  total_food = points.value;
  total_time = time.value;
  wall_color = wall.value;
}


/****************ABOUT  */

var modal = document.getElementById('div_about');

var btn = document.getElementById("button_menuAbout");

var span = document.getElementsByClassName("close")[0];

btn.onclick = function () {
  modal.style.display = "block";
}

span.onclick = function () {
  modal.style.display = "none";
}

function changeSettings() {
  window.clearInterval(interval);
  while (lives > 0) {
    var life_id = 'life' + lives + '';
    var life_x = document.getElementById(life_id);
    life_x.parentNode.removeChild(life_x);
    lives--;
  }
  changeView('div_welcomeGame');
}

function Start() {
  changeView('div_welcome');
}

function startGame(points, monsters, time, wall) {
  changeView('div_game');
  setValues(points, monsters, time, wall);
  Init_Board();
}

function logout() {
  audio.pause();
  window.clearInterval(interval);
  while (lives > 0) {
    var life_id = 'life' + lives + '';
    var life_x = document.getElementById(life_id);
    life_x.parentNode.removeChild(life_x);
    lives--;
  }
  activeUser = null;
  $("#label_user").text("");
  changeView('div_welcome');
}

/************** Game Over *****************/

var gameover_modal = document.getElementById('div_gameover');


var gameover_span = document.getElementsByClassName("close")[1];


gameover_span.onclick = function () {
  gameover_modal.style.display = "none";
}