PLAYER_SPEED = function() { return 200; }
PLAYER_ROLL_SPEED = function() { return 600; }
PLAYER_RUN_SLASH_SPEED = function() { return  650; }
PLAYER_JUMP_VEL = function() { return -350; }
PLAYER_DOUBLE_JUMP_VEL = function() { return -275; }
PLAYER_JUMP_SLASH_SPEED = function() { return 1075; }

Player = function (game, x, y, name) {

    Phaser.Sprite.call(this, game, x, y, name);
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.anchor.setTo(0.5, 1);

    this.body.collideWorldBounds = true;
    this.body.setSize(11, 50, 0, -75);
    this.body.maxVelocity.y = 10;
    this.body.drag.x = 2000;

    this.initialX = x;
    this.initialY = y;

    //load up the animations
    fraukiAnimations.forEach(function(anim) {
        this.animations.add(anim.Name, anim.Frames, anim.Fps, anim.Loop, false);
    }, this);

    this.state = this.Materializing;
    this.PlayAnim('stand');
    
    this.tweens = {};
    this.tweens.roll = null;

    this.states = {};
    this.states.direction = 'right';
    this.states.crouching = false;
    this.states.hasFlipped = false;
    this.states.upPresseed = false;
    this.states.wasAttacking = false;
    this.states.inWater = false;
    this.states.onCloud = false;
    this.states.inUpdraft = false;
    this.states.droppingThroughCloud = false;
    this.states.onLeftSlope = false;
    this.states.onRightSlope = false;

    this.movement = {};
    this.movement.diveVelocity = 0;
    this.movement.jumpSlashVelocity = 0;
    this.movement.rollBoost = 0;
    this.movement.startRollTime = game.time.now;
    this.movement.rollPop = false;
    this.movement.rollPrevVel = 0;
    this.movement.rollDirection = 1;

    this.upgradeSaves = JSON.parse(localStorage.getItem('fraukiUpgrades')) || [];

    this.upgrades = {};
    this.upgrades.roll = true;
    this.upgrades.hike = true;
    this.upgrades.attackFront = true;
    this.upgrades.attackOverhead = true; //this.upgradeSaves.indexOf('Overhead') > -1;
    this.upgrades.attackStab = true; //this.upgradeSaves.indexOf('Stab') > -1;
    this.upgrades.attackDive = true; //this.upgradeSaves.indexOf('Dive') > -1;

    this.attack = {};
    this.attack.activeCharge = 0;

    this.timers = new TimerUtil();

    this.currentAttack = {};
    this.attackRect = game.add.sprite(0, 0, null);
    game.physics.enable(this.attackRect, Phaser.Physics.ARCADE);
    this.attackRect.body.setSize(0, 0, 0, 0);

    events.subscribe('player_jump', this.Jump, this);
    events.subscribe('player_crouch', this.Crouch, this);
    events.subscribe('player_slash', this.Slash, this);
    events.subscribe('player_power_slash', this.Slash, this);
    events.subscribe('player_roll', this.Roll, this);
    events.subscribe('player_run', this.StartStopRun, this);
    events.subscribe('control_up', function(params) { 
        this.states.upPressed = params.pressed;

        //this allows an inverted seaquence of inputs for the jump slash
        if(this.state === this.AttackFront && this.body.onFloor() === false && !this.timers.TimerUp('updash_timer')) {
            this.JumpSlash();
        }

    }, this);

    //set up the run dust
    this.runDust = game.add.sprite(0, 0, 'Misc');
    this.runDust.animations.add('dust', ['RunDust0000', 'RunDust0001', 'RunDust0002', 'RunDust0003'], 10, true, false);
    this.runDust.play('dust');
    this.runDust.alpha = 0.5;
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.preStateUpdate = function() {

    //when they hit something the roll boost should be lost
    if(this.movement.rollBoost > 0 && this.body.velocity.x === 0) {
        this.movement.rollBoost = 0;
    }

    this.body.maxVelocity.x = PLAYER_SPEED() + this.movement.rollBoost;
    this.body.maxVelocity.y = 350;

    //maintain the roll boost when they jump without a key down
    if(this.movement.rollBoost > 0) {
        this.body.velocity.x = (PLAYER_SPEED() + this.movement.rollBoost) * this.movement.rollDirection;

        if(this.body.velocity.x < 0 && !inputController.dpad.left) {
            this.movement.rollBoost -= 200 * (game.time.elapsedMS / 1000);
        } else if(this.body.velocity.x > 0 && !inputController.dpad.right) {
            this.movement.rollBoost -= 200 * (game.time.elapsedMS / 1000);
        }
    }

    this.body.gravity.y = 0;
    this.body.drag.x = 2000;

    if(!this.states.inWater && (this.state === this.Running || this.state === this.Rolling)) {
        this.runDust.visible = true;

        this.runDust.y = this.body.y + this.body.height - this.runDust.height;

        //position the dust
        if(this.states.direction === 'right') {
            this.runDust.x = this.body.x - 22;
            this.runDust.scale.x = 1;
        } else {
            this.runDust.x = this.body.x + 32;
            this.runDust.scale.x = -1;
        }
    } else {
        this.runDust.visible = false;
    }
};

Player.prototype.postStateUpdate = function() {

    if(this.states.inWater) {
        if(this.states.flowLeft || this.states.flowRight) {
            this.body.maxVelocity.x *= 2;
        } else if(this.state !== this.Rolling && this.state !== this.AttackStab) {
            this.body.maxVelocity.x *= 0.7;
        }

        this.body.gravity.y = -200;
    }

    if(this.states.inUpdraft) {
        this.body.acceleration.y = -750;
        this.body.maxVelocity.y = 500;
    } else {
        this.body.acceleration.y = 0;
    }

    if(frauki.states.flowDown) {
        this.body.acceleration.y = 500;
    } else if(frauki.states.flowUp) {
        this.body.acceleration.y = -500;
    }

    if(frauki.states.flowLeft) {
        this.body.acceleration.x = -600;
    } else if(frauki.states.flowRight) {
        this.body.acceleration.x = 600;
    }

    //reset the double jump flag
    if(this.body.onFloor()) {
        this.states.hasFlipped = false;
        this.movement.rollBoost = 0;
    }

    if(this.Attacking()) {
        game.physics.arcade.overlap(frauki.attackRect, Frogland.GetCurrentObjectGroup(), Collision.OverlapAttackWithObject);
        game.physics.arcade.overlap(frauki.attackRect, projectileController.projectiles, ProjectileHit);
    }
    
    if(this.state === this.Running && this.animations.currentAnim.name === 'run') {
        events.publish('play_sound', {name: 'running'});
    } else {
        events.publish('stop_sound', {name: 'running'});
    }
};

Player.prototype.update = function() {
    this.preStateUpdate();
    this.state();
    this.postStateUpdate();
};

Player.prototype.SetDirection = function(dir) {
    if(this.states.direction !== dir && this.animations.paused === false) {
        this.states.direction = dir;

        dir === 'left' ? this.scale.x = -1 : this.scale.x = 1;
    }
};

Player.prototype.PlayAnim = function(name) {
    if(this.animations.currentAnim.name !== name) {
        this.animations.play(name);
    }
};

Player.prototype.Grace = function() {

    return !this.timers.TimerUp('frauki_grace');
};

Player.prototype.UpdateAttackGeometry = function() {

    //first, check the weapon controller for an attack geometry override
    //barring that, find the normal attack geometry
    if(weaponController.GetAttackGeometry()) {
        this.currentAttack = weaponController.GetAttackGeometry();

        this.attackRect.body.x = this.currentAttack.x + this.body.x; 
        this.attackRect.body.y = this.currentAttack.y + this.body.y; 
        this.attackRect.body.width = this.currentAttack.w; 
        this.attackRect.body.height = this.currentAttack.h;

        return;
    }

    if(this.animations.currentFrame) {
        this.currentAttack = fraukiDamageFrames[this.animations.currentFrame.name];
    } 

    if(!!this.currentAttack) {

        if(this.states.direction === 'right') {
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
};

Player.prototype.GetCurrentDamage = function() {

    return this.currentAttack.damage;
};

Player.prototype.GetCurrentKnockback = function() {

    return this.currentAttack.knockback;
};

Player.prototype.GetCurrentJuggle = function() {

    return this.currentAttack.juggle;
};

Player.prototype.GetCurrentPriority = function() {

    return this.currentAttack.priority;
};

Player.prototype.Attacking = function() {
    if(!!this.attackRect && this.attackRect.body.width !== 0)
        return true;
    else
        return false;
};

Player.prototype.InAttackAnim = function() {
    var frameName = this.animations.currentAnim.name;

    if(['attack_front', 'attack_overhead', 'attack_stab', 'attack_dive_charge', 'attack_dive_fall', 'attack_dive_land'].indexOf(frameName) > -1) {
        return true;
    } else {
        return false;
    }

};

Player.prototype.GetDirectionMultiplier = function() {
    var dir = 1;
    if(inputController.dpad.left) {
        this.SetDirection('left');
        dir = -1;
    } else if (inputController.dpad.right) {
        this.SetDirection('right');
        dir = 1;
    } else if(this.states.direction === 'left') {
        this.SetDirection('left');
        dir = -1;
    } else {
        this.SetDirection('right');
        dir = 1;
    }
    
    return dir;
};

Player.prototype.LandHit = function(e, damage) {

    var vel = new Phaser.Point(frauki.body.center.x - e.body.center.x, frauki.body.center.y - e.body.center.y);
    vel = vel.normalize();

    vel = vel.setMagnitude(300);

    if(this.state !== this.AttackStab && this.state !== this.AttackDiveFall && this.state !== this.Rolling) {
        frauki.body.velocity.x = vel.x;
        frauki.body.velocity.y = vel.y;
    }

    energyController.AddCharge(damage);

    if(damage > 0) {
        effectsController.ClashStreak(e.body.center.x, e.body.center.y, game.rnd.between(1, 2));
        events.publish('camera_shake', {magnitudeX: 12, magnitudeY: 8, duration: 350});
    }

    if(damage > 0 && e.maxEnergy > 1) {
        effectsController.SlowHit(800);
    } else if(damage === 0) {
        effectsController.SlowHit(400);
    }

    this.states.hasFlipped = false;
};


////////////////ACTIONS//////////////////
Player.prototype.Run = function(params) {
    if(!this.timers.TimerUp('frauki_hit') || (this.state === this.Rolling && this.movement.rollPop === false) || this.state === this.AttackStab) 
        return;

    if(params.dir === 'left') {
        this.body.acceleration.x = -1500;
        this.SetDirection('left');
    } else if(params.dir === 'right') {
        this.body.acceleration.x = 1500;
        this.SetDirection('right');
    } else {
        this.body.acceleration.x = 0;

        if(this.body.onFloor()) {
            this.movement.rollBoost = 0;
        }
    }
};

Player.prototype.StartStopRun = function(params) {
    if(params.run) {
        if(this.state === this.Crouching) {
            this.Roll();
            this.timers.SetTimer('frauki_dash', 200);
        } else if(this.timers.TimerUp('frauki_dash')) {
            this.timers.SetTimer('frauki_dash', 200);
        //double tap to roll
        } else if(params.dir === this.states.direction) {
            this.Roll();
            this.timers.SetTimer('frauki_dash', 200);
        }

        if(this.movement.rollBoost > 0) {
            if(this.movement.rollDirection === -1 && params.dir === 'right') {
                this.movement.rollBoost = 0;
            } else if(this.movement.rollDirection === 1 && params.dir === 'left') {
                this.movement.rollBoost = 0;
            }
        }

    } else {
        this.movement.rollBoost = 0;
    }
};

Player.prototype.Jump = function(params) {
    if(!this.timers.TimerUp('frauki_hit')) 
        return;

    if(params.jump) {
        //drop through cloud tiles
        if(inputController.dpad.down && this.states.onCloud && this.state !== this.Rolling) {
            this.states.droppingThroughCloud = true;

            var dropTime = 200;
            if(frauki.states.inWater) dropTime *= 2;

            game.time.events.add(dropTime, function() { frauki.states.droppingThroughCloud = false; } );
            this.timers.SetTimer('frauki_dash', 200);

            return;
        }
        
        //normal jump
        if(this.state === this.Standing || this.state === this.Running || this.state === this.Landing || this.state === this.Crouching || (this.state === this.AttackFront && this.body.onFloor()) || (this.state === this.AttackOverhead && this.body.onFloor())) {
            this.body.velocity.y = PLAYER_JUMP_VEL();
            events.publish('play_sound', {name: 'jump'});
        }
        //roll jump
        else if(this.state === this.Rolling) {
            if(energyController.UseEnergy(3)) { 
                this.state = this.Jumping;
                this.PlayAnim('roll_jump');
    
                //roll boost is caluclated based on how close they were to the max roll speed
                this.movement.rollBoost = Math.abs(this.body.velocity.x) - PLAYER_SPEED(); 
                this.movement.rollBoost /= (PLAYER_ROLL_SPEED() - PLAYER_SPEED());
                this.movement.rollBoost *= 150;

                //if they are holding away from the roll, dont go crazy
                if(this.movement.rollDirection !== this.GetDirectionMultiplier()) {
                    this.movement.rollBoost = 0;
                }
    
                //add a little boost to their jump
                this.body.velocity.y = PLAYER_JUMP_VEL() - 50;
            } else {
                this.body.velocity.y = PLAYER_JUMP_VEL();
            }
            
            events.publish('play_sound', {name: 'jump'});
        }
        //double jump
        else {
            this.DoubleJump();
        }
    } else if(this.body.velocity.y < 0 && this.state !== this.Flipping) {
        if(this.body.velocity.y < 0) {
            this.body.velocity.y /= 2;
        }

    }
};

Player.prototype.DoubleJump = function() {
    if(this.states.hasFlipped === false && this.state !== this.Rolling && this.state !== this.AttackStab && this.state !== this.AttackOverhead && this.upgrades.hike && energyController.UseEnergy(1)) {

        if(this.body.velocity.y > PLAYER_DOUBLE_JUMP_VEL()) {
            this.body.velocity.y = PLAYER_DOUBLE_JUMP_VEL();
        } else {
            this.body.velocity.y += PLAYER_DOUBLE_JUMP_VEL();
        }

        this.state = this.Flipping;
        this.states.hasFlipped = true;
        this.timers.SetTimer('frauki_grace', 300);

        events.publish('play_sound', {name: 'airhike'});
        events.publish('stop_sound', {name: 'attack_dive_fall'});

        effectsController.EnergyStreak();
    }
};

Player.prototype.Crouch = function(params) {
    this.states.crouching = params.crouch;

    this.timers.SetTimer('frauki_dash', 200);

    if(this.state === this.AttackFront && this.body.onFloor() === false && !this.timers.TimerUp('smash_timer')) {
        this.DiveSlash();
    }
};

Player.prototype.Slash = function(params) {

    // if(!this.timers.TimerUp('frauki_slash'))
    //     return;

    //diving dash
    if(!this.timers.TimerUp('frauki_dash') && this.states.crouching && (this.state === this.Jumping || this.state === this.Peaking || this.state === this.Falling || this.state === this.Flipping)) {
        this.DiveSlash();
        effectsController.EnergyStreak();
    }
    //running dash
    else if(this.state === this.Rolling || (this.state === this.Flipping && !this.states.upPressed && !this.states.crouching)) {
        this.StabSlash();
        effectsController.EnergyStreak();
    }
    //upwards dash attack
    else if(this.states.upPressed && (this.state === this.Peaking || this.state === this.Jumping) && this.states.hasFlipped === false) {
        this.JumpSlash();
        effectsController.EnergyStreak();
    }
    //normal slashes while standing or running
    else if(this.state === this.Standing || this.state === this.Landing || this.state === this.Running || this.state === this.Jumping || this.state === this.Peaking || this.state === this.Falling || this.state === this.Flipping || this.state === this.Crouching) {
        this.FrontSlash();
        effectsController.EnergyStreak();
    } 
    else {
        console.log('An attack was attempted in an unresolved state ', this.state);
    }

    this.timers.SetTimer('frauki_slash', 400 * (1 / energyController.GetEnergyPercentage()));
    this.timers.SetTimer('smash_timer', 200);
    this.timers.SetTimer('updash_timer', 200);
};

Player.prototype.FrontSlash = function() {
    if(this.upgrades.attackFront) {
        if(energyController.UseEnergy(5)) {
            if(this.upgrades.attackOverhead && this.states.upPressed) {
                this.state = this.AttackOverhead;
            } else {
                this.state = this.AttackFront;
            }

            events.publish('play_sound', {name: 'attack_slash', restart: true });
        }
    } 
};

Player.prototype.DiveSlash = function() {
    if(this.upgrades.attackDive) {
        if(energyController.UseEnergy(7)) {
            this.state = this.AttackDiveCharge;
            this.movement.diveVelocity = 950;
            events.publish('play_sound', {name: 'attack_dive_charge', restart: true });
        }
    } else {
        this.FrontSlash();
    }
};

Player.prototype.JumpSlash = function() {
    if(this.upgrades.attackOverhead) {
        if(energyController.UseEnergy(6)) {
            this.state = this.AttackJump;
            
            this.body.velocity.y = -2000;
            this.states.hasFlipped = true;

            events.publish('play_sound', {name: 'attack_slash', restart: true });
        }
    } else {
        this.FrontSlash();
    }
};

Player.prototype.StabSlash = function() {
    if(this.upgrades.attackStab) {
        if(energyController.UseEnergy(6)) {
            this.state = this.AttackStab;

            // var dir = this.GetDirectionMultiplier();
            
            // this.movement.rollVelocity = 0;
            // this.tweens.roll = game.add.tween(this.movement).to({rollVelocity: dir * PLAYER_RUN_SLASH_SPEED()}, 300, Phaser.Easing.Exponential.InOut, false).to({rollVelocity: 0}, 500, Phaser.Easing.Exponential.InOut, false);
            // this.tweens.roll.start();

            var dir = this.GetDirectionMultiplier();

            this.body.maxVelocity.x = PLAYER_ROLL_SPEED();
            this.body.velocity.x = 0;

            this.movement.rollStage = 0;
            this.movement.rollDirection = dir;
            this.movement.rollStart = game.time.now;
            this.movement.rollPrevVel = 0;
            this.movement.rollPop = false;
            this.movement.stabFrames = 0;

            events.publish('play_sound', {name: 'attack_stab', restart: true });
            
        }
    } else {
        this.FrontSlash();
    }
};

Player.prototype.Roll = function(params) {

    if(!this.timers.TimerUp('frauki_roll') || this.state === this.Hurting || !this.upgrades.roll)
        return false;

    if(this.body.onFloor()) {
        
        if(!energyController.UseEnergy(1))
            return false;

        this.state = this.Rolling;

        var dir = this.GetDirectionMultiplier();

        this.body.maxVelocity.x = PLAYER_ROLL_SPEED();
        this.body.velocity.x = PLAYER_SPEED() * this.GetDirectionMultiplier();

        this.movement.rollStage = 0;
        this.movement.rollDirection = this.GetDirectionMultiplier();
        this.movement.rollStart = game.time.now;
        this.movement.rollPop = false;
        this.movement.rollPrevVel = 0;
        this.movement.rollFrames = 0;
    } else {
        this.DoubleJump();
    }

    this.timers.SetTimer('frauki_roll', 250);
    this.timers.SetTimer('frauki_grace', 300);

    effectsController.EnergyStreak();

    return true;
};

Player.prototype.Hit = function(e, damage, grace_duration) {

    damage = damage * 3;

    if(this.state === this.Hurting || e.state === e.Hurting || frauki.Attacking() || frauki.Grace())
        return;

    grace_duration = grace_duration || 1000;

    events.publish('play_sound', {name: 'ouch'});

    this.body.velocity.y = -150;

    //if they are crouching, half damage
    if(frauki.state === this.Crouching) {
        damage /= 2;
    }

    //effectsController.SpawnEnergyNuggets(this.body, e.body, 'negative', damage);
    effectsController.EnergySplash(frauki.body.center, 100, 'positive', 20, frauki.body.velocity);

    energyController.RemovePower(damage);
    energyController.AddCharge(damage / 10);

    console.log('Frauki is taking ' + damage + ' damage');

    if(this.body.center.x < e.body.center.x) {
        this.body.velocity.x = -500;
    } else {
        this.body.velocity.x = 500;
    } 

    this.state = this.Hurting;
    this.timers.SetTimer('frauki_grace', grace_duration);
    this.timers.SetTimer('frauki_hit', 500);
    events.publish('camera_shake', {magnitudeX: 8, magnitudeY: 5, duration: 500});

    if(energyController.neutralPoint > 0) {
        effectsController.SlowHit(400);
    } else {
        setTimeout(function() {
            frauki.alpha = 0;
            effectsController.EnergySplash(frauki.body.center, 200, 'positive', 50, frauki.body.velocity);
        }, 2000);
    }
};

//////////////////STATES/////////////////
Player.prototype.Standing = function() {
    this.PlayAnim('stand');

    if(this.body.velocity.y < 0) {
        this.state = this.Jumping;
    } else if(this.body.velocity.y > 10) {
        this.state = this.Falling;
    } else if(this.body.velocity.x !== 0) {
        this.state = this.Running;
    } else if(this.states.crouching) {
        this.state = this.Crouching;
    }
};

Player.prototype.Running = function() {

    if((frauki.states.flowLeft || frauki.states.flowRight) && !inputController.dpad.left && !inputController.dpad.right) {
        this.PlayAnim('fall');
    } else {
        this.PlayAnim('run');
    }

    if(this.body.velocity.x === 0 && this.body.onFloor()) {
        this.state = this.Standing;
    } else if(this.body.velocity.y < 0) {
        this.state = this.Jumping;
    } else if(this.body.velocity.y > 150) {
        this.state = this.Peaking;
    }
};

Player.prototype.Jumping = function() {
    if(this.animations.name !== 'roll_jump' || (this.animations.name === 'roll_jump' && this.animations.currentAnim.isFinished)) {
        this.PlayAnim('jump');
    }

    if(this.body.velocity.y >= 0) {
        this.state = this.Peaking;
    }
};

Player.prototype.Peaking = function() {
    this.PlayAnim('peak');

    this.body.gravity.y = game.physics.arcade.gravity.y * 1.5;

    if(this.body.velocity.y < 0) {
        this.state = this.Jumping;
    } else if(this.body.onFloor()) {
        this.state = this.Landing;
    } else if(this.animations.currentAnim.isFinished) {
        this.state = this.Falling;
    }
};

Player.prototype.Falling = function() {
    this.PlayAnim('fall');

    if(!this.states.inUpdraft) {
        this.body.gravity.y = game.physics.arcade.gravity.y * 1.5;
    }

    //if they jump into water, make sure they slow the hell down
    if(this.states.inWater && this.body.velocity.y > 300) {
        this.body.velocity.y = 300;
    }

    if(this.body.onFloor()) {
        
        if(this.body.velocity.x === 0) {
            if(this.states.crouching)
                this.state = this.Crouching;
            else
                this.state = this.Landing;
        }
        else {
            this.state = this.Running;
        }

        if(!frauki.states.inWater) effectsController.JumpDust(frauki.body.center);

    } else if(this.body.velocity.y < 0) {
        this.state = this.Jumping;
    }
};

Player.prototype.Landing = function() {
    this.PlayAnim('land');

    if(this.body.velocity.y < 0) {
        this.state = this.Jumping;
    }
    
    if(this.body.velocity.x !== 0) {
        this.state = this.Running;
    }

    if(this.animations.currentAnim.isFinished) {
        if(this.body.velocity.x === 0) {
            this.state = this.Standing;
        } else {
            this.state = this.Running;
        }
    }
};

Player.prototype.Crouching = function() {
    this.PlayAnim('crouch');

    if(!this.states.crouching || this.body.velocity.x !== 0 || this.body.velocity.y !== 0) {
        this.state = this.Standing;
    }
};

Player.prototype.Flipping = function() {
    this.PlayAnim('flip');

    if(this.animations.currentAnim.isFinished) {
        if(this.body.velocity.y > 0) {
            this.state = this.Falling;
        } else if(this.body.velocity.y < 0) {
            this.state = this.Jumping;
        } else if(this.body.velocity.x !== 0 && this.body.onFloor()) {
            this.state = this.Running;
        } else if(this.body.velocity.x === 0 && this.body.onFloor()) {
            this.state = this.Landing;
        }
    }
};

Player.prototype.Rolling = function() {
    this.PlayAnim('roll');
    
    this.body.maxVelocity.x = PLAYER_ROLL_SPEED();

    //pickup stage
    if(this.movement.rollStage === 0 && this.movement.rollFrames <= 10) {
        this.body.acceleration.x = this.movement.rollDirection * 5000 * (game.math.catmullRomInterpolation([0, 0.7, 1, 1, 0.7, 0], this.movement.rollFrames / 10) || 0);

    //ready to switch to release
    } else if(this.movement.rollStage === 0) {
        this.movement.rollStage = 1;
        this.movement.rollFrames = 0;

    //release stage
    } else if(this.movement.rollStage === 1 && this.movement.rollPop === false) {
        this.body.acceleration.x = 0;
        this.body.drag.x = 1500 * (game.math.catmullRomInterpolation([0.1, 0.7, 1, 1, 0.7, 0.1], this.movement.rollFrames / 10) || 1);
    } else if(this.movement.rollStage === 2) {
        this.body.maxVelocity.x = PLAYER_SPEED();
    }

    //if they are against a wall, transfer their horizontal acceleration into vertical acceleration
    if(this.body.velocity.x === 0 && this.movement.rollPop === false) {

        //roll boost is caluclated based on how close they were to the max roll speed
        var popBoost = Math.abs(this.movement.rollPrevVel) - PLAYER_SPEED(); 
        popBoost /= (PLAYER_ROLL_SPEED() - PLAYER_SPEED());

        popBoost *= -300;
        this.body.velocity.y = popBoost;
        this.movement.rollPop = true;

        this.movement.rollStage = 2;
    }

    this.movement.rollPrevVel = this.body.velocity.x;
    this.movement.rollFrames += 1;

    if(this.animations.currentAnim.isFinished) {

        if(this.body.velocity.y > 150) {
            this.state = this.Falling;
        } else if(!inputController.dpad.left && !inputController.dpad.right && this.body.onFloor()) {
            if(this.states.crouching) {
                this.state = this.Crouching;
                this.PlayAnim('crouch');
                this.animations.currentAnim.setFrame('Crouch0005');
            } else {
                this.state = this.Standing;
            }

            this.body.velocity.x = 0;

        } else if(this.body.velocity.x !== 0 && this.body.onFloor()) {
            this.state = this.Running;
        } else {
            this.state = this.Standing;
        }
    }
};

Player.prototype.Hurting = function() {
    this.PlayAnim('hit');

    this.body.drag.x = 0;

    if(this.timers.TimerUp('frauki_hit') && !Main.restarting) {
        if(this.body.velocity.y > 0) {
            this.state = this.Falling;
        } else if(this.body.velocity.x === 0) {
            this.state = this.Standing;
        } else {
            this.state = this.Running;
        }  
    }
};

Player.prototype.Materializing = function() {
    this.PlayAnim('materialize');

    if(this.animations.currentAnim.isFinished) {
        this.state = this.Standing;
    }
};

Player.prototype.AttackFront = function() {
    this.PlayAnim('attack_front');

    if(this.Attacking()) {
        this.body.maxVelocity.x = PLAYER_ROLL_SPEED() - 200;
        this.body.acceleration.x *= 3;

        if(this.body.velocity.y > 0 && (inputController.dpad.left || inputController.dpad.right)) {
            this.body.velocity.y = 0;
        }
    }

    if(this.animations.currentAnim.isFinished) {
        if(inputController.dpad.down && !inputController.dpad.left && !inputController.dpad.right && this.body.onFloor()) {
            this.state = this.Crouching;
            this.PlayAnim('crouch');
            this.animations.currentAnim.setFrame('Crouch0008');
        } else { 
            this.state = this.Standing;
        }
    }
};

Player.prototype.AttackOverhead = function() {
    this.PlayAnim('attack_overhead');

    if(this.body.onFloor()) {
        this.body.velocity.x /= 2;
    }
    
    if(this.animations.currentAnim.isFinished) {
        this.state = this.Standing;
    }
};

Player.prototype.AttackStab = function() {
    this.PlayAnim('attack_stab');

    //override the max velocity
    //this.body.maxVelocity.x = PLAYER_RUN_SLASH_SPEED();


    this.body.maxVelocity.x = PLAYER_RUN_SLASH_SPEED();

    //delay stage
    if(this.movement.rollStage === 0) {

        this.body.velocity.x = 0;

        if(this.movement.stabFrames >= 10) {
            this.movement.rollStage = 1;
            this.movement.stabFrames = 0;
        }

    //pickup stage
    } else if(this.movement.rollStage === 1 && this.movement.stabFrames <= 15) {
        this.body.acceleration.x = this.movement.rollDirection * 6000 * (game.math.catmullRomInterpolation([0, 0.1, 0.2, 0.4, 0.8, 1], this.movement.stabFrames / 15) || 1);

    //ready to switch to release
    } else if(this.movement.rollStage === 1) {
        this.movement.rollStage = 2;
        this.movement.stabFrames = 0;

    //release stage
    } else if(this.movement.rollStage === 2 && this.movement.rollPop === false) {
        this.body.acceleration.x = 0;
        this.body.drag.x = 2000 * (game.math.catmullRomInterpolation([0.1, 0.7, 1, 1, 0.7, 0.1], this.movement.stabFrames / 30) || 1);
    }

    var frameName = this.animations.currentFrame.name;
    if(frameName === 'Attack Stab0004' || frameName === 'Attack Stab0005' ||frameName === 'Attack Stab0006' || frameName === 'Attack Stab0007' || frameName === 'Attack Stab0008') {
        this.body.velocity.y = 0;
    }

    this.movement.stabFrames += 1;

    if(this.animations.currentAnim.isFinished) {
        
        if(this.body.velocity.y > 150) {
            this.state = this.Falling;
        } else if((inputController.dpad.left || inputController.dpad.right) && this.body.onFloor()) {
            this.state = this.Running;
        } else {
            this.state = this.Standing;
        }
    }
};

Player.prototype.AttackDiveCharge = function() {
    this.PlayAnim('attack_dive_charge');
    this.body.velocity.y = 0;
    
    this.body.maxVelocity.x = 1;

    if(this.animations.currentAnim.isFinished) {
        this.state = this.AttackDiveFall;
        this.timers.SetTimer('frauki_dive', 0);

        events.publish('play_sound', {name: 'attack_dive_fall'});

        effectsController.EnergyStreak();
        this.body.velocity.y = 20000;
    }
};

Player.prototype.AttackDiveFall = function() {
    this.PlayAnim('attack_dive_fall');
    this.body.maxVelocity.y = this.movement.diveVelocity;
    //this.body.acceleration.y = 20000;//this.movement.diveVelocity / (frauki.states.inUpdraft ? 3 : 1);
    
    this.body.maxVelocity.x = 100;

    if(this.body.velocity.y < 0) {
        this.state = this.Jumping;
        events.publish('stop_sound', {name: 'attack_dive_fall'});
        this.movement.diveVelocity = 0;

    } else if(this.body.onFloor()) {
        this.movement.diveVelocity = 0;

        events.publish('camera_shake', {magnitudeX: 12, magnitudeY: 8, duration: 400});

        events.publish('stop_sound', {name: 'attack_dive_fall'});
        events.publish('play_sound', {name: 'attack_dive_land'});

        this.state = this.AttackDiveLand;

        effectsController.EnergyStreak();

    } 
};

Player.prototype.AttackDiveLand = function() {
    this.PlayAnim('attack_dive_land');
    this.body.velocity.y = 0;
    
    this.body.maxVelocity.x = 1;

    if(this.animations.currentAnim.isFinished) {
        if(this.body.velocity.x === 0) {
            if(this.states.crouching)
                this.state = this.Crouching;
            else
                this.state = this.Standing;
        }
        else {
            this.state = this.Running;
        }
    }
};

Player.prototype.AttackJump = function() {
    this.PlayAnim('attack_overhead');

    //this.body.velocity.x /= 1.01;

    if(this.body.velocity.y < 0) {
        this.body.gravity.y = game.physics.arcade.gravity.y * 1.5;
    }

    // if(this.movement.jumpSlashVelocity !== 0)
    //     this.body.velocity.y = this.movement.jumpSlashVelocity;

    if(this.animations.currentAnim.isFinished) {
        this.state = this.Jumping;
    }
};
