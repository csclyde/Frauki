TriggerController.prototype.triggers['music_left_right'] = {
	enter: function(params, trigger) {
		events.publish('stop_all_music', { fadeOut: 300 });
	},

	stay: function(params, trigger) {

	},

	exit: function(params, trigger) {
		if(frauki.body.center.x < trigger.x) {
			events.publish('play_music', { name: params.left } );
		} else {
			events.publish('play_music', { name: params.right } );
		}
	}
}

TriggerController.prototype.triggers['music_up_down'] = {
	enter: function(params, trigger) {
		events.publish('stop_all_music', { fadeOut: 300 });
	},

	stay: function(params, trigger) {

	},

	exit: function(params, trigger) {
		if(frauki.body.center.y < trigger.y) {
			events.publish('play_music', { name: params.up } );
		} else {
			events.publish('play_music', { name: params.down } );
		}
	}
}
