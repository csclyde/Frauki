InputController = function(player) {
	this.player = player;

	this.jump 		= game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	this.up 		= game.input.keyboard.addKey(Phaser.Keyboard.UP);
	this.crouch 	= game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
	this.runLeft 	= game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
	this.runRight 	= game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
	this.sprint		= game.input.keyboard.addKey(Phaser.Keyboard.Z);
	this.roll		= game.input.keyboard.addKey(Phaser.Keyboard.X);

	this.jump.onDown.add(function() { 	events.publish('player_jump', {jump: true}); }, this);
	this.jump.onUp.add(function() { 	events.publish('player_jump', {jump: false}); }, this);
	this.crouch.onDown.add(function() { events.publish('player_crouch', {crouch: true}); }, this);
	this.crouch.onUp.add(function() { 	events.publish('player_crouch', {crouch: false}); }, this);
	this.sprint.onDown.add(function() { events.publish('player_sprint', {sprint: true}); }, this);
	this.sprint.onUp.add(function() { 	events.publish('player_sprint', {sprint: false}); }, this);
	this.roll.onDown.add(function() {	events.publish('player_roll', null, this)});
	this.up.onDown.add(function() { }, this);
	this.up.onUp.add(function() { }, this);

	game.input.gamepad.addCallbacks(this, {
            onConnect: function(){
                console.log('gamepad connected');
            },
            onDisconnect: function(){
                
            },
            onDown: function(buttonCode, value){
                events.publish('player_jump', {jump: true});
            },
            onUp: function(buttonCode, value){
                events.publish('player_jump', {jump: true});
                console.log('Gamepad button pushed');
            },
            onAxis: function(axisState) {
                
            },
            onFloat: function(buttonCode, value) {
                
            }
        });
	
	game.input.gamepad.start();

    
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
}