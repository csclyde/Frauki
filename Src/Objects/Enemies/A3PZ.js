Enemy.prototype.types['A3PZ'] =  function() {

    this.body.setSize(35, 75, 0, 0);
    this.anchor.setTo(0.5, 0.5);

    this.animations.add('idle', ['A3PZ/Idle0000', 'A3PZ/Idle0001', 'A3PZ/Idle0002', 'A3PZ/Idle0003', 'A3PZ/Idle0004'], 10, true, false);
    this.animations.add('walk', ['A3PZ/Walk0000', 'A3PZ/Walk0001', 'A3PZ/Walk0002', 'A3PZ/Walk0003', 'A3PZ/Walk0004', 'A3PZ/Walk0005', 'A3PZ/Walk0006', 'A3PZ/Walk0007', 'A3PZ/Walk0008', 'A3PZ/Walk0009', 'A3PZ/Walk0010'], 8, true, false);
    this.animations.add('block', ['A3PZ/Idle0000'], 18, true, false);
    this.animations.add('windup1', ['A3PZ/Attack0001', 'A3PZ/Attack0002', 'A3PZ/Attack0003'], 10, false, false);
    this.animations.add('attack1', ['A3PZ/Attack0004', 'A3PZ/Attack0005', 'A3PZ/Attack0006', 'A3PZ/Attack0007', 'A3PZ/Attack0008'], 16, false, false);
    this.animations.add('windup2', ['A3PZ/Attack0001', 'A3PZ/Attack0002', 'A3PZ/Attack0003'], 10, false, false);
    this.animations.add('attack2', ['A3PZ/Attack0004', 'A3PZ/Attack0005', 'A3PZ/Attack0006', 'A3PZ/Attack0007', 'A3PZ/Attack0008'], 16, false, false);
    this.animations.add('hurt', ['A3PZ/Hit0001'], 12, true, false);
    this.animations.add('stun', ['A3PZ/Hit0001'], 12, true, false);

    this.energy = 5;
    this.baseStunDuration = 500;
    this.stunThreshold = 1.5;

    this.robotic = true;

    this.firstAttack = true;
    
    this.updateFunction = function() {
        if(this.state === this.Slashing1 || this.state === this.Slashing2) {
            this.body.drag.x = 1200;
        } else {
            this.body.drag.x = 200;
        }
    };

    this.Act = function() {

        if(EnemyBehavior.Player.IsVisible(this)) {
            if(EnemyBehavior.Player.IsNear(this, 120) && EnemyBehavior.Player.IsVulnerable(this)) {
                EnemyBehavior.FacePlayer(this);
                this.Attack();

                // if(EnemyBehavior.Player.MovingTowards(this) || EnemyBehavior.Player.IsDangerous(this)) {
                //     this.Block(300);
                // } else if(EnemyBehavior.Player.IsVulnerable(this)) {
                // } else {
                //     this.Block(300);
                // }
            
            } else {
                this.state = this.Idling;

                if(this.animations.currentFrame.name === 'A3PZ/Walk0001' || this.animations.currentFrame.name === 'A3PZ/Walk0007') {
                    if(this.needsShake) {
                        events.publish('camera_shake', {magnitudeX: 0, magnitudeY: 3, duration: 200});
                        events.publish('play_sound', {name: 'door_slam', restart: true});
                        this.needsShake = false;
                    }
                } else {
                    EnemyBehavior.WalkToPlayer(this, 60);
                    this.needsShake = true;
                }
                
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
            this.timers.SetTimer('slash_hold', 400);
            this.state = this.Windup1;
        } else {
            this.timers.SetTimer('slash_hold', 300);
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
        this.timers.SetTimer('slash_hold', 400);
    };

    ////////////////////////////////STATES////////////////////////////////////
    this.Idling = function() {
        if(this.body.velocity.x === 0) {
            this.PlayAnim('idle');
        } else {
            this.PlayAnim('walk');

            if(this.walkShake && (this.animations.currentFrame.name === 'A3PZ/Walk0001' || this.animations.currentFrame.name === 'A3PZ/Walk0007')) {
                events.publish('camera_shake', {magnitudeX: 500, magnitudeY: 0, duration: 800});
            }
        }

        return true;
    };

    this.Windup1 = function() {
        this.PlayAnim('windup1');

        if(this.animations.currentAnim.isFinished && this.timers.TimerUp('slash_hold')) {
            this.state = this.Slashing1;
            this.timers.SetTimer('slash_hold', game.rnd.between(1000, 1200));
            events.publish('camera_shake', {magnitudeX: 5, magnitudeY: 0, duration: 600});

            if(this.direction === 'left') {
                this.body.velocity.x = -500;
            } else {
                this.body.velocity.x = 500;
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
            events.publish('camera_shake', {magnitudeX: 5, magnitudeY: 0, duration: 600});

            if(this.direction === 'left') {
                this.body.velocity.x = -500;
            } else {
                this.body.velocity.x = 500;
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
        'A3PZ/Attack0004': {
            x: 50, y: 25, w: 40, h: 30,
            damage: 2,
            knockback: 3,
            priority: 3,
            juggle: 0
        },

        'A3PZ/Attack0005': {
            x: 40, y: 25, w: 40, h: 30,
            damage: 2,
            knockback: 3,
            priority: 3,
            juggle: 0
        },

        'A3PZ/Attack0006': {
            x: 30, y: 25, w: 40, h: 30,
            damage: 2,
            knockback: 3,
            priority: 3,
            juggle: 0
        },

        'A3PZ/Attack0007': {
            x: 30, y: 25, w: 40, h: 30,
            damage: 2,
            knockback: 3,
            priority: 3,
            juggle: 0
        },

        // 'A3PZ/Attack0004': {
        //     x: 110, y: 10, w: 60, h: 15,
        //     damage: 2,
        //     knockback: 0,
        //     priority: 2,
        //     juggle: 0
        // },

        // 'A3PZ/Attack20003': {
        //     x: 30, y: 0, w: 110, h: 80,
        //     damage: 2,
        //     knockback: 0,
        //     priority: 2,
        //     juggle: 0
        // },

        // 'A3PZ/Attack20004': {
        //     x: 110, y: 73, w: 35, h: 10,
        //     damage: 2,
        //     knockback: 0,
        //     priority: 2,
        //     juggle: 0
        // },

        // 'A3PZ/Block0000': {
        //     x: 20, y: -8, w: 45, h: 80,
        //     damage: 0,
        //     knockback: 0,
        //     priority: 3,
        //     juggle: 0
        // },

        // 'A3PZ/Block0001': {
        //     x: 20, y: -8, w: 45, h: 80,
        //     damage: 0,
        //     knockback: 0,
        //     priority: 3,
        //     juggle: 0
        // },
    };

};
