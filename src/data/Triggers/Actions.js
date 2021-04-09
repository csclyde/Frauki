
TriggerController.prototype.triggers['goddess'] = {
	enter: function(params) {
		if(GameData.HasShard('Wit') && GameData.HasShard('Will') && GameData.HasShard('Luck') && GameData.HasShard('Power')) {
			ScriptRunner.run('finish_game');
		}
	},

	stay: function(params) {
	},

	exit: function(params) {
	}
};

TriggerController.prototype.triggers['goddess_body'] = {
	enter: function(params) {
		goddess.fraukiInSpace = true;
	},

	stay: function(params) {
	},

	exit: function(params) {
		goddess.fraukiInSpace = false;		
	}
};

TriggerController.prototype.triggers['run_script_once'] = {
	enter: function(params) {
		if(!GameData.GetFlag(params.script)) {
			ScriptRunner.run(params.script);
			GameData.SetFlag(params.script, true);
		}
	},
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

TriggerController.prototype.triggers['region_text'] = {
	enter: function(params, trigger) {
		events.publish('display_region_text', { text: params.text });
		
	},

	stay: function(params, trigger) {

	},

	exit: function(params, trigger) {
	
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
