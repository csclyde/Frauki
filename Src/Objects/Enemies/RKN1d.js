Enemy.prototype.types['RKN1d'] =  function() {

    this.body.setSize(40, 45, 0, 0);
    this.anchor.setTo(0.5, 0.5);

    this.animations.add('idle', ['RKN1d/Idle0000', 'RKN1d/Idle0001', 'RKN1d/Idle0002', 'RKN1d/Idle0003'], 10, true, false);
    this.animations.add('pre_jump', ['RKN1d/Jump0000', 'RKN1d/Jump0001', 'RKN1d/Jump0002'], 16, false, false);
    this.animations.add('jump', ['RKN1d/Jump0003', 'RKN1d/Jump0004', 'RKN1d/Jump0005'], 12, false, false);
    this.animations.add('attack', ['RKN1d/Bite0001', 'RKN1d/Bite0002', 'RKN1d/Bite0003', 'RKN1d/Bite0004', 'RKN1d/Bite0005'], 16, false, false);
    this.animations.add('flip_up', ['RKN1d/FlipUp0001', 'RKN1d/FlipUp0002', 'RKN1d/FlipUp0003', 'RKN1d/FlipUp0004'], 28, false, false);

    this.damage = 1;
    this.energy = 2;

    //this.body.maxVelocity.y = 500;

    this.robotic = true;
    this.clingDir = 'none';


    this.SetAttackTimer(0);

    this.updateFunction = function() {
        if(this.clingDir === 'none') {
            this.body.moves = true;
        }
        else {
            this.body.moves = false;
        }

        // if(this.clingDir === 'up') {
        //     this.angle = 180;
        // } else if(this.clingDir === 'left') {
        //     this.angle = -90;
        //     this.scale.x = 1;
        // } else if(this.clingDir === 'right') {
        //     this.angle = 90;
        //     this.scale.x = 1;
        // } else {
        //     this.angle = 0;
        // }
    };

    this.Act = function() {

        if(EnemyBehavior.Player.IsVisible(this)) {
            
            //if the player is too close or being dangerous
            if(EnemyBehavior.Player.IsDangerous(this) || (EnemyBehavior.Player.IsNear(this, 250) && EnemyBehavior.Player.MovingTowards(this))) {
                if(this.timers.TimerUp('escape_wait')) {
                    this.Escape();
                } else {
                    this.state = this.Idling;
                }
            
            } else {
                this.state = this.Idling;
            }

        } else {
            this.state = this.Idling;
        }
    };

    this.LandHit = function() {
    };

    this.OnHit = function() {
        this.DropOff();
    }

    this.DropOff = function() {
        this.body.gravity.y = 0;
        this.clingDir = 'none';
        this.angle = 0;
    }

    this.IsGrounded = function() {
        return (this.body.onFloor() || this.clingDir === 'up' || this.clingDir === 'left' || this.clingDir === 'right');
    }

    this.Vulnerable = function() {
        return false; //this.state !== this.Escaping;
    }

    ///////////////////////////////ACTIONS////////////////////////////////////
    this.Hop = function() {

        EnemyBehavior.FacePlayer(this);

        this.timers.SetTimer('attack', 300);
        this.state = this.PreHopping;

    };

    this.Bite = function() {
        EnemyBehavior.FacePlayer(this);

        this.state = this.Biting;
    };

    this.Escape = function() {
        this.state = this.PreEscaping;
        this.clingDir = 'none';

        this.timers.SetTimer('escape', 100);

    };

    ////////////////////////////////STATES////////////////////////////////////
    this.Idling = function() {
        this.PlayAnim('idle');

        

        return true;
    };

    this.PreEscaping = function() {
        this.PlayAnim('pre_jump');

        if(this.timers.TimerUp('escape')) {
            this.timers.SetTimer('escape', game.rnd.between(1200, 2400));

            if(this.body.onFloor()) {
                this.body.velocity.x = game.rnd.between(-600, 600);
                this.body.velocity.y = game.rnd.between(-600, -400);
            }
            else if(this.clingDir === 'left') {
                this.body.velocity.x = game.rnd.between(400, 600);
                this.body.velocity.y = game.rnd.between(600, -600);
            }
            else if(this.clingDir === 'right') {
                this.body.velocity.x = game.rnd.between(-400, -600);
                this.body.velocity.y = game.rnd.between(600, -600);
            }
            else if(this.clingDir === 'up') {
                this.body.velocity.x = game.rnd.between(-600, 600);
                this.body.velocity.y = game.rnd.between(400, 600);
            }

            this.body.velocity.setMagnitude(600);

            this.state = this.Escaping;
        }

        return false;
    }

    this.Escaping = function() {
        this.PlayAnim('jump');

        
        if(this.body.onFloor()) {
            this.clingDir = 'none';
        }
        else if(this.body.blocked.up) {
            this.clingDir = 'up';
        }
        else if(this.body.blocked.left) {
            this.clingDir = 'left';
        }
        else if(this.body.blocked.right) {
            this.clingDir = 'right';
        }
        else {
            this.clingDir = 'none';
        }

        // if(this.body.onWall()) {
        //     this.body.gravity.y = -700;
        //     this.body.velocity.setTo(0);

        //     var targetAngle = 0;

        //     if(this.body.blocked.left) {
        //         targetAngle = -90;
        //         this.scale.x = 1;
        //     } else if(this.body.blocked.right) {
        //         targetAngle = 90;
        //         this.scale.x = 1;
        //     }

        //     game.add.tween(this).to({ angle: targetAngle }, 75, Phaser.Easing.Linear.None, true);
        
        // } else if(this.body.blocked.up) {

        //     this.body.gravity.y = -700;
        //     this.body.velocity.setTo(0);

        // }

        if(this.timers.TimerUp('escape') || this.body.onFloor() || this.clingDir !== 'none') {
            this.timers.SetTimer('escape_wait', 800);
            return true;
        } else {
            return false;
        }
    }

    this.PreHopping = function() {
        this.PlayAnim('pre_jump');

        if(this.clingDir === 'up') {
            this.angle = 180;
        } else if(this.clingDir === 'left') {
            this.angle = 90;
            this.scale.x = 1;
        } else if(this.clingDir === 'right') {
            this.angle = -90;
            this.scale.x = 1;
        } else {
            this.angle = 0;
        }

        if(this.timers.TimerUp('attack')) {
            this.DropOff();
            this.state = this.Hopping;

            EnemyBehavior.FacePlayer(this);
            EnemyBehavior.JumpToPoint(this, frauki.body.center.x, frauki.body.y - 50); 
            
            this.body.velocity.x += frauki.body.velocity.x;

            // if(this.body.velocity.y < -400) {
            //     this.body.velocity.y = -400;
            // }

        }

        return false;
    };

    this.Hopping = function() {
        if(this.body.onFloor()) {
            this.PlayAnim('idle');
        } else {
            this.PlayAnim('jump');
        }

        if(this.body.onFloor()) {
            return true;
        }

        return false;
    };

    this.Biting = function() {
        this.PlayAnim('attack');

        if(this.animations.currentAnim.isFinished) {
            this.SetAttackTimer(1000);

            return true;
        }

        return false;
    };

    this.Hurting = function() {
        this.PlayAnim('die');

        if(this.timers.TimerUp('hit')) {
            return true;
        }

        return false;
    };

    this.attackFrames = {

        'RKN1d/Bite0003': {
            x: 20, y: 20, w: 55, h: 35,
            damage: 2,
            knockback: 0,
            priority: 1,
            juggle: 0
        }

    };

};
