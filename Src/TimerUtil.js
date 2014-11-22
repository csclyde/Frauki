TimerUtil = function() {
	this.timers = {};
}

TimerUtil.prototype.SetTimer = function(name, duration, callback, callbackContext) {
	this.timers[name] = game.time.now + duration;
}

TimerUtil.prototype.TimerUp = function(name) {
	if(!!this.timers[name]) {
		if(game.time.now > this.timers[name])
			return true;
		else
			return false;
	} else {
		return true;
	}

}

