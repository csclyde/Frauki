PLAYER_SPEED = 225;

Player = function (game, x, y, name) {

    Phaser.Sprite.call(this, game, x, y, name);
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.anchor.setTo(.5, 1);

    //this.body.bounce.y = 0.2;
    this.body.collideWorldBounds = true;
    this.body.setSize(11, 50, 0, 0);

    this.animations.add('stand', ['Stand0000'], 10, true, false);
    this.animations.add('run', ['Run0000', 'Run0001', 'Run0002', 'Run0003', 'Run0004', 'Run0005', 'Run0006', 'Run0007'], 10, true, false);
    this.animations.add('jump', ['Standing Jump0001'], 10, true, false);
    this.animations.add('peak', ['Standing Jump0002', 'Standing Jump0003', 'Standing Jump0004'], 10, false, false);
    this.animations.add('fall', ['Standing Jump0005'], 10, true, false);
    this.animations.add('land', ['Standing Jump0006', 'Standing Jump0007', 'Standing Jump0008'], 10, false, false);
    this.animations.add('crouch', ['Crouch0001'], 10, true, false);
    this.animations.add('flip', ['Flip0000', 'Flip0001', 'Flip0002', 'Flip0003', 'Flip0004'], 14, false, false);
    this.animations.add('roll', ['Flip0000', 'Flip0001', 'Flip0002', 'Flip0003', 'Flip0004'], 14, false, false);

    this.state = this.Standing;
    this.direction = 'right';
    this.isCrouching = false;
    this.isSprinting = false;
    this.hasFlipped = false;
    this.canWallJump = false;
    this.wallJumpTimer = new Phaser.Timer(game, false);
    this.rollVelMod = 0;
    this.rollTween = null;
    this.jumpTimer = 0;

    events.subscribe('player_jump', this.Jump, this);
    events.subscribe('player_crouch', this.Crouch, this);
    events.subscribe('player_sprint', this.Sprint, this);
    events.subscribe('player_roll', this.Roll, this);

};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.create = function() {

}

Player.prototype.update = function() {

    this.state();

    if(this.body.onFloor()) {
        this.hasFlipped = false;
    }

    if(this.body.onWall() && !this.body.onFloor() && this.state === this.Jumping) {
        this.canWallJump = true;
        this.wallJumpTimer.stop(true);

        this.wallJumpTimer.add(500, function() {
            this.canWallJump = false;
        }, this);

        this.wallJumpTimer.start();
    }

    if(this.direction === 'left') {
        if(this.rollVelMod + this.body.velocity.x < 0)
            this.body.velocity.x += this.rollVelMod;
    } else {
        if(this.rollVelMod + this.body.velocity.x > 0)
            this.body.velocity.x += this.rollVelMod;
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

////////////////CALLBACKS//////////////////

Player.prototype.Jump = function(params) {
    if(params.jump) {
        if(this.body.onFloor() || this.state === this.Standing || this.state === this.Running) {
            this.body.velocity.y = -500;
        }
        else if(this.canWallJump && false) {
            this.body.velocity.y = -400;
            this.body.velocity.x = -this.body.velocity.x;
        }
        else if(this.hasFlipped === false && this.state !== this.Falling) {
            this.body.velocity.y = -350;
            this.state = this.Flipping;
            this.hasFlipped = true;
        }
    } else if(this.body.velocity.y < 0 && this.state !== this.Flipping) {
        //this.player.body.y = 0;
    }
}

Player.prototype.Crouch = function(params) {
    this.isCrouching = params.crouch;
}

Player.prototype.Sprint = function(params) {
    this.isSprinting = params.sprint;
}

Player.prototype.Roll = function(params) {
    if(!this.body.onFloor() || this.game.time.now < this.rollTimer)
        return;

    this.state = this.Rolling;

    if(this.direction === 'left') {
        this.rollVelMod = -300;
        this.rollTween = game.add.tween(this).to({rollVelMod: -300}, 100, Phaser.Easing.Quartic.In, true).
                                              to({rollVelMod:  80},  300, Phaser.Easing.Quartic.In, true).
                                              to({rollVelMod:  0},   500, Phaser.Easing.Quartic.In, true);
    }
    else {
        this.rollVelMod = 300;
        this.rollTween = game.add.tween(this).to({rollVelMod:  300}, 100, Phaser.Easing.Quartic.In, true).
                                              to({rollVelMod: -80},  300, Phaser.Easing.Quartic.In, true).
                                              to({rollVelMod:  0},   500, Phaser.Easing.Quartic.In, true);
    }

    this.rollTimer = game.time.now + 650;
}

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
}

Player.prototype.Falling = function() {
    this.PlayAnim('fall');
    
    if(this.body.onFloor()) {
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

}

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
}

Player.prototype.Rolling = function() {
    this.PlayAnim('roll');

    if(this.body.velocity.y > 150) {
        this.state = this.Falling;
    } else if(this.body.velocity.y < 0) {
        this.state = this.Jumping;
    }

    if(this.animations.currentAnim.isFinished) {
        if(this.body.velocity.x !== 0 && this.body.onFloor()) {
            this.state = this.Running;
        } else if(this.body.velocity.x === 0 && this.body.onFloor()) {
            this.state = this.Standing;
        }
    }
}