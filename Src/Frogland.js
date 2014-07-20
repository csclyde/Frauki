var Frogland = new Phaser.State();

Frogland.preload = function() {
	
    game.load.atlasJSONHash('Frauki', 'Data/Frauki/Frauki.png', 'Data/Frauki/Frauki.json');
    game.load.tilemap('Frogland', 'Data/Locations/Frogland/Frogland.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('FroglandTiles', 'Data/Locations/Frogland/Frogland.png');
    game.load.image('DoodadTiles', 'Data/Locations/Frogland/Frogland Doodads.png');
    game.load.image('SpawnKey', 'Data/Locations/SpawnKey.png');
    game.load.image('Background', 'Data/Locations/Frogland/Sky.png');
    game.load.image('parallax1', 'Data/Locations/Frogland/Parallax1.png');
    game.load.image('parallax2', 'Data/Locations/Frogland/Parallax2.png');
    game.load.image('fluff', 'Data/Fluff.png');

    game.load.atlasJSONHash('Insectoid', 'Data/Enemies/Insectoid/Insectoid.png', 'Data/Enemies/Insectoid/Insectoid.json');

    game.scale.minWidth = 640;
    game.scale.minHeight = 480;
    game.scale.pageAlignHorizontally = true;
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.setSize();

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

var playerX, playerY;

var enemyLayer;

var previousCamX;

Frogland.create = function() {
	game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = 1000;
    game.time.deltaCap = 0.016;

    bg = game.add.tileSprite(0, 0, 320, 240, 'Background');
    bg.fixedToCamera = true;

    parallaxLayer1 = game.add.tileSprite(0, 0, 320, 240, "parallax1");
    parallaxLayer1.fixedToCamera = true;

    parallaxLayer2 = game.add.tileSprite(0, 0, 320, 240, "parallax2");
    parallaxLayer2.fixedToCamera = true;

    map = game.add.tilemap('Frogland');
    map.addTilesetImage('FroglandTiles');
    map.addTilesetImage('DoodadTiles');
    map.addTilesetImage('SpawnKey');
   
    backgroundLayer = map.createLayer('Background');
    midgroundLayer = map.createLayer('Midground');
    
    midgroundLayer.resizeWorld();

    map.setCollision([71, 72, 73, 74, 75, 76, 82, 83, 84, 87, 88, 89, 91, 92, 93, 94, 95, 95, 102, 103, 104, 107, 108, 109, 127, 128, 129, 147, 148, 149, 181, 182, 183, 184, 185], true, 'Midground');


    frauki = new Player(game, 0, 0, 'Frauki');
    game.add.existing(frauki);

    //create the enemies
    this.enemyGroup = game.add.group();
    this.enemyGroup.enableBody = true;

    enemyLayer = map.createFromObjects('Enemies', 1061, 'Insectoid', 'Hop0000', true, false, this.enemyGroup, Enemy);

    foregroundLayer = map.createLayer('Foreground');

    cameraController = new CameraController(frauki, map);
    cameraController.SetRepulsiveTiles([82, 83, 84, 87, 88, 89, 149, 127, 129, 108, 147, 109, 103, 104, 183, 184, 128, 107]);

    inputController = new InputController(frauki);

    effectsController = new EffectsController();

    previousCamX = game.camera.x;

    //set up tiles with one way collision
    map.forEach(function (tile) {
        if(!!tile.cloud) {
            tile.collideUp = true;
            tile.collideDown = false;
            tile.collideLeft = true;
            tile.collideRight = true;
        }

    }, this, 0, 0, map.width, map.height, 'Midground');
};

Frogland.update = function() {
    parallaxLayer1.autoScroll(-(game.camera.x - previousCamX) * 100, 0);
    parallaxLayer2.autoScroll(-(game.camera.x - previousCamX) * 150, 0);

	game.physics.arcade.collide(frauki, midgroundLayer);

    game.physics.arcade.collide(this.enemyGroup, midgroundLayer);

    cameraController.UpdateCamera();
    inputController.UpdateInput();
    effectsController.UpdateEffects();

    previousCamX = game.camera.x;

    playerX = frauki.body.x;
    playerY = frauki.body.y;
}

Frogland.render = function() {
    //game.debug.body(frauki);
}