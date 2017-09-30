Enemy.prototype.types['A3PZ'] =  function() {

    this.body.setSize(35, 64, 0, 5);
    this.anchor.setTo(0.5, 0.5);

    this.animations.add('idle', ['A3PZ/Idle0000', 'A3PZ/Idle0001', 'A3PZ/Idle0002', 'A3PZ/Idle0003', 'A3PZ/Idle0004'], 10, true, false);
    this.animations.add('walk', ['A3PZ/Walk0000', 'A3PZ/Walk0001', 'A3PZ/Walk0002', 'A3PZ/Walk0003', 'A3PZ/Walk0004', 'A3PZ/Walk0005', 'A3PZ/Walk0006', 'A3PZ/Walk0007', 'A3PZ/Walk0008', 'A3PZ/Walk0009', 'A3PZ/Walk0010'], 8, true, false);
    this.animations.add('block', ['A3PZ/Idle0000'], 18, true, false);
    this.animations.add('punch_windup', ['A3PZ/Punch0001', 'A3PZ/Punch0002', 'A3PZ/Punch0003'], 10, false, false);
    this.animations.add('punch', ['A3PZ/Punch0004', 'A3PZ/Punch0005', 'A3PZ/Punch0006', 'A3PZ/Punch0007', 'A3PZ/Punch0008'], 16, false, false);

    this.animations.add('charge_windup', ['A3PZ/Charge0001', 'A3PZ/Charge0002'], 10, false, false);
    this.animations.add('charge', ['A3PZ/Charge0003', 'A3PZ/Charge0004', 'A3PZ/Charge0005', 'A3PZ/Charge0006'], 16, true, false);

    this.animations.add('hammer_windup', ['A3PZ/Hammer0001', 'A3PZ/Hammer0002', 'A3PZ/Hammer0003', 'A3PZ/Hammer0004', 'A3PZ/Hammer0005', 'A3PZ/Hammer0006', 'A3PZ/Hammer0007'], 16, false, false);
    this.animations.add('hammer_jump', ['A3PZ/Hammer0009'], 16, false, false);
    this.animations.add('hammer', ['A3PZ/Hammer0010', 'A3PZ/Hammer0011', 'A3PZ/Hammer0012', 'A3PZ/Hammer0013', 'A3PZ/Hammer0014', 'A3PZ/Hammer0015'], 12, false, false);
    
    this.animations.add('hurt', ['A3PZ/Hit0001'], 12, true, false);
    this.animations.add('stun', ['A3PZ/Hit0001'], 12, true, false);

    this.energy = 5;
    this.baseStunDuration = 500;
    this.stunThreshold = 2;
    this.body.bounce.y = 0;

    this.robotic = true;
    
    this.updateFunction = function() {
        if(this.state === this.Punching || this.state === this.Hammering) {
            this.body.drag.x = 1200;
        } else {
            this.body.drag.x = 200;
        }
    };

    this.Act = function() {

        if(EnemyBehavior.Player.IsVisible(this) && this.CanAttack()) {
            if(EnemyBehavior.Player.IsVulnerable(this)) {
                if(EnemyBehavior.Player.IsNear(this, 100) && EnemyBehavior.Player.MovingAway(this) && this.timers.TimerUp('charge_wait')) {
                    EnemyBehavior.FacePlayer(this);
                    this.Charge();

                } else if(EnemyBehavior.Player.IsNear(this, 80)) {
                    EnemyBehavior.FacePlayer(this);
                    this.Punch();

                } else if(EnemyBehavior.Player.IsNear(this, 160)) {
                    EnemyBehavior.FacePlayer(this);
                    this.Hammer();

                } else if(EnemyBehavior.Player.IsNear(this, 200) && this.timers.TimerUp('charge_wait')) {
                    EnemyBehavior.FacePlayer(this);
                    this.Charge();
                } else {
                    this.state = this.Idling;
                    EnemyBehavior.WalkToPlayer(this, 60);
                }

            } else {
                this.state = this.Idling;
                EnemyBehavior.WalkToPlayer(this, 60);
                
            }
        } else {
            this.state = this.Idling;
            this.body.velocity.x = 0;
        }
    };

    ///////////////////////////////ACTIONS////////////////////////////////////
    this.Punch = function() {
        if(!this.timers.TimerUp('attack')) {
            return;
        }

        this.timers.SetTimer('slash_hold', 300);
        this.state = this.PunchWindup;

        //events.publish('play_sound', {name: 'attack_windup', restart: true});
    };

    this.Hammer = function() {
         if(!this.timers.TimerUp('attack')) {
            return;
        }

        this.timers.SetTimer('slash_hold', 300);
        this.state = this.HammerWindup;

        //events.publish('play_sound', {name: 'attack_windup', restart: true});
    };

    this.Charge = function() {
        if(!this.timers.TimerUp('attack')) {
            return;
        }

        this.timers.SetTimer('slash_hold', 600);
        this.state = this.ChargeWindup;

        //events.publish('play_sound', {name: 'attack_windup', restart: true});
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
        if(this.body.velocity.x === 0 || this.body.onWall()) {
            this.PlayAnim('idle');
        } else {
            this.PlayAnim('walk');

            if(this.animations.currentFrame.name === 'A3PZ/Walk0001' || this.animations.currentFrame.name === 'A3PZ/Walk0007') {
                if(this.needsShake) {
                    events.publish('camera_shake', {magnitudeX: 0, magnitudeY: 3, duration: 200});
                    events.publish('play_sound', {name: 'AZP3_step', restart: true});
                    this.needsShake = false;
                }
            } else {
                this.needsShake = true;
            }
        }

        return true;
    };

    this.PunchWindup = function() {
        this.PlayAnim('punch_windup');

        if(this.animations.currentAnim.isFinished && this.timers.TimerUp('slash_hold')) {
            this.state = this.Punching;
            this.timers.SetTimer('slash_hold', game.rnd.between(1000, 1200));
            events.publish('camera_shake', {magnitudeX: 5, magnitudeY: 0, duration: 600});

        	//events.publish('stop_sound', {name: 'attack_windup', restart: true});
        	events.publish('play_sound', {name: 'AZP3_punch', restart: true});


            if(this.direction === 'left') {
                this.body.velocity.x = -500;
            } else {
                this.body.velocity.x = 500;
            }
        }

        return false;
    };

    this.Punching = function() {
        this.PlayAnim('punch');

        

        if(this.animations.currentAnim.isFinished && this.timers.TimerUp('slash_hold')) {
            this.SetAttackTimer(300);
            return true;
        }

        return false;
    };

    this.ChargeWindup = function() {
        this.PlayAnim('charge_windup');

        if(this.animations.currentAnim.isFinished && this.timers.TimerUp('slash_hold')) {
            this.state = this.Charging;
            this.timers.SetTimer('slash_hold', game.rnd.between(700, 900));
            
            //events.publish('camera_shake', {magnitudeX: 5, magnitudeY: 0, duration: 600});
            //events.publish('stop_sound', {name: 'attack_windup', restart: true});
            //events.publish('play_sound', {name: 'AZP3_punch', restart: true});


            // if(this.direction === 'left') {
            //     this.body.velocity.x = -500;
            // } else {
            //     this.body.velocity.x = 500;
            // }
        }

        return false;
    };

    this.Charging = function() {
        this.PlayAnim('charge');

        if(this.direction === 'left') {
            this.body.velocity.x = -700;
        } else {
            this.body.velocity.x = 700;
        }

        if(this.body.onWall() || this.timers.TimerUp('slash_hold')) {
            this.timers.SetTimer('charge_wait', 4000);
            return true;
        }

        return false;
    };

    this.HammerWindup = function() {
        this.PlayAnim('hammer_windup');

        if(this.animations.currentAnim.isFinished && this.timers.TimerUp('slash_hold')) {
            this.state = this.HammerJumping;
            this.timers.SetTimer('slash_hold', 600);
            // events.publish('camera_shake', {magnitudeX: 5, magnitudeY: 0, duration: 600});

            // events.publish('stop_sound', {name: 'attack_windup', restart: true});
        	// events.publish('play_sound', {name: 'AZP3_punch', restart: true});

            // if(this.direction === 'left') {
            //     this.body.velocity.x = -500;
            // } else {
            //     this.body.velocity.x = 500;
            // }

            var xTar = frauki.body.center.x;

            if(EnemyBehavior.Player.IsLeft(this)) {
                xTar += 60;
            } else {
                xTar -= 60;
            }

            if(frauki.body.velocity.x < 0) {
                xTar -= 60;
            } else if(frauki.body.velocity.x > 0) {
                xTar += 60;
            }

            EnemyBehavior.JumpToPoint(this, xTar, frauki.body.y - 50, 0.4);
        }

        return false;
    };

    this.HammerJumping = function() {
        this.PlayAnim('hammer_jump');

        EnemyBehavior.FacePlayer(this);

        var xDist = Math.abs(this.body.center.x - frauki.body.center.x);

        if(this.timers.TimerUp('slash_hold') || (xDist > 50 && xDist < 90)) {
            this.state = this.Hammering;
            this.body.velocity.y = 500;

            this.touchedDown = false;
        }
    };

    this.Hammering = function() {
        this.PlayAnim('hammer');

        if(this.body.onFloor() && !this.touchedDown) {
            this.touchedDown = true;

            //events.publish('stop_sound', {name: 'attack_windup', restart: true});
            events.publish('play_sound', {name: 'AZP3_punch', restart: true});

            events.publish('camera_shake', {magnitudeX: 7, magnitudeY: 0, duration: 600});
        }

        if(this.animations.currentAnim.isFinished && this.timers.TimerUp('slash_hold')) {
            this.SetAttackTimer(800);
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
        'A3PZ/Punch0004': {
            x: 50, y: 25, w: 40, h: 30,
            damage: 3,
            knockback: 3,
            priority: 3,
            juggle: 0
        },

        'A3PZ/Punch0005': {
            x: 40, y: 25, w: 40, h: 30,
            damage: 3,
            knockback: 3,
            priority: 3,
            juggle: 0
        },

        'A3PZ/Punch0006': {
            x: 30, y: 25, w: 40, h: 30,
            damage: 3,
            knockback: 3,
            priority: 3,
            juggle: 0
        },

        'A3PZ/Punch0007': {
            x: 30, y: 25, w: 40, h: 30,
            damage: 3,
            knockback: 3,
            priority: 3,
            juggle: 0
        },


        'A3PZ/Charge0003': {
            x: 55, y: -11, w: 10, h: 82,
            damage: 0,
            knockback: 3,
            priority: 3,
            juggle: 0,
            stun: true
        },

        'A3PZ/Charge0004': {
            x: 55, y: -11, w: 10, h: 82,
            damage: 0,
            knockback: 3,
            priority: 3,
            juggle: 0,
            stun: true
        },

        'A3PZ/Charge0005': {
            x: 55, y: -11, w: 10, h: 82,
            damage: 0,
            knockback: 3,
            priority: 3,
            juggle: 0,
            stun: true
        },

        'A3PZ/Charge0006': {
            x: 55, y: -11, w: 10, h: 82,
            damage: 0,
            knockback: 3,
            priority: 3,
            juggle: 0,
            stun: true
        },

        'A3PZ/Hammer0011': {
            x: 72, y: -6, w: 55, h: 70,
            damage: 5,
            knockback: 3,
            priority: 3,
            juggle: 0,
            friendlyFire: true
        },

    };

};
