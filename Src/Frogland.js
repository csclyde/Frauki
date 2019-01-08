var Frogland = {};

Frogland.Create = function() {

    this.timers = new TimerUtil();

    this.map = game.add.tilemap('Frogland');
    this.map.addTilesetImage('FrogtownTiles');
    this.map.addTilesetImage('DepthsTiles');
    this.map.addTilesetImage('TerraceTiles');
    this.map.addTilesetImage('Doodads');
    this.map.addTilesetImage('Collision');

    backdropController.CreateParallax();
    backdropController.LoadBackgrounds();
    
    this.CreateBackgroundLayer();

    effectsController.CreateEffectsLayer();
    
    frauki = new Player(game, 0, 0, 'Frauki');
    game.add.existing(frauki);

    this.CreateCollisionLayer();

    objectController.CreateObjectsLayer();

    this.CreateMidgroundLayer();
    this.CreateForegroundLayer();

    effectsController.CreateForegroundEffectsLayer();

    this.PreprocessTiles();

    triggerController.CreateTriggers();

    this.SpawnFrauki();

    objectController.CompileObjectList();

    //this will store fallen tiles, so that when you die they can be reset
    this.fallenTiles = [];

    //events.subscribe('enemy_killed', this.Ragnarok, this);
    this.ragnarokCounter = 1;
    this.ragnarokLevel = 0;

    game.physics.arcade.sortDirection = game.physics.arcade.TOP_BOTTOM;

    setInterval(this.AnimateTiles, 200);
};

Frogland.Update = function() {

    //reset environmental effect flags
    frauki.states.inWater = false;
    frauki.states.onCloud = false;
    frauki.states.inUpdraft = false;
    frauki.states.onLeftSlope = false;
    frauki.states.onRightSlope = false;
    frauki.states.flowDown = false;
    frauki.states.flowRight = false;
    frauki.states.flowUp = false;
    frauki.states.flowLeft = false;

    this.HandleCollisions();

    if(frauki.y > 10800) {
        //console.log(game.camera.y - frauki.body.y);
        frauki.body.y -= 10000;
        cameraController.camY = -250;
        //console.log(game.camera.y - frauki.body.y);
    }
};

Frogland.HandleCollisions = function() {
    //moving objects collided with the world geometry
    game.physics.arcade.collideSpriteVsTilemapLayer(
        frauki, 
        this.GetCollisionLayer(), 
        null, 
        Collision.CollideFraukiWithEnvironment, 
        null, false);

    game.physics.arcade.collideGroupVsTilemapLayer(
        objectController.GetObjectGroup(),
        this.GetCollisionLayer(), 
        null, 
        Collision.OverlapObjectsWithEnvironment, 
        null, false);

    //frauki is collided with other moving objects
    game.physics.arcade.collideHandler(
        frauki, 
        objectController.GetObjectGroup(), 
        null, 
        Collision.OverlapFraukiWithObject, 
        null, false);

    //collide enemies with doors
    game.physics.arcade.collide(
        objectController.enemyList, 
        objectController.doorList, 
        null, 
        Collision.CollideEnemiesWithDoors);

    //overlap fraukis attack with objects and projectiles
    if(frauki.Attacking()) {
        game.physics.arcade.overlap(
            frauki.attackRect, 
            objectController.GetObjectGroup(), 
            Collision.OverlapAttackWithObject);
    }

    //objects are collided with themselves
    //game.physics.arcade.collide(objectController.GetObjectGroup(), undefined, null, Collision.OverlapObjectsWithSelf);

    //frauki is checked against projectiles
    if(projectileController.projectiles.countLiving() > 0) {
        game.physics.arcade.overlap(
            frauki, 
            projectileController.projectiles, 
            Collision.CollideFraukiWithProjectile);
    }
};

Frogland.SpawnFrauki = function() {

    if(GameData.GetDebugPos()) {
        var pos = GameData.GetDebugPos();
        frauki.x = pos.x;
        frauki.y = pos.y; 
    } else if(Frogland.map.properties.debug === 'false') {
        objectController.checkpointList.forEach(function(obj) {
            if(obj.spriteType === 'checkpoint' && obj.id == GameData.GetCheckpoint()) {
                frauki.x = obj.x;
                frauki.y = obj.y + 90;  
                frauki.timers.SetTimer('frauki_invincible', 0);
            } 
        }); 

    } else {
        frauki.x = this.map.properties.startX * 16;
        frauki.y = this.map.properties.startY * 16 + 90;
    }

    cameraController.camX = frauki.x + 300;
    cameraController.camY = frauki.y + 180;
};

Frogland.CreateBackgroundLayer = function() {
    this['backgroundLayer'] = this.map.createLayer('Background');
};

