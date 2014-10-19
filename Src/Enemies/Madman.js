Enemy.prototype.types['Madman'] =  function() {

	this.body.setSize(67, 25, 0, 0);
	this.anchor.setTo(.5, 1);

    this.animations.add('idle', ['Madman0000'], 10, true, false);

    this.attackTimer = 0;
    this.weight = 800;

    this.rollTimer = 0;

	this.updateFunction = function() {

	};

	this.Vulnerable = function() {
		if(this.state === this.Rolling)
			return false;
		else
			return true;
	}

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

	this.Roll = function() {
		this.state = this.Rolling;

		if(frauki.body.center.x < this.body.center.x)
			this.body.velocity.x = -500;
		else
			this.body.velocity.x = 500;

		this.rollTimer = game.time.now + 700;
	}

	////////////////////////////////STATES////////////////////////////////////
	this.Idling = function() {
		this.PlayAnim('idle');

		if(this.body.center.y < frauki.body.y && this.body.center.x > frauki.body.center.x - 20 && this.body.center.x < frauki.body.center.x + 20 && !this.body.onFloor()) {
			this.Roll();
		}
	};

	this.Hurting = function() {
		this.PlayAnim('idle');

		if(game.time.now > this.hitTimer) {
			this.state = this.Idling;
		}
	};

	this.Rolling = function() {
		this.PlayAnim('idle');

		this.body.velocity.x = this.body.velocity.x;

		if(game.time.now > this.rollTimer) {
			this.state = this.Idling;
			this.body.velocity.x = 0;
		}
	};

};
