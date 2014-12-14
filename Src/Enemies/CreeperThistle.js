Enemy.prototype.types['CreeperThistle'] =  function() {

	this.body.setSize(30, 25, 0, 0);
	this.anchor.setTo(.5, 1);

    this.animations.add('idle', ["CreeperThistle/CreeperThistle0000"], 10, true, false);
    this.animations.add('shit', ["CreeperThistle/CreeperThistle0000"], 10, true, false);

    this.energy = 1;
    this.body.immovable = true;
    this.body.allowGravity = false;

    this.state = this.Idling;

	this.updateFunction = function() {
		if(this.clingWall == 'above') {
			this.scale.y = -1;
		} else if(this.clingWall == 'left') {
			this.rotation = 90;
			this.body.setSize(25, 30);
		} else if(this.clingWall == 'right') {
			this.rotation = 270;
			this.body.setSize(25, 30);
		}
	};

	///////////////////////////////ACTIONS////////////////////////////////////

	this.TakeHit = function(power) {
		if(!this.timers.TimerUp('hit')) {
			return;
		}

	    this.timers.SetTimer('hit', 800);

	    this.state = this.Hurting;
	};

	////////////////////////////////STATES////////////////////////////////////
	this.Idling = function() {
		this.PlayAnim('idle');
	};

	this.Hurting = function() {
		this.PlayAnim('idle');

		if(this.timers.TimerUp('hit')) {
			this.state = this.Idling;
		}
	};

};
