Enemy.prototype.types['HWK9'] =  function() {

	this.body.setSize(15, 56, 0, -72);
	this.anchor.setTo(.5, 1);

    this.animations.add('idle', ['HWK9/Stand0000'], 10, true, false);
    this.animations.add('flip', ['HWK9/Flip0000', 'HWK9/Flip0001', 'HWK9/Flip0002', 'HWK9/Flip0003', 'HWK9/Flip0004', 'HWK9/Flip0005'], 18, true, false);
    this.animations.add('windup', ['HWK9/AttackDash0000'], 18, false, false);
    this.animations.add('attack1', ['HWK9/AttackDash0001', 'HWK9/AttackDash0002'], 18, false, false);
    this.animations.add('block', ['HWK9/Block0000'], 18, true, false);
    this.animations.add('hurt', ['HWK9/Stand0000'], 8, true, false);

    this.energy = 7;
    this.baseStunDuration = 500;


    /*
    this.weight = 0.8;
    this.damage = 5;
    */

    this.body.drag.x = 300;
    this.body.bounce.y = 0;
    
	this.updateFunction = function() {

	};

	this.CanCauseDamage = function() { return false; }
	this.CanChangeDirection = function() { return false; }
	this.Vulnerable = function() {
		if(this.state === this.Flipping) {
			return false;
		} else {
			return true;
		} 
	}


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

    this.Dodge = function() {
    	if(!this.timers.TimerUp('dodge_timer')) {
    		return;
    	}

    	this.state = this.PreFlipping;

    	this.timers.SetTimer('flip_timer', 100);
    };

    this.Attack = function() {
    	if(!this.timers.TimerUp('attack')) {
    		return;
    	}

    	this.state = this.Windup;
    	this.timers.SetTimer('attack', 0);
    	this.body.velocity.x = 0;

    };

    this.QuickAttack = function() {
    	if(!this.timers.TimerUp('attack')) {
    		return;
    	}

    	this.state = this.Windup;
    	this.timers.SetTimer('attack', 100);
    	this.body.velocity.x = 0;
    }

    this.Block = function() {
    	this.state = this.Blocking;
    	this.timers.SetTimer('block', 600);
    };

	////////////////////////////////STATES////////////////////////////////////
	this.Idling = function() {
		this.PlayAnim('idle');

		if(this.PlayerIsVisible()) {
			this.FacePlayer();

			if(this.PlayerDistance() < 120) {

				if(frauki.Attacking()) {
					this.Block();
				} else {
					this.Dodge();

				}
			}
		}
	};

	this.Windup = function() {
		this.PlayAnim('windup');

		this.body.velocity.y = 0;
		
		if(this.timers.TimerUp('attack')) {
			this.state = this.Slashing;
			this.timers.SetTimer('attack', 600);

			var attackVector = new Phaser.Point(frauki.body.x - this.body.x, frauki.body.y - this.body.y);
			attackVector = attackVector.normalize();

			attackVector.setMagnitude(600);

			this.body.velocity = attackVector;
		}

	};

	this.Slashing = function() {
		this.PlayAnim('attack1');

		this.body.allowGravity = false;

		if(this.timers.TimerUp('attack')) {
			this.state = this.Idling;
			this.timers.SetTimer('attack', 500 + Math.random() * 1000);
			this.body.allowGravity = true;
		}
	};

	this.Blocking = function() {
		this.PlayAnim('block');

		if(this.timers.TimerUp('block')) {

			this.QuickAttack();

		}
	};

	this.PreFlipping = function() {
		if(this.timers.TimerUp('flip_timer')) {
			this.body.velocity.y = -400;

	    	if(this.direction === 'left') {
	    		this.body.velocity.x = 400;
	    	} else {
	    		this.body.velocity.x = -400;
	    	}

	    	this.state = this.Flipping;

	    	this.timers.SetTimer('flip_timer', game.rnd.between(300, 1200));
		}
	};

	this.Flipping = function() {
		this.PlayAnim('flip');

		if(!frauki.body.onFloor()) {
			this.Attack();
		}

		if(this.timers.TimerUp('flip_timer') || this.body.onFloor()) {
			this.QuickAttack();

			this.timers.SetTimer('dodge_timer', game.rnd.between(2000, 4000));
		}
	};

	this.Hurting = function() {
		this.PlayAnim('hurt');

		if(this.timers.TimerUp('hit')) {
			this.state = this.Idling;
		}
	};

	this.attackFrames = {
		'HWK9/Block0000': {
			x: -4, y: 2, w: 32, h: 22,
			damage: 0,
			knockback: 0,
			priority: 1,
			juggle: 0
		},

		'HWK9/AttackDash0001': {
			x: 12, y: -30, w: 65, h: 100,
			damage: 5,
			knockback: 0,
			priority: 1,
			juggle: 0
		},

		'HWK9/AttackDash0002': {
			x: 25, y: -40, w: 40, h: 60,
			damage: 3,
			knockback: 0,
			priority: 1,
			juggle: 0
		}

	};

};
