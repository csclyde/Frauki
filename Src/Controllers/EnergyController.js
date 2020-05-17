EnergyController = function() {

	var that  = this;

	this.energy = 12;
	this.health = this.GetMaxHealth() - 1;
	this.charge = 0;
	this.remainingApples = 0;
	this.shield = this.GetMaxShield();
	this.shieldRechargeRate = 15000;

	this.latentHealth = 0;

	this.timers = new TimerUtil();

	this.invincible = false;

	events.subscribe('energy_heal', function(params) {
		if(this.remainingApples > 0) {
			var healthAmt = Math.ceil((this.GetMaxHealth() / 3) * 2);
			this.AddHealth(healthAmt);
			this.remainingApples--;
			effectsController.SpawnAppleCore(frauki.body.center.x, frauki.body.y - 5);
		}
	}, this);

	events.subscribe('full_heal', function(params) {
		var healthAmt = this.GetMaxHealth() - this.GetHealth();
		this.AddHealth(healthAmt);
	}, this);

	
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
            events.publish('play_sound', {name: 'heal_' + this.health, restart: true });

			this.health++;
			this.latentHealth--;
		}
	}

	if(this.timers.TimerUp('charge_tick')) {

		if(this.charge > 0) {
			events.publish('play_sound', { name: 'lose_energy_' + this.charge });
			this.charge--;

		}

		this.timers.SetTimer('charge_tick', this.GetChargeDuration());
	}

	if(this.timers.TimerUp('shield_tick')) {
		this.timers.SetTimer('shield_tick', this.shieldRechargeRate);

		if(this.shield < this.GetMaxShield()) {
			this.shield++;

			events.publish('play_sound', {name: 'heal_' + this.health + this.shield, restart: true });
		}
	}

	effectsController.ShowCharge(this.charge);

	if(this.charge < 0) {
		this.charge = 0;
	}

	if(this.health <= 0)
		GameState.Restart();

	if(this.oldHealth !== this.health || this.oldApples !== this.remainingApples || this.oldShield !== this.shield) {
		events.publish('update_ui', {});
	}

	this.oldHealth = this.health;
	this.oldCharge = this.charge;
	this.oldShield = this.shield;
	this.oldApples = this.remainingApples;
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
	if(this.invincible) return;
	
	if(this.shield > 0) {
		this.timers.SetTimer('shield_tick', this.shieldRechargeRate);
		if(this.shield > amt) {
			this.shield -= amt;
		} else {
			this.health -= (amt - this.shield);
			this.shield = 0;
		}
	} else {
		this.health -= Math.floor(amt);
	}
};

EnergyController.prototype.GetHealth = function() {
	return this.health;
};

EnergyController.prototype.GetShield = function() {
	return this.shield;
}

EnergyController.prototype.GetCurrentHealthBar = function() {
	return this.GetShield() + this.GetHealth();
}

EnergyController.prototype.GetMaxHealthBar = function() {
	return this.GetMaxHealth() + this.GetMaxShield();
}

EnergyController.prototype.GetMaxHealth = function() {
	return GameData.GetMaxHealth();
};

EnergyController.prototype.GetMaxShield = function() {
	return GameData.GetMaxShield();
};

EnergyController.prototype.GetCharge = function() {

	return this.charge;
};

EnergyController.prototype.AddCharge = function(amt) {
	return;
	
	amt = Math.floor(amt);

	if(!GameData.HasAnyUpgrades()) {
		return;
	}

	if(this.charge + amt < this.GetMaxCharge()) {
		this.charge += amt;
		events.publish('play_sound', { name: 'gain_energy_' + this.charge });

	} else if(this.charge < this.GetMaxCharge()){
		this.charge = this.GetMaxCharge();
		events.publish('play_sound', { name: 'gain_energy_' + this.charge });
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
		return 8000;
	} else if(this.charge > 2) {
		return 10000;
	} else if(this.charge > 1) {
		return 12000;
	} else if(this.charge > 0) {
		return 14000;
	} else {
		return 10000;
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