Enemy.prototype.types['Madman'] =  function() {

	this.body.setSize(67, 25, 0, 0);
	this.anchor.setTo(.5, 1);

    this.animations.add('idle', ['Hop0000'], 10, true, false);

    this.attackTimer = 0;
    this.weight = 800;

	this.updateFunction = function() {

	};

	///////////////////////////////ACTIONS////////////////////////////////////

	this.TakeHit = function(power) {
		if(game.time.now < this.hitTimer)
        	return;
    
	    //compute the velocity based on weight and attack knockback
	    this.body.velocity.y = -400 - this.weight;

	    //a durability stat should modify how long they are stunned for. also, the amount of dmg
	    this.hitTimer = game.time.now + 400;

	    this.state = this.Hurting;
	};

	////////////////////////////////STATES////////////////////////////////////
	this.Idling = function() {
		this.PlayAnim('idle');

		
	};

	this.Hurting = function() {
		this.PlayAnim('die');

		if(game.time.now > this.hitTimer) {
			this.state = this.Idling;
		}
	};

};
