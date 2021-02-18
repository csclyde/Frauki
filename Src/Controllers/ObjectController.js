ObjectController = function() {
	this.timers = new TimerUtil();

	this.createdObjects = [];

    this.doorList = [];
    this.enemyList = [];
    this.checkpointList = [];
    this.shardList = [];
};

ObjectController.prototype.Create = function() {
    this.activeGroup = game.add.group();
    this.inactiveGroup = game.add.group();
};

ObjectController.prototype.Update = function() {
	if(!GameState.restarting) {
		this.SpawnNearbyObjects();
		//this.DestroyFarawayObjects();
	}

    var inactives = this.inactiveGroup;

    //weed out inactives
    for(var i = 0, max = this.GetObjectGroup().children.length; i < max; i++) {
        var padding = 200;
        var o = this.GetObjectGroup().children[i];

        if(!o) continue;

        var preservedTypes = ['door', 'powerup'];

        if(preservedTypes.indexOf(o.spriteType) === -1 && !!o.body) {
            if(!cameraController.IsObjectOnScreen(o, -200)) {
                if(o.body.enable === true && !!o.Deactivate) o.Deactivate();
                o.body.enable = false;
                o.visible = false;
                this.GetObjectGroup().remove(o);
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

        if(o.spriteType !== 'door' && !!o.body) {
            if(o.body.x > game.camera.x - padding && o.body.y > game.camera.y - padding && o.body.x < game.camera.x + game.camera.width + padding && o.body.y < game.camera.y + game.camera.height + padding) {
                if(o.body.enable === false && !!o.Activate && o.spriteType !== 'checkpoint') o.Activate();
                o.body.enable = true;
                o.visible = true;

                inactives.remove(o);
                this.GetObjectGroup().add(o);

            }
        }
    }
};

ObjectController.prototype.Reset = function() {
    this.activeGroup.removeAll(true);
    this.inactiveGroup.removeAll(true);

    this.CreateObjectsLayer();
};

ObjectController.prototype.GetObjectGroup = function() {
    return this.activeGroup;
};

ObjectController.prototype.CompileObjectList = function() {

    this.latentObjects = [];

    Frogland.map.objects['Objects'].forEach(function(o) {
        this.latentObjects.push({ id: o.gid, name: o.name, x: o.x, y: o.y, u: this.latentObjects.length, properties: o.properties });
    }, this);

    Frogland.map.objects['Enemies'].forEach(function(o) {
        this.latentObjects.push({ id: o.gid, name: o.name, x: o.x, y: o.y, u: this.latentObjects.length, properties: o.properties });
    }, this);

    Frogland.map.objects['Doodads'].forEach(function(o) {
        this.latentObjects.push({ id: o.gid, name: o.name, x: o.x, y: o.y, u: this.latentObjects.length, properties: o.properties });
    }, this);

};

ObjectController.prototype.SpawnNearbyObjects = function() {

    //get the latent objects
    var objLayer = this.latentObjects;

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
            this.latentObjects.push(o.latent);
            //this.createdObjects.splice(this.createdObjects.indexOf(o), 1);
            o.destroy();
            o = null;
        } 

        //splice out the destroyed objects
        this.createdObjects = this.createdObjects.filter(function(e) { return !!e; } );
    }
};

ObjectController.prototype.SpawnObject = function(o) {

    var objGroup = this.GetObjectGroup();
    if(!objGroup) objGroup = game.add.group();

    var newObj = null;

    if(o.id === 66) {
        newObj = new Apple(game, o.x, o.y, 'Misc', 'Apple0000');
        newObj.latent = o;
    }
    else if(o.id === 74) {
        newObj = new Orb(game, o.x, o.y, 'Misc', 'Orb0000');
        newObj.latent = o;
    } 
    else if((o.id >= 85 && o.id <= 104) || (o.id >= 145 && o.id <= 164)) {
	    FileMap.Enemies.forEach(function(enemy) {
	        if(o.id === enemy.Tile) {
                newObj = new Enemy(game, o.x, o.y, enemy.Name, enemy.Name);
                if(newObj.create) newObj.create();
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
    } else if(![69,67,75,70,71,72,73].includes(o.id)) {
    	console.warn('Unknown object', o);
    }

    if(newObj !== null) {
        this.GetObjectGroup().add(newObj);
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
    this.GetObjectGroup().add(newObj);   
};

ObjectController.prototype.CreateObjectsLayer = function(layer) {

    if(!this.activeGroup) this.activeGroup = game.add.group();
    if(!this.inactiveGroup) this.inactiveGroup = game.add.group();

    var currLayer = this.activeGroup;

    Frogland.map.createFromObjects('Objects', 69, 'Misc', 'Checkpoint0000', true, true, currLayer, Checkpoint, false);

    //create the doors
    Frogland.map.createFromObjects('Doors', 67, 'Misc', 'DoorSeal0000', true, true, currLayer, Door, false);

    Frogland.map.createFromObjects('Objects', 75, 'Misc', 'Upgrade0000', true, true, currLayer, Upgrade, false);
    
    Frogland.map.createFromObjects('Objects', 70, 'Shard0000', 'Shard0000', true, true, currLayer, Shard, false);

    //inform each object of its own layer
    currLayer.forEach(function(obj) {

        if(obj.spriteType === 'door') {
            obj.create();
            
            objectController.doorList.push(obj);

            //force open doors that do not close
            if(GameData.IsDoorOpen(obj.id) && !!obj.stay_open) {
                obj.ForceOpenDoor();
            }
                
        } else if(obj.spriteType === 'checkpoint') {
            objectController.checkpointList.push(obj);

        } else if(obj.spriteType === 'enemy') {
            objectController.enemyList.push(obj);

        } else if(obj.spriteType === 'shard') {
            objectController.shardList.push(obj);
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
