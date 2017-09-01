Enemy.prototype.types['SW8T'] =  function() {

	this.body.setSize(22, 65, 0, -4);
	this.anchor.setTo(.5);

    this.animations.add('idle', ['SW8T/Idle0000', 'SW8T/Idle0001', 'SW8T/Idle0002', 'SW8T/Idle0003'], 8, true, false);
    this.animations.add('walk', ['SW8T/Run0000', 'SW8T/Run0001', 'SW8T/Run0002', 'SW8T/Run0003', 'SW8T/Run0004', 'SW8T/Run0005', 'SW8T/Run0006'], 10, true, false);
    this.animations.add('hurt', ['SW8T/Hurt0001', 'SW8T/Hurt0002'], 10, true, false);
    this.animations.add('shoot_start', ['SW8T/Shoot0001', 'SW8T/Shoot0002'], 10, false, false);
    this.animations.add('shoot', ['SW8T/Shoot0003', 'SW8T/Shoot0004', 'SW8T/Shoot0005', 'SW8T/Shoot0006', 'SW8T/Shoot0007', 'SW8T/Shoot0008', 'SW8T/Shoot0008', 'SW8T/Shoot0008', 'SW8T/Shoot0008'], 14, true, false);
    this.animations.add('block_start', ['SW8T/Block0001', 'SW8T/Block0002', 'SW8T/Block0003'], 10, false, false);
    this.animations.add('block', ['SW8T/Block0004', 'SW8T/Block0005'], 10, true, false);
    
    this.animations.add('jump_start_in', ['SW8T/JumpIn0001'], 10, false, false);
    this.animations.add('jump_rise_in', ['SW8T/JumpIn0002'], 10, false, false);
    this.animations.add('jump_fall_in', ['SW8T/JumpIn0003'], 10, false, false);
    this.animations.add('jump_land_in', ['SW8T/JumpIn0004', 'SW8T/JumpIn0005'], 16, false, false);

    this.animations.add('jump_start_out', ['SW8T/JumpOut0001'], 10, false, false);
    this.animations.add('jump_rise_out', ['SW8T/JumpOut0002'], 10, false, false);
    this.animations.add('jump_fall_out', ['SW8T/JumpOut0003'], 10, false, false);
    this.animations.add('jump_land_out', ['SW8T/JumpOut0004', 'SW8T/JumpOut0005'], 16, false, false);

    this.energy = 5;
    this.baseStunDuration = 400;

    this.body.bounce.y = 0;

    this.robotic = true;
    
	this.updateFunction = function() {

	};

	this.Act = function() {

        if(EnemyBehavior.Player.IsVisible(this)) {
        	//this.Jump();

        	if(this.timers.TimerUp('block_wait')) {
        		this.Block();
        	} else {
        		this.state = this.Walking;
        	}
        	
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
   	this.Shoot = function() {
   		this.state = this.ShootingStart;
   	};

   	this.Block = function() {
   		this.state = this.BlockingStart;
   		EnemyBehavior.FacePlayer(this);
   	};

   	this.Jump = function() {
   		this.state = this.Jumping;
   		EnemyBehavior.FacePlayer(this);

   		EnemyBehavior.JumpToPoint(this, frauki.body.center.x, frauki.body.center.y, 0.5);
   	}

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

	this.ShootingStart = function() {
		this.PlayAnim('shoot_start');

		if(this.animations.currentAnim.isFinished) {
			this.state = this.Shooting;
			this.timers.SetTimer('shooting', 3000);
		}
	};

	this.Shooting = function() {
		this.PlayAnim('shoot');

		if(this.timers.TimerUp('shooting')) {
			this.timers.SetTimer('attack_wait', game.rnd.between(600, 1000));

			return true;
		}

		return false;
	};

	this.BlockingStart = function() {
		this.PlayAnim('block_start');

		if(this.animations.currentAnim.isFinished) {
			this.state = this.Blocking;
			this.timers.SetTimer('blocking', 3000);
		}
	}

	this.Blocking = function() {
		this.PlayAnim('block');

		EnemyBehavior.FacePlayer(this);

		if(this.timers.TimerUp('blocking')) {
			this.timers.SetTimer('block_wait', game.rnd.between(600, 1000));

			return true;
		}

		return false;

	};

	this.Jumping = function() {
		var dir = '';

		//if they are moving the direction they are facing
		if((this.direction === 'left' && this.body.velocity.x < 0) || (this.direction === 'right' && this.body.velocity.x > 0)) {
			dir = 'in';
		} else {
			dir = 'out';
		}

		if(this.body.velocity.y < 0) {
			this.PlayAnim('jump_rise_' + dir);
		} else if(this.body.velocity.y > 0) {
			this.PlayAnim('jump_fall_' + dir);
		} else if(this.body.onFloor()) {
			this.PlayAnim('jump_land_' + dir);
		}

		if(this.body.onFloor() && this.animations.currentAnim.isFinished) {
			return true;
		} else {
			return false;
		}
	};

	this.Hurting = function() {
		this.PlayAnim('hurt');

		if(this.timers.TimerUp('hit') && this.body.onFloor()) {
			return true;
		}

		return false;
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
