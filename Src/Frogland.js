var Frogland = {};

Frogland.Create = function() {

    this.bg = game.add.tileSprite(0, 0, pixel.width * 1.5, pixel.height * 1.5, 'Background');
    this.bg.fixedToCamera = true;
    this.bg.autoScroll(-2, 0);

    this.plx2 = game.add.image(0, 0, 'parallax2');
    this.plx2.fixedToCamera = true;

    this.plx1 = game.add.image(0, 0, 'parallax1');
    this.plx1.fixedToCamera = true;

    this.map = game.add.tilemap('Frogland');
    this.map.addTilesetImage('FrogtownTiles');
    this.map.addTilesetImage('DepthsTiles');
    this.map.addTilesetImage('TerraceTiles');
    this.map.addTilesetImage('Doodads');
    this.map.addTilesetImage('Collision');
    //this.map.addTilesetImage('Lighting');

    this.openDoors = JSON.parse(localStorage.getItem('fraukiDoors')) || [];

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
    
    this.CreateBackgroundLayer(4, startLayer === 4);
    this.CreateBackgroundLayer(3, startLayer === 3);
    this.CreateBackgroundLayer(2, startLayer === 2);

    this.effectsGroup = game.add.group();
    
    frauki = new Player(game, fraukiStartX, fraukiStartY, 'Frauki');
    game.add.existing(frauki);
    game.camera.focusOnXY(frauki.x, frauki.y);

    this.CreateCollisionLayer(4);
    this.CreateCollisionLayer(3);
    this.CreateCollisionLayer(2);

    this.CreateObjectsLayer(4);
    this.CreateObjectsLayer(3);
    this.CreateObjectsLayer(2);

    this.CreateMidgroundLayer(4, startLayer === 4);
    this.CreateMidgroundLayer(3, startLayer === 3);
    this.CreateMidgroundLayer(2, startLayer === 2);

    this.CreateForegroundLayer(4, startLayer === 4);
    this.CreateForegroundLayer(3, startLayer === 3);
    this.CreateForegroundLayer(2, startLayer === 2);

    this.enemyPool = game.add.group();

    this.CreateDoorLayer(1);
    this.CreateDoorLayer(2);
    this.CreateDoorLayer(3);

    this.PreprocessTiles(4);
    this.PreprocessTiles(3);
    this.PreprocessTiles(2);

    triggerController.CreateTriggers(4);
    triggerController.CreateTriggers(3);
    triggerController.CreateTriggers(2);

    setInterval(function() {
        Frogland.AnimateTiles();
    }, 100);

    game.camera.bounds.inflate(120, 0);
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

    this.GetCurrentObjectGroup().forEach(function(o) {
        var padding = 100;

        if(o.spriteType !== 'enemy' && o.spriteType !== 'door' && !!o.body && o.spriteType !== 'ball') {
            if(o.body.x > game.camera.x - padding && o.body.y > game.camera.y - padding && o.body.x < game.camera.x + game.camera.width + padding && o.body.y < game.camera.y + game.camera.height + padding
                && o.owningLayer === Frogland.currentLayer) {
                o.body.enable = true;
            } else {
                o.body.enable = false;
            }
        }
    });

    game.physics.arcade.collide(frauki, this.GetCurrentCollisionLayer(), null, Collision.CollideFraukiWithEnvironment);
    game.physics.arcade.collide(frauki, this.GetCurrentObjectGroup(), Collision.CollideFraukiWithObject, Collision.OverlapFraukiWithObject);
    game.physics.arcade.collide(this.GetCurrentObjectGroup(), this.GetCurrentCollisionLayer());
    //game.physics.arcade.collide(this.GetCurrentObjectGroup(), this.GetCurrentObjectGroup(), null, Collision.OverlapObjectsWithSelf);

    if(projectileController.projectiles.countLiving() > 0) {
        game.physics.arcade.overlap(frauki, projectileController.projectiles, Collision.CollideFraukiWithProjectile);
    }

    this.plx1.cameraOffset.x = -(game.camera.x * 0.45) + 280;
    this.plx1.cameraOffset.y = -(game.camera.y * 0.30) + 220;

    if(game.camera.y > 80 * 16) this.plx1.visible = false;
    else this.plx1.visible = true;

    this.plx2.cameraOffset.x = -(game.camera.x * 0.40) + 400;
    this.plx2.cameraOffset.y = -(game.camera.y * 0.25) + 180;

    if(game.camera.y > 80 * 16) this.plx2.visible = false;
    else this.plx2.visible = true;
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
    this.map.setCollision([1, 3, 4, 5, 7, 9], true, 'Collision_' + layer);
    this['collisionLayer_' + layer].visible = false;
};

