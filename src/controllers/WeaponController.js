WeaponController = function() {
    this.weaponActive = false;
    this.attackGeometry = null;

    this.timers = new TimerUtil();

    events.subscribe('activate_weapon', this.ToggleWeapon, this);


    this.runes = [];

};

WeaponController.prototype.Create = function() {
    this.weaponGroup = game.add.group(Frogland.froglandGroup, 'weapons');
    
    this.Baton.Init();    
};

WeaponController.prototype.Update = function() {
    if(this.currentWeapon != null) {
        this.currentWeapon.Update();
    }
};

WeaponController.prototype.ToggleWeapon = function(params) {
    this.weaponActive = params.activate;
    
    //if they have a weapon
    if(this.currentWeapon != null) {
        //and the toggle is to activate it
        if(params.activate && frauki.state !== frauki.Hurting && (!frauki.InAttackAnim() || params.override)) {
            events.publish('play_sound', { name: 'no_energy', restart: true });
        //otherwise, if the toggle is to deactivate it
        } else {
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

WeaponController.prototype.Baton = {
    Init: function() {
        this.baton = game.add.sprite(frauki.body.center.x + (frauki.states.direction === 'right' ? 20 : -20), frauki.body.center.y, 'Frauki');
        weaponController.weaponGroup.add(this.baton);
        this.baton.name = 'baton';
        this.baton.anchor.setTo(0.5);
        game.physics.enable(this.baton, Phaser.Physics.ARCADE);
        this.baton.body.gravity.y = -700;
        this.baton.body.setSize(30, 30, 0, 0);
        this.baton.body.bounce.setTo(1);
        this.baton.animations.add('baton1', ['Baton00000', 'Baton00001', 'Baton00002', 'Baton00003', 'Baton00004', 'Baton00005'], 30, true, false);
        this.baton.animations.add('baton2', ['Baton10000', 'Baton10001', 'Baton10002'], 30, true, false);
        this.baton.animations.add('baton3', ['Baton20000', 'Baton20001', 'Baton20002'], 30, true, false);
        this.baton.animations.add('baton4', ['Baton30000', 'Baton30001', 'Baton30002'], 30, true, false);
        this.baton.animations.play('baton1');
        this.baton.visible = false;
    },

    Start: function() {
        if(!frauki.states.throwing) {
            //the initial activity when you press the button
            game.time.events.add(200, this.ThrowBaton, this);

            events.publish('player_throw', {});
        }
    },
    
    Update: function() {
        if(this.baton && this.baton.visible) {
            
            var vel = 800;
            var maxVelocity = 900 + this.baton.chargeLevel * 100;

            if(weaponController.timers.TimerUp('min_throw_time') && this.baton.body.x > frauki.body.x && this.baton.body.x < frauki.body.x + frauki.body.width && this.baton.body.y > frauki.body.y && this.baton.body.y < frauki.body.y + frauki.body.height) {
                events.publish('play_sound', {name: 'baton_catch', restart: true });
                effectsController.EnergySplash(frauki.body, 150, 'positive', 5 + 5 * this.baton.chargeLevel);

                this.ResetBaton();

                return;
            }

            var xDist = this.baton.body.center.x - frauki.body.center.x;
            var yDist = this.baton.body.center.y - frauki.body.center.y;

            var angle = Math.atan2(yDist, xDist); 
            this.baton.body.acceleration.x = Math.cos(angle) * -vel;// - (xDist * 5);    
            this.baton.body.acceleration.y = Math.sin(angle) * -vel;// - (yDist * 5);

            if((frauki.body.center.x < this.baton.body.center.x && this.baton.body.velocity.x > 0) || (frauki.body.center.x > this.baton.body.center.x && this.baton.body.velocity.x < 0))
                this.baton.body.acceleration.x *= 5;

            if((frauki.body.center.y < this.baton.body.center.y && this.baton.body.velocity.y > 0) || (frauki.body.center.y > this.baton.body.center.y && this.baton.body.velocity.y < 0))
                this.baton.body.acceleration.y *= 5;


            if (this.baton.body.velocity.getMagnitude() > maxVelocity) {
                this.baton.body.velocity.setMagnitude(maxVelocity);
            }
        }
        
    },
    
    Stop: function() {
        //the final activity when they release the button
        
    },

    GetDamageFrame: function() {
        var damage = 0;

        if(this.baton.chargeLevel > 0) {
            damage++;
        }

        if(this.baton.chargeLevel === 4) {
            damage++;
        }

        if(this.baton && this.baton.visible) {
            var currentAttack = { 
                damage: 0.1 + damage,
                knockback: this.baton.chargeLevel / 4,
                priority: this.baton.chargeLevel,
                juggle: this.baton.chargeLevel / 4,

                x: this.baton.body.x,
                y: this.baton.body.y, 
                w: this.baton.body.width,
                h: this.baton.body.height
            }

            return currentAttack;
        } else {
            return null;
        }
    },

    ThrowBaton: function() {

        this.baton.chargeLevel = 3;

        this.baton.animations.play('baton' + this.baton.chargeLevel);
        events.publish('play_sound', {name: 'baton_throw_' + this.baton.chargeLevel });

        this.baton.x = frauki.body.center.x + (frauki.states.direction === 'right' ? 20 : -20);
        this.baton.y = frauki.body.center.y - 20;

        this.baton.scale.x = frauki.scale.x;

        if(frauki.states.direction === 'left') {
            this.baton.body.velocity.x = -1200;
        } else {
            this.baton.body.velocity.x = 1200;
        }

        this.baton.body.velocity.y = -60;

        if(inputController.dpad.up) {
            this.baton.body.velocity.y -= 500;
        }

        if(inputController.dpad.down) {
            this.baton.body.velocity.y += 500;
        }

        this.baton.body.velocity.x += frauki.body.velocity.x;
        this.baton.body.velocity.y += frauki.body.velocity.y;

        this.baton.visible = true;


        weaponController.timers.SetTimer('min_throw_time', 200);
        weaponController.timers.SetTimer('max_throw_time', 3000);
    },

    ResetBaton: function() {
        this.baton.visible = false;
        this.baton.body.velocity.setTo(0);
        this.baton.body.acceleration.setTo(0);
        frauki.states.throwing = false;

        events.publish('stop_sound', {name: 'baton_throw_0'});
        events.publish('stop_sound', {name: 'baton_spin_0'});
        events.publish('stop_sound', {name: 'baton_throw_1'});
        events.publish('stop_sound', {name: 'baton_spin_1'});
        events.publish('stop_sound', {name: 'baton_throw_2'});
        events.publish('stop_sound', {name: 'baton_spin_2'});
        events.publish('stop_sound', {name: 'baton_throw_3'});
        events.publish('stop_sound', {name: 'baton_spin_3'});
        events.publish('stop_sound', {name: 'baton_throw_4'});
        events.publish('stop_sound', {name: 'baton_spin_4'});
    },

    UpgradeThrow: function() {
        // events.publish('stop_sound', {name: 'baton_throw_0'});
        // events.publish('stop_sound', {name: 'baton_spin_0'});
        // events.publish('stop_sound', {name: 'baton_throw_1'});
        // events.publish('stop_sound', {name: 'baton_spin_1'});
        // events.publish('stop_sound', {name: 'baton_throw_2'});
        // events.publish('stop_sound', {name: 'baton_spin_2'});
        // events.publish('stop_sound', {name: 'baton_throw_3'});
        // events.publish('stop_sound', {name: 'baton_spin_3'});
        // events.publish('stop_sound', {name: 'baton_throw_4'});
        // events.publish('stop_sound', {name: 'baton_spin_4'});

        this.baton.chargeLevel += 1;
        this.baton.animations.play('baton' + this.baton.chargeLevel);

        // events.publish('play_sound', {name: 'baton_spin_' + this.baton.chargeLevel });
        // events.publish('play_sound', { name: 'gain_energy_' + this.baton.chargeLevel });
    }
};
