InputController = function() {
    this.timers = new TimerUtil();

    this.dpad = {};
    this.dpad.up = false;
    this.dpad.down = false;
    this.dpad.left = false;
    this.dpad.right = false;

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
        energyController.neutralPoint += 2;
        energyController.charge += 4;
    });

    this.binds = {};
    this.binds.jump       = Phaser.Keyboard.SPACEBAR;
    this.binds.up         = Phaser.Keyboard.UP;
    this.binds.crouch     = Phaser.Keyboard.DOWN;
    this.binds.runLeft    = Phaser.Keyboard.LEFT;
    this.binds.runRight   = Phaser.Keyboard.RIGHT;
    this.binds.slash      = Phaser.Keyboard.Z;
    this.binds.weapon     = Phaser.Keyboard.C;
    this.binds.roll       = Phaser.Keyboard.X;
    this.binds.shoulderR  = Phaser.Keyboard.Q;

    this.bindList = [this.binds.jump, this.binds.up, this.binds.crouch, this.binds.runLeft, this.binds.runRight, this.binds.slash, this.binds.weapon, this.binds.roll, this.binds.shoulderR];

    game.input.keyboard.onDownCallback = function(e) {

        if(e.repeat) return;

        if(Main.restarting) {
            return;
        }

        // if(this.mappingMode) {
        //     //assign the keycode to the current key
        //     //advance the key index

        //     //if the index is the length of the key array, reset it and exit mapping mode

        //     return;
        // }

        switch(e.keyCode) {

            case inputController.binds.jump:
                events.publish('player_jump', {jump: true});
            break;

            case inputController.binds.up:
                events.publish('control_up', {pressed: true});
            break;

            case inputController.binds.crouch:
                events.publish('player_crouch', {crouch: true});
            break;

            case inputController.binds.runLeft:
                events.publish('player_run', {run:true, dir:'left'});
            break;

            case inputController.binds.runRight:
                events.publish('player_run', {run:true, dir:'right'});
            break;

            case inputController.binds.slash:
                events.publish('player_slash', {});
            break;

            case inputController.binds.weapon:
                events.publish('activate_weapon', { activate: true });
            break;

            case inputController.binds.roll:
                events.publish('player_roll', {});
            break;

            case inputController.binds.shoulderR:
                weaponController.Next();
            break;

        }
    }

    game.input.keyboard.onUpCallback = function(e) {

        if(Main.restarting) {
            return;
        }

        switch(e.keyCode) {
            
            case inputController.binds.jump:
                events.publish('player_jump', {jump: false});
            break;

            case inputController.binds.up:
                events.publish('control_up', {pressed: false});
            break;

            case inputController.binds.crouch:
                events.publish('player_crouch', {crouch: false});
            break;

            case inputController.binds.runLeft:
                events.publish('player_run', {run:false, dir: 'left'});
            break;

            case inputController.binds.runRight:
                events.publish('player_run', {run:false, dir: 'right'});
            break;

            case inputController.binds.slash:
            break;

            case inputController.binds.weapon:
                events.publish('activate_weapon', { activate: false });
            break;

            case inputController.binds.roll:
            break;

            case inputController.binds.shoulderR:
            break;

        }
    }

    events.subscribe('control_up', function(params) { 

        if(params.pressed === false) {
            return;
        }

        events.publish('activate_speech', {});

        if(!frauki.body.onFloor()) {
            return;
        }
        
        //switch between layers if they are in a doorway
        if(game.physics.arcade.overlap(frauki, Frogland.door1Group)) {
            if(Frogland.currentLayer === 3) Frogland.ChangeLayer(2);
            else if(Frogland.currentLayer === 2) Frogland.ChangeLayer(3);
        } else if(game.physics.arcade.overlap(frauki, Frogland.door2Group)) {
            if(Frogland.currentLayer === 3) Frogland.ChangeLayer(4);
            else if(Frogland.currentLayer === 4) Frogland.ChangeLayer(3);
        } else if(game.physics.arcade.overlap(frauki, Frogland.door3Group)) {
            if(Frogland.currentLayer === 2) Frogland.ChangeLayer(4);
            else if(Frogland.currentLayer === 4) Frogland.ChangeLayer(2);
        }

    });

   

    game.input.gamepad.start();

    game.input.gamepad.addCallbacks(this, {
        onConnect: function(){
            console.log('gamepad connected');
            Main.gamepadIcon.visible = true;
        },
        onDisconnect: function(){
            console.log('gamepad disconnected');
            Main.gamepadIcon.visible = false;
        },
        onDown: function(buttonCode, value){

            if(Main.restarting) {
                return;
            }

            switch(buttonCode) {
                case 0:
                    events.publish('player_jump', {jump: true});
                break;

                case 1:
                    events.publish('player_roll', {});
                break;

                case 2:
                    events.publish('player_slash', {});
                break;

                case 3:
                    events.publish('activate_weapon', { activate: true });
                break;

                case 8: //select
                case 9: //start
                    events.publish('activate_speech', {});
                break;

                case 5: //right shoulder
                    weaponController.Next();
                    break;
                case 7: //right shoulder
                break;

                case 4: //left shoulder
                    weaponController.Prev();
                    break;
                case 6: //left shoulder

                break;

                case 12:
                    events.publish('control_up', {pressed: true});
                break;

                case 13:
                    events.publish('player_crouch', {crouch: true});
                break;

                case 14:
                    events.publish('player_run', {run:true, dir: 'left'});
                break;

                case 15:
                    events.publish('player_run', {run:true, dir:'right'});
                break;

            }
        },
        onUp: function(buttonCode, value){

            if(Main.restarting) {
                return;
            }
            
            switch(buttonCode) {
                case 0:
                    events.publish('player_jump', {jump: false});
                break;

                case 1:
                break;

                case 2:
                break;

                case 3:
                    events.publish('activate_weapon', { activate: false });
                break;

                case 8: //select
                case 9: //start
                break;

                case 5: //right shoulder
                case 7: //right shoulder
                break;

                case 4: //left shoulder
                case 6: //left shoulder

                break;

                case 12:
                    events.publish('control_up', {pressed: false});
                break;

                case 13:
                    events.publish('player_crouch', {crouch: false});
                break;

                case 14:
                    events.publish('player_run', {run:false, dir: 'left'});
                break;

                case 15:
                    events.publish('player_run', {run:false, dir:'right'});
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

	if (this.dpad.left) {
        frauki.Run({dir:'left'});
    }
    else if (this.dpad.right) {
        frauki.Run({dir:'right'});
    }
    else {
    	frauki.Run({dir:'still'});
    }
};
