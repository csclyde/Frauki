PLAYER_SPEED = 225;
PLAYER_ROLL_SPEED = 500;
PLAYER_RUN_SLASH_SPEED = 300;
PLAYER_INERTIA = 100;

Player = function (game, x, y, name) {

    Phaser.Sprite.call(this, game, x, y, name);
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.anchor.setTo(.5, 1);

    //this.body.bounce.y = 0.2;
    this.body.collideWorldBounds = true;
    this.body.setSize(11, 50, 0, 0);
    this.body.maxVelocity.y = 500;

    //movements
    this.animations.add('stand', ['Stand0000'], 10, true, false);
    this.animations.add('run', ['Run0000', 'Run0001', 'Run0002', 'Run0003', 'Run0004', 'Run0005', 'Run0006', 'Run0007'], 10, true, false);
    this.animations.add('jump', ['Standing Jump0001'], 10, true, false);
    this.animations.add('peak', ['Standing Jump0002', 'Standing Jump0003', 'Standing Jump0004'], 10, false, false);
    this.animations.add('fall', ['Standing Jump0005'], 10, true, false);
    this.animations.add('land', ['Standing Jump0006', 'Standing Jump0007', 'Standing Jump0008'], 10, false, false);
    this.animations.add('crouch', ['Crouch0001'], 10, true, false);
    this.animations.add('flip', ['Flip0000', 'Flip0001', 'Flip0002', 'Flip0003', 'Flip0004'], 14, false, false);
    this.animations.add('roll', ['Flip0000', 'Flip0001', 'Flip0002', 'Flip0003', 'Flip0004'], 14, false, false);
    this.animations.add('hit', ['Hit0001', 'Hit0002'], 10, true, false);

    //attacks
    this.animations.add('slash_stand1', ['Slash Standing0001', 'Slash Standing0002', 'Slash Standing0003', 'Slash Standing0004', 'Slash Standing0005'], 12, false, false);
    this.animations.add('slash_stand2', ['Slash Standing0006', 'Slash Standing0007', 'Slash Standing0008', 'Slash Standing0009', 'Slash Standing0010'], 12, false, false);
    this.animations.add('slash_stand3', ['Slash Standing0011', 'Slash Standing0012', 'Slash Standing0013', 'Slash Standing0014', 'Slash Standing0015', 'Slash Standing0016', 'Slash Standing0017'], 12, false, false);
    this.animations.add('slash_run', ['Slash Standing0013', 'Slash Standing0014', 'Slash Standing0015', 'Slash Standing0016'], 12, false, false);

    this.state = this.Standing;
    
    this.tweens = {};
    this.tweens.roll = null;
    this.tweens.stopJump = null;

    this.states = {};
    this.states.direction = 'right';
    this.states.crouching = false;
    this.states.hasFlipped = false;
    this.states.gracePeriod = 0;
    this.states.slashAgain = false;
    this.states.nextSlash = 'slash_stand1';

    this.timers = {};
    this.timers.hitTimer = 0;
    this.timers.runSlashTimer = 0;

    this.movement = {};
    this.movement.rollVelocity = 0;
    this.movement.rollBoost = 0;
    this.movement.inertia = 0;

    events.subscribe('player_jump', this.Jump, this);
    events.subscribe('player_crouch', this.Crouch, this);
    events.subscribe('player_slash', this.Slash, this);
    events.subscribe('player_roll', this.Roll, this);
    events.subscribe('player_run', this.StartStopRun, this);

};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.create = function() {
}

Player.prototype.update = function() {

    this.state();

    //reset the double jump flag
    if(this.body.onFloor()) {
        this.states.hasFlipped = false;
        this.movement.rollBoost = 0;
    }

    if(this.state === this.Crouching) {
        this.body.setSize(11, 30, 0, 0);
    } else {
        this.body.setSize(11, 50, 0, 0);
    }

    this.AdjustFrame(this.animations.currentFrame.name);
};

Player.prototype.SetDirection = function(dir) {
    if(this.states.direction !== dir) {
        this.states.direction = dir;

        dir === 'left' ? this.scale.x = -1 : this.scale.x = 1;
    }
};

