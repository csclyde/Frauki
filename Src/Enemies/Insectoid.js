Enemy.prototype.types['Insectoid'] =  function(sprite) {

	sprite.body.setSize(67, 25, 0, 0);

    sprite.animations.add('idle', ['Hop0000'], 10, true, false);
    sprite.animations.add('hop', ['Hop0001', 'Hop0002'], 10, true, false);
    sprite.animations.add('land', ['Hop0003', 'Hop0004'], 10, true, false);

    sprite.state = Idling;

    //events.subscribe('player_jump', this.Jump, this);

	sprite.updateFunction = function() {
		
	};

	////////////////////////////////STATES////////////////////////////////////
	function Idling() {
		sprite.PlayAnim('idle');

		if(this.PlayerIsVisible() || this.PlayerIsNear(100)) {
			if(playerX < this.body.x) {
				this.body.velocity.x = -100;
				this.SetDirection('left');
			} else {
				this.body.velocity.x = 100;
				this.SetDirection('right');
			}
		} else {
			this.body.velocity.x = 0;
		}
	};

	function Hopping() {
		
	};

	function Landing() {

	};

	function Scuttling() {

	};

	function Dodging() {

	};

	function Shooting() {

	};

	///////////////////////////////ACTIONS////////////////////////////////////
	function Hop() {
		this.state = Hopping;
	};
};