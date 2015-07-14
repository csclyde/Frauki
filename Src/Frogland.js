var Frogland = {};

Frogland.Create = function() {

    this.bg = game.add.tileSprite(0, 0, pixel.width, pixel.height, 'Background');
    this.bg.fixedToCamera = true;

    this.plx1 = game.add.tileSprite(0, 0, 2048, 576, 'parallax1');
    this.plx1.fixedToCamera = true;

    this.plx2 = game.add.tileSprite(0, 0, pixel.width, pixel.height, 'parallax2');
    this.plx2.fixedToCamera = true;

    this.map = game.add.tilemap('Frogland');
    this.map.addTilesetImage('FrogtownTiles');
    this.map.addTilesetImage('DepthsTiles');
    this.map.addTilesetImage('TerraceTiles');
    this.map.addTilesetImage('Doodads');
    this.map.addTilesetImage('Collision');

    this.backgroundLayer_4 = this.map.createLayer('Background_4');
    this.backgroundLayer_4.visible = +this.map.properties.startLayer === 4;

    this.backgroundLayer_3 = this.map.createLayer('Background_3');
    this.backgroundLayer_3.visible = +this.map.properties.startLayer === 3;

    this.backgroundLayer_2 = this.map.createLayer('Background_2');
    this.backgroundLayer_2.visible = +this.map.properties.startLayer === 2;

    frauki = new Player(game, this.map.properties.startX * 16, this.map.properties.startY * 16, 'Frauki');
    game.add.existing(frauki);

    game.camera.focusOnXY(frauki.body.x, frauki.body.y);

    this.CreateMapLayer(4, +this.map.properties.startLayer === 4);
    this.CreateMapLayer(3, +this.map.properties.startLayer === 3);
    this.CreateMapLayer(2, +this.map.properties.startLayer === 2);
    
    this.currentLayer = +this.map.properties.startLayer;

    this.enemyPool = game.add.group();
    this.door1Group = game.add.group();
    this.door2Group = game.add.group();

    this.CreateObjectsLayer(4);
    this.CreateObjectsLayer(3);
    this.CreateObjectsLayer(2);

    this.map.createFromObjects('Doors_1', 67, 'Door', 'Door0000', true, false, this.door1Group, Door, false);
    this.map.createFromObjects('Doors_2', 67, 'Door', 'Door0000', true, false, this.door2Group, Door, false);

    this.ProcessCollisionTiles(4);
    this.ProcessCollisionTiles(3);
    this.ProcessCollisionTiles(2);

    this.easyStar_4 = new EasyStar.js();
    this.easyStar_4.setGrid(this.collisionLayer_4.layer.data);
    this.easyStar_4.setAcceptableTiles([-1]);

    this.easyStar_3 = new EasyStar.js();
    this.easyStar_3.setGrid(this.collisionLayer_3.layer.data);
    this.easyStar_3.setAcceptableTiles([-1]);

    this.easyStar_2 = new EasyStar.js();
    this.easyStar_2.setGrid(this.collisionLayer_2.layer.data);
    this.easyStar_2.setAcceptableTiles([-1]);

    triggerController.CreateTriggers(4);
    triggerController.CreateTriggers(3);
    triggerController.CreateTriggers(2);

    setInterval(function() {
        Frogland.AnimateWater();
    }, 200);
};

Frogland.Update = function() {

    //reset environmental effect flags
    frauki.states.inWater = false;
    frauki.states.onCloud = false;
    frauki.states.inUpdraft = false;
    frauki.states.onLeftSlope = false;
    frauki.states.onRightSlope = false;

    game.physics.arcade.collide(frauki, this.GetCurrentCollisionLayer(), null, this.CheckEnvironmentalCollisions);
    game.physics.arcade.collide(frauki, this.GetCurrentObjectGroup(), this.CollideFraukiWithObject, this.OverlapFraukiWithObject);
    game.physics.arcade.collide(this.GetCurrentObjectGroup(), this.GetCurrentCollisionLayer());
    game.physics.arcade.collide(this.GetCurrentObjectGroup(), this.GetCurrentObjectGroup(), null, this.OverlapEnemiesWithSelf);

    game.physics.arcade.overlap(frauki, projectileController.projectiles, this.CollideFraukiWithProjectile);

    this.plx1.tilePosition.x = -(game.camera.x * 0.5);
    this.plx1.tilePosition.y = -(game.camera.y * 0.35);
    this.plx2.tilePosition.x = -(game.camera.x * 0.9);

};

