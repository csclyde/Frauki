EnergyController = function() {

	this.Reset();
	this.shieldRechargeRate = 10000;	

	this.timers = new TimerUtil();

	this.invincible = false;

	events.subscribe('restore_health', function(params) {
		if(this.remainingApples > 0) {
			var healthAmt = 3; //Math.ceil((this.GetMaxHealth() / 3) * 2);
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

	//if there is latent health present, start adding it to the actual health
	if(this.timers.TimerUp('health_tick') && this.latentHealth > 0) {
		this.timers.SetTimer('health_tick', 200);

		if(this.health < this.GetMaxHealth()) {
            events.publish('play_sound', {name: 'heal_' + this.health, restart: true });

			this.health++;
			this.latentHealth--;
		}
		else if(this.shield < this.GetMaxShield()) {
			events.publish('play_sound', {name: 'heal_1', restart: true });
			
			this.shield++;
			this.latentHealth--;
		}
	}

	if(this.timers.TimerUp('shield_tick')) {
		this.timers.SetTimer('shield_tick', 750);

		if(this.shield < this.GetMaxShield()) {
			this.shield++;

			events.publish('play_sound', {name: 'heal_1', restart: true });
		}
	}

	if(this.health <= 0 && !GameState.restarting) {
		ScriptRunner.run('game_over');
	}

	if(this.oldHealth !== this.health || this.oldApples !== this.remainingApples || this.oldShield !== this.shield) {
		events.publish('update_ui', {});
	}

	this.oldHealth = this.health;
	this.oldShield = this.shield;
	this.oldApples = this.remainingApples;
};

EnergyController.prototype.Reset = function() {
	this.health = this.GetMaxHealth();
	this.remainingApples = 0;
	this.shield = this.GetMaxShield();
	this.latentHealth = 0;
};

EnergyController.prototype.AddHealth = function(amt) {
	if(this.health + amt < this.GetMaxHealthBar()) {
		this.latentHealth += Math.floor(amt);
	} else {
		this.latentHealth = this.GetMaxHealthBar() - (this.health + this.shield);
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

EnergyController.prototype.GetMaxHealthBar = function() {
	return this.GetMaxHealth() + this.GetMaxShield();
}

EnergyController.prototype.GetMaxHealth = function() {
	return GameData.GetMaxHealth();
};

EnergyController.prototype.GetMaxShield = function() {
	return GameData.GetMaxShield();
};

EnergyController.prototype.AddApple = function() {
	this.remainingApples++;
	return true;
};

EnergyController.prototype.GetApples = function() {
	return this.remainingApples;
};
