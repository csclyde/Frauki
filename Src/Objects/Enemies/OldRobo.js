Enemy.prototype.types['OldRobo'] =  function() {
	oldrobo = this;

	this.body.setSize(40, 60, 0, 0);
	this.anchor.setTo(0.5);

    this.animations.add('idle', ['NPC/OldRobo0000'], 2, true, false);
    this.animations.add('stuff', ['NPC/OldRobo0000'], 10, false, false);

	this.energy = 1;
	
	this.Vulnerable = function() { return false; }	

	this.updateFunction = function() {

	};

	this.Act = function() {
        this.state = this.Idling;
        this.body.velocity.x = 0;
    };

    this.OnHit = function() {
    	
    };

    this.Reset = function() {
    	
    };

	///////////////////////////////ACTIONS////////////////////////////////////
	this.GetSpeech = function() {
		return "Whoa whoa whoa, you're coming in pretty hot. Chill...";
	};

	this.GetPortrait = function() {
		return null;
	};

	////////////////////////////////STATES////////////////////////////////////
	this.Idling = function() {
		this.PlayAnim('idle');	

		this.SetDirection('right');

		return true;
	};

	this.Hurting = function() {
		this.PlayAnim('hit');

		if(this.timers.TimerUp('hit')) {
			this.state = this.Idling;
			return true;
		}

		return false;
	};



	this.attackFrames = {

	};

};
