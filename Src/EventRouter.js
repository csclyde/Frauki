EventRouter = function() {
	this.events = {};
}

EventRouter.prototype.subscribe = function(eventName, callback, context) {
	if(!this.events[eventName]) {
		this.events[eventName] = [];
	}

	this.events[eventName].push({func: callback, ctx: context});
};

EventRouter.prototype.publish = function(eventName, parameters) {
	if(!this.events[eventName]) {
		return;
	}

	console.log(eventName + ' - ', parameters);

	this.events[eventName].forEach(function(el) {
		el.func.apply(el.ctx, [parameters]);
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