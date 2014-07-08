EventRouter = function() {
	this.events = {};
}

EventRouter.prototype.subscribe = function(eventName, callback) {
	if(!this.events[eventName]) {
		this.events[eventName] = [];
	}

	this.events[eventName].push(callback);
};

EventRouter.prototype.publish = function(eventName, parameters) {
	if(!this.events[eventName]) {
		return;
	}

	this.events[eventName].forEach(function(el) {
		el(parameters);
	});
};

EventRouter.prototype.unsubscribe = function(eventName, callback) {
	if(!this.events[eventName]){
		return;
	}

	//filter out the method to be removed
	this.events[eventName] = this.events[eventName].filter(function(el) {
		return el !== callback;
	});
};