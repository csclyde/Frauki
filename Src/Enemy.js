Enemy = function(game, x, y, name) {
	Phaser.Sprite.call(this, game, x, y, name);
    game.physics.enable(this, Phaser.Physics.ARCADE);

    this.anchor.setTo(.5, 1);
    this.body.collideWorldBounds = true;
    this.body.maxVelocity.y = 500;
    this.direction = 'right';
    this.SetDirection('left');
    this.state = null;
    this.weight = 0;
    this.hitTimer = 0;
    this.flashing = false;

    if(!!this.types[name]) {
        this.types[name].apply(this);
    } else {
        console.log('Enemy of type ' + name + ' was not found');
    }

    this.state = this.Idling;

};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;
Enemy.prototype.types = {};

Enemy.prototype.create = function() {

};

Enemy.prototype.update = function() {
	if(typeof this.updateFunction === 'function') {
		this.updateFunction.apply(this);
	} 

    if(!!this.state)
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

function EnemyHit(f, e) {
    e.TakeHit();
};

//provide utility functions here that the specific enemies can all use
Enemy.prototype.PlayerIsNear = function(radius) {
    if(game.physics.arcade.distanceBetween(frauki, this) <= radius)
        return true;
    else
        return false;
};

Enemy.prototype.PlayerIsVisible = function() {

    if(!this.PlayerIsNear(600))
        return;

    var ray = new Phaser.Line(playerX, playerY, this.body.x, this.body.y);
    var collideTiles = midgroundLayer.getRayCastTiles(ray, 1, true);

    if(collideTiles.length === 0) {
        return true;
    } else {
        return false;
    }
};
