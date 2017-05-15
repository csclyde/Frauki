Enemy.prototype.types['QL0k'] =  function() {

	this.body.setSize(25, 50, 0, 0);
	this.body.moves = false;
	this.anchor.setTo(0.5, 0.75);

    this.animations.add('idle', ['QL0k/Shoot0000'], 10, true, false);
    this.animations.add('shoot', ['QL0k/Shoot0001', 'QL0k/Shoot0002', 'QL0k/Shoot0003', 'QL0k/Shoot0004', 'QL0k/Shoot0005'], 10, true, false);

    this.energy = 1;

    this.damage = 1;
    this.shotCount = 0;

    this.robotic = true;
    /*
    this.baseStunDuration = 500;
    this.poise = 10;
    */
    
	this.updateFunction = function() {

	};

	this.CanCauseDamage = function() { return false; }

	this.GetCurrentDamage = function() {
	    return 1;
	};

	///////////////////////////////ACTIONS////////////////////////////////////


	////////////////////////////////STATES////////////////////////////////////
	this.Idling = function() {
		if(this.timers.TimerUp('shoot_anim')) {
			this.PlayAnim('idle');
		} else {
			this.PlayAnim('shoot');
		}

		this.body.velocity.x = 0;
		this.body.velocity.y = 0;

		if(this.timers.TimerUp('shoot')) {

			
			if(EnemyBehavior.Player.IsVisible(this)) {
				projectileController.Spore(this);
				this.timers.SetTimer('shoot_anim', 300);
			}

			this.shotCount++;

			if(this.shotCount % 3 === 0) {
				this.timers.SetTimer('shoot', 1200);
			} else {
				this.timers.SetTimer('shoot', 500);
			}
		}
	};

	this.Hurting = function() {
		this.PlayAnim('die');

		if(this.timers.TimerUp('hit')) {
			this.state = this.Idling;
		}
	};

};