Frogland.CreateObjectsLayer = function(layer) {
    var that = this;
    var currLayer = 'objectGroup_' + layer;

    if(!this[currLayer]) this[currLayer] = game.add.group();
    this[currLayer].enableBody = true;

    FileMap.Junk.forEach(function(junk) {
        Frogland.map.createFromObjects('Objects_' + layer, junk.Tile, junk.Name, junk.Name, true, true, that[currLayer], Junk, true);
    });

    //create each enemy for this layer
    FileMap.Enemies.forEach(function(enemy) {
        Frogland.map.createFromObjects('Objects_' + layer, enemy.Tile, enemy.Name, null, true, true, that[currLayer], Enemy, false);
    });

    FileMap.Runes.forEach(function(rune) {
        if(frauki.upgradeSaves.indexOf(rune.Name) === -1) {
            Frogland.map.createFromObjects('Objects_' + layer, rune.Tile, rune.Name, rune.Name, true, true, that[currLayer], TechnoRune, false);
        }
    });

    //create all the apples
    this.map.createFromObjects('Objects_' + layer, 66, 'Misc', 'Apple0000', true, true, this[currLayer], Apple, false);
    this.map.createFromObjects('Objects_' + layer, 68, 'Misc', 'EnergyBitPos0000', true, true, this[currLayer], EnergyNugg, false);

    //create the doors
    this.map.createFromObjects('Objects_' + layer, 67, 'Misc', 'Door0000', true, true, this[currLayer], Door, false);

    this.ball = game.add.sprite(85 * 16, 41 * 16, 'Misc', 'Ball0000', this[currLayer]);
    game.physics.enable(this.ball, Phaser.Physics.ARCADE);
    this.ball.body.bounce.setTo(0.8);
    this.ball.body.drag.setTo(200);
    this.ball.anchor.setTo(0.5);
    this.ball.body.angularDrag = 500;
    this.ball.spriteType = 'ball';
    this.ball.body.collideWorldBounds = true;
    this.ball.body.maxVelocity.setTo(700);

    console.log(this[currLayer]);

    //inform each enemy of its own layer
    this[currLayer].forEach(function(obj) {
        obj.owningLayer = layer;


        if(obj.spriteType === 'door') {
            if(Frogland.openDoors.indexOf(obj.id) > -1) {
                OpenDoor(frauki, obj, true);
            }
        } else if(Frogland.currentLayer !== layer) {
            obj.alpha = 0;
            obj.body.enable = false;
        }
    });  

    //game.physics.arcade.collide(this[currLayer], this['collisionLayer_' + layer]);  
};

Frogland.CreateDoorLayer = function(layer) {
    this['door' + layer + 'Group'] = game.add.group();
    this.map.createFromObjects('Doors_' + layer, 67, 'Misc', 'Door0000', true, false, this['door' + layer + 'Group'], Door, false);
    this['door' + layer + 'Group'].forEach(function(d) { d.alpha = 0; });
};

//spawns some random enemies
Frogland.ThunderDome = function(x, y) {

    // console.log('spawning shit');

    var enemType = Math.random() * 6;
    var enemName = '';

    if(enemType < 1) {
        enemName = 'Buzzar';
    } else if(enemType < 2) {
        enemName = 'Sporoid';
    } else if(enemType < 3) {
        enemName = 'Insectoid';
    } else if(enemType < 4) {
        enemName = 'CreeperThistle';
    } else if(enemType < 5) {
        enemName = 'Haystax';
    } else if(enemType < 6) {
        enemName = 'Madman';
    }

    // if(Math.random() > 0.85) {
    //     enem = new Enemy(game, 151 * 16, 81 * 16, enemName);
    //     game.add.existing(enem);
    //     enem.owningLayer = 3;
    //     Frogland['objectGroup_3'].add(enem);
    // }

    // if(Math.random() > 0.85) {
    //     enem = new Enemy(game, 156 * 16, 71 * 16, enemName);
    //     game.add.existing(enem);
    //     enem.owningLayer = 3;
    //     Frogland['objectGroup_3'].add(enem);
    // }

    // if(Math.random() > 0.85) {
    //     enem = new Enemy(game, 163 * 16, 72 * 16, enemName);
    //     game.add.existing(enem);
    //     enem.owningLayer = 3;
    //     Frogland['objectGroup_3'].add(enem);
    // }

    // if(Math.random() > 0.85) {
    //     enem = new Enemy(game, 174 * 16, 72 * 16, enemName);
    //     game.add.existing(enem);
    //     enem.owningLayer = 3;
    //     Frogland['objectGroup_3'].add(enem);
    // }

    // if(Math.random() > 0.85) {
    //     enem = new Enemy(game, 175 * 16, 83 * 16, enemName);
    //     game.add.existing(enem);
    //     enem.owningLayer = 3;
    //     Frogland['objectGroup_3'].add(enem);
    // }

    // if(Math.random() > 0.85) {
        // enem = new Enemy(game, 166 * 16, 89 * 16, 'Buzzar');
        // game.add.existing(enem);
        // enem.owningLayer = 3;
        // Frogland['objectGroup_3'].add(enem);
    // }
};

