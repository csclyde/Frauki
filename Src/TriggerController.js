TriggerController = function() {
	this.triggers = {};
}

TriggerController.prototype.Update = function() {
	//loop through every trigger and test its firing condition
	for(var key in this.triggers) {
		var trig = this.triggers[key];

		if(trig.condition.apply(trig.context) === true) {
			trig.subs.forEach(function(el) {
				el.call.apply(el.ctx);
			});
		}
	}
};

TriggerController.prototype.AddTrigger = function(name, conditon, context) {
	if(!this.triggers[name]) {
		this.triggers[name] = {};
		this.triggers[name].subs = [];
	}

	this.triggers[name].condition = condition;
	this.triggers[name].context = context || condition;
};

TriggerController.prototype.Subscribe = function(name, callback, context) {
	if(!this.triggers[name]) {
		console.log('Tried to subscribe to a non-existent trigger: ' + name);
		return;
	}

	this.triggers[name].subs.push({call: callback, ctx: context});
};

/*
{
	'name_of_trigger': {
		'condition': conditionFunc,
		'context': conditionCtx,
		'subs': [
			{ 'call': callback, 'ctx': context },
			{ 'call': callbvf, 'ctx': otherCtx }
		]
	},

	'another_trigger': {
	
	}
}
*/