InputController = function() {
    this.timers = new TimerUtil();

    this.dpad = {};
    this.dpad.up = false;
    this.dpad.down = false;
    this.dpad.left = false;
    this.dpad.right = false;

    this.currentDir = 'still';

    this.buttons = {};
    this.buttons.rShoulder = false;

    events.subscribe('player_run', function(params) { 
        if(params.dir === 'left') { inputController.dpad.left = params.run; }
        if(params.dir === 'right') { inputController.dpad.right = params.run; }
    });

    events.subscribe('control_up', function(params) { inputController.dpad.up = params.pressed; } );
    events.subscribe('player_crouch', function(params) { inputController.dpad.down = params.crouch; } );

	this.testButton = game.input.keyboard.addKey(Phaser.Keyboard.P);
    this.testButton2 = game.input.keyboard.addKey(Phaser.Keyboard.O);

    this.testButton.onDown.add(function() { events.publish('stop_all_music'); });

    this.testButton2.onDown.add(function() { 
        energyController.AddHealth(2);
        energyController.AddCharge(4);
    });

    this.binds = {};
    this.binds.jump       = Phaser.Keyboard.SPACEBAR;
    this.binds.up         = Phaser.Keyboard.UP;
    this.binds.crouch     = Phaser.Keyboard.DOWN;
    this.binds.runLeft    = Phaser.Keyboard.LEFT;
    this.binds.runRight   = Phaser.Keyboard.RIGHT;
    this.binds.slash      = Phaser.Keyboard.Z;
    this.binds.slash2     = Phaser.Keyboard.Y; //dem wacky germans
    this.binds.weapon     = Phaser.Keyboard.C;
    this.binds.roll       = Phaser.Keyboard.X;
    this.binds.shoulderR  = Phaser.Keyboard.Q;

    this.bindList = [this.binds.jump, this.binds.up, this.binds.crouch, this.binds.runLeft, this.binds.runRight, this.binds.slash, this.binds.weapon, this.binds.roll, this.binds.shoulderR];

    game.input.keyboard.onDownCallback = function(e) {

        if(e.repeat) return;

        if(Main.restarting) {
            return;
        }

        switch(e.keyCode) {

            case inputController.binds.jump:
                inputController.OnJump(true);
            break;

            case inputController.binds.up:
                inputController.OnUp(true);
            break;

            case inputController.binds.crouch:
                inputController.OnDown(true);
            break;

            case inputController.binds.runLeft:
                inputController.OnLeft(true);
            break;

            case inputController.binds.runRight:
                inputController.OnRight(true);
            break;

            case inputController.binds.slash:
            case inputController.binds.slash2:
                inputController.OnSlash(true);
            break;

            case inputController.binds.weapon:
                inputController.OnHeal(true);
            break;

            case inputController.binds.roll:
                inputController.OnRoll(true);
            break;

            case inputController.binds.shoulderR:
                inputController.OnRShoulder(true);
            break;

        }
    }

    game.input.keyboard.onUpCallback = function(e) {

        if(Main.restarting) {
            return;
        }

        switch(e.keyCode) {
            
            case inputController.binds.jump:
                inputController.OnJump(false);
            break;

            case inputController.binds.up:
                inputController.OnUp(false);
            break;

            case inputController.binds.crouch:
                inputController.OnDown(false);
            break;

            case inputController.binds.runLeft:
                inputController.OnLeft(false);
            break;

            case inputController.binds.runRight:
                inputController.OnRight(false);
            break;

            case inputController.binds.slash:
            case inputController.binds.slas2:
                inputController.OnSlash(false);
            break;

            case inputController.binds.weapon:
                inputController.OnHeal(false);
            break;

            case inputController.binds.roll:
                inputController.OnRoll(false);
            break;

            case inputController.binds.shoulderR:
                inputController.OnRShoulder(false);
            break;

        }
    }

    game.input.gamepad.start();

    game.input.gamepad.addCallbacks(this, {
        onConnect: function(){
            console.log('gamepad connected');
        },
        onDisconnect: function(){
            console.log('gamepad disconnected');
        },
        onDown: function(buttonCode, value){

            if(Main.restarting) {
                return;
            }

            switch(buttonCode) {
                case 0:
                    this.OnJump(true);
                break;

                case 1:
                    this.OnRoll(true);
                break;

                case 2:
                    this.OnSlash(true);
                break;

                case 3:
                    this.OnHeal(true);
                break;

                case 8: //select
                case 9: //start
                break;

                //case 5: //right shoulder
                case 7: //right shoulder
                    this.OnRShoulder(true);
                break;

                //case 4: //left shoulder
                case 6: //left shoulder
                break;

                case 12:
                    this.OnUp(true);
                break;

                case 13:
                    this.OnDown(true);
                break;

                case 14:
                    this.OnLeft(true);
                break;

                case 15:
                    this.OnRight(true);
                break;

            }
        },
        onUp: function(buttonCode, value){

            if(Main.restarting) {
                return;
            }
            
            switch(buttonCode) {
                case 0:
                    this.OnJump(false);
                break;

                case 1:
                    this.OnRoll(false);
                break;

                case 2:
                    this.OnSlash(false);
                break;

                case 3:
                    this.OnHeal(false);
                break;

                case 8: //select
                case 9: //start
                break;

                //case 5: //right shoulder
                case 7: //right shoulder
                    this.OnRShoulder(false);
                break;

                //case 4: //left shoulder
                case 6: //left shoulder
                break;

                case 12:
                    this.OnUp(false);
                break;

                case 13:
                    this.OnDown(false);
                break;

                case 14:
                    this.OnLeft(false);
                break;

                case 15:
                    this.OnRight(false);
                break;

            }
        },
        onAxis: function(axisState) {
        },
        onFloat: function(buttonCode, value) {
        }
    });

};

