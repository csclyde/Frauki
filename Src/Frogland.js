var Frogland = {};

Frogland.Create = function() {

    this.timers = new TimerUtil();

    events.subscribe('set_attack_wait', function(params) {
        this.timers.SetTimer('global_attack_wait', params.duration);
    }, this);

    this.map = game.add.tilemap('Frogland');
    this.map.addTilesetImage('FrogtownTiles');
    this.map.addTilesetImage('DepthsTiles');
    this.map.addTilesetImage('TerraceTiles');
    this.map.addTilesetImage('Doodads');
    this.map.addTilesetImage('Collision');

    this.goddessPositions = {
        start: { x: 295 * 16, y: 168 * 16 },
        Wit: { x: 152 * 16, y: 228 * 16 },
        Will: { x: 111 * 16, y: 300 * 16 },
        Luck: { x: 144 * 16, y: 548 * 16 },
        Power: { x: 189 * 16, y: 64 * 16 },
    };

    this.prismPositions = {
        Wit: {x: 4456, y: 2656},
        Will: {x: 4488, y: 2656},
        Luck: {x: 4472, y: 2673},
        Power: {x: 4472, y: 2640},
    };

    backdropController.Create();
    
    this['backgroundLayer'] = this.map.createLayer('Background');
    
    frauki = new Player(game, 0, 0, 'Frauki');
    game.add.existing(frauki);

    goddess = new Enemy(game, this.goddessPositions.start.x, this.goddessPositions.start.y, 'Goddess', 'Goddess');
    game.add.existing(goddess);
    
    this.CreateCollisionLayer();
    
    objectController.Create();    
    objectController.CreateObjectsLayer();
    effectsController.CreateMidgroundEffects();

    this['midgroundLayer'] = this.map.createLayer('Midground');
    this['midgroundLayer'].resizeWorld();

    this['foregroundLayer'] = this.map.createLayer('Foreground');

    effectsController.CreateForegroundEffects();

    this.PreprocessTiles();

    triggerController.CreateTriggers();
    objectController.CompileObjectList();

    //this will store fallen tiles, so that when you die they can be reset
    this.fallenTiles = [];

    setInterval(this.AnimateTiles, 200);

    frauki.Reset();
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
        frauki.y -= 10000;
        cameraController.camY -= 10000 + 865;
    }
};

Frogland.Reset = function() {
    this.ResetFallenTiles();   
    
    frauki.states.inWater = false;
    frauki.states.onCloud = false;
    frauki.states.inUpdraft = false;
    frauki.states.onLeftSlope = false;
    frauki.states.onRightSlope = false;
    frauki.states.flowDown = false;
    frauki.states.flowRight = false;
    frauki.states.flowUp = false;
    frauki.states.flowLeft = false;
};

Frogland.HandleCollisions = function() {
    //frauki colliding with the world geometry
    game.physics.arcade.collideSpriteVsTilemapLayer(
        frauki, 
        this.GetCollisionLayer(), 
        null, 
        Collision.CollideFraukiWithEnvironment, 
        null, false);

    //all other objects colliding with the world geometry
    game.physics.arcade.collideGroupVsTilemapLayer(
        objectController.GetObjectGroup(),
        this.GetCollisionLayer(), 
        null, 
        Collision.OverlapObjectsWithEnvironment, 
        null, false);

    //frauki colliding with other moving objects
    game.physics.arcade.collideHandler(
        frauki, 
        objectController.GetObjectGroup(), 
        null, 
        Collision.OverlapFraukiWithObject, 
        null, false);

    //enemies are collided with themselves
    game.physics.arcade.collide(
        objectController.GetObjectGroup(), 
        undefined, 
        function(o1, o2) { return o1.type === 'enemy' && o2.type === 'enemy'; }, 
        Collision.OverlapEnemiesWithSelf);

    //collide enemies with doors
    game.physics.arcade.collide(
        objectController.enemyList, 
        objectController.doorList, 
        null, 
        Collision.CollideEnemiesWithDoors);

    //overlap fraukis attack with objects and projectiles
    frauki.UpdateAttackGeometry();
    if(frauki.Attacking()) {
        game.physics.arcade.overlap(
            frauki.attackRect,
            objectController.GetObjectGroup(),
            Collision.OverlapAttackWithObject);
    }

    //frauki is overlapped with projectiles
    if(projectileController.projectiles.countLiving() > 0) {
        game.physics.arcade.overlap(
            frauki, 
            projectileController.projectiles, 
            Collision.CollideFraukiWithProjectile);
    }
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
