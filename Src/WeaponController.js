WeaponController = function() {
    this.weaponActive = false;
    this.attackGeometry = null;

    this.timers = new TimerUtil();

    events.subscribe('activate_weapon', this.ToggleWeapon, this);

    this.Shield.Init();
    this.Lob.Init();
    this.Saw.Init();

    this.upgradeSaves = JSON.parse(localStorage.getItem('fraukiUpgrades')) || [];

    this.upgrades = {};
    this.upgrades.lob = this.upgradeSaves.indexOf('Lob') > -1;
    this.upgrades.shield = this.upgradeSaves.indexOf('Shield') > -1;
    this.upgrades.mace = this.upgradeSaves.indexOf('Mace') > -1;
    this.upgrades.saw = this.upgradeSaves.indexOf('Saw') > -1;

    this.weaponList = [];

    if(this.upgradeSaves.indexOf('Lob') > -1) {
        this.weaponList.push(this.Lob);
    }

    if(this.upgradeSaves.indexOf('Shield') > -1) {
        this.weaponList.push(this.Shield);
    }

    if(this.upgradeSaves.indexOf('Saw') > -1) {
        this.weaponList.push(this.Saw);
    }

    this.currentWeapon = this.weaponList[0] || null;
};

WeaponController.prototype.create = function() {
  
};

WeaponController.prototype.Next = function() {
    var index = this.weaponList.indexOf(this.currentWeapon);
    if(index === this.weaponList.length - 1) {
        this.currentWeapon = this.weaponList[0];
    } else {
        this.currentWeapon = this.weaponList[index + 1];
    }
};

WeaponController.prototype.Prev = function() {
    var index = this.weaponList.indexOf(this.currentWeapon);
    if(index === 0) {
        this.currentWeapon = this.weaponList[this.weaponList.length - 1];
    } else {
        this.currentWeapon = this.weaponList[index - 1];
    }
};

WeaponController.prototype.Update = function() {
    if(this.currentWeapon != null) {
        if(this.weaponActive === true) {
            this.currentWeapon.Update();
        }
    }

    this.Shield.UpdateOverride();
    this.Lob.UpdateOverride();
    this.Saw.UpdateOverride();
};

WeaponController.prototype.ToggleWeapon = function(params) {
    this.weaponActive = params.activate;
    
    if(this.currentWeapon != null) {
        if(params.activate && frauki.timers.TimerUp('grace') && frauki.state !== frauki.Hurting) {
            this.currentWeapon.Start();
            this.weaponActive = true;
        } else if(this.weaponActive) {
            this.currentWeapon.Stop();
            this.weaponActive = false;
        }
    }
};

//returns null of there is no current attck geometry
WeaponController.prototype.GetAttackGeometry = function() {
    if(!!this.currentWeapon) {
        return this.currentWeapon.GetDamageFrame();
    }

    return null;
};

WeaponController.prototype.Bomb = {
    Init: function() {

    },

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

WeaponController.prototype.Lob = {
    FrameName: 'UpgradeIconLob',

    Init: function() {
        this.lobbies = [];
    },

    Start: function() {

        if(!energyController.UseCharge(3)) {
            return;
        }

        var lob = game.add.sprite(frauki.body.center.x + (frauki.states.direction === 'right' ? 20 : -20), frauki.body.center.y, 'Frauki');
        lob.anchor.setTo(0.5);
        game.physics.enable(lob, Phaser.Physics.ARCADE);
        lob.body.setSize(10, 10, 0, 0);
        lob.animations.add('activate', ['Lob0000', 'Lob0001', 'Lob0002'], 14, false, false);
        lob.animations.add('shit', ['Lob0000', 'Lob0001', 'Lob0002'], 14, false, false);
        lob.animations.play('activate');

        lob.scale.x = (frauki.states.direction === 'right'? 1 : -1);

        lob.body.velocity.x = frauki.body.velocity.x + 400 * (frauki.states.direction === 'right'? 1 : -1);
        lob.body.velocity.y = game.rnd.between(-50, -100);
        lob.body.gravity.y = -300;
        lob.body.collideWorldBounds = true;

        frauki.body.velocity.y -= 100;
        frauki.body.velocity.x += (frauki.states.direction === 'right'? -800 : 800);

        effectsController.EnergySplash(frauki.body.center, 80, 'neutral', 6);
        events.publish('camera_shake', {magnitudeX: 8, magnitudeY: 6, duration: 200});

        this.lobbies.push(lob);
    },
    
    Update: function() {
        //what to do while updating (only called while active)
    },
    
    Stop: function() {
        //the final activity when they release the button
    },

    GetDamageFrame: function() {
        return null;
    },

    UpdateOverride: function() {

        this.lobbies = this.lobbies.filter(function(n) { return n !== null && n.body !== null });

        var toDestroy = [];

        game.physics.arcade.collide(this.lobbies, Frogland.GetCurrentCollisionLayer(), function(l, t) {
            toDestroy.push(l);
            effectsController.EnergySplash(l.body.center, 200, 'neutral', 30, l.body.velocity);
        });

        game.physics.arcade.overlap(this.lobbies, Frogland.GetCurrentObjectGroup(), null, Collision.OverlapLobWithEnemy);

        var i = toDestroy.length;
        while(i--) {
            toDestroy[i].destroy();
            toDestroy[i] = null;
        }

        //remove dead lobs from the list
    }
};

WeaponController.prototype.Mace = {
    FrameName: 'UpgradeIconMace',

    Init: function() {

    },

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

        energyController.RemoveCharge(2);
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
            energyController.RemoveCharge(0.1);
            weaponController.timers.SetTimer('mace_depletion', 200);
        }
    },
    
    Stop: function() {
        //the final activity when they release the button
        this.mace.visible = false;
        
        this.mace.body.enable = false;
        energyController.RemoveCharge(2);
    },

    mace: null
};

