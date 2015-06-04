PLAYER_SPEED = function() { return 255; }
PLAYER_ROLL_SPEED = function() { return 650; }
PLAYER_RUN_SLASH_SPEED = function() { return  650; }
PLAYER_JUMP_VEL = function() { return -400; }
PLAYER_DOUBLE_JUMP_VEL = function() { return -350; }
PLAYER_JUMP_SLASH_SPEED = function() { return 1075; }

Player = function (game, x, y, name) {

    Phaser.Sprite.call(this, game, x, y, name);
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.anchor.setTo(0.5, 1);

    this.body.collideWorldBounds = true;
    this.body.setSize(11, 50, 0, -75);
    this.body.maxVelocity.y = 500;
    this.body.drag.x = 2000;

    //load up the animations
    fraukiAnimations.forEach(function(anim) {
        this.animations.add(anim.Name, anim.Frames, anim.Fps, anim.Loop, false);
    }, this);

    this.state = this.Standing;
    this.PlayAnim('stand');
    
    this.tweens = {};
    this.tweens.roll = null;
    this.tweens.stopJump = null;

    this.states = {};
    this.states.direction = 'right';
    this.states.crouching = false;
    this.states.hasFlipped = false;
    this.states.upPresseed = false;
    this.states.wasAttacking = false;
    this.states.inWater = false;
    this.states.onCloud = false;
    this.states.droppingThroughCloud = false;

    this.movement = {};
    this.movement.rollVelocity = 0;
    this.movement.diveVelocity = 0;
    this.movement.jumpSlashVelocity = 0;
    this.movement.rollBoost = 0;
    this.movement.startRollTime = game.time.now;

    this.timers = new TimerUtil();

    this.currentAttack = {};
    this.attackRect = game.add.sprite(0, 0, null);
    game.physics.enable(this.attackRect, Phaser.Physics.ARCADE);
    this.attackRect.body.setSize(0, 0, 0, 0);

    events.subscribe('player_jump', this.Jump, this);
    events.subscribe('player_crouch', this.Crouch, this);
    events.subscribe('player_slash', this.Slash, this);
    events.subscribe('player_roll', this.Roll, this);
    events.subscribe('player_run', this.StartStopRun, this);
    events.subscribe('control_up', function(params) { 
        this.states.upPressed = params.pressed;
    }, this);

    //set up the run dust
    this.runDust = game.add.sprite(0, 0, 'Misc');
    this.runDust.animations.add('dust', ['RunDust0000', 'RunDust0001', 'RunDust0002', 'RunDust0003'], 15, true, false);
    this.runDust.play('dust');
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.preStateUpdate = function() {
    this.body.maxVelocity.x = PLAYER_SPEED() + this.movement.rollBoost;
    this.body.maxVelocity.y = 500;

    if(this.states.inWater) {
        this.body.maxVelocity.x *= 0.7;
    }

    this.body.gravity.y = 0;
    this.body.drag.x = 2000;

    if(this.state === this.Running && Math.abs(this.body.velocity.x) > 300) {
        this.runDust.visible = true;
    } else {
        this.runDust.visible = false;
    }
};

Player.prototype.postStateUpdate = function() {
    //reset the double jump flag
    if(this.body.onFloor()) {
        this.states.hasFlipped = false;
        this.movement.rollBoost = 0;
    }

    if(this.state === this.Crouching || this.state === this.Rolling || this.state === this.Flipping) {
        this.body.height = 30;
    } else {
        this.body.height = 50;
    }

    if(!!frauki.attackRect && frauki.attackRect.body.width != 0) {
        game.physics.arcade.overlap(frauki.attackRect, Frogland.GetCurrentObjectGroup(), EnemyHit);
        game.physics.arcade.overlap(frauki.attackRect, projectileController.projectiles, ProjectileHit);
    }
    
    if(this.state === this.Running) {
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
    if(this.states.direction !== dir) {
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

        this.attackRect.body.x = this.currentAttack.x; 
        this.attackRect.body.y = this.currentAttack.y; 
        this.attackRect.body.width = this.currentAttack.w; 
        this.attackRect.body.height = this.currentAttack.h;

        return;
    }

    //check for a frame mod and apply its mods
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

Player.prototype.Attacking = function() {
    if(!!this.attackRect && this.attackRect.body.width !== 0)
        return true;
    else
        return false;
};

Player.prototype.GetDirectionMultiplier = function() {
    var dir = 1;
    if(inputController.runLeft.isDown) {
        this.SetDirection('left');
        dir = -1;
    } else if (inputController.runRight.isDown) {
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

////////////////ACTIONS//////////////////
Player.prototype.Run = function(params) {
    if(this.state === this.Hurting || this.state === this.Rolling || this.state === this.AttackStab) 
        return;

    if(params.dir === 'left') {
        this.body.acceleration.x = -1500;
        this.SetDirection('left');
    } else if(params.dir === 'right') {
        this.body.acceleration.x = 1500;
        this.SetDirection('right');
    } else {
        this.body.acceleration.x = 0;
        this.movement.rollBoost = 0;
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

    } 
};

Player.prototype.Jump = function(params) {
    if(this.state === this.Hurting) 
        return;

    if(params.jump) {
        //drop through cloud tiles
        if(this.state === this.Crouching && this.states.onCloud) {
            this.states.droppingThroughCloud = true;
            game.time.events.add(200, function() { frauki.states.droppingThroughCloud = false; } );
            return;
        }
        
        //normal jump
        if(this.state === this.Standing || this.state === this.Running || this.state === this.Landing) {
            this.body.velocity.y = PLAYER_JUMP_VEL();
            events.publish('play_sound', {name: 'jump'});
        }
        //double jump
        else if(this.states.hasFlipped === false && this.state !== this.Rolling && this.state !== this.AttackStab) {
            if(energyController.UseEnergy(1)) {
                if(this.tweens.stopJump) { this.tweens.stopJump.stop(); }
    
                this.body.velocity.y = PLAYER_DOUBLE_JUMP_VEL();
                this.state = this.Flipping;
                this.states.hasFlipped = true;
                this.timers.SetTimer('frauki_grace', 300);

                events.publish('play_sound', {name: 'airhike'});
            }
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
    
                //this.tweens.roll.stop();
                this.movement.rollVelocity = 0;
    
                //add a little boost to their jump
                this.body.velocity.y -= 50;
            } else {
                this.state = this.Jumping;
            }
        }
    } else if(this.body.velocity.y < 0 && this.state !== this.Flipping) {
        if(this.body.velocity.y < 0)
            this.tweens.stopJump = game.add.tween(this.body.velocity).to({y: 0}, 100, Phaser.Easing.Exponential.In, true);
    }
};

Player.prototype.Crouch = function(params) {
    this.states.crouching = params.crouch;

    this.timers.SetTimer('frauki_dash', 200);
};

Player.prototype.Slash = function(params) {

    //diving dash
    if(!this.timers.TimerUp('frauki_dash') && this.states.crouching && (this.state === this.Jumping || this.state === this.Peaking || this.state === this.Falling)) {
        if(energyController.UseEnergy(6)) {
            this.state = this.AttackDiveCharge;
            this.movement.diveVelocity = 950;
            events.publish('play_sound', {name: 'attack_dive_charge', restart: true });
        }
    }
    //running dash
    else if(this.state === this.Rolling || this.state === this.Kicking) {
        if(energyController.UseEnergy(6)) {
            this.state = this.AttackStab;
    
            var dir = this.GetDirectionMultiplier();
            
            this.movement.rollVelocity = 0;
            this.tweens.roll = game.add.tween(this.movement).to({rollVelocity: dir * PLAYER_RUN_SLASH_SPEED()}, 300, Phaser.Easing.Exponential.InOut, false).to({rollVelocity: 0}, 500, Phaser.Easing.Exponential.InOut, false);
            this.tweens.roll.start();

            events.publish('play_sound', {name: 'attack_stab', restart: true });
            
        }
    }
    //upwards dash attack
    else if(this.states.upPressed && !inputController.runLeft.isDown && !inputController.runRight.isDown && (this.state === this.Peaking || this.state === this.Jumping) && this.states.hasFlipped === false) {
        if(energyController.UseEnergy(6)) {
            this.state = this.AttackJump;
            this.movement.jumpSlashVelocity = -(PLAYER_JUMP_SLASH_SPEED());
            game.add.tween(this.movement).to({jumpSlashVelocity:0}, 400, Phaser.Easing.Quartic.Out, true);
            this.states.hasFlipped = true;
    
            events.publish('play_sound', {name: 'attack_slash', restart: true });
        }
    }
    //normal slashes while standing or running
    else if(this.state === this.Standing || this.state === this.Landing || this.state === this.AttackStab || this.state === this.Running || this.state === this.Jumping || this.state === this.Peaking || this.state === this.Falling || this.state === this.Flipping) {
        if(energyController.UseEnergy(5)) {
            if(this.states.upPressed) {
                this.state = this.AttackOverhead;
            } else {
                this.state = this.AttackFront;
            }

            events.publish('play_sound', {name: 'attack_slash', restart: true });
        }
    } else {
        console.log('An attack was attempted in an unresolved state ', this.state);
    }
};

Player.prototype.Roll = function(params) {

    if(!this.timers.TimerUp('frauki_roll'))
        return;

    if(!this.body.onFloor())
        return;
        
    if(!energyController.UseEnergy(1))
        return;

    this.state = this.Rolling;

    var dir = this.GetDirectionMultiplier();

    this.movement.rollVelocity = dir * PLAYER_SPEED();
    //this.tweens.roll = game.add.tween(this.movement).to({rollVelocity: dir * PLAYER_ROLL_SPEED()}, 50, Phaser.Easing.Exponential.In, false).to({rollVelocity: dir * PLAYER_SPEED()}, 300, Phaser.Easing.Quartic.In, false);
    //this.tweens.roll.start();
    this.body.velocity.x = PLAYER_SPEED() * this.GetDirectionMultiplier();

    this.movement.rollStage = 0;
    this.movement.rollDirection = this.GetDirectionMultiplier();
    this.movement.rollStart = game.time.now;

    this.timers.SetTimer('frauki_roll', 650);
    this.timers.SetTimer('frauki_grace', 300);
};

Player.prototype.Hit = function(f, e) {

    if(this.state === this.Hurting || e.state === e.Hurting || frauki.Attacking() || frauki.Grace())
        return;

    events.publish('play_sound', {name: 'ouch'});

    this.body.velocity.y = -300;

    effectsController.ParticleSpray(this.body, e.body, 'yellow', e.PlayerDirection(), e.damage);

    energyController.RemoveEnergy(e.damage);

    e.poise += e.initialPoise;

    this.body.center.x < e.body.center.x ? this.body.velocity.x = -200 : this.body.velocity.x = 200;

    this.state = this.Hurting;
    this.timers.SetTimer('frauki_grace', 1000);
    this.timers.SetTimer('frauki_hit', 500);
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
    this.PlayAnim('run');

    this.runDust.y = this.body.y + this.body.height - this.runDust.height;

    //position the dust
    if(this.states.direction === 'right') {
        this.runDust.x = this.body.x - 20;
        this.runDust.scale.x = 1;
    } else {
        this.runDust.x = this.body.x + 30;
        this.runDust.scale.x = -1;
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

    this.body.gravity.y = game.physics.arcade.gravity.y * 2;

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

    this.body.gravity.y = game.physics.arcade.gravity.y * 2;

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
    
    console.log(this.body.acceleration.y);

    this.body.maxVelocity.x = PLAYER_ROLL_SPEED();

    var dur = game.time.now - this.movement.rollStart;
    var accelMod = 0;

    if(inputController.runLeft.isDown && !inputController.runRight.isDown) {
        accelMod = -500;
    } else if(!inputController.runLeft.isDown && inputController.runRight.isDown) {
        accelMod = 500;
    }

    //pickup stage
    if(Math.abs(this.body.velocity.x) < PLAYER_ROLL_SPEED() && this.movement.rollStage === 0) {
        dur /= 130;
        this.body.acceleration.x = this.movement.rollDirection * 5500 * game.math.catmullRomInterpolation([0, 0.7, 1, 1, 0.7, 0], dur);
        this.body.acceleration.x += accelMod;

    //ready to switch to release
    } else if(Math.abs(this.body.velocity.x) == PLAYER_ROLL_SPEED() && this.movement.rollStage === 0) {
        this.movement.rollStage = 1;
        this.movement.rollStart = game.time.now;

    //release stage
    } else if(this.movement.rollStage === 1) {
        dur /= 300;
        //this.body.acceleration.x = this.movement.rollDirection * 1800 * -1 * game.math.catmullRomInterpolation([0, 0.7, 1, 1, 0.7, 0], dur);
        //this.body.acceleration.x += accelMod;
        this.body.acceleration.x = 0;
        this.body.drag.x = 1600 * game.math.catmullRomInterpolation([0.1, 0.7, 1, 1, 0.7, 0.1], dur);
    }
    
    //if they are against a wall, transfer their horizontal acceleration into vertical acceleration
    if((this.body.touching.left || this.body.touching.right) && this.body.velocity >= 0) {
        this.body.velocity.y = -200;//(-1 * Math.abs(this.body.acceleration.x)) / 10;
    }

    if(this.animations.currentAnim.isFinished) {

        if(this.body.velocity.y > 150) {
            this.state = this.Falling;
        } else if(!inputController.runLeft.isDown && !inputController.runRight.isDown && this.body.onFloor()) {
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

        this.movement.rollVelocity = 0;
    }
};

Player.prototype.Hurting = function() {
    this.PlayAnim('hit');

    if(this.timers.TimerUp('frauki_hit') && !Frogland.restarting) {
        if(this.body.velocity.y > 0) {
            this.state = this.Falling;
        } else if(this.body.velocity.x === 0) {
            this.state = this.Standing;
        } else {
            this.state = this.Running;
        }  
    }
};

Player.prototype.AttackFront = function() {
    this.PlayAnim('attack_front');

    if(this.body.onFloor()) {
        this.body.velocity.x /= 2;
    }

    if(this.animations.currentAnim.isFinished) {
        this.state = this.Standing;
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
    this.body.maxVelocity.x = PLAYER_RUN_SLASH_SPEED();
    this.body.velocity.x = this.movement.rollVelocity;

    var frameName = this.animations.currentFrame;
    if(frameName === 'Attack Stab0006' || frameName === 'Attack Stab0007' || frameName === 'Attack Stab0008' || frameName === 'Attack Stab0009' || frameName === 'Attack Stab0010' || frameName === 'Attack Stab0011') {
        this.body.velocity.y = 0;
    }

    if(this.body.velocity.y < 0) {
        this.state = this.Jumping;
        this.movement.rollVelocity = 0;
    } 

    if(this.animations.currentAnim.isFinished) {

        this.tweens.roll.stop();
        this.movement.rollVelocity = 0;
        
        if(this.body.velocity.y > 150) {
            this.state = this.Falling;
        } else if((inputController.runLeft.isDown || inputController.runRight.isDown) && this.body.onFloor()) {
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
    }
};

Player.prototype.AttackDiveFall = function() {
    this.PlayAnim('attack_dive_fall');
    this.body.maxVelocity.y = this.movement.diveVelocity;
    this.body.velocity.y = this.movement.diveVelocity;
    
    this.body.maxVelocity.x = 100;
    
    //use some energy every tenth of a second
    if(this.timers.TimerUp('frauki_dive')) {
        //if they run out of energy, the attack fizzles into a fall
        if(!energyController.UseEnergy(1)) {
            this.movement.diveVelocity = 0;
            this.state = this.Falling;
            events.publish('stop_sound', {name: 'attack_dive_fall'});
        }
        
        this.timers.SetTimer('frauki_dive', 50);
    }

    if(this.body.onFloor()) {
        this.movement.diveVelocity = 0;

        events.publish('camera_shake', {magnitudeX: 15, magnitudeY: 5, duration: 250});

        events.publish('stop_sound', {name: 'attack_dive_fall'});
        events.publish('play_sound', {name: 'attack_dive_land'});

        this.state = this.AttackDiveLand;

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

    this.body.velocity.x /= 2;

    if(this.movement.jumpSlashVelocity !== 0)
        this.body.velocity.y = this.movement.jumpSlashVelocity;

    if(this.animations.currentAnim.isFinished) {
        this.state = this.Jumping;
    }
};

Player.prototype.Kicking = function() {
    this.PlayAnim('kick');
    this.body.velocity.x = this.movement.rollVelocity;

    if(this.body.velocity.x !== 0 && this.body.onFloor()) {
            this.state = this.Running;
    } else if(this.body.velocity.x === 0 && this.body.onFloor()) {
        this.state = this.Landing;
    }

    if(this.timers.TimerUp('frauki_kick')) {
        if(this.body.velocity.y >= 0) {
            this.state = this.Falling;
        } else if(this.body.velocity.y < 0) {
            this.state = this.Jumping;
        }
    }
}
