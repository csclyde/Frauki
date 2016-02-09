EnemyBehavior = {};

EnemyBehavior.WithinCameraRange = function(e) {
    var padding = 150;

    if(e.body.x > game.camera.x - padding &&
       e.body.y > game.camera.y - padding &&
       e.body.x < game.camera.x + game.camera.width + padding &&
       e.body.y < game.camera.y + game.camera.height + padding)
        return true;

    return false;
};

EnemyBehavior.GetDirMod = function(e) {
    if(e.direction === 'left') {
        return -1;
    } else {
        return 1;
    }
};

EnemyBehavior.RollDice = function(sides, thresh) {
    var roll = Math.random() * sides;

    if(roll >= thresh)
        return true;
    else
        return false;
};


EnemyBehavior.Player = {};

EnemyBehavior.Player.IsNear = function(e, radius) {

    if(EnemyBehavior.Player.Distance(e) <= radius)
        return true;
    else
        return false;
};

EnemyBehavior.Player.Distance = function(e) {
    var distX = frauki.body.center.x - e.body.center.x;
    var distY = frauki.body.center.y - e.body.center.y;

    var dist = Math.sqrt(distX * distX + distY * distY);

    return dist;
};

EnemyBehavior.Player.IsVisible = function(e) {

    return EnemyBehavior.WithinCameraRange(e);

    // var ray = new Phaser.Line(frauki.body.center.x, frauki.body.center.y, e.body.center.x, e.body.center.y);
    // var collideTiles = Frogland.GetCurrentCollisionLayer().getRayCastTiles(ray, 1, true);

    // var i = collideTiles.length;
    // while(i--) {
    //     if(collideTiles[i].index === 1) return false;
    // }

    // return true;
};

EnemyBehavior.Player.IsBelow = function(e) {
    if(this.body.center.y < frauki.body.y && 
       this.body.center.x > frauki.body.center.x - 20 && 
       this.body.center.x < frauki.body.center.x + 20 && 
       !this.body.onFloor())
        return true;

    return false;
};

EnemyBehavior.Player.IsAbove = function(e) {
    if(this.body.center.y > frauki.body.y && 
       this.body.center.x > frauki.body.center.x - 20 && 
       this.body.center.x < frauki.body.center.x + 20)
        return true;

    return false;
};

EnemyBehavior.Player.IsVulnerable = function(e) {

    var vulnerableFrames = [
        'Attack Dive0019',
        'Attack Dive0020',
        'Attack Dive0021',
        'Attack Dive0022',
        'Attack Dive0023',
        'Attack Dive0024',
        'Attack Dive0025',
        'Attack Dive0026',
        'Attack Dive0027',
        'Attack Dive0028',
        'Attack Stab0011',
        'Attack Stab0012',
        'Attack Stab0013',
        'Attack Stab0014',
        'Attack Stab0015',
        'Attack Stab0016',
        'Attack Stab0017'
    ];

    if(vulnerableFrames.indexOf(frauki.animations.currentFrame.name) > -1) {
        return true;
    } else {
        return false;
    }
};

EnemyBehavior.Player.DirMod = function(e) {

    return frauki.body.center.x < e.body.center.x ? 1 : -1;
};


EnemyBehavior.Actions = {}

EnemyBehavior.Actions.FacePlayer = function(e) {
    if(e.body.center.x < frauki.body.center.x) {
        e.SetDirection('right');
    } else {
        e.SetDirection('left');
    }
};

EnemyBehavior.Actions.ChargeAtPlayer = function(e, speed) {

    game.physics.arcade.moveToXY(e, frauki.body.center.x, frauki.body.center.y, speed);
};
