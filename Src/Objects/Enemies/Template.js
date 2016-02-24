Enemy.prototype.types[''] =  function() {

	this.body.setSize(67, 25, 0, 0);
	this.anchor.setTo(.5, 1);

    this.animations.add('idle', ['Hop0000'], 10, true, false);
    this.animations.add('shit', ['Hop0000'], 10, true, false);

    /*
    this.energy = 5;
    this.damage = 5;
    this.baseStunDuration = 500;
    this.poise = 10;
    */
    
	this.updateFunction = function() {

	};

	///////////////////////////////ACTIONS////////////////////////////////////

	////////////////////////////////STATES////////////////////////////////////
	this.Idling = function() {
		this.PlayAnim('idle');

		
	};

	this.Hurting = function() {
		this.PlayAnim('die');

		if(this.timers.TimerUp('hit')) {
			this.state = this.Idling;
		}
	};

};
