Enemy.prototype.types['R2BTU'] =  function() {

    this.body.setSize(35, 75, 0, 0);
    this.anchor.setTo(0.5, 0.5);

    this.animations.add('idle', ['R2BTU/Stand0000'], 10, true, false);
    this.animations.add('float', ['R2BTU/Float0000'], 6, true, false);
    this.animations.add('attack', ['R2BTU/Attack0000', 'R2BTU/Attack0001'], 18, true, false);

    this.energy = 5;
    this.baseStunDuration = 500;

    this.robotic = true;
    
    this.updateFunction = function() {

    };

    this.Act = function() {

        if(EnemyBehavior.Player.IsVisible(this)) {
            if(this.hasHit) {
                this.Dodge();
                this.hasHit = false;
            }
            else if(EnemyBehavior.Player.IsDangerous(this)) {
                this.Dodge();

            } else if(EnemyBehavior.Player.IsNear(this, 100)) {
                EnemyBehavior.FacePlayer(this);
                this.Attack();
            
            } else {
                this.state = this.Idling;
            }
        } else {
            this.state = this.Idling;
            this.body.velocity.x = 0;
        }
    };

    ///////////////////////////////ACTIONS////////////////////////////////////
    this.Attack = function() {
        if(!this.timers.TimerUp('attack')) {
            return;
        }

        this.timers.SetTimer('slash_hold', 700);
        this.state = this.Windup;

    };

    this.Dodge = function(duration, override) {
        if(!this.timers.TimerUp('dodge') && !override) {
            return false;
        }

        EnemyBehavior.FacePlayer(this);

        if(this.direction === 'left') {
            this.body.velocity.x = 300;
        } else {
            this.body.velocity.x = -300;
        }

        this.body.velocity.y = -100;

        this.state = this.Dodging;

        this.timers.SetTimer('dodge_hold', duration || 600);

        return true;
    };

    this.LandHit = function() {
        //this.Dodge(1200, true);
        this.hasHit = true;
    };

    ////////////////////////////////STATES////////////////////////////////////
    this.Idling = function() {
        this.PlayAnim('idle');

        return true;
    };

    this.Windup = function() {
        this.PlayAnim('attack');

        if(this.animations.currentAnim.isFinished && this.timers.TimerUp('slash_hold')) {
            this.state = this.Attacking;
            this.timers.SetTimer('slash_hold', game.rnd.between(550, 700));
            events.publish('camera_shake', {magnitudeX: 3, magnitudeY: 0, duration: 200});
        }

        return false;
    };

    this.Attacking = function() {
        this.PlayAnim('attack');

        if(this.direction === 'left') {
            this.body.velocity.x = -250;
        } else {
            this.body.velocity.x = 250;
        }

        if(this.animations.currentAnim.isFinished && this.timers.TimerUp('slash_hold')) {
            this.state = this.Windup2;
            return true;
        }

        return false;
    };

    this.Dodging = function() {
        this.PlayAnim('float');

        if(this.timers.TimerUp('dodge_hold') && !EnemyBehavior.Player.IsDangerous(this)) {
            return true;
        }

        return false;
    }

    this.Hurting = function() {
        this.PlayAnim('stand');

        if(this.timers.TimerUp('hit') && this.body.onFloor()) {
            return true;
        }

        return false;
    };

    this.attackFrames = {
        'R2BTU/Attack0003': {
            x: 10, y: 15, w: 129, h: 30,
            damage: 3,
            knockback: 0,
            priority: 1,
            juggle: 0
        },

        'R2BTU/Attack0004': {
            x: 100, y: 10, w: 40, h: 15,
            damage: 3,
            knockback: 0,
            priority: 1,
            juggle: 0
        },

        'R2BTU/Attack20003': {
            x: 50, y: 0, w: 70, h: 80,
            damage: 3,
            knockback: 0,
            priority: 1,
            juggle: 0
        },

        'R2BTU/Attack20004': {
            x: 100, y: 73, w: 35, h: 10,
            damage: 3,
            knockback: 0,
            priority: 1,
            juggle: 0
        },

        'R2BTU/Block0000': {
            x: 20, y: -8, w: 45, h: 80,
            damage: 0,
            knockback: 0,
            priority: 2,
            juggle: 0
        },

        'R2BTU/Block0001': {
            x: 20, y: -8, w: 45, h: 80,
            damage: 0,
            knockback: 0,
            priority: 2,
            juggle: 0
        },
    };

};
