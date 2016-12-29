Enemy.prototype.types['GUBr'] =  function() {

	this.body.setSize(16, 50, 0, 0);
	this.anchor.setTo(.5);

    this.animations.add('idle', ['GUBr/Stand0000'], 10, false, false);
    this.animations.add('walk', ['GUBr/Walk0000', 'GUBr/Walk0001', 'GUBr/Walk0002', 'GUBr/Walk0003'], 10, true, false);
    this.animations.add('attack', ['GUBr/Attack0000', 'GUBr/Attack0001', 'GUBr/Attack0002', 'GUBr/Attack0003', 'GUBr/Attack0004', 'GUBr/Attack0005'], 10, false, false);
    this.animations.add('hit', ['GUBr/Hit0000'], 10, false, false);

    this.energy = 2;
    this.baseStunDuration = 400;
    this.robotic = true;

    this.mode = 'cautious';
    
	this.updateFunction = function() {

	};

	this.Act = function() {
        if(EnemyBehavior.Player.IsVisible(this)) {

        	if(this.mode === 'scared') {
            	this.GetScared();
            } else if(this.mode === 'cautious') {
            	this.state = this.Idling;

            	if(EnemyBehavior.Player.IsDangerous(this)) {
            		this.mode = 'scared';
            	} else if(EnemyBehavior.Player.IsVulnerable(this)) {
            		this.mode = 'brave';
            	}
        	} else if(this.mode === 'brave') {
        		if(EnemyBehavior.Player.IsNear(this, 60) && this.timers.TimerUp('attack_wait') && EnemyBehavior.Player.IsVulnerable(this) && !EnemyBehavior.Player.MovingTowards(this) && frauki.body.onFloor()) {
	            	this.Attack();
        		} else {
            		this.state = this.Charge;
        		}
        		
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
	this.Attack = function() {
    	EnemyBehavior.FacePlayer(this);
    	this.state = this.Attacking;
    	this.timers.SetTimer('attacking', game.rnd.between(450, 500));
    };

    this.GetScared = function() {
    	if(this.state !== this.RunAway) {
    		this.body.velocity.y = -150;
    	}

    	this.timers.SetTimer('run_away', 2000);
    	this.state = this.RunAway;
    }

	////////////////////////////////STATES////////////////////////////////////
	this.Idling = function() {
		this.PlayAnim('idle');

		if(this.mode === 'cautious') {

		}

		return true;
	};

	this.RunAway = function() {
		this.PlayAnim('walk');

		EnemyBehavior.FaceAwayFromPlayer(this);

		if(this.direction === 'left') {
			this.body.velocity.x = -150;
		} else if(this.direction === 'right') {
			this.body.velocity.x = 150;
			
		}

		if(this.timers.TimerUp('run_away')) {
			this.mode = 'cautious';
			return true;
		} else {
			return false;
		}
	};

	this.Charge = function() {
		this.PlayAnim('walk');

		EnemyBehavior.FacePlayer(this);

		if(this.direction === 'left') {
			this.body.velocity.x = -150;
		} else if(this.direction === 'right') {
			this.body.velocity.x = 150;
			
		}

		return true;
	};

	this.Attacking = function() {
		this.PlayAnim('attack');

		if(this.timers.TimerUp('attacking')) {
    		this.timers.SetTimer('attack_wait', 800);
    		this.mode = 'scared';
			return true;
		} else {
			return false;
		}
	};

	this.Hurting = function() {
		this.PlayAnim('hit');

		if(this.timers.TimerUp('hit')) {
			this.state = this.Idling;

			this.mode = 'scared';

			return true;
		}

		return false;
	};

	this.attackFrames = {

		'GUBr/Attack0003': {
			x: 26, y: 20, w: 50, h: 12,
			damage: 1,
			knockback: 0,
			priority: 1,
			juggle: 0
		},

	};

};
