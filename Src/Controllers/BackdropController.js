
BackdropController = function() {
    this.timers = new TimerUtil();

    this.loadedBackdrops = [];
};

BackdropController.prototype.Create = function() {
    this.CreateParallax();
    this.LoadBackgrounds();
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

    this.clouds1.cameraOffset.x = -(game.camera.x * 0.10) + 250;
    this.clouds1.cameraOffset.y = -(game.camera.y * 0.10) + 100 + (Math.sin(game.time.now / 2000) * 10);

    this.clouds2.cameraOffset.x = -(game.camera.x * 0.12) + 250;
    this.clouds2.cameraOffset.y = -(game.camera.y * 0.12) + 150 + (Math.sin(game.time.now / 1500) * 7);

    this.mountain.cameraOffset.x = -(game.camera.x * 0.14) + 100;
    this.mountain.cameraOffset.y = -(game.camera.y * 0.14) + 250;

    this.clouds3.cameraOffset.x = -(game.camera.x * 0.16) + 550;
    this.clouds3.cameraOffset.y = -(game.camera.y * 0.16) + 400 + (Math.sin(game.time.now / 1000) * 4);
};

BackdropController.prototype.CreateParallax = function() {
    this.background = game.add.group(Frogland.froglandGroup, 'backgrounds');

    this.bg = game.add.image(0, 0, 'Background', null, this.background);
    this.bg.fixedToCamera = true;
    this.clouds1 = game.add.image(0, 0, 'clouds1', null, this.background);
    this.clouds1.fixedToCamera = true;
    this.clouds2 = game.add.image(0, 0, 'clouds2', null, this.background);
    this.clouds2.fixedToCamera = true;
    this.mountain = game.add.image(0, 0, 'mountain', null, this.background);
    this.mountain.fixedToCamera = true;
    this.clouds3 = game.add.image(0, 0, 'clouds3', null, this.background);
    this.clouds3.fixedToCamera = true;
};

BackdropController.prototype.LoadBackgrounds = function() {
    this.backdrops = game.add.group(Frogland.froglandGroup, 'backdrops');
    
    Frogland.map.objects['Backdrop'].forEach(function(o) {
        var b = game.add.tileSprite(o.x, o.y, o.width, o.height, o.name, null, this.backdrops);
        
        if(o.properties.scroll) {
            var scroll = o.properties.scroll.split(',');
            b.scrollFactorX = +scroll[0];
            b.scrollFactorY = +scroll[1];

        } else {
            b.scrollFactorX = 0.15;
            b.scrollFactorY = 0.15;
        }
        this.loadedBackdrops.push(b);
    }, this);
};
