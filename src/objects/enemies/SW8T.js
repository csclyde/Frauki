Enemy.prototype.types['SW8T'] =  function() {

	this.body.setSize(22, 64, 0, -4);
	this.anchor.setTo(.5);

    this.animations.add('idle', ['SW8T/Idle0000', 'SW8T/Idle0001', 'SW8T/Idle0002', 'SW8T/Idle0003'], 8, true, false);
    this.animations.add('walk', ['SW8T/Run0000', 'SW8T/Run0001', 'SW8T/Run0002', 'SW8T/Run0003', 'SW8T/Run0004', 'SW8T/Run0005', 'SW8T/Run0006'], 6, true, false);
    this.animations.add('hurt', ['SW8T/Hurt0000', 'SW8T/Hurt0001'], 12, true, false);
    this.animations.add('shoot_start', ['SW8T/Shoot0001', 'SW8T/Shoot0002'], 10, false, false);
    this.animations.add('shoot', ['SW8T/Shoot0003', 'SW8T/Shoot0004', 'SW8T/Shoot0005', 'SW8T/Shoot0006', 'SW8T/Shoot0007', 'SW8T/Shoot0008'], 14, false, false);
    this.animations.add('shoot_bolas', ['SW8T/Bolas0000', 'SW8T/Bolas0001', 'SW8T/Bolas0002', 'SW8T/Bolas0003', 'SW8T/Bolas0004', 'SW8T/Bolas0005'], 14, false, false);
    this.animations.add('block_start', ['SW8T/Block0001', 'SW8T/Block0002', 'SW8T/Block0003'], 22, false, false);
    this.animations.add('block', ['SW8T/Block0004', 'SW8T/Block0005'], 12, true, false);
    this.animations.add('swipe', ['SW8T/Swipe0001', 'SW8T/Swipe0002', 'SW8T/Swipe0003'], 10, false, false);
    
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
    this.damage = 7;

    this.body.bounce.y = 0;

    this.robotic = true;

    this.SHOOTING_SPEED = 800;
    this.hasShot = false;
    this.waitingForBolas = false;
    
	this.updateFunction = function() {

		if(this.state !== this.Blocking) {
			events.publish('stop_sound', {name: 'SW8T_shield', restart: false});
		}
	};

	this.Act = function() {

        if(EnemyBehavior.Player.IsVisible(this)) {
        	//this.Swipe();

        	//if the player is too close, swipe them
        	if(EnemyBehavior.Player.IsNear(this, 160) && frauki.body.onFloor()) {
        		if(!EnemyBehavior.Player.IsNear(this, 80) && this.timers.TimerUp('bolas_wait') && (EnemyBehavior.Player.IsVulnerable(this) || EnemyBehavior.Player.MovingAway(this))) {
        			this.Bolas();

        		} else if(EnemyBehavior.Player.IsNear(this, 80) && this.CanAttack() && EnemyBehavior.Player.IsVulnerable(this)) {
        			this.Swipe();

        		} else if(frauki.states.entangled && EnemyBehavior.Player.IsNear(this, 120) && !EnemyBehavior.Player.IsNear(this, 60)) {
        			this.JumpIn();
				
				} else if(this.timers.TimerUp('dodge_wait') && frauki.states.entangled && EnemyBehavior.Player.IsNear(this, 160)) {
        			this.JumpAway();
        		
        		} else {
        			this.Block();
        		}

			} 
			else if(EnemyBehavior.Player.IsNear(this, 160) && !EnemyBehavior.Player.IsNear(this, 80) && frauki.body.onFloor() && EnemyBehavior.Player.MovingAway(this) && this.timers.TimerUp('bolas_wait')) {
        		this.Bolas();

        	//if the player is trying to down slam, get out
			} 
			else if(EnemyBehavior.Player.IsAbove(this) && frauki.state === frauki.AttackDiveCharge) {
        		this.JumpAway();
			} 
			else if(frauki.states.entangled && !EnemyBehavior.Player.IsNear(this, 120)  && this.CanAttack()) {
     			this.Shoot();
			} 
			else if(EnemyBehavior.Player.IsNear(this, 160) || EnemyBehavior.Player.IsDangerous(this)) {
        		this.Block();
			} 
			else if(!EnemyBehavior.Player.IsNear(this, 160) && this.CanAttack()) { 
        		this.Shoot();
			} 
			else if(!EnemyBehavior.Player.IsNear(this, 160)) { 
        		this.state = this.Walking;
			} 
			else {
        		this.state = this.Idling;
        	}
        	
        } else {
            this.state = this.Idling;
            this.body.velocity.x = 0;
        }
    };

    this.LandHit = function() {
    	if(this.state === this.Blocking) {
    		this.timers.SetTimer('blocking', 500);
    	}

		events.publish('stop_sound', {name: 'SW8T_shield', restart: false});
		
    	this.numShots = 0;
	};
	
	this.OnHit = function() {
		events.publish('stop_sound', {name: 'SW8T_shield', restart: false});		
	};

	///////////////////////////////ACTIONS////////////////////////////////////
   	this.Shoot = function() {
   		this.state = this.ShootingStart;
   	};

   	this.Bolas = function() {
   		this.state = this.Bolasing;
   		EnemyBehavior.FacePlayer(this);
   	};

   	this.Walk = function() {
   		this.state = this.Walking;
   	};

   	this.Flee = function() {
   		this.state = this.Fleeing;
   	};

   	this.Block = function() {
   		if(this.state !== this.Blocking) {
   			this.state = this.BlockingStart;
   		}

   		EnemyBehavior.FacePlayer(this);
   	};

   	this.JumpIn = function() {
   		this.state = this.Jumping;
   		EnemyBehavior.FacePlayer(this);

		EnemyBehavior.JumpToPoint(this, frauki.body.center.x, frauki.body.center.y, 0.5);
		events.publish('play_sound', {name: 'SW8T_jump', restart: true});
		events.publish('stop_sound', {name: 'SW8T_shield', restart: false});		
		
   	};

   	this.JumpAway = function() {
   		this.state = this.Jumping;
   		EnemyBehavior.FacePlayer(this);

		events.publish('play_sound', {name: 'SW8T_jump', restart: true});
		events.publish('stop_sound', {name: 'SW8T_shield', restart: false});
		
		
   		this.body.velocity.y = -200;
		this.body.velocity.x = game.rnd.between(400, 550) * EnemyBehavior.Player.DirMod(this);
		
		this.timers.SetTimer('dodge_wait', 1000);		
	};
	   
	this.JumpIn = function() {
		this.state = this.Jumping;
		EnemyBehavior.FacePlayer(this);

		events.publish('play_sound', {name: 'SW8T_jump', restart: true});
		events.publish('stop_sound', {name: 'SW8T_shield', restart: false});
		
	 
		this.body.velocity.y = -200;
		this.body.velocity.x = game.rnd.between(400, 550) * EnemyBehavior.Player.DirMod(this) * -1;
	};   

   	this.Swipe = function() {
   		this.state = this.Swiping;
   		EnemyBehavior.FacePlayer(this);

		   this.timers.SetTimer('swipe_wait', 1000);
		   
		events.publish('play_sound', {name: 'SW8T_baton_attack', restart: true});
		events.publish('stop_sound', {name: 'SW8T_shield', restart: false});
		


   		if(this.direction === 'left') {
			this.body.velocity.x = -350;
		} else {
			this.body.velocity.x = 350;
		}
   	};

	////////////////////////////////STATES////////////////////////////////////
	this.Idling = function() {
		this.PlayAnim('idle');
		return true;
	};

	this.Walking = function() {
		this.PlayAnim('walk');

		if(this.animations.currentFrame.name === 'SW8T/Run0001' || this.animations.currentFrame.name === 'SW8T/Run0005') {
			events.publish('play_sound', {name: 'SW8T_step', restart: false});
		}

		EnemyBehavior.WalkToPlayer(this, 80);

		return true;
	};

	this.Fleeing = function() {
		this.PlayAnim('walk');

		EnemyBehavior.WalkAwayFromPlayer(this, 250);

		return true;
	};

	this.ShootingStart = function() {
		this.PlayAnim('shoot_start');

		if(this.animations.currentAnim.isFinished) {
			this.state = this.Shooting;
			this.timers.SetTimer('shoot_wait', this.SHOOTING_SPEED);
			this.numShots = game.rnd.between(3, 5);
			this.hasShot = false;
		}
	};

	this.Shooting = function() {
		this.PlayAnim('shoot');

		EnemyBehavior.FacePlayer(this);

		if(this.numShots > 0 && this.animations.currentFrame.name === 'SW8T/Shoot0005' && !this.hasShot) {
			projectileController.Mortar(this);
			events.publish('play_sound', {name: 'SW8T_mortar_shot', restart: false});
			this.hasShot = true;
		}

		if(EnemyBehavior.Player.IsNear(this, 80) && this.timers.TimerUp('shoot_wait')) {
			this.numShots = 0;
			return true;
		}

		if(this.numShots === 0) {
			this.SetAttackTimer(2000);
			return true;

		} else if(this.animations.currentAnim.isFinished && this.timers.TimerUp('shoot_wait')) {
			this.numShots--;
			this.timers.SetTimer('shoot_wait', this.SHOOTING_SPEED);
			this.animations.currentAnim.restart();
			this.hasShot = false;

			return false;
		}

		return false;
	};

	this.Bolasing = function() {
		this.PlayAnim('shoot_bolas');

		if(this.animations.currentAnim.isFinished) {

			if(this.timers.TimerUp('bolas_wait')) {
				projectileController.Bolas(this);
				events.publish('play_sound', {name: 'SW8T_bolas_shot', restart: false});

			}

			this.timers.SetTimer('bolas_wait', 5000);

			if(this.waitingForBolas) {
				return false;
			} else {
				return true;
			}
		}

		return false;
	};

	this.BlockingStart = function() {
		this.PlayAnim('block_start');

		if(this.animations.currentAnim.isFinished) {
			this.state = this.Blocking;
			this.timers.SetTimer('blocking', 500);
		}
	}

	this.Blocking = function() {
		this.PlayAnim('block');

		EnemyBehavior.FacePlayer(this);

		events.publish('play_sound', {name: 'SW8T_shield', restart: false});
		

		if(EnemyBehavior.Player.IsAbove(this) || frauki.states.entangled) {
			events.publish('stop_sound', {name: 'SW8T_shield' });
			return true;
		}

		if(this.timers.TimerUp('blocking')) {
			events.publish('stop_sound', {name: 'SW8T_shield' });
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

		if(this.body.onFloor()) {
			events.publish('play_sound', {name: 'SW8T_land', restart: false});
		}

		if(this.body.onFloor() && this.animations.currentAnim.isFinished) {
			return true;
		} 

		return false;
	};

	this.Swiping = function() {
		this.PlayAnim('swipe');

		if(this.timers.TimerUp('swipe_wait') && this.animations.currentAnim.isFinished) {
			this.SetAttackTimer(600);
			return true;
		}

		return false;
	};

	this.Hurting = function() {
		this.PlayAnim('hurt');

		if(this.timers.TimerUp('hit') && this.body.onFloor()) {
			return true;
		}

		return false;
	};

	

	this.attackFrames = {

		'SW8T/Block0004': {
			x: 28, y: -7, w: 20, h: 72,
			damage: 0,
			knockback: 0.2,
			priority: 4,
			juggle: 0,
			solid: false
		},

		'SW8T/Block0005': {
			x: 28, y: -7, w: 20, h: 72,
			damage: 0,
			knockback: 0.2,
			priority: 4,
			juggle: 0,
			solid: false
		},

		'SW8T/Swipe0002': {
			x: 10, y: 20, w: 55, h: 35,
			damage: 5,
			knockback: 0.2,
			priority: 1,
			juggle: 0
		}

	};

};
