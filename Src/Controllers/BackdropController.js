
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

    this.clouds1.cameraOffset.x = -(game.camera.x * 0.10) + 0;
    this.clouds1.cameraOffset.y = -(game.camera.y * 0.05) + 50;

    // if(game.camera.y > 80 * 16) this.clouds1.visible = false;
    // else this.clouds1.visible = true;

    this.clouds2.cameraOffset.x = -(game.camera.x * 0.15) + 200;
    this.clouds2.cameraOffset.y = -(game.camera.y * 0.06) + 70;

    // if(game.camera.y > 80 * 16) this.clouds2.visible = false;
    // else this.clouds2.visible = true;

    this.plx1.cameraOffset.x = -(game.camera.x * 0.20) + 0;
    this.plx1.cameraOffset.y = -(game.camera.y * 0.08) + 220;

    // if(game.camera.y > 80 * 16) this.plx1.visible = false;
    // else this.plx1.visible = true;

    if(game.camera.y > 5000) {
        this.clouds1.cameraOffset.y += 500;
        this.clouds2.cameraOffset.y += 600;
        this.plx1.cameraOffset.y += 800;
    }

};

BackdropController.prototype.CreateParallax = function() {
    this.bg = game.add.tileSprite(0, 0, pixel.width * 1.5, pixel.height * 1.5, 'Background');
    this.bg.fixedToCamera = true;
    this.bg.autoScroll(-2, 0);

    this.clouds1 = game.add.tileSprite(0, 0, 1024, 512, 'clouds1');
    this.clouds1.fixedToCamera = true;
    this.clouds1.autoScroll(-2, 0);

    this.clouds2 = game.add.tileSprite(0, 0, 1024, 512, 'clouds2');
    this.clouds2.fixedToCamera = true;
    this.clouds2.autoScroll(-3, 0);

    this.plx1 = game.add.image(0, 0, 'parallax1');
    this.plx1.fixedToCamera = true;
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
