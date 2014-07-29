InputController = function(player) {
	this.player = player;

	this.jump 		= game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	this.up 		= game.input.keyboard.addKey(Phaser.Keyboard.UP);
	this.crouch 	= game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
	this.runLeft 	= game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
	this.runRight 	= game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
	this.slash		= game.input.keyboard.addKey(Phaser.Keyboard.Z);
	this.roll		= game.input.keyboard.addKey(Phaser.Keyboard.X);
	this.testButton = game.input.keyboard.addKey(Phaser.Keyboard.P);

  this.runLeft.onDown.add(function() { events.publish('player_run', {run:true, dir:'left'}); }, this);
  this.runLeft.onUp.add(function() { events.publish('player_run', {run:false, dir: 'left'}); }, this);
  this.runRight.onDown.add(function() { events.publish('player_run', {run:true, dir:'right'}); }, this);
  this.runRight.onUp.add(function() { events.publish('player_run', {run:false, dir: 'right'}); }, this);

	this.jump.onDown.add(function() { 	events.publish('player_jump', {jump: true}); }, this);
	this.jump.onUp.add(function() { 	events.publish('player_jump', {jump: false}); }, this);

	this.crouch.onDown.add(function() { events.publish('player_crouch', {crouch: true}); }, this);
	this.crouch.onUp.add(function() { 	events.publish('player_crouch', {crouch: false}); }, this);

	this.slash.onDown.add(function() { events.publish('player_slash', {}); }, this);

	this.roll.onDown.add(function() {	events.publish('player_roll', null, this)});
	this.up.onDown.add(function() { }, this);
	this.up.onUp.add(function() { }, this);

	game.input.gamepad.start();

	game.input.gamepad.addCallbacks(this, {
        onConnect: function(){
            console.log('gamepad connected');
            console.log(game.input.gamepad.pad2)
        },
        onDisconnect: function(){
            
        },
        onDown: function(buttonCode, value){
            events.publish('player_jump', {jump: true});
        },
        onUp: function(buttonCode, value){
            events.publish('player_jump', {jump: true});
        },
        onAxis: function(axisState) {
            
        },
        onFloat: function(buttonCode, value) {
            
        }
    });
};

InputController.prototype.UpdateInput = function() {

	if (this.runLeft.isDown) {
        this.player.Run({dir:'left'});
    }
    else if (this.runRight.isDown) {
        this.player.Run({dir:'right'});
    }
    else {
    	this.player.Run({dir:'still'});
    }
};

/*
var haveEvents = 'GamepadEvent' in window;
var controllers = {};
var rAF = window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.requestAnimationFrame;

function connecthandler(e) {
  addgamepad(e.gamepad);
}
function addgamepad(gamepad) {
  controllers[gamepad.index] = gamepad; var d = document.createElement("div");
  d.setAttribute("id", "controller" + gamepad.index);
  var t = document.createElement("h1");
  t.appendChild(document.createTextNode("gamepad: " + gamepad.id));
  d.appendChild(t);
  var b = document.createElement("div");
  b.className = "buttons";
  for (var i=0; i<gamepad.buttons.length; i++) {
    var e = document.createElement("span");
    e.className = "button";
    //e.id = "b" + i;
    e.innerHTML = i;
    b.appendChild(e);
  }
  d.appendChild(b);
  var a = document.createElement("div");
  a.className = "axes";
  for (i=0; i<gamepad.axes.length; i++) {
    e = document.createElement("progress");
    e.className = "axis";
    //e.id = "a" + i;
    e.setAttribute("max", "2");
    e.setAttribute("value", "1");
    e.innerHTML = i;
    a.appendChild(e);
  }
  d.appendChild(a);
  document.getElementById("start").style.display = "none";
  document.body.appendChild(d);
  rAF(updateStatus);
}

function disconnecthandler(e) {
  removegamepad(e.gamepad);
}

function removegamepad(gamepad) {
  var d = document.getElementById("controller" + gamepad.index);
  document.body.removeChild(d);
  delete controllers[gamepad.index];
}

function updateStatus() {
  scangamepads();
  for (j in controllers) {
    var controller = controllers[j];
    var d = document.getElementById("controller" + j);
    var buttons = d.getElementsByClassName("button");
    for (var i=0; i<controller.buttons.length; i++) {
      var b = buttons[i];
      var val = controller.buttons[i];
      var pressed = val == 1.0;
      if (typeof(val) == "object") {
        pressed = val.pressed;
        val = val.value;
      }
      var pct = Math.round(val * 100) + "%";
      b.style.backgroundSize = pct + " " + pct;
      if (pressed) {
        b.className = "button pressed";
      } else {
        b.className = "button";
      }
    }

    var axes = d.getElementsByClassName("axis");
    for (var i=0; i<controller.axes.length; i++) {
      var a = axes[i];
      a.innerHTML = i + ": " + controller.axes[i].toFixed(4);
      a.setAttribute("value", controller.axes[i] + 1);
    }
  }
  rAF(updateStatus);
}

function scangamepads() {
  var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
  for (var i = 0; i < gamepads.length; i++) {
    if (gamepads[i]) {
      if (!(gamepads[i].index in controllers)) {
        addgamepad(gamepads[i]);
      } else {
        controllers[gamepads[i].index] = gamepads[i];
      }
    }
  }
}

if (haveEvents) {
  window.addEventListener("gamepadconnected", connecthandler);
  window.addEventListener("gamepaddisconnected", disconnecthandler);
} else {
  setInterval(scangamepads, 500);
}
*/