WeaponController.prototype.Bubble = {
    Init: function() {

    },

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

WeaponController.prototype.Shield = {
    FrameName: 'UpgradeIconShield',

    Init: function() {
        this.forceField = game.add.sprite(0, 0, 'Misc');
        this.forceField.animations.add('activate', ['ForceField0000', 'ForceField0001', 'ForceField0002', 'ForceField0003', 'ForceField0004', 'ForceField0005'], 14, false, false);
        this.forceField.visible = false;
    },

    GetDamageFrame: function() {
        if(this.forceField.visible) {
            return this.DamageFrames[this.forceField.animations.currentFrame.name];
        } else {
            return null;
        }
    },

    Start: function() {

        if(energyController.charge >= 3 && this.forceField.visible === false) {
            this.forceField.animations.play('activate');
            this.forceField.visible = true;
            energyController.RemoveCharge(3);
        }

    },

    Update: function() {
    },

    UpdateOverride: function() {
        this.forceField.x = frauki.body.x - 43;
        this.forceField.y = frauki.body.y - 30;

        if(this.forceField.visible && this.forceField.animations.currentAnim.isFinished) {
            this.forceField.visible = false;
        }
    },

    Stop: function() {
    },

    DamageFrames: {
        'ForceField0000': {
            x: 0, y: 15, w: 10, h: 10,
            damage: 0,
            knockback: 1,
            priority: 1,
            juggle: 1
        },

        'ForceField0001': {
            x: -5, y: 10, w: 20, h: 20,
            damage: 0,
            knockback: 1,
            priority: 1,
            juggle: 1
        },

        'ForceField0002': {
            x: -14, y: -2, w: 40, h: 40,
            damage: 0,
            knockback: 1,
            priority: 1,
            juggle: 1
        },

        'ForceField0003': {
            x: -17, y: -3, w: 45, h: 45,
            damage: 0,
            knockback: 1,
            priority: 1,
            juggle: 1
        },

        'ForceField0004': {
            x: 0, y: 0, w: 10, h: 10,
            damage: 0,
            knockback: 0,
            priority: 1,
            juggle: 0
        },

        'ForceField0005': {
            x: 0, y: 0, w: 10, h: 10,
            damage: 0,
            knockback: 0,
            priority: 1,
            juggle: 0
        }
    }
};  

WeaponController.prototype.Saw = {
    FrameName: 'UpgradeIconSaw',
    
    Init: function() {
        this.saw = game.add.sprite(0, 0, 'Misc');
        this.saw.animations.add('activate', ['Saw0000', 'Saw0001', 'Saw0002', 'Saw0000', 'Saw0001', 'Saw0002', 'Saw0000', 'Saw0001', 'Saw0002'], 18, false, false);
        this.saw.visible = false;
        this.saw.alpha = 0.8;
        this.saw.anchor.x = 0.5;
    },

    GetDamageFrame: function() {
        if(this.saw.visible) {
            return this.DamageFrames[this.saw.animations.currentFrame.name];
        } else {
            return null;
        }
    },

    Start: function() {

        if(energyController.charge >= 10 && frauki.Roll()) {
            this.saw.animations.play('activate');
            this.saw.visible = true;
            energyController.RemoveCharge(10);


            if(frauki.states.direction === 'right') {
                this.saw.scale.x = 1;
            } else {
                this.saw.scale.x = -1;
            }

            events.publish('camera_shake', {magnitudeX: 12, magnitudeY: 12, duration: 600});
        }

    },

    Update: function() {
    },

    UpdateOverride: function() {
        this.saw.x = frauki.body.x + 5;
        this.saw.y = frauki.body.y - 15;

        if(this.saw.visible && this.saw.animations.currentAnim.isFinished) {
            this.saw.visible = false;
        }
    },

    Stop: function() {
    },

    DamageFrames: {

        'Saw0000': {
            x: -5, y: 10, w: 20, h: 20,
            damage: 2.5,
            knockback: 1,
            priority: 3,
            juggle: 0
        },

        'Saw0001': {
            x: -5, y: 10, w: 20, h: 20,
            damage: 2.5,
            knockback: 1,
            priority: 3,
            juggle: 0
        },

        'Saw0002': {
            x: -5, y: 10, w: 20, h: 20,
            damage: 2.5,
            knockback: 1,
            priority: 3,
            juggle: 0
        }
    }
};  

WeaponController.prototype.Jumper = {
    Init: function() {

    },

    Start: function() {
        //the initial activity when you press the button
        if(energyController.charge >= 0) {
            frauki.states.dashing = true;
            
            // //set direction based on which way youre holding the buttons
            // if(inputController.up.isDown) {
            //     frauki.body.velocity.y = -500;
            // } else if(inputController.crouch.isDown) {
            //     frauki.body.velocity.y = 500;
            // }

            // if(inputController.runLeft.isDown) {
            //     frauki.body.velocity.x = -500;
            // } else if(inputController.runRight.isDown) {
            //     frauki.body.velocity.x = 500;
            // }
            //energyController.RemoveEnergy(15);

            var vel = frauki.body.velocity.clone();
            vel = vel.normalize();
            vel.setMagnitude(500);

            frauki.body.velocity = vel;

            game.time.events.add(300, function() { frauki.states.dashing = false; } );
        }
    },
    
    Update: function() {
        //what to do while updating (only called while active)
    },
    
    Stop: function() {
        //the final activity when they release the button
    },

    GetDamageFrame: function() {
        return null;
    }
};