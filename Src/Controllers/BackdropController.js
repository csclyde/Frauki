
BackdropController = function() {
    this.timers = new TimerUtil();

    this.loadedBackdrops = [];

};

BackdropController.prototype.Update = function() {

    this.loadedBackdrops.forEach(function(o) {
        var padding = 100;

        //if(o.x > game.camera.x - padding && o.y > game.camera.y - padding && o.x < game.camera.x + game.camera.width + padding && o.y < game.camera.y + game.camera.height + padding) {
        if(o.x + o.width < game.camera.x || o.y + o.height < game.camera.y || o.x > game.camera.right || o.y > game.camera.bottom) {
            o.visible = false;
        } else {
            o.visible = true;
            o.tilePosition.x = game.camera.x * 0.1;
            o.tilePosition.y = game.camera.y * 0.1;
        }
    });
};

BackdropController.prototype.LoadBackgrounds = function() {
    Frogland.backdrops = game.add.group();
    var that = this;

    Frogland.map.objects['Backdrop'].forEach(function(o) {

        var b = game.add.tileSprite(o.x, o.y, o.width, o.height, o.name, null, Frogland.backdrops);
        that.loadedBackdrops.push(b);
        
    });
};