Player.prototype.PlayAnim = function(name) {
    if(this.animations.currentAnim.name !== name)
        this.animations.play(name);
};

Player.prototype.Grace = function() {
    return (this.game.time.now < this.states.gracePeriod);
};

Player.prototype.AdjustFrame = function(frameName) {
    //check for a frame mod and apply its mods
    var frameMod = fraukiDamageFrames[frameName];
    if(!!frameMod) {
        if(!!frameMod.xOffset) {
            this.states.direction === 'left' ? this.x -= frameMod.xOffset : this.x += frameMod.xOffset;;
        }
    }
};

////////////////CALLBACKS//////////////////
Player.prototype.Run = function(params) {
    if(this.state === this.Hurting || this.state === this.Rolling || this.state === this.SlashStanding || this.state === this.SlashRunning) 
        return;

    if(params.dir === 'left') {
        this.body.velocity.x = -PLAYER_SPEED - this.movement.rollBoost + this.movement.inertia;
        this.SetDirection('left');
    } else if(params.dir === 'right') {
        this.body.velocity.x = PLAYER_SPEED + this.movement.rollBoost + this.movement.inertia;
        this.SetDirection('right');
    } else {
        this.body.velocity.x = 0 + this.movement.inertia;
        this.movement.rollBoost = 0;
    }
};

Player.prototype.StartStopRun = function(params) {
    if(params.run) {
        params.dir === 'left' ? this.movement.inertia = PLAYER_INERTIA : this.movement.inertia = -PLAYER_INERTIA;
        game.add.tween(this.movement).to({inertia: 0}, 120, Phaser.Easing.Linear.None, true);
    } else {
        this.movement.inertia = this.body.velocity.x;
        game.add.tween(this.movement).to({inertia: 0}, 120, Phaser.Easing.Linear.None, true);
    }
};

Player.prototype.Jump = function(params) {
    if(this.state === this.Hurting) 
        return;

    if(params.jump) {
        //normal jump
        if(this.body.onFloor() || this.state === this.Standing || this.state === this.Running || this.state === this.Landing) {
            this.body.velocity.y = -400;
        }
        //double jump
        else if(this.states.hasFlipped === false && this.state !== this.Falling && this.state !== this.Rolling && this.state !== this.SlashRunning) {
            if(this.tweens.stopJump) { this.tweens.stopJump.stop(); }

            this.body.velocity.y = -350;
            this.state = this.Flipping;
            this.states.hasFlipped = true;
            this.states.gracePeriod = game.time.now + 300;
        }
    } else if(this.body.velocity.y < 0 && this.state !== this.Flipping) {
        if(this.body.velocity.y < 0)
            this.tweens.stopJump = game.add.tween(this.body.velocity).to({y: 0}, 100, Phaser.Easing.Exponential.In, true);
    }
};

Player.prototype.Crouch = function(params) {
    this.states.crouching = params.crouch;
};

Player.prototype.Slash = function(params) {
    if(this.state === this.SlashStanding) {
        this.states.slashAgain = true;
    }

    if(this.state === this.Standing || this.state === this.Landing) {
        this.state = this.SlashStanding;
    }
    else if(this.state === this.Running) {
        this.state = this.SlashRunning;
        this.timers.runSlashTimer = game.time.now + 200;

        if(this.states.direction === 'left') {
            this.movement.rollVelocity = -PLAYER_RUN_SLASH_SPEED;
            this.tweens.roll = game.add.tween(this.movement).to({rollVelocity: -PLAYER_SPEED}, 300, Phaser.Easing.Quartic.In, true);
        }
        else {
            this.movement.rollVelocity = PLAYER_RUN_SLASH_SPEED;
            this.tweens.roll = game.add.tween(this.movement).to({rollVelocity: PLAYER_SPEED}, 300, Phaser.Easing.Quartic.In, true);
        }
    }
};

