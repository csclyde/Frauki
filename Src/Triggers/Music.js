
TriggerController.prototype.triggers['stop_music'] = {
	enter: function(params) {
		events.publish('stop_all_music');
	},

	stay: function(params) {

	},

	exit: function(params) {
	}
}

TriggerController.prototype.triggers['start_ruins_music'] = {
	enter: function(params) {
		events.publish('play_music', { name: 'Ruins' } );
	},

	stay: function(params) {

	},

	exit: function(params) {
	}
}

TriggerController.prototype.triggers['start_underwater_music'] = {
	enter: function(params) {
		events.publish('play_music', { name: 'Underwater' } );
	},

	stay: function(params) {

	},

	exit: function(params) {
	}
}

TriggerController.prototype.triggers['ruins_music'] = {
	enter: function(params) {
		console.log('yeh');
		events.publish('play_music', { name: 'Ruins' } );
	},

	stay: function(params) {

	},

	exit: function(params) {
		events.publish('stop_music', { name: 'Ruins' } );
	}
}