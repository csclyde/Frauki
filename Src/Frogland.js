var Frogland = {};

Frogland.Create = function() {

    this.timers = new TimerUtil();

    this.bg = game.add.tileSprite(0, 0, pixel.width * 1.5, pixel.height * 1.5, 'Background');
    this.bg.fixedToCamera = true;
    this.bg.autoScroll(-2, 0);


    this.clouds1 = game.add.tileSprite(0, 0, 1024, 512, 'clouds1');
    this.clouds1.fixedToCamera = true;
    this.clouds1.autoScroll(-2, 0);

    this.clouds2 = game.add.tileSprite(0, 0, 1024, 512, 'clouds2');
    this.clouds2.fixedToCamera = true;
    this.clouds2.autoScroll(-3, 0);

    this.plx1 = game.add.image(0, 0, 'parallax1');
    this.plx1.fixedToCamera = true;

    this.map = game.add.tilemap('Frogland');
    this.map.addTilesetImage('FrogtownTiles');
    this.map.addTilesetImage('DepthsTiles');
    this.map.addTilesetImage('TerraceTiles');
    this.map.addTilesetImage('Doodads');
    this.map.addTilesetImage('Collision');

    var fraukiStartX, fraukiStartY, startLayer;

    if(this.map.properties.debug === 'false') {
        fraukiStartX = 2025;
        fraukiStartY = 1050;
        startLayer = 3;
    } else {
        fraukiStartX = this.map.properties.startX * 16;
        fraukiStartY = this.map.properties.startY * 16;
        startLayer = +this.map.properties.startLayer;
    }

    this.currentLayer = startLayer;

    backdropController.LoadBackgrounds();
    
    this.CreateBackgroundLayer(4, startLayer === 4);
    this.CreateBackgroundLayer(3, startLayer === 3);
    this.CreateBackgroundLayer(2, startLayer === 2);

    this.placedShards = game.add.group();
    this.effectsGroup = game.add.group();
    
    frauki = new Player(game, fraukiStartX, fraukiStartY, 'Frauki');
    game.add.existing(frauki);
    game.camera.focusOnXY(frauki.x, frauki.y);

    this.CreateCollisionLayer(4);
    this.CreateCollisionLayer(3);
    this.CreateCollisionLayer(2);

    objectController.CreateObjectsLayer(4);
    objectController.CreateObjectsLayer(3);
    objectController.CreateObjectsLayer(2);

    this.CreateMidgroundLayer(4, startLayer === 4);
    this.CreateMidgroundLayer(3, startLayer === 3);
    this.CreateMidgroundLayer(2, startLayer === 2);

    this.CreateForegroundLayer(4, startLayer === 4);
    this.CreateForegroundLayer(3, startLayer === 3);
    this.CreateForegroundLayer(2, startLayer === 2);

    this.shardGroup = game.add.group();

    this.CreateShards(4);
    this.CreateShards(3);
    this.CreateShards(2);

    SetShardVisibility();

    this.CreateDoorLayer(1);
    this.CreateDoorLayer(2);
    this.CreateDoorLayer(3);

    this.PreprocessTiles(4);
    this.PreprocessTiles(3);
    this.PreprocessTiles(2);

    triggerController.CreateTriggers(4);
    triggerController.CreateTriggers(3);
    triggerController.CreateTriggers(2);

    // setInterval(function() {
    //     Frogland.AnimateTiles();
    // }, 100);

    this.SpawnFrauki();

    //game.camera.bounds.inflate(120, 0);

    objectController.CompileObjectList();

    //this will store fallen tiles, so that when you die they can be reset
    this.fallenTiles = [];

    events.subscribe('open_door', function(params) {
        OpenDoorById(params.door_name);
    });

    game.physics.arcade.sortDirection = game.physics.arcade.TOP_BOTTOM
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

    for(var i = 0, max = this.GetCurrentObjectGroup().children.length; i < max; i++) {
        var padding = 300;
        var o = this.GetCurrentObjectGroup().children[i];

        
        if(o.spriteType !== 'door' && !!o.body && o.spriteType !== 'ball') {
            if(o.body.x > game.camera.x - padding && o.body.y > game.camera.y - padding && o.body.x < game.camera.x + game.camera.width + padding && o.body.y < game.camera.y + game.camera.height + padding) {
                o.body.enable = true;
            } else {
                o.body.enable = false;
            }
        }
    }

    this.HandleCollisions();

    this.clouds1.cameraOffset.x = -(game.camera.x * 0.10) + 0;
    this.clouds1.cameraOffset.y = -(game.camera.y * 0.05) + 0;

    // if(game.camera.y > 80 * 16) this.clouds1.visible = false;
    // else this.clouds1.visible = true;

    this.clouds2.cameraOffset.x = -(game.camera.x * 0.15) + 0;
    this.clouds2.cameraOffset.y = -(game.camera.y * 0.06) + 20;

    // if(game.camera.y > 80 * 16) this.clouds2.visible = false;
    // else this.clouds2.visible = true;

    this.plx1.cameraOffset.x = -(game.camera.x * 0.20) + 0;
    this.plx1.cameraOffset.y = -(game.camera.y * 0.08) + 220;

    // if(game.camera.y > 80 * 16) this.plx1.visible = false;
    // else this.plx1.visible = true;
};

Frogland.HandleCollisions = function() {
    //moving objects collided with the world geometry
    game.physics.arcade.collideSpriteVsTilemapLayer(frauki, this.GetCurrentCollisionLayer(), null, Collision.CollideFraukiWithEnvironment, null, false);
    game.physics.arcade.collideGroupVsTilemapLayer(this.GetCurrentObjectGroup(), this.GetCurrentCollisionLayer(), null, Collision.OverlapObjectsWithEnvironment, null, false);

    //frauki is collided with other moving objects
    game.physics.arcade.collideHandler(frauki, this.GetCurrentObjectGroup(), null, Collision.OverlapFraukiWithObject, null, false);
    game.physics.arcade.collideSpriteVsGroup(frauki, this.shardGroup, null, Collision.OverlapFraukiWithShard, null, true);

    //collide enemies with doors
    game.physics.arcade.collide(objectController.enemyList, objectController.doorList);

    //overlap fraukis attack with objects and projectiles
    if(frauki.Attacking()) {
        game.physics.arcade.overlap(frauki.attackRect, Frogland.GetCurrentObjectGroup(), Collision.OverlapAttackWithObject);
    }

    //objects are collided with themselves
    //game.physics.arcade.collide(this.GetCurrentObjectGroup(), undefined, null, Collision.OverlapObjectsWithSelf);

    //shards are checked against doors
    if(!!frauki.carriedShard && this.timers.TimerUp('shard_object_check')) {
        game.physics.arcade.overlap(this.shardGroup, this.GetCurrentObjectGroup(), null, Collision.OverlapShardWithObject);
        this.timers.SetTimer('shard_object_check', 500);
    }

    //frauki is checked against projectiles
    if(projectileController.projectiles.countLiving() > 0) {
        game.physics.arcade.overlap(frauki, projectileController.projectiles, Collision.CollideFraukiWithProjectile);
    }
};

Frogland.SpawnFrauki = function() {
    if(Frogland.map.properties.debug === 'false') {

        Frogland.objectGroup_2.forEach(function(obj) {
            if(obj.spriteType === 'checkpoint' && obj.id == GameData.GetCheckpoint()) {
                frauki.x = obj.x;
                frauki.y = obj.y + frauki.body.height;
                Frogland.ChangeLayer(obj.owningLayer);   
            } 
        });  

        Frogland.objectGroup_3.forEach(function(obj) {
            if(obj.spriteType === 'checkpoint' && obj.id == GameData.GetCheckpoint()) {
                frauki.x = obj.x;
                frauki.y = obj.y + frauki.body.height;
                Frogland.ChangeLayer(obj.owningLayer);   
            } 
        }); 

        Frogland.objectGroup_4.forEach(function(obj) {
            if(obj.spriteType === 'checkpoint' && obj.id == GameData.GetCheckpoint()) {
                frauki.x = obj.x;
                frauki.y = obj.y + frauki.body.height;
                Frogland.ChangeLayer(obj.owningLayer);   
            } 
        }); 

    } else {
        fraukiStartX = this.map.properties.startX * 16;
        fraukiStartY = this.map.properties.startY * 16;
        startLayer = +this.map.properties.startLayer;
    }
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
    this.map.setCollision([1, 3, 4, 5, 7, 8, 9], true, 'Collision_' + layer);
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

Frogland.CreateShards = function(layer) {

    this.shardLayer = layer;
    this.map.createFromObjects('Objects_' + layer, 70, 'Shard0000', 'Shard0000', true, true, Frogland.shardGroup, Shard, false);
    this.map.createFromObjects('Objects_' + layer, 71, 'Shard0001', 'Shard0001', true, true, Frogland.shardGroup, Shard, false);
    this.map.createFromObjects('Objects_' + layer, 72, 'Shard0002', 'Shard0002', true, true, Frogland.shardGroup, Shard, false);
    this.map.createFromObjects('Objects_' + layer, 73, 'Shard0003', 'Shard0003', true, true, Frogland.shardGroup, Shard, false);
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

Frogland.GetCurrentObjectGroup = function() {

    return this['objectGroup_' + this.currentLayer];
};

Frogland.GetCurrentCollisionLayer = function() {

    return this['collisionLayer_' + this.currentLayer];
};

Frogland.ChangeLayer = function(newLayer) {

    if(this.currentLayer == newLayer || Frogland.changingLayer === true) return;

    Frogland.changingLayer = true;
    setTimeout(function() { Frogland.changingLayer = false; }, 350);

    //get the current layer
    var currentForgroundLayer = this['foregroundLayer_' + this.currentLayer];
    var currentMidgroundLayer = this['midgroundLayer_' + this.currentLayer];
    var currentBackgroundLayer = this['backgroundLayer_' + this.currentLayer];
    var currentObjectLayer = this.GetCurrentObjectGroup();

    //fade out current layers
    game.add.tween(currentForgroundLayer).to({alpha: 0}, 300, Phaser.Easing.Linear.None, true).onComplete.add(function() { currentForgroundLayer.visible = false; });
    game.add.tween(currentMidgroundLayer).to({alpha: 0}, 300, Phaser.Easing.Linear.None, true).onComplete.add(function() { currentMidgroundLayer.visible = false; });
    game.add.tween(currentBackgroundLayer).to({alpha: 0}, 300, Phaser.Easing.Linear.None, true).onComplete.add(function() { currentBackgroundLayer.visible = false; });

    currentObjectLayer.forEach(function(obj) {
        game.add.tween(obj).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true);
        if(!!obj.body) obj.body.enable = false;
    });

    //force a trigger the player is standing in to exit out
    triggerController.ForceExit(this.currentLayer);

    //update the layer
    this.currentLayer = newLayer;

    var newForgroundLayer = this['foregroundLayer_' + this.currentLayer];
    var newMidgroundLayer = this['midgroundLayer_' + this.currentLayer];
    var newBackgroundLayer = this['backgroundLayer_' + this.currentLayer];
    var newObjectLayer = this.GetCurrentObjectGroup();

    //bring in the new layers
    newForgroundLayer.visible = true;
    newForgroundLayer.alpha = 0;
    newMidgroundLayer.visible = true;
    newMidgroundLayer.alpha = 0;
    newBackgroundLayer.visible = true;
    newBackgroundLayer.alpha = 0;

    game.add.tween(newForgroundLayer).to({alpha: 1}, 200, Phaser.Easing.Linear.None, true);
    game.add.tween(newMidgroundLayer).to({alpha: 1}, 200, Phaser.Easing.Linear.None, true);
    game.add.tween(newBackgroundLayer).to({alpha: 1}, 200, Phaser.Easing.Linear.None, true);

    newObjectLayer.forEach(function(obj) {
        if(obj.spriteType === 'checkpoint') {
            return;
        }
        
        obj.alpha = 0;
        game.add.tween(obj).to({alpha: 1}, 200, Phaser.Easing.Linear.None, true);
        if(!!obj.body) obj.body.enable = true;
    });

    //update fraukis shard current layer
    if(!!frauki.carriedShard) {
        frauki.carriedShard.currentLayer = newLayer;
    }

    SetShardVisibility();
    effectsController.ClearDicedPieces();
    projectileController.DestroyAllProjectiles();
};

Frogland.DislodgeTile = function(tile) {
    if(tile && (tile.index === 5 || tile.index === 7) && tile.dislodged !== true) {
        
        //get the visible tile from the midground, and make it invisible
        var mgTile = Frogland.map.getTile(tile.x, tile.y, 'Midground_' + this.currentLayer);
        mgTile.alpha = 0;

        Frogland['midgroundLayer_' + this.currentLayer].dirty = true;

        tile.dislodged = true;

        Frogland.fallenTiles.push(tile);

        projectileController.FallingTile(tile);

        events.publish('play_sound', {name: 'floor_crumble'});


        setTimeout(function() { 
            if(!!tile) {
                Frogland.DislodgeTile(Frogland.map.getTile(tile.x - 1, tile.y, 'Collision_' + Frogland.currentLayer));
                Frogland.DislodgeTile(Frogland.map.getTile(tile.x + 1, tile.y, 'Collision_' + Frogland.currentLayer));
                Frogland.DislodgeTile(Frogland.map.getTile(tile.x, tile.y - 1, 'Collision_' + Frogland.currentLayer));
                Frogland.DislodgeTile(Frogland.map.getTile(tile.x, tile.y + 1, 'Collision_' + Frogland.currentLayer));
            }
        }, (Math.random() * 80));
    }
};

Frogland.ResetFallenTiles = function() {
    var i = this.fallenTiles.length;
    while(i--) {
        var tile = this.fallenTiles[i];
        
        tile.dislodged = false;
        tile.waitingToFall = false;

        var mgTile = this.map.getTile(tile.x, tile.y, 'Midground_' + this.currentLayer);
        if(!!mgTile) mgTile.alpha = 1;
    }
};

Frogland.AnimateTiles = function() {
    var viewLeft, viewRight, viewTop, viewBottom;

    viewLeft = Math.ceil((game.camera.x / 16));
    viewTop = Math.ceil((game.camera.y / 16));
    viewRight = Math.ceil((game.camera.width / 16));
    viewBottom = Math.ceil((game.camera.height / 16));

    if(viewLeft < 0) viewLeft = 0;
    if(viewLeft + viewRight > Math.ceil(game.world.width / 16)) viewLeft = Math.ceil(game.world.width / 16) - viewRight;
    if(viewTop < 0) viewTop = 0;
    if(viewTop + viewBottom > Math.ceil(game.world.height / 16)) viewTop = Math.ceil(game.world.height / 16) - viewBottom;

    this.map.forEach(function(tile) {

        if(!!tile) {
            for(var i = 0; i < this.animatedTiles.length; i++) {

                var animLength = this.animatedTiles[i].length;

                if(!this.animatedTiles[i] || animLength <= 1) {
                    continue;
                }

                //loop the final tile back to the start
                if(tile.index === this.animatedTiles[i][animLength - 1]) {
                    tile.index = this.animatedTiles[i][0]; 
                    continue;
                }

                //increment the rest
                for(var j = 0; j < animLength - 1; j++) {
                    if(tile.index === this.animatedTiles[i][j]) {
                        tile.index = this.animatedTiles[i][j + 1];
                        break;
                    }
                }
            
            }
        }

           
    }, this, viewLeft, viewTop, viewRight, viewBottom, 'Foreground_' + Frogland.currentLayer); 

    Frogland['foregroundLayer_' + Frogland.currentLayer].dirty = true;
};
