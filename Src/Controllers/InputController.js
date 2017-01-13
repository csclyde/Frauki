InputController = function() {
    var that = this;

    this.timers = new TimerUtil();

    this.dpad = {};
    this.dpad.up = false;
    this.dpad.down = false;
    this.dpad.left = false;
    this.dpad.right = false;

    this.tetrad = {};
    this.tetrad.top = false;
    this.tetrad.bottom = false;
    this.tetrad.left = false;
    this.tetrad.right = false;

    this.allowInput = true;

    this.currentDir = 'still';

    this.buttons = {};
    this.buttons.rShoulder = false;

	this.testButton = game.input.keyboard.addKey(Phaser.Keyboard.P);
    this.testButton2 = game.input.keyboard.addKey(Phaser.Keyboard.O);

    this.testButton.onDown.add(function() { events.publish('stop_all_music'); });

    this.testButton2.onDown.add(function() { 
        
        console.log('tet')
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
    
    this.disallowInput = function() {
        this.allowInput = false;
    };

    this.allowInput = function() {
        this.allowInput = true;
    };

    events.subscribe('allow_input', this.allowInput, this);
    events.subscribe('disallow_input', this.disallowInput, this);

    game.input.keyboard.onDownCallback = function(e) {

        if(e.repeat) return;

        if(Main.restarting || !that.allowInput) {
            return;
        }

        switch(e.keyCode) {

            case Phaser.Keyboard.P:
                // energyController.AddHealth(2);
                // energyController.AddCharge(2);

                localStorage.setItem('save_data', '');
            break;

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
                //inputController.OnHeal(true);
                inputController.OnThrow(true);
            break;

            case inputController.binds.roll:
                inputController.OnRoll(true);
            break;

            case inputController.binds.shoulderR:
                inputController.OnHeal(true);
            break;

        }
    };

    game.input.keyboard.onUpCallback = function(e) {

        if(Main.restarting || !that.allowInput) {
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
                //inputController.OnHeal(false);
                inputController.OnThrow(false);
            break;

            case inputController.binds.roll:
                inputController.OnRoll(false);
            break;

            case inputController.binds.shoulderR:
                inputController.OnHeal(false);
            break;

        }
    };

    game.input.gamepad.start();

    game.input.gamepad.addCallbacks(this, {
        onConnect: function(){
            console.log('gamepad connected');
        },
        onDisconnect: function(){
            console.log('gamepad disconnected');
        },
        onDown: function(buttonCode, value){
            if(Main.restarting || !this.allowInput) {
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
                    //this.OnHeal(true);
                    this.OnThrow(true);
                break;

                //case 5: //right shoulder
                case 7: //right shoulder
                    this.OnHeal(true);
                break;

                //case 4: //left shoulder
                case 6: //left shoulder
                break;

                case 9: //start
                console.log('fjdfsdfsdfs')
                    this.OnStart(true);
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

            if(Main.restarting || !this.allowInput) {
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
                    //this.OnHeal(false);
                    this.OnThrow(false);
                break;

                case 9: //start
                    this.OnStart(false);
                break;

                //case 5: //right shoulder
                case 7: //right shoulder
                    this.OnHeal(false);
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
    this.tetrad.bottom = pressed;

    if(game.state.getCurrentState() === Main) {
        if(pressed) {
            events.publish('player_jump', {jump: true});
        } else {
            events.publish('player_jump', {jump: false});
        }
    } else if(game.state.getCurrentState() === Upgrading) {

    }
};

InputController.prototype.OnSlash = function(pressed) {
    this.tetrad.left = pressed;

    if(game.state.getCurrentState() === Main) {
        if(pressed) {
            events.publish('player_slash', {});
        } else {
            events.publish('player_release_slash', {});

        }
    } else if(game.state.getCurrentState() === Upgrading) {
        
    }
};

InputController.prototype.OnThrow = function(pressed) {
    this.tetrad.top = pressed;

    if(game.state.getCurrentState() === Main) {
        if(pressed) {
            events.publish('activate_weapon', { activate: true, override: false });
        } else {
            events.publish('activate_weapon', { activate: false, override: false });

        }
    } else if(game.state.getCurrentState() === Upgrading) {
        
    }
};

InputController.prototype.OnRoll = function(pressed) {
    this.tetrad.right = pressed;

    if(game.state.getCurrentState() === Main) {
        if(pressed) {
            events.publish('player_roll', {});
        } else {

        }
    } else if(game.state.getCurrentState() === Upgrading) {
        events.publish('exit_upgrades', {});
    }
};

InputController.prototype.OnHeal = function(pressed) {
    if(game.state.getCurrentState() === Main) {
        if(pressed) {
            this.chargingApple = true;
            this.timers.SetTimer('apple_charge', 1000);

            events.publish('player_heal', { charging: true });
        } else {
            events.publish('player_heal', { charging: false });
        }
    } else if(game.state.getCurrentState() === Upgrading) {
        
    }
};

InputController.prototype.OnLeft = function(pressed) {
    this.dpad.left = pressed;

    if(game.state.getCurrentState() === Main) {

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
    } else if(game.state.getCurrentState() === Upgrading) {
        
    }
};

InputController.prototype.OnRight = function(pressed) {
    this.dpad.right = pressed;

    if(game.state.getCurrentState() === Main) {

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
    } else if(game.state.getCurrentState() === Upgrading) {
        
    }
};

InputController.prototype.OnUp = function(pressed) {
    this.dpad.up = pressed;

    if(game.state.getCurrentState() === Main) {
        if(pressed) {
            events.publish('control_up', {pressed: true});

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
    } else if(game.state.getCurrentState() === Upgrading) {
        
    }
};

InputController.prototype.OnDown = function(pressed) {
    this.dpad.down = pressed;

    if(game.state.getCurrentState() === Main) {
        if(pressed) {
            events.publish('player_crouch', {crouch: true});
        } else {
            events.publish('player_crouch', {crouch: false});
        }
    } else if(game.state.getCurrentState() === Upgrading) {
        
    }
};

InputController.prototype.OnRShoulder = function(pressed) {
    this.buttons.rShoulder = pressed;

    this.OnHeal(pressed);

    if(game.state.getCurrentState() === Main) {
        if(pressed) {
            
        } else {
            
        }
    } else if(game.state.getCurrentState() === Upgrading) {
        
    }
};

InputController.prototype.OnStart = function(pressed) {

    if(game.state.getCurrentState() === Main) {
        if(pressed) {
            //GameData.SetFlashCopy();
        } else {
            
        }
    } else if(game.state.getCurrentState() === Upgrading) {
        
    }
};