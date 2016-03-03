TriggerController.prototype.triggers['music_left_right'] = {
	enter: function(params, trigger) {
		events.publish('stop_all_music', { fadeOut: params.fadeOut || 500 });
	},

	stay: function(params, trigger) {

	},

	exit: function(params, trigger) {
		if(frauki.body.center.x < trigger.x) {
			events.publish('play_music', { name: params.left, fadeIn: params.fadeLeft || 500 } );
		} else {
			events.publish('play_music', { name: params.right, fadeIn: params.fadeRight || 500 } );
		}
	}
}

TriggerController.prototype.triggers['music_up_down'] = {
	enter: function(params, trigger) {
		events.publish('stop_all_music', { fadeOut: params.fadeOut || 500 });
	},

	stay: function(params, trigger) {

	},

	exit: function(params, trigger) {
		if(frauki.body.center.y < trigger.y) {
			events.publish('play_music', { name: params.up, fadeIn: params.fadeUp || 500 } );
		} else {
			events.publish('play_music', { name: params.down, fadeIn: params.fadeDown || 500 } );
		}
	}
}
