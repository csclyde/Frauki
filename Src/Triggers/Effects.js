
TriggerController.prototype.triggers['dizzy'] = {
	enter: function(params) {
		var dizzies = game.add.tween(Main).to( {currentAlpha: 0.2}, 1000, Phaser.Easing.Exponential.In, false).to( {currentAlpha: 1}, 15000, Phaser.Easing.Quintic.In, false);
		dizzies.start();
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

		var energyDiff = Math.abs(energyController.GetHealth() - 30);
		var step = 0.10;

		//if the timer is up, tick the health and reset the timer
		if(game.time.now > triggerController.tickTimer) {
			if(energyDiff < step) {
				energyController.ResetHealth();
			} else {
				energyController.AddHealth(step);
			}

			triggerController.tickTimer = game.time.now + 20;
		}
	},

	exit: function(params) {
	}
}