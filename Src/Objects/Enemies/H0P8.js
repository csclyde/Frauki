Enemy.prototype.types['H0P8'] =  function() {

    this.body.setSize(40, 53, 0, 2);
    this.anchor.setTo(0.5, 0.5);

    this.animations.add('idle', ['H0P8/Idle0000', 'H0P8/Idle0001', 'H0P8/Idle0002', 'H0P8/Idle0003'], 6, true, false);
    this.animations.add('pre_hop', ['H0P8/Attack0000'], 10, false, false);
    this.animations.add('hop', ['H0P8/Attack0001'], 10, false, false);
    this.animations.add('attack', ['H0P8/Attack0002', 'H0P8/Attack0003', 'H0P8/Attack0004', 'H0P8/Attack0005'], 10, false, false);
    this.animations.add('shield', ['H0P8/Shield0000', 'H0P8/Shield0001', 'H0P8/Shield0002', 'H0P8/Shield0003', 'H0P8/Shield0004', 'H0P8/Shield0005', 'H0P8/Shield0006'], 8, false, false);
    this.animations.add('hurt', ['H0P8/Hurt0000', 'H0P8/Hurt0001'], 12, true, false);

    this.energy = 4;
    this.baseStunDuration = 500;
    this.stunThreshold = 1;
    this.body.bounce.y = 0;
    this.body.drag.x = 100;
    this.onFloor = false;

    this.robotic = true;

    this.updateFunction = function() {
        if(this.body.onFloor() && !this.onFloor) {
			this.onFloor = true;
			events.publish('play_sound', {name: 'H0P8_land', restart: false });

		} else if(!this.body.onFloor()) {
			this.onFloor = false;
        }
        
        if(this.body.onFloor() && this.state !== this.Escaping) {
            this.body.drag.x = 8000;
        } else {
            this.body.drag.x = 100;
        }
    };

    this.Act = function() {

        if(EnemyBehavior.Player.IsVisible(this)) {

            //if theyre stunned, seize the opportunity
            if(this.CanAttack() && EnemyBehavior.Player.IsStunned(this)) {
                this.Hop();

            } else if(frauki.state === frauki.AttackDiveCharge) {
                this.Dodge();
                console.log('YOINKS')

            } else if(frauki.InPreAttackAnim()) {
                this.Shield();
                
                
            } else if((EnemyBehavior.Player.IsNear(this, 50))) {
                if(EnemyBehavior.Player.IsDangerous(this) || EnemyBehavior.Player.MovingTowards(this)) {
                    this.Shield();
                } else if(this.CanAttack() && EnemyBehavior.Player.IsVulnerable(this)) {
                    this.Slash();
                } else if(this.timers.TimerUp('dodge')){
                    this.Dodge();
                } else {
                    this.IdleHop();                    
                }
            }
            else if(EnemyBehavior.Player.IsNear(this, 250)) {
                if(this.CanAttack() && EnemyBehavior.Player.IsVulnerable(this)) {
                    this.Hop();
                } else {
                    this.state = this.Idling;
                }
            } 
            else {
                if(this.timers.TimerUp('idle_hop_wait') && !EnemyBehavior.Player.IsNear(this, 100)) {
                    this.IdleHop();
                } else {
                    this.state = this.Idling;
                }
            }

        } else {
            this.state = this.Idling;
        }
    };

    this.LandHit = function() {
        //this.Dodge();
    };

    this.OnBlock = function() {
    };

    ///////////////////////////////ACTIONS////////////////////////////////////
    this.Hop = function() {
        EnemyBehavior.FacePlayer(this);

        this.timers.SetTimer('hop_wait', 500 + game.rnd.between(50, 150));
        this.state = this.PreHopping;
    };

    this.Dodge = function() {

        this.timers.SetTimer('dodge_wait', 800 + game.rnd.between(50, 300));

        this.state = this.Escaping;

        this.body.velocity.x = game.rnd.between(400, 550) * EnemyBehavior.Player.DirMod(this);

        if(frauki.body.onFloor()) {
            this.body.velocity.y = -200  + game.rnd.between(50, 150);
        }

        EnemyBehavior.FaceForward(this);

    };

    this.Slash = function() {
        
        this.state = this.Slashing;
        this.timers.SetTimer('attack_wait', 700  + game.rnd.between(50, 150));
        //EnemyBehavior.JumpToPoint(this, frauki.body.center.x, frauki.body.center.y, 0.1);
        EnemyBehavior.FacePlayer(this);
		events.publish('play_sound', {name: 'H0P8_attack', restart: false });

    };

    this.IdleHop = function() {
        
        this.state = this.IdleHopping;
        this.body.velocity.y = game.rnd.between(-100, -200);
        this.body.velocity.x = game.rnd.between(150, 250);

        if(game.rnd.between(1, 2) === 1) {
            this.body.velocity.x *= -1;
        }
        
        EnemyBehavior.FaceForward(this);

        this.timers.SetTimer('idle_hop_wait', game.rnd.between(1500, 2500));
    };

    this.Shield = function() {
        
        this.state = this.Shielding; 

        EnemyBehavior.FacePlayer(this);
    };


    ////////////////////////////////STATES////////////////////////////////////
    this.Idling = function() {
        this.PlayAnim('idle');
        return true;
    };

    this.IdleHopping = function() {
        this.PlayAnim('idle');

        if(this.body.onFloor()) {
            return true;
        }

        return false;

    };

    this.PreHopping = function() {
        this.PlayAnim('pre_hop');

        if(EnemyBehavior.Player.IsDangerous(this) && EnemyBehavior.Player.IsNear(this, 50)) {
            return true;
        }

        if(this.timers.TimerUp('hop_wait')) {

            if(EnemyBehavior.Player.IsNear(this, 40)) {
                return true;
            }

            this.state = this.Hopping;

            var ptX = frauki.body.center.x;
            var ptY = frauki.body.y - 20;
            var overDist = 0; //game.rnd.between(250, 300);

            var xVelMod = (this.body.center.x = frauki.body.center.x) / 6;

            if(EnemyBehavior.Player.IsLeft(this)) {
                this.body.velocity.x = -200 - xVelMod;
            } else {
                this.body.velocity.x = 200 + xVelMod;
            }
            this.body.velocity.y = -200;

            EnemyBehavior.FacePlayer(this);
            //EnemyBehavior.JumpToPoint(this, ptX, ptY, 1); 
            events.publish('play_sound', {name: 'H0P8_jump', restart: true});


        }

        return false;
    };

    this.Hopping = function() {
        if(this.body.onFloor()) {
            this.PlayAnim('pre_hop');
        } else {
            this.PlayAnim('hop');
        }

        if(this.CanAttack() && EnemyBehavior.Player.IsNear(this, 50)) {
            this.Slash();
        }

        if(this.body.onFloor()) {
            this.SetAttackTimer(800);

            return true;
        }

        return false;
    };

    this.Slashing = function() {
        this.PlayAnim('attack');

        if(this.animations.currentAnim.isFinished && this.timers.TimerUp('slash_hold') && this.body.onFloor()) {
            this.SetAttackTimer(800);
            EnemyBehavior.FacePlayer(this);
            this.timers.SetTimer('idle_hop_wait', 4000)
            this.timers.SetTimer('dodge', 1000)
            return true;
        }

        return false;
    };

    this.Escaping = function() {

        if(!this.body.onFloor()) {
            this.PlayAnim('hop');
        } else {
            this.PlayAnim('pre_hop');
        }

        if(this.timers.TimerUp('dodge_wait')) {
            this.SetAttackTimer(0);
            return true;
        }

        return false;
    };

    this.Shielding = function() {
        this.PlayAnim('shield');

        if(this.CanAttack() && EnemyBehavior.Player.IsInVulnerableFrame(this) && EnemyBehavior.Player.IsNear(this, 50)) {
            this.Slash();
        }

        if(this.animations.currentAnim.isFinished) {
            return true;
        }

        return false;
    };

    this.Hurting = function() {
        this.PlayAnim('hurt');

        if(this.timers.TimerUp('hit')) {
            return true;
        }

        return false;
    };

    this.attackFrames = {
        'H0P8/Attack0004': {
            x: 10, y: 10, w: 80, h: 100,
            damage: 3,
            knockback: 1,
            priority: 1,
            juggle: 0
        },

        'H0P8/Shield0000': {
            x: 0, y: 0, w: 50, h: 50,
            damage: 0,
            knockback: 0,
            priority: 5,
            juggle: 0
        },
        'H0P8/Shield0001': {
            x: 0, y: 0, w: 50, h: 50,
            damage: 0,
            knockback: 0,
            priority: 5,
            juggle: 0
        },
        'H0P8/Shield0002': {
            x: 0, y: 0, w: 50, h: 50,
            damage: 0,
            knockback: 0,
            priority: 5,
            juggle: 0
        },
        'H0P8/Shield0003': {
            x: 0, y: 0, w: 50, h: 50,
            damage: 0,
            knockback: 0,
            priority: 5,
            juggle: 0
        },
        'H0P8/Shield0004': {
            x: 0, y: 0, w: 50, h: 50,
            damage: 0,
            knockback: 0,
            priority: 5,
            juggle: 0
        },
    };

};
