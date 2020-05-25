Enemy.prototype.types['HWK9'] =  function() {

	this.body.setSize(15, 56, 0, 0);
	this.anchor.setTo(0.5);

    this.animations.add('idle', ['HWK9/IdleWallHang0000', 'HWK9/IdleWallHang0001', 'HWK9/IdleWallHang0002', 'HWK9/IdleWallHang0003', 'HWK9/IdleWallHang0004', 'HWK9/IdleWallHang0005', 'HWK9/IdleWallHang0006'], 8, true, false);
    this.animations.add('attack_throw', ['HWK9/AttackWallHang0000', 'HWK9/AttackWallHang0001', 'HWK9/AttackWallHang0002', 'HWK9/AttackWallHang0003', 'HWK9/AttackWallHang0004'], 12, true, false);
	this.animations.add('attack_windup', ['HWK9/AttackDash0000', 'HWK9/AttackDash0001'], 12, false, false);
    this.animations.add('attack_slash', ['HWK9/AttackDash0002', 'HWK9/AttackDash0003', 'HWK9/AttackDash0004'], 12, false, false);
    this.animations.add('jetpack', ['HWK9/EvadeJetPackSide0000', 'HWK9/EvadeJetPackSide0001', 'HWK9/EvadeJetPackSide0002', 'HWK9/EvadeJetPackSide0003', 'HWK9/EvadeJetPackSide0004', 'HWK9/EvadeJetPackSide0005', 'HWK9/EvadeJetPackSide0006', 'HWK9/EvadeJetPackSide0007', 'HWK9/EvadeJetPackSide0008'], 12, true, false);
    this.animations.add('evade', ['HWK9/EvadeJetPackUp0000', 'HWK9/EvadeJetPackUp0001', 'HWK9/EvadeJetPackUp0002'], 12, true, false);
	
    this.animations.add('hurt', ['HWK9/AttackDash0001'], 12, true, false);

    this.energy = 5;
	this.baseStunDuration = 500;
    this.robotic = true;

    this.body.drag.x = 1000;
	this.body.bounce.y = 0;
	
	this.state = this.Idling;
    
	this.updateFunction = function() {

		if(this.state === this.Slashing) {
			this.body.allowGravity = false;
		} else {
			this.body.allowGravity = true;
		}

		if(this.state === this.Idling || this.state === this.ThrowingBomb) {
            this.body.moves = false;
        } else {
            this.body.moves = true;
        }
	};

	this.Act = function() {

        if(EnemyBehavior.Player.IsVisible(this)) {
            
            if(EnemyBehavior.Player.IsNear(this, 250) && !EnemyBehavior.Player.IsDangerous(this) && this.CanAttack()) {
                this.Slash();
            }
            else if(EnemyBehavior.Player.IsDangerous(this) || (EnemyBehavior.Player.IsNear(this, 200) && EnemyBehavior.Player.MovingTowards(this))) {
                if(this.timers.TimerUp('escape_wait')) {
                    //this.Escape();
                } else {
                    this.state = this.Idling;
                }
            
            } else if(EnemyBehavior.Player.IsInVulnerableFrame(this) && this.timers.TimerUp('hop_wait')) {
                //this.Hop();
            
            } else {
                this.state = this.Idling;
            }

        } else {
            this.state = this.Idling;
        }
    };

	///////////////////////////////ACTIONS////////////////////////////////////
    this.Evade = function() {
    	if(!this.timers.TimerUp('evade_timer')) {
    		return;
    	}

    	this.state = this.Evading;

    	this.timers.SetTimer('evade_timer', 1000);

    	this.body.acceleration.y = -800;

    	if(this.direction === 'left') {
    		this.body.velocity.x = 200;
    	} else {
    		this.body.velocity.x = -200;
    	}
	};
	
	this.Jetpack = function() {
		this.state = this.Jetpacking;
	};

	this.ThrowBomb = function() {
		this.state = this.ThrowingBomb;
	}

    this.Slash = function() {
    	this.state = this.SlashWindup;
    	this.timers.SetTimer('attack_delay', 600);
		this.body.velocity.x = 0;
		this.body.velocity.y = -300;

		if(EnemyBehavior.Player.IsLeft(this)) {
			this.body.velocity.x = -100;
		} else {
			this.body.velocity.x = 100;
		}
    };

	////////////////////////////////STATES////////////////////////////////////
	this.Idling = function() {
		this.PlayAnim('idle');

		this.body.acceleration.x = 0;
		this.body.acceleration.y = 0;

		return true;
	};

	this.SlashWindup = function() {
		this.PlayAnim('attack_windup');
		
		if(this.timers.TimerUp('attack_delay')) {
			this.state = this.Slashing;
			this.timers.SetTimer('attack_delay', 600);

			var attackVector = new Phaser.Point(frauki.body.x - this.body.x, (frauki.body.y - 60) - this.body.y);
			attackVector = attackVector.normalize();

			attackVector.setMagnitude(800);

			this.body.velocity = attackVector;

			EnemyBehavior.FacePlayer(this);
		}

		return false;
	};

	this.Slashing = function() {
		this.PlayAnim('attack_slash');

		if(this.timers.TimerUp('attack_delay')) {
			this.SetAttackTimer(1000);

			this.Jetpack();
		}

		return false;
	};

	this.Jetpacking = function() {
		this.PlayAnim('jetpack');

		this.body.velocity.y = -300;

		if(this.direction === 'left') {
			this.body.velocity.x = -400;
		} else {
			this.body.velocity.x = 400;
		}

		if(this.body.onWall()) {
			return true;
		}

		return false;
	};

	this.Hurting = function() {
		this.PlayAnim('hurt');

		if(this.timers.TimerUp('hit')) {
			if(this.timers.TimerUp('evade_timer')) {
				this.Evade();
			} else {
				this.Block();
			}
		}
	};

	this.attackFrames = {
		// 'HWK9/Block0000': {
		// 	x: -4, y: 2, w: 32, h: 32,
		// 	damage: 0,
		// 	knockback: 0,
		// 	priority: 1,
		// 	juggle: 0
		// },

		// 'HWK9/AttackDash0001': {
		// 	x: 49, y: -34, w: 25, h: 90,
		// 	damage: 3,
		// 	knockback: 0,
		// 	priority: 2,
		// 	juggle: 0
		// },

		// 'HWK9/AttackDash0002': {
		// 	x: 32, y: -46, w: 40, h: 50,
		// 	damage: 3,
		// 	knockback: 0,
		// 	priority: 2,
		// 	juggle: 0
		// },

		// 'HWK9/AttackDash0003': {
		// 	x: 25, y: -40, w: 40, h: 60,
		// 	damage: 3,
		// 	knockback: 0,
		// 	priority: 1,
		// 	juggle: 0
		// }

	};

};
