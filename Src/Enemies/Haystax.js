Enemy.prototype.types['Haystax'] =  function() {

	this.body.setSize(67, 25, 0, 0);
	this.anchor.setTo(.5, 1);

    this.animations.add('idle', ['Haystax/Idle0000'], 10, true, false);
    this.animations.add('up', ['Haystax/Idle0001'], 10, true, false);

    this.weight = 1;
    this.energy = 4;
    this.damage = 3;
    this.baseStunDuration = 500;
    this.poise = 20;
    
	this.updateFunction = function() {

	};

	this.Vulnerable = function() { 
		if(this.state === this.Idling)
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

	this.Spit = function() {
		this.timers.SetTimer('spit', 1000 + (Math.random() * 3000));
		this.state = this.PoppedUp;

		projectileController.Tarball(this);
	};

	////////////////////////////////STATES////////////////////////////////////
	this.Idling = function() {
		this.PlayAnim('idle');

		if(!this.PlayerIsNear(50) && this.PlayerIsNear(1000) && this.timers.TimerUp('spit_wait')) {
			this.Spit();
		}
		
	};

	this.PoppedUp = function() {
		this.PlayAnim('up');

		if(this.timers.TimerUp('spit')) {
			this.state = this.Idling;
			this.timers.SetTimer('spit_wait', 1000 + (Math.random() * 3000));
		}
	};

	this.Hurting = function() {
		this.PlayAnim('die');

		if(this.timers.TimerUp('hit')) {
			this.state = this.Idling;
		}
	};

};
