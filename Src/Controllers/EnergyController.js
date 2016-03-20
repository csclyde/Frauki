EnergyController = function() {

	var that  = this;

	this.energy = 12;
	this.health = this.GetMaxHealth();
	this.charge = 0;

	this.latentHealth = 0;

	this.timers = new TimerUtil();

	events.subscribe('energy_heal', function(params) {
		if(this.remainingApples > 0) {
			var healthAmt = Math.ceil((this.GetMaxHealth() / 3) * 2);
			this.AddHealth(healthAmt);
			this.remainingApples--;
			effectsController.SpawnAppleCore(frauki.body.center.x, frauki.body.y - 5);
		}
	}, this);

	this.remainingApples = 0;
};

EnergyController.prototype.Create = function() {
};

EnergyController.prototype.Update = function() {


	//if the timer is up, tick the energy and reset the timer
	if(this.timers.TimerUp('energy_tick') && this.timers.TimerUp('energy_grace') && !frauki.InAttackAnim() && frauki.state !== frauki.Rolling && !frauki.states.shielded && frauki.state !== frauki.Hanging) {
		this.timers.SetTimer('energy_tick', 200);

		if(this.energy < this.GetMaxEnergy()) {
			this.energy++;
		}
	}

	//if there is latent health present, start adding it to the actual health
	if(this.timers.TimerUp('health_tick') && this.latentHealth > 0) {
		this.timers.SetTimer('health_tick', 200);

		if(this.health < this.GetMaxHealth()) {
			this.health++;
			this.latentHealth--;
		}
	}

	if(this.timers.TimerUp('charge_tick')) {

		if(this.charge > 0) {
			this.charge--;
		}

		this.timers.SetTimer('charge_tick', this.GetChargeDuration());
	}

	effectsController.ShowCharge(this.charge);

	if(this.charge < 0) {
		this.charge = 0;
	}

	if(this.health <= 0)
		Main.Restart();
};


EnergyController.prototype.UseEnergy = function(amt) {
	return true;
	amt = Math.floor(amt);
	//if they are below a threshold, they are in beast mode
	if(this.energy >= amt) {
		this.energy -= amt;
		this.timers.SetTimer('energy_grace', 1000);
		return true;
	} else {
		events.publish('play_sound', {name: 'no_energy'});
		return false;
	}
};

EnergyController.prototype.RemoveEnergy = function(amt) {
	amt = Math.floor(amt);

	if(this.energy > 0) {
		this.energy -= amt;
		this.timers.SetTimer('energy_grace', 1000);
		return true;
	}

	return false;
};

EnergyController.prototype.GetEnergy = function() {

	return this.energy;
};

EnergyController.prototype.AddEnergy = function(amt) {
	amt = Math.floor(amt);

	if(this.energy + amt < this.GetMaxEnergy()) {
		this.energy += amt;
	} else {
		this.energy = this.GetMaxEnergy();
	}
};

EnergyController.prototype.GetMaxEnergy = function() {

	return 12;
};


EnergyController.prototype.AddHealth = function(amt) {
	if(this.health + amt < this.GetMaxHealth()) {
		this.latentHealth += Math.floor(amt);
	} else {
		this.latentHealth = this.GetMaxHealth() - this.health;
	}
};

EnergyController.prototype.RemoveHealth = function(amt) {

	this.health -= Math.floor(amt);
};

EnergyController.prototype.GetHealth = function() {

	return this.health;
};

EnergyController.prototype.GetMaxHealth = function() {

	return 4;
};


EnergyController.prototype.GetCharge = function() {

	return this.charge;
};

EnergyController.prototype.AddCharge = function(amt) {
	amt = Math.floor(amt);

	if(this.charge + amt < this.GetMaxCharge()) {
		this.charge += amt;
	} else {
		this.charge = this.GetMaxCharge();
	}

	this.timers.SetTimer('charge_tick', this.GetChargeDuration());
};

EnergyController.prototype.RemoveCharge = function(amt) {

	this.charge -= amt;

	if(this.charge < 0) {
		this.charge = 0;
	}

	this.timers.SetTimer('charge_tick', this.GetChargeDuration());
};

EnergyController.prototype.UseCharge = function(amt) {
	amt = Math.floor(amt);

	if(this.charge >= amt) {
		this.charge -= amt;
		return true;
	} else {
		return false;
	}
};

EnergyController.prototype.MaxCharge = function() {

	this.charge = this.GetMaxCharge();
};

EnergyController.prototype.GetMaxCharge = function() {

	return 4;
};

EnergyController.prototype.ResetCharge = function() {

	this.charge = 0;
};

EnergyController.prototype.GetChargeDuration = function() {
	if(this.charge > 3) {
		return 5000;
	} else if(this.charge > 2) {
		return 6500;
	} else if(this.charge > 1) {
		return 8000;
	} else if(this.charge > 0) {
		return 1000;
	} else {
		return 10500;
	}
};


EnergyController.prototype.Reset = function() {

	this.health = this.GetMaxHealth();
	this.energy = 12;
	this.charge = 0;
	this.latentHealth = 0;
	this.remainingApples = 0;
};

EnergyController.prototype.AddApple = function() {
	this.remainingApples++;
	return true;
};

EnergyController.prototype.GetApples = function() {

	return this.remainingApples;
};