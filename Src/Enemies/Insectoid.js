var Insectoid  = (function() {
	var e = {};

	e.Create = function(sprite) {

		sprite.body.setSize(11, 50, 0, 0);

	    sprite.animations.add('stand', ['Hop0000'], 10, true, false);
	    sprite.animations.play('stand');

	    sprite.state = Standing;

	    //events.subscribe('player_jump', this.Jump, this);
	};

	e.Update = function() {
	};

	function Standing() {

	};

return e; })();