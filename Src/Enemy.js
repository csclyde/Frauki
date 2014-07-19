Enemy = function(game, x, y, name) {
	Phaser.Sprite.call(this, game, x, y, name);
    game.physics.enable(this, Phaser.Physics.ARCADE);
    
    this.anchor.setTo(.5, 1);
    this.body.collideWorldBounds = true;
    this.body.maxVelocity.y = 500;
    this.direction = 'right';

    this.updateFunction = null;

};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.create = function() {
	//use the type property to call the correct create function. that function will assign the update function
	Insectoid.Create.apply(this);

};

Enemy.prototype.update = function() {
	if(!!this.updateFunction) {
		this.updateFunction.apply(this);
	}
};

//provide utility functions here that the specific enemies can all use