Player.prototype.Roll = function(params) {
    if(!this.body.onFloor() || this.game.time.now < this.rollTimer)
        return;

    this.state = this.Rolling;

    if(this.states.direction === 'left') {
        this.movement.rollVelocity = -PLAYER_ROLL_SPEED;
        this.tweens.roll = game.add.tween(this.movement).to({rollVelocity: -PLAYER_SPEED}, 300, Phaser.Easing.Quartic.In, true);
    }
    else {
        this.movement.rollVelocity = PLAYER_ROLL_SPEED;
        this.tweens.roll = game.add.tween(this.movement).to({rollVelocity: PLAYER_SPEED}, 300, Phaser.Easing.Quartic.In, true);
    }

    this.rollTimer = game.time.now + 650;
    this.states.gracePeriod = game.time.now + 300;
};

Player.prototype.Hit = function(f, e) {
    if(this.state === this.Hurting)
        return;

    this.body.velocity.y = -300;

    f.body.x < e.body.x ? this.body.velocity.x = -200 : this.body.velocity.x = 200;

    this.state = this.Hurting;
    this.states.gracePeriod = game.time.now + 1000;
    this.timers.hitTimer = game.time.now + 500;
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

    if(this.body.velocity.x === 0 && this.body.onFloor()) {
        this.state = this.Standing;
    } else if(this.body.velocity.y < 0) {
        this.state = this.Jumping;
    } else if(this.body.velocity.y > 150) {
        this.state = this.Falling;
    }
};

Player.prototype.Jumping = function() {
    this.PlayAnim('jump');

    if(this.body.velocity.y > -50) {
        this.state = this.Peaking;
    }

};

Player.prototype.Peaking = function() {
    this.PlayAnim('peak');

    if(this.body.velocity.y < -100) {
        this.state = this.Jumping;
    } else if(this.body.onFloor()) {
        this.state === this.Landing;
    }

    if(this.animations.currentAnim.isFinished) {
        this.state = this.Falling;
    }
};

Player.prototype.Falling = function() {
    this.PlayAnim('fall');
    
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
    this.body.velocity.x = this.movement.rollVelocity;
    
    if(this.body.velocity.y < 0) {
        this.state = this.Jumping;

        //roll boost is caluclated based on how close they were to the max roll speed
        this.movement.rollBoost = Math.abs(this.movement.rollVelocity) - PLAYER_SPEED; 
        this.movement.rollBoost /= (PLAYER_ROLL_SPEED - PLAYER_SPEED);
        this.movement.rollBoost *= 75;

        this.movement.rollVelocity = 0;
    }

    if(this.animations.currentAnim.isFinished) {
        if(this.body.velocity.y > 150) {
            this.state = this.Falling;
        } else if(this.body.velocity.x !== 0 && this.body.onFloor()) {
            this.state = this.Running;
        } else if(this.body.velocity.x === 0 && this.body.onFloor()) {
            this.state = this.Standing;
        }
    }
};

Player.prototype.Hurting = function() {
    this.PlayAnim('hit');

    if(game.time.now > this.timers.hitTimer) {
        if(this.body.velocity.x === 0) {
            this.state = this.Standing;
        } else {
            this.state = this.Running;
        }  
    }
};

Player.prototype.SlashStanding = function() {
    this.PlayAnim(this.states.nextSlash);
    this.body.velocity.x = 0;

    if(this.animations.currentAnim.isFinished) {
        if(this.states.slashAgain === true) {
            if(this.animations.currentAnim.name === 'slash_stand1') {
                this.states.nextSlash = 'slash_stand2';
            }
            else if(this.animations.currentAnim.name === 'slash_stand2') {
                this.states.nextSlash = 'slash_stand3';
            }

            this.states.slashAgain = false;
        }
        else {
            this.state = this.Standing;
            this.states.nextSlash = 'slash_stand1';
        }
    }
}

Player.prototype.SlashRunning = function() {
    this.PlayAnim('slash_run');
    this.body.velocity.x = this.movement.rollVelocity;

    if(this.animations.currentAnim.isFinished) {
        if(this.body.velocity.y > 150) {
            this.state = this.Falling;
        } else if(this.body.velocity.x !== 0 && this.body.onFloor()) {
            this.state = this.Running;
        } else if(this.body.velocity.x === 0 && this.body.onFloor()) {
            this.state = this.Standing;
        }
    }
};
