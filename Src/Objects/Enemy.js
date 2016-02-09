Enemy = function(game, x, y, name) {
    //instantiate the sprite
    Phaser.Sprite.call(this, game, x, y, 'EnemySprites');
    this.spriteType = 'enemy';
    this.objectName = name;

    //enable its physics body
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.collideWorldBounds = true;

    this.timers = new TimerUtil();
    
    this.SetDefaultValues();
    this.attackFrames = {};

    //each enemy will modify this base structure, to customize it
    if(!!this.types[name]) {
        this.types[name].apply(this);
    } else {
        console.log('Enemy of type ' + name + ' was not found');
    }

    this.state = this.Idling;

    //capture any initial values that were set in the specific enemy set up
    this.maxEnergy = this.energy;
    this.initialX = this.body.x;
    this.initialY = this.body.y;

    //set up an attackRect that will be used as the enemies attack
    this.attackRect = game.add.sprite(0, 0, null);
    game.physics.enable(this.attackRect, Phaser.Physics.ARCADE);
    this.attackRect.body.setSize(0, 0, 0, 0);
    this.attackRect.owningEnemy = this;

    
};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;
Enemy.prototype.types = {};

//default functions
Enemy.prototype.updateFunction = function() {};
Enemy.prototype.Idling = function() { return false; };
Enemy.prototype.Act = function() {};
Enemy.prototype.Hurting = function() {};
Enemy.prototype.Dying = function() {};
Enemy.prototype.Die = function() { };
Enemy.prototype.Vulnerable = function() { return true; }
Enemy.prototype.CanCauseDamage = function() { return true; }
Enemy.prototype.CanChangeDirection = function() { return true; }
Enemy.prototype.TakeHit = function() {};
Enemy.prototype.Activate = function() {};
Enemy.prototype.Deactivate = function() {};
Enemy.prototype.TakeHit = function() {};

Enemy.prototype.update = function() {

    if(!this.body.enable) {
        return;
    }

    //update function is the generic update function for the specific enemy,
    //executed regardless of state.
    this.updateFunction();

    //each state function for enemies will return true or false. true means that
    //the enemy is ready to perform a new action. The action will be determined
    //in the act function, unique to each enemy type
    if(this.state()) {
        this.Act();
    }

    //update the facing of the enemy, assuming they are not being hit and
    //there is no other precondition overriding their ability to turn
    if(this.CanChangeDirection()) {
        if(this.body.velocity.x > 0) {
            this.SetDirection('right');
        } else if(this.body.velocity.x < 0) {
            this.SetDirection('left');
        }
    }
    
    if(this.energy > this.maxEnergy)
        this.energy = this.maxEnergy;

    //check for and apply any existing attack frame
    //check for a frame mod and apply its mods
    if(this.animations.currentFrame) {
        this.currentAttack = this.attackFrames[this.animations.currentFrame.name];
    } 

    if(!!this.currentAttack) {

        if(this.direction === 'right') {
            this.attackRect.body.x = this.currentAttack.x + this.body.x; 
            this.attackRect.body.y = this.currentAttack.y + this.body.y; 
            this.attackRect.body.width = this.currentAttack.w; 
            this.attackRect.body.height = this.currentAttack.h;
        } else {
            this.attackRect.body.x = (this.currentAttack.x * -1) + this.body.x - this.currentAttack.w + this.body.width;
            this.attackRect.body.y = this.currentAttack.y + this.body.y;
            this.attackRect.body.width = this.currentAttack.w;
            this.attackRect.body.height = this.currentAttack.h;
        }
    }
    else {
        this.attackRect.body.x = 0;
        this.attackRect.body.y = 0;
        this.attackRect.body.width = 0;
        this.attackRect.body.height = 0;
    }

    //if they are attacking and facing each other
    if(this.Attacking()) {

        if(this.timers.TimerUp('grace')) {
            if((this.direction === 'left' && frauki.body.center.x < this.body.center.x + 20) ||
               (this.direction === 'right' && frauki.body.center.x > this.body.center.x - 20) ) 
            {
                game.physics.arcade.overlap(this.attackRect, frauki.attackRect, Collision.OverlapAttackWithEnemyAttack);
            }
        }

        game.physics.arcade.overlap(this.attackRect, frauki, Collision.OverlapEnemyAttackWithFrauki);
    }
    

    if(this.state === this.Hurting) {
        this.body.bounce.setTo(0.5);
    } else {
        this.body.bounce.setTo(0);
    }
};

Enemy.prototype.SetDefaultValues = function() {
    this.body.maxVelocity.y = 1000;
    this.body.maxVelocity.x = 1000;
    this.body.drag.x = 600;
    this.body.bounce.set(0.2);
    this.anchor.setTo(.5, 1);
    this.SetDirection('left');
    this.energy = 5;
    this.damage = 3;
    this.baseStunDuration = 600;
};

