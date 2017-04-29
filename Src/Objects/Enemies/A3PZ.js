Enemy.prototype.types['A3PZ'] =  function() {

    this.body.setSize(35, 64, 0, 5);
    this.anchor.setTo(0.5, 0.5);

    this.animations.add('idle', ['A3PZ/Idle0000', 'A3PZ/Idle0001', 'A3PZ/Idle0002', 'A3PZ/Idle0003', 'A3PZ/Idle0004'], 10, true, false);
    this.animations.add('walk', ['A3PZ/Walk0000', 'A3PZ/Walk0001', 'A3PZ/Walk0002', 'A3PZ/Walk0003', 'A3PZ/Walk0004', 'A3PZ/Walk0005', 'A3PZ/Walk0006', 'A3PZ/Walk0007', 'A3PZ/Walk0008', 'A3PZ/Walk0009', 'A3PZ/Walk0010'], 8, true, false);
    this.animations.add('block', ['A3PZ/Idle0000'], 18, true, false);
    this.animations.add('punch_windup', ['A3PZ/Punch0001', 'A3PZ/Punch0002', 'A3PZ/Punch0003'], 10, false, false);
    this.animations.add('punch', ['A3PZ/Punch0004', 'A3PZ/Punch0005', 'A3PZ/Punch0006', 'A3PZ/Punch0007', 'A3PZ/Punch0008'], 16, false, false);
    this.animations.add('hammer_windup', ['A3PZ/Hammer0001', 'A3PZ/Hammer0002', 'A3PZ/Hammer0003', 'A3PZ/Hammer0004', 'A3PZ/Hammer0005', 'A3PZ/Hammer0006', 'A3PZ/Hammer0007'], 10, false, false);
    this.animations.add('hammer_jump', ['A3PZ/Hammer0009'], 16, false, false);
    this.animations.add('hammer', ['A3PZ/Hammer0010', 'A3PZ/Hammer0011', 'A3PZ/Hammer0012', 'A3PZ/Hammer0013', 'A3PZ/Hammer0014', 'A3PZ/Hammer0015'], 12, false, false);
    this.animations.add('hurt', ['A3PZ/Hit0001'], 12, true, false);
    this.animations.add('stun', ['A3PZ/Hit0001'], 12, true, false);

    this.energy = 5;
    this.baseStunDuration = 500;
    this.stunThreshold = 1.5;
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

        if(EnemyBehavior.Player.IsVisible(this)) {
            if(EnemyBehavior.Player.IsNear(this, 120) && EnemyBehavior.Player.IsVulnerable(this)) {
                EnemyBehavior.FacePlayer(this);
                this.Punch();

                // if(EnemyBehavior.Player.MovingTowards(this) || EnemyBehavior.Player.IsDangerous(this)) {
                //     this.Block(300);
                // } else if(EnemyBehavior.Player.IsVulnerable(this)) {
                // } else {
                //     this.Block(300);
                // }
            } else if(EnemyBehavior.Player.IsNear(this, 220)) {
                EnemyBehavior.FacePlayer(this);
                this.Hammer();

            } else {
                this.state = this.Idling;

                if(this.animations.currentFrame.name === 'A3PZ/Walk0001' || this.animations.currentFrame.name === 'A3PZ/Walk0007') {
                    if(this.needsShake) {
                        events.publish('camera_shake', {magnitudeX: 0, magnitudeY: 3, duration: 200});
                        events.publish('play_sound', {name: 'AZP3_step', restart: true});
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
    this.Punch = function() {
        if(!this.timers.TimerUp('attack')) {
            return;
        }

        this.timers.SetTimer('slash_hold', 400);
        this.state = this.PunchWindup;

        events.publish('play_sound', {name: 'attack_windup', restart: true});
    };

    this.Hammer = function() {
         if(!this.timers.TimerUp('attack')) {
            return;
        }

        this.timers.SetTimer('slash_hold', 500);
        this.state = this.HammerWindup;

        events.publish('play_sound', {name: 'attack_windup', restart: true});
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

    this.PunchWindup = function() {
        this.PlayAnim('punch_windup');

        if(this.animations.currentAnim.isFinished && this.timers.TimerUp('slash_hold')) {
            this.state = this.Punching;
            this.timers.SetTimer('slash_hold', game.rnd.between(1000, 1200));
            events.publish('camera_shake', {magnitudeX: 5, magnitudeY: 0, duration: 600});

        	events.publish('stop_sound', {name: 'attack_windup', restart: true});
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

            EnemyBehavior.JumpToPoint(this, frauki.body.center.x, frauki.body.y - 50);
        }

        return false;
    };

    this.HammerJumping = function() {
        this.PlayAnim('hammer_jump');

        if(this.timers.TimerUp('slash_hold')) {
            this.state = this.Hammering;
            this.body.velocity.y = 500;

            this.touchedDown = false;
        }
    };

    this.Hammering = function() {
        this.PlayAnim('hammer');

        if(this.body.onFloor() && !this.touchedDown) {
            this.touchedDown = true;

            events.publish('stop_sound', {name: 'attack_windup', restart: true});
            events.publish('play_sound', {name: 'AZP3_punch', restart: true});

            events.publish('camera_shake', {magnitudeX: 7, magnitudeY: 0, duration: 600});
        }

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
