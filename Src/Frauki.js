PLAYER_SPEED = 225;
PLAYER_ROLL_SPEED = 500;
PLAYER_INERTIA = 50;

Player = function (game, x, y, name) {

    Phaser.Sprite.call(this, game, x, y, name);
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.anchor.setTo(.5, 1);

    //this.body.bounce.y = 0.2;
    this.body.collideWorldBounds = true;
    this.body.setSize(11, 50, 0, 0);
    this.body.maxVelocity.y = 500;

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

    this.state = this.Standing;
    this.direction = 'right';

    this.isCrouching = false;
    this.isSprinting = false;
    this.hasFlipped = false;

    this.rollTween = null;
    this.stopJumpTween = null;
    this.jumpTimer = 0;
    this.hitTimer = 0;
    this.gracePeriod = 0;

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
    console.log('test');
}

Player.prototype.update = function() {

    this.state();

    //reset the double jump flag
    if(this.body.onFloor()) {
        this.hasFlipped = false;
    }

    if(this.state === this.Rolling) {
        this.body.velocity.x = this.movement.rollVelocity;
    }

    if(this.state === this.Crouching) {
        this.body.setSize(11, 30, 0, 0);
    } else {
        this.body.setSize(11, 50, 0, 0);
    }

    if(this.body.onFloor()) {
        this.movement.rollBoost = 0;
    }
};

Player.prototype.SetDirection = function(dir) {
    if(this.state === this.Rolling)
        return;

    if(dir === 'left' && this.direction !== 'left') {
        this.direction = 'left';
        this.scale.x = -1;
    }
    else if(dir === 'right' && this.direction !== 'right') {
        this.direction = 'right';
        this.scale.x = 1;
    }
};

Player.prototype.PlayAnim = function(name) {
    if(this.animations.currentAnim.name !== name)
        this.animations.play(name);
};

Player.prototype.Grace = function() {
    return (this.game.time.now < this.gracePeriod);
}

////////////////CALLBACKS//////////////////
Player.prototype.Run = function(params) {
    if(this.state === this.Hurting || this.state === this.Rolling) {
        return;
    }

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
        if(params.dir === 'left') {
            this.movement.inertia = 100;//PLAYER_INERTIA;
            game.add.tween(this.movement).to({inertia: 0}, 120, Phaser.Easing.Linear.None, true);
        } else {
            this.movement.inertia = 100;//PLAYER_INERTIA;
            game.add.tween(this.movement).to({inertia: 0}, 120, Phaser.Easing.Linear.None, true);
        }
    } else {
        if(params.dir === 'left') {
            this.movement.inertia = this.body.velocity.x;
            game.add.tween(this.movement).to({inertia: 0}, 120, Phaser.Easing.Linear.None, true);
        } else {
            this.movement.inertia = this.body.velocity.x;
            game.add.tween(this.movement).to({inertia: 0}, 120, Phaser.Easing.Linear.None, true);
        }
    }
};

Player.prototype.Jump = function(params) {
    if(this.state === this.Hurting) {
        return;
    }

    if(params.jump) {
        //normal jump
        if(this.body.onFloor() || this.state === this.Standing || this.state === this.Running || this.state === this.Landing) {
            this.body.velocity.y = -500;
        }
        //double jump
        else if(this.hasFlipped === false && this.state !== this.Falling && this.state !== this.Rolling) {
            if(this.stopJumpTween) {
                this.stopJumpTween.stop();
            }

            this.body.velocity.y = -350;
            this.state = this.Flipping;
            this.hasFlipped = true;
            this.gracePeriod = game.time.now + 300;
        }
    } else if(this.body.velocity.y < 0 && this.state !== this.Flipping) {
        if(this.body.velocity.y < 0)
            this.stopJumpTween = game.add.tween(this.body.velocity).to({y: 0}, 100, Phaser.Easing.Exponential.In, true);
    }
};

Player.prototype.Crouch = function(params) {
    this.isCrouching = params.crouch;
};

Player.prototype.Slash = function(params) {
};

Player.prototype.Roll = function(params) {
    if(!this.body.onFloor() || this.game.time.now < this.rollTimer)
        return;

    this.state = this.Rolling;

    if(this.direction === 'left') {
        this.movement.rollVelocity = -PLAYER_ROLL_SPEED;
        this.rollTween = game.add.tween(this.movement).to({rollVelocity: -PLAYER_SPEED}, 300, Phaser.Easing.Quartic.In, true);
    }
    else {
        this.movement.rollVelocity = PLAYER_ROLL_SPEED;
        this.rollTween = game.add.tween(this.movement).to({rollVelocity: PLAYER_SPEED}, 300, Phaser.Easing.Quartic.In, true);
    }

    this.rollTimer = game.time.now + 650;
    this.gracePeriod = game.time.now + 300;
};

Player.prototype.Hit = function(f, e) {
    if(this.state !== this.Hurting) {
        this.body.velocity.y = -300;

        if(f.body.x < e.body.x)
            this.body.velocity.x = -200;
        else
            this.body.velocity.x = 200;

        this.state = this.Hurting;
        this.gracePeriod = game.time.now + 1000;
        this.hitTimer = game.time.now + 500;
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
    } else if(this.isCrouching) {
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

    if(this.animations.currentAnim.isFinished) {
        this.state = this.Falling;
    }
};

Player.prototype.Falling = function() {
    this.PlayAnim('fall');
    
    if(this.body.onFloor()) {
        this.movement.rollBoost = 0;

        if(this.body.velocity.x === 0) {
            if(this.isCrouching)
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

    if(!this.isCrouching || this.body.velocity.x !== 0 || this.body.velocity.y !== 0) {
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

    if(this.body.velocity.y > 150) {
        this.state = this.Falling;
    } else if(this.body.velocity.y < 0) {
        this.state = this.Jumping;

        //roll boost is caluclated based on how close they were to the max roll speed
        this.movement.rollBoost = Math.abs(this.movement.rollVelocity) - PLAYER_SPEED; 
        this.movement.rollBoost /= (PLAYER_ROLL_SPEED - PLAYER_SPEED);
        this.movement.rollBoost *= 75;

        this.movement.rollVelocity = 0;
    }

    if(this.animations.currentAnim.isFinished) {
        if(this.body.velocity.x !== 0 && this.body.onFloor()) {
            this.state = this.Running;
        } else if(this.body.velocity.x === 0 && this.body.onFloor()) {
            this.state = this.Standing;
        }
    }
};

Player.prototype.Hurting = function() {
    this.PlayAnim('hit');

    if(game.time.now > this.hitTimer) {
        if(this.body.velocity.x === 0) {
            this.state = this.Standing;
        } else {
            this.state = this.Running;
        }  
    }
};