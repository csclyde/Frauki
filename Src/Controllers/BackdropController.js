
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
            o.tilePosition.x = game.camera.x * o.scrollFactorX;
            o.tilePosition.y = game.camera.y * o.scrollFactorY;
        }
    });
};

BackdropController.prototype.LoadBackgrounds = function() {
    Frogland.backdrops = game.add.group();
    var that = this;

    Frogland.map.objects['Backdrop'].forEach(function(o) {

        var b = game.add.tileSprite(o.x, o.y, o.width, o.height, o.name, null, Frogland.backdrops);

        if(o.properties.scroll) {
            var scroll = o.properties.scroll.split(',');
            b.scrollFactorX = +scroll[0];
            b.scrollFactorY = +scroll[1];

        } else {
            b.scrollFactorX = 0.15;
            b.scrollFactorY = 0.15;
        }
        that.loadedBackdrops.push(b);
        
    });
};
