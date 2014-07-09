InputController = function(player) {
	this.player = player;

	this.jump 		= game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	this.up 		= game.input.keyboard.addKey(Phaser.Keyboard.UP);
	this.crouch 	= game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
	this.runLeft 	= game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
	this.runRight 	= game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
	this.sprint		= game.input.keyboard.addKey(Phaser.Keyboard.Z);

	this.jump.onDown.add(function() { 	events.publish('player_jump', {jump: true}); }, this);
	this.jump.onUp.add(function() { 	events.publish('player_jump', {jump: false}); }, this);
	this.crouch.onDown.add(function() { events.publish('player_crouch', {crouch: true}); }, this);
	this.crouch.onUp.add(function() { 	events.publish('player_crouch', {crouch: false}); }, this);
	this.sprint.onDown.add(function() { events.publish('player_sprint', {sprint: true}); }, this);
	this.sprint.onUp.add(function() { 	events.publish('player_sprint', {sprint: false}); }, this);
	this.up.onDown.add(function() { }, this);
	this.up.onUp.add(function() { }, this);
};

InputController.prototype.UpdateInput = function() {

    if (this.runLeft.isDown) {
        this.player.body.velocity.x = this.player.isSprinting ? -300 : -PLAYER_SPEED;
        this.player.SetDirection('left');
    }
    else if (this.runRight.isDown) {
        this.player.body.velocity.x = this.player.isSprinting ? 300 : PLAYER_SPEED;
        this.player.SetDirection('right');
    }
    else {
    	if(Math.abs(this.player.body.velocity.x) > PLAYER_SPEED)
    		game.add.tween(this.player.body.velocity).to({x:0}, 200, null, true);
    	else
    		this.player.body.velocity.x = 0;
    }
}