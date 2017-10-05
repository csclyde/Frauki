var Frogland = {};

Frogland.Create = function() {

    this.timers = new TimerUtil();

    this.map = game.add.tilemap('Frogland');
    this.map.addTilesetImage('FrogtownTiles');
    this.map.addTilesetImage('DepthsTiles');
    this.map.addTilesetImage('TerraceTiles');
    this.map.addTilesetImage('Doodads');
    this.map.addTilesetImage('Collision');

    this.currentLayer = 3;

    backdropController.CreateParallax();
    backdropController.LoadBackgrounds();
    
    this.CreateBackgroundLayer(4, false);
    this.CreateBackgroundLayer(3, true);

    effectsController.CreateEffectsLayer();
    
    frauki = new Player(game, 0, 0, 'Frauki');
    game.add.existing(frauki);

    this.CreateCollisionLayer(4);
    this.CreateCollisionLayer(3);

    objectController.CreateObjectsLayer(4);
    objectController.CreateObjectsLayer(3);

    this.CreateMidgroundLayer(4, false);
    this.CreateMidgroundLayer(3, true);

    this.CreateForegroundLayer(4, false);
    this.CreateForegroundLayer(3, true);

    effectsController.CreateForegroundEffectsLayer();

    this.CreateDoorLayer(2);

    this.PreprocessTiles(4);
    this.PreprocessTiles(3);

    triggerController.CreateTriggers(4);
    triggerController.CreateTriggers(3);

    this.SpawnFrauki();

    objectController.CompileObjectList();

    //this will store fallen tiles, so that when you die they can be reset
    this.fallenTiles = [];

    events.subscribe('open_door', function(params) {
        OpenDoorById(params.door_name);
    });

    events.subscribe('enemy_killed', this.Ragnarok, this);
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
};

Frogland.HandleCollisions = function() {
    //moving objects collided with the world geometry
    game.physics.arcade.collideSpriteVsTilemapLayer(
        frauki, 
        this.GetCurrentCollisionLayer(), 
        null, 
        Collision.CollideFraukiWithEnvironment, 
        null, false);

    game.physics.arcade.collideGroupVsTilemapLayer(
        objectController.GetCurrentObjectGroup(),
        this.GetCurrentCollisionLayer(), 
        null, 
        Collision.OverlapObjectsWithEnvironment, 
        null, false);

    //frauki is collided with other moving objects
    game.physics.arcade.collideHandler(
        frauki, 
        objectController.GetCurrentObjectGroup(), 
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
            objectController.GetCurrentObjectGroup(), 
            Collision.OverlapAttackWithObject);
    }

    //objects are collided with themselves
    //game.physics.arcade.collide(objectController.GetCurrentObjectGroup(), undefined, null, Collision.OverlapObjectsWithSelf);

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
                Frogland.ChangeLayer(obj.owningLayer, true);   
                frauki.timers.SetTimer('frauki_invincible', 0);
            } 
        }); 

    } else {
        frauki.x = this.map.properties.startX * 16;
        frauki.y = this.map.properties.startY * 16 + 90;
        Frogland.ChangeLayer(+this.map.properties.startLayer, true); 
    }

    cameraController.camX = frauki.x + 300;
    cameraController.camY = frauki.y + 180;
};

Frogland.CreateBackgroundLayer = function(layer, visible) {
    this['backgroundLayer_' + layer] = this.map.createLayer('Background_' + layer);
    this['backgroundLayer_' + layer].visible = visible;
};

Frogland.CreateMidgroundLayer = function(layer, visible) {
    this['midgroundLayer_' + layer] = this.map.createLayer('Midground_' + layer);
    this['midgroundLayer_' + layer].resizeWorld();
    this['midgroundLayer_' + layer].visible = visible;
};

Frogland.CreateForegroundLayer = function(layer, visible) {
    this['foregroundLayer_' + layer] = this.map.createLayer('Foreground_' + layer);
    this['foregroundLayer_' + layer].visible = visible;
};

Frogland.CreateCollisionLayer = function(layer) {
    this['collisionLayer_' + layer] = this.map.createLayer('Collision_' + layer);
    this.map.setCollision([1, 3, 4, 5, 7, 8, 9, 17, 18], true, 'Collision_' + layer);
    this['collisionLayer_' + layer].visible = false;
};

Frogland.CreateDoorLayer = function(layer) {
    this['door' + layer + 'Group'] = game.add.group();
    var doorGroup = this['door' + layer + 'Group'];
    //this.map.createFromObjects('Doors_' + layer, 67, 'Misc', 'Door0000', true, false, this['door' + layer + 'Group'], Door, false);

    Frogland.map.objects['Doors_' + layer].forEach(function(o) {
        var door = game.add.sprite(o.x, o.y);
        game.physics.enable(door, Phaser.Physics.ARCADE);
        door.body.setSize(o.width, o.height);
        door.body.allowGravity = false;

        doorGroup.add(door);
    });

    //this['door' + layer + 'Group'].forEach(function(d) { d.alpha = 0; });
};

Frogland.PreprocessTiles = function(layer) {
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
            }
        }
           
    }, this, 0, 0, this.map.width, this.map.height, 'Collision_' + layer);

    this.map.forEach(function(tile) {

        if(!!tile && !!tile.properties && !!tile.properties.alpha) {
            tile.alpha = tile.properties.alpha;
        }
    }, this, 0, 0, this.map.width, this.map.height, 'Foreground_' + layer);

    this.animatedTiles = [];
    
    //get animations
    this.map.forEach(function(tile) {
        if(!!tile) {
            if(!this.animatedTiles[tile.y] && tile.index !== -1) this.animatedTiles[tile.y] = [];
            if(tile.index !== -1) this.animatedTiles[tile.y][tile.x] = tile.index;
        }


    }, this, 0, 0, 5, 20, 'Foreground_4');
    
};

Frogland.GetCurrentCollisionLayer = function() {

    return this['collisionLayer_' + this.currentLayer];
};

Frogland.ChangeLayer = function(newLayer, immediate) {

    if(this.currentLayer == newLayer || Frogland.changingLayer === true) return;

    if(!immediate) {
        Frogland.changingLayer = true;
        game.time.events.add(800, function() { Frogland.changingLayer = false; });
    }

    //get the current layer
    var currentForgroundLayer = this['foregroundLayer_' + this.currentLayer];
    var currentMidgroundLayer = this['midgroundLayer_' + this.currentLayer];
    var currentBackgroundLayer = this['backgroundLayer_' + this.currentLayer];
    var currentObjectLayer = objectController.GetCurrentObjectGroup();

    if(immediate) {
        currentForgroundLayer.visible = false;
        currentMidgroundLayer.visible = false;
        currentBackgroundLayer.visible = false;

        currentForgroundLayer.alpha = 0;
        currentMidgroundLayer.alpha = 0;
        currentBackgroundLayer.alpha = 0;
    } else {
        //fade out current layers
        game.add.tween(currentForgroundLayer).to({alpha: 0}, 300, Phaser.Easing.Linear.None, true).onComplete.add(function() { currentForgroundLayer.visible = false; });
        game.add.tween(currentMidgroundLayer).to({alpha: 0}, 300, Phaser.Easing.Linear.None, true).onComplete.add(function() { currentMidgroundLayer.visible = false; });
        game.add.tween(currentBackgroundLayer).to({alpha: 0}, 300, Phaser.Easing.Linear.None, true).onComplete.add(function() { currentBackgroundLayer.visible = false; });   
    }

    currentObjectLayer.forEach(function(obj) {
        if(immediate) {
            obj.alpha = 0;
        } else {
            game.add.tween(obj).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true);
        }

        if(!!obj.body) obj.body.enable = false;
        if(!!obj.Deactivate) obj.Deactivate();
    });

    //force a trigger the player is standing in to exit out
    triggerController.ForceExit(this.currentLayer);

    //update the layer
    this.currentLayer = newLayer;

    var newForgroundLayer = this['foregroundLayer_' + this.currentLayer];
    var newMidgroundLayer = this['midgroundLayer_' + this.currentLayer];
    var newBackgroundLayer = this['backgroundLayer_' + this.currentLayer];
    var newObjectLayer = objectController.GetCurrentObjectGroup();

    //bring in the new layers
    newForgroundLayer.visible = true;
    newForgroundLayer.alpha = 0;
    newMidgroundLayer.visible = true;
    newMidgroundLayer.alpha = 0;
    newBackgroundLayer.visible = true;
    newBackgroundLayer.alpha = 0;

    if(immediate) {
        newForgroundLayer.alpha = 1;
        newMidgroundLayer.alpha = 1;
        newBackgroundLayer.alpha = 1;
    } else {
        game.add.tween(newForgroundLayer).to({alpha: 1}, 200, Phaser.Easing.Linear.None, true);
        game.add.tween(newMidgroundLayer).to({alpha: 1}, 200, Phaser.Easing.Linear.None, true);
        game.add.tween(newBackgroundLayer).to({alpha: 1}, 200, Phaser.Easing.Linear.None, true);
    }

    newObjectLayer.forEach(function(obj) {
        if(obj.spriteType === 'checkpoint') {
            return;
        }
        
        obj.alpha = 0;

        if(immediate) {
            obj.alpha = 1;
        } else {
            game.add.tween(obj).to({alpha: 1}, 200, Phaser.Easing.Linear.None, true);
        }

        if(!!obj.body) obj.body.enable = true;
        if(!!obj.Activate) obj.Activate();
    });

    if(!!effectsController) effectsController.ClearDicedPieces();
    if(!!projectileController) projectileController.DestroyAllProjectiles();
};

Frogland.DislodgeTile = function(tile) {
    if(tile && tile.index === 1) {
        //make the tile robust
        tile.setCollision(true, true, true, true);
    }
    else if(tile && (tile.index === 5 || tile.index === 7) && tile.dislodged !== true) {
        
        //get the visible tile from the midground, and make it invisible
        var mgTile = Frogland.map.getTile(tile.x, tile.y, 'Midground_' + this.currentLayer);
        mgTile.alpha = 0;

        Frogland['midgroundLayer_' + this.currentLayer].dirty = true;

        tile.dislodged = true;
        tile.owningLayer = this.currentLayer;

        Frogland.fallenTiles.push(tile);

        projectileController.FallingTile(tile, mgTile);

        events.publish('play_sound', {name: 'floor_crumble'});


        game.time.events.add(game.rnd.between(50, 80), function() { 
            if(!!tile) {
                Frogland.DislodgeTile(Frogland.map.getTile(tile.x - 1, tile.y, 'Collision_' + Frogland.currentLayer));
                Frogland.DislodgeTile(Frogland.map.getTile(tile.x + 1, tile.y, 'Collision_' + Frogland.currentLayer));
                Frogland.DislodgeTile(Frogland.map.getTile(tile.x, tile.y - 1, 'Collision_' + Frogland.currentLayer));
                Frogland.DislodgeTile(Frogland.map.getTile(tile.x, tile.y + 1, 'Collision_' + Frogland.currentLayer));
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

        var mgTile = this.map.getTile(tile.x, tile.y, 'Midground_' + tile.owningLayer);
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

           
    }, Frogland, viewLeft, viewTop, viewRight, viewBottom, 'Foreground_' + Frogland.currentLayer); 

    if(changeHappened) {
        Frogland['foregroundLayer_' + Frogland.currentLayer].dirty = true;
    }
};

Frogland.UpdateTutorialBlocks = function() {
    Frogland.map.forEach(function(tile) {
        
        if(!!tile) {
            if(game.input.gamepad.supported && game.input.gamepad.active) {
                console.log('switching cause gamepad')
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
                console.log('switching cause no gamepad')
                
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

        Frogland['backgroundLayer_3'].dirty = true;
        

            
    }, Frogland, 0, 0, Frogland.width, Frogland.height, 'Background_3'); 
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
