var Main = new Phaser.State();

Main.preload = function() {
    
    game.load.tilemap('Main', 'Data/World/Main.json', null, Phaser.Tilemap.TILED_JSON);

    //load images
    FileMap.Images.forEach(function(img) {
        game.load.image(img.Name, img.File);
    });

    //load atlases
    FileMap.Atlas.forEach(function(atlas) {
        game.load.atlasJSONHash(atlas.Name, atlas.Img, atlas.File);
    });

    //load audio
    FileMap.Audio.forEach(function(audio) {
        game.load.audio(audio.Name, audio.File);
    });
};

Main.create = function() {

    game.add.plugin(Phaser.Plugin.Debug);

    game.renderer.renderSession.roundPixels = true;

    game.canvas.style['display'] = 'none';
    pixel.canvas = Phaser.Canvas.create(game.width * pixel.scale, game.height * pixel.scale);
    pixel.context = pixel.canvas.getContext('2d');
    Phaser.Canvas.addToDOM(pixel.canvas);
    Phaser.Canvas.setSmoothingEnabled(pixel.context, false);
    Phaser.Canvas.setImageRenderingCrisp(pixel.canvas);
    pixel.width = pixel.canvas.width;
    pixel.height = pixel.canvas.height;

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = 800;

    game.time.desiredFps = 60;

    frauki = new Player(game, 64 * 16, 146 * 16, 'Frauki');
    game.add.existing(frauki);

    cameraController = new CameraController(frauki, map);
    inputController = new InputController(frauki);
    effectsController = new EffectsController();
    energyController = new EnergyController();
    audioController = new AudioController();
    weaponController = new WeaponController();
    projectileController = new ProjectileController();
    triggerController = new TriggerController();
    scriptRunner = new ScriptRunner();
    timerUtil = new TimerUtil();

    energyController.Create();
    triggerController.Create(map);

    game.camera.focusOnXY(frauki.body.x, frauki.body.y);
};

Main.update = function() {
    frauki.UpdateAttackGeometry();

    cameraController.UpdateCamera();
    inputController.UpdateInput();
    effectsController.UpdateEffects();
    energyController.UpdateEnergy();
    weaponController.Update();
    projectileController.Update();
    triggerController.Update(this.currentLayer);

};

Main.render = function() {
    //game.debug.body(frauki);
    //game.debug.body(frauki.attackRect);

    // this.objectGroup_3.forEach(function(o) {
    //     game.debug.body(o);
    // });

    /*projectileController.projectiles.forEach(function(o) {
        game.debug.body(o);
    });*/

    pixel.context.drawImage(game.canvas, 0, 0, game.width, game.height, 0, 0, pixel.width, pixel.height);
};

Main.Restart = function() {
    if(this.restarting === true) {
        return;
    }

    events.publish('stop_all_music'); 
    events.publish('play_music', { name: 'Gameover' } ); 

    this.restarting = true;
    game.time.slowMotion = 5;
    var fadeOutTween = game.add.tween(game.world).to({alpha:0}, 500, Phaser.Easing.Linear.None, true);

    fadeOutTween.onComplete.add(function() {
        Main.ChangeLayer(3);
        frauki.body.x = 100; //fraukiSpawnX;
        frauki.body.y = 100; //fraukiSpawnY;
        energyController.energy = 15;
        energyController.neutralPoint = 15;
        game.time.slowMotion = 1;
        game.world.alpha = 1;

        Main.restarting = false;

        Main['objectGroup_4'].forEach(function(e) {
            if(!!e.Respawn) {
                e.Respawn();
            }
        });

        Main['objectGroup_3'].forEach(function(e) {
            if(!!e.Respawn) {
                e.Respawn();
            }
        });

        Main['objectGroup_2'].forEach(function(e) {
            if(!!e.Respawn) {
                e.Respawn();
            }
        });
    });
};
