Enemy.prototype.types['KR32'] =  function() {

	this.body.setSize(15, 60, 0, -68);
	this.anchor.setTo(.5, 1);

    this.animations.add('idle', ['KR32/Stand0000'], 10, true, false);
    this.animations.add('block', ['KR32/Block0000'], 10, true, false);
    this.animations.add('windup', ['KR32/Attack0000'], 5,  false, false);
    this.animations.add('attack', ['KR32/Attack0001', 'KR32/Attack0002', 'KR32/Attack0003', 'KR32/Attack0004', 'KR32/Attack0005', 'KR32/Attack0006', 'KR32/Attack0007', 'KR32/Attack0008'], 18, false, false);

    /*
    this.weight = 0.5;
    this.energy = 5;
    this.damage = 5;
    this.baseStunDuration = 500;
    this.poise = 10;
    */
    
	this.updateFunction = function() {

	};

	Enemy.prototype.CanCauseDamage = function() { return false; }
	Enemy.prototype.CanChangeDirection = function() { return false; }

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
    	if(!this.timers.TimerUp('attack')) {
    		return;
    	}

    	this.state = this.Windup;

    	this.timers.SetTimer('attack', 1000);
    };

	////////////////////////////////STATES////////////////////////////////////
	this.Idling = function() {
		this.PlayAnim('idle');

		if(this.PlayerIsVisible()) {
			this.state = this.Blocking;
		}
	};

	this.Blocking = function() {
		this.PlayAnim('block');

		if(frauki.body.center.x < this.body.center.x) {
			this.SetDirection('left');
		} else {
			this.SetDirection('right');
		}

		if(!this.PlayerIsVisible()) {
			this.state = this.Idling;
		}

		if(this.PlayerDistance() < 60) {
			this.Attack();
		}

	};

	this.Windup = function() {
		this.PlayAnim('windup');

		if(this.animations.currentAnim.isFinished) {
			this.state = this.Attacking;
		}
	}

	this.Attacking = function() {
		this.PlayAnim('attack');

		if(this.animations.currentAnim.isFinished) {
			this.state = this.Blocking;
		}
	}

	this.Hurting = function() {
		this.PlayAnim('die');

		if(this.timers.TimerUp('hit')) {
			this.state = this.Idling;
		}
	};

};
