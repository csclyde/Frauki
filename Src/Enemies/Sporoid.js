Enemy.prototype.types['Sporoid'] =  function() {

	this.body.setSize(11, 27, 0, 0);

    this.animations.add('idle', ['Sporoid0000'], 10, true, false);

    this.body.allowGravity = false;
    this.body.bounce.set(0.3);

	this.updateFunction = function() {
		if(this.body.velocity.x <= 0)
			this.SetDirection('right');
		else
			this.SetDirection('left');

		
	};

	///////////////////////////////ACTIONS////////////////////////////////////
	this.TakeHit = function(power) {
		if(game.time.now < this.hitTimer) {
			return;
		}
    
	    //compute the velocity based on weight and attack knockback
	    this.body.velocity.y = -150 + this.weight;

	    var c = frauki.body.x < this.body.x ? 1 : -1;
	    this.body.velocity.x =  c * ((80 + (this.weight / 2)) * (frauki.currentAttack.knockback));

	    //a durability stat should modify how long they are stunned for. also, the amount of dmg
	    this.hitTimer = game.time.now + 300;

	    this.state = this.Hurting;
	};

	this.Reset = function() {
		this.state = this.Idling;
	};

	////////////////////////////////STATES////////////////////////////////////
	this.Idling = function() {
		this.PlayAnim('idle');
		
		this.body.velocity.y = Math.sin(game.time.now / 300) * 50 + (Math.random() * 40 - 20);
		this.body.velocity.x = Math.sin(game.time.now / 1000) * 20;


		switch(this.wanderDirection) {
			case 'left': this.body.velocity.x -= 30; break;
			case 'up':   this.body.velocity.y -= 30; break;
			case 'right': this.body.velocity.x += 30; break;
			case 'down': this.body.velocity.y += 30; break;
		}


	};

	this.Hurting = function() {
		if(game.time.now > this.hitTimer) {
			this.state = this.Idling;
		}
	};

};