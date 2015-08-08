TimerUtil = function() {
	this.timers = {};
}

TimerUtil.prototype.SetTimer = function(name, duration, callback, callbackContext) {
	//this.timers[name] = game.time.now + duration;

	if(duration === 0) {
		this.timers[name] = 'ready';
		return;
	}
	
	this.timers[name] = 'waiting';
	game.time.events.add(duration, function() { this.timers[name] = 'ready'; }, this);
}

TimerUtil.prototype.TimerUp = function(name) {
	if(!!this.timers[name]) {
		return this.timers[name] === 'ready' ? true : false;
	} else {
		return true;
	}

}

