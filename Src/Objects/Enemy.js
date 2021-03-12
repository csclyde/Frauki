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
        console.warn('Enemy of type ' + name + ' was not found');
    }

    this.state = this.Idling;

    //capture any initial values that were set in the specific enemy set up
    this.maxEnergy = this.energy;

    //set up an attackRect that will be used as the enemies attack
    this.attackRect = game.add.sprite(0, 0, null);
    game.physics.enable(this.attackRect, Phaser.Physics.ARCADE);
    this.attackRect.body.setSize(0, 0, 0, 0);
    this.attackRect.owningEnemy = this;  

    this.UI = {};
    this.UI.frame = game.add.image(0, 0, 'UI', 'EnemyHealth000' + (this.maxEnergy - 1), Frogland['objectGroup_' + this.owningLayer]);
    this.UI.pips = [];

    this.UI.pips.push(game.add.image(0, 0, 'UI', 'EnemyHealth0008'));
    this.UI.pips.push(game.add.image(0, 0, 'UI', 'EnemyHealth0008'));
    this.UI.pips.push(game.add.image(0, 0, 'UI', 'EnemyHealth0008'));
    this.UI.pips.push(game.add.image(0, 0, 'UI', 'EnemyHealth0008'));
    this.UI.pips.push(game.add.image(0, 0, 'UI', 'EnemyHealth0008'));
    this.UI.pips.push(game.add.image(0, 0, 'UI', 'EnemyHealth0008'));
    this.UI.pips.push(game.add.image(0, 0, 'UI', 'EnemyHealth0008'));
    this.UI.pips.push(game.add.image(0, 0, 'UI', 'EnemyHealth0008'));
    this.UI.pips.push(game.add.image(0, 0, 'UI', 'EnemyHealth0008'));
    this.UI.pips.push(game.add.image(0, 0, 'UI', 'EnemyHealth0008'));

    this.events.onDestroy.add(function(e) {
        e.UI.frame.destroy();

        e.UI.pips.forEach(function(pip) {
            pip.destroy();
        });
    });
};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;
Enemy.prototype.types = {};

//default functions
Enemy.prototype.updateFunction = function() {};
Enemy.prototype.Act = function() {};
Enemy.prototype.Idling = function() { return false; };
Enemy.prototype.Stunned = function() { return true };
Enemy.prototype.Hurting = function() {};
Enemy.prototype.Dying = function() {};
Enemy.prototype.Die = function() {};
Enemy.prototype.Vulnerable = function() { return true; }
Enemy.prototype.CanCauseDamage = function() { return false; }
Enemy.prototype.LandHit = function() {};
Enemy.prototype.OnHit = function() {};
Enemy.prototype.OnBlock = function() {};

Enemy.prototype.update = function() {
    var that = this;

    if(!this.body.enable) {
        return;
    }

    //update function is the generic update function for the specific enemy,
    //executed regardless of state.
    this.updateFunction();

    //each state function for enemies will return true or false. true means that
    //the enemy is ready to perform a new action. The action will be determined
    //in the act function, unique to each enemy type
    if(this.state() && this.timers.TimerUp('attack_stun')) {
        this.Act();
    }

    this.UpdateAttackGeometry();

    if(this.timers.TimerUp('health_view')) {
        if(EnemyBehavior.Player.IsVisible(this)) {
            this.timers.SetTimer('health_view', 4000);
        } else {
            this.HideHealth();
        }
    }

    //check for landed hits
    if(this.isAttacking()) {

        if(this.robotic) {
            game.physics.arcade.overlap(this.attackRect, frauki.attackRect, Collision.OverlapAttackWithEnemyAttack);
        }

        game.physics.arcade.collide(this.attackRect, frauki, null, Collision.OverlapEnemyAttackWithFrauki);

        if(!!this.currentAttack && this.currentAttack.friendlyFire) {
            game.physics.arcade.collide(this.attackRect, objectController.enemyList, null, Collision.OverlapEnemyAttackWithEnemies);
        }
    } 

    if(this.maxEnergy > 1 && this.owningLayer === Frogland.currentLayer && !this.timers.TimerUp('health_view')) {
        this.DrawHealth();
    }

     if(!this.timers.TimerUp('after_damage_flicker') && this.timers.TimerUp('hurt_flicker')) {
        this.alpha = 0;
        game.time.events.add(15, function() { that.timers.SetTimer('hurt_flicker', 30); });
    } else {
        this.alpha = 1;
    }

    if(this.isAttacking()) {
        this.timers.SetTimer('grace', 0);
    }
};

