InputController = function(player) {
	this.player = player;
    this.timers = new TimerUtil();

	this.jump 		= game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	this.up 		= game.input.keyboard.addKey(Phaser.Keyboard.UP);
	this.crouch 	= game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
	this.runLeft 	= game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
	this.runRight 	= game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
	this.slash		= game.input.keyboard.addKey(Phaser.Keyboard.Z);
	this.roll		= game.input.keyboard.addKey(Phaser.Keyboard.X);
    this.pause      = game.input.keyboard.addKey(Phaser.Keyboard.Q);
	this.testButton = game.input.keyboard.addKey(Phaser.Keyboard.P);

    this.runLeft.onDown.add(function() { events.publish('player_run', {run:true, dir:'left'}); }, this);
    this.runLeft.onUp.add(function() { events.publish('player_run', {run:false, dir: 'left'}); }, this);
    this.runRight.onDown.add(function() { events.publish('player_run', {run:true, dir:'right'}); }, this);
    this.runRight.onUp.add(function() { events.publish('player_run', {run:false, dir: 'right'}); }, this);

    this.up.onDown.add(function() { events.publish('control_up', {pressed: true}); }, this);
    this.up.onUp.add(function() { events.publish('control_up', {pressed: false}); }, this);

    this.jump.onDown.add(function() {   events.publish('player_jump', {jump: true}); }, this);
    this.jump.onUp.add(function() {     events.publish('player_jump', {jump: false}); }, this);

    this.crouch.onDown.add(function() { events.publish('player_crouch', {crouch: true}); }, this);
    this.crouch.onUp.add(function() {   events.publish('player_crouch', {crouch: false}); }, this);

    this.slash.onDown.add(function() { 
        events.publish('player_slash', {});
    }, this);

    this.roll.onDown.add(function() {   events.publish('player_roll', null, this)});

    this.up.onDown.add(function() { 
        //switch between layers if they are in a doorway
        if(game.physics.arcade.overlap(frauki, Frogland.door1Group)) {
            if(Frogland.currentLayer === 3) Frogland.ChangeLayer(2);
            else if(Frogland.currentLayer === 2) Frogland.ChangeLayer(3);
        } else if(game.physics.arcade.overlap(frauki, Frogland.door2Group)) {
            if(Frogland.currentLayer === 3) Frogland.ChangeLayer(4);
            else if(Frogland.currentLayer === 4) Frogland.ChangeLayer(3);
        }
    });

    this.pause.onDown.add(function() {
        game.paused = !game.paused;
    });

    this.testButton.onDown.add(function() { 
        events.publish('stop_all_music');
    });

    game.input.gamepad.start();

    game.input.gamepad.addCallbacks(this, {
        onConnect: function(){
            console.log('gamepad connected');
            console.log(game.input.gamepad.pad2)
        },
        onDisconnect: function(){
            
        },
        onDown: function(buttonCode, value){
            //events.publish('player_jump', {jump: true});
        },
        onUp: function(buttonCode, value){
            //events.publish('player_jump', {jump: true});
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
