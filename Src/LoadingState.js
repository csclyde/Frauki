var LoadingState = new Phaser.State();

LoadingState.preload = function() {
    this.logo = game.add.image(0, 0, 'clyde_games_logo');
    this.logo.alpha = 0;
    this.fadeTween = game.add.tween(this.logo).to({alpha: 1}, 500, Phaser.Easing.Cubic.In, true);
    
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
    });

    FileMap.Ambient.forEach(function(music) {
        game.load.audio(music.Name, music.File);
    });

    game.load.bitmapFont('diest64', 'Data/Sprites/diest64.png', 'Data/Sprites/diest64.fnt');
    game.load.bitmapFont('slapface', 'Data/Sprites/slapface_0.png', 'Data/Sprites/slapface.fnt');
    game.load.bitmapFont('magicbook', 'Data/Sprites/magicbook_0.png', 'Data/Sprites/magicbook.fnt');
    game.load.bitmapFont('ouef', 'Data/Sprites/ouef_0.png', 'Data/Sprites/ouef.fnt');
    game.load.bitmapFont('rise', 'Data/Sprites/rise_0.png', 'Data/Sprites/rise.fnt');
    game.load.bitmapFont('bubble', 'Data/Sprites/bubble_0.png', 'Data/Sprites/bubble.fnt');

    game.renderer.renderSession.roundPixels = false;
};

LoadingState.create = function() {

    //game.add.plugin(Phaser.Plugin.Debug);

    GameData.LoadDataFromStorage();

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = 700;
    game.physics.arcade.sortDirection = game.physics.arcade.TOP_BOTTOM;    

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
