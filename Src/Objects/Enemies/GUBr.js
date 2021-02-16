Enemy.prototype.types['GUBr'] =  function() {

	this.body.setSize(16, 50, 0, 3);
	this.anchor.setTo(.5);

    this.animations.add('idle', ['GUBr/Stand0000'], 10, false, false);
    this.animations.add('walk', ['GUBr/Walk0000', 'GUBr/Walk0001', 'GUBr/Walk0002', 'GUBr/Walk0003'], 10, true, false);
    this.animations.add('attack', ['GUBr/Attack0000', 'GUBr/Attack0001', 'GUBr/Attack0002', 'GUBr/Attack0003', 'GUBr/Attack0004', 'GUBr/Attack0005'], 10, false, false);
    this.animations.add('hit', ['GUBr/Hit0000'], 10, false, false);
    this.animations.add('cower', ['GUBr/Cower0000', 'GUBr/Cower0001', 'GUBr/Cower0002', 'GUBr/Cower0003'], 16, true, false);

    this.energy = 2;
    this.baseStunDuration = 400;
    this.robotic = true;

    this.body.drag.x = 500;
    
	this.updateFunction = function() {

		if(this.body.onFloor() && this.animations.currentAnim.name === 'walk') {
			events.publish('play_sound', {name: 'GUBr_step', restart: false});
		} else {
			events.publish('stop_sound', {name: 'GUBr_step', restart: false});
		}
	};

	this.Act = function() {
        if(EnemyBehavior.Player.IsVisible(this)) {

			if(EnemyBehavior.Player.IsDangerous(this) || !this.CanAttack()) {
        		this.Flee();

        	} else if(EnemyBehavior.Player.IsVulnerable(this) && EnemyBehavior.Player.IsNear(this, 180) && this.CanAttack() && frauki.body.onFloor()) {
	            this.Attack();

	        } else if(this.state === this.Cowering && !EnemyBehavior.Player.IsNear(this, 180)) {
	        	this.Charge();

        	} else {
        		this.Cower();
        	}
        	
        } else {
            this.state = this.Idling;
            this.body.velocity.x = 0;
        }
    };

    this.LandHit = function() {
    	if(this.state === this.Cowering) {
    		this.timers.SetTimer('block_recoil', 200);
    	}
    };

	///////////////////////////////ACTIONS////////////////////////////////////
	this.Attack = function() {
		console.log(this.timers)
		if(!this.CanAttack()) {
			return;
		}

    	EnemyBehavior.FacePlayer(this);
    	this.state = this.Attacking;
		this.timers.SetTimer('attacking', game.rnd.between(450, 500));
		events.publish('play_sound', {name: 'GUBr_attack', restart: true});
		

    	if(this.direction === 'left') {
			this.body.velocity.x = -400;
		} else {
			this.body.velocity.x = 400;
		}
    };

    this.Flee = function() {
    	if(this.state !== this.Fleeing) {
			this.body.velocity.y = -150;
			events.publish('play_sound', {name: 'enemy_jump', restart: true});
			
			if(frauki.state === frauki.Hurting) {
				setTimeout(function() {
					events.publish('play_sound', {name: 'GUBr_laugh', restart: true});
				}, 400);
			}
    	}

    	this.timers.SetTimer('flee', 1500);
    	this.state = this.Fleeing;

		EnemyBehavior.FaceAwayFromPlayer(this);

    };

    this.Cower = function() {
		this.state = this.Cowering;
		
		if(this.timers.TimerUp('tremble_sound')) {
			events.publish('play_sound', {name: 'GUBr_tremble', restart: true});
			this.timers.SetTimer('tremble_sound', 5000);
		}

    	this.timers.SetTimer('cowering', 3000);
    };

    this.Charge = function() {
    	this.state = this.Charging;
    };

	////////////////////////////////STATES////////////////////////////////////
	this.Idling = function() {
		this.PlayAnim('idle');

		return true;
	};

	this.Fleeing = function() {
		this.PlayAnim('walk');

		//EnemyBehavior.FaceAwayFromPlayer(this);

		if(EnemyBehavior.Player.IsLeft(this)) {
			this.body.velocity.x = 250;
		} else if(EnemyBehavior.Player.IsRight(this)) {
			this.body.velocity.x = -250;
		}


		if(this.body.onWall()) {
			if(EnemyBehavior.Player.IsNear(this, 180) && this.CanAttack()) {
				this.Attack();
			} else {
				this.Cower();
			}
		}

		EnemyBehavior.FaceForward(this);

		if(this.timers.TimerUp('flee')) {
			return true;
		} else {
			return false;
		}
	};

	this.Cowering = function() {
		this.PlayAnim('cower');

		EnemyBehavior.FacePlayer(this);

		if(EnemyBehavior.Player.IsNear(this, 190) && this.CanAttack()) {
			this.Attack();
		}

		if(this.timers.TimerUp('cowering')) {
			return true;
		} else {
			return false;
		}
	};

	this.Charging = function() {
		this.PlayAnim('walk');

		EnemyBehavior.FacePlayer(this);

		if(this.direction === 'left') {
			this.body.velocity.x = -200;
		} else if(this.direction === 'right') {
			this.body.velocity.x = 200;
		}

		if(this.body.onWall() || EnemyBehavior.Player.IsNear(this, 120)) {
			return true;
		} else {
			return false;
		}
	};

	this.Attacking = function() {
		this.PlayAnim('attack');

		if(this.timers.TimerUp('attacking')) {
    		this.SetAttackTimer(1600);
    		return true;
		} else {
			return false;
		}
	};

	this.Hurting = function() {
		this.PlayAnim('hit');

		if(this.timers.TimerUp('hit')) {
			this.state = this.Idling;

			this.Flee();

			return true;
		}

		return false;
	};

	this.attackFrames = {

		'GUBr/Attack0003': {
			x: 26, y: 20, w: 50, h: 12,
			damage: 2,
			knockback: 0,
			priority: 1,
			juggle: 0
		}

	};

};
