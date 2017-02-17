
TriggerController.prototype.triggers['dizzy'] = {
	enter: function(params) {
		Main.tweens.dizzies = game.add.tween(Main).to( {currentAlpha: 0.2}, 1000, Phaser.Easing.Exponential.In, false).to( {currentAlpha: 1}, 15000, Phaser.Easing.Quintic.In, false);
		Main.tweens.dizzies.start();

		Main.tweens.slowMo = game.add.tween(Main).to( {physicsSlowMo: 0.6}, 1000, Phaser.Easing.Quintic.In, false).to( {physicsSlowMo: 1}, 15000, Phaser.Easing.Quintic.In, false);
		Main.tweens.slowMo.start();
	},

	stay: function(params) {

	},

	exit: function(params) {
	}
}

TriggerController.prototype.triggers['light'] = {
	enter: function(params) {
		effectsController.ScreenLight(true);
	},

	stay: function(params) {

	},

	exit: function(params) {
		effectsController.ScreenLight(false);
	}
}

TriggerController.prototype.triggers['dark'] = {
	enter: function(params) {
		effectsController.ScreenDark(true);
	},

	stay: function(params) {

	},

	exit: function(params) {
		effectsController.ScreenDark(false);
	}
}

TriggerController.prototype.triggers['regen'] = {

	enter: function(params) {
		triggerController.tickTimer = 0;
	},

	stay: function(params) {

		//if the timer is up, tick the health and reset the timer
		if(game.time.now > triggerController.tickTimer) {
			energyController.AddHealth(1);

			triggerController.tickTimer = game.time.now + 400;
		}
	},

	exit: function(params) {
	}
}