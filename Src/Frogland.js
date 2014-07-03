var Frogland = new Phaser.State();

Frogland.preload = function() {
	
    game.load.atlasJSONHash('Frauki', '../Data/Frauki/Frauki.png', '../Data/Frauki/Frauki.json');
    game.load.tilemap('Frogland', '../Data/Locations/Frogland/Frogland.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('Frogland', '../Data/Locations/Frogland/Frogland.png');
    game.load.image('Background', '../Data/Locations/Frogland/Sky.png');
    game.load.image('parallax1', '../Data/Locations/Frogland/Parallax1.png');
    game.load.image('parallax2', '../Data/Locations/Frogland/Parallax2.png');
}

var map;
var tileset;
var layer;
var jumpTimer = 0;
var cursors;
var jumpButton;
var bg;
var parallax1, parallax2;
var cameraController;

Frogland.create = function() {
	game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#000000';

    bg = game.add.tileSprite(0, 0, 320, 240, 'Background');
    bg.fixedToCamera = true;

    parallaxLayer1 = game.add.tileSprite(0, 0, 320, 240, "parallax1");
    parallaxLayer1.fixedToCamera = true;

    parallaxLayer2 = game.add.tileSprite(0, 0, 320, 240, "parallax2");
    parallaxLayer2.fixedToCamera = true;

    map = game.add.tilemap('Frogland');

    map.addTilesetImage('Frogland');

    map.setCollision([82, 83, 84, 87, 88, 89, 149, 127, 129, 108, 147, 109, 103, 104, 183, 184, 128, 107]);

    layer = map.createLayer('Tile Layer 1');
    //layer.debug = true;

    layer.resizeWorld();

    game.physics.arcade.gravity.y = 1000;

    frauki = new Player(game, 0, 0, 'Frauki');
    game.add.existing(frauki);

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    cameraController = new CameraController(frauki);
}

Frogland.update = function() {
	game.physics.arcade.collide(frauki, layer);

    frauki.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        frauki.body.velocity.x = -250;

        frauki.SetDirection('left');
    }
    else if (cursors.right.isDown)
    {
        frauki.body.velocity.x = 250;

        frauki.SetDirection('right');
    }
    
    if (jumpButton.isDown && frauki.body.onFloor() && game.time.now > jumpTimer)
    {
        frauki.body.velocity.y = -500;
        jumpTimer = game.time.now + 750;
    }

    cameraController.UpdateCamera();
}

Frogland.render = function() {
    /*var stateName = (function functionName(fun) {
        var ret = fun.toString();
        ret = ret.substr('function '.length);
        ret = ret.substr(0, ret.indexOf('('));
        return ret;
    })(frauki.state);

    game.debug.text(stateName, 0, 30);*/

    //game.debug.body(frauki);
}