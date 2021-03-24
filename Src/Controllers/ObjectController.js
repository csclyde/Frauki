ObjectController = function() {
	this.timers = new TimerUtil();

    this.doorList = [];
    this.enemyList = [];
    this.npcMap = {};
    this.checkpointList = [];
    this.shardList = [];

    this.latentObjects = [];    
};

ObjectController.prototype.Create = function() {
    this.activeGroup = game.add.group();
    this.inactiveGroup = game.add.group();
};

ObjectController.prototype.Update = function() {
	if(!GameState.restarting) {
		this.SpawnNearbyObjects();
	}

    //weed out inactives
    for(var i = 0, max = this.activeGroup.children.length; i < max; i++) {
        var o = this.activeGroup.children[i];

        if(!o) continue;

        var preservedTypes = ['door', 'shard', 'checkpoint'];

        //if the object is not preserved, has a body, and is off screen, its not active
        if(!preservedTypes.includes(o.spriteType) && !!o.body && !cameraController.IsObjectOnScreen(o, -400) && o !== goddess) {
            if(o.body.enable === true && !!o.Deactivate) o.Deactivate();
            o.body.enable = false;
            o.visible = false;
            this.activeGroup.remove(o);
            this.inactiveGroup.add(o);
        }
    }

    //return inactives to active
    for(var i = 0, max = this.inactiveGroup.children.length; i < max; i++) {
        var o = this.inactiveGroup.children[i];

        if(!o) continue;

        if(o.spriteType !== 'door' && !!o.body) {
            if(!cameraController.IsObjectOnScreen(o, -300)) {
                if(o.body.enable === false && !!o.Activate) o.Activate();
                o.body.enable = true;
                o.visible = true;

                this.inactiveGroup.remove(o);
                this.activeGroup.add(o);

            }
        }
    }
};

ObjectController.prototype.Reset = function() {
    this.activeGroup.removeAll(true);
    this.inactiveGroup.removeAll(true);
    this.latentObjects = [];    

    this.CreateObjectsLayer();
    this.CompileObjectList();
    
};

ObjectController.prototype.CreateObjectsLayer = function(layer) {
    Frogland.map.createFromObjects('Objects', 69, 'Misc', 'Checkpoint0000', true, true, this.activeGroup, Checkpoint, false);
    Frogland.map.createFromObjects('Doors', 67, 'Misc', 'DoorSeal0000', true, true, this.activeGroup, Door, false);
    Frogland.map.createFromObjects('Objects', 75, 'Misc', 'Upgrade0000', true, true, this.activeGroup, Upgrade, false);
    Frogland.map.createFromObjects('Objects', 76, 'Misc', 'GemSucker0000', true, true, this.activeGroup, GemSucker, false);

    this.prisms = {};
    this.prisms.Wit = new Shard(game, 0, 0, 'Misc', 'Shard0000');
    this.prisms.Wit.name = 'Wit';
    this.activeGroup.add(this.prisms.Wit);    
    
    this.prisms.Will = new Shard(game, 0, 0, 'Misc', 'Shard0001');
    this.prisms.Will.name = 'Will';
    this.activeGroup.add(this.prisms.Will);        
    
    this.prisms.Luck = new Shard(game, 0, 0, 'Misc', 'Shard0002');
    this.prisms.Luck.name = 'Luck';
    this.activeGroup.add(this.prisms.Luck);        
    
    this.prisms.Power = new Shard(game, 0, 0, 'Misc', 'Shard0003');
    this.prisms.Power.name = 'Power';
    this.activeGroup.add(this.prisms.Power);        

    this.activeGroup.forEach(function(obj) {

        if(obj.spriteType === 'door') {
            obj.create();
            
            objectController.doorList.push(obj);
                
        } else if(obj.spriteType === 'checkpoint') {
            objectController.checkpointList.push(obj);

        } else if(obj.spriteType === 'shard') {
            objectController.shardList.push(obj);
        }

    });  
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

    //go through them all and see if any are within range to be created
    var i = this.latentObjects.length;
    while(i--) {
        var padding = 350;
        var o = this.latentObjects[i];

        if(!o || o.id == 67) continue;

        var leftBound = game.camera.x - padding;
        var rightBound = game.camera.x + game.camera.width + padding;
        var topBound = game.camera.y - padding;
        var bottomBound = game.camera.y + game.camera.height + padding;

        if(o.id === 93 || (o.x > leftBound && o.y > topBound && o.x < rightBound && o.y < bottomBound)) {
            this.SpawnObject(o);
            this.latentObjects.splice(this.latentObjects.indexOf(o), 1);
        } 
    }
};

ObjectController.prototype.SpawnObject = function(o) {
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

                if(o.id === 149) {
                    objectController.npcMap[o.name] = newObj;
                } else {
                    objectController.enemyList.push(newObj);
                }
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
    } else if(![69,67,75,70,71,72,73,76].includes(o.id)) {
    	console.warn('Unknown object', o);
    }

    if(newObj !== null) {
        this.activeGroup.add(newObj);
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

ObjectController.prototype.GetObjectGroup = function() {
    return this.activeGroup;
}

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
