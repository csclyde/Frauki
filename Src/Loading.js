var Loading = new Phaser.State();

Loading.preload = function() {

    //game.renderer.renderSession.roundPixels = true;

    // game.canvas.style['display'] = 'none';
    // pixel.canvas = scaledGame.canvas; //Phaser.Canvas.create(game.width * pixel.scale, game.height * pixel.scale);
    // pixel.context = pixel.canvas.getContext('2d');
    // //Phaser.Canvas.addToDOM(pixel.canvas);
    // //Phaser.Canvas.setSmoothingEnabled(pixel.context, false);
    // //Phaser.Canvas.setImageRenderingCrisp(pixel.canvas);
    // pixel.width = pixel.canvas.width;
    // pixel.height = pixel.canvas.height;

    // pixel.canvas.style['padding-left'] = 0;
    // pixel.canvas.style['padding-right'] = 0;
    // pixel.canvas.style['margin-left'] = 'auto';
    // pixel.canvas.style['margin-right'] = 'auto';
    // pixel.canvas.style['display'] = 'block';
    // pixel.canvas.style['width'] = pixel.canvas.width;

    /*
    padding-left: 0;
    padding-right: 0;
    margin-left: auto;
    margin-right: auto;
    display: block;
    */

    //pixel.context.drawImage(game.canvas, 0, 0, game.width, game.height, 0, 0, pixel.width, pixel.height);

    game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
    game.scale.setUserScale(pixel.scale, pixel.scale);
    
    game.load.tilemap('Frogland', 'Data/World/Frogland.json', null, Phaser.Tilemap.TILED_JSON);

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

Loading.create = function() {

    //game.add.plugin(Phaser.Plugin.Debug);

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = 800;

    game.time.desiredFps = 60;

    game.state.start('Main');
};