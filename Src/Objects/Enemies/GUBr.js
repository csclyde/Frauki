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
    
	this.updateFunction = function() {

	};

	this.Act = function() {
        if(EnemyBehavior.Player.IsVisible(this)) {

        	if(EnemyBehavior.Player.IsNear(this, 60) && this.timers.TimerUp('attack_wait') && EnemyBehavior.Player.IsVulnerable(this) && !EnemyBehavior.Player.MovingTowards(this) && frauki.body.onFloor()) {
	            this.Attack();
            
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
	this.Attack = function() {
    	EnemyBehavior.FacePlayer(this);
    	this.state = this.Attacking;
    	this.timers.SetTimer('attacking', game.rnd.between(450, 500));
    };

	////////////////////////////////STATES////////////////////////////////////
	this.Idling = function() {
		this.PlayAnim('idle');

		return true;
	};

	this.Walking = function() {
		this.PlayAnim('walk');

		return true;
	};

	this.Attacking = function() {
		this.PlayAnim('attack');

		if(this.timers.TimerUp('attacking')) {
    		this.timers.SetTimer('attack_wait', 800);
			return true;
		} else {
			return false;
		}
	};

	this.Hurting = function() {
		this.PlayAnim('hit');

		if(this.timers.TimerUp('hit')) {
			this.state = this.Idling;

			return true;
		}

		return false;
	};

};
