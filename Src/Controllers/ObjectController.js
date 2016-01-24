ObjectController = function() {

	var that  = this;

	this.timers = new TimerUtil();

	this.createdObjects = [];
};

ObjectController.prototype.Create = function() {
};

ObjectController.prototype.Update = function() {
	if(!Main.restarting) {
		this.SpawnNearbyObjects();
		//this.DestroyFarawayObjects();
	}
};

ObjectController.prototype.CompileObjectList = function() {
    var that = this;
    this.latentObjects = {
        Objects_2: [],
        Objects_3: [],
        Objects_4: []
    };


    Frogland.map.objects['Objects_2'].forEach(function(o) {
        that.latentObjects.Objects_2.push({ id: o.gid, x: o.x, y: o.y, u: that.latentObjects.Objects_2.length, properties: o.properties });
    });

    Frogland.map.objects['Objects_3'].forEach(function(o) {
        that.latentObjects.Objects_3.push({ id: o.gid, x: o.x, y: o.y, u: that.latentObjects.Objects_3.length, properties: o.properties });
    });

    Frogland.map.objects['Objects_4'].forEach(function(o) {
        that.latentObjects.Objects_4.push({ id: o.gid, x: o.x, y: o.y, u: that.latentObjects.Objects_4.length, properties: o.properties });
    });
};

ObjectController.prototype.SpawnNearbyObjects = function() {
    var objLayer = this.latentObjects['Objects_' + Frogland.currentLayer];

    var spawnedObjs = [];

    for(var i = 0, max = objLayer.length; i < max; i++) {
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
        } 
    }

    for(var i = 0, max = spawnedObjs.length; i < max; i++) {
        objLayer.splice(objLayer.indexOf(spawnedObjs[i]), 1);
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

    var currLayer = 'objectGroup_' + Frogland.currentLayer;
    if(!Frogland[currLayer]) Frogland[currLayer] = game.add.group();

    var newObj = null;

    if(o.id === 66) {
        newObj = new Apple(game, o.x, o.y, 'Misc', 'Apple0000');
        newObj.latent = o;
    }
    else if(o.id === 68) {
        newObj = new EnergyNugg(game, o.x, o.y, 'Misc', 'EnergyBitPos0000');
        newObj.latent = o;
    } 
    else if(o.id >= 85 && o.id <= 104) {
	    FileMap.Enemies.forEach(function(enemy) {
	        if(o.id === enemy.Tile) {
	            newObj = new Enemy(game, o.x, o.y, enemy.Name, enemy.Name);
	            newObj.latent = o;
	        }
	    });
    }
    else if(o.id >= 105 && o.id <= 124) {
	    FileMap.Junk.forEach(function(junk) {
	        if(o.id === junk.Tile) {
	            newObj = new Junk(game, o.x, o.y, junk.Name, junk.Name);
	            newObj.y -= newObj.height;
	            newObj.latent = o;
	        }
	    });
    } else {
    	console.log('Unknown object', o);
    }


 
    if(newObj !== null) {
        Frogland[currLayer].add(newObj);
        newObj.owningLayer = Frogland.currentLayer;
    	this.createdObjects.push(newObj);

        // //if the object has speech associated wtih it
        // if(!!o.properties.speech) {

        //     newObj.body.speechName = o.properties.speech;
        //     speechController.speechZones.push(newObj.body);
        // }
    }
};
