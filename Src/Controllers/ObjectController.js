ObjectController = function() {
	this.timers = new TimerUtil();

	this.createdObjects = [];

    this.doorList = [];
    this.enemyList = [];
    this.checkpointList = [];
    this.shardList = [];
};

ObjectController.prototype.Create = function() {
};

ObjectController.prototype.Update = function() {
	if(!Main.restarting) {
		this.SpawnNearbyObjects();
		//this.DestroyFarawayObjects();
	}

    var inactives = this['inactiveLayer' + Frogland.currentLayer];

    //weed out inactives
    for(var i = 0, max = this.GetCurrentObjectGroup().children.length; i < max; i++) {
        var padding = 200;
        var o = this.GetCurrentObjectGroup().children[i];

        if(!o) continue;

        if(o.spriteType !== 'door' && !!o.body && o.spriteType !== 'ball') {
            if(o.body.x < game.camera.x - padding || o.body.y < game.camera.y - padding || o.body.x > game.camera.x + game.camera.width + padding || o.body.y > game.camera.y + game.camera.height + padding) {
                if(o.body.enable === true && !!o.Deactivate) o.Deactivate();
                o.body.enable = false;
                o.visible = false;
                this.GetCurrentObjectGroup().remove(o);
                inactives.add(o);

                //also splice the object out of the enemy list
            }
        }
    }

    //return inactives to active
    for(var i = 0, max = inactives.children.length; i < max; i++) {
        var padding = 300;
        var o = inactives.children[i];

        if(!o) continue;

        if(o.spriteType !== 'door' && !!o.body && o.spriteType !== 'ball') {
            if(o.body.x > game.camera.x - padding && o.body.y > game.camera.y - padding && o.body.x < game.camera.x + game.camera.width + padding && o.body.y < game.camera.y + game.camera.height + padding) {
                if(o.body.enable === false && !!o.Activate) o.Activate();
                o.body.enable = true;
                o.visible = true;

                inactives.remove(o);
                this.GetCurrentObjectGroup().add(o);

            }
        }
    }

};

ObjectController.prototype.Reset = function() {
    this.activeLayer3.removeAll(true);
    this.inactiveLayer3.removeAll(true);
    this.activeLayer4.removeAll(true);
    this.inactiveLayer4.removeAll(true);

    this.CreateObjectsLayer(4);
    this.CreateObjectsLayer(3);
};

ObjectController.prototype.GetCurrentObjectGroup = function() {
    return this['activeLayer' + Frogland.currentLayer];
};

ObjectController.prototype.CompileObjectList = function() {
    var that = this;

    this.latentObjects = {
        Objects_3: [],
        Objects_4: []
    };

    Frogland.map.objects['Objects_3'].forEach(function(o) {
        that.latentObjects.Objects_3.push({ id: o.gid, name: o.name, x: o.x, y: o.y, u: that.latentObjects.Objects_3.length, properties: o.properties });
    });

    Frogland.map.objects['Objects_4'].forEach(function(o) {
        that.latentObjects.Objects_4.push({ id: o.gid, name: o.name, x: o.x, y: o.y, u: that.latentObjects.Objects_4.length, properties: o.properties });
    });
};

ObjectController.prototype.SpawnNearbyObjects = function() {

    //get the latent objects
    var objLayer = this.latentObjects['Objects_' + Frogland.currentLayer];

    var spawnedObjs = [];

    //go through them all and see if any are within range to be created
    var i = objLayer.length;
    while(i--) {
        var padding = 350;
        var o = objLayer[i];

        if(!o || o.id == 67) continue;

        var leftBound = game.camera.x - padding;
        var rightBound = game.camera.x + game.camera.width + padding;
        var topBound = game.camera.y - padding;
        var bottomBound = game.camera.y + game.camera.height + padding;

        if(o.x > leftBound && o.y > topBound && o.x < rightBound && o.y < bottomBound) {
            this.SpawnObject(o);
            spawnedObjs.push(o);

            objLayer.splice(objLayer.indexOf(o), 1);

        } 
    }
};

ObjectController.prototype.DestroyFarawayObjects = function() {

    for(var i = 0, max = this.createdObjects.length; i < max; i++) {
        var padding = 1000;
        var o = this.createdObjects[i];

        var leftBound = frauki.body.center.x - (game.camera.width / 2) - padding;
        var rightBound = frauki.body.center.x + (game.camera.width / 2) + padding;
        var topBound = frauki.body.center.y - (game.camera.height / 2) - padding;
        var bottomBound = frauki.body.center.y + (game.camera.height / 2) + padding;

        if(o.x < leftBound || o.y < topBound || o.x > rightBound || o.y > bottomBound) {
            this.latentObjects['Objects_' + Frogland.currentLayer].push(o.latent);
            //this.createdObjects.splice(this.createdObjects.indexOf(o), 1);
            o.destroy();
            o = null;
            console.log('Destroying object', this.createdObjects.length);
        } 

        //splice out the destroyed objects
        this.createdObjects = this.createdObjects.filter(function(e) { return !!e; } );
    }
};

