PowerMeter = function(startingLevel) {

	startingLevel = startingLevel || 10;
	this.level = startingLevel;
	this.maxLevel = startingLevel;
};

PowerMeter.prototype.attack = function(target, damage) {

	//find the proportion of energy between attacker and target
	var ratio = this.level / target.power.level;

	//multiply the damage by that proportion
	target.power.level -= ratio * damage;
	this.level += ratio * damage;

	if(this.level > this.maxLevel) {
		this.level = this.maxLevel;
	}

	// if(target === frauki) {
	// 	console.log('Frauki was attacked. Ratio: ' + ratio + ' Damage: ' + damage + ' Total Damage: ' + ratio * damage);
	// } else {
	// 	console.log('Enemy was attacked. Ratio: ' + ratio + ' Damage: ' + damage + ' Total Damage: ' + ratio * damage);
	// }
};