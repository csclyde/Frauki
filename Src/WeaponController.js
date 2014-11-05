WeaponController = function() {
  this.currentWeapon = this.Bomb;
  this.weaponActive = false;

  this.timers = new TimerUtil();
  
  events.subscribe('activate_weapon', this.ToggleWeapon, this);
};

WeaponController.prototype.create = function() {
  
};

WeaponController.prototype.Update = function() {
    if(this.currentWeapon != null) {
        if(this.weaponActive === true) {
            this.currentWeapon.Update();
        }
    }
};

WeaponController.prototype.ToggleWeapon = function(params) {
    this.weaponActive = params.activate;
    
    if(this.currentWeapon != null) {
        if(this.weaponActive) {
            this.currentWeapon.Start();
        } else {
            this.currentWeapon.Stop();
        }
    }
}

WeaponController.prototype.Bomb = {
    Start: function() {
        //the initial activity when you press the button
    },
    
    Update: function() {
        //what to do while updating (only called while active)
        if(weaponController.timers.TimerUp('bomb')) {
            energyController.RemoveEnergy(0.2);
            weaponController.timers.SetTimer('bomb', 200);
            this.power += 0.1;
        }
    },
    
    Stop: function() {
        //the final activity when they release the button
        this.power = 0;
    },

    power: 0
};

WeaponController.prototype.Mace = {
    Start: function() {
        //the initial activity when you press the button
    },
    
    Update: function() {
        //what to do while updating (only called while active)
    },
    
    Stop: function() {
        //the final activity when they release the button
    }
};

WeaponController.prototype.Bubble = {
    Start: function() {
        //the initial activity when you press the button
    },
    
    Update: function() {
        //what to do while updating (only called while active)
    },
    
    Stop: function() {
        //the final activity when they release the button
    }
};

WeaponController.prototype.Jumper = {
    Start: function() {
        //the initial activity when you press the button
    },
    
    Update: function() {
        //what to do while updating (only called while active)
    },
    
    Stop: function() {
        //the final activity when they release the button
    }
};
