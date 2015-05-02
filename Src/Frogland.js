var Frogland = new Phaser.State();

Frogland.preload = function() {
	
    game.load.tilemap('Frogland', 'Data/Frogland/Frogland.json', null, Phaser.Tilemap.TILED_JSON);

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

Frogland.create = function() {

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

    this.bg = game.add.tileSprite(0, 0, pixel.width, pixel.height, 'Background');
    this.bg.fixedToCamera = true;

    this.plx1 = game.add.tileSprite(0, 0, pixel.width, pixel.height, 'parallax1');
    this.plx1.fixedToCamera = true;

    this.plx2 = game.add.tileSprite(0, 0, pixel.width, pixel.height, 'parallax2');
    this.plx2.fixedToCamera = true;

    map = game.add.tilemap('Frogland');
    map.addTilesetImage('FrogtownTiles');
    map.addTilesetImage('DepthsTiles');
    map.addTilesetImage('Collision');

    this.CreateMapLayer(4, false);
    this.CreateMapLayer(3, true);
    this.CreateMapLayer(2, false);
    
    this.currentLayer = 3;
    this.restarting = false;


    this.enemyPool = game.add.group();
    this.doorGroup = game.add.group();

    this.CreateObjectsLayer(4);
    this.CreateObjectsLayer(3);
    this.CreateObjectsLayer(2);

    map.createFromObjects('Doors', 67, 'Door', 'Door0000', true, false, this.doorGroup, Door, false);

    frauki = new Player(game, 100, 100, 'Frauki');
    game.add.existing(frauki);
    
    this.foregroundLayer_4 = map.createLayer('Foreground_4');
    this.foregroundLayer_4.visible = false;

    this.foregroundLayer_3 = map.createLayer('Foreground_3');

    this.foregroundLayer_2 = map.createLayer('Foreground_2');
    this.foregroundLayer_2.visible = false;

    cameraController = new CameraController(frauki, map);
    inputController = new InputController(frauki);
    effectsController = new EffectsController();
    energyController = new EnergyController();
    audioController = new AudioController();
    weaponController = new WeaponController();
    projectileController = new ProjectileController();
    timerUtil = new TimerUtil();

    energyController.Create();

    game.camera.focusOnXY(frauki.body.x, frauki.body.y);

    this.ProcessCollisionTiles(4);
    this.ProcessCollisionTiles(3);
    this.ProcessCollisionTiles(2);
};

Frogland.CreateMapLayer = function(layer, visible) {
    this['backgroundLayer_' + layer] = map.createLayer('Background_' + layer);
    this['backgroundLayer_' + layer].visible = visible;

    this['midgroundLayer_' + layer] = map.createLayer('Midground_' + layer);
    this['midgroundLayer_' + layer].resizeWorld();
    this['midgroundLayer_' + layer].visible = visible;
    
    this['collisionLayer_' + layer] = map.createLayer('Collision_' + layer);
    map.setCollision([1, 3, 4, 9, 10], true, 'Collision_' + layer);
    this['collisionLayer_' + layer].visible = false;
};

Frogland.CreateObjectsLayer = function(layer) {
    var that = this;
    var currLayer = 'objectGroup_' + layer;

    this[currLayer] = game.add.group();
    this[currLayer].enableBody = true;

    //create each enemy for this layer
    FileMap.Enemies.forEach(function(enemy) {
        map.createFromObjects('Objects_' + layer, enemy.Tile, enemy.Name, null, true, false, that[currLayer], Enemy, false);
    });

    //create all the apples
    map.createFromObjects('Objects_' + layer, 66, 'Misc', 'Apple0000', true, false, this[currLayer], Apple, false);

    //inform each enemy of its own layer
    this[currLayer].forEach(function(obj) {
        obj.owningLayer = layer;

        if(Frogland.currentLayer !== layer) {
            obj.alpha = 0;
            obj.body.enable = false;
        }
    });    
};

Frogland.ProcessCollisionTiles = function(layer) {
    //special procesing for collision tiles
    map.forEach(function(tile) {
        //if the tile is marked as disappearing
        if(tile.index === 2) {
            var water = map.getTileWorldXY(tile.worldX, tile.worldY, 16, 16, 'Foreground_' + layer);
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
           
    }, this, 0, 0, map.width, map.height, 'Collision_' + layer);
};

Frogland.update = function() {
    frauki.UpdateAttackGeometry();

    //reset environmental effect flags
    frauki.states.inWater = false;
    frauki.states.onCloud = false;
    
    game.physics.arcade.collide(frauki, this.GetCurrentCollisionLayer(), null, this.CheckEnvironmentalCollisions);
    game.physics.arcade.collide(frauki, this.GetCurrentObjectGroup(), this.CollideFraukiWithObject, this.OverlapFraukiWithObject);
    //game.physics.arcade.overlap(frauki, this.doorGroup, this.OverlapFraukiWithDoor);
    game.physics.arcade.collide(this.GetCurrentObjectGroup(), this.GetCurrentCollisionLayer());

    game.physics.arcade.overlap(frauki, projectileController.projectiles, this.CollideFraukiWithProjectile);

    cameraController.UpdateCamera();
    inputController.UpdateInput();
    effectsController.UpdateEffects();
    energyController.UpdateEnergy();
    weaponController.Update();
    projectileController.Update();

    this.plx1.tilePosition.x = -(game.camera.x * 0.8);
    this.plx2.tilePosition.x = -(game.camera.x * 0.9);

};

Frogland.GetCurrentObjectGroup = function() {
    return this['objectGroup_' + this.currentLayer];
};

Frogland.GetCurrentCollisionLayer = function() {
    return this['collisionLayer_' + this.currentLayer];
};

Frogland.render = function() {
    //game.debug.body(frauki);
    //game.debug.body(frauki.bodyDouble);
    //game.debug.body(frauki.attackRect);

    // this.objectGroup_3.forEach(function(o) {
    //     game.debug.body(o);
    // });

    /*projectileController.projectiles.forEach(function(o) {
        game.debug.body(o);
    });*/

    pixel.context.drawImage(game.canvas, 0, 0, game.width, game.height, 0, 0, pixel.width, pixel.height);
};

Frogland.Restart = function() {
    if(this.restarting === true) {
        return;
    }

    this.restarting = true;
    game.time.slowMotion = 5;
    var fadeOutTween = game.add.tween(game.world).to({alpha:0}, 500, Phaser.Easing.Linear.None, true);

    fadeOutTween.onComplete.add(function() {
        Frogland.ChangeLayer(3);
        frauki.body.x = 100; //fraukiSpawnX;
        frauki.body.y = 100; //fraukiSpawnY;
        energyController.energy = 15;
        energyController.neutralPoint = 15;
        game.time.slowMotion = 1;
        game.world.alpha = 1;

        Frogland.restarting = false;

        Frogland['objectGroup_4'].forEach(function(e) {
            if(!!e.Respawn) {
                e.Respawn();
            }
        });

        Frogland['objectGroup_3'].forEach(function(e) {
            if(!!e.Respawn) {
                e.Respawn();
            }
        });

        Frogland['objectGroup_2'].forEach(function(e) {
            if(!!e.Respawn) {
                e.Respawn();
            }
        });
    });
};

Frogland.ChangeLayer = function(newLayer) {

    if(this.currentLayer == newLayer) return;

    //get the current layer
    var currentForgroundLayer = this['foregroundLayer_' + this.currentLayer];
    var currentMidgroundLayer = this['midgroundLayer_' + this.currentLayer];
    var currentBackgroundLayer = this['backgroundLayer_' + this.currentLayer];
    var currentCollisionLayer = this.GetCurrentCollisionLayer();
    var currentObjectLayer = this.GetCurrentObjectGroup();

    game.add.tween(currentForgroundLayer).to({alpha: 0}, 300, Phaser.Easing.Linear.None, true);
    game.add.tween(currentMidgroundLayer).to({alpha: 0}, 300, Phaser.Easing.Linear.None, true);
    game.add.tween(currentBackgroundLayer).to({alpha: 0}, 300, Phaser.Easing.Linear.None, true);

    currentObjectLayer.forEach(function(obj) {
        game.add.tween(obj).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true);
        obj.body.enable = false;
    });

    this.currentLayer = newLayer;

    currentForgroundLayer = this['foregroundLayer_' + this.currentLayer];
    currentMidgroundLayer = this['midgroundLayer_' + this.currentLayer];
    currentBackgroundLayer = this['backgroundLayer_' + this.currentLayer];
    currentCollisionLayer = this.GetCurrentCollisionLayer();
    currentObjectLayer = this.GetCurrentObjectGroup();

    currentForgroundLayer.visible = true;
    currentForgroundLayer.alpha = 0;
    currentMidgroundLayer.visible = true;
    currentMidgroundLayer.alpha = 0;
    currentBackgroundLayer.visible = true;
    currentBackgroundLayer.alpha = 0;

    game.add.tween(currentForgroundLayer).to({alpha: 1}, 200, Phaser.Easing.Linear.None, true);
    game.add.tween(currentMidgroundLayer).to({alpha: 1}, 200, Phaser.Easing.Linear.None, true);
    game.add.tween(currentBackgroundLayer).to({alpha: 1}, 200, Phaser.Easing.Linear.None, true);

    currentObjectLayer.forEach(function(obj) {
        obj.alpha = 0;
        game.add.tween(obj).to({alpha: 1}, 200, Phaser.Easing.Linear.None, true);
        obj.body.enable = true;
    });
};

//this is called when a collision happens. if it returns false the two will not be separated
Frogland.OverlapFraukiWithObject = function(f, o) {
    if(o.spriteType == 'apple') {
        EatApple(f, o);
        return false;
    } else if(o.spriteType === 'enemy') {

        if(o.CanCauseDamage() && o.state !== o.Dying) {
            frauki.Hit(f, o);
        }

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

Frogland.OverlapFraukiWithDoor = function(f, d) {
    if(d.spriteType === 'door') {
        if(frauki.currentLayer === d.firstLayer || frauki.currentLayer === d.secondLayer) {
            this.standingInDoorway = true;
        }
    }
};

Frogland.CollideFraukiWithProjectile = function(f, p) {

    if(p.projType === 'tar') {
        frauki.Hit(f, p.owningEnemy);
    }

    p.destroy();
};

Frogland.CheckEnvironmentalCollisions = function(f, tile) {

    if(tile.index === 1) { //solid tile
        return true;
    } else if(tile.index === 2) { //water
        frauki.states.inWater = true;
        effectsController.Splash(tile);
        return false;
    } else if(tile.index === 3) { //trick wall
        if(frauki.state === frauki.Rolling) {
            return false;
        } else {
            return true;
        }
    } else if(tile.index === 4) { //cloud tile
        frauki.states.onCloud = true;

        if(frauki.states.droppingThroughCloud) {
            return false;
        } else {
            return true;
        }
    }
};
