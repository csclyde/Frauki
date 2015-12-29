EnergyController = function() {

	var that  = this;

	this.energy = 30;
	this.neutralPoint = 30;
	this.charge = 30;
	this.activeCharge = 0;
	this.tickTimer = 0;
	this.gracePeriod = 0;

	this.timers = new TimerUtil();

	this.charging = false;

	this.energyUsageTimestamp = 0;

	events.subscribe('player_power_slash', function() { that.charge = 0; });
};

EnergyController.prototype.Create = function() {

	// this.energyBarWhite = game.add.image(9, 9, 'UI', 'EnergyBar0003');
	// this.energyBarWhite.fixedToCamera = true;
	// this.energyBarWhite.anchor.x = 0;
	// this.energyBarWhite.visible = false;

	// this.energyBarRed = game.add.image(9, 9, 'UI', 'EnergyBar0004');
	// this.energyBarRed.fixedToCamera = true;
	// this.energyBarRed.anchor.x = 0;
	// this.energyBarRed.visible = false;
};

EnergyController.prototype.Update = function() {

	var energyDiff = this.energy - 15;
	var step = 0.05;

	//
	if(game.time.now - this.energyUsageTimestamp > 2000) {
		step += 0.10;
	} else {
		step += ((game.time.now - this.energyUsageTimestamp) / 2000) * 0.10;
	}

	//if the timer is up, tick the energy and reset the timer
	if(game.time.now > this.tickTimer && game.time.now > this.gracePeriod && !frauki.Attacking() && frauki.state !== frauki.Rolling) {
		if(Math.abs(energyDiff) < step) {
			this.energy = 15;
		} else {
			if(this.energy > 15) {
				this.energy -= step / 100;
			} else {
				if(this.energy < 0) {
					this.energy += step * 0.8;
				} else {
					this.energy += step;
				}
			}
		}

		this.tickTimer = game.time.now + 20;
	}

	//clamp the enrgy and neutral point;
	if(this.energy > 15)
		this.energy = 15;

	if(this.charge > 30)
		this.charge = 30;


	if(this.charge < 0) {
		this.charge = 0;
	}

	if(this.neutralPoint > 30)
		this.neutralPoint = 30;
	if(this.neutralPoint <= 0)
		Main.Restart();

	// if(this.InBeastMode() && this.energyBar.visible) {
	// 	this.energyBar.visible = false;
	// 	this.energyBarWhite.visible = true;
	// } else if(!this.InBeastMode() && this.energyBarWhite.visible) {
	// 	this.energyBar.visible = true;
	// 	this.energyBarWhite.visible = false;
	// }
};

EnergyController.prototype.UseEnergy = function(amt) {
	//if they are below a threshold, they are in beast mode
	if(this.energy > 0) {
		this.energy -= amt / 1;
		this.gracePeriod = game.time.now + 600;
		this.energyUsageTimestamp = game.time.now;
		return true;
	} else {
		events.publish('play_sound', {name: 'no_energy'});
		return false;
	}
};

EnergyController.prototype.RemoveEnergy = function(amt) {
	if(this.energy > 0) {
		this.energy -= amt;
		this.gracePeriod = game.time.now + 400;
		this.energyUsageTimestamp = game.time.now;
		return true;
	}
};

EnergyController.prototype.AddEnergy = function(amt) {
	this.energy += amt;
};

EnergyController.prototype.GetEnergy = function() {
	return this.energy > 0 ? (Math.round(this.energy * 10) / 10) : 0;
};

EnergyController.prototype.AddPower = function(amt) {
	this.neutralPoint += amt;
};

EnergyController.prototype.InBeastMode = function() {
	if(this.neutralPoint < 6) {
		return true;
	} else {
		return false;
	}
}

EnergyController.prototype.RemovePower = function(amt) {

	this.neutralPoint -= amt;
	
	// if(this.energy > this.neutralPoint) {
	// 	if(this.energy - this.neutralPoint > amt) {
	// 		this.energy -= amt;
	// 	} else {
	// 		amt -= (this.energy - this.neutralPoint);
	// 		this.neutralPoint -= amt;
	// 		this.energy = this.neutralPoint;
	// 	}
	// } else {
	// 	this.neutralPoint -= amt;

	// 	if(this.energy > this.neutralPoint) {
	// 		this.energy = this.neutralPoint;
	// 	}
	// }
};

EnergyController.prototype.GetEnergyPercentage = function() {
	var percentageCurve = [0.5, 1, 2];

	return game.math.catmullRomInterpolation(percentageCurve, this.energy / 30);
};

EnergyController.prototype.AddCharge = function(amt) {
	this.charge += amt;
};

EnergyController.prototype.RemoveCharge = function(amt) {
	this.charge -= amt;
};

EnergyController.prototype.UseCharge = function(amt) {
	if(this.charge >= amt) {
		this.charge -= amt;
		return true;
	} else {
		return false;
	}
};

EnergyController.prototype.GetDifficultyModifier = function() {
	var percentageCurve = [-0.5, 0, 1];

	return game.math.catmullRomInterpolation(percentageCurve, this.neutralPoint / 30);
};

EnergyController.prototype.MaxCharge = function() {
	this.charge = 30;
};