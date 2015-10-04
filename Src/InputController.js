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

	this.jump 		= game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	this.up 		= game.input.keyboard.addKey(Phaser.Keyboard.UP);
	this.crouch 	= game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
	this.runLeft 	= game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
	this.runRight 	= game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
	this.slash		= game.input.keyboard.addKey(Phaser.Keyboard.Z);
    this.weapon     = game.input.keyboard.addKey(Phaser.Keyboard.C);
	this.roll		= game.input.keyboard.addKey(Phaser.Keyboard.X);
    this.shoulderR  = game.input.keyboard.addKey(Phaser.Keyboard.Q);
	this.testButton = game.input.keyboard.addKey(Phaser.Keyboard.P);
    this.testButton2 = game.input.keyboard.addKey(Phaser.Keyboard.O);

    this.runLeft.onDown.add(function() { events.publish('player_run', {run:true, dir:'left'}); }, this);
    this.runLeft.onUp.add(function() { events.publish('player_run', {run:false, dir: 'left'}); }, this);
    this.runRight.onDown.add(function() { events.publish('player_run', {run:true, dir:'right'}); }, this);
    this.runRight.onUp.add(function() { events.publish('player_run', {run:false, dir: 'right'}); }, this);

    this.up.onDown.add(function() { events.publish('control_up', {pressed: true}); }, this);
    this.up.onUp.add(function() { events.publish('control_up', {pressed: false}); }, this);

    this.jump.onDown.add(function() {   events.publish('player_jump', {jump: true}); }, this);
    this.jump.onUp.add(function() {     events.publish('player_jump', {jump: false}); }, this);

    this.crouch.onDown.add(function() { events.publish('player_crouch', {crouch: true}); }, this);
    this.crouch.onUp.add(function() {   events.publish('player_crouch', {crouch: false}); }, this);

    this.slash.onDown.add(function() { events.publish('player_slash', {}); }, this);
    this.roll.onDown.add(function() { events.publish('player_roll', {}); }, this);

    this.weapon.onDown.add(function() { events.publish('activate_weapon', { activate: true }); }, this);
    this.weapon.onUp.add(function() { events.publish('activate_weapon', { activate: false }); }, this);

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

    this.shoulderR.onDown.add(function() {
        weaponController.Next();
    });

    this.testButton.onDown.add(function() { 
        events.publish('stop_all_music');
    });

    this.testButton2.onDown.add(function() { 
        energyController.neutralPoint += 2;
        energyController.charge += 4;
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
