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
    
    energyController.Create();
    effectsController = new EffectsController();
    projectileController = new ProjectileController();

    this.gamepadIcon = game.add.image(150, 150, 'UI', 'Gamepad0001');
    this.gamepadIcon.fixedToCamera = true;
    this.gamepadIcon.alpha = 0.5;

    if(game.input.gamepad.padsConnected === 0) {
        this.gamepadIcon.visible = false;
    }
};

Main.update = function() {

    frauki.UpdateAttackGeometry();
    
    Frogland.Update();

    cameraController.UpdateCamera();
    inputController.UpdateInput();
    effectsController.UpdateEffects();
    energyController.UpdateEnergy();
    projectileController.Update();
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

    pixel.context.drawImage(
        game.canvas, 0, 0, game.width, game.height, 
        -(pixel.width * (pixel.scale / 4)) - cameraController.camX, 
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

    fadeOutTween.onComplete.add(function() {
        Frogland.ChangeLayer(3);
        frauki.x = frauki.initialX; //fraukiSpawnX;
        frauki.y = frauki.initialY; //fraukiSpawnY;
        energyController.energy = 15;
        energyController.charge = 0;
        energyController.neutralPoint = 15;
        game.time.slowMotion = 1;
        game.world.alpha = 1;

        //Main.restarting = false;

        Frogland.objectGroup_4.destroy();
        Frogland.objectGroup_3.destroy();
        Frogland.objectGroup_2.destroy();

        Frogland.CreateObjectsLayer(4);
        Frogland.CreateObjectsLayer(3);
        Frogland.CreateObjectsLayer(2);

        var cameraMoveTween = game.add.tween(game.camera)

    });
};
