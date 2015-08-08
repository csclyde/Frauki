var Frogland = {};

Frogland.Create = function() {

    this.bg = game.add.tileSprite(0, 0, pixel.width * pixel.scale, pixel.height * pixel.scale, 'Background');
    this.bg.fixedToCamera = true;
    this.bg.autoScroll(-2, 0);

    this.plx1 = game.add.image(0, 0, 'parallax1');
    this.plx1.fixedToCamera = true;

    // this.plx2 = game.add.tileSprite(0, 0, pixel.width / pixel.scale, pixel.height / pixel.scale, 'parallax2');
    // this.plx2.fixedToCamera = true;

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

    this.CreateNPCs();

    frauki = new Player(game, this.map.properties.startX * 16, this.map.properties.startY * 16, 'Frauki');
    game.add.existing(frauki);

    game.camera.focusOnXY(frauki.body.x, frauki.body.y);

    this.currentLayer = +this.map.properties.startLayer;
    
    this.CreateObjectsLayer(4);
    this.CreateObjectsLayer(3);
    this.CreateObjectsLayer(2);

    this.CreateMapLayer(4, +this.map.properties.startLayer === 4);
    this.CreateMapLayer(3, +this.map.properties.startLayer === 3);
    this.CreateMapLayer(2, +this.map.properties.startLayer === 2);
    

    this.enemyPool = game.add.group();
    this.door1Group = game.add.group();
    this.door2Group = game.add.group();
    this.door3Group = game.add.group();

    this.map.createFromObjects('Doors_1', 67, 'Misc', 'Door0000', true, false, this.door1Group, Door, false);
    this.map.createFromObjects('Doors_2', 67, 'Misc', 'Door0000', true, false, this.door2Group, Door, false);
    this.map.createFromObjects('Doors_3', 67, 'Misc', 'Door0000', true, false, this.door3Group, Door, false);

    //make all the doors invisible
    this.door1Group.forEach(function(d) { d.alpha = 0; });
    this.door2Group.forEach(function(d) { d.alpha = 0; });
    this.door3Group.forEach(function(d) { d.alpha = 0; });

    this.PreprocessTiles(4);
    this.PreprocessTiles(3);
    this.PreprocessTiles(2);

    triggerController.CreateTriggers(4);
    triggerController.CreateTriggers(3);
    triggerController.CreateTriggers(2);

    this.easyStar_4 = game.plugins.add(Phaser.Plugin.PathFinderPlugin);
    this.easyStar_4.setGrid(this.collisionLayer_4.layer.data, [-1]);

    this.easyStar_3 = game.plugins.add(Phaser.Plugin.PathFinderPlugin);
    this.easyStar_3.setGrid(this.collisionLayer_3.layer.data, [-1]);

    this.easyStar_2 = game.plugins.add(Phaser.Plugin.PathFinderPlugin);
    this.easyStar_2.setGrid(this.collisionLayer_2.layer.data, [-1]);

    setInterval(function() {
        Frogland.AnimateTiles();
    }, 200);
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

    game.physics.arcade.collide(frauki, this.GetCurrentCollisionLayer(), null, this.CheckEnvironmentalCollisions);
    //game.physics.arcade.collide(this.NPCs, this.GetCurrentCollisionLayer());
    game.physics.arcade.collide(frauki, this.GetCurrentObjectGroup(), this.CollideFraukiWithObject, this.OverlapFraukiWithObject);
    game.physics.arcade.collide(this.GetCurrentObjectGroup(), this.GetCurrentCollisionLayer());
    game.physics.arcade.collide(this.GetCurrentObjectGroup(), this.GetCurrentObjectGroup(), null, this.OverlapEnemiesWithSelf);

    game.physics.arcade.overlap(frauki, projectileController.projectiles, this.CollideFraukiWithProjectile);

    this.plx1.cameraOffset.x = -(game.camera.x * 0.45) + 280;
    this.plx1.cameraOffset.y = -(game.camera.y * 0.30) + 220;
    //this.plx2.tilePosition.x = -(game.camera.x * 0.9);
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
    this.map.createFromObjects('Objects_' + layer, 68, 'Misc', 'EnergyBitPos0000', true, false, this[currLayer], EnergyNugg, false);

    //create the doors
    this.map.createFromObjects('Objects_' + layer, 67, 'Misc', 'Door0000', true, false, this[currLayer], Door, false)

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

    var waterTiles = [383, 384, 385, 386, 387, 388, 548, 549, 550, 580, 581, 582, 612, 613, 614]; 
    var draftTiles = [545, 546, 547];

    this.map.forEach(function(tile) {
        if(waterTiles.indexOf(tile.index) > -1) {
            tile.alpha = 0.3;
        }

        if(draftTiles.indexOf(tile.index) > -1) {
            tile.alpha = 0.2;
        }

    }, this, 0, 0, this.map.width, this.map.height, 'Foreground_' + layer);
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

    } else if(o.spriteType === 'energyNugg') {

        EatEnergyNugg(f, o);
        return false;

    } else if(o.spriteType === 'enemy') {

        if(o.CanCauseDamage() && o.state !== o.Dying) {
            frauki.Hit(o, o.damage);
        }

        return false;
    } else if(o.spriteType === 'door') {

        OpenDoor(f, o);

        return true;
    }

    return true;
};

Frogland.CollideFraukiWithObject = function(f, o) {   
};

Frogland.CollideFraukiWithProjectile = function(f, p) {

    if(p.projType === 'tar' || p.projType === 'spore') {
        if(p.owningEnemy.state !== p.owningEnemy.Dying) {
            frauki.Hit(f, p.owningEnemy);
        }
        
        p.destroy();
    }
};

Frogland.CheckEnvironmentalCollisions = function(f, tile) {
    //13 - 16

    //solid tile
    if(tile.index === 1 || tile.index === 9) { 
        return true;

    //water
    } else if(tile.index === 2 || tile.index === 10 || tile.index === 13 || tile.index === 14 || tile.index === 15 || tile.index === 16) { 
        frauki.states.inWater = true;

        if(tile.index === 10) effectsController.Splash(tile);

        if(tile.index === 13) frauki.states.flowDown = true;
        if(tile.index === 14) frauki.states.flowRight = true;
        if(tile.index === 15) frauki.states.flowUp = true;
        if(tile.index === 16) frauki.states.flowLeft = true;

        
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
        
        if(tile.waitingToFall !== true && frauki.body.center.y < tile.worldY) {
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
    if(viewLeft > 110) viewLeft = 110;
    if(viewTop < 0) viewTop = 0;

    // if(viewLeft < 0) viewLeft = 0;
    // if(viewTop < 0) viewTop = 0;

    var animatedTiles = [
        [383, 384, 385],
        [386, 387, 388],
        [545, 546, 547],
        [548, 549, 550],
        [580, 581, 582],
        [612, 613, 614]
    ];

    this.map.forEach(function(tile) {

        for(var i = 0; i < animatedTiles.length; i++) {
            if(tile.index === animatedTiles[i][0]) tile.index = 999;
            if(tile.index === animatedTiles[i][2]) tile.index = animatedTiles[i][0];
            if(tile.index === animatedTiles[i][1]) tile.index = animatedTiles[i][2];
            if(tile.index === 999) tile.index = animatedTiles[i][1];
        }
           
    }, this, viewLeft, viewTop, viewRight, viewBottom, 'Foreground_' + Frogland.currentLayer); 
};

function TilesHit(f, t) {
    if(t.index === 7) {
        Frogland.DislodgeTile(t);
    }
};

Frogland.CreateNPCs = function() {
    // this.NPCs = [];

    // irena = game.add.sprite(156 * 16, 53 * 16, 'EnemySprites', 'NPCs/Irena');
    // game.physics.enable(irena, Phaser.Physics.ARCADE);

    // irena.body.setSize(11, 50, 0, 5);

    // this.NPCs.push(irena);


    // cool = game.add.sprite(194 * 16, 55 * 16, 'EnemySprites', 'NPCs/Cool Frog');
    // game.physics.enable(cool, Phaser.Physics.ARCADE);

    // cool.body.setSize(11, 50, 0, 5);

    // this.NPCs.push(cool);


    // dapper = game.add.sprite(123 * 16, 57 * 16, 'EnemySprites', 'NPCs/Dapper Frog');
    // game.physics.enable(dapper, Phaser.Physics.ARCADE);

    // dapper.body.setSize(11, 50, 0, 19);
    // dapper.scale.x = -1;

    // this.NPCs.push(dapper);


    // biggie = game.add.sprite(105 * 16, 41 * 16, 'EnemySprites', 'NPCs/Big Frog');
    // game.physics.enable(biggie, Phaser.Physics.ARCADE);

    // biggie.body.setSize(11, 50, 0, 25);

    // this.NPCs.push(biggie);
}