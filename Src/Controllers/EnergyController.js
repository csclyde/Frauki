EnergyController = function() {

	var that  = this;

	this.energy = 15;
	this.health = 30;
	this.charge = 30;

	this.latentHealth = 0;

	this.tickTimer = 0;
	this.gracePeriod = 0;

	this.timers = new TimerUtil();

	this.energyUsageTimestamp = 0;

	events.subscribe('player_heal', function(params) {
		if(this.remainingApples > 0) {
			this.AddHealth(18);
			this.remainingApples--;
		}
	}, this);

	this.remainingApples = GameData.GetMaxApples();
};

EnergyController.prototype.Create = function() {
};

EnergyController.prototype.Update = function() {

	var energyDiff = this.energy - 15;
	var step = (GetCurrentShardType() === 'Wit' ? 0.1 : 0.05);

	//
	if(game.time.now - this.energyUsageTimestamp > 2000) {
		step += 0.10;
	} else {
		step += ((game.time.now - this.energyUsageTimestamp) / 2000) * 0.10;
	}

	if(frauki.InAttackAnim() || frauki.Attacking() || frauki.state === frauki.Rolling) {
		step /= 10;
	}

	//if the timer is up, tick the energy and reset the timer
	if(game.time.now > this.tickTimer && game.time.now > this.gracePeriod) {
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

	//if there is latent health present, start adding it to the actual health
	if(this.latentHealth > 0) {
		var healthStep = 0.05;

		if(this.latentHealth < healthStep) {
			this.health += this.latentHealth;
			this.latentHealth = 0;
		} else {
			this.latentHealth -= healthStep;
			this.health += healthStep;
		}
	}

	//clamp the enrgy and neutral point;
	if(this.energy > 15)
		this.energy = 15;

	if(this.charge > 30)
		this.charge = 30;


	if(this.charge < 0) {
		this.charge = 0;
	}

	if(this.health > 30)
		this.health = 30;
	if(this.health <= 0)
		Main.Restart();

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

EnergyController.prototype.AddHealth = function(amt) {

	this.latentHealth += amt;
};

EnergyController.prototype.RemoveHealth = function(amt) {

	this.health -= amt;
	
	// if(this.energy > this.health) {
	// 	if(this.energy - this.health > amt) {
	// 		this.energy -= amt;
	// 	} else {
	// 		amt -= (this.energy - this.health);
	// 		this.health -= amt;
	// 		this.energy = this.health;
	// 	}
	// } else {
	// 	this.health -= amt;

	// 	if(this.energy > this.health) {
	// 		this.energy = this.health;
	// 	}
	// }
};

EnergyController.prototype.GetHealth = function() {

	return this.health;
};

EnergyController.prototype.GetEnergy = function() {

	return this.energy;
};

EnergyController.prototype.GetCharge = function() {

	return this.charge;
};

EnergyController.prototype.Reset = function() {

	this.health = 30;
	this.energy = 15;
	this.charge = 30;
	this.latentHealth = 0;
	this.remainingApples = GameData.GetMaxApples();
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

EnergyController.prototype.MaxCharge = function() {

	this.charge = 30;
};

EnergyController.prototype.AddApple = function() {
	if(this.remainingApples < GameData.GetMaxApples()) {
		this.remainingApples++;
		return true;
	} else {
		return false;
	}
}