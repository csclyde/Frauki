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
    this.weight = 400;
    
    this.body.bounce.set(0.2);

    if(!!this.types[name]) {
        this.types[name].apply(this);
    } else {
        console.log('Enemy of type ' + name + ' was not found');
    }

    this.state = this.Idling;

    this.maxEnergy = this.energy;

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

    if(this.body.velocity.x > 0) {
        this.SetDirection('right');
    } else if(this.body.velocity.x < 0) {
        this.SetDirection('left');
    }

    this.alpha = this.GetEnergyPercentage();
};

Enemy.prototype.GetEnergyPercentage = function() {
    return this.energy / this.maxEnergy;
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

    events.publish('camera_shake', {magnitudeX: 15, magnitudeY: 5, duration: 100});

    energyController.AddEnergy();
    frauki.LandHit();
    
    //e.energy--;
    e.energy -= frauki.currentAttack.damage;

    effectsController.ParticleSpray(e.body.x, e.body.y, e.body.width, e.body.height, 'red', e.PlayerDirection());

    e.body.velocity.x =  c * e.weight * frauki.currentAttack.knockback;
    
    e.TakeHit();

    if(e.energy <= 0) {
        if(!!e.Die)
            e.Die();

        e.kill();
    }
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