Frogland.CreateMapLayer = function(layer, visible) {

    this['midgroundLayer_' + layer] = this.map.createLayer('Midground_' + layer);
    this['midgroundLayer_' + layer].resizeWorld();
    this['midgroundLayer_' + layer].visible = visible;
    
    this['foregroundLayer_' + layer] = this.map.createLayer('Foreground_' + layer);
    this['foregroundLayer_' + layer].visible = visible;

    this['collisionLayer_' + layer] = this.map.createLayer('Collision_' + layer);
    this.map.setCollision([1, 3, 4, 5, 7, 9], true, 'Collision_' + layer);
    this['collisionLayer_' + layer].visible = false;
};

Frogland.CreateObjectsLayer = function(layer) {
    var that = this;
    var currLayer = 'objectGroup_' + layer;

    this[currLayer] = game.add.group();
    this[currLayer].enableBody = true;

    //create each enemy for this layer
    FileMap.Enemies.forEach(function(enemy) {
        Frogland.map.createFromObjects('Objects_' + layer, enemy.Tile, enemy.Name, null, true, false, that[currLayer], Enemy, false);
    });

    //create all the apples
    this.map.createFromObjects('Objects_' + layer, 66, 'Misc', 'Apple0000', true, false, this[currLayer], Apple, false);

    //inform each enemy of its own layer
    this[currLayer].forEach(function(obj) {
        obj.owningLayer = layer;

        if(Frogland.currentLayer !== layer) {
            obj.alpha = 0;
            obj.body.enable = false;
        }
    });    
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

Frogland.ProcessCollisionTiles = function(layer) {
    //special procesing for collision tiles
    this.map.forEach(function(tile) {

        //water tiles
        if(tile.index === 2 || tile.index === 9 || tile.index === 10) {
            var water = this.map.getTileWorldXY(tile.worldX, tile.worldY, 16, 16, 'Foreground_' + layer);

            if(water) {
                water.alpha = 0.3;
            }

        } else if(tile.index === 11) {

            var draft = this.map.getTileWorldXY(tile.worldX, tile.worldY, 16, 16, 'Foreground_' + layer);

            if(draft) {
                draft.alpha = 0.2;
            }

        //cloud tiles
        } else if(tile.index === 4 || tile.index === 12) {
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
        if(tile.index === 790 || tile.index === 791 || tile.index === 822 || tile.index === 823) {
            tile.alpha = 0.95;
        }
    }, this, 0, 0, this.map.width, this.map.height, 'Foreground_4');

    this.map.forEach(function(tile) {
        if(tile.index === 790 || tile.index === 791 || tile.index === 822 || tile.index === 823) {
            tile.alpha = 0.95;
        }
    }, this, 0, 0, this.map.width, this.map.height, 'Foreground_3');

    this.map.forEach(function(tile) {
        if(tile.index === 790 || tile.index === 791 || tile.index === 822 || tile.index === 823) {
            tile.alpha = 0.95;
        }
    }, this, 0, 0, this.map.width, this.map.height, 'Foreground_2');
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
            o.poise = o.initialPoise;
        }

        return false;
    }

    return true;
};

Frogland.CollideFraukiWithObject = function(f, o) {
    
};

Frogland.CollideFraukiWithProjectile = function(f, p) {

    if(p.projType === 'tar') {
        frauki.Hit(f, p.owningEnemy);
        p.destroy();
    }

};

