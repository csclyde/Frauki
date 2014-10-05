var Frogland = new Phaser.State();

Frogland.preload = function() {
	
    game.load.atlasJSONHash('Frauki', 'Data/Frauki/Frauki.png', 'Data/Frauki/Frauki.json');
    game.load.tilemap('Frogland', 'Data/Locations/Frogland/Frogland.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('FroglandTiles', 'Data/Locations/Frogland/Frogland.png');
    game.load.image('TerraceTiles', 'Data/Locations/Frogland/Infinite Terrace.png');
    game.load.image('DoodadTiles', 'Data/Locations/Frogland/Frogland Doodads.png');
    game.load.image('SpawnKey', 'Data/Locations/SpawnKey.png');
    game.load.image('Background', 'Data/Locations/Frogland/Sky.png');
    game.load.image('parallax1', 'Data/Locations/Frogland/Parallax1.png');
    game.load.image('parallax2', 'Data/Locations/Frogland/Parallax2.png');
    game.load.image('fluff', 'Data/Fluff.png');

    game.load.image('RedParticles', 'Data/Hit Particles.png');
    game.load.image('YellowParticles', 'Data/Yellow Particles.png');
    game.load.image('Spore', 'Data/Enemies/Sporoid/Spore.png');

    game.load.atlasJSONHash('Insectoid', 'Data/Enemies/Insectoid/Insectoid.png', 'Data/Enemies/Insectoid/Insectoid.json');
    game.load.atlasJSONHash('Buzzar', 'Data/Enemies/Buzzar/Buzzar.png', 'Data/Enemies/Buzzar/Buzzar.json');
    game.load.atlasJSONHash('Sporoid', 'Data/Enemies/Sporoid/Sporoid.png', 'Data/Enemies/Sporoid/Sporoid.json');

    game.scale.minWidth = 1024;
    game.scale.minHeight = 576;
    game.scale.pageAlignHorizontally = true;
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.setSize();

    game.time.advancedTiming = true;

}

var map;
var tileset;
var backgroundLayer;
var midgroundLayer;
var foregroundLayer;
var bg;
var parallax1, parallax2;
var cameraController;
var inputController;
var effectsController;
var energyController;
var frauki;
var fraukiSpawnX, fraukiSpawnY;

var energyText;

var playerX, playerY;

var previousCamX;

Frogland.create = function() {

    game.canvas.style['display'] = 'none';
    pixel.canvas = Phaser.Canvas.create(game.width * pixel.scale, game.height * pixel.scale);
    pixel.context = pixel.canvas.getContext('2d');
    Phaser.Canvas.addToDOM(pixel.canvas);
    Phaser.Canvas.setSmoothingEnabled(pixel.context, false);
    pixel.width = pixel.canvas.width;
    pixel.height = pixel.canvas.height;

	game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = 680;
    game.time.deltaCap = 0.016;

    bg = game.add.tileSprite(0, 0, 512, 288, 'Background');
    bg.fixedToCamera = true;

    parallaxLayer1 = game.add.tileSprite(0, 0, 512, 288, "parallax1");
    parallaxLayer1.fixedToCamera = true;

    parallaxLayer2 = game.add.tileSprite(0, 0, 512, 288, "parallax2");
    parallaxLayer2.fixedToCamera = true;

    map = game.add.tilemap('Frogland');
    map.addTilesetImage('FroglandTiles');
    map.addTilesetImage('TerraceTiles');
    map.addTilesetImage('DoodadTiles');
    map.addTilesetImage('SpawnKey');
   
    backgroundLayer = map.createLayer('Background');
    midgroundLayer = map.createLayer('Midground');
    
    midgroundLayer.resizeWorld();

    map.setCollision([71, 72, 73, 74, 75, 76, 82, 83, 84, 87, 88, 89, 91, 92, 93, 94, 95, 96, 102, 103, 104, 107, 108, 109, 112, 113, 114, 127, 128, 129, 131, 132, 133, 134, 147, 148, 149, 152, 153, 154, 181, 182, 183, 184, 185], true, 'Midground');

    var fraukiTile = map.searchTileIndex(1041, 0, false, 'Midground');
    fraukiSpawnX = fraukiTile.worldX || 0;
    fraukiSpawnY = fraukiTile.worldY || 0;

    frauki = new Player(game, fraukiSpawnX, fraukiSpawnY, 'Frauki');
    game.add.existing(frauki);

    //create the enemies
    this.enemyGroup = game.add.group();
    this.enemyGroup.enableBody = true;

    map.createFromObjects('Enemies', 1061, 'Insectoid', 'Hop0000', true, false, this.enemyGroup, Enemy);
    map.createFromObjects('Enemies', 1062, 'Buzzar', 'Sting0000', true, false, this.enemyGroup, Enemy);
    map.createFromObjects('Enemies', 1063, 'Sporoid', 'Sporoid0000', true, false, this.enemyGroup, Enemy);
    
    foregroundLayer = map.createLayer('Foreground');

    cameraController = new CameraController(frauki, map);
    inputController = new InputController(frauki);
    effectsController = new EffectsController();
    energyController = new EnergyController();

    game.camera.focusOnXY(frauki.body.x, frauki.body.y);

    energyText = game.add.text(0, 0, '', {font: "10px Arial", fill: "#ff0044"});
    energyText.fixedToCamera = true;
};

Frogland.update = function() {
    frauki.UpdateAttackGeometry();

	game.physics.arcade.collide(frauki, midgroundLayer);
    game.physics.arcade.collide(this.enemyGroup, midgroundLayer);

    game.physics.arcade.collide(this.enemyGroup, this.enemyGroup);

    if(!frauki.Attacking() && !frauki.Grace()) {
        game.physics.arcade.overlap(frauki, this.enemyGroup, frauki.Hit, null, frauki);
    }
    else if(!!frauki.attackRect && frauki.attackRect.width !== 0) {
        game.physics.arcade.overlap(frauki.attackRect, this.enemyGroup, EnemyHit);
    }

    cameraController.UpdateCamera();
    inputController.UpdateInput();
    //effectsController.UpdateEffects();
    energyController.UpdateEnergy();

    playerX = frauki.body.x;
    playerY = frauki.body.y;

    energyText.setText('Energy: ' + energyController.GetEnergy() + ' Neutral: ' + energyController.GetNeutral() + ' FPS: ' + game.time.fps);
};

Frogland.render = function() {
    //game.debug.body(frauki);
    //game.debug.body(frauki.attackRect);

    this.enemyGroup.forEach(function(e) {
        game.debug.body(e);
    });

    pixel.context.drawImage(game.canvas, 0, 0, game.width, game.height, 0, 0, pixel.width, pixel.height);
};

Frogland.Restart = function() {
    var fadeOutTween = game.add.tween(game.world).to({alpha:0}, 1500, Phaser.Easing.Linear.None, true);
        fadeOutTween.onComplete.add(function() {
            frauki.body.x = fraukiSpawnX;
            frauki.body.y = fraukiSpawnY;
            game.world.alpha = 1;
            frauki.states.energy = 15;

            Frogland.enemyGroup.forEach(function(e) {
                e.alive = true;
                e.exists = true;
                e.visible = true;
                e.body.center.x = e.initialX;
                e.body.center.y = e.initialY;
                e.body.velocity.x = 0;
                e.body.velocity.y = 0;
                e.energy = e.maxEnergy;

                if(!!e.Reset)
                    e.Reset.apply(e);
            });
        });
}