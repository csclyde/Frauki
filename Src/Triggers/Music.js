TriggerController.prototype.triggers['music_left_right'] = {
	enter: function(params, trigger) {
		//events.publish('stop_all_music', { fadeOut: params.fadeOut || 3000 });
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
		//events.publish('stop_all_music', { fadeOut: params.fadeOut || 3000 });
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

TriggerController.prototype.triggers['ambient_left_right'] = {
	enter: function(params, trigger) {
	},

	stay: function(params, trigger) {

	},

	exit: function(params, trigger) {
		events.publish('stop_all_ambient', { fadeOut: 500 });
		
		if(frauki.body.center.x < trigger.x) {
			events.publish('play_ambient', { name: params.left } );
		} else {
			events.publish('play_ambient', { name: params.right } );
		}
	}
}

TriggerController.prototype.triggers['ambient_up_down'] = {
	enter: function(params, trigger) {
	},

	stay: function(params, trigger) {

	},

	exit: function(params, trigger) {
		events.publish('stop_all_ambient', { fadeOut: 500 });

		if(frauki.body.center.y < trigger.y) {
			events.publish('play_ambient', { name: params.up } );
		} else {
			events.publish('play_ambient', { name: params.down } );
		}
	}
}