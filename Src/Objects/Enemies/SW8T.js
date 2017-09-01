Enemy.prototype.types['SW8T'] =  function() {

	this.body.setSize(22, 65, 0, -4);
	this.anchor.setTo(.5);

    this.animations.add('idle', ['SW8T/Idle0000', 'SW8T/Idle0001', 'SW8T/Idle0002', 'SW8T/Idle0003'], 8, true, false);
    this.animations.add('walk', ['SW8T/Run0000', 'SW8T/Run0001', 'SW8T/Run0002', 'SW8T/Run0003', 'SW8T/Run0004', 'SW8T/Run0005', 'SW8T/Run0006'], 10, true, false);

    this.energy = 5;
    this.baseStunDuration = 400;

    this.body.bounce.y = 0;

    this.robotic = true;
    
	this.updateFunction = function() {

	};

	this.Act = function() {

        if(EnemyBehavior.Player.IsVisible(this)) {
        	this.state = this.Walking;
        	
        } else {
            this.state = this.Idling;
            this.body.velocity.x = 0;
        }
    };

    this.LandHit = function() {
    	if(this.state === this.Blocking) {
    		this.timers.SetTimer('block_recoil', 200);
    	}
    };

	///////////////////////////////ACTIONS////////////////////////////////////
   

	////////////////////////////////STATES////////////////////////////////////
	this.Idling = function() {
		this.PlayAnim('idle');

		return true;
	};

	this.Walking = function() {
		this.PlayAnim('walk');

		EnemyBehavior.FacePlayer(this);

		return true;
	};

	this.Blocking = function() {

		return true;

	};

	

	this.attackFrames = {

		'KR32/Stab0001': {
			x: 0, y: 12, w: 90, h: 10,
			damage: 1,
			knockback: 0.2,
			priority: 3,
			juggle: 0
		}

	};

};
