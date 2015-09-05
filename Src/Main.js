var Main = new Phaser.State();

Main.create = function() {

    cameraController = new CameraController();
    inputController = new InputController();
    energyController = new EnergyController();
    audioController = new AudioController();
    triggerController = new TriggerController();
    scriptRunner = new ScriptRunner();
    timerUtil = new TimerUtil();

    triggerController.Create(map);

    this.restarting = false;

    Frogland.Create();
    
    effectsController = new EffectsController();
    weaponController = new WeaponController();
    projectileController = new ProjectileController();
    energyController.Create();

    this.gamepadIcon = game.add.image(150, 150, 'UI', 'Gamepad0001');
    this.gamepadIcon.fixedToCamera = true;
    this.gamepadIcon.alpha = 0.5;

    if(game.input.gamepad.padsConnected === 0) {
        this.gamepadIcon.visible = false;
    }

    this.physicsSlowMo = 1;
};

Main.update = function() {

    frauki.UpdateAttackGeometry();
    
    Frogland.Update();

    cameraController.Update();
    inputController.Update();
    effectsController.Update();
    energyController.Update();
    projectileController.Update();
    weaponController.Update();
    triggerController.Update(Frogland.currentLayer);

    this.gamepadIcon.cameraOffset.x = Math.round(pixel.width * 0.27 + cameraController.camX / pixel.scale);
    this.gamepadIcon.cameraOffset.y = Math.round(pixel.height * 0.3 + cameraController.camY / pixel.scale) + 240;

};

Main.render = function() {
    //game.debug.body(frauki);
    //game.debug.body(frauki.attackRect);

    // Frogland.objectGroup_3.forEach(function(o) {
    //     game.debug.body(o);
    //     if(!!o.attackRect) game.debug.body(o.attackRect);
    // });

    // Frogland.door1Group.forEach(function(o) {
    //     game.debug.body(o);
    // });

    /*projectileController.projectiles.forEach(function(o) {
        game.debug.body(o);
    });*/

    // var rekt = triggerController.triggerLayers['Triggers_3'][0];
    // game.debug.geom(new Phaser.Rectangle(rekt.x, rekt.y, rekt.width, rekt.height));

    // effectsController.loadedEffects.forEach(function(o) {
    //     game.debug.geom(new Phaser.Rectangle(o.x, o.y, o.width, o.height));
    // });

    var drawX = -(pixel.width * (pixel.scale / 4));

    //set up correct camera edge behavior
    var camDistEdge = game.camera.bounds.right - (game.camera.x + game.camera.width);
    if(camDistEdge < cameraController.camX) cameraController.camX = camDistEdge;

    camDistEdge = game.camera.bounds.x - game.camera.x;
    if(camDistEdge > cameraController.camX) cameraController.camX = camDistEdge;
    
    drawX -= cameraController.camX;

    pixel.context.drawImage(
        game.canvas, 0, 0, game.width, game.height, 
        drawX + cameraController.shakeX, 
        -(pixel.height * (pixel.scale / 4)) - cameraController.camY, 
        game.width * pixel.scale, 
        game.height * pixel.scale
    );
};

Main.Restart = function() {
    if(this.restarting === true) {
        return;
    }

    events.publish('stop_all_music'); 
    events.publish('play_music', { name: 'Gameover' } ); 

    this.restarting = true;
    game.time.slowMotion = 5;
    var fadeOutTween = game.add.tween(game.world).to({alpha:0}, 1000, Phaser.Easing.Linear.None, true);

    setTimeout(function() { events.publish('play_music', { name: 'Surface' } ); }, 10000);

    fadeOutTween.onComplete.add(function() {
        Frogland.ChangeLayer(3);
        frauki.x = frauki.initialX; //fraukiSpawnX;
        frauki.y = frauki.initialY; //fraukiSpawnY;

        // cameraController.panning = true;

        // var panTween = game.add.tween( game.camera ).to( { x: frauki.initialX, y: frauki.initialy}, 2000, Phaser.Easing.Quartic.InOut, true);
        // panTween.onComplete.add(function() {
        //     cameraController.panning = false;
        // });

        frauki.state = frauki.Materializing;
        frauki.SetDirection('right');

        energyController.energy = 15;
        energyController.charge = 0;
        energyController.neutralPoint = 15;
        game.time.slowMotion = 1;
        game.world.alpha = 1;

        Main.restarting = false;

        Frogland.objectGroup_4.removeAll(true);
        Frogland.objectGroup_3.removeAll(true);
        Frogland.objectGroup_2.removeAll(true);

        Frogland.CreateObjectsLayer(4);
        Frogland.CreateObjectsLayer(3);
        Frogland.CreateObjectsLayer(2);

        effectsController.dicedPieces4 = game.add.group(Frogland.objectGroup_4);
        effectsController.dicedPieces3 = game.add.group(Frogland.objectGroup_3);
        effectsController.dicedPieces2 = game.add.group(Frogland.objectGroup_2);

        triggerController.triggerLayers['Triggers_4'].forEach(function(trig) {
            trig.enterFired = false;
            trig.stayFired = false;
            trig.exitFired = false;
        });

        triggerController.triggerLayers['Triggers_3'].forEach(function(trig) {
            trig.enterFired = false;
            trig.stayFired = false;
            trig.exitFired = false;
        });

        triggerController.triggerLayers['Triggers_3'].forEach(function(trig) {
            trig.enterFired = false;
            trig.stayFired = false;
            trig.exitFired = false;
        });

        //var cameraMoveTween = game.add.tween(game.camera)

    });
};