Frogland.CheckEnvironmentalCollisions = function(f, tile) {

    //solid tile
    if(tile.index === 1 || tile.index === 9) { 
        return true;

    //water
    } else if(tile.index === 2 || tile.index === 10) { 
        frauki.states.inWater = true;

        if(tile.index === 10) effectsController.Splash(tile);
        
        return false;

    //trick wall
    } else if(tile.index === 3) {
        if(frauki.state === frauki.Rolling) {
            return false;
        } else {
            return true;
        }

    //cloud tile
    } else if(tile.index === 4) { 
        frauki.states.onCloud = true;

        if(frauki.states.droppingThroughCloud) {
            return false;
        } else {
            return true;
        }

    //falling tiles and attackable tiles
    } else if(tile.index === 5) { 

        if(tile.dislodged === true) {
            return false;
        }
        
        if(tile.waitingToFall !== true) {
            Frogland.DislodgeTile(tile); 
            tile.waitingToFall = true;
        }

        return true;

    } else if(tile.index === 7) {

        if(tile.dislodged === true) {
            return false;
        }

        return true;

    //updraft
    } else if(tile.index === 11) {
        frauki.states.inUpdraft = true;

    //spikes
    } else if(tile.index === 12) {

    //left slope
    } else if(tile.index === 17) {
        frauki.states.onLeftSlope = true;

    //right slope
    } else if(tile.index === 18) {
        frauki.states.onRightSlope = true;
    }
};

Frogland.OverlapEnemiesWithSelf = function(o1, o2) {
    if(o1.enemyName && o2.enemyName && o1.enemyName === o2.enemyName) {
        return true;
    } else {
        return false;
    }
};

Frogland.DislodgeTile = function(tile) {
    if(tile && (tile.index === 5 || tile.index === 7) && tile.dislodged !== true) {
        
        mgTile = Frogland.map.getTile(tile.x, tile.y, 'Midground_3');
        mgTile.alpha = 0;
        Frogland.midgroundLayer_3.dirty = true;

        tile.dislodged = true;

        projectileController.FallingTile(tile);

        setTimeout(function() { 
            Frogland.DislodgeTile(Frogland.map.getTile(tile.x - 1, tile.y, 'Collision_3'));
            Frogland.DislodgeTile(Frogland.map.getTile(tile.x + 1, tile.y, 'Collision_3'));
            Frogland.DislodgeTile(Frogland.map.getTile(tile.x, tile.y - 1, 'Collision_3'));
            Frogland.DislodgeTile(Frogland.map.getTile(tile.x, tile.y + 1, 'Collision_3'));
        }, (Math.random() * 80));
    }
};

//383, 545

Frogland.AnimateWater = function() {
    var viewLeft, viewRight, viewTop, viewBottom;

    viewLeft = Math.ceil((game.camera.x / 16) - 2);
    viewTop = Math.ceil((game.camera.y / 16) - 2);
    viewRight = Math.ceil((game.camera.width / 16) + 2);
    viewBottom = Math.ceil((game.camera.height / 16) + 2);

    this.map.forEach(function(tile) {

        //water tiles
        if(tile.index === 383) tile.index = 382;
        if(tile.index === 385) tile.index = 383;
        if(tile.index === 384) tile.index = 385;
        if(tile.index === 382) tile.index = 384;

        if(tile.index === 386) tile.index = 382;
        if(tile.index === 388) tile.index = 386;
        if(tile.index === 387) tile.index = 388;
        if(tile.index === 382) tile.index = 387;

        if(tile.index === 545) tile.index = 544;
        if(tile.index === 547) tile.index = 545;
        if(tile.index === 546) tile.index = 547;
        if(tile.index === 544) tile.index = 546;
           
    }, this, viewLeft, viewTop, viewRight, viewBottom, 'Foreground_' + Frogland.currentLayer);
  
};

function TilesHit(f, t) {
    if(t.index === 7) {
        Frogland.DislodgeTile(t);
    }
};