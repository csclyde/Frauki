TriggerController.prototype.triggers['music_surface_ruins'] = {
	enter: function(params) {
		events.publish('stop_music', { name: 'Surface' } );
	},

	stay: function(params) {

	},

	exit: function(params) {
		events.publish('play_music', { name: 'Ruins' } );
	}
}