Enemy.prototype.types['Fungu'] =  function() {

	this.body.setSize(25, 50, 0, 0);
	this.body.moves = false;
	this.anchor.setTo(0.5, 0.6);

    this.animations.add('idle', ['Misc/Fungu0000'], 10, true, false);
    this.animations.add('shoot', ['Misc/Fungu0001'], 10, true, false);
    this.animations.add('shit', ['Hop0000'], 10, true, false);

    this.energy = 1;

    this.damage = 1;
    this.shotCount = 0;
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
				EnemyBehavior.FaceAwayFromPlayer(this);
				projectileController.Spore(this);
				this.timers.SetTimer('shoot_anim', 300);
				events.publish('play_sound', {name: 'fungu_shoot'});
			}

			this.shotCount++;

			if(this.shotCount % 3 === 0) {
				this.timers.SetTimer('shoot', game.rnd.between(1200, 1800));
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
