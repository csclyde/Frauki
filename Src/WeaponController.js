WeaponController = function() {
  this.currentWeapon = this.Jumper;
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
        if(this.mace === null) {
            this.mace = game.add.sprite(frauki.body.center.x, frauki.body.center.y, 'mace');
            game.physics.enable(this.mace, Phaser.Physics.ARCADE);
            this.mace.gravity = -800;
        }

        this.mace.body.x = frauki.body.center.x;
        this.mace.body.y = frauki.body.center.y;
    },
    
    Update: function() {
        //what to do while updating (only called while active)
        var vel = 2000;
        var maxVelocity = 800;

        var xDist = this.mace.body.center.x - frauki.body.center.x;
        var yDist = this.mace.body.center.y - frauki.body.center.y;

        var angle = Math.atan2(yDist, xDist); 
        this.mace.body.acceleration.x = Math.cos(angle) * -vel - (xDist * 5);    
        this.mace.body.acceleration.y = Math.sin(angle) * -vel - (yDist * 5);

        var currVelocitySqr = this.mace.body.velocity.x * this.mace.body.velocity.x + this.mace.body.velocity.y * this.mace.body.velocity.y;

        if (currVelocitySqr > maxVelocity * maxVelocity) {
            angle = Math.atan2(this.mace.body.velocity.y, this.mace.body.velocity.x);

            this.mace.body.velocity.x = Math.cos(angle) * maxVelocity;
            this.mace.body.velocity.y = Math.sin(angle) * maxVelocity;

        }
    },
    
    Stop: function() {
        //the final activity when they release the button
        this.mace.visible = false;
    },

    mace: null
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
        if(energyController.GetEnergy() >= 0) {
            frauki.states.dashing = true;
            frauki.body.velocity.x *= 100;
            frauki.body.velocity.y *= 100;
            //energyController.RemoveEnergy(15);

            game.time.events.add(300, function() { frauki.states.dashing = false} );
        }
    },
    
    Update: function() {
        //what to do while updating (only called while active)
    },
    
    Stop: function() {
        //the final activity when they release the button
    }
};