InputController.prototype.Update = function() {

    frauki.Run({dir:this.currentDir});

};

InputController.prototype.OnJump = function(pressed) {
    if(pressed) {
        events.publish('player_jump', {jump: true});
    } else {
        events.publish('player_jump', {jump: false});
    }
};

InputController.prototype.OnSlash = function(pressed) {
    if(pressed) {
        events.publish('player_slash', {});
    } else {

    }
};

InputController.prototype.OnRoll = function(pressed) {
    if(pressed) {
        events.publish('player_roll', {});
    } else {

    }
};

InputController.prototype.OnHeal = function(pressed) {
    if(pressed) {
        this.chargingApple = true;
        this.timers.SetTimer('apple_charge', 1000);

        events.publish('player_heal', { charging: true });
    } else {
        events.publish('player_heal', { charging: false });
    }
};

InputController.prototype.OnLeft = function(pressed) {
    if(pressed) {
        events.publish('player_run', {run:true, dir:'left'});

        this.currentDir = 'left';

    } else {
        events.publish('player_run', {run:false, dir: 'left'});

        if(this.dpad.right) {
            this.currentDir = 'right';
        } else {
            this.currentDir = 'still';
        }
    }
};

InputController.prototype.OnRight = function(pressed) {
    if(pressed) {
        events.publish('player_run', {run:true, dir:'right'});

        this.currentDir = 'right';
    } else {
        events.publish('player_run', {run:false, dir: 'right'});

        if(this.dpad.left) {
            this.currentDir = 'left';
        } else {
            this.currentDir = 'still';
        }
    }
};

InputController.prototype.OnUp = function(pressed) {
    if(pressed) {
        events.publish('control_up', {pressed: true});

        events.publish('activate_speech', {});

        if(frauki.body.onFloor() && frauki.body.velocity.x < PLAYER_SPEED()) {
            //switch between layers if they are in a doorway
            if(game.physics.arcade.overlap(frauki, Frogland.door1Group)) {
                if(Frogland.currentLayer === 3) Frogland.ChangeLayer(2);
                else if(Frogland.currentLayer === 2) Frogland.ChangeLayer(3);

                this.inDoorway = true;
            } else if(game.physics.arcade.overlap(frauki, Frogland.door2Group)) {
                if(Frogland.currentLayer === 3) Frogland.ChangeLayer(4);
                else if(Frogland.currentLayer === 4) Frogland.ChangeLayer(3);

                this.inDoorway = true;
            } else if(game.physics.arcade.overlap(frauki, Frogland.door3Group)) {
                if(Frogland.currentLayer === 2) Frogland.ChangeLayer(4);
                else if(Frogland.currentLayer === 4) Frogland.ChangeLayer(2);

                this.inDoorway = true;
            } else {
                this.inDoorway = false;
            }
        }
        

    } else {
        events.publish('control_up', {pressed: false});
    }
};

InputController.prototype.OnDown = function(pressed) {
    if(pressed) {
        events.publish('player_crouch', {crouch: true});
    } else {
        events.publish('player_crouch', {crouch: false});
    }
};

InputController.prototype.OnRShoulder = function(pressed) {
    if(pressed) {
        events.publish('activate_weapon', { activate: true });
        this.buttons.rShoulder = true;
    } else {
        events.publish('activate_weapon', { activate: false });
        this.buttons.rShoulder = false;
    }
};