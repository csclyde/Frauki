var Frogland = new Phaser.State();

Frogland.preload = function() {
	
    game.load.atlasJSONHash('Frauki', 'Data/Frauki/Frauki.png', 'Data/Frauki/Frauki.json');
    game.load.tilemap('Frogland', 'Data/Frogland/Frogland.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('FroglandTiles', 'Data/Frogland/Frogland.png');
    game.load.image('TerraceTiles', 'Data/Frogland/Infinite Terrace.png');
    game.load.image('DoodadTiles', 'Data/Frogland/Frogland Doodads.png');
    game.load.image('SpawnKey', 'Data/SpawnKey.png');
    game.load.image('Background', 'Data/Frogland/Sky.png');
    game.load.image('parallax1', 'Data/Frogland/Parallax1.png');
    game.load.image('parallax2', 'Data/Frogland/Parallax2.png');
    game.load.image('fluff', 'Data/Fluff.png');

    game.load.image('RedParticles', 'Data/Hit Particles.png');
    game.load.image('YellowParticles', 'Data/Yellow Particles.png');
    game.load.image('Spore', 'Data/Enemies/Sporoid/spore.png');

    game.load.atlasJSONHash('Insectoid', 'Data/Enemies/Insectoid/Insectoid.png', 'Data/Enemies/Insectoid/Insectoid.json');
    game.load.atlasJSONHash('Buzzar', 'Data/Enemies/Buzzar/Buzzar.png', 'Data/Enemies/Buzzar/Buzzar.json');
    game.load.atlasJSONHash('Sporoid', 'Data/Enemies/Sporoid/Sporoid.png', 'Data/Enemies/Sporoid/Sporoid.json');

    game.load.atlasJSONHash('Door', 'Data/Doors/Doors.png', 'Data/Doors/Doors.json');
    game.load.atlasJSONHash('Item', 'Data/Items/Items.png', 'Data/Items/Items.json');
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

    game.add.plugin(Phaser.Plugin.Debug);

    game.canvas.style['display'] = 'none';
    pixel.canvas = Phaser.Canvas.create(game.width * pixel.scale, game.height * pixel.scale);
    pixel.context = pixel.canvas.getContext('2d');
    Phaser.Canvas.addToDOM(pixel.canvas);
    Phaser.Canvas.setSmoothingEnabled(pixel.context, false);
    pixel.width = pixel.canvas.width;
    pixel.height = pixel.canvas.height;

	game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = 800;
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
    this.objectGroup = game.add.group();
    this.objectGroup.enableBody = true;

    map.createFromObjects('Enemies', 1061, 'Insectoid', 'Hop0000', true, false, this.objectGroup, Enemy);
    map.createFromObjects('Enemies', 1062, 'Buzzar', 'Sting0000', true, false, this.objectGroup, Enemy);
    map.createFromObjects('Enemies', 1063, 'Sporoid', 'Sporoid0000', true, false, this.objectGroup, Enemy);

    map.createFromObjects('Items', 1043, 'Door', 'Door0000', true, false, this.objectGroup, Door, false);
    map.createFromObjects('Items', 1042, 'Item', 'Apple0000', true, false, this.objectGroup, Apple, false);
    
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

    game.physics.arcade.collide(frauki, this.objectGroup, this.CollideFraukiWithObject, this.OverlapFraukiWithObject);

    game.physics.arcade.collide(this.objectGroup, midgroundLayer);

    if(!!frauki.attackRect && frauki.attackRect.width !== 0) {
        game.physics.arcade.overlap(frauki.attackRect, this.objectGroup, EnemyHit);
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

/*    this.objectGroup.forEach(function(o) {
        game.debug.body(o);
    });*/

    pixel.context.drawImage(game.canvas, 0, 0, game.width, game.height, 0, 0, pixel.width, pixel.height);
};

Frogland.Restart = function() {
    var fadeOutTween = game.add.tween(game.world).to({alpha:0}, 1500, Phaser.Easing.Linear.None, true);
        fadeOutTween.onComplete.add(function() {
            frauki.body.x = fraukiSpawnX;
            frauki.body.y = fraukiSpawnY;
            game.world.alpha = 1;
            energyController.energy = 15;
            energyController.neutralPoint = 15;

            Frogland.objectGroup.forEach(function(e) {
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

//this is called when a collision happens. if it returns false the two will not be separated
Frogland.OverlapFraukiWithObject = function(f, o) {
    if(o.spriteType == 'apple') {
        EatApple(f, o);
        return false;
    } else if(o.spriteType === 'enemy') {
        frauki.Hit(f, o);
        return false;
    }

    return true;
};

Frogland.CollideFraukiWithObject = function(f, o) {

    if(!!o && typeof o === 'object') {
        if(o.spriteType === 'door')
            OpenDoor(f, o);
    }
};