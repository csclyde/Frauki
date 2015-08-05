Enemy.prototype.types['A3PZ'] =  function() {

	this.body.setSize(15, 50, 0, -72);
	this.anchor.setTo(.5, 1);

    this.animations.add('idle', ['A3PZ/Stand0000'], 10, true, false);
    this.animations.add('windup1', ['A3PZ/Attack0001', 'A3PZ/Attack0002'], 10, false, false);
    this.animations.add('attack1', ['A3PZ/Attack0003', 'A3PZ/Attack0004', 'A3PZ/Attack0005', 'A3PZ/Attack0006', 'A3PZ/Attack0007'], 18, false, false);
    this.animations.add('windup2', ['A3PZ/Attack0008', 'A3PZ/Attack0009'], 10, false, false);
    this.animations.add('attack2', ['A3PZ/Attack0010', 'A3PZ/Attack0011', 'A3PZ/Attack0012', 'A3PZ/Attack0013', 'A3PZ/Attack0014'], 18, false, false);
    this.animations.add('hurt', ['A3PZ/Stand0000'], 8, true, false);

    this.energy = 3;
    this.baseStunDuration = 500;


    /*
    this.weight = 0.8;
    this.damage = 5;
    */

    this.body.drag.x = 800;
    
	this.updateFunction = function() {

	};

	this.CanCauseDamage = function() { return false; }
	this.CanChangeDirection = function() { return false; }
	this.Vulnerable = function() { 
		if(this.Attacking())
			return false;
		else 
			return true;
	};


	///////////////////////////////ACTIONS////////////////////////////////////

	this.TakeHit = function(power) {
		if(!this.timers.TimerUp('hit')) {
			return;
		}

	    this.timers.SetTimer('hit', 800);

	    this.state = this.Hurting;
	};

	this.Die = function() {
        this.state = this.Idling;
    };

    this.Attack = function() {
    	if(!this.timers.TimerUp('attack')) {
    		return;
    	}

    	this.state = this.Windup1;

    };

	////////////////////////////////STATES////////////////////////////////////
	this.Idling = function() {
		this.PlayAnim('idle');



		if(this.PlayerIsVisible()) {

			if(this.direction === 'left') {
				this.body.velocity.x = -75;
			} else {
				this.body.velocity.x = 75;
			}

			this.FacePlayer();

			if(this.PlayerDistance() < 200) {
				if(frauki.Attacking() && this.timers.TimerUp('attack')) {
					this.state = this.Slashing1;
				} else {
					this.Attack();
				}
			}

		}
	};

	this.Windup1 = function() {
		this.PlayAnim('windup1');

		if(this.animations.currentAnim.isFinished) {
			this.state = this.Slashing1;
			this.timers.SetTimer('slash_hold', 200);
		}
	};

	this.Slashing1 = function() {
		this.PlayAnim('attack1');

		if(this.direction === 'left') {
			this.body.velocity.x = -200;
		} else {
			this.body.velocity.x = 200;
		}

		if(this.animations.currentAnim.isFinished && this.timers.TimerUp('slash_hold')) {
			this.state = this.Windup2;
			//this.FacePlayer();
		}
	};

	this.Windup2 = function() {
		this.PlayAnim('windup2');

		if(this.animations.currentAnim.isFinished) {
			this.state = this.Slashing2;
			this.timers.SetTimer('slash_hold', 200);
		}
	};

	this.Slashing2 = function() {
		this.PlayAnim('attack2');

		if(this.direction === 'left') {
			this.body.velocity.x = -200;
		} else {
			this.body.velocity.x = 200;
		}

		if(this.animations.currentAnim.isFinished && this.timers.TimerUp('slash_hold')) {
			this.state = this.Idling;
			this.timers.SetTimer('attack', 500 + Math.random() * 500);
		}
	};

	this.Hurting = function() {
		this.PlayAnim('hurt');

		if(this.timers.TimerUp('hit')) {
			this.state = this.Idling;
		}
	};

	this.attackFrames = {
		'A3PZ/Attack0003': {
			x: 0, y: 7, w: 80, h: 20,
			damage: 2,
			knockback: 0,
			priority: 1,
			juggle: 0
		},

		'A3PZ/Attack0004': {
			x: 50, y: -15, w: 15, h: 40,
			damage: 2,
			knockback: 0,
			priority: 1,
			juggle: 0
		},

		'A3PZ/Attack0005': {
			x: 50, y: -15, w: 15, h: 40,
			damage: 1,
			knockback: 0,
			priority: 1,
			juggle: 0
		},

		'A3PZ/Attack0006': {
			x: 50, y: -15, w: 15, h: 40,
			damage: 1,
			knockback: 0,
			priority: 1,
			juggle: 0
		},

		'A3PZ/Attack0010': {
			x: 20, y: -20, w: 50, h: 75,
			damage: 2,
			knockback: 0,
			priority: 1,
			juggle: 0
		},

		'A3PZ/Attack0011': {
			x: 18, y: 20, w: 20, h: 30,
			damage: 2,
			knockback: 0,
			priority: 1,
			juggle: 0
		},

		'A3PZ/Attack0012': {
			x: 18, y: 20, w: 20, h: 30,
			damage: 1,
			knockback: 0,
			priority: 1,
			juggle: 0
		},

		'A3PZ/Attack0012': {
			x: 18, y: 20, w: 20, h: 30,
			damage: 1,
			knockback: 0,
			priority: 1,
			juggle: 0
		}

	};

};
