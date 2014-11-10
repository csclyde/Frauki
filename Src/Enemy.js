Enemy = function(game, x, y, name) {
    //instantiate the sprite
    Phaser.Sprite.call(this, game, x, y, 'EnemySprites');
    this.spriteType = 'enemy';
    
    //enable its physics body
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.collideWorldBounds = true;
    this.body.maxVelocity.y = 600;
    this.body.maxVelocity.x = 600;
    this.body.bounce.set(0.2);

    this.timers = new TimerUtil();
    
    this.SetDefaultValues();
    
    if(!!this.types[name]) {
        this.types[name].apply(this);
    } else {
        console.log('Enemy of type ' + name + ' was not found');
    }

    this.state = this.Idling;

    //capture any initial values that were set in the specific enemy set up
    this.maxEnergy = this.energy;
    this.initialX = this.body.center.x;
    this.initialY = this.body.center.y;
    this.initialPoise = this.poise;

    this.xHitVel = 0;
};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;
Enemy.prototype.types = {};

Enemy.prototype.create = function() {

};

Enemy.prototype.SetDefaultValues = function() {
    this.anchor.setTo(.5, 1);
    this.SetDirection('left');
    this.weight = 0.5;
    this.hitTimer = 0;
    this.energy = 5;
    this.damage = 5;
    this.inScope = false;
    this.baseStunDuration = 500;
    this.stunModifier = 1.0;
    this.poise = 10;
};

Enemy.prototype.UpdateFunction = function() {};
Enemy.prototype.Idling = function() {};
Enemy.prototype.Hurting = function() {};
Enemy.prototype.Die = function() {};
Enemy.prototype.Vulnerable = function() { return true; }
Enemy.prototype.Act = function() {};

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

    this.updateFunction();
    this.state();

    if(this.xHitVel === 0) {
        if(this.body.velocity.x > 0) {
            this.SetDirection('right');
        } else if(this.body.velocity.x < 0) {
            this.SetDirection('left');
        }
    }

    this.alpha = this.GetEnergyPercentage();
    
    if(this.energy > this.maxEnergy)
        this.energy = this.maxEnergy;

    this.stunModifier += 0.005;

    if(this.timers.TimerUp('poise_ticker')) {
        this.poise += 1.25;
        this.timers.SetTimer('poise_ticker', 250);
    }

    if(this.stunModifier > 1.0) this.stunModifier = 1.0;

    if(this.poise > this.initialPoise) this.poise = this.initialPoise;
    if(this.poise < 0) this.poise = 0;

    if(this.xHitVel !== 0) {
        this.body.velocity.x = this.xHitVel;
    }

};

Enemy.prototype.GetEnergyPercentage = function() {
    return 0.25 + ((this.energy / this.maxEnergy) * 0.75);
};

Enemy.prototype.GetPoisePercentage = function() {
    console.log(this.poise + '/' + this.initialPoise);
    return this.poise / this.initialPoise;
}

Enemy.prototype.WithinCameraRange = function() {
    var padding = 200;

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

Enemy.prototype.PlayAnim = function(name) {
    if(this.animations.currentAnim.name !== name)
        this.animations.play(name);
};


function EnemyHit(f, e) {
    if(e.spriteType !== 'enemy' || e.state === e.Hurting || !e.Vulnerable())
        return;

    //seperate conditional to prevetn crash!
    if(!e.timers.TimerUp('hit'))
        return;

    var numParticles = frauki.currentAttack.damage * 2;

    var c = frauki.body.center.x < e.body.center.x ? 1 : -1;
    e.xHitVel = c * (50 - (e.weight * 300) + (1000 * frauki.currentAttack.knockback));

    game.add.tween(e).to({xHitVel: 0}, 800, Phaser.Easing.Exponential.Out, true);

    //if(c < 0 && e.body.velocity.x > 0) e.body.velocity.x = 0;
    //if(c > 0 && e.body.velocity.x < 0) e.body.velocity.x = 0;
    //compute the velocity based on weight and attack knockback

    events.publish('camera_shake', {magnitudeX: 15 * frauki.currentAttack.damage, magnitudeY: 5, duration: 100});

    e.timers.SetTimer('hit', e.baseStunDuration);
    e.energy -= frauki.currentAttack.damage;

    e.poise -= frauki.currentAttack.damage * 4;

    if(e.poise < 0) e.poise = 0;

    if(e.energy <= 0) {
        e.Die();

        frauki.LandKill(e.maxEnergy / 2);
        e.kill();

        numParticles += e.maxEnergy;
    } else {
        frauki.LandHit();
        e.TakeHit();

        if(e.GetPoisePercentage() < 0.3) {
            e.body.velocity.y = -300 + (e.weight * 200) - (100 * frauki.currentAttack.damage);
            e.state = e.Hurting;
            e.body.velocity.x = c * e.body.velocity.x * e.body.velocity.x;
            e.body.velocity.y = -1 * e.body.velocity.y * e.body.velocity.y;
            console.log('Enemy is being stunned at ' + e.GetPoisePercentage() + ' poise and Frauki did ' + frauki.currentAttack.damage + ' damage');
        }
    }   

    effectsController.ParticleSpray(e.body, frauki.body, 'red', e.EnemyDirection(), numParticles);    
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
    if(frauki.body.center.y < this.body.center.y - (this.body.height / 2))
        return 'above';
    if(frauki.body.center.y > this.body.center.y + (this.body.height / 2))
        return 'below';
    if(frauki.body.center.x < this.body.center.x)
        return 'left';
    if(frauki.body.center.x > this.body.center.x)
        return 'right';
};

Enemy.prototype.EnemyDirection = function() {
     if(frauki.body.center.y < this.body.center.y - (this.body.height / 2))
        return 'below';
    if(frauki.body.center.y > this.body.center.y + (this.body.height / 2))
        return 'above';
    if(frauki.body.center.x < this.body.center.x)
        return 'right';
    if(frauki.body.center.x > this.body.center.x)
        return 'left';
};

Enemy.prototype.RollDice = function(sides, thresh) {
    var roll = Math.ceil(Math.random() * sides);

    if(roll >= thresh)
        return true;
    else
        return false;
};

Enemy.prototype.ChargeAtPlayer = function(speed) {
    game.physics.arcade.moveToXY(this, frauki.body.center.x, frauki.body.center.y, speed);
};
