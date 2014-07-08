InputController = function(player) {
	this.player = player;

	this.jump 		= game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	this.up 		= game.input.keyboard.addKey(Phaser.Keyboard.UP);
	this.crouch 	= game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
	this.runLeft 	= game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
	this.runRight 	= game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

	this.jump.onDown.add(function() {
		events.publish('player_jump', null, this.player);
	}, this);

	this.jump.onUp.add(function() {

	}, this);

	this.crouch.onDown.add(function() {
		events.publish('player_crouch', {crouch: true}, this.player);
	}, this);

	this.crouch.onUp.add(function() {
		events.publish('player_crouch', {crouch: false}, this.player);
	}, this);

	this.up.onDown.add(function() {
	}, this);

	this.up.onUp.add(function() {
	}, this);
};

InputController.prototype.UpdateInput = function() {
	this.player.body.velocity.x = 0;

    if (this.runLeft.isDown)
    {
        this.player.body.velocity.x = -250;
        this.player.SetDirection('left');
    }
    else if (this.runRight.isDown)
    {
        this.player.body.velocity.x = 250;
        this.player.SetDirection('right');
    }
}