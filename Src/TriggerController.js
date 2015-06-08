TriggerController = function() {

    this.timers = new TimerUtil();

    this.triggerLayers = {
        'Triggers_4': [],
        'Triggers_3': [],
        'Triggers_2': []
    };
  
};

TriggerController.prototype.create = function(map) {

    //extract the triggers from the map
    this.triggerLayers['Triggers_4'] = map.objects['Triggers_4'];
    this.triggerLayers['Triggers_3'] = map.objects['Triggers_3'];
    this.triggerLayers['Triggers_2'] = map.objects['Triggers_2'];

    //move the "once" property from the properties object onto the top.
    //clamp the positions at whole numbers
    for(var i = 0; i < this.triggerLayers['Triggers_4'].length; i++) {
        this.triggerLayers.Triggers_4[i].once =  this.triggerLayers.Triggers_4[i].properties.once;
        delete this.triggerLayers.Triggers_4[i].properties.once;

        this.triggerLayers.Triggers_4[i].x = Math.floor(this.triggerLayers.Triggers_4[i].x);
        this.triggerLayers.Triggers_4[i].y = Math.floor(this.triggerLayers.Triggers_4[i].y);
        this.triggerLayers.Triggers_4[i].width = Math.floor(this.triggerLayers.Triggers_4[i].width);
        this.triggerLayers.Triggers_4[i].height = Math.floor(this.triggerLayers.Triggers_4[i].height);
    }

    for(var i = 0; i < this.triggerLayers['Triggers_3'].length; i++) {
        this.triggerLayers.Triggers_3[i].once =  this.triggerLayers.Triggers_3[i].properties.once;
        delete this.triggerLayers.Triggers_3[i].properties.once;

        this.triggerLayers.Triggers_3[i].x = Math.floor(this.triggerLayers.Triggers_3[i].x);
        this.triggerLayers.Triggers_3[i].y = Math.floor(this.triggerLayers.Triggers_3[i].y);
        this.triggerLayers.Triggers_3[i].width = Math.floor(this.triggerLayers.Triggers_3[i].width);
        this.triggerLayers.Triggers_3[i].height = Math.floor(this.triggerLayers.Triggers_3[i].height);
    }

    for(var i = 0; i < this.triggerLayers['Triggers_2'].length; i++) {
        this.triggerLayers.Triggers_2[i].once =  this.triggerLayers.Triggers_2[i].properties.once;
        delete this.triggerLayers.Triggers_2[i].properties.once;

        this.triggerLayers.Triggers_2[i].x = Math.floor(this.triggerLayers.Triggers_2[i].x);
        this.triggerLayers.Triggers_2[i].y = Math.floor(this.triggerLayers.Triggers_2[i].y);
        this.triggerLayers.Triggers_2[i].width = Math.floor(this.triggerLayers.Triggers_2[i].width);
        this.triggerLayers.Triggers_2[i].height = Math.floor(this.triggerLayers.Triggers_2[i].height);
    }

    //the properties object will then be passed in to the triggers as a param
};

TriggerController.prototype.Update = function(currentLayer) {

    currentLayer = triggerLayers['Triggers_' + currentLayer];

    //loop through all triggers on the current layer and see if any in
    //the active zone around or within the camera

    var activeTriggers = [];

    var i = currentLayer.length;
    while(i--) {

    }
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