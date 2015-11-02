Enemy.prototype.types['Fungu'] =  function() {

	this.body.setSize(25, 50, 0, 0);
	this.body.moves = false;
	this.anchor.setTo(0.5, 1);

    this.animations.add('idle', ['Fungu/Fungu0000'], 10, true, false);
    this.animations.add('shit', ['Hop0000'], 10, true, false);

    this.energy = 1.5;

    this.damage = 1;
    /*
    this.weight = 0.5;
    this.baseStunDuration = 500;
    this.poise = 10;
    */
    
	this.updateFunction = function() {

	};

	this.CanCauseDamage = function() { return false; }

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

	////////////////////////////////STATES////////////////////////////////////
	this.Idling = function() {
		this.PlayAnim('idle');

		this.body.velocity.x = 0;
		this.body.velocity.y = 0;

		if(this.timers.TimerUp('shoot')) {
			if(this.PlayerIsVisible()) {
				projectileController.Spore(this);
			}

			this.timers.SetTimer('shoot', 700);
		}
	};

	this.Hurting = function() {
		this.PlayAnim('die');

		if(this.timers.TimerUp('hit')) {
			this.state = this.Idling;
		}
	};

};
