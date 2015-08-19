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

    this.body.drag.x = 1000;
    this.body.bounce.y = 0;
    
	this.updateFunction = function() {

		if(this.state !== this.Slashing && !this.body.allowGravity) {
			this.body.allowGravity = true;
		}
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

    	this.state = this.Flipping;

    	this.timers.SetTimer('flip_timer', game.rnd.between(500, 800));

    	this.body.velocity.y = -450;

    	if(this.direction === 'left') {
    		this.body.velocity.x = 400;
    	} else {
    		this.body.velocity.x = -400;
    	}
    };

    this.Attack = function() {
    	if(!this.timers.TimerUp('attack')) {
    		return;
    	}

    	this.state = this.Windup;
    	this.timers.SetTimer('attack', 300);
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
    	this.timers.SetTimer('block', game.rnd.between(600, 1200));
    };

	////////////////////////////////STATES////////////////////////////////////
	this.Idling = function() {
		this.PlayAnim('idle');

		if(this.PlayerIsVisible()) {
			this.FacePlayer();

			if(this.PlayerDistance() < 120) {

				if(frauki.Attacking() || !this.timers.TimerUp('dodge_timer')) {
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

			attackVector.setMagnitude(800);

			this.body.velocity = attackVector;

			this.FacePlayer();
		}

	};

	this.Slashing = function() {
		this.PlayAnim('attack1');

		this.body.allowGravity = false;

		if(this.timers.TimerUp('attack')) {
			this.state = this.Idling;
			this.timers.SetTimer('attack', 1000 + Math.random() * 1000);
			this.body.allowGravity = true;
		}
	};

	this.Blocking = function() {
		this.PlayAnim('block');

		this.FacePlayer();

		if(frauki.state === frauki.AttackStab || frauki.state === frauki.AttackDiveCharge) {
			this.Dodge();
		}

		if(this.timers.TimerUp('block')) {

			if(this.PlayerDistance() < 120) {
				this.Dodge();
			} else if(this.PlayerDistance() > 120) {
				this.QuickAttack();
			}

		}
	};

	this.Flipping = function() {
		this.PlayAnim('flip');

		if(this.body.onFloor()) {

			this.timers.SetTimer('dodge_timer', game.rnd.between(800, 2000));
			this.state = this.Idling;
		}

		if(this.timers.TimerUp('flip_timer')) {
			this.Attack();

			this.timers.SetTimer('dodge_timer', game.rnd.between(800, 2000));
		}
	};

	this.Hurting = function() {
		this.PlayAnim('hurt');

		if(this.timers.TimerUp('hit')) {
			if(this.timers.TimerUp('dodge_timer')) {
				this.Dodge();
			} else {
				this.Block();
			}
		}
	};

	this.attackFrames = {
		'HWK9/Block0000': {
			x: -4, y: 2, w: 32, h: 32,
			damage: 0,
			knockback: 0,
			priority: 1,
			juggle: 0
		},

		'HWK9/AttackDash0001': {
			x: 12, y: -30, w: 65, h: 100,
			damage: 5,
			knockback: 0,
			priority: 2,
			juggle: 0
		},

		'HWK9/AttackDash0002': {
			x: 12, y: -30, w: 65, h: 100,
			damage: 5,
			knockback: 0,
			priority: 2,
			juggle: 0
		},

		'HWK9/AttackDash0003': {
			x: 25, y: -40, w: 40, h: 60,
			damage: 3,
			knockback: 0,
			priority: 1,
			juggle: 0
		}

	};

};
