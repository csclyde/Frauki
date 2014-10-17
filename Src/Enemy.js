Enemy = function(game, x, y, name) {
    //instantiate the sprite
    Phaser.Sprite.call(this, game, x, y, name);
    this.spriteType = 'enemy';
    
    //enable its physics body
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.collideWorldBounds = true;
    this.body.maxVelocity.y = 600;
    this.body.maxVelocity.x = 600;
    this.body.bounce.set(0.2);
    
    this.anchor.setTo(.5, 1);
    
    this.SetDirection('left');
    
    this.weight = 400;
    this.hitTimer = 0;
    this.flashing = false;

    this.energy = 7;
    this.damage = 5;

    this.vulnerableFrames = {};
    
    if(!!this.types[name]) {
        this.types[name].apply(this);
    } else {
        console.log('Enemy of type ' + name + ' was not found');
    }

    this.state = this.Idling;

    this.inScope = false;

    this.maxEnergy = this.energy;
    this.initialX = this.body.x;
    this.initialY = this.body.y;
};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;
Enemy.prototype.types = {};

Enemy.prototype.create = function() {

};

Enemy.prototype.update = function() {
    if(this.WithinCameraRange()) {
        //if they are in the camera range and not yet in the objectGroup, 
        //load them into the objectGroup, from the enemy pool
        if(this.parent === Frogland.enemyPool) {
            Frogland.objectGroup.addChild(this);
            this.body.enable = true;
        }
    } else {
        //if they are not in the camera range, and registered as within the
        //object group, take them out of the group
        if(this.parent === Frogland.objectGroup) {
            Frogland.enemyPool.addChild(this);
            this.body.enable = false;
        }
        return;
    }

    if(!!this.updateFunction) {
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
    
    if(this.energy > this.maxEnergy)
        this.energy = this.maxEnergy;
};

Enemy.prototype.GetEnergyPercentage = function() {
    return this.energy / this.maxEnergy;
};

Enemy.prototype.WithinCameraRange = function() {
    var padding = 100;

    if(this.body.x > game.camera.x - padding &&
       this.body.y > game.camera.y - padding &&
       this.body.x < game.camera.x + game.camera.width + padding &&
       this.body.y < game.camera.y + game.camera.height + padding)
        return true;

    return false;
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

Enemy.prototype.UpdateVulnerableFrame = function() {

};

Enemy.prototype.PlayAnim = function(name) {
    if(this.animations.currentAnim.name !== name)
        this.animations.play(name);
};

function EnemyHit(f, e) {
    if(e.state === e.Hurting || e.spriteType !== 'enemy')
        return;

    events.publish('camera_shake', {magnitudeX: 15, magnitudeY: 5, duration: 100});

    e.energy -= frauki.currentAttack.damage;
    if(e.energy <= 0) {
        if(!!e.Die)
            e.Die();

        frauki.LandKill();
        e.kill();
    } else {
        frauki.LandHit();
        e.TakeHit();
    }
    

    effectsController.ParticleSpray(e.body.x, e.body.y, e.body.width, e.body.height, 'red', e.PlayerDirection());

    var c = frauki.body.center.x < e.body.center.x ? 1 : -1;
    e.body.velocity.x =  c * e.weight * frauki.currentAttack.knockback * (frauki.currentAttack.damage / 2);
    
};

//provide utility functions here that the specific enemies can all use
Enemy.prototype.PlayerIsNear = function(radius) {
    var distX = frauki.body.center.x - this.body.center.x;
    var distY = frauki.body.center.y - this.body.center.y;

    var dist = Math.sqrt(distX * distX + distY * distY);

    if(dist <= radius)
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
};

Enemy.prototype.RollDice = function(sides, thresh) {
    var roll = Math.ceil(Math.random() * sides);

    if(roll >= thresh)
        return true;
    else
        return false;
};