Frogland.CreateMidgroundLayer = function() {
    this['midgroundLayer'] = this.map.createLayer('Midground');
    this['midgroundLayer'].resizeWorld();
};

Frogland.CreateForegroundLayer = function() {
    this['foregroundLayer'] = this.map.createLayer('Foreground');
};

Frogland.CreateCollisionLayer = function() {
    this['collisionLayer'] = this.map.createLayer('Collision');
    this.map.setCollision([1, 3, 4, 5, 7, 8, 9, 17, 18], true, 'Collision');
    this['collisionLayer'].visible = false;
};

Frogland.PreprocessTiles = function() {
    //special procesing for collision tiles
    this.map.forEach(function(tile) {

        if(!!tile) {
            if(tile.index === 4 || tile.index === 12) {
                tile.setCollision(false, false, true, false);

            //drop tiles
            } else if(tile.index === 6) {
                tile.setCollision(false, false, false, true);
            
            //tiles with all faces colliding
            } else if(tile.index === 8) {
                tile.setCollision(true, true, true, true);

            } else if(tile.index === 17 || tile.index === 18) {
                // //tile.setCollision(true, true, true, true);
                var leftTile = this.map.getTile(tile.x - 1, tile.y, 'Collision');
                var rightTile = this.map.getTile(tile.x + 1, tile.y, 'Collision');
                var topTile = this.map.getTile(tile.x, tile.y - 1, 'Collision');
                var bottomTile = this.map.getTile(tile.x, tile.y + 1, 'Collision');

                // if(!!leftTile && leftTile.index === 1) leftTile.setCollision(true, true, true, true);
                // if(!!rightTile && rightTile.index === 1) rightTile.setCollision(true, true, true, true);
                // if(!!topTile && topTile.index === 1) topTile.setCollision(true, true, true, true);
                // if(!!bottomTile && bottomTile.index === 1) bottomTile.setCollision(true, true, true, true);
            }
        }
           
    }, this, 0, 0, this.map.width, this.map.height, 'Collision');

    this.map.forEach(function(tile) {

        if(!!tile && !!tile.properties && !!tile.properties.alpha) {
            tile.alpha = tile.properties.alpha;
        }
    }, this, 0, 0, this.map.width, this.map.height, 'Foreground');

    this.animatedTiles = [];
    
    //get animations
    this.map.forEach(function(tile) {
        if(!!tile) {
            if(!this.animatedTiles[tile.y] && tile.index !== -1) this.animatedTiles[tile.y] = [];
            if(tile.index !== -1) this.animatedTiles[tile.y][tile.x] = tile.index;
        }


    }, this, 0, 0, 5, 30, 'Collision');
    
};

Frogland.GetCollisionLayer = function() {
    return this['collisionLayer'];
};

Frogland.DislodgeTile = function(tile) {
    if(tile && tile.index === 1) {
        //make the tile robust
        tile.setCollision(true, true, true, true);
    }
    else if(tile && (tile.index === 5 || tile.index === 7) && tile.dislodged !== true) {
        
        //get the visible tile from the midground, and make it invisible
        var mgTile = Frogland.map.getTile(tile.x, tile.y, 'Midground');
        mgTile.alpha = 0;

        Frogland['midgroundLayer'].dirty = true;

        tile.dislodged = true;
        tile.owningLayer = this.currentLayer;

        Frogland.fallenTiles.push(tile);

        projectileController.FallingTile(tile, mgTile);

        events.publish('play_sound', {name: 'floor_crumble'});


        game.time.events.add(game.rnd.between(50, 80), function() { 
            if(!!tile) {
                Frogland.DislodgeTile(Frogland.map.getTile(tile.x - 1, tile.y, 'Collision'));
                Frogland.DislodgeTile(Frogland.map.getTile(tile.x + 1, tile.y, 'Collision'));
                Frogland.DislodgeTile(Frogland.map.getTile(tile.x, tile.y - 1, 'Collision'));
                Frogland.DislodgeTile(Frogland.map.getTile(tile.x, tile.y + 1, 'Collision'));
            }
        });
    }
};

Frogland.ResetFallenTiles = function() {
    var i = this.fallenTiles.length;

    while(i--) {
        var tile = this.fallenTiles[i];
        
        tile.dislodged = false;
        tile.waitingToFall = false;

        var mgTile = this.map.getTile(tile.x, tile.y, 'Midground');
        if(!!mgTile) mgTile.alpha = 1;
    }
};

