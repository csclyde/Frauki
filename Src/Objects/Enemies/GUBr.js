Enemy.prototype.types['GUBr'] =  function() {

	console.log('gubr')

	this.body.setSize(16, 50, 0, 0);
	this.anchor.setTo(.5);

    this.animations.add('idle', ['GUBr/Stand0000'], 10, false, false);
    this.animations.add('walk', ['GUBr/Walk0000', 'GUBr/Walk0001', 'GUBr/Walk0002', 'GUBr/Walk0003'], 10, true, false);
    this.animations.add('attack', ['GUBr/Attack0000', 'GUBr/Attack0001', 'GUBr/Attack0002', 'GUBr/Attack0003', 'GUBr/Attack0004', 'GUBr/Attack0005'], 10, false, false);
    this.animations.add('hit', ['GUBr/Hit0000'], 10, false, false);

    this.energy = 2;
    /*
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