ObjectController.prototype.SpawnObject = function(o) {

    var currLayer = this.GetCurrentObjectGroup();
    if(!currLayer) currLayer = game.add.group();

    var newObj = null;

    if(o.id === 66) {
        newObj = new Apple(game, o.x, o.y, 'Misc', 'Apple0000');
        newObj.latent = o;

    }
    else if(o.id === 68) {
        newObj = new EnergyNugg(game, o.x, o.y, 'Misc', 'EnergyBitPos0000');
        newObj.latent = o;

    } 
    else if(o.id === 70) {
        newObj = new Shard(game, o.x, o.y, 'Shard0000', 'Shard0000');
        newObj.latent = o;
        objectController.shardList.push(newObj);
    }
    else if(o.id === 71) {
        newObj = new Shard(game, o.x, o.y, 'Shard0001', 'Shard0001');
        newObj.latent = o;
        objectController.shardList.push(newObj);
    }
    else if(o.id === 72) {
        newObj = new Shard(game, o.x, o.y, 'Shard0002', 'Shard0002');
        newObj.latent = o;
        objectController.shardList.push(newObj);
    }
    else if(o.id === 73) {
        newObj = new Shard(game, o.x, o.y, 'Shard0003', 'Shard0003');
        newObj.latent = o;
        objectController.shardList.push(newObj);
    }
    else if(o.id === 74) {
        newObj = new Orb(game, o.x, o.y, 'Misc', 'Orb0000');
        newObj.latent = o;

    } 
    else if((o.id >= 85 && o.id <= 104) || (o.id >= 145 && o.id <= 164)) {
	    FileMap.Enemies.forEach(function(enemy) {
	        if(o.id === enemy.Tile) {
	            newObj = new Enemy(game, o.x, o.y, enemy.Name, enemy.Name);
	            newObj.latent = o;

                objectController.enemyList.push(newObj);
	        }
	    });
    }
    else if(o.id >= 105 && o.id <= 124) {
	    FileMap.Junk.forEach(function(junk) {
	        if(o.id === junk.Tile) {
	            newObj = new Junk(game, o.x, o.y, junk.Name, junk.Name);
	            newObj.latent = o;
	        }
	    });
    } else if(o.id !== 69) {
        //ignore the spawn object
    	console.log('Unknown object', o);
    }


 
    if(newObj !== null) {
        currLayer.add(newObj);
        newObj.owningLayer = Frogland.currentLayer;
    	this.createdObjects.push(newObj);
        newObj.properties = o.properties || {};
        newObj.name = o.name;

        //check for signals attached to the object
        if(!!newObj.properties.on_death) {
            newObj.events.onDestroy.add(function() {
                ComposeAndEmitSignal(newObj.properties.on_death);
            });
        }
    }
};

ObjectController.prototype.AddObject = function(newObj) {
    var currLayer = this.GetCurrentObjectGroup();
    if(!currLayer) currLayer = game.add.group();

    currLayer.add(newObj);
    newObj.owningLayer = Frogland.currentLayer;    
};

ObjectController.prototype.CreateObjectsLayer = function(layer) {

    if(!this['activeLayer' + layer]) this['activeLayer' + layer] = game.add.group();
    if(!this['inactiveLayer' + layer]) this['inactiveLayer' + layer] = game.add.group();

    var currLayer = this['activeLayer' + layer];

    Frogland.map.createFromObjects('Objects_' + layer, 69, 'Misc', 'Checkpoint0000', true, true, currLayer, Checkpoint, false);

    //create the doors
    Frogland.map.createFromObjects('Objects_' + layer, 67, 'Misc', 'Door0000', true, true, currLayer, Door, false);

    Frogland.map.createFromObjects('Objects_' + layer, 75, 'Misc', 'Upgrade0000', true, true, currLayer, Upgrade, false);
    
    Frogland.map.createFromObjects('Objects_' + layer, 70, 'Shard0000', 'Shard0000', true, true, currLayer, Shard, false);
    Frogland.map.createFromObjects('Objects_' + layer, 71, 'Shard0001', 'Shard0001', true, true, currLayer, Shard, false);
    Frogland.map.createFromObjects('Objects_' + layer, 72, 'Shard0002', 'Shard0002', true, true, currLayer, Shard, false);
    Frogland.map.createFromObjects('Objects_' + layer, 73, 'Shard0003', 'Shard0003', true, true, currLayer, Shard, false);

    // if(layer == 3) {
    //     Frogland.ball = game.add.sprite(177 * 16, 270 * 16, 'Misc', 'Ball0000', currLayer);
    //     game.physics.enable(Frogland.ball, Phaser.Physics.ARCADE);
    //     Frogland.ball.body.bounce.setTo(0.8);
    //     Frogland.ball.body.drag.setTo(200);
    //     Frogland.ball.anchor.setTo(0.5);
    //     Frogland.ball.body.angularDrag = 500;
    //     Frogland.ball.spriteType = 'ball';
    //     Frogland.ball.body.collideWorldBounds = true;
    //     Frogland.ball.body.maxVelocity.setTo(700);

    //     triggerController.RegisterTarget('ball', Frogland.ball);
    // }

    //inform each object of its own layer
    currLayer.forEach(function(obj) {
        obj.owningLayer = layer;


        if(obj.spriteType === 'door') {
            obj.create();
            objectController.doorList.push(obj);

        } else if(obj.spriteType === 'checkpoint') {
            if(obj.id == GameData.GetCheckpoint()) {
                obj.CheckpointHit();
            }

            objectController.checkpointList.push(obj);

        } else if(obj.spriteType === 'enemy') {
            objectController.enemyList.push(obj);

        } else if(obj.spriteType === 'shard') {
            objectController.shardList.push(obj);
        }

        if(Frogland.currentLayer !== layer) {
            obj.alpha = 0;
            obj.body.enable = false;
        }
    });  
};

function ComposeAndEmitSignal(data) {
    var signalData = data.split(',');
    var signalName = signalData.shift();

    var params = {};

    while(signalData.length) {

        var paramData = signalData.shift();
        paramData = paramData.split(':');

        params[paramData[0]] = paramData[1];
    }

    events.publish(signalName, params);
};
