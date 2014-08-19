Enemy.prototype.types['Buzzar'] =  function() {

	this.body.setSize(11, 27, 0, 0);

    this.animations.add('idle', ['Sting0000'], 10, true, false);
    this.animations.add('sting', ['Sting0001', 'Sting0002'], 10, false, false);

    this.state = Idling;

    this.body.allowGravity = false;

    this.wanderDirection = 'left';

	this.updateFunction = function() {
		
	};

	///////////////////////////////ACTIONS////////////////////////////////////
	this.Sting = function() {

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

	////////////////////////////////STATES////////////////////////////////////
	function Idling() {
		this.PlayAnim('idle');
		
		this.body.velocity.y = Math.sin(game.time.now / 150) * 100 + (Math.random() * 40 - 20);
		this.body.velocity.x = Math.sin(game.time.now / 1000) * 20;


		switch(this.wanderDirection) {
			case 'left': this.body.velocity.x -= 30; break;
			case 'up':   this.body.velocity.y -= 30; break;
			case 'right': this.body.velocity.x += 30; break;
			case 'down': this.body.velocity.y += 30; break;
		}

		if(this.body.onFloor() || this.body.onWall())
			this.ChangeDirection();
		
		if(this.body.velocity.x <= 0)
			this.SetDirection('right');
		else
			this.SetDirection('left');
	};

	function Stinging() {
		this.PlayAnim('sting');


	};


};