var Utilities = {
	RestartGame: function() {
		var fadeOutTween = game.add.tween(game.world).to({alpha:0}, 1500, Phaser.Easing.Linear.None, true);
		fadeOutTween.onComplete.add(function() {
			frauki.body.x = 0;
			frauki.body.y = 2000;
			game.world.alpha = 1;
			frauki.states.energy = 8;

			Frogland.enemyGroup.forEach(function(e) {
				e.alive = true;
				e.exists = true;
				e.visible = true;
				e.body.x = e.initialX;
				e.body.y = e.initialY;
				e.energy = 7;

				if(!!e.Reset)
					e.Reset.apply(e);
			});
		});
	}
};