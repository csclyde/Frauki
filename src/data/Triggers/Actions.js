
TriggerController.prototype.triggers['goddess'] = {
	enter: function(params) {
		console.log('testing', GameData.GetFlag('ready_for_goddess_talk'))
		if(GameData.GetFlag('ready_for_goddess_talk')) {
			ScriptRunner.run('goddess_chat');
			GameData.SetFlag('ready_for_goddess_talk', false);
		}
	},

	stay: function(params) {
	},

	exit: function(params) {
		console.log('exiting')
		GameData.SetFlag('ready_for_goddess_talk', true);
	}
};

TriggerController.prototype.triggers['old_robo'] = {
	enter: function(params) {
		ScriptRunner.run('enter_oldrobo');
	},

	stay: function(params) {
	},

	exit: function(params) {
	}
};

TriggerController.prototype.triggers['goddess_spaceship'] = {
	enter: function(params) {
		if(!GameData.GetFlag('goddess_spaceship')) {
			GameData.SetFlag('goddess_spaceship', true);
			GameData.SetVal('goddess_death_message', 'That big, ugly, metal eyesore is the robots space ship. They crashed that pile of junk into my planet many years ago and they haven\'t left since.')
		}
	},

	stay: function(params) {
	},

	exit: function(params) {
	}
};

TriggerController.prototype.triggers['region_text'] = {
	enter: function(params, trigger) {
	},

	stay: function(params, trigger) {

	},

	exit: function(params, trigger) {
		if(!!params.left && frauki.body.center.x < trigger.x) {
			events.publish('display_region_text', { text: params.left });
		} else if(!!params.right && frauki.body.center.x > trigger.x) {
			events.publish('display_region_text', { text: params.right });
		} else if(!!params.down && frauki.body.center.y > trigger.y) {
			events.publish('display_region_text', { text: params.down });
		} else if(!!params.up && frauki.body.center.y < trigger.y) {
			events.publish('display_region_text', { text: params.up });
		}
	}
};

TriggerController.prototype.triggers['start_fight'] = {
	enter: function(params, trigger) {
		ScriptRunner.run('start_fight', params);
	},

	stay: function(params, trigger) {

	},

	exit: function(params, trigger) {
		
	}
};
