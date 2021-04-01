EnemyBehavior = {};

EnemyBehavior.SetProp = function(e, key, val) {
    if(!e.EBProps) e.EBProps = {};
    e.EBProps[key] = val;
};

EnemyBehavior.WithinCameraRange = function(e, pad) {
    var padding = pad || -30;

    if(e.body.x > game.camera.x - padding &&
       e.body.y > game.camera.y - padding &&
       e.body.x < game.camera.x + game.camera.width + padding &&
       e.body.y < game.camera.y + game.camera.height + padding)
        return true;

    return false;
};

EnemyBehavior.FacingPlayer = function(e) {
    if((e.direction === 'left' && frauki.body.center.x < e.body.center.x + 20) ||
       (e.direction === 'right' && frauki.body.center.x > e.body.center.x - 20) )
        return true;

    return false;
};

EnemyBehavior.FacingAttack = function(e) {
    if(frauki.states.throwing) {
        if((e.direction === 'left' && frauki.attackRect.body.center.x < e.body.center.x + 20) ||
           (e.direction === 'right' && frauki.attackRect.body.center.x > e.body.center.x - 20) )
            return true;
    } else {
        return this.FacingPlayer(e);
    }

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

EnemyBehavior.FlipCoin = function() {
    var roll = Math.random();

    if(roll >= 0.5)
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

    if(frauki.body.center.x < e.body.center.x) {
        distX = e.body.x - frauki.body.center.x;
    } else {
        distX = frauki.body.center.x - (e.body.x + e.body.width);
    }

    var dist = Math.sqrt(distX * distX + distY * distY);

    return dist;
};

EnemyBehavior.Player.Visibility = {};
EnemyBehavior.Player.IsVisible = function(e) {


    //if the enemy is not cached, create an object for it
    if(!this.Visibility[e.z]) {
        this.Visibility[e.z] = { obj: e, timestamp: 0, result: false };
    }

    var initialState = this.Visibility[e.z].result;

    if(!EnemyBehavior.WithinCameraRange(e, 100)) {
        this.Visibility[e.z].result = false;
        return false;
    }

    //determine how often the check should be redone
    var refreshTime = 1000;

    if(this.Visibility[e.z].result === true) {
        refreshTime = 1000;
    } else {
        var dist = EnemyBehavior.Player.Distance(e);

        if(dist < 100) {
            refreshTime = 500;
        } else if(dist < 200) {
            refreshTime = 500;
        }

        if(EnemyBehavior.Player.MovingTowards(e)) {
            refreshTime /= 2;
        }
        
    }

    //if the timestamp has expired, check for visibility
    if(this.Visibility[e.z].timestamp + refreshTime < GameState.gameTime) {
        var ray = new Phaser.Line(frauki.body.center.x, frauki.body.center.y, e.body.center.x, e.body.center.y);
        var collideTiles = Frogland.GetCollisionLayer().getRayCastTiles(ray, 20, true);

        this.Visibility[e.z].timestamp = GameState.gameTime;

        this.Visibility[e.z].result = true;

        var i = collideTiles.length;
        while(i--) {
            if([1, 3, 4, 5, 7, 8, 9, 17, 18].includes(collideTiles[i].index)) { 
                this.Visibility[e.z].result = false;
                break;
            }
        }

        //if there are no tiles in the ray, check for doors
        if(this.Visibility[e.z].result === true) {
            if(EnemyBehavior.Player.IsDoorBetween(e)) {
                this.Visibility[e.z].result = false;
            }
        }
    }

    if(initialState !== true && this.Visibility[e.z].result === true && e.maxEnergy > 1) {
        speechController.ShowExclamationMark(e);
    }

    return this.Visibility[e.z].result;
};

EnemyBehavior.Player.IsDoorBetween = function(e) {
    var ray = new Phaser.Line(frauki.body.center.x, frauki.body.center.y, e.body.center.x, e.body.center.y);

    var i = objectController.doorList.length;

    var doorLine = null;
    var door = null;

    while(i--) {
        door = objectController.doorList[i];
        if(!door.body) continue;
        doorLine = new Phaser.Line(door.body.x + door.body.width / 2, door.body.y - 50, door.body.x + door.body.width / 2, door.body.y + door.body.height + 50);

        if(Phaser.Line.intersects(ray, doorLine)) {

            return true;
        }
    }

    return false;
};

EnemyBehavior.Player.IsWallBetween = function(e) {
    var ray = new Phaser.Line(frauki.body.center.x, frauki.body.center.y, e.body.center.x, e.body.center.y);
    var collideTiles = Frogland.GetCollisionLayer().getRayCastTiles(ray, 4, true);

    var i = collideTiles.length;
    var collideCount = 0;
    while(i--) {
        if(collideTiles[i].index === 1) { 
            collideCount++;
        }

        if(collideCount >= 2) {
            return true;
        }
    }

    return false;
};

EnemyBehavior.Player.IsBelow = function(e) {
    var margin = e.body.width / 2;
    margin += -10;

    if(e.body.center.y < frauki.body.y && 
       e.body.center.x > frauki.body.center.x - margin && 
       e.body.center.x < frauki.body.center.x + margin && 
       !e.body.onFloor())
        return true;

    return false;
};

EnemyBehavior.Player.IsAbove = function(e) {
    var margin = e.body.width;
    margin += 20;

    if(frauki.body.bottom < e.body.top && 
       frauki.body.left < e.body.right && 
       frauki.body.right > e.body.left &&
       !frauki.body.onFloor())
        return true;

    return false;
};

EnemyBehavior.Player.IsFront = function(e) {

};

EnemyBehavior.Player.IsBehind = function(e) {

};

EnemyBehavior.Player.IsLeft = function(e) {
    if(frauki.body.center.x < e.body.x)
        return true;

    return false;
};

EnemyBehavior.Player.IsRight = function(e) {
    if(frauki.body.center.x > e.body.x)
        return true;

    return false;
};

EnemyBehavior.Player.IsStunned = function(e) {
    if(frauki.state === frauki.Stunned) {
        return true;
    }

    return false;
}

EnemyBehavior.Player.IsVulnerable = function(e) {

    if(frauki.state === frauki.Stunned) {
        return true;
    }

    if(!frauki.timers.TimerUp('frauki_invincible') || !frauki.timers.TimerUp('grace')) {
        return false;
    }

    if(frauki.state === frauki.Rolling) {
        return false;
    }

    if(frauki.state === frauki.Hurting) {
        return false;
    }

    if(EnemyBehavior.Player.IsInVulnerableFrame(e)) {
        return true;
    }

    if(frauki.state === frauki.Falling && frauki.states.hasFlipped) {
        return true;
    }

    //if none of this determined a vulnerable/invulnerable state, then just attack
    return true;
};

EnemyBehavior.Player.IsInVulnerableFrame = function(e) {
    var vulnerableFrames = [
        'Attack Fall0005',
        'Attack Fall0006',
        'Attack Fall0007',
        'Attack Fall0008',

        'Attack Front0006',
        'Attack Front0007',
        'Attack Front0008',
        'Attack Front0009',

        'Attack Jump0004',
        'Attack Jump0005',
        'Attack Jump0006',

        'Attack Overhead0008',
        'Attack Overhead0009',
        'Attack Overhead0010',
        'Attack Overhead0011',
        'Attack Overhead0012',

        'Attack Dive0000',
        'Attack Dive0001',
        'Attack Dive0002',
        'Attack Dive0003',
        'Attack Dive0004',
        'Attack Dive0005',

        'Attack Dive0019',
        'Attack Dive0020',
        'Attack Dive0021',
        'Attack Dive0022',
        'Attack Dive0023',
        'Attack Dive0024',
        'Attack Dive0025',
        'Attack Dive0026',

        'Attack Stab0000',
        'Attack Stab0001',

        'Attack Stab0011',
        'Attack Stab0012',
        'Attack Stab0013',
        'Attack Stab0014',
        'Attack Stab0015',
        'Attack Stab0016',
        'Attack Stab0017',
    ];

    if(vulnerableFrames.indexOf(frauki.animations.currentFrame.name) > -1) {
        return true;
    }

    return false;
};

EnemyBehavior.Player.DirMod = function(e) {

    return frauki.body.center.x < e.body.center.x ? 1 : -1;
};

EnemyBehavior.Player.IsDangerous = function(e) {
    if(EnemyBehavior.Player.IsAbove(e) && frauki.state === frauki.AttackDiveCharge) {
        return true;
    }

    if(frauki.InPreAttackAnim()) {
        return true;
    } 

    if(frauki.states.throwing && !EnemyBehavior.Player.ThrowIncoming(e)) {
        return false;
    }

    if(frauki.Attacking() && frauki.currentAttack.damage > 0) {
        return true;
    }
    
    return false;
};

EnemyBehavior.Player.MovingTowards = function(e) {
    if(frauki.body.center.x < e.body.x && frauki.body.velocity.x > 50) {
        return true;
    } else if(frauki.body.center.x > e.body.x && frauki.body.velocity.x < -50) {
        return true;
    } else {
        return false;
    }
};

EnemyBehavior.Player.MovingAway = function(e) {
    if(frauki.body.center.x > e.body.x && frauki.body.velocity.x > 50) {
        return true;
    } else if(frauki.body.center.x < e.body.x && frauki.body.velocity.x < -50) {
        return true;
    } else {
        return false;
    }
};

EnemyBehavior.Player.ThrowIncoming = function(e) {
    if(frauki.states.throwing) {
        if(e.direction === 'left' && frauki.attackRect.body.center.x < e.body.center.x && weaponController.Baton.baton.body.velocity.x > 0) {
            return true;
        } else if(e.direction === 'right' && frauki.attackRect.body.center.x > e.body.center.x && weaponController.Baton.baton.body.velocity.x < 0) {
            return true;
        }

    } 

    return false;
};



EnemyBehavior.FacePlayer = function(e) {
    if(e.body.center.x < frauki.body.center.x) {
        e.SetDirection('right');
    } else {
        e.SetDirection('left');
    }
};

EnemyBehavior.FaceAwayFromPlayer = function(e) {
    if(e.body.center.x < frauki.body.center.x) {
        e.SetDirection('left');
    } else {
        e.SetDirection('right');
    }
};

EnemyBehavior.FaceForward = function(e) {
    if(e.body.velocity.x < 0) {
        e.SetDirection('left');
    } else {
        e.SetDirection('right');
    }
}

EnemyBehavior.ChargeAtPlayer = function(e, speed) {

    game.physics.arcade.moveToXY(e, frauki.body.center.x, frauki.body.center.y, speed);
};

EnemyBehavior.WalkToPlayer = function(e, speed) {
    e.body.velocity.x = speed * EnemyBehavior.Player.DirMod(e) * -1;
    EnemyBehavior.FacePlayer(e);

    return true;
};

EnemyBehavior.WalkAwayFromPlayer = function(e, speed) {
    e.body.velocity.x = speed * EnemyBehavior.Player.DirMod(e);
    EnemyBehavior.FaceAwayFromPlayer(e);

    return true;
};

EnemyBehavior.JumpCurb = function(e) {
    if(e.body.onFloor()) {
        e.body.velocity.y = -200;
        EnemyBehavior.SetProp(e, 'jump_attempted', true);
    }
};

EnemyBehavior.JumpToPoint = function(e, x, y, dur) {
    var duration = dur || 0.65;

    e.body.velocity.x = (x - e.body.center.x) / duration;
    e.body.velocity.y = (y + -0.5 * game.physics.arcade.gravity.y * duration * duration - e.body.center.y) / duration;
};