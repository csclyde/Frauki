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

    this.body.maxVelocity.y = 500;

    this.robotic = true;
    this.clingDir = 'none';


    this.timers.SetTimer('attack_wait', 0)

    this.updateFunction = function() {
        if(this.state === this.Hurting)
            return;

        if(this.state === this.Hopping && !this.body.onFloor()) {
            this.body.drag.x = 50;
        } else {
            this.body.drag.x = 600;
        }

    };

    this.Act = function() {

        if(EnemyBehavior.Player.IsVisible(this)) {
            
            //if theyre stunned, seize the opportunity
            if(EnemyBehavior.Player.IsStunned(this)) {
                this.Hop();

            } else if(this.body.onFloor() || this.clingDir === 'up' || this.clingDir === 'left' || this.clingDir === 'right') {

                if(EnemyBehavior.Player.IsNear(this, 50) && this.timers.TimerUp('attack_wait') && this.clingDir === 'none') {
                    this.Bite();

                } else if(EnemyBehavior.Player.IsNear(this, 250) && this.body.onFloor()) {
                    this.Escape();

                } else if(this.timers.TimerUp('attack_wait')) {
                    this.Hop();


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

    this.CanCauseDamage = function() {
        if(this.state === this.Scuttling || this.state === this.Diving) {
            return true;
        } else {
            return false;
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

        this.timers.SetTimer('escape', 300);

    };

    ////////////////////////////////STATES////////////////////////////////////
    this.Idling = function() {
        this.PlayAnim('idle');

        if(this.clingDir === 'up') {
            this.angle = 180;
        } else if(this.clingDir === 'left') {
            this.angle = -90;
            this.scale.x = 1;
        } else if(this.clingDir === 'right') {
            this.angle = 90;
            this.scale.x = 1;
        } else {
            this.angle = 0;
        }

        return true;
    };

    this.PreEscaping = function() {
        this.PlayAnim('pre_jump');

        if(this.timers.TimerUp('escape')) {
            this.timers.SetTimer('escape', game.rnd.between(1200, 2400));

            this.body.velocity.x = game.rnd.between(-600, 600);
            this.body.velocity.y = game.rnd.between(-600, -400);

            this.state = this.Escaping;
        }

        return false;
    }

    this.Escaping = function() {
        if(this.body.gravity.y === 0) {
            this.PlayAnim('jump');
        } else {
            this.PlayAnim('flip_up');
        }

        if(this.body.onFloor()) {
            return true;
        }

        if(this.body.onWall()) {
            this.body.gravity.y = -700;
            this.body.velocity.setTo(0);

            var targetAngle = 0;

            if(this.body.blocked.left) {
                this.clingDir = 'left';
                targetAngle = -90;
                this.scale.x = 1;
            } else if(this.body.blocked.right) {
                this.clingDir = 'right';
                targetAngle = 90;
                this.scale.x = 1;
            }

            game.add.tween(this).to({ angle: targetAngle }, 75, Phaser.Easing.Linear.None, true);
        
        } else if(this.body.blocked.up) {
            this.clingDir = 'up';

            this.body.gravity.y = -700;
            this.body.velocity.setTo(0);

        }

        if(this.timers.TimerUp('escape')) {
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
            this.timers.SetTimer('attack_wait', 1000);

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
            damage: 1,
            knockback: 0,
            priority: 1,
            juggle: 0
        }

    };

};
