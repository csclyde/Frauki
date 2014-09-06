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

    this.initialX = this.body.x;
    this.initialY = this.body.y;

    this.energy = 7;

    if(!!this.types[name]) {
        this.types[name].apply(this);
    } else {
        console.log('Enemy of type ' + name + ' was not found');
    }

    this.hitParticles = game.add.emitter(0, 0, 100);
    this.hitParticles.makeParticles('HitParticles');
    this.hitParticles.gravity = -200;
    this.hitParticles.width = this.body.width;
    this.hitParticles.height = this.body.height;

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

    this.hitParticles.x = this.body.x;
    this.hitParticles.y = this.body.y;
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
    if(e.state === e.Hurting)
        return;

    cameraController.ScreenShake(15, 5, 100);

    frauki.GainEnergy();
    e.energy--;

    e.hitParticles.start(false, 2000, 5, 10, 10);

    if(e.PlayerDirection() === 'above') {
        e.hitParticles.minParticleSpeed.y = -200;
        e.hitParticles.maxParticleSpeed.y = -100;
    } else if(e.PlayerDirection() === 'below') {
        e.hitParticles.minParticleSpeed.y = 100;
        e.hitParticles.maxParticleSpeed.y = 200;
    } else if (e.PlayerDirection() === 'left') {
        e.hitParticles.minParticleSpeed.x = 100;
        e.hitParticles.maxParticleSpeed.x = 200;
    } else if (e.PlayerDirection() === 'right') {
        e.hitParticles.minParticleSpeed.x = -200;
        e.hitParticles.maxParticleSpeed.x = -100;
    }

    e.TakeHit();

    if(e.energy <= 0)
        e.kill();
};

//provide utility functions here that the specific enemies can all use
Enemy.prototype.PlayerIsNear = function(radius) {
    if(game.physics.arcade.distanceBetween(frauki, this) <= radius)
        return true;
    else
        return false;
};

Enemy.prototype.PlayerIsVisible = function() {

    if(!Phaser.Rectangle.intersects(game.camera.view, this.body))
        return;

    var ray = new Phaser.Line(playerX, playerY, this.body.x, this.body.y);
    var collideTiles = midgroundLayer.getRayCastTiles(ray, 1, true);

    if(collideTiles.length === 0) {
        return true;
    } else {
        return false;
    }
};

Enemy.prototype.PlayerDirection = function() {
    if(frauki.body.center.y < this.body.center.y)
        return 'above';
    if(frauki.body.center.x < this.body.center.x)
        return 'left';
    if(frauki.body.center.x > this.body.center.x)
        return 'right';
    if(frauki.body.center.y > this.body.center.y)
        return 'below';
}
