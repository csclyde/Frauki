var Frogland = new Phaser.State();

Frogland.preload = function() {
	
    game.load.atlasJSONHash('Frauki', 'Data/Frauki/Frauki.png', 'Data/Frauki/Frauki.json');
    game.load.tilemap('Frogland', 'Data/Frogland/Frogland.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('FroglandTiles', 'Data/Frogland/Frogland.png');
    game.load.image('TerraceTiles', 'Data/Frogland/Infinite Terrace.png');
    game.load.image('DoodadTiles', 'Data/Frogland/Frogland Doodads.png');
    game.load.image('Background', 'Data/Frogland/Sky.png');
    game.load.image('parallax1', 'Data/Frogland/Parallax1.png');
    game.load.image('parallax2', 'Data/Frogland/Parallax2.png');
    game.load.image('fluff', 'Data/Fluff.png');
    game.load.image('mace', 'Data/Weapons/Mace.png');

    game.load.image('RedParticles', 'Data/Hit Particles.png');
    game.load.image('YellowParticles', 'Data/Yellow Particles.png');
    game.load.image('Spore', 'Data/Enemies/Sporoid/spore.png');

    game.load.atlasJSONHash('EnemySprites', 'Data/Enemies/Enemies.png', 'Data/Enemies/Enemies.json');

    game.load.atlasJSONHash('Door', 'Data/Doors/Doors.png', 'Data/Doors/Doors.json');
    game.load.atlasJSONHash('Misc', 'Data/Misc/Misc.png', 'Data/Misc/Misc.json');
    game.load.atlasJSONHash('UI', 'Data/UI/UI.png', 'Data/UI/UI.json');

    game.load.audio('attack_1', 'Data/Sfx/attack1.wav');
}

var map;
var tileset;
var backgroundLayer;
var midgroundLayer;
var foregroundLayer;
var collisionLayer;
var bg;
var parallax1, parallax2;
var cameraController;
var inputController;
var effectsController;
var energyController;
var audioController;
var weaponController;
var projectileController;
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
   
    backgroundLayer = map.createLayer('Background');
    midgroundLayer = map.createLayer('Midground');
    collisionLayer = map.createLayer('Collision');
    
    midgroundLayer.resizeWorld();

    map.setCollision([1, 3, 4], true, 'Collision');

    var fraukiTile = map.searchTileIndex(1045, 0, false, 'Midground');
    fraukiSpawnX = fraukiTile.worldX || 0;
    fraukiSpawnY = fraukiTile.worldY || 0;

    frauki = new Player(game, fraukiSpawnX, fraukiSpawnY, 'Frauki');
    game.add.existing(frauki);

    //create the enemies
    this.objectGroup = game.add.group();
    this.objectGroup.enableBody = true;

    this.enemyPool = game.add.group();
    

    map.createFromObjects('Enemies', 1065, 'Insectoid', null, true, false, this.objectGroup, Enemy, false);
    map.createFromObjects('Enemies', 1066, 'Buzzar', null, true, false, this.objectGroup, Enemy, false);
    map.createFromObjects('Enemies', 1067, 'Sporoid', null, true, false, this.objectGroup, Enemy, false);
    map.createFromObjects('Enemies', 1068, 'Madman', null, true, false, this.objectGroup, Enemy, false);
    map.createFromObjects('Enemies', 1069, 'CreeperThistle', null, true, false, this.objectGroup, Enemy, false);
    map.createFromObjects('Enemies', 1070, 'Incarnate', null, true, false, this.objectGroup, Enemy, false);
    map.createFromObjects('Enemies', 1071, 'Haystax', null, true, false, this.objectGroup, Enemy, false);

    map.createFromObjects('Items', 1043, 'Door', 'Door0000', true, false, this.objectGroup, Door, false);
    map.createFromObjects('Items', 1042, 'Misc', 'Apple0000', true, false, this.objectGroup, Apple, false);
    
    foregroundLayer = map.createLayer('Foreground');
    map.setCollisionByExclusion([], true, 'Foreground');

    cameraController = new CameraController(frauki, map);
    inputController = new InputController(frauki);
    effectsController = new EffectsController();
    energyController = new EnergyController();
    audioController = new AudioController();
    weaponController = new WeaponController();
    projectileController = new ProjectileController();
    timerUtil = new TimerUtil();

    game.camera.focusOnXY(frauki.body.x, frauki.body.y);

    energyText = game.add.text(0, 0, '', {font: "10px Arial", fill: "#ff0044"});
    energyText.fixedToCamera = true;

    //special procesing for collision tiles
    map.forEach(function(tile) {
        //if the tile is marked as disappearing
        if(tile.index === 2) {
            var water = map.getTileWorldXY(tile.worldX, tile.worldY, 16, 16, 'Foreground');
            water.alpha = 0.4;
        } else if(tile.index === 4) {
            tile.collideLeft = false;
            tile.collideRight = false;
            tile.collideUp = true;
            tile.collideDown = false;
            tile.faceUp = true;
            tile.faceDown = false;
            tile.faceLeft = false;
            tile.faceRight = false; 
        }
           
    }, this, 0, 0, map.width, map.height, 'Collision');

    this.fadedTiles = [];
    this.EstablishDisappearingWalls();
};

