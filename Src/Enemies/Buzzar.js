Enemy.prototype.types['Buzzar'] =  function() {

	this.body.setSize(11, 27, 0, 0);

    this.animations.add('idle', ['Sting0000'], 10, true, false);
    this.animations.add('sting', ['Sting0001', 'Sting0002'], 10, false, false);

    this.body.allowGravity = false;

    this.wanderDirection = 'left';

    this.hitVel = 0;

    this.targetX = null;
    this.targetY = null;

	this.updateFunction = function() {
		
	};

	///////////////////////////////ACTIONS////////////////////////////////////
	this.Sting = function() {
		game.physics.arcade.moveToXY(this, frauki.body.x, frauki.body.y, 400);

		this.targetX = frauki.body.x;
		this.targetY = frauki.body.y;

		this.state = this.Stinging;
	};

	this.ChangeDirection = function() {
		var dir = Math.random() * 4;

	    if(dir <= 1)
	    	this.wanderDirection = 'left';
	    else if(dir <= 2)
	    	this.wanderDirection = 'up';
	    else if(dir <= 3)
	    	this.wanderDirection = 'right';
	    else if(dir <= 4)
	    	this.wanderDirection = 'down';
	};

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
	    this.alpha = 0.2;

	    this.state = this.Hurting;
	};

	////////////////////////////////STATES////////////////////////////////////
	this.Idling = function() {
		this.PlayAnim('idle');
		
		this.body.velocity.y = Math.sin(game.time.now / 150) * 100 + (Math.random() * 40 - 20);
		this.body.velocity.x = Math.sin(game.time.now / 1000) * 20;


		switch(this.wanderDirection) {
			case 'left': this.body.velocity.x -= 30; break;
			case 'up':   this.body.velocity.y -= 30; break;
			case 'right': this.body.velocity.x += 30; break;
			case 'down': this.body.velocity.y += 30; break;
		}

		if(Math.floor(Math.random() * 100) == 1 && this.PlayerIsVisible()) 
			this.Sting();

		if(this.body.onFloor() || this.body.onWall())
			this.ChangeDirection();

		if(this.body.velocity.x <= 0)
			this.SetDirection('right');
		else
			this.SetDirection('left');
	};

	this.Stinging = function() {
		this.PlayAnim('sting');

		if(this.body.onFloor() || this.body.onWall())
			this.state = this.Idling;

		if(game.physics.arcade.distanceToXY(this.targetX, this.targetY) < 5)
			this.state = this.Idling;

		game.physics.arcade.overlap(this, frauki, function() {
			this.state = this.Idling;
		}, null, this);
	};

	this.Hurting = function() {

		if(game.time.now > this.hitTimer) {
			this.state = this.Idling;
			this.alpha = 1.0;
		}
        	
	};

};