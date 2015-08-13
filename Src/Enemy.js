Enemy = function(game, x, y, name) {
    //instantiate the sprite
    Phaser.Sprite.call(this, game, x, y, 'EnemySprites');
    this.spriteType = 'enemy';

    //enable its physics body
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.collideWorldBounds = true;

    this.timers = new TimerUtil();
    
    this.SetDefaultValues();
    this.attackFrames = {};
    
    if(!!this.types[name]) {
        this.types[name].apply(this);
    } else {
        console.log('Enemy of type ' + name + ' was not found');
    }

    this.enemyName = name;
    this.state = this.Idling;

    //capture any initial values that were set in the specific enemy set up
    this.maxEnergy = this.energy;
    this.initialX = this.body.x;
    this.initialY = this.body.y;

    this.attackRect = game.add.sprite(0, 0, null);
    game.physics.enable(this.attackRect, Phaser.Physics.ARCADE);
    this.attackRect.body.setSize(0, 0, 0, 0);
    this.attackRect.owningEnemy = this;
};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;
Enemy.prototype.types = {};

Enemy.prototype.SetDefaultValues = function() {
    this.body.maxVelocity.y = 1000;
    this.body.maxVelocity.x = 1000;
    this.body.drag.x = 300;
    this.body.bounce.set(0.2);
    this.anchor.setTo(.5, 1);
    this.SetDirection('left');
    this.weight = 0.5;
    this.hitTimer = 0;
    this.energy = 5;
    this.damage = 3;
    this.inScope = false;
    this.baseStunDuration = 300;
};

Enemy.prototype.UpdateFunction = function() {};
Enemy.prototype.Idling = function() {};
Enemy.prototype.Hurting = function() {};
Enemy.prototype.Dying = function() {};
Enemy.prototype.Die = function() { };
Enemy.prototype.Vulnerable = function() { return true; }
Enemy.prototype.CanCauseDamage = function() { return true; }
Enemy.prototype.CanChangeDirection = function() { return true; }
Enemy.prototype.TakeHit = function() {};
Enemy.prototype.Activate = function() {};
Enemy.prototype.Deactivate = function() {};

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

Enemy.prototype.UpdateParentage = function() {
    if(this.WithinCameraRange() && this.alive && this.owningLayer === Frogland.currentLayer) {
        this.body.enable = true;
        this.Activate();
        return true;
    } else {

        this.body.enable = false;
        this.Deactivate();
        return false;
    }
};

Enemy.prototype.update = function() {

    if(!this.UpdateParentage()) {
        return;
    }

    //update function is the generic update function for the specific enemy,
    //executed regardless of state. State is the actual state function
    this.updateFunction();
    this.state();

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

        if(this.timers.TimerUp('hit')) {
            if((this.direction === 'left' && frauki.states.direction === 'right' && frauki.body.center.x < this.body.center.x) ||
               (this.direction === 'right' && frauki.states.direction === 'left' && frauki.body.center.x > this.body.center.x) ) 
            {
                game.physics.arcade.overlap(this.attackRect, frauki.attackRect, ClashSwords);
            }
        }


        game.physics.arcade.overlap(this.attackRect, frauki, EnemyAttackConnect);
    }

};

Enemy.prototype.Attacking = function() {
    if(!!this.attackRect && this.attackRect.body.width !== 0)
        return true;
    else
        return false;
};

Enemy.prototype.WithinCameraRange = function() {
    var padding = 50;

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
    
    if(e.spriteType !== 'enemy' || e.state === e.Hurting || !e.Vulnerable() || e.state === e.Dying)
        return;

    //seperate conditional to prevent crash!
    if(!e.timers.TimerUp('hit'))
        return;

    var damage = frauki.currentAttack.damage * (energyController.GetEnergyPercentage() > 1 ? energyController.GetEnergyPercentage() : 1);

    //fraukis knockback will increase the amount that the enemy is moved. The weight
    //of the enemy will work against that. 
    e.body.velocity.x = (600 * frauki.currentAttack.knockback) - (600 * e.weight);
    if(e.body.velocity.x < 50) e.body.velocity.x = 50;
    e.body.velocity.x *= e.PlayerDirMod();
    
    e.body.velocity.y = -200 + (frauki.currentAttack.juggle * -300);

    e.timers.SetTimer('hit', e.baseStunDuration * damage);

    e.poise -= damage;
    e.state = e.Hurting;

    e.energy -= damage;

    console.log('Enemy is taking ' + damage + ', now at ' + e.energy + '/' + e.maxEnergy, 'x: ' + e.body.velocity.x, 'y: ' + e.body.velocity.y);

    if(e.energy <= 0) {

        e.Die();
        e.state = e.Dying;

        effectsController.DiceEnemy(e, e.body.center.x, e.body.center.y);

        damage = e.maxEnergy;
    } else {
        e.TakeHit();
    }   

    frauki.LandHit(e, damage);

    events.publish('play_sound', { name: 'attack_connect' });
    effectsController.ParticleSpray(e.body, frauki.body, 'positive', e.EnemyDirection(), damage * 2);  

    if(e.energy <= 0) { e.destroy(); }
};

function ClashSwords(e, f) {

    console.log(frauki.currentAttack.priority, e.owningEnemy.currentAttack.priority);

    //if fraukis attack has priority over the enemies attack, they cant block it
    if(frauki.currentAttack.priority > e.owningEnemy.currentAttack.priority) {
        game.physics.arcade.overlap(frauki.attackRect, e.owningEnemy, EnemyHit);
        return;
    }

    effectsController.SparkSplash(e, frauki.attackRect);

    e = e.owningEnemy;

    frauki.LandHit(e, 0);

    var vel = new Phaser.Point(e.body.center.x - frauki.body.center.x, e.body.center.y - frauki.body.center.y);
    vel = vel.normalize();

    vel.x *= 300;
    vel.y *= 300;

    e.body.velocity.x = vel.x;
    e.body.velocity.y = vel.y;

    events.publish('stop_attack_sounds', {});
    events.publish('play_sound', {name: 'clang'});

    e.timers.SetTimer('hit', 300);
    frauki.timers.SetTimer('frauki_hit', 300);
};

function EnemyAttackConnect(e, f) {

    if(e.owningEnemy.currentAttack.damage > 0) {
        frauki.Hit(e.owningEnemy, e.owningEnemy.currentAttack.damage, 500);
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

Enemy.prototype.SeekPlayer = function() {
    
      
};