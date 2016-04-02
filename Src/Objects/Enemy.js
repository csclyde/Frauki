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

    //set up an attackRect that will be used as the enemies attack
    this.attackRect = game.add.sprite(0, 0, null);
    game.physics.enable(this.attackRect, Phaser.Physics.ARCADE);
    this.attackRect.body.setSize(0, 0, 0, 0);
    this.attackRect.owningEnemy = this;  

    this.UI = {};
    this.UI.frame = game.add.image(0, 0, 'UI', 'EnemyHealth000' + (this.maxEnergy - 1), Frogland['objectGroup_' + this.owningLayer]);
    this.UI.pips = [];

    this.UI.pips.push(game.add.image(0, 0, 'UI', 'EnemyHealth0005'));
    this.UI.pips.push(game.add.image(0, 0, 'UI', 'EnemyHealth0005'));
    this.UI.pips.push(game.add.image(0, 0, 'UI', 'EnemyHealth0005'));
    this.UI.pips.push(game.add.image(0, 0, 'UI', 'EnemyHealth0005'));
    this.UI.pips.push(game.add.image(0, 0, 'UI', 'EnemyHealth0005'));
    
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
Enemy.prototype.Die = function() { };
Enemy.prototype.Vulnerable = function() { return true; }
Enemy.prototype.CanCauseDamage = function() { return false; }
Enemy.prototype.Activate = function() {};
Enemy.prototype.Deactivate = function() {};
Enemy.prototype.LandHit = function() {};

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

    this.UpdateAttackGeometry();

    if(this.timers.TimerUp('health_view')) {
        if(EnemyBehavior.Player.IsVisible(this)) {
            this.timers.SetTimer('health_view', 4000);
        } else {
            this.HideHealth();
        }
    }

    //check for landed hits
    if(this.Attacking()) {

        if(this.robotic) {
            game.physics.arcade.overlap(this.attackRect, frauki.attackRect, Collision.OverlapAttackWithEnemyAttack);
        }

        game.physics.arcade.overlap(this.attackRect, frauki, Collision.OverlapEnemyAttackWithFrauki);
    } 

    if(this.maxEnergy > 1 && this.owningLayer === Frogland.currentLayer && !this.timers.TimerUp('health_view')) {
        this.DrawHealth();
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
            knockback: 0.1,
            priority: 0,
            juggle: 0
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
    this.baseStunDuration = 600;
};

Enemy.prototype.Attacking = function() {
    if(!!this.attackRect && this.attackRect.body.width !== 0)
        return true;
    else
        return false;
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

    this.state = this.Hurting;
    this.energy -= damage;

    console.log('Enemy taking ' + damage + ', at ' + this.energy + '/' + this.maxEnergy);

    //knock the enemy back
    this.body.velocity.x = (200 * frauki.GetCurrentKnockback()) + 100;
    this.body.velocity.x *= EnemyBehavior.Player.DirMod(this);
    this.body.velocity.y = (frauki.GetCurrentJuggle() * -200) - 100;

    events.publish('play_sound', { name: 'attack_connect' });

    var hurtTime = this.baseStunDuration + (250 * damage);

    this.timers.SetTimer('hit', hurtTime);
    this.timers.SetTimer('grace', hurtTime +  + game.rnd.between(500, 1000));
    this.timers.SetTimer('attack_wait', hurtTime + game.rnd.between(1000, 2000));


    effectsController.StarBurst(this.body.center);

    if(this.energy <= 0) {
        this.timers.SetTimer('hit', 1000);
        this.timers.SetTimer('grace', 300);

        game.time.events.add(this.robotic ? 800 : game.rnd.between(250, 350), function() { DestroyEnemy(that); });

        if(this.robotic) events.publish('play_sound', { name: 'robosplosion' });
    }
};

Enemy.prototype.DrawHealth = function() {
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

Enemy.prototype.ChangeLayerAway = function() {

    this.HideHealth();
};

function DestroyEnemy(e) {
    e.Die();
    e.state = e.Dying;

    effectsController.EnergySplash(e.body, 200, 'negative', 20);

    var enemBody = e.body.center.clone();

    if(e.robotic) {
        for(var i = 0, max = game.rnd.between(2, 4); i < max; i++) {
            game.time.events.add(i * game.rnd.between(150, 200), function() {
                var pt = enemBody.clone();
                pt.x += game.rnd.between(-20, 20);
                pt.y += game.rnd.between(-20, 20);

                effectsController.Explosion(pt);
            });
        };

        effectsController.SprocketBurst(e.body.center);

    } else {
        effectsController.Explosion(e.body.center);
    }

    effectsController.DiceObject(e.objectName, e.body.center.x, e.body.center.y, e.body.velocity.x, e.body.velocity.y, e.owningLayer);

    damage = e.maxEnergy;

    effectsController.SpawnEnergyNuggets(e.body, frauki.body, 'neutral', e.maxEnergy); 

    events.publish('camera_shake', {magnitudeX: 8, magnitudeY: 2, duration: 350 });
    //effectsController.MakeHearts(e.maxEnergy / 4);

    e.UI.frame.destroy();
    e.UI.pips[0].destroy();
    e.UI.pips[1].destroy();
    e.UI.pips[2].destroy();
    e.UI.pips[3].destroy();
    e.UI.pips[4].destroy();

    e.destroy();
    e = null;
};
