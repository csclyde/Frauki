Enemy.prototype.types['A3PZ'] =  function() {

    this.body.setSize(35, 75, 0, 0);
    this.anchor.setTo(0.5, 0.5);

    this.animations.add('idle', ['A3PZ/Stand0000'], 10, true, false);
    this.animations.add('walk', ['A3PZ/Walk0000', 'A3PZ/Walk0001', 'A3PZ/Walk0002', 'A3PZ/Walk0003', 'A3PZ/Walk0004', 'A3PZ/Walk0005'], 6, true, false);
    this.animations.add('block', ['A3PZ/Block0000', 'A3PZ/Block0001'], 18, true, false);
    this.animations.add('windup1', ['A3PZ/Attack0001', 'A3PZ/Attack0002'], 10, false, false);
    this.animations.add('attack1', ['A3PZ/Attack0003', 'A3PZ/Attack0004', 'A3PZ/Attack0005'], 18, false, false);
    this.animations.add('windup2', ['A3PZ/Attack20001', 'A3PZ/Attack20002'], 10, false, false);
    this.animations.add('attack2', ['A3PZ/Attack20003', 'A3PZ/Attack20004', 'A3PZ/Attack20005'], 18, false, false);
    this.animations.add('hurt', ['A3PZ/Hurt0000', 'A3PZ/Hurt0001'], 12, true, false);
    this.animations.add('stun', ['A3PZ/Hurt0000', 'A3PZ/Hurt0001'], 12, true, false);

    this.energy = 5;
    this.baseStunDuration = 500;

    this.robotic = true;

    this.firstAttack = true;
    
    this.updateFunction = function() {

    };

    this.Act = function() {

        if(EnemyBehavior.Player.IsVisible(this)) {
            if(EnemyBehavior.Player.ThrowIncoming(this)) {
                this.Block(300);
            }
            else if(EnemyBehavior.Player.IsNear(this, 100)) {
                EnemyBehavior.FacePlayer(this);

                if(EnemyBehavior.Player.MovingTowards(this) || EnemyBehavior.Player.IsDangerous(this)) {
                    this.Block(300);
                } else if(EnemyBehavior.Player.IsVulnerable(this)) {
                    this.Attack();
                } else {
                    this.Block(300);
                }
            
            } else {
                this.state = this.Idling;
                EnemyBehavior.WalkToPlayer(this, 75);
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


        if(this.firstAttack) {
            this.timers.SetTimer('slash_hold', 600);
            this.state = this.Windup1;
        } else {
            this.timers.SetTimer('slash_hold', 500);
            this.state = this.Windup2;
        }

        this.firstAttack = !this.firstAttack;

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

    this.Block = function(duration) {

        EnemyBehavior.FacePlayer(this);

        this.state = this.Dodging;

        this.timers.SetTimer('dodge_hold', duration || 600);
    };

    this.LandHit = function() {
        //this.Dodge(1200, true);
        this.hasHit = true;
    };

    ////////////////////////////////STATES////////////////////////////////////
    this.Idling = function() {
        if(this.body.velocity.x === 0) {
            this.PlayAnim('idle');
        } else {
            this.PlayAnim('walk');

            if(this.animations.currentFrame.name === 'A3PZ/Walk0001' || this.animations.currentFrame.name === 'A3PZ/Walk0004') {
                events.publish('camera_shake', {magnitudeX: 0.5, magnitudeY: 0, duration: 50});
            }
        }

        return true;
    };

    this.Windup1 = function() {
        this.PlayAnim('windup1');

        if(this.animations.currentAnim.isFinished && this.timers.TimerUp('slash_hold')) {
            this.state = this.Slashing1;
            this.timers.SetTimer('slash_hold', game.rnd.between(1000, 1200));
            events.publish('camera_shake', {magnitudeX: 3, magnitudeY: 0, duration: 200});

            if(this.direction === 'left') {
                this.body.velocity.x = -375;
            } else {
                this.body.velocity.x = 375;
            }
        }

        return false;
    };

    this.Slashing1 = function() {
        this.PlayAnim('attack1');

        

        if(this.animations.currentAnim.isFinished && this.timers.TimerUp('slash_hold')) {
            this.state = this.Windup2;
            return true;
        }

        return false;
    };

    this.Windup2 = function() {
        this.PlayAnim('windup2');

        if(this.animations.currentAnim.isFinished && this.timers.TimerUp('slash_hold')) {
            this.state = this.Slashing2;
            this.timers.SetTimer('slash_hold', game.rnd.between(1000, 1200));
            events.publish('camera_shake', {magnitudeX: 3, magnitudeY: 0, duration: 200});

            if(this.direction === 'left') {
                this.body.velocity.x = -375;
            } else {
                this.body.velocity.x = 375;
            }
        }

        return false;
    };

    this.Slashing2 = function() {
        this.PlayAnim('attack2');

        

        if(this.animations.currentAnim.isFinished && this.timers.TimerUp('slash_hold')) {
            return true;
        }

        return false;
    };

    this.Dodging = function() {
        this.PlayAnim('block');

        if(this.timers.TimerUp('dodge_hold') && !EnemyBehavior.Player.IsDangerous(this)) {
            return true;
        }

        return false;
    }

    this.Hurting = function() {
        this.PlayAnim('hurt');

        if(this.timers.TimerUp('hit') && this.body.onFloor()) {
            return true;
        }

        return false;
    };

    this.attackFrames = {
        'A3PZ/Attack0003': {
            x: 10, y: 15, w: 149, h: 30,
            damage: 2,
            knockback: 0,
            priority: 2,
            juggle: 0
        },

        'A3PZ/Attack0004': {
            x: 110, y: 10, w: 60, h: 15,
            damage: 2,
            knockback: 0,
            priority: 2,
            juggle: 0
        },

        'A3PZ/Attack20003': {
            x: 70, y: 0, w: 70, h: 80,
            damage: 2,
            knockback: 0,
            priority: 2,
            juggle: 0
        },

        'A3PZ/Attack20004': {
            x: 110, y: 73, w: 35, h: 10,
            damage: 2,
            knockback: 0,
            priority: 2,
            juggle: 0
        },

        'A3PZ/Block0000': {
            x: 20, y: -8, w: 45, h: 80,
            damage: 0,
            knockback: 0,
            priority: 3,
            juggle: 0
        },

        'A3PZ/Block0001': {
            x: 20, y: -8, w: 45, h: 80,
            damage: 0,
            knockback: 0,
            priority: 3,
            juggle: 0
        },
    };

};
