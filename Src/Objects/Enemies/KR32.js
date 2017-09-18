Enemy.prototype.types['KR32'] =  function() {

	this.body.setSize(15, 56, 0, 0);
	this.anchor.setTo(.5);

    this.animations.add('idle', ['KR32/Stand0000', 'KR32/Stand0001', 'KR32/Stand0002'], 4, true, false);
    this.animations.add('walk', ['KR32/WalkFront0000', 'KR32/WalkFront0001', 'KR32/WalkFront0002', 'KR32/WalkFront0003'], 6, true, false);
    this.animations.add('walk_back', ['KR32/WalkBack0000', 'KR32/WalkBack0001', 'KR32/WalkBack0002', 'KR32/WalkBack0003'], 6, true, false);

    this.animations.add('windup', ['KR32/Attack0000', 'KR32/Attack0001', 'KR32/Attack0002', 'KR32/Attack0003', 'KR32/Attack0004'], 16,  false, false);
    this.animations.add('attack', ['KR32/Attack0005', 'KR32/Attack0006', 'KR32/Attack0007', 'KR32/Attack0008'], 15, false, false);
    this.animations.add('attack_stab', ['KR32/Stab0000', 'KR32/Stab0001', 'KR32/Stab0002'], 10, false, false);
    this.animations.add('hurt', ['KR32/Hit0000'], 8, true, false);
    this.animations.add('block', ['KR32/Block0000', 'KR32/Block0001', 'KR32/Block0002', 'KR32/Block0003', 'KR32/Block0004', 'KR32/Block0005'], 14, false, false);
    this.animations.add('jump_back', ['KR32/Jump0004', 'KR32/Jump0005', 'KR32/Jump0006'], 16, false, false);
    this.animations.add('jump_forward', ['KR32/Jump0000', 'KR32/Jump0001', 'KR32/Jump0002'], 16, false, false);
    this.animations.add('land', ['KR32/Stand0000'], 14, false, false);

    this.energy = 4;
    this.baseStunDuration = 400;

    this.body.bounce.y = 0;

    this.mode = 'defensive';

    this.robotic = true;
    
	this.updateFunction = function() {
		if(this.timers.TimerUp('mode_change')) {

			if(Math.random() < 0.3 + (0.1 * this.energy)) {
				this.mode = 'defensive';
			} else {
				this.mode = 'aggressive';
			}

			this.timers.SetTimer('mode_change', game.rnd.between(1000, 2000));
		}

		if(this.state === this.Slashing) {
			this.body.drag.x = 1200;
		} else {
			this.body.drag.x = 200;
		}

	};

	this.Act = function() {

        if(EnemyBehavior.Player.IsVisible(this)) {

        	if(EnemyBehavior.Player.ThrowIncoming(this)) {
        		this.state = this.Blocking;

        	} else if(EnemyBehavior.Player.IsDangerous(this)) {
        		this.state = this.Blocking;

        	} else if(this.timers.TimerUp('dodge') && this.state === this.Slashing && EnemyBehavior.Player.IsNear(this, 120)) {
                this.Recoil();

            } else if(this.timers.TimerUp('dodge') && frauki.state === frauki.AttackStab) {
            	this.JumpOver();

            } else if(EnemyBehavior.Player.IsNear(this, 100)) {

            	if(this.CanAttack() && EnemyBehavior.Player.IsVulnerable(this) && !EnemyBehavior.Player.MovingTowards(this) && frauki.body.onFloor()) {
                	if(EnemyBehavior.Player.IsNear(this, 60)) {
                		this.AttackStab();
                	}
	                else {
	                    this.Attack();
	                }
                } else {
                	this.state = this.Blocking;
                }
            
            } else {
                this.state = this.Blocking;
            }
        } else {
            this.state = this.Idling;
            this.body.velocity.x = 0;
        }
    };

    this.LandHit = function() {
    	if(this.state === this.Blocking) {
    		this.timers.SetTimer('block_recoil', 200);
    	}
    };

	///////////////////////////////ACTIONS////////////////////////////////////
    this.Attack = function() {
    	EnemyBehavior.FacePlayer(this);
    	this.state = this.Windup;
    	this.timers.SetTimer('windup', game.rnd.between(500, 550));
        events.publish('play_sound', {name: 'attack_windup', restart: true});

    };

    this.AttackStab = function() {
    	EnemyBehavior.FacePlayer(this);
    	this.state = this.Stabbing;
		this.timers.SetTimer('attack_hold', 650);

		events.publish('play_sound', {name: 'KR32_stab', restart: true});

    };

    this.Recoil = function() {

    	this.state = this.Recoiling;

    	EnemyBehavior.FacePlayer(this);

    	if(this.body.onWall()) {
    		if(this.body.touching.left) {
    			this.body.velocity.x = 300;
    		} else if(this.body.touching.right) {
    			this.body.velocity.x = -300;
    		}
    	} else {
	    	if(this.direction === 'left') {
	    		this.body.velocity.x = 300;
	    	} else {
	    		this.body.velocity.x = -300;
	    	}
    	}

    	this.body.velocity.y = -200;

    	this.timers.SetTimer('dodge', game.rnd.between(2000, 4000));
    };

    this.JumpOver = function() {
    	this.state = this.Recoiling;

    	EnemyBehavior.FacePlayer(this);

    	if(this.direction === 'left') {
    		this.body.velocity.x = -100;
    	} else {
    		this.body.velocity.x = 100;
    	}
    	this.body.velocity.y = -300;

    	this.timers.SetTimer('dodge', game.rnd.between(2000, 4000));
    	this.timers.SetTimer('attack_wait', 0);
    };	

	////////////////////////////////STATES////////////////////////////////////
	this.Idling = function() {
		this.PlayAnim('idle');

		return true;
	};

	this.Blocking = function() {

		var speed = 25;

		if(EnemyBehavior.Player.IsDangerous(this)) {
			this.mode = 'defensive';
			speed = 100;

			this.timers.SetTimer('mode_change', game.rnd.between(500, 1000));
		}

		if(!this.timers.TimerUp('block_recoil')) {
			this.PlayAnim('block');
		} else if(this.animations.currentAnim.name === 'walk_back' ||
				  this.animations.currentAnim.name === 'walk' ||
				  (this.animations.currentAnim.name === 'block' && this.animations.currentAnim.isFinished)) {
			if(this.direction === 'left') {
				if(this.mode === 'defensive') {
					this.body.velocity.x = speed;
					this.PlayAnim('walk_back');
				} else {
					this.body.velocity.x = -speed;
					this.PlayAnim('walk');
				}
			} else if(this.direction === 'right') {
				if(this.mode === 'defensive') {
					this.body.velocity.x = -speed;
					this.PlayAnim('walk_back');
				} else {
					this.body.velocity.x = speed;
					this.PlayAnim('walk');
				}
			}
		} else {
			this.PlayAnim('block');
		}

		if(this.body.onWall() && this.mode === 'defensive') {
			this.mode = 'offensive';
			this.timers.SetTimer('mode_change', game.rnd.between(1000, 2000));
		}
		
		EnemyBehavior.FacePlayer(this);

		return true;

	};

	this.Recoiling = function() {
		
		if(this.body.onFloor()) {
			this.PlayAnim('land');
			this.body.velocity.x = 0;
		} else {
			EnemyBehavior.FacePlayer(this);

			//if they are moving the direction they are facing
			if((this.direction === 'left' && this.body.velocity.x < 0) || (this.direction === 'right' && this.body.velocity.x > 0)) {
				this.PlayAnim('jump_forward');
			} else {
				this.PlayAnim('jump_back');
			}

			//this.PlayAnim('jump');
		}

		if(this.animations.currentAnim.name === 'land' && this.animations.currentAnim.isFinished) {
			this.timers.SetTimer('attack_wait', 0);

			return true;
		}

		return false;

	};

	this.Windup = function() {
		this.PlayAnim('windup');

		if(this.timers.TimerUp('windup')) {
			this.state = this.Slashing;
			this.timers.SetTimer('attack_hold', 700);

			events.publish('stop_sound', {name: 'attack_windup', restart: true});
        	events.publish('play_sound', {name: 'KR32_attack', restart: true});

			if(this.direction === 'left') {
				this.body.velocity.x = -550;
			} else {
				this.body.velocity.x = 550;
			}
		}

		return false;
	}

	this.Slashing = function() {
		this.PlayAnim('attack');

		if(this.animations.currentAnim.isFinished && this.timers.TimerUp('attack_hold')) {
			this.timers.SetTimer('attack_wait', game.rnd.between(2000, 3000));
			return true;
		}

		return false;
	};

	this.Stabbing = function() {
		this.PlayAnim('attack_stab');

		if(this.animations.currentAnim.isFinished && this.timers.TimerUp('attack_hold')) {
			this.timers.SetTimer('attack_wait', game.rnd.between(600, 1000));

			return true;
		}

		return false;
	};

	this.Hurting = function() {
		this.PlayAnim('hurt');

		if(this.timers.TimerUp('hit') && this.body.onFloor()) {
    		this.timers.SetTimer('dodge', game.rnd.between(1500, 2000));
			return true;
		}

		return false;
	};

	this.attackFrames = {

		'KR32/Block0002': {
			x: 26, y: -8, w: 10, h: 60,
			damage: 0,
			knockback: 0,
			priority: 2,
			juggle: 0
		},

		'KR32/Block0003': {
			x: 26, y: -8, w: 10, h: 60,
			damage: 0,
			knockback: 0,
			priority: 2,
			juggle: 0
		},

		'KR32/Block0004': {
			x: 26, y: -8, w: 10, h: 60,
			damage: 0,
			knockback: 0,
			priority: 2,
			juggle: 0
		},

		'KR32/Block0005': {
			x: 26, y: -8, w: 10, h: 60,
			damage: 0,
			knockback: 0,
			priority: 2,
			juggle: 0
		},

		'KR32/WalkFront0000': {
			x: 26, y: -8, w: 10, h: 60,
			damage: 0,
			knockback: 0,
			priority: 2,
			juggle: 0
		},

		'KR32/WalkFront0001': {
			x: 26, y: -8, w: 10, h: 60,
			damage: 0,
			knockback: 0,
			priority: 2,
			juggle: 0
		},

		'KR32/WalkFront0002': {
			x: 26, y: -8, w: 10, h: 60,
			damage: 0,
			knockback: 0,
			priority: 2,
			juggle: 0
		},

		'KR32/WalkFront0003': {
			x: 26, y: -8, w: 10, h: 60,
			damage: 0,
			knockback: 0,
			priority: 2,
			juggle: 0
		},

		'KR32/WalkBack0000': {
			x: 26, y: -8, w: 10, h: 60,
			damage: 0,
			knockback: 0,
			priority: 2,
			juggle: 0
		},

		'KR32/WalkBack0001': {
			x: 26, y: -8, w: 10, h: 60,
			damage: 0,
			knockback: 0,
			priority: 2,
			juggle: 0
		},

		'KR32/WalkBack0002': {
			x: 26, y: -8, w: 10, h: 60,
			damage: 0,
			knockback: 0,
			priority: 2,
			juggle: 0
		},

		'KR32/WalkBack0003': {
			x: 26, y: -8, w: 10, h: 60,
			damage: 0,
			knockback: 0,
			priority: 2,
			juggle: 0
		},

		'KR32/Attack0005': {
			x: 30, y: -3, w: 70, h: 50,
			damage: 2,
			knockback: 0.3,
			priority: 4,
			juggle: 0
		},

		'KR32/Attack0006': {
			x: 30, y: -3, w: 70, h: 50,
			damage: 2,
			knockback: 0.3,
			priority: 4,
			juggle: 0
		},

		'KR32/Stab0001': {
			x: 0, y: 12, w: 90, h: 10,
			damage: 1,
			knockback: 0.2,
			priority: 3,
			juggle: 0
		}

	};

};