Enemy.prototype.Respawn = function() {

    this.alive = true;
    this.exists = true;
    this.visible = true;
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
    this.x = this.initialX;
    this.y = this.initialY;
    this.energy = this.maxEnergy;
    this.state = this.Idling;
};

Enemy.prototype.Attacking = function() {
    if(!!this.attackRect && this.attackRect.body.width !== 0)
        return true;
    else
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

function DestroyEnemy(e) {
    e.Die();
    e.state = e.Dying;

    effectsController.EnergySplash(e.body, 200, 'negative', 20);

    var enemBody = e.body.center.clone();

    if(e.robotic) {
        for(var i = 0, max = game.rnd.between(2, 4); i < max; i++) {
            setTimeout(function() {
                var pt = enemBody.clone();
                pt.x += game.rnd.between(-20, 20);
                pt.y += game.rnd.between(-20, 20);

                effectsController.Explosion(pt);
            }, i * game.rnd.between(150, 200));
        };
    } else {
        effectsController.Explosion(e.body.center);
    }

    effectsController.DiceObject(e, e.body.center.x, e.body.center.y);

    damage = e.maxEnergy;

    effectsController.SpawnEnergyNuggets(e.body, frauki.body, 'positive', e.maxEnergy * (GetCurrentShardType() === 'Luck' ? 2 : 1)); 
    effectsController.SpawnEnergyNuggets(e.body, frauki.body, 'neutral', e.maxEnergy * (GetCurrentShardType() === 'Luck' ? 2 : 1)); 

    events.publish('camera_shake', {magnitudeX: 10, magnitudeY: 6, duration: 350 });
    //effectsController.MakeHearts(e.maxEnergy / 4);

    e.destroy();
    e = null;
};


























Enemy.prototype.WithinCameraRange = function() {
    var padding = 150;

    if(this.body.x > game.camera.x - padding &&
       this.body.y > game.camera.y - padding &&
       this.body.x < game.camera.x + game.camera.width + padding &&
       this.body.y < game.camera.y + game.camera.height + padding)
        return true;

    return false;
};

Enemy.prototype.GetDirMod = function() {
    if(this.direction === 'left') {
        return -1;
    } else {
        return 1;
    }
};

//provide utility functions here that the specific enemies can all use
Enemy.prototype.PlayerIsNear = function(radius) {

    if(this.PlayerDistance() <= radius)
        return true;
    else
        return false;
};

Enemy.prototype.PlayerDistance = function() {
    var distX = frauki.body.center.x - this.body.center.x;
    var distY = frauki.body.center.y - this.body.center.y;

    var dist = Math.sqrt(distX * distX + distY * distY);

    return dist;
};

Enemy.prototype.PlayerIsVisible = function() {

    return this.WithinCameraRange();

    var ray = new Phaser.Line(frauki.body.center.x, frauki.body.center.y, this.body.center.x, this.body.center.y);
    var collideTiles = Frogland.GetCurrentCollisionLayer().getRayCastTiles(ray, 1, true);

    var i = collideTiles.length;
    while(i--) {
        if(collideTiles[i].index === 1) return false;
    }

    return true;
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

Enemy.prototype.PlayerDirMod = function() {

    return frauki.body.center.x < this.body.center.x ? 1 : -1;
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
    var roll = Math.random() * sides;

    if(roll >= thresh)
        return true;
    else
        return false;
};

Enemy.prototype.FacePlayer = function() {
    if(this.body.center.x < frauki.body.center.x) {
        this.SetDirection('right');
    } else {
        this.SetDirection('left');
    }
}

Enemy.prototype.ChargeAtPlayer = function(speed) {

    game.physics.arcade.moveToXY(this, frauki.body.center.x, frauki.body.center.y, speed);
};

Enemy.prototype.FraukiVulnerableState = function() {

    var vulnerableFrames = [
        'Attack Dive0019',
        'Attack Dive0020',
        'Attack Dive0021',
        'Attack Dive0022',
        'Attack Dive0023',
        'Attack Dive0024',
        'Attack Dive0025',
        'Attack Dive0026',
        'Attack Dive0027',
        'Attack Dive0028',
        'Attack Stab0011',
        'Attack Stab0012',
        'Attack Stab0013',
        'Attack Stab0014',
        'Attack Stab0015',
        'Attack Stab0016',
        'Attack Stab0017'
    ];

    if(vulnerableFrames.indexOf(frauki.animations.currentFrame.name) > -1) {
        return true;
    } else {
        return false;
    }
};