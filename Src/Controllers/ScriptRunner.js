ScriptRunner = {};

ScriptRunner.create = function() {
	this.currentCommand = null;
	this.waitTime = 200;

	events.subscribe('skip_text', function(params) {
		if(!!this.textNextCommand) {
			//game.time.events.remove(this.textWaitEvent);
			events.publish('hide_text', {});			
			this.executeCommand(this.textNextCommand);
			this.textWaitEvent = null;
			this.textNextCommand = null;
		}
	}, this);

	events.subscribe('run_script', function(params) {
		ScriptRunner.run(params.name, params);
	});
};

ScriptRunner.run = function(name, params) {
	//find the script, and then execute each item sequentially
	if(!!this.scripts[name]) {

		//chain all the commands together by informing each of the next one
		for(var i = 0; i < this.scripts[name].length - 1; i++) {
			this.scripts[name][i].nextCommand = this.scripts[name][i + 1];
		}

		//execute the first command in the chain. It will call the following commands
		this.executeCommand(this.scripts[name][0], params);

	} else {
		console.warn('Script with name ' + name + ' was not found');
	}
};

ScriptRunner.executeCommand = function(cmd, params) {
	this.currentCommand = cmd;

	if(!cmd) return;

	if(cmd.name === 'wait') {
		game.time.events.add(cmd.props.amount, function() { this.executeCommand(cmd.nextCommand, params); }, this);
	} 
	else if(cmd.name === 'show_text') {
		game.time.events.add(200, function() { 
			events.publish(cmd.name, cmd.props);
		
			this.textNextCommand = cmd.nextCommand;
			// this.textWaitEvent = game.time.events.add(4000 + (20000 * cmd.props.text.length), function() {
			// 	events.publish('hide_text', {});
			// 	this.executeCommand(cmd.nextCommand, params);
			// }, this);
		}, this);
	}
	else {
		if(typeof cmd.func === 'function') {
			cmd.func.apply(null, [params]);
		} else {
			events.publish(cmd.name, cmd.props);
		}

		this.executeCommand(cmd.nextCommand, params);
	}
};

ScriptRunner.scripts = [];
