Enemy.prototype.types['Insectoid'] =  function(sprite) {

	sprite.body.setSize(11, 50, 0, 0);

    sprite.animations.add('idle', ['Hop0000'], 10, true, false);
    sprite.animations.add('hop', ['Hop0001', 'Hop0002'], 10, true, false);
    sprite.animations.add('land', ['Hop0003', 'Hop0004'], 10, true, false);

    sprite.state = Idling;

    //events.subscribe('player_jump', this.Jump, this);

	sprite.updateFunction = function() {
		
	};

	function Idling() {
		sprite.PlayAnim('idle');
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
};