Frogland.update = function() {
    frauki.UpdateAttackGeometry();

    //reset environmental effect flags
    frauki.states.inWater = false;
    
    game.physics.arcade.collide(frauki, collisionLayer, null, this.CheckEnvironmentalCollisions);
    game.physics.arcade.collide(frauki, this.objectGroup, this.CollideFraukiWithObject, this.OverlapFraukiWithObject);
    game.physics.arcade.collide(this.objectGroup, collisionLayer);
    game.physics.arcade.collide(frauki, foregroundLayer, null, this.HideForeground);
    game.physics.arcade.overlap(frauki, projectileController.projectiles, this.CollideFraukiWithProjectile);

    if(!!frauki.attackRect && frauki.attackRect.body.width != 0) {
        game.physics.arcade.overlap(frauki.attackRect, this.objectGroup, EnemyHit);
    }

    cameraController.UpdateCamera();
    inputController.UpdateInput();
    effectsController.UpdateEffects();
    energyController.UpdateEnergy();
    weaponController.Update();
    triggers.Update();

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

Frogland.CollideFraukiWithProjectile = function(f, p) {

    console.log('tarred');

    if(p.projType === 'tar') {
        frauki.Hit(f, p.owningEnemy);
    }

    p.destroy();
};

Frogland.CollideFraukiWithObject = function(f, o) {

    if(!!o && typeof o === 'object') {
        if(o.spriteType === 'door')
            OpenDoor(f, o);
    }
};

Frogland.CheckEnvironmentalCollisions = function(f, tile) {

    if(tile.index === 1) { //solid tile
        return true;
    } else if(tile.index === 2) { //water
        frauki.states.inWater = true;
        return false;
    } else if(tile.index === 3) { //trick wall
        if(frauki.state === frauki.Rolling) {
            return false;
        } else {
            return true;
        }
    } else if(tile.index === 4) { //cloud tile
        return true;
    }
}

Frogland.EstablishDisappearingWalls = function() {
    map.forEach(function(tile) {
        //if the tile is marked as disappearing

        if(tile.disappearing) {
            if(!tile.tileGroup) {

                //check the adjacent tiles for a group to glom onto (uo down left right)
                var adjTile = map.getTileWorldXY(tile.worldX, tile.worldY - 1, 'Foreground');

                if(!!adjTile && adjTile.disappearing && !!adjTile.tileGroup) {
                    tile.tileGroup = adjTile.tileGroup;
                    tile.tileGroup.tiles.push(tile);
                    return;
                }

                adjTile = map.getTileWorldXY(tile.worldX, tile.worldY + 1, 'Foreground');

                if(!!adjTile && adjTile.disappearing && !!adjTile.tileGroup) {
                    tile.tileGroup = adjTile.tileGroup;
                    tile.tileGroup.tiles.push(tile);
                    return;
                }

                adjTile = map.getTileWorldXY(tile.worldX - 1, tile.worldY, 'Foreground');

                if(!!adjTile && adjTile.disappearing && !!adjTile.tileGroup) {
                    tile.tileGroup = adjTile.tileGroup;
                    tile.tileGroup.tiles.push(tile);
                    return;
                }

                adjTile = map.getTileWorldXY(tile.worldX + 1, tile.worldY, 'Foreground');

                if(!!adjTile && adjTile.disappearing && !!adjTile.tileGroup) {
                    tile.tileGroup = adjTile.tileGroup;
                    tile.tileGroup.tiles.push(tile);
                    return;
                }

                //none of the adjacent tiles have a group. so create a new one
                tile.tileGroup = {tiles: [tile], visible: true};
                this.fadedTiles.push(tile.tileGroup);

            }
        }
            //give it a callback that makes it disappear when it is touched
        //if this tile is not already grouped
            //create a new group and add every connected tile

    }, this, 0, 0, map.width, map.height, 'Foreground');
};

Frogland.HideForeground = function(f, t) {

    if(t.disappearing && !!t.tileGroup && t.tileGroup.visible === true) {
        console.log('stuff');
        t.tileGroup.visible = false;

        t.tileGroup.tiles.forEach(function(tile) {
            tile.alpha = 0;
        }. this);
    }
    
    return false;
};

Frogland.CheckForegroundGroup = function() {
    this.fadedTiles.forEach(function(grp) {
        //if the group is invisible, loop through each child tile and check if they are still being collided with
        if(grp.visible === false) {
            var stillColliding = false;

            grp.tiles.forEach(function(tile) {
                if(tile.intersects(frauki.body.x, frauki.body.y, frauki.body.x + frauki.body.width, frauki.body.y + frauki.body.height)) {
                    stillColliding = true;
                    return;
                }
            }, this);

            if(stillColliding === false) {
                grp.visible = true;
                //tween each of the tiles back to being visible

                grp.tiles.forEach(function(tile) {
                    tile.alpha = 1;
                }, this);
            }
        }
    }, this);
};

Frogland.SpawnEnemies = function() {
    //this function will randomly spawn enemies on the map. The farther down you get in the map,
    //the more difficult it should become. There should be a "density" function that considers the
    //max energy of enemies when deciding how to spawn them. For instance, in one area it might 
    //either spawn 5 or 6 sporoids, or one incarnate. Or, two or three insectoids. The difficulty
    //of an enemy is considered parallell to their max energy.

    //the spatial positioning will be the difficult part. there can be no guarntee of the size or
    //type of rooms created. so the spawning should consider the size of the space in which the thing
    //is going to be spawned.

    //perhaps their could be a sort of spawn daemon that traverses through the map and checks if
    //a certain type of enemy could potentially fit where it is by modifying its size, or something
}