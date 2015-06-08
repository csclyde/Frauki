TriggerController.prototype.triggers = {

	'music_surface_ruins': {
		enter: function(params) { events.publish('stop_music', { name: 'Surface' } ); },
		exit: function(params) { events.publish('play_music', { name: 'Ruins' } ); }
	},
	
	'music_ruins_junkyard': {
	    enter: function(params) { events.publish('stop_music', { name: 'Ruins' } ); },
		exit: function(params) { events.publish('play_music', { name: 'Junkyard' } ); }
	}
}
