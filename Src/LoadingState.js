var LoadingState = new Phaser.State();

LoadingState.preload = function() {
    Phaser.TilemapParser.INSERT_NULL = true;
    game.load.tilemap('Frogland', 'Data/World/Frogland.json', null, Phaser.Tilemap.TILED_JSON);
    
    game.canvas.id = 'game-canvas';
    pixel.context = game.canvas.getContext('2d');
    game.canvas.style.width = (pixel.width * pixel.scale) + "px";
    game.canvas.style.height = (pixel.height * pixel.scale) + "px";

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

    //load music
    FileMap.Music.forEach(function(music) {
        game.load.audio(music.Name, music.File);
        //game.load.binary(music.Name, music.File);
    });

    FileMap.Ambient.forEach(function(music) {
        game.load.audio(music.Name, music.File);
    });

    game.load.bitmapFont('diest64', 'Data/Sprites/diest64.png', 'Data/Sprites/diest64.fnt');

    game.renderer.renderSession.roundPixels = false;
};

LoadingState.create = function() {

    //game.add.plugin(Phaser.Plugin.Debug);

    GameData.LoadDataFromStorage();

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = 700;

    game.time.advancedTiming = true;
    game.time.desiredFps = 60;

    cameraController = new CameraController();
    inputController = new InputController();
    energyController = new EnergyController();
    audioController = new AudioController();
    triggerController = new TriggerController();
    timerUtil = new TimerUtil();
    objectController = new ObjectController();
    backdropController = new BackdropController();
    effectsController = new EffectsController();

    Frogland.Create();
    
    weaponController = new WeaponController();
    projectileController = new ProjectileController();
    speechController = new SpeechController();
    speechController.Create();

    ScriptRunner.create();

    game.state.start('GameState', false, false);

};
