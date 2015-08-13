Enemy.prototype.types['HWK9'] =  function() {

	this.body.setSize(15, 56, 0, -72);
	this.anchor.setTo(.5, 1);

    this.animations.add('idle', ['HWK9/Stand0000'], 10, true, false);
    this.animations.add('flip', ['HWK9/Flip0000', 'HWK9/Flip0001', 'HWK9/Flip0002', 'HWK9/Flip0003', 'HWK9/Flip0004', 'HWK9/Flip0005'], 18, true, false);
    this.animations.add('windup', ['HWK9/AttackDash0000'], 18, false, false);
    this.animations.add('attack1', ['HWK9/AttackDash0001', 'HWK9/AttackDash0002'], 18, false, false);
    this.animations.add('block', ['HWK9/Block000'], 18, true, false);
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
    	this.timers.SetTimer('attack', 400);
    	this.body.velocity.x = 0;

    };

	////////////////////////////////STATES////////////////////////////////////
	this.Idling = function() {
		this.PlayAnim('idle');

		if(this.PlayerIsVisible()) {
			this.FacePlayer();

			if(frauki.Attacking()) {
				this.Dodge();
			}
		}
	};

	this.Windup = function() {
		this.PlayAnim('windup');

		this.body.velocity.y = 0;
		
		if(this.timers.TimerUp('attack')) {
			this.state = this.Slashing;
			this.timers.SetTimer('attack', 600);

			if(this.direction === 'left') {
	    		this.body.velocity.x = -700;
	    	} else {
	    		this.body.velocity.x = 700;
	    	}
		}

	};

	this.Slashing = function() {
		this.PlayAnim('attack1');

		this.body.velocity.y = 0;

		if(this.timers.TimerUp('attack')) {
			this.state = this.Idling;
			this.timers.SetTimer('attack', 500 + Math.random() * 1000);
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

	    	this.timers.SetTimer('flip_timer', 800);
		}
	};

	this.Flipping = function() {
		this.PlayAnim('flip');

		if(!frauki.body.onFloor()) {
			this.Attack();
		}

		if(this.timers.TimerUp('flip_timer') || this.body.onFloor()) {
			this.state = this.Idling;

			this.timers.SetTimer('dodge_timer', 1000);
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
			x: 18, y: -8, w: 10, h: 40,
			damage: 0,
			knockback: 0,
			priority: 1,
			juggle: 0
		},

		'HWK9/AttackDash0001': {
			x: 18, y: -8, w: 10, h: 40,
			damage: 0,
			knockback: 0,
			priority: 1,
			juggle: 0
		}

	};

};