Frogland.AnimateTiles = function() {
    var viewLeft, viewRight, viewTop, viewBottom;
    var changeHappened = false;

    viewLeft = Math.ceil((game.camera.x / 16)) - 2;
    viewTop = Math.ceil((game.camera.y / 16)) - 2;
    viewRight = Math.ceil((game.camera.width / 16)) + 2;
    viewBottom = Math.ceil((game.camera.height / 16)) + 2;

    if(viewLeft < 0) viewLeft = 0;
    if(viewLeft + viewRight > Math.ceil(game.world.width / 16)) viewLeft = Math.ceil(game.world.width / 16) - viewRight;
    if(viewTop < 0) viewTop = 0;
    if(viewTop + viewBottom > Math.ceil(game.world.height / 16)) viewTop = Math.ceil(game.world.height / 16) - viewBottom;

    Frogland.map.forEach(function(tile) {

        if(!!tile) {
            for(var i = 0; i < Frogland.animatedTiles.length; i++) {

                var animLength = Frogland.animatedTiles[i].length;

                //if the animation doesnt exist or is only 1 tile long, bail
                if(!Frogland.animatedTiles[i] || animLength <= 1) {
                    continue;
                }

                //loop the final tile back to the start
                if(tile.index === Frogland.animatedTiles[i][animLength - 1]) {
                    tile.index = Frogland.animatedTiles[i][0]; 
                    changeHappened = true;
                    continue;
                }

                //increment the rest
                for(var j = 0; j < animLength - 1; j++) {
                    if(tile.index === Frogland.animatedTiles[i][j]) {
                        tile.index = Frogland.animatedTiles[i][j + 1];
                        changeHappened = true;
                        break;
                    }
                }
            
            }
        }

           
    }, Frogland, viewLeft, viewTop, viewRight, viewBottom, 'Foreground'); 

    if(changeHappened) {
        Frogland['foregroundLayer'].dirty = true;
    }
};

Frogland.UpdateTutorialBlocks = function() {
    Frogland.map.forEach(function(tile) {
        
        if(!!tile) {
            if(game.input.gamepad.supported && game.input.gamepad.active) {
                if(tile.index === 1221) tile.index = 1157;
                if(tile.index === 1222) tile.index = 1158;
    
                if(tile.index === 1223) tile.index = 1159;
                if(tile.index === 1224) tile.index = 1160;
    
                if(tile.index === 1287) tile.index = 1161;
                if(tile.index === 1288) tile.index = 1162;
    
                if(tile.index === 1253) tile.index = 1189;
                if(tile.index === 1254) tile.index = 1190;
    
                if(tile.index === 1255) tile.index = 1191;
                if(tile.index === 1256) tile.index = 1192;
    
                if(tile.index === 1193) tile.index = 1193;
                if(tile.index === 1194) tile.index = 1194;
            } else {
                
                if(tile.index === 1157) tile.index = 1221;
                if(tile.index === 1158) tile.index = 1222;
    
                if(tile.index === 1159) tile.index = 1223;
                if(tile.index === 1160) tile.index = 1224;
    
                if(tile.index === 1161) tile.index = 1287;
                if(tile.index === 1162) tile.index = 1288;
    
                if(tile.index === 1189) tile.index = 1253;
                if(tile.index === 1190) tile.index = 1254;
    
                if(tile.index === 1191) tile.index = 1255;
                if(tile.index === 1192) tile.index = 1256;
    
                if(tile.index === 1193) tile.index = 1319;
                if(tile.index === 1194) tile.index = 1320;
            }
            
        }

        Frogland['backgroundLayer'].dirty = true;
        

            
    }, Frogland, 0, 0, Frogland.width, Frogland.height, 'Background'); 
};

Frogland.Ragnarok = function(e) {

    if(e.owningLayer !== 4 || e.x < 2140 || e.x > 2860 || e.y < 4180 || e.y > 4500) {
        return;
    }

    var enemyConfigs = [85, 86, 87, 92, 95, 98, 99, 100];


    this.ragnarokCounter -= 1;

    if(this.ragnarokCounter <= 0) {
        var waitDuration = 2000;

        if(this.ragnarokLevel % 4 === 0) {
            waitDuration = 6000;
            objectController.SpawnObject({id: 66, x: 2500, y: 4300, name: 'apple'});
        }

        game.time.events.add(waitDuration, function() {
            var numEnemies = game.rnd.between(1, 3);

            for(var i = 0; i < numEnemies; i++) {
                var enemySpawn = enemyConfigs[game.rnd.between(0, enemyConfigs.length - 1)];


                objectController.SpawnObject({ 
                    id: enemySpawn, 
                    x: game.rnd.between(2400, 2800), 
                    y: game.rnd.between(4300, 4450)
                });
                
                this.ragnarokCounter += 1;
            }

            this.ragnarokLevel += 1;
        }, this);
        
    }
};