Enemy.prototype.UpdateAttackGeometry = function() {
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
    else if(this.CanCauseDamage()) {
        this.attackRect.body.x = this.body.x;
        this.attackRect.body.y = this.body.y;
        this.attackRect.body.width = this.body.width;
        this.attackRect.body.height = this.body.height;

        this.currentAttack = {
            damage: this.damage,
            knockback: this.knockback || 0.5,
            priority: this.priority || 0,
            juggle: this.juggle || 0,
            stun: this.stun || false,
            power: this.power || false,
            friendlyFire: this.friendlyFire || false
        };
    } 
    else {
        this.attackRect.body.x = 0;
        this.attackRect.body.y = 0;
        this.attackRect.body.width = 0;
        this.attackRect.body.height = 0;

        this.currentAttack = null;
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
    this.baseStunDuration = 400;
    this.stunThreshold = 1;
};

Enemy.prototype.Activate = function() {
    this.timers.SetTimer('attack_wait', 2000);
};

Enemy.prototype.Deactivate = function() {
    this.timers.SetTimer('attack_wait', 3000);
    this.HideHealth();
};

Enemy.prototype.isAttacking = function() {
    if(!!this.attackRect && this.attackRect.body.width !== 0)
        return true;
    else
        return false;
};

Enemy.prototype.CanAttack = function() {
    if(this.timers.TimerUp('attack_wait') && Frogland.timers.TimerUp('global_attack_wait')) {
        return true;
    }

    return false;
};

Enemy.prototype.SetAttackTimer = function(amt) {
    amt = amt || 0;
    this.timers.SetTimer('attack_wait', amt);
    Frogland.timers.SetTimer('global_attack_wait', 800);
};

Enemy.prototype.Grace = function() {
    return !this.timers.TimerUp('grace');
};

Enemy.prototype.GetCurrentDamage = function() {
    if(!!this.currentAttack) {
        return this.currentAttack.damage;
    } else {
        return 0;
    }
};

Enemy.prototype.GetCurrentPriority = function() {
    if(!!this.currentAttack) {
        return this.currentAttack.priority;
    } else {
        return 0;
    }
};

Enemy.prototype.GetCurrentKnockback = function() {
    if(!!this.currentAttack) {
        return this.currentAttack.knockback || 1;
    } else {
        return 1;
    }
};

Enemy.prototype.GetCurrentStun = function() {
    if(!!this.currentAttack) {
        return this.currentAttack.stun;
    } else {
        return false;
    }
};

Enemy.prototype.GetCurrentPower = function() {
    if(!!this.currentAttack) {
        return this.currentAttack.power;
    } else {
        return false;
    }
};

Enemy.prototype.GetCurrentAttackSolid = function() {
    if(!!this.currentAttack) {
        return this.currentAttack.solid || false;
    } else {
        return false;
    }
};

Enemy.prototype.SetDirection = function(dir) {
    if(dir === 'left') {
        this.direction = 'left';
        this.scale.x = -1;
    }
    else if(dir === 'right') {
        this.direction = 'right';
        this.scale.x = 1;
    }
};

Enemy.prototype.PlayAnim = function(name) {
    if(this.animations.currentAnim.name !== name)
        this.animations.play(name);
};

Enemy.prototype.TakeHit = function(damage) {
    var that = this;

    if(!this.timers.TimerUp('hit') || !this.timers.TimerUp('grace')) {
        return;
    }

    this.energy -= damage;
    events.publish('play_sound', { name: 'attack_connect' });

    var hurtTime = this.baseStunDuration + (250 * damage);

    if(damage >= this.stunThreshold || this.energy <= 0) {
        
        this.body.velocity.x = (200 * frauki.GetCurrentKnockback()) + 100;
        this.body.velocity.x *= EnemyBehavior.Player.DirMod(this);
        
        this.state = this.Hurting;
        this.timers.SetTimer('hit', hurtTime);

        this.body.velocity.y = (frauki.GetCurrentJuggle() * -200) - 100;   
        this.timers.SetTimer('attack_wait', hurtTime + game.rnd.between(1000, 2000));
    }

    var graceTime = hurtTime + game.rnd.between(500, 1000);

    this.timers.SetTimer('grace', graceTime);


    effectsController.StarBurst(this.body.center);

    this.OnHit();

    if(this.energy <= 0) {
        this.timers.SetTimer('hit', 1000);
        this.timers.SetTimer('grace', 300);

        game.time.events.add(this.robotic ? 800 : game.rnd.between(250, 350), function() { that.DestroyEnemy(); });

        if(this.robotic) events.publish('play_sound', { name: 'robosplosion' });

        events.publish('enemy_killed', { name: this.objectName, owningLayer: this.owningLayer, x: this.body.center.x, y: this.body.center.y });
        
        if(this.robotic && !GameData.GetFlag('goddess_robo_speech')) {
            //goddess.AddMessage("I see you've met those terrible robots. They're the ones who locked me up in this nasty prison. They're intruders, and they do not belong here.");

            GameData.SetFlag('goddess_robo_speech', true);
        }

    } else {
        this.timers.SetTimer('after_damage_flicker', graceTime);
    }
};

Enemy.prototype.DrawHealth = function() {

    if(this.objectName === 'Goddess') return;
    
    this.UI.frame.x = this.body.x;
    this.UI.frame.y = this.body.y - 20;
    this.UI.frame.visible = true;

    for(var i = 0; i < this.maxEnergy; i++) {
        //if the count is less than the energy, represent it
        if(i < this.energy) {
            this.UI.pips[i].visible = true;
            this.UI.pips[i].x = this.body.x + 3 + i * 5;
            this.UI.pips[i].y = this.body.y - 18;
        } else {
            this.UI.pips[i].visible = false;
        }
    }
};

Enemy.prototype.HideHealth = function() {
    this.UI.frame.visible = false;

    for(var i = 0; i < this.UI.pips.length; i++) {
        this.UI.pips[i].visible = false;
    }
};

Enemy.prototype.collideWithPlayer = function(f) {
    if(this.objectName === 'Goddess') {
        return false;
    } else if(this.isAttacking() && this.GetCurrentDamage() > 0) {
        return false;
    } else if(this.isSolid) {
        f.body.blocked.down = true;
        if(f.body.velocity.y > 0) f.body.velocity.y = 0;
        return true;
    } else if(f.body.y + f.body.height <= this.body.y + (f.body.height / 4) || this.body.y + this.body.height <= f.body.y + (this.body.height / 4)) {
        return false;
    } else {

        if((f.states.direction === 'left' && this.body.center.x < f.body.center.x) || (f.states.direction === 'right' && this.body.center.x > f.body.center.x))
            f.body.velocity.x /= 2;

        if(f.state === f.Rolling && this.body.immovable !== true) {
            this.body.velocity.x = 150;
            this.body.velocity.x *= EnemyBehavior.Player.DirMod(this);
        }

        return true;
    }
};

Enemy.prototype.DestroyEnemy = function(e) {
    this.Die();
    this.state = this.Dying;

    effectsController.EnergySplash(this.body, 200, 'negative', 20);

    var enemBody = this.body.center.clone();

    if(this.robotic) {
        for(var i = 0, max = game.rnd.between(2, 4); i < max; i++) {
            game.time.events.add(i * game.rnd.between(150, 200), function() {
                var pt = enemBody.clone();
                pt.x += game.rnd.between(-20, 20);
                pt.y += game.rnd.between(-20, 20);

                effectsController.Explosion(pt);
            });
        };

        effectsController.SprocketBurst(this.body.center);

    }

    effectsController.DiceObject(this.objectName, this.body.center.x, this.body.center.y, this.body.velocity.x, this.body.velocity.y, this.owningLayer);

    damage = this.maxEnergy;

    events.publish('camera_shake', {magnitudeX: 8, magnitudeY: 2, duration: 350 });

    this.UI.frame.destroy();

    this.UI.pips.forEach(function(pip) {
        pip.destroy();
    });

    this.destroy();
    e = null;
};
