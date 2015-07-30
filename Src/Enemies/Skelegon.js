Enemy.prototype.types['Skelegon'] =  function() {

	this.body.setSize(25, 60, 0, 0);
	this.anchor.setTo(.5, 1);

    this.animations.add('idle', ['Skelegon/Shamble0000', 'Skelegon/Shamble0001', 'Skelegon/Shamble0002', 'Skelegon/Shamble0003', 'Skelegon/Shamble0004', 'Skelegon/Shamble0005'], 16, true, false);
    this.animations.add('shit', ['Hop0000'], 10, true, false);

    this.damage = 3;
    this.energy = 2;

    Math.random() > 0.5 ? this.SetDirection('left') : this.SetDirection('right');

    /*
    this.weight = 0.5;
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

		this.body.maxVelocity.x = 80;

		if(this.direction === 'left') {
			this.body.acceleration.x = -300;

			if(this.body.touching.left) {
				this.SetDirection('right');
			}
		} else if(this.direction === 'right') {
			this.body.acceleration.x = 300;

			if(this.body.touching.right) {
				this.SetDirection('left');
			}
		}
		
	};

	this.Hurting = function() {
		this.PlayAnim('die');

		if(this.timers.TimerUp('hit')) {
			this.energy = this.maxEnergy;
			this.state = this.Idling;
		}
	};

};
