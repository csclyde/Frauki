Enemy.prototype.types['Gnome'] =  function() {

	this.body.setSize(13, 20, 0, 5);
	this.anchor.setTo(0.5);

    this.animations.add('idle', ['Gnome/gossip'], 10, false, false);
    this.animations.add('stuff', ['Goddess/Stand0000'], 10, false, false);

    this.energy = 1;
    this.baseStunDuration = 400;

	this.body.drag.x = 500;
	
	this.state = this.Idling;

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
	
	////////////////////////////////STATES////////////////////////////////////
	this.Idling = function() {
		this.PlayAnim('idle');

		this.SetDirection('right');
		//EnemyBehavior.FacePlayer(this);

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