Frogland.PreprocessTiles = function(layer) {
    //special procesing for collision tiles
    this.map.forEach(function(tile) {

        if(tile.index === 4 || tile.index === 12) {
            tile.collideLeft = false;
            tile.collideRight = false;
            tile.collideUp = true;
            tile.collideDown = false;
            tile.faceUp = true;
            tile.faceDown = false;
            tile.faceLeft = false;
            tile.faceRight = false;

        //drop tiles
        } else if(tile.index === 6) {
            tile.collideLeft = false;
            tile.collideRight = false;
            tile.collideUp = false;
            tile.collideDown = true;
            tile.faceUp = false;
            tile.faceDown = true;
            tile.faceLeft = false;
            tile.faceRight = false;
        }
           
    }, this, 0, 0, this.map.width, this.map.height, 'Collision_' + layer);

    this.map.forEach(function(tile) {

        if(!!tile.properties && !!tile.properties.alpha) {
            tile.alpha = tile.properties.alpha;
        }
    }, this, 0, 0, this.map.width, this.map.height, 'Foreground_' + layer);

    this.animatedTiles = [];
    //get animations
    this.map.forEach(function(tile) {

        if(!this.animatedTiles[tile.y] && tile.index !== -1) this.animatedTiles[tile.y] = [];

        if(tile.index !== -1) this.animatedTiles[tile.y][tile.x] = tile.index;

    }, this, 0, 0, 5, 20, 'Foreground_4');
};

Frogland.GetCurrentObjectGroup = function() {

    return this['objectGroup_' + this.currentLayer];
};

Frogland.GetCurrentCollisionLayer = function() {

    return this['collisionLayer_' + this.currentLayer];
};

Frogland.ChangeLayer = function(newLayer) {

    if(this.currentLayer == newLayer) return;

    //get the current layer
    var currentForgroundLayer = this['foregroundLayer_' + this.currentLayer];
    var currentMidgroundLayer = this['midgroundLayer_' + this.currentLayer];
    var currentBackgroundLayer = this['backgroundLayer_' + this.currentLayer];
    //var currentLightingLayer = this['lightingLayer_' + this.currentLayer];
    var currentCollisionLayer = this.GetCurrentCollisionLayer();
    var currentObjectLayer = this.GetCurrentObjectGroup();

    game.add.tween(currentForgroundLayer).to({alpha: 0}, 300, Phaser.Easing.Linear.None, true);
    game.add.tween(currentMidgroundLayer).to({alpha: 0}, 300, Phaser.Easing.Linear.None, true);
    game.add.tween(currentBackgroundLayer).to({alpha: 0}, 300, Phaser.Easing.Linear.None, true);

    currentObjectLayer.forEach(function(obj) {
        game.add.tween(obj).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true);
        if(!!obj.body) obj.body.enable = false;
    });

    this.currentLayer = newLayer;

    currentForgroundLayer = this['foregroundLayer_' + this.currentLayer];
    currentMidgroundLayer = this['midgroundLayer_' + this.currentLayer];
    currentBackgroundLayer = this['backgroundLayer_' + this.currentLayer];
    //currentLightingLayer = this['lightingLayer_' + this.currentLayer];
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
        if(!!obj.body) obj.body.enable = true;
    });
};

Frogland.DislodgeTile = function(tile) {
    if(tile && (tile.index === 5 || tile.index === 7) && tile.dislodged !== true) {
        
        mgTile = Frogland.map.getTile(tile.x, tile.y, 'Midground_' + this.currentLayer);
        mgTile.alpha = 0;
        Frogland['midgroundLayer_' + this.currentLayer].dirty = true;

        tile.dislodged = true;

        projectileController.FallingTile(tile);

        setTimeout(function() { 
            Frogland.DislodgeTile(Frogland.map.getTile(tile.x - 1, tile.y, 'Collision_' + Frogland.currentLayer));
            Frogland.DislodgeTile(Frogland.map.getTile(tile.x + 1, tile.y, 'Collision_' + Frogland.currentLayer));
            Frogland.DislodgeTile(Frogland.map.getTile(tile.x, tile.y - 1, 'Collision_' + Frogland.currentLayer));
            Frogland.DislodgeTile(Frogland.map.getTile(tile.x, tile.y + 1, 'Collision_' + Frogland.currentLayer));
        }, (Math.random() * 80));
    }
};

Frogland.AnimateTiles = function() {
    var viewLeft, viewRight, viewTop, viewBottom;

    viewLeft = Math.ceil((game.camera.x / 16));
    viewTop = Math.ceil((game.camera.y / 16));
    viewRight = Math.ceil((game.camera.width / 16));
    viewBottom = Math.ceil((game.camera.height / 16));

    if(viewLeft < 0) viewLeft = 0;
    if(viewLeft > 155) viewLeft = 155;
    if(viewTop < 0) viewTop = 0;

    this.map.forEach(function(tile) {

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
           
    }, this, viewLeft, viewTop, viewRight, viewBottom, 'Foreground_' + Frogland.currentLayer); 
};
