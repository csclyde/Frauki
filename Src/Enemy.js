Enemy = function(game, x, y, name) {
	Phaser.Sprite.call(this, game, x, y, name);
    game.physics.enable(this, Phaser.Physics.ARCADE);

    this.anchor.setTo(.5, 1);
    this.body.collideWorldBounds = true;
    this.body.maxVelocity.y = 500;
    this.SetDirection('left');
    this.state = null;

    if(!!this.types['Insectoid']) {
        this.types['Insectoid'](this);
    }

};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;
Enemy.prototype.types = {};

Enemy.prototype.create = function() {
	//use the type property to call the correct create function. that function will assign the update function


};

Enemy.prototype.update = function() {
	if(typeof this.updateFunction === 'function') {
		this.updateFunction.apply(this);
	} else {
		console.log('Enemy update function not found');
	}

    this.state();
};

Enemy.prototype.SetDirection = function(dir) {
    if(dir === 'left' && this.direction !== 'left') {
        this.direction = 'left';
        this.scale.x = -1;
    }
    else if(dir === 'right' && this.direction !== 'right') {
        this.direction = 'right';
        this.scale.x = 1;
    }
};

Enemy.prototype.PlayAnim = function(name) {
    if(this.animations.currentAnim.name !== name)
        this.animations.play(name);
};


//provide utility functions here that the specific enemies can all use