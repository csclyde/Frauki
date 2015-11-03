
BackgroundsController = function() {
    this.timers = new TimerUtil();

    this.loadedBackgrounds = [];

    this.LoadBackgrounds(4);
    this.LoadBackgrounds(3);
    this.LoadBackgrounds(2);
};

BackgroundsController.prototype.Update = function() {

    this.loadedBackgrounds.forEach(function(o) {
        var padding = 100;

        if(o.owningLayer === Frogland.currentLayer && o.x > game.camera.x - padding && o.y > game.camera.y - padding && o.x < game.camera.x + game.camera.width + padding && o.y < game.camera.y + game.camera.height + padding) {
            o.image.visible = true;
        } else {
            o.image.visible = false;
        }
    });
};

BackgroundsController.prototype.LoadBackgrounds = function(layer) {
    var that = this;

    //console.log(Frogland.map.objects['Objects_' + layer]);

    Frogland.map.objects['Backgrounds_' + layer].forEach(function(o) {
        if(o.type === 'background') {
            var obj = {};
            obj.filename = o.properties.filename;

            var b = game.add.image(0, 0, '')
        } 
    });
};
