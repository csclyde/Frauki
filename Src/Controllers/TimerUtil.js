TimerUtil = function() {
	this.timers = {};
}

TimerUtil.prototype.SetTimer = function(name, duration, callback, callbackContext) {	
	this.timers[name] = {};
	this.timers[name].timestamp = GameState.gameTime;
	this.timers[name].duration = duration;
}

TimerUtil.prototype.TimerUp = function(name) {
	if(GameState.paused) {
		return false;
	} else if(!!this.timers[name]) {
		return (this.TimeLeft(name) <= 0);
	} else {
		return true;
	}
};

TimerUtil.prototype.TimeLeft = function(name) {
	if(!!this.timers[name]) {
		var remainder = (this.timers[name].timestamp + this.timers[name].duration) - GameState.gameTime;
		return remainder > 0 ? remainder : 0;
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

