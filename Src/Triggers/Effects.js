
TriggerController.prototype.triggers['dizzy'] = {
	enter: function(params) {
		effectsController.Dizzy(15000);
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
		effectsController.ScreenDark(true, params.amount);
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