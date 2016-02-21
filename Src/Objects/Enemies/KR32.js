Enemy.prototype.types['KR32'] =  function() {

	this.body.setSize(15, 56, 0, 0);
	this.anchor.setTo(.5);

    this.animations.add('idle', ['KR32/Stand0000'], 10, true, false);
    this.animations.add('block', ['KR32/Block0000'], 10, true, false);
    this.animations.add('walk_back', ['KR32/Walk0000', 'KR32/Walk0001', 'KR32/Walk0002', 'KR32/Walk0003', 'KR32/Walk0004', 'KR32/Walk0005'], 8, true, false);
    this.animations.add('windup', ['KR32/Attack0000'], 5,  false, false);
    this.animations.add('attack', ['KR32/Attack0001', 'KR32/Attack0002', 'KR32/Attack0003', 'KR32/Attack0004', 'KR32/Attack0005', 'KR32/Attack0006', 'KR32/Attack0007', 'KR32/Attack0008'], 18, false, false);
    this.animations.add('attack_stab', ['KR32/Stab0001', 'KR32/Stab0002', 'KR32/Stab0003', 'KR32/Stab0004'], 10, false, false);
    this.animations.add('hurt', ['KR32/Hurt0000', 'KR32/Hurt0001'], 8, true, false);

    this.energy = 5;
    this.baseStunDuration = 400;

    this.mode = 'defensive';

    this.robotic = true;

    /*
    this.damage = 5;
    */

    //this.body.drag.x = 800;
    
	this.updateFunction = function() {
		if(this.timers.TimerUp('mode_change')) {

			if(Math.random() < 0.3 + (0.1 * this.energy)) {
				this.mode = 'defensive';
			} else {
				this.mode = 'aggressive';
			}

			this.timers.SetTimer('mode_change', game.rnd.between(1000, 2000));
		}

	};

	this.CanCauseDamage = function() { return false; }
	this.CanChangeDirection = function() { return false; }
	this.Vulnerable = function() { return true; };


	///////////////////////////////ACTIONS////////////////////////////////////

	this.TakeHit = function(power) {
		if(!this.timers.TimerUp('hit')) {
			return;
		}

	    this.timers.SetTimer('hit', 800);

	    this.state = this.Hurting;
	};

	this.Die = function() {
        this.anger = 1;
        this.state = this.Idling;
    };

    this.Attack = function() {
    	if(!this.timers.TimerUp('attack') && !EnemyBehavior.Player.IsVulnerable(this)) {
    		return;
    	}

    	this.state = this.Windup;

    	this.timers.SetTimer('windup', 400 + game.rnd.between(0, 50));
    };

    this.AttackStab = function() {
    	
  //   	if(this.direction === 'left') {
		// 	this.body.velocity.x = 300;
		// } else {
		// 	this.body.velocity.x = -300;
		// }

    	EnemyBehavior.FacePlayer(this);
    	this.state = this.Stabbing;
    };

    this.Recoil = function() {
    	this.state = this.Blocking;

    	EnemyBehavior.FacePlayer(this);

    	if(this.direction === 'left') {
    		this.body.velocity.x = 200;
    	} else {
    		this.body.velocity.x = -200;
    	}

    	this.body.velocity.y = -100;
    };

	////////////////////////////////STATES////////////////////////////////////
	this.Idling = function() {
		this.PlayAnim('idle');

		if(EnemyBehavior.Player.IsVisible(this)) {
			this.state = this.Blocking;
		}
	};

	this.Blocking = function() {
		if(Math.abs(this.body.velocity.x) < 30) {
			this.PlayAnim('walk_back');

			if(this.direction === 'left') {

				this.body.velocity.x = this.mode === 'defensive' ? 25 : -25;
			} else {
				this.body.velocity.x = this.mode === 'defensive' ? -25 : 25;
			}
		} else {
			this.PlayAnim('block');
		}

		EnemyBehavior.FacePlayer(this);

		if(!EnemyBehavior.Player.IsVisible(this)) {
			this.state = this.Idling;
		}

		//if the player is out of reach, dont let the attack timer expire
		if(frauki.body.center.y < this.body.center.y - 50) {
			this.timers.SetTimer('attack', 500 + Math.random() * 1000);
		}

		if(EnemyBehavior.Player.Distance(this) < 160 && !frauki.InPreAttackAnim() && !frauki.Attacking() && this.body.onFloor() && frauki.body.center.y > this.body.center.y - 50) {

			if(EnemyBehavior.Player.Distance(this) < 75) {
				this.AttackStab();
			} else if(!frauki.InPreAttackAnim()) {
				this.Attack();
			}
		}

	};

	this.Windup = function() {
		this.PlayAnim('windup');

		if(this.timers.TimerUp('windup')) {
			this.state = this.Slashing;

			if(this.direction === 'left') {
				this.body.velocity.x = -400;
			} else {
				this.body.velocity.x = 400;
			}
		}
	}

	this.Slashing = function() {
		this.PlayAnim('attack');

		if(this.animations.currentFrame.name === 'KR32/Attack0005') {
			this.animations.currentAnim.delay = 500;
		} else {
			this.animations.currentAnim.delay = 1000 / 18;
		}

		if(this.animations.currentAnim.isFinished) {

			if(EnemyBehavior.Player.Distance(this) < 100) {
				this.Recoil();
			} else {
				this.state = this.Blocking;
			}

			this.timers.SetTimer('attack', 500 + Math.random() * 1000);
		}
	};

	this.Stabbing = function() {
		this.PlayAnim('attack_stab');

		//EnemyBehavior.FacePlayer(this);

		if(this.animations.currentAnim.isFinished) {

			if(EnemyBehavior.Player.Distance(this) < 100) {
				this.Recoil();
			} else {
				this.state = this.Blocking;
			}

			this.timers.SetTimer('attack', 500 + Math.random() * 1000);
		}
	};

	this.Hurting = function() {
		this.PlayAnim('hurt');

		if(this.timers.TimerUp('hit') && this.body.onFloor()) {
			if(EnemyBehavior.Player.Distance(this) < 75) {
				this.Recoil();
			} else {
				this.state = this.Idling;
			}

			this.timers.SetTimer('attack', 500 + Math.random() * 1000);
		}
	};

	this.attackFrames = {
		'KR32/Block0000': {
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

		'KR32/Attack0001': {
			x: 15, y: -3, w: 55, h: 50,
			damage: 3,
			knockback: 0.5,
			priority: 1,
			juggle: 0
		},

		'KR32/Attack0002': {
			x: 15, y: -3, w: 55, h: 50,
			damage: 2,
			knockback: 0.3,
			priority: 1,
			juggle: 0
		},

		'KR32/Attack0003': {
			x: 15, y: -3, w: 55, h: 50,
			damage: 2,
			knockback: 0.3,
			priority: 1,
			juggle: 0
		},

		'KR32/Attack0004': {
			x: 15, y: -3, w: 55, h: 50,
			damage: 2,
			knockback: 0.3,
			priority: 1,
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
