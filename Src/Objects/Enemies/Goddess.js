var goddess = null;

Enemy.prototype.types['Goddess'] =  function() {

	goddess = this;

	this.body.setSize(25, 80, 0, 0);
	this.anchor.setTo(.5);

    this.animations.add('idle', ['Goddess/Goddess0000'], 10, false, false);
    this.animations.add('stuff', ['Goddess/Stand0000'], 10, false, false);

    this.energy = 5;
    this.baseStunDuration = 400;


    this.body.drag.x = 500;
    
	this.updateFunction = function() {

	};

	this.Act = function() {
        this.state = this.Idling;
        this.body.velocity.x = 0;
    };

	///////////////////////////////ACTIONS////////////////////////////////////
	this.GetSpeech = function() {
		return 'Test!';
	};

	this.GetPortrait = function() {
		return 'Neutral';
	};

	////////////////////////////////STATES////////////////////////////////////
	this.Idling = function() {
		this.PlayAnim('idle');

		EnemyBehavior.FacePlayer(this);

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
