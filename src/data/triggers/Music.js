TriggerController.prototype.triggers['music_left_right'] = {
	enter: function(params, trigger) {
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

TriggerController.prototype.triggers['play_music'] = {
	enter: function(params, trigger) {
		events.publish('play_music', { name: params.song, fade: params.fade } );
	},

	stay: function(params, trigger) {

	},

	exit: function(params, trigger) {
	}
}

TriggerController.prototype.triggers['stop_music'] = {
	enter: function(params, trigger) {
		events.publish('stop_music', { fade: params.fade || 500 } );		
	},

	stay: function(params, trigger) {

	},

	exit: function(params, trigger) {
	}
}

TriggerController.prototype.triggers['pause_music'] = {
	enter: function(params, trigger) {
		//events.publish('pause_all_music', { } );
	},

	stay: function(params, trigger) {

	},

	exit: function(params, trigger) {
	}
}

TriggerController.prototype.triggers['unpause_music'] = {
	enter: function(params, trigger) {
		//events.publish('unpause_all_music', { } );
	},

	stay: function(params, trigger) {

	},

	exit: function(params, trigger) {
	}
}

TriggerController.prototype.triggers['music_zone'] = {
	enter: function(params, trigger) {
		//events.publish('pause_all_music', { } );
		//events.publish('play_music', { name: params.song, fade: 1000 } );
	},
	
	stay: function(params, trigger) {
		
	},
	
	exit: function(params, trigger) {
		//events.publish('stop_music', { name: params.song, fade: 1000 } );		
		//events.publish('unpause_all_music', { } );
		
	}
}

TriggerController.prototype.triggers['ambient_left_right'] = {
	enter: function(params, trigger) {
	},

	stay: function(params, trigger) {

	},

	exit: function(params, trigger) {
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
		if(frauki.body.center.y < trigger.y) {
			events.publish('play_ambient', { name: params.up } );
		} else {
			events.publish('play_ambient', { name: params.down } );
		}
	}
}