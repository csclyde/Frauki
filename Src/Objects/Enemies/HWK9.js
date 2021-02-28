Enemy.prototype.types['HWK9'] =  function() {

	this.body.setSize(25, 56, 0, 0);
	this.anchor.setTo(0.5);

    this.animations.add('idle', ['HWK9/IdleWallHang0000', 'HWK9/IdleWallHang0001', 'HWK9/IdleWallHang0002', 'HWK9/IdleWallHang0003', 'HWK9/IdleWallHang0004', 'HWK9/IdleWallHang0005', 'HWK9/IdleWallHang0006'], 8, true, false);
    this.animations.add('attack_throw', ['HWK9/AttackWallHang0000', 'HWK9/AttackWallHang0001', 'HWK9/AttackWallHang0002', 'HWK9/AttackWallHang0003', 'HWK9/AttackWallHang0004'], 10, false, false);
	this.animations.add('attack_windup', ['HWK9/AttackDash0000', 'HWK9/AttackDash0001'], 8, false, false);
	this.animations.add('attack_dash', ['HWK9/AttackDash0002'], 8, false, false);
    this.animations.add('attack_slash', ['HWK9/AttackDash0003', 'HWK9/AttackDash0004', 'HWK9/AttackDash0005'], 18, false, false);
    this.animations.add('jetpack', ['HWK9/EvadeJetPackSide0000', 'HWK9/EvadeJetPackSide0001', 'HWK9/EvadeJetPackSide0002', 'HWK9/EvadeJetPackSide0003', 'HWK9/EvadeJetPackSide0004', 'HWK9/EvadeJetPackSide0005', 'HWK9/EvadeJetPackSide0006', 'HWK9/EvadeJetPackSide0007', 'HWK9/EvadeJetPackSide0008'], 12, true, false);
    this.animations.add('evade', ['HWK9/EvadeJetPackUp0000', 'HWK9/EvadeJetPackUp0001', 'HWK9/EvadeJetPackUp0002'], 12, true, false);
	
    this.animations.add('hurt', ['HWK9/Hurt0000', 'HWK9/Hurt0001'], 8, true, false);

    this.energy = 4;
	this.baseStunDuration = 500;
    this.robotic = true;

	this.body.bounce.y = 0;
	
	this.state = this.Idling;

	this.collideWithPlayer = function() {
		return this.state !== this.Jetpacking && this.state !== this.Slashing;
	};
    
	this.updateFunction = function() {
		if(this.state === this.Slashing) {
			this.body.allowGravity = false;
			this.body.drag.x = 0;
		} else {
			this.body.allowGravity = true;
			this.body.drag.x = 0;
		}

		if(this.state === this.Idling || this.state === this.ThrowingBomb) {
            this.body.moves = false;
        } else {
            this.body.moves = true;
        }
	};

	this.Act = function() {

        if(EnemyBehavior.Player.IsVisible(this)) {
			
			if(this.state === this.Idling && this.CanAttack() && EnemyBehavior.Player.IsNear(this, 220)) {
				this.ThrowBomb();
			}
            else if(EnemyBehavior.Player.IsNear(this, 250) && !EnemyBehavior.Player.IsDangerous(this) && this.CanAttack()) {
                this.Slash();
            }
            else if(EnemyBehavior.Player.IsDangerous(this) || (EnemyBehavior.Player.IsNear(this, 200) && EnemyBehavior.Player.MovingTowards(this))) {
                if(this.timers.TimerUp('evade_wait')) {
                    this.Evade();
                } else {
                    this.state = this.Idling;
                }
            
            } else if(EnemyBehavior.Player.IsInVulnerableFrame(this) && this.timers.TimerUp('hop_wait')) {
                this.Slash();
            
            } else {
                this.state = this.Idling;
            }

        } else {
            this.state = this.Idling;
        }
    };

	///////////////////////////////ACTIONS////////////////////////////////////
    this.Evade = function() {
    	if(!this.timers.TimerUp('evade_wait')) {
    		return;
    	}

    	this.state = this.Evading;

    	this.timers.SetTimer('evade_wait', 1000);
    	this.timers.SetTimer('burst_up_timer', 250);

    	this.body.velocity.y = 0;

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
		this.timers.SetTimer('throw_wait', 1000);
		this.numShots = game.rnd.between(1, 3);
	};

    this.Slash = function() {
    	this.state = this.SlashWindup;
    	this.timers.SetTimer('attack_delay', 800);
		this.body.velocity.x = 0;
		this.body.velocity.y = -300;
		this.body.acceleration.y = 0;

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

		if(this.facing === 'left') {
			this.body.velocity.x = 500;
		} else {
			this.body.velocity.x = -500;
		}

		return true;
	};

	this.SlashWindup = function() {
		this.PlayAnim('attack_windup');
		
		if(this.timers.TimerUp('attack_delay')) {
			this.state = this.SlashDashing;

			var attackVector = new Phaser.Point(frauki.body.x - this.body.x, (frauki.body.y - 30) - this.body.y);
			attackVector = attackVector.normalize();

			attackVector.setMagnitude(600);

			this.body.velocity = attackVector;

			EnemyBehavior.FacePlayer(this);
		}

		return false;
	};

	this.SlashDashing = function() {
		this.PlayAnim('attack_dash');

		if(EnemyBehavior.Player.IsNear(this, 80)) {
			this.timers.SetTimer('attack_delay', 300);			
			this.state = this.Slashing;
		}
		else if(this.body.onFloor()) {
			this.Jetpack();
		}

		return false;
	};

	this.Slashing = function() {
		this.PlayAnim('attack_slash');

		if(this.animations.currentAnim.isFinished && this.timers.TimerUp('attack_delay')) {
			//this.body.velocity.y /= 10;
			this.SetAttackTimer(1500);
			this.Jetpack();
		}

		return false;
	};

	this.Jetpacking = function() {
		this.PlayAnim('jetpack');

		this.body.velocity.y = -200;

		if(this.direction === 'left') {
			this.body.velocity.x = -350;
		} else {
			this.body.velocity.x = 350;
		}

		if(this.body.onWall()) {
			this.SetAttackTimer(700);

			if(this.direction === 'left') {
				this.SetDirection('right');
			} else {
				this.SetDirection('left');
			}

			return true;
		}

		return false;
	};

	this.Hovering = function() {
		this.PlayAnim('evade');

		EnemyBehavior.FaceForward(this);

		if(!this.timers.TimerUp('burst_up_timer')) {
			this.body.acceleration.y = -2500;
		} else {
			this.body.acceleration.y = 0;
		}

		if(this.timers.TimerUp('hover_burst')) {
			this.timers.SetTimer('burst_up_timer', 200);
			this.timers.SetTimer('hover_burst', game.rnd.between(600, 650));
		}

		return false;
	};

	this.ThrowingBomb = function() {
		this.PlayAnim('attack_throw');

		this.body.acceleration.x = 0;
		this.body.acceleration.y = 0;

		EnemyBehavior.FacePlayer(this);

		if(this.numShots > 0 && this.animations.currentFrame.name === 'HWK9/AttackWallHang0003' && !this.hasShot) {
			projectileController.Detonator(this);
			events.publish('play_sound', {name: 'SW8T_mortar_shot', restart: false});
			this.hasShot = true;
		}

		if(EnemyBehavior.Player.IsNear(this, 80) && this.timers.TimerUp('shoot_wait')) {
			this.numShots = 0;
			return true;
		}

		if(this.numShots === 0) {
			this.SetAttackTimer(2000);
			return true;

		} else if(this.animations.currentAnim.isFinished && this.timers.TimerUp('throw_wait')) {
			this.numShots--;
			this.timers.SetTimer('throw_wait', 1000);
			this.animations.currentAnim.restart();
			this.hasShot = false;

			return false;
		}

		return false;
	};

	this.Evading = function() {
		this.PlayAnim('evade');

		if(!this.timers.TimerUp('burst_up_timer') && EnemyBehavior.Player.IsNear(this, 200)) {
			this.body.acceleration.y = -3000;
		} else {
			this.body.acceleration.y = 0;
		}

		EnemyBehavior.FaceForward(this);

		if(EnemyBehavior.Player.IsVulnerable() && this.CanAttack()) {
			this.Slash();
		}

		if(this.timers.TimerUp('evade_wait')) {
			return true;
		}

		return false;
	}

	this.Hurting = function() {
		this.PlayAnim('hurt');

		this.body.acceleration.y = 0;

		if(this.timers.TimerUp('hit')) {
			if(this.timers.TimerUp('evade_wait')) {
				this.Evade();
			} else {
				this.Jetpack();
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

		'HWK9/AttackDash0003': {
			x: 20, y: -36, w: 60, h: 120,
			damage: 2,
			knockback: 0,
			priority: 2,
			juggle: 0
		},

		// 'HWK9/AttackDash0003': {
		// 	x: 25, y: -40, w: 40, h: 60,
		// 	damage: 3,
		// 	knockback: 0,
		// 	priority: 1,
		// 	juggle: 0
		// }

	};

};
