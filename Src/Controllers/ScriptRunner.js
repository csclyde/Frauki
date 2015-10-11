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

	} else {
		console.log('Script with name ' + name + ' was not found');
	}
};

ScriptRunner.executeCommand = function(cmd) {
	var that = this;

	if(cmd.name === 'wait') {
		setTimeout(function() { that.executeCommand(cmd.nextCommand); }, cmd.props.amount );
	} else {
		events.publish(cmd.name, cmd.props );

		this.executeCommand(cmd.nextCommand);
	}
};