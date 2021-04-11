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

    this.allowInput = false;

    this.currentDir = 'still';

    this.buttons = {};
    this.buttons.rShoulder = false;

	this.testButton = game.input.keyboard.addKey(Phaser.Keyboard.P);
    this.testButton2 = game.input.keyboard.addKey(Phaser.Keyboard.O);

    var keybinds = game.cache.getJSON('keybinds');
    this.binds = {};
    this.binds.pause      = Phaser.Keyboard[keybinds['pause']];
    this.binds.jump       = Phaser.Keyboard[keybinds['jump']];
    this.binds.up         = Phaser.Keyboard[keybinds['up']];
    this.binds.crouch     = Phaser.Keyboard[keybinds['down']];
    this.binds.runLeft    = Phaser.Keyboard[keybinds['left']];
    this.binds.runRight   = Phaser.Keyboard[keybinds['right']];
    this.binds.slash      = Phaser.Keyboard[keybinds['attack']];
    this.binds.weapon     = Phaser.Keyboard[keybinds['heal']];
    this.binds.roll       = Phaser.Keyboard[keybinds['roll']];

    events.subscribe('allow_input', this.AllowInput, this);
    events.subscribe('disallow_input', this.DisallowInput, this);

    game.input.keyboard.onDownCallback = function(e) {
        if(e.repeat) return;

        if(GameState.restarting) {
            return;
        }

        switch(e.keyCode) {

            case Phaser.Keyboard.P:
                localStorage.setItem('save_data', '');
            break;

            case Phaser.Keyboard.O:
                energyController.invincible = true;
            break;

            case Phaser.Keyboard.Q:
                GameData.SetDebugPos(frauki.x, frauki.y);
            break;

            case Phaser.Keyboard.W:
                GameData.SetDebugPos(0, 0);
            break;

            case inputController.binds.pause:
                inputController.OnPause(true);
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
                inputController.OnHeal(true);
            break;

            case inputController.binds.roll:
                inputController.OnRoll(true);
            break;
        }
    };

    game.input.keyboard.onUpCallback = function(e) {

        
        if(GameState.restarting) {
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
            case inputController.binds.shoulderR2:
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
            if(GameState.restarting) {
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
                    //this.OnThrow(true);
                break;

                //case 5: //right shoulder
                case 7: //right shoulder
                break;

                //case 4: //left shoulder
                case 6: //left shoulder
                break;

                case 9: //start
                    this.OnPause(true);
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

            if(GameState.restarting) {
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

InputController.prototype.Reset = function() {
    this.OnLeft(false);
    this.OnRight(false);
    this.OnUp(false);
    this.OnDown(false);    
};

InputController.prototype.DisallowInput = function() {
    this.OnJump(false);
    this.OnSlash(false);
    this.OnThrow(false);
    this.OnRoll(false);
    this.OnHeal(false);
    this.OnLeft(false);
    this.OnRight(false);
    this.OnUp(false);
    this.OnDown(false);
    this.OnRShoulder(false);
    this.OnStart(false);
    this.currentDir = 'still';

    this.allowInput = false;
};

InputController.prototype.AllowInput = function() {
    this.allowInput = true;

    if(this.dpad.left) this.OnLeft(true);
    if(this.dpad.right) this.OnRight(true);
    if(this.dpad.up) this.OnUp(true);
    if(this.dpad.down) this.OnDown(true);
};

InputController.prototype.OnPause = function(pressed) {

    if(this.allowInput && pressed && !GameState.inMenu) {      
        events.publish('pause_game', {});
        //events.publish('advance_text', {});
    }
};


InputController.prototype.OnJump = function(pressed) {
    this.tetrad.bottom = pressed;

    if(pressed) {
        events.publish('select_menu_option', {});
        events.publish('advance_text', {});
    }

    if(this.allowInput) {
        if(pressed) {
            events.publish('player_jump', {jump: true});
        } else {
            events.publish('player_jump', {jump: false});
        }
    } 
};

InputController.prototype.OnSlash = function(pressed) {
    this.tetrad.left = pressed;

    if(this.allowInput && !speechController.SpeechVisible()) {
        if(pressed) {
            events.publish('player_slash', {});
        } else {
            events.publish('player_release_slash', {});

        }
    }

    if(pressed) {
        events.publish('select_menu_option', {});
        events.publish('advance_text', {});
    }
};

InputController.prototype.OnThrow = function(pressed) {
    this.tetrad.top = pressed;

    if(pressed) {
        events.publish('select_menu_option', {});
        events.publish('advance_text', {});
    }

    if(this.allowInput) {
        if(pressed) {
            events.publish('activate_weapon', { activate: true, override: false });
        } else {
            events.publish('activate_weapon', { activate: false, override: false });

        }
    }
};

InputController.prototype.OnRoll = function(pressed) {
    this.tetrad.right = pressed;

    if(pressed) {
        events.publish('select_menu_option', {});
        events.publish('advance_text', {});
    }

    if(this.allowInput) {
        if(pressed) {
            events.publish('player_roll', {});
        } else {

        }
    }
};

InputController.prototype.OnHeal = function(pressed) {
    if(this.allowInput) {
        if(pressed) {
            events.publish('player_heal', { charging: true });
            events.publish('advance_text', {});
        } else {
            //events.publish('player_heal', { charging: false });
        }
    }
};

InputController.prototype.OnLeft = function(pressed) {
    this.dpad.left = pressed;

    if(pressed) {
        events.publish('settings_change', { dir: 'down' });
        events.publish('advance_text', {});        
    }

    if(this.allowInput) {

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
    }
};

InputController.prototype.OnRight = function(pressed) {
    this.dpad.right = pressed;

    if(pressed) {
        events.publish('settings_change', { dir: 'up' });
        events.publish('advance_text', {});        
    }

    if(this.allowInput) {

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
    }
};

InputController.prototype.OnUp = function(pressed) {
    this.dpad.up = pressed;

    if(pressed) {
        events.publish('menu_change', { dir: 'up' });
        events.publish('advance_text', {});        
    }

    if(this.allowInput) {
        if(pressed) {
            events.publish('control_up', {pressed: true});
        } else {
            events.publish('control_up', {pressed: false});
        }
    }
};

InputController.prototype.OnDown = function(pressed) {
    this.dpad.down = pressed;

    if(pressed) {
        events.publish('menu_change', { dir: 'down' });
        events.publish('advance_text', {});        
    }

    if(this.allowInput) {
        if(pressed) {
            events.publish('player_crouch', {crouch: true});
        } else {
            events.publish('player_crouch', {crouch: false});
        }
    }
};

InputController.prototype.OnRShoulder = function(pressed) {
    this.buttons.rShoulder = pressed;


    if(this.allowInput) {
        this.OnHeal(pressed);

        if(pressed) {
            
        } else {
            
        }
    }
};

InputController.prototype.OnStart = function(pressed) {

    if(this.allowInput) {
        if(pressed) {
            
        } else {
            
        }
    }
};