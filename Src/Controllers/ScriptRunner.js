ScriptRunner = function() {

};

ScriptRunner.run = function(name) {
	//find the script, and then execute each item sequentially
	if(!!this.scripts[name]) {

		//chain all the commands together by informing each of the next one
		for(var i = 0; i < this.scripts[name].length - 1; i++) {
			this.scripts[name][i].nextCommand = this.scripts[name][i + 1];
		}

		//execute the first command in the chain. It will call the following commands
		this.executeCommand(this.scripts[name][0]);

	} else {
		console.log('Script with name ' + name + ' was not found');
	}
};

ScriptRunner.executeCommand = function(cmd) {
	var that = this;

	if(!cmd) return;

	console.log(cmd);

	if(cmd.name === 'wait') {
		game.time.events.add(cmd.props.amount, function() { that.executeCommand(cmd.nextCommand); });
	} else if(cmd.name === 'stop_control') {
		inputController.allowInput = false;
		this.executeCommand(cmd.nextCommand);

	} else if(cmd.name === 'start_control') {
		inputController.allowInput = true;
		this.executeCommand(cmd.nextCommand);

	} else {
		events.publish(cmd.name, cmd.props );

		this.executeCommand(cmd.nextCommand);
	}
};

ScriptRunner.scripts = [];

ScriptRunner.scripts['demo_baton'] = [
	{ name: 'stop_control', props: {} },
	{ name: 'show_text', props: { text: 'I can use X to now throw my energy', portrait: 'Neutral' } },
	{ name: 'wait', props: { amount: 3000 } },
	{ name: 'hide_text', props: {} },
	{ name: 'wait', props: { amount: 500 } },
	{ name: 'activate_weapon', props: { activate: true, override: true } },
	{ name: 'wait', props: { amount: 2000 } },
	{ name: 'start_control', props: {} }
];