TriggerController = function() {

    this.timers = new TimerUtil();

    this.triggerLayers = {};
    this.triggerTargets = {};
    
  
};

TriggerController.prototype.triggers = {};

TriggerController.prototype.Create = function() {
};

TriggerController.prototype.CreateTriggers = function(layer) {

    this.triggerLayers['Triggers'] = Frogland.map.objects['Triggers'].concat(Frogland.map.objects['Audio']).concat(Frogland.map.objects['Effects']);

    for(var i = 0; i < this.triggerLayers['Triggers'].length; i++) {

        var trigger = this.triggerLayers['Triggers'][i];

        if(trigger.type !== 'trigger') {
            continue;
        }

        if(!trigger.properties) trigger.properties = {};

        trigger.once =  trigger.properties.once === 'true' ? true : false;
        delete trigger.properties.once;

        //find the target
        if(!!trigger.properties.target && !!this.triggerTargets[trigger.properties.target]) {
            trigger.target = this.triggerTargets[trigger.properties.target];
            delete trigger.properties.target;
        } else {
            trigger.target = frauki;
        }


        trigger.x = Math.floor(trigger.x);
        trigger.y = Math.floor(trigger.y);
        trigger.width = Math.floor(trigger.width);
        trigger.height = Math.floor(trigger.height);

        trigger.enterFired = false;
        trigger.stayFired = false;
        trigger.exitFired = false;

        //trigger.playerInside = false;

        if(!!this.triggers[trigger.name]) {
            if(!!this.triggers[trigger.name].load) {
                this.triggers[trigger.name].load(trigger);
            }
            
            trigger.enter = this.triggers[trigger.name].enter;
            trigger.stay = this.triggers[trigger.name].stay;
            trigger.exit = this.triggers[trigger.name].exit;
        } else {
            console.warn('Trigger with name ' + trigger.name + ' was not found');
        }
    }
};

TriggerController.prototype.Update = function(currentLayer) {

    if(GameState.restarting || GameState.inMenu) {
        return;
    }

    currentLayer = this.triggerLayers['Triggers'];

    //loop through all triggers on the current layer and see if any in
    //the active zone around or within the camera

    var activeTriggers = [];

    var i = currentLayer.length;
    while(i--) {
        var trigger = currentLayer[i];

        if(trigger.type !== 'trigger') continue;

        //if the player intersects with this trigger
        if(this.Intersects(trigger.target.body, trigger)) {

            //if the flag is unset, they just entered the trigger
            if(trigger.playerInside === false) {

                if(!trigger.enterFired || !trigger.once) {
                    //so call the enter function
                    if(!!trigger.enter) trigger.enter(trigger.properties, trigger);

                    trigger.enterFired = true;
                }

                //and set the flag
                trigger.playerInside = true;

            //if the flag is already set, they are still in the trigger
            } else if(trigger.playerInside === true) {
                if(!trigger.stayFired || !trigger.once) {
                    //call the stay function
                    if(!!trigger.stay) trigger.stay(trigger.properties, trigger);

                    trigger.stayFired = true;
                }
            }

        //if the player does not intersect with the trigger
        } else {

            //if the flag is set, they just exited the trigger
            if(trigger.playerInside === true) {

                if(!trigger.exitFired || !trigger.once) {
                    //so call the exit function of the trigger
                    if(!!trigger.exit) trigger.exit(trigger.properties, trigger);

                    trigger.exitFired = true;
                }

            }
            //and unset the flag
            trigger.playerInside = false;
        }
    }
};

TriggerController.prototype.Reset = function() {
    this.triggerLayers['Triggers'].forEach(function(trig) {
        trig.enterFired = false;
        trig.stayFired = false;
        trig.exitFired = false;
    });
};

TriggerController.prototype.ForceExit = function(currentLayer) {
    currentLayer = this.triggerLayers['Triggers'];

    //loop through all triggers on the current layer and see if any in
    //the active zone around or within the camera

    var activeTriggers = [];

    var i = currentLayer.length;
    while(i--) {
        var trigger = currentLayer[i];

        if(trigger.type !== 'trigger') continue;

        //if the player intersects with this trigger
        if(this.Intersects(trigger.target.body, trigger)) {
            //if the flag is set, they just exited the trigger
            if(trigger.playerInside === true) {

                if(!trigger.exitFired || !trigger.once) {
                    //so call the exit function of the trigger
                    if(!!trigger.exit) trigger.exit(trigger.properties, trigger);

                    trigger.exitFired = true;
                }

                //and unset the flag
                trigger.playerInside = false;
            }
        }

    }
};

TriggerController.prototype.Intersects = function(body, trigger) {

    if(!body || !trigger) return false;
    
    if (body.right <= trigger.x) { return false; }
    if (body.bottom <= trigger.y) { return false; }
    if (body.position.x >= trigger.width + trigger.x) { return false; }
    if (body.position.y >= trigger.height + trigger.y) { return false; }
    return true;
};

TriggerController.prototype.RegisterTarget = function(name, obj) {
    this.triggerTargets[name] = obj;
};

/* TRIGGER TEMPLATE

{
    "name":"music_surface_ruins",
    "height":293.333333333333,
    "width":85.3333333333335,
    "x":2921.33333333333,
    "y":979.333333333333,

    "properties": {
        "once":"true"
    },

}

*/
