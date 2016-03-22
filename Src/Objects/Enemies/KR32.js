Enemy.prototype.types['KR32'] =  function() {

	this.body.setSize(15, 56, 0, 0);
	this.anchor.setTo(.5);

    this.animations.add('idle', ['KR32/Stand0000'], 10, true, false);
    this.animations.add('walk', ['KR32/Walk0000', 'KR32/Walk0001', 'KR32/Walk0002', 'KR32/Walk0003', 'KR32/Walk0004', 'KR32/Walk0005'], 8, true, false);
    this.animations.add('walk_back', ['KR32/Walk0005', 'KR32/Walk0004', 'KR32/Walk0003', 'KR32/Walk0002', 'KR32/Walk0001', 'KR32/Walk0000'], 8, true, false);

    this.animations.add('windup', ['KR32/Attack0001', 'KR32/Attack0002'], 16,  false, false);
    this.animations.add('attack', ['KR32/Attack0003', 'KR32/Attack0004', 'KR32/Attack0005'], 15, false, false);
    this.animations.add('attack_stab', ['KR32/Stab0001', 'KR32/Stab0002', 'KR32/Stab0003', 'KR32/Stab0004'], 10, false, false);
    this.animations.add('hurt', ['KR32/Hurt0000', 'KR32/Hurt0001'], 8, true, false);
    this.animations.add('block', ['KR32/Block0000', 'KR32/Block0001'], 20, true, false);
    this.animations.add('jump_back', ['KR32/Jump0001'], 20, true, false);
    this.animations.add('jump_forward', ['KR32/JumpForward0000'], 20, true, false);
    this.animations.add('land', ['KR32/Jump0002'], 14, false, false);

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

 			if(this.timers.TimerUp('dodge') && this.state === this.Slashing && EnemyBehavior.Player.IsNear(this, 120)) {
                this.Recoil();

            } else if(this.timers.TimerUp('dodge') && frauki.state === frauki.AttackStab) {
            	this.JumpOver();

            } else if(EnemyBehavior.Player.IsNear(this, 100)) {

            	if(this.timers.TimerUp('attack_wait') && EnemyBehavior.Player.IsVulnerable(this) && !EnemyBehavior.Player.MovingTowards(this) && frauki.body.onFloor()) {
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
    	this.timers.SetTimer('windup', game.rnd.between(450, 500));
    };

    this.AttackStab = function() {
    	EnemyBehavior.FacePlayer(this);
    	this.state = this.Stabbing;
		this.timers.SetTimer('attack_hold', 550);

    };

    this.Recoil = function() {

    	this.state = this.Recoiling;

    	EnemyBehavior.FacePlayer(this);

    	if(this.direction === 'left') {
    		this.body.velocity.x = 300;
    	} else {
    		this.body.velocity.x = -300;
    	}
    	this.body.velocity.y = -150;

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
    	this.body.velocity.y = -250;

    	this.timers.SetTimer('dodge', game.rnd.between(2000, 4000));
    	this.timers.SetTimer('attack_wait', 0);
    };	

	////////////////////////////////STATES////////////////////////////////////
	this.Idling = function() {
		this.PlayAnim('idle');

		return true;
	};

	this.Blocking = function() {

		if(!this.timers.TimerUp('block_recoil')) {
			this.PlayAnim('block');

		} else if(this.direction === 'left') {
			if(this.mode === 'defensive') {
				this.body.velocity.x = -25;
				this.PlayAnim('walk_back');
			} else {
				this.body.velocity.x = 25;
				this.PlayAnim('walk');
			}
		} else {
			if(this.mode === 'defensive') {
				this.body.velocity.x = 25;
				this.PlayAnim('walk_back');
			} else {
				this.body.velocity.x = -25;
				this.PlayAnim('walk');
			}
		}

		if(this.body.onWall() && this.mode === 'defensive') {
			this.mode = 'defensive';
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
			this.timers.SetTimer('attack_hold', 500);

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

		'KR32/Block0000': {
			x: 18, y: -8, w: 10, h: 60,
			damage: 0,
			knockback: 0,
			priority: 2,
			juggle: 0
		},

		'KR32/Block0001': {
			x: 18, y: -8, w: 10, h: 60,
			damage: 0,
			knockback: 0,
			priority: 2,
			juggle: 0
		},

		'KR32/Walk0000': {
			x: 18, y: -8, w: 10, h: 60,
			damage: 0,
			knockback: 0,
			priority: 2,
			juggle: 0
		},

		'KR32/Walk0001': {
			x: 18, y: -8, w: 10, h: 60,
			damage: 0,
			knockback: 0,
			priority: 2,
			juggle: 0
		},

		'KR32/Walk0002': {
			x: 18, y: -8, w: 10, h: 60,
			damage: 0,
			knockback: 0,
			priority: 2,
			juggle: 0
		},

		'KR32/Walk0003': {
			x: 18, y: -8, w: 10, h: 60,
			damage: 0,
			knockback: 0,
			priority: 2,
			juggle: 0
		},

		'KR32/Walk0004': {
			x: 18, y: -8, w: 10, h: 60,
			damage: 0,
			knockback: 0,
			priority: 2,
			juggle: 0
		},

		'KR32/Walk0005': {
			x: 18, y: -8, w: 10, h: 60,
			damage: 0,
			knockback: 0,
			priority: 2,
			juggle: 0
		},

		'KR32/Attack0003': {
			x: 15, y: -3, w: 55, h: 50,
			damage: 3,
			knockback: 0.3,
			priority: 4,
			juggle: 0
		},

		'KR32/Attack0004': {
			x: 15, y: -3, w: 55, h: 50,
			damage: 3,
			knockback: 0.3,
			priority: 4,
			juggle: 0
		},

		'KR32/Stab0003': {
			x: 0, y: 12, w: 80, h: 10,
			damage: 1,
			knockback: 0.2,
			priority: 3,
			juggle: 0
		}

	};

};
