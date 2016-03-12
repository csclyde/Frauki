PLAYER_SPEED = function() { return frauki.states.shielded ? 130 : 190; }
PLAYER_ROLL_SPEED = function() { return 460; }
PLAYER_RUN_SLASH_SPEED = function() { return  550; }
PLAYER_JUMP_VEL = function() { return frauki.states.shielded ? -250 : -350; }
PLAYER_DOUBLE_JUMP_VEL = function() { return frauki.states.shielded ? -200 : -275; }

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

    this.ChangeState(this.Standing);
    this.PlayAnim('stand');
    
    this.tweens = {};
    this.tweens.roll = null;

    this.states = {};
    this.movement = {};
    this.upgrades = {};

    this.timers = new TimerUtil();

    this.Reset();
    this.alpha = 0;

    this.currentAttack = {};
    this.attackRect = game.add.sprite(0, 0, null);
    game.physics.enable(this.attackRect, Phaser.Physics.ARCADE);
    this.attackRect.body.setSize(0, 0, 0, 0);

    events.subscribe('player_jump', this.Jump, this);
    events.subscribe('player_crouch', this.Crouch, this);
    events.subscribe('player_slash', this.Slash, this);
    events.subscribe('player_roll', this.Roll, this);
    events.subscribe('player_run', this.StartStopRun, this);
    events.subscribe('player_heal', this.Heal, this);
    events.subscribe('control_up', function(params) { 

        this.states.upPressed = params.pressed;

        if(frauki.state === this.Hurting) {
            return;
        }

        //this allows an inverted seaquence of inputs for the jump slash
        if(this.state === this.AttackFront && this.body.onFloor() === false && !this.timers.TimerUp('slash_start_window')) {
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

    if(this.state === this.Healing) {
        effectsController.MaterializeApple(frauki.body.center.x, frauki.body.y - 5, true);
    } else if(effectsController.materializingApple.visible) {
        effectsController.MaterializeApple(0, 0, false);
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
        this.body.acceleration.y = -720;
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

    if(!this.timers.TimerUp('frauki_invincible')) {
        frauki.alpha = (((Math.sin(game.time.now / 50) + 1) / 2) * 0.4) + 0.5;
    } else if(this.state !== this.Hurting && this.alpha !== 0) {
        frauki.alpha = 1;
    }
};

Player.prototype.update = function() {
    this.preStateUpdate();
    this.state();
    this.postStateUpdate();
};

Player.prototype.SetDirection = function(dir) {
    if(this.states.direction !== dir && this.animations.paused === false && !this.InAttackAnim()) {
        this.states.direction = dir;

        dir === 'left' ? this.scale.x = -1 : this.scale.x = 1;
    }
};

Player.prototype.PlayAnim = function(name) {
    if(this.animations.currentAnim.name !== name) {
        this.animations.play(name);
    }
};

Player.prototype.ChangeState = function(newState) {
    if(this.state !== this.Stunned) {
        this.state = newState;
    }

    if(newState === this.Running) {
        events.publish('play_sound', {name: 'running'});
    } else {
        events.publish('stop_sound', {name: 'running'});
    }
};

Player.prototype.Grace = function() {

    return !this.timers.TimerUp('frauki_grace') || !this.timers.TimerUp('frauki_invincible');
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

    return this.currentAttack.damage * (GetCurrentShardType() === 'Power' ? 2 : 1);
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

    if(['attack_front', 'attack_overhead', 'attack_jump', 'attack_stab', 'attack_dive_charge', 'attack_dive_fall', 'attack_dive_land', 'attack_fall', 'attack_lunge'].indexOf(frameName) > -1) {
        return true;
    } else {
        return false;
    }
};

Player.prototype.InPreAttackAnim = function() {
    var frameName = this.animations.currentFrame.name;

    if(['Attack Stab0000', 
        'Attack Stab0000', 
        'Attack Stab0001', 
        'Attack Stab0002', 
        'Attack Stab0003', 

        'Attack Dive0000', 
        'Attack Dive0001', 
        'Attack Dive0002', 
        'Attack Dive0003', 
        'Attack Dive0004',
        'Attack Dive0005', 
        'Attack Dive0006', 
        'Attack Dive0007', 
        'Attack Dive0008', 

        'Attack Front0001',

        'Attack Jump0000', 

        'Attack Overhead0000', 
        'Attack Overhead0001', 
        'Attack Overhead0002', 
        'Attack Overhead0003', 

        'Attack Fall0000', 
        'Attack Fall0001'].indexOf(frameName) > -1) {
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

Player.prototype.Reset = function() {
    this.alpha = 1;
    this.state = this.Materializing;
    this.SetDirection('right');
    this.timers.SetTimer('frauki_invincible', 0);

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
    this.states.attackFallLanded = false;
    this.states.shielded = false;

    this.movement.diveVelocity = 0;
    this.movement.jumpSlashVelocity = 0;
    this.movement.rollBoost = 0;
    this.movement.startRollTime = game.time.now;
    this.movement.rollPop = false;
    this.movement.rollPrevVel = 0;
    this.movement.rollDirection = 1;

    this.upgrades.roll = true;
    this.upgrades.hike = true;
    this.upgrades.attackFront = true;
    this.upgrades.attackOverhead = true;
    this.upgrades.attackStab = true;
    this.upgrades.attackDive = true;
};


////////////////ACTIONS//////////////////
Player.prototype.Run = function(params) {

    if( this.state === this.Hurting || 
        (this.state === this.Rolling && this.movement.rollPop === false) || 
        this.state === this.AttackStab || 
        this.state === this.Stunned ||
        this.state === this.Materializing) 
        return;

    if(params.dir === 'left') {
        this.SetDirection('left');
        this.body.acceleration.x = -1000;
    } else if(params.dir === 'right') {
        this.SetDirection('right');
        this.body.acceleration.x = 1000;
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
        } else if(params.dir === this.states.direction && frauki.body.onFloor()) {
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
    if( this.state === this.Hurting || 
        this.state === this.AttackDiveLand || 
        this.state === this.AttackFall ||
        this.state === this.Stunned) 
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
        if(this.state === this.Standing || this.state === this.Running || this.state === this.Landing || this.state === this.Crouching) {
            this.body.velocity.y = PLAYER_JUMP_VEL();
            events.publish('play_sound', {name: 'jump'});
        }
        //roll jump
        else if(this.state === this.Rolling) {
            if(energyController.UseEnergy(1)) { 
                this.ChangeState(this.Jumping);
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
            events.publish('stop_sound', {name: 'roll'});
        }
        //overhead into jump atack
        else if(!this.timers.TimerUp('slash_start_window') && (this.state === this.AttackOverhead || this.state === this.AttackFront)) {
            this.JumpSlash();
        }
        //double jump
        else if(!this.InAttackAnim()) {
            this.DoubleJump();
        }
    } else if(this.body.velocity.y < 0 && this.state !== this.Flipping) {
        if(this.body.velocity.y < 0) {
            this.body.velocity.y /= 2;
        }

    }
};

Player.prototype.DoubleJump = function() {
    if(this.states.hasFlipped === false && this.state !== this.Rolling && this.state !== this.AttackStab && this.state !== this.AttackOverhead && this.state !== this.AttackFall && energyController.UseEnergy(1)) {

        var jumpVel = this.state === this.Hanging ? PLAYER_JUMP_VEL() : PLAYER_DOUBLE_JUMP_VEL();

        if(this.body.velocity.y > jumpVel) {
            this.body.velocity.y = jumpVel;
        } else {
            this.body.velocity.y += jumpVel;
        }

        this.ChangeState(this.Flipping);
        this.states.hasFlipped = true;
        //this.timers.SetTimer('frauki_grace', 300);

        events.publish('play_sound', {name: 'airhike'});
        events.publish('stop_sound', {name: 'attack_dive_fall'});

        effectsController.EnergyStreak();
        effectsController.SpriteTrail(frauki, 150, 400, 300);
    }
};

Player.prototype.Crouch = function(params) {
    this.states.crouching = params.crouch;

    this.timers.SetTimer('frauki_dash', 200);

    if((this.state === this.AttackFall || this.state === this.AttackJump) && this.body.onFloor() === false && !this.timers.TimerUp('slash_start_window')) {
        this.DiveSlash();
    }
};

Player.prototype.Heal = function(params) {
    if(params.charging) {
        if(energyController.GetApples() > 0) {
            this.ChangeState(this.Healing);
            this.timers.SetTimer('heal_charge', 1100); 

            this.timers.SetTimer('frauki_invincible', 0);
        } else {
            events.publish('play_sound', {name: 'no_energy'});
        }
    } else {
        if(this.state === this.Healing) {
            this.ChangeState(this.Standing);
        }
    }
};

Player.prototype.Slash = function(params) {

    //stop the current weapon
    events.publish('activate_weapon', { activate: false });

    var attackResult = false;

    //diving dash
    if(this.states.crouching && (this.state === this.Jumping || this.state === this.Peaking || this.state === this.Falling || this.state === this.Flipping)) {
        attackResult = this.DiveSlash();
    }
    //running dash
    else if(this.state === this.Rolling || (this.state === this.Flipping && (inputController.dpad.left || inputController.dpad.right))) {
        attackResult = this.StabSlash();
    }
    //upwards dash attack
    else if((this.state === this.Jumping || (this.state === this.Peaking && inputController.dpad.up) || (this.state === this.Falling && inputController.dpad.up)) && this.states.hasFlipped === false) {
        attackResult = this.JumpSlash();
    }
    //falling slash
    else if(this.state === this.Peaking || this.state === this.Falling) {
        attackResult = this.FallSlash();
    }
    //normal slashes while standing or running
    else if(this.state === this.Standing || this.state === this.Landing || this.state === this.Running || this.state === this.Jumping || this.state === this.Flipping || this.state === this.Crouching) {
        attackResult = this.FrontSlash();
    } 
    else {
        console.log('An attack was attempted in an unresolved state ', this.state);
        return;
    }

    this.timers.SetTimer('slash_start_window', 200);

    if(attackResult) {
        this.timers.SetTimer('frauki_invincible', 0);

        effectsController.EnergyStreak();
        effectsController.SpriteTrail(frauki, 150, 500, 300);
    } else {
        this.WhiffSlash();
    }
};

Player.prototype.FrontSlash = function() {
    if(energyController.UseEnergy(3)) {
        if(this.upgrades.attackOverhead && this.states.upPressed) {
            this.ChangeState(this.AttackOverhead);
        } else {
            this.ChangeState(this.AttackFront);
        }

        events.publish('play_sound', {name: 'attack_slash', restart: true });  

        return true; 
    }

    return false;
};

Player.prototype.LungeSlash = function() {
    if(energyController.UseEnergy(3)) {
        this.ChangeState(this.AttackLunge);

        events.publish('play_sound', {name: 'attack_slash', restart: true });

        return true;
    }

    return false;
};

Player.prototype.FallSlash = function() {
    if(energyController.UseEnergy(4)) {
        this.ChangeState(this.AttackFall);

        events.publish('play_sound', {name: 'attack_slash', restart: true });
        this.timers.SetTimer('fall_attack_wait', 800);

        return true;
    }

    return false;
};

Player.prototype.DiveSlash = function() {
    if(energyController.UseEnergy(6)) {
        this.ChangeState(this.AttackDiveCharge);
        this.movement.diveVelocity = 950;

        events.publish('play_sound', {name: 'attack_dive_charge', restart: true });

        return true;
    }

    return false;
};

Player.prototype.JumpSlash = function() {
    if(energyController.UseEnergy(4)) {
        this.ChangeState(this.AttackJump);
        
        if(this.body.velocity.y > PLAYER_DOUBLE_JUMP_VEL()) {
            this.body.velocity.y = PLAYER_DOUBLE_JUMP_VEL();
        } else {
            this.body.velocity.y += PLAYER_DOUBLE_JUMP_VEL();
        }

        this.states.hasFlipped = true;

        events.publish('play_sound', {name: 'attack_slash', restart: true });

        return true;
    }

    return false;
};

Player.prototype.StabSlash = function() {
    if(energyController.UseEnergy(5)) {
        this.ChangeState(this.AttackStab);

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
        
        return true;
    }

    return false;
};

Player.prototype.WhiffSlash = function() {

    this.ChangeState(this.AttackWhiff);
};

Player.prototype.Roll = function(params) {

    if(!this.timers.TimerUp('frauki_roll') || this.state === this.Hurting || this.InAttackAnim())
        return false;

    if(this.body.onFloor()) {
        
        if(!energyController.UseEnergy(1))
            return false;

        this.ChangeState(this.Rolling);

        var dir = this.GetDirectionMultiplier();

        this.body.maxVelocity.x = PLAYER_ROLL_SPEED();
        this.body.velocity.x = PLAYER_SPEED() * this.GetDirectionMultiplier();

        this.movement.rollStage = 0;
        this.movement.rollDirection = this.GetDirectionMultiplier();
        this.movement.rollStart = game.time.now;
        this.movement.rollPop = false;
        this.movement.rollPrevVel = 0;
        this.movement.rollFrames = 0;

        effectsController.EnergyStreak();
        effectsController.SpriteTrail(frauki, 100, 400, 300);

        events.publish('play_sound', {name: 'roll'});

    } else {
        this.DoubleJump();
    }

    this.timers.SetTimer('frauki_roll', 250);
    this.timers.SetTimer('frauki_grace', 300);

    return true;
};

Player.prototype.LandHit = function(e, damage) {

    var vel = new Phaser.Point(frauki.body.center.x - e.body.center.x, frauki.body.center.y - e.body.center.y);
    vel = vel.normalize();

    vel = vel.setMagnitude(300);

    if(this.state !== this.AttackStab && this.state !== this.AttackDiveFall && this.state !== this.Rolling) {
        frauki.body.velocity.x = vel.x;
        //frauki.body.velocity.y = vel.y;
    }

    effectsController.ClashStreak(e.body.center.x, e.body.center.y, game.rnd.between(1, 2));

    if(damage > 0 && e.maxEnergy > 1) {
        effectsController.SlowHit(600);
    } else if(damage === 0) {
        effectsController.SlowHit(300);
    }

    this.states.hasFlipped = false;

    events.publish('stop_attack_sounds');
};

Player.prototype.Hit = function(e, damage, grace_duration) {

    if(this.state === this.Stunned) {
        damage *= 1.5;
    }

    if(this.state === this.Hurting || e.state === e.Hurting || frauki.Grace())
        return;

    grace_duration = grace_duration || 1000;

    events.publish('play_sound', {name: 'ouch'});

    this.body.velocity.y = -150;

    //if they are crouching, half damage
    if(frauki.state === this.Crouching) {
        damage /= 2;
    }

    energyController.RemoveHealth(damage);

    console.log('Frauki is taking ' + damage + ' damage');

    if(this.body.center.x < e.body.center.x) {
        this.body.velocity.x = -500;
    } else {
        this.body.velocity.x = 500;
    } 

    this.ChangeState(this.Hurting);
    this.timers.SetTimer('frauki_grace', grace_duration);
    this.timers.SetTimer('frauki_hit', 600);

    effectsController.SpriteTrail(frauki, 200, 800, 300, 0xf20069);
    effectsController.StarBurst(this.body.center);

    if(energyController.GetHealth() > 0) {
        effectsController.ScreenFlash();
        effectsController.SlowHit(400);
    } else {
        game.time.events.add(2000, function() {
            frauki.alpha = 0;
            effectsController.EnergySplash(frauki.body, 200, 'positive', 50, frauki.body.velocity);
        });
    }

    //allow the enemy to steal the shard
    // if(!!this.carriedShard) {
    //     PickUpShard(e, this.carriedShard); 
    // }
};

Player.prototype.Interrupt = function() {

    this.ChangeState(this.Standing);
};

Player.prototype.Stun = function(e) {

    this.ChangeState(this.Stunned);
    this.timers.SetTimer('stunned', 2000);

    this.body.velocity.y = -200;

    this.body.acceleration.x = 0;
    this.body.acceleration.y = 0;

    if(this.body.center.x < e.body.center.x) {
        this.body.velocity.x = -30;
    } else {
        this.body.velocity.x = 30;
    } 
};

//////////////////STATES/////////////////
Player.prototype.Standing = function() {
    this.PlayAnim('stand');

    if(this.body.velocity.y < 0) {
        this.ChangeState(this.Jumping);
    } else if(this.body.velocity.y > 10) {
        this.ChangeState(this.Falling);
    } else if(this.body.velocity.x !== 0) {
        this.ChangeState(this.Running);
    } else if(this.states.crouching) {
        this.ChangeState(this.Crouching);
    }
};

Player.prototype.Running = function() {

    if((frauki.states.flowLeft || frauki.states.flowRight) && !inputController.dpad.left && !inputController.dpad.right) {
        this.PlayAnim('fall');
    } else if((this.body.acceleration.x < 0 && this.body.velocity.x > 0) || (this.body.acceleration.x > 0 && this.body.velocity.x < 0)) {
        this.PlayAnim('slide');
    } else {
        this.PlayAnim('run');
    }

    if(this.body.velocity.x === 0 && this.body.onFloor()) {
        this.ChangeState(this.Standing);
    } else if(this.body.velocity.y < 0) {
        this.ChangeState(this.Jumping);
    } else if(this.body.velocity.y > 20) {
        this.ChangeState(this.Peaking);
    }
};

Player.prototype.Jumping = function() {
    if(this.animations.name !== 'roll_jump' || (this.animations.name === 'roll_jump' && this.animations.currentAnim.isFinished)) {
        this.PlayAnim('jump');
    }

    if(this.body.velocity.y >= 0) {
        this.ChangeState(this.Peaking);
    }
};

Player.prototype.Peaking = function() {
    this.PlayAnim('peak');

    this.body.gravity.y = game.physics.arcade.gravity.y * 1.2;

    if(this.body.velocity.y < 0) {
        this.ChangeState(this.Jumping);
    } else if(this.body.onFloor()) {
        this.ChangeState(this.Landing);
    } else if(this.animations.currentAnim.isFinished) {
        this.ChangeState(this.Falling);
    }
};

Player.prototype.Falling = function() {
    this.PlayAnim('fall');

    if(!this.states.inUpdraft) {
        this.body.gravity.y = game.physics.arcade.gravity.y * 1.2;
    }

    //if they jump into water, make sure they slow the hell down
    if(this.states.inWater && this.body.velocity.y > 300) {
        this.body.velocity.y = 300;
    }

    if(this.body.onWall()) {
        
        var xLoc = this.body.x;
        xLoc += (this.states.direction === 'right' ? frauki.body.width + 1 : -1);

        var bottomTile = Frogland.map.getTileWorldXY(xLoc, this.body.y, 16, 16, Frogland.GetCurrentCollisionLayer());
        var topTile = Frogland.map.getTileWorldXY(xLoc, this.body.y - 3, 16, 16, Frogland.GetCurrentCollisionLayer());
        var topTile2 = Frogland.map.getTileWorldXY(xLoc, this.body.y - 6, 16, 16, Frogland.GetCurrentCollisionLayer());

        //console.log(topTile, bottomTile);

        if((topTile === null || topTile2 === null) && bottomTile !== null) {
            this.ChangeState(this.Hanging);
            frauki.body.y -= (frauki.body.y % 16) + 5;
        }
    }

    if(this.body.onFloor()) {
        
        if(this.body.velocity.x === 0) {
            if(this.states.crouching)
                this.ChangeState(this.Crouching);
            else
                this.ChangeState(this.Landing);
        }
        else {
            this.ChangeState(this.Running);
        }

        if(!frauki.states.inWater) effectsController.JumpDust(frauki.body.center);

    } else if(this.body.velocity.y < 0) {
        this.ChangeState(this.Jumping);
    }
};

Player.prototype.Landing = function() {
    this.PlayAnim('land');

    if(this.body.velocity.y < 0) {
        this.ChangeState(this.Jumping);
    } else if(this.body.velocity.x !== 0) {
        this.ChangeState(this.Running);
    } else if(this.states.crouching) {
        this.ChangeState(this.Crouching);
    }

    if(this.animations.currentAnim.isFinished) {
        if(this.body.velocity.x === 0) {
            this.ChangeState(this.Standing);
        } else {
            this.ChangeState(this.Running);
        }
    }
};

Player.prototype.Crouching = function() {
    this.PlayAnim('crouch');

    if(!this.states.crouching || this.body.velocity.x !== 0 || this.body.velocity.y !== 0) {
        this.ChangeState(this.Standing);
    }
};

Player.prototype.Flipping = function() {
    this.PlayAnim('flip');

    if(this.animations.currentAnim.isFinished) {
        if(this.body.velocity.y > 0) {
            this.ChangeState(this.Falling);
        } else if(this.body.velocity.y < 0) {
            this.ChangeState(this.Jumping);
        } else if(this.body.velocity.x !== 0 && this.body.onFloor()) {
            this.ChangeState(this.Running);
        } else if(this.body.velocity.x === 0 && this.body.onFloor()) {
            this.ChangeState(this.Landing);
        }
    }
};

Player.prototype.Rolling = function() {
    this.PlayAnim('roll');
    
    this.body.maxVelocity.x = PLAYER_ROLL_SPEED();

    //pickup stage
    if(this.movement.rollStage === 0 && this.movement.rollFrames <= 10) {
        this.body.acceleration.x = this.movement.rollDirection * 4000 * (game.math.catmullRomInterpolation([0, 0.7, 1, 1, 0.7, 0], this.movement.rollFrames / 10) || 0);

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
            this.ChangeState(this.Falling);
        } else if(!inputController.dpad.left && !inputController.dpad.right && this.body.onFloor()) {
            if(this.states.crouching) {
                this.ChangeState(this.Crouching);
                this.PlayAnim('crouch');
                this.animations.currentAnim.setFrame('Crouch0005');
            } else {
                this.ChangeState(this.Standing);
            }

            this.body.velocity.x = 0;

        } else if(this.body.velocity.x !== 0 && this.body.onFloor()) {
            this.ChangeState(this.Running);
        } else {
            this.ChangeState(this.Standing);
        }
    }
};

Player.prototype.Hurting = function() {
    this.PlayAnim('hit');

    this.body.drag.x = 300;

    if(this.timers.TimerUp('frauki_hit') && !Main.restarting) {
        if(this.body.velocity.y > 0) {
            this.ChangeState(this.Falling);
        } else if(this.body.velocity.x === 0) {
            this.ChangeState(this.Standing);
        } else {
            this.ChangeState(this.Running);
        }  

        this.timers.SetTimer('frauki_invincible', 2000);
        this.timers.SetTimer('frauki_grace', 1000);
    }
};

Player.prototype.Materializing = function() {
    this.PlayAnim('materialize');

    if(this.animations.currentAnim.isFinished) {
        this.ChangeState(this.Standing);
    }
};

Player.prototype.Hanging = function() {
    this.PlayAnim('hang');

    this.body.velocity.y = 0;
    this.body.acceleration.y = 0;
    this.body.gravity.y = -600;
    this.states.hasFlipped = false;

    if(!this.body.onWall()) {
        this.ChangeState(this.Falling);
    } 

    if(this.body.onFloor()) {
        this.ChangeState(this.Standing);
    }
};

Player.prototype.Healing = function() {
    this.PlayAnim('heal');

    this.body.velocity.x = 0;
    this.body.acceleration.x = 0;

    //if they are charging their apple, and the timer is up
    if(this.timers.TimerUp('heal_charge')) {

        //send the heal message
        events.publish('energy_heal', {});
        this.ChangeState(this.Standing);
        events.publish('play_sound', {name: 'apple'});
        events.publish('play_sound', {name: 'healing'});

    }
};

Player.prototype.Stunned = function() {
    this.PlayAnim('stun');

    this.body.drag.x = 400;

    if(this.timers.TimerUp('stunned')) {
        this.state = this.Standing;
    }
};

Player.prototype.AttackFront = function() {
    this.PlayAnim('attack_front');

    if(this.Attacking()) {
        this.body.maxVelocity.x = PLAYER_ROLL_SPEED() - 200;
        this.body.acceleration.x *= 3;

        if(this.body.velocity.y > 0) {
            this.body.velocity.y = 0;
        }
    }

    if(this.states.direction === 'right' && this.body.acceleration.x < 0) {
        this.body.velocity.x /= 10;
    } else if(this.states.direction === 'left' && this.body.acceleration.x > 0) {
        this.body.velocity.x /= 10;
    }

    if(this.animations.currentAnim.isFinished) {
        if(inputController.dpad.down && !inputController.dpad.left && !inputController.dpad.right && this.body.onFloor()) {
            this.ChangeState(this.Crouching);
            this.PlayAnim('crouch');
            this.animations.currentAnim.setFrame('Crouch0008');
        } else { 
            this.ChangeState(this.Standing);
        }

        if(inputController.buttons.rShoulder) events.publish('activate_weapon', { activate: true, override: true });
    }
};

Player.prototype.AttackWhiff = function() {
    this.PlayAnim('attack_whiff');

    if(this.animations.currentAnim.isFinished) {
        if(inputController.dpad.down && !inputController.dpad.left && !inputController.dpad.right && this.body.onFloor()) {
            this.ChangeState(this.Crouching);
            this.PlayAnim('crouch');
            this.animations.currentAnim.setFrame('Crouch0008');
        } else { 
            this.ChangeState(this.Standing);
        }

        if(inputController.buttons.rShoulder) events.publish('activate_weapon', { activate: true, override: true });
    }
};

Player.prototype.AttackLunge = function() {
    this.PlayAnim('attack_lunge');

    if(this.Attacking()) {
        this.body.maxVelocity.x = PLAYER_ROLL_SPEED();
        this.body.acceleration.x = this.states.direction === 'left' ? -1000 : 1000;

        if(this.body.velocity.y > 0) {
            this.body.velocity.y = 0;
        }
    } else {
        this.body.velocity.x /= 1.2;
    }

    if(this.animations.currentAnim.isFinished) {
        if(inputController.dpad.down && !inputController.dpad.left && !inputController.dpad.right && this.body.onFloor()) {
            this.ChangeState(this.Crouching);
            this.PlayAnim('crouch');
            this.animations.currentAnim.setFrame('Crouch0008');
        } else { 
            this.ChangeState(this.Standing);
        }

        if(inputController.buttons.rShoulder) events.publish('activate_weapon', { activate: true, override: true });
    }
};

Player.prototype.AttackFall = function() {
    this.PlayAnim('attack_fall');

    this.body.gravity.y = game.physics.arcade.gravity.y * 3;
    this.body.maxVelocity.y = 450;

    if(!this.Attacking() && this.body.onFloor()) {
        this.body.velocity.x = 0;
        this.body.acceleration.x = 0;
    }

    //create dust when they land
    if(!frauki.states.inWater && !this.states.attackFallLanded && this.body.onFloor()) {
        effectsController.JumpDust(frauki.body.center);
        this.states.attackFallLanded = true;
    }

    if(this.animations.currentAnim.isFinished && this.timers.TimerUp('fall_attack_wait')) {
        if(this.body.onFloor()) {
        
            if(this.body.velocity.x === 0) {
                if(this.states.crouching)
                    this.ChangeState(this.Crouching);
                else
                    this.ChangeState(this.Standing);
            }
            else {
                this.ChangeState(this.Running);
            }

        } else if(this.body.velocity.y < 0) {
            this.ChangeState(this.Jumping);
        } else {
            this.ChangeState(this.Falling);
        }

        this.states.attackFallLanded = false;

        if(inputController.buttons.rShoulder) events.publish('activate_weapon', { activate: true, override: true });
    }
};

Player.prototype.AttackOverhead = function() {
    this.PlayAnim('attack_overhead');

    if(this.body.onFloor()) {
        this.body.velocity.x /= 2;
    }
    
    if(this.animations.currentAnim.isFinished) {
        this.ChangeState(this.Standing);

        if(inputController.buttons.rShoulder) events.publish('activate_weapon', { activate: true, override: true });
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
            this.ChangeState(this.Falling);
        } else if((inputController.dpad.left || inputController.dpad.right) && this.body.onFloor()) {
            this.ChangeState(this.Running);
        } else {
            this.ChangeState(this.Standing);
        }

        if(inputController.buttons.rShoulder) events.publish('activate_weapon', { activate: true, override: true });
    }
};

Player.prototype.AttackDiveCharge = function() {
    this.PlayAnim('attack_dive_charge');
    this.body.velocity.y = 0;
    
    this.body.maxVelocity.x = 1;

    if(this.animations.currentAnim.isFinished) {
        this.ChangeState(this.AttackDiveFall);
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
        this.ChangeState(this.Jumping);
        events.publish('stop_sound', {name: 'attack_dive_fall'});
        this.movement.diveVelocity = 0;

    } else if(this.body.onFloor()) {
        this.movement.diveVelocity = 0;

        events.publish('camera_shake', {magnitudeX: 6, magnitudeY: 2, duration: 400});

        events.publish('stop_sound', {name: 'attack_dive_fall'});
        events.publish('play_sound', {name: 'attack_dive_land'});

        this.ChangeState(this.AttackDiveLand);

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
                this.ChangeState(this.Crouching);
            else
                this.ChangeState(this.Standing);
        }
        else {
            this.ChangeState(this.Running);
        }

        if(inputController.buttons.rShoulder) events.publish('activate_weapon', { activate: true, override: true });
    }
};

Player.prototype.AttackJump = function() {
    this.PlayAnim('attack_jump');

    if(this.animations.currentAnim.isFinished) {
        this.ChangeState(this.Jumping);
        if(inputController.buttons.rShoulder) events.publish('activate_weapon', { activate: true, override: true });
    }
};
