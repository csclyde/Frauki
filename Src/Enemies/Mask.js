Enemy.prototype.types['Mask'] =  function() {

	this.body.setSize(67, 25, 0, 0);
	this.anchor.setTo(.5, 1);

    this.animations.add('idle', ['Mask/Mask0000'], 10, true, false);
    this.animations.add('shit', ['Hop0000'], 10, true, false);

    this.energy = 2;
    /*
    this.weight = 0.5;
    this.damage = 5;
    this.baseStunDuration = 500;
    this.poise = 10;
    */
    
	this.updateFunction = function() {

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
        this.anger = 1;
        this.state = this.Idling;
    };

	////////////////////////////////STATES////////////////////////////////////
	this.Idling = function() {
		this.PlayAnim('idle');

		if(this.PlayerIsVisible()) {
			this.body.maxVelocity.x = 300;
		} else {
			this.body.maxVelocity.x = 100;
		}

		if(this.direction === 'left') {
			this.body.acceleration.x = -500;

			if(this.body.touching.left) {
				this.SetDirection('right');
			}
		} else if(this.direction === 'right') {
			this.body.acceleration.x = 500;

			if(this.body.touching.right) {
				this.SetDirection('left');
			}
		}
	};

	this.Hurting = function() {
		this.PlayAnim('die');

		if(this.timers.TimerUp('hit')) {
			this.state = this.Idling;
		}
	};

};
