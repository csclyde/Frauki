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

    if(!!this.types['Insectoid']) {
        this.types['Insectoid'].apply(this);
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

Enemy.prototype.TakeHit = function(f, e, kb) {

    //compute the velocity based on weight and attack knockback
    this.body.velocity.y = -300 + this.weight - kb;

    this.body.velocity.x = f.body.x < e.body.x ? -200 - (kb / 2) + (this.weight / 2) : 200 + (kb / 2) - (this.weight / 2);

    //a durability stat should modify how long they are stunned for. also, the amount of dmg
    this.hitTimer = this.game.time.now + 500;
};

//provide utility functions here that the specific enemies can all use
Enemy.prototype.PlayerIsNear = function(radius) {
    var ray = new Phaser.Line(playerX, playerY, this.body.x, this.body.y);

    if(ray.length > radius)
        return false;
    else
        return true;
};

Enemy.prototype.PlayerIsVisible = function() {
    if(playerX < this.body.x && this.direction === 'right')
        return false;

    if(playerX > this.body.x && this.direction === 'left')
        return false;

    if(this.PlayerIsNear(500)) {
        var ray = new Phaser.Line(playerX, playerY, this.body.x, this.body.y);
        var collideTiles = midgroundLayer.getRayCastTiles(ray, 1, true);

        if(collideTiles.length === 0) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
};