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

EnemyBehavior.FaceToFace = function(e) {
    if((e.direction === 'left' && frauki.body.center.x < e.body.center.x + 20) ||
       (e.direction === 'right' && frauki.body.center.x > e.body.center.x - 20) )
        return true;

    return false;
};

EnemyBehavior.PathBlocked = function(e) {
    if(e.body.onWall()) {
        return true;
    } else {
        return false;
    }
}

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

EnemyBehavior.Player.IsDangerous = function(e) {
    if(EnemyBehavior.Player.IsNear(e, 150)) {
        if(frauki.InPreAttackAnim()) {
            return true;
        } else if(frauki.Attacking() && frauki.currentAttack.damage > 0) {
            return true;
        }
    }
    
    return false;
}



EnemyBehavior.FacePlayer = function(e) {
    if(e.body.center.x < frauki.body.center.x) {
        e.SetDirection('right');
    } else {
        e.SetDirection('left');
    }
};

EnemyBehavior.ChargeAtPlayer = function(e, speed) {

    game.physics.arcade.moveToXY(e, frauki.body.center.x, frauki.body.center.y, speed);
};

EnemyBehavior.WalkToPlayer = function(e, speed) {
    e.body.velocity.x = speed * EnemyBehavior.Player.DirMod(e) * -1;
    EnemyBehavior.FacePlayer(e);

    if(EnemyBehavior.PathBlocked(e)) {
        EnemyBehavior.JumpCurb(e);
    }
};

EnemyBehavior.JumpCurb = function(e) {
    if(e.body.onFloor()) {
        e.body.velocity.y = -200;
    }
};

/*
The problem with this system is that actions are specified in the enemy,
and in the enemybehavior. The current compromise is that the enemybehavior
modifies the body, and the animations just respond to that. that will work
for generic actions like jumping, but fails when you consider actions
that are specific to a certain enemy, like different types of attack

The difference currently between EB actions and specific actions, is that
the specific actions can have states associated with them, while the EB
actions do not. So, any EB action is transient, occuring once and possibly
affecting the state.

A specific example is the jump curb action. Ideally, we want the jump 
curb action to jump the guy up, move him forward, then when he lands 
determine if it worked. Its failure can then reverberate upwards in the tree
and change the tactics of the enemy as a whole.

That kind of behavior requires a stateful aspect to the enemy behavior.

Alternatively all stateful choices can be made in the enemy states...
*/
