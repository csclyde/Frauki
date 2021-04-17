ObjectController = function() {
	this.timers = new TimerUtil();

    this.doorList = [];
    this.enemyList = [];
    this.npcMap = {};
    this.checkpointList = [];
    this.latentObjects = [];
};

ObjectController.prototype.Create = function() {
    this.activeGroup = game.add.group(Frogland.froglandGroup, 'active_objects');
    this.inactiveGroup = game.add.group(Frogland.froglandGroup, 'inactive_objects');
    this.inactiveGroup.exists = false;
    this.enemyHealthGroup = game.add.group(Frogland.froglandGroup, 'enemy_health');

    events.subscribe('destroy_enemy', function(params) {
        var enemy = this.enemyList.find(function(e) { return e.name === params.name}) || this.npcMap[params.name];
        if(enemy) {
            enemy.DestroyEnemy(enemy);
        } 
    }, this);

    events.subscribe('spawn_enemy', this.SpawnEnemy, this);
};

ObjectController.prototype.Update = function() {
	if(!GameState.restarting) {
		this.SpawnNearbyObjects();
	}

    //weed out inactives
    for(var i = 0, max = this.activeGroup.children.length; i < max; i++) {
        var o = this.activeGroup.children[i];

        if(!o) continue;

        var preservedTypes = ['door', 'checkpoint'];

        //if the object is not preserved, has a body, and is off screen, its not active
        if(!preservedTypes.includes(o.spriteType) && !!o.body && !cameraController.IsObjectOnScreen(o, -200)) {
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

        if(cameraController.IsObjectOnScreen(o, -100)) {
            if(o.body.enable === false && !!o.Activate) o.Activate();
            o.body.enable = true;
            o.visible = true;

            this.inactiveGroup.remove(o);
            this.activeGroup.add(o);

        }
    }
};

ObjectController.prototype.Reset = function() {
    this.activeGroup.removeAll(true);
    this.inactiveGroup.removeAll(true);
    this.enemyHealthGroup.removeAll(true);
    this.doorList = [];
    this.enemyList = [];
    this.npcMap = {};
    this.checkpointList = [];
    this.latentObjects = [];

    this.CreateObjectsLayer();
    this.CompileObjectList();
};

ObjectController.prototype.DestroyAllEnemies = function() {
    this.activeGroup.removeAll(true);
    this.inactiveGroup.removeAll(true);
    this.enemyHealthGroup.removeAll(true);
    this.doorList = [];
    this.enemyList = [];
    this.npcMap = {};
    this.checkpointList = [];
    this.latentObjects = [];
};

ObjectController.prototype.CreateObjectsLayer = function(layer) {
    Frogland.map.createFromObjects('Objects', 69, 'Misc', 'Checkpoint0000', true, true, this.activeGroup, Checkpoint, false);
    Frogland.map.createFromObjects('Doors', 67, 'Misc', 'DoorSeal0000', true, true, this.activeGroup, Door, false);
    Frogland.map.createFromObjects('Objects', 75, 'Misc', 'Upgrade0000', true, true, this.activeGroup, Upgrade, false);
    Frogland.map.createFromObjects('Objects', 76, 'Misc', 'GemSucker0000', true, true, this.activeGroup, GemSucker, false); 

    this.activeGroup.forEach(function(obj) {
        
        if(obj.spriteType === 'door') {
            obj.create();
            obj.name = 'door';
            this.doorList.push(obj);
        } 
        else if(obj.spriteType === 'checkpoint') {
            obj.name = 'checkpoint';
            this.checkpointList.push(obj);
        }
        else if(obj.spriteType === 'gem_sucker') {
            obj.name = 'GemSucker';
        }
        else if(obj.spriteType === 'upgrade') {
            obj.name = 'Upgrade';
        }

    }, this); 
};

ObjectController.prototype.CompileObjectList = function() {
    this.latentObjects = [];

    Frogland.map.objects['Objects'].forEach(function(o) {
        this.latentObjects.push({ id: o.gid, name: o.name, x: o.x, y: o.y, u: this.latentObjects.length, properties: o.properties });
    }, this);

    Frogland.map.objects['Enemies'].forEach(function(o) {
        if(!GameData.GetFlag('GAME_COMPLETE') || o.name.includes('gnome')) {
            this.latentObjects.push({ id: o.gid, name: o.name, x: o.x, y: o.y, u: this.latentObjects.length, properties: o.properties, enemy: true });
        }
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
        newObj.name = 'apple';
    }
    else if(o.id === 74) {
        newObj = new Orb(game, o.x, o.y, 'Misc', 'Orb0000');
        newObj.latent = o;
        newObj.name = 'orb';
    } 
    else if((o.id >= 85 && o.id <= 104) || (o.id >= 145 && o.id <= 164)) {
	    FileMap.Enemies.forEach(function(enemy) {
	        if(o.id === enemy.Tile) {
                newObj = new Enemy(game, o.x, o.y, enemy.Name, enemy.Name);
                newObj.name = enemy.Name;
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
                newObj.name = 'junk';
	        }
	    });
    } else if(![69,67,75,70,71,72,73,76].includes(o.id)) {
    	console.warn('Unknown object', o);
    }

    if(newObj !== null) {
        this.activeGroup.add(newObj);
        newObj.properties = o.properties || {};
        if(!!o.name) newObj.name = o.name;

        if(newObj.create) newObj.create();
        

        //check for signals attached to the object
        if(!!newObj.properties.on_death) {
            newObj.events.onDestroy.add(function() {
                ComposeAndEmitSignal(newObj.properties.on_death);
            });
        }
    }
};

ObjectController.prototype.SpawnEnemy = function(params) {
    var newEnemy = new Enemy(game, params.x || Frogland.battleBarSpawn.x, params.y || Frogland.battleBarSpawn.y, params.name, params.name);
    newEnemy.name = params.name;
    
    this.activeGroup.add(newEnemy);
    this.enemyList.push(newEnemy);
    newEnemy.properties = {};
    newEnemy.name = params.name;

    if(newEnemy.create) newEnemy.create();

    //check for signals attached to the object
    if(!!params.on_death) {
        newEnemy.events.onDestroy.add(function() {
            ComposeAndEmitSignal(params.on_death);
        });
    }
};

ObjectController.prototype.GetObjectGroup = function() {
    return this.activeGroup;
};

ObjectController.prototype.GetActiveEnemies = function() {
    return this.activeGroup.children.filter(function(o) {
        return o instanceof Enemy;
    })
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
