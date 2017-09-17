TimerUtil = function() {
	this.timers = {};
}

TimerUtil.prototype.SetTimer = function(name, duration, callback, callbackContext) {
	//this.timers[name] = game.time.now + duration;

	if(!!this.timers[name]) {
		game.time.events.remove(this.timers[name].eventTimer);
	}

	if(duration === 0) {
		this.timers[name] = { status: 'ready', timerEvent: null };
		return;
	}
	
	this.timers[name] = {};
	this.timers[name].status = 'waiting';
	this.timers[name].eventTimer = game.time.events.add(duration, function() { this.timers[name].status = 'ready'; }, this);
	this.timers[name].timestamp = game.time.now;
	this.timers[name].duration = duration;
}

TimerUtil.prototype.TimerUp = function(name) {
	if(!!this.timers[name]) {
		return this.timers[name].status === 'ready' ? true : false;
	} else {
		return true;
	}

};

TimerUtil.prototype.TimeLeft = function(name) {
	if(!!this.timers[name]) {
		var diff = this.timers[name].timestamp + this.timers[name].duration - game.time.now;
		return diff > 0 ? diff : 0;
	} else {
		return 0;
	}
};

TimerUtil.prototype.Timestamp = function(name) {
	if(!!this.timers[name]) {
		return this.timers[name].timestamp;
	} else {
		return 0;
	}
};

