WeaponController = function() {
  this.currentWeapon = this.Mace;
  this.weaponActive = false;
  this.attackGeometry = null;

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
        if(params.activate) {
            this.currentWeapon.Start();
        } else {
            this.currentWeapon.Stop();
        }
    }
};

//returns null of there is no current attck geometry
WeaponController.prototype.GetAttackGeometry = function() {
    if(this.currentWeapon === this.Mace && this.weaponActive) {
        return {x: this.Mace.mace.x,  y: this.Mace.mace.y, w: this.Mace.mace.width, h: this.Mace.mace.height,
            damage: 1,
            knockback: 1,
            penetration: 0
        }
    }

    return null;
};

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
            this.mace.body.allowGravity = false;
        }

        this.mace.visible = true;
        this.mace.body.enable = true;
        this.mace.x = frauki.body.center.x;
        this.mace.y = frauki.body.center.y;
        this.mace.body.acceleration.x = 0;
        this.mace.body.acceleration.y = 0;
        this.mace.body.velocity.x = 0;
        this.mace.body.velocity.y = 0;

        energyController.RemoveEnergy(2);
    },
    
    Update: function() {
        //the distance multiplied by the stiffness is the force acting on the body
        var xDist = this.mace.body.center.x - frauki.body.center.x;
        var yDist = this.mace.body.center.y - frauki.body.center.y;
        var stiffness = 20;
        var maxVelocity = 1000;

        this.mace.body.acceleration.x = xDist * stiffness * -1;
        this.mace.body.acceleration.y = yDist * stiffness * -1;

        if((frauki.body.center.x < this.mace.body.center.x && this.mace.body.velocity.x > 0) || (frauki.body.center.x > this.mace.body.center.x && this.mace.body.velocity.x < 0))
            this.mace.body.acceleration.x *= 2;

        if((frauki.body.center.y < this.mace.body.center.y && this.mace.body.velocity.y > 0) || (frauki.body.center.y > this.mace.body.center.y && this.mace.body.velocity.y < 0))
            this.mace.body.acceleration.y *= 2;

        var currVelocitySqr = this.mace.body.velocity.x * this.mace.body.velocity.x + this.mace.body.velocity.y * this.mace.body.velocity.y;

        if (currVelocitySqr > maxVelocity * maxVelocity) {
            angle = Math.atan2(this.mace.body.velocity.y, this.mace.body.velocity.x);

            this.mace.body.velocity.x = Math.cos(angle) * maxVelocity;
            this.mace.body.velocity.y = Math.sin(angle) * maxVelocity;

        }

        weaponController.attackGeometry = this.mace.body;

        if(weaponController.timers.TimerUp('mace_depletion')) {
            energyController.RemoveEnergy(0.1);
            weaponController.timers.SetTimer('mace_depletion', 200);
        }
    },
    
    Stop: function() {
        //the final activity when they release the button
        this.mace.visible = false;
        
        this.mace.body.enable = false;
        energyController.RemoveEnergy(2);
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
            
            //set direction based on which way youre holding the buttons
            if(inputController.up.isDown) {
                frauki.body.velocity.y = -500;
            } else if(inputController.crouch.isDown) {
                frauki.body.velocity.y = 500;
            }

            if(inputController.runLeft.isDown) {
                frauki.body.velocity.x = -500;
            } else if(inputController.runRight.isDown) {
                frauki.body.velocity.x = 500;
            }
            //energyController.RemoveEnergy(15);

            game.time.events.add(300, function() { frauki.states.dashing = false; } );
        }
    },
    
    Update: function() {
        //what to do while updating (only called while active)
    },
    
    Stop: function() {
        //the final activity when they release the button
    }
};
