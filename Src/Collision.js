var Collision = {};

Collision.OverlapFraukiWithObject = function(f, o) {    
    return (!!o.collideWithPlayer) ? o.collideWithPlayer(f) : true;
};

Collision.CollideFraukiWithEnvironment = function(f, tile) {
    //13 - 16

    //solid tile
    if(tile.index === 1 || tile.index === 8 || tile.index === 9) { 
        return true;

    //water
    } else if(tile.index === 2 || tile.index === 10 || tile.index === 13 || tile.index === 14 || tile.index === 15 || tile.index === 16 || tile.index === 19) { 
        frauki.states.inWater = true;

        if(tile.index === 10) effectsController.Splash(tile);
        if(tile.index === 19) effectsController.SplashDirty(tile);

        if(tile.index === 13) frauki.states.flowDown = true;
        if(tile.index === 14) frauki.states.flowRight = true;
        if(tile.index === 15) frauki.states.flowUp = true;
        if(tile.index === 16) frauki.states.flowLeft = true;

        
        return false;

    //trick wall
    } else if(tile.index === 3) {
        if(frauki.state === frauki.Rolling) {
            return false;
        } else {
            return true;
        }

    //cloud tile
    } else if(tile.index === 4) { 
        frauki.states.onCloud = true;

        if(frauki.states.droppingThroughCloud) {
            return false;
        } else {
            return true;
        }

    //falling tiles and attackable tiles
    } else if(tile.index === 5) { 

        if(tile.dislodged === true) {
            return false;
        }
        
        if(tile.waitingToFall !== true && frauki.body.center.y < tile.worldY) {
            Frogland.DislodgeTile(tile); 
            tile.waitingToFall = true;
        }

        if(frauki.state === frauki.AttackDiveFall) {
            return false;
        } else {
            return true;
        }

    } else if(tile.index === 7) {

        return false;

    //updraft
    } else if(tile.index === 11) {
        frauki.states.inUpdraft = true;

    //spikes
    } else if(tile.index === 12) {

    //left slope
    } else if(tile.index === 17) {
        frauki.states.onLeftSlope = true;

        if(frauki.body.center.x <= tile.right + 2 && frauki.body.center.x >= tile.left - 2) {
            if(frauki.body.velocity.y > 0) {
                var offset = (tile.right - Math.round(frauki.body.center.x));
                if(offset > 16) offset = 16;
                if(offset < 0) offset = 0;

                frauki.body.y = tile.worldY - frauki.body.height + offset;
                frauki.body.blocked.down = true;
                frauki.body.velocity.y = 0;
                //frauki.body.velocity.x /= 1.25;
            }
        }

    //right slope
    } else if(tile.index === 18) {
        frauki.states.onRightSlope = true;

        if(frauki.body.center.x <= tile.right + 2 && frauki.body.center.x >= tile.left - 2) {
            if(frauki.body.velocity.y > 0) {
                var offset = 16 - (tile.right - Math.round(frauki.body.center.x));
                if(offset > 16) offset = 16;
                if(offset < 0) offset = 0;

                frauki.body.y = tile.worldY - frauki.body.height + offset;
                frauki.body.blocked.down = true;
                frauki.body.velocity.y = 0;
                //frauki.body.velocity.x /= 1.25;
            }
        }
    }
};

Collision.CollideFraukiWithProjectile = function(f, p) {

    if(frauki.state === frauki.Rolling || frauki.state === frauki.Flipping) {
        return;
    }
    
    if(p.projType === 'spore' || p.projType === 'bolt' || p.projType === 'mortar' || p.projType === 'detonator' || (p.projType === 'mortarExplosion' && p.animations.currentFrame.name === 'SW8T/Mortar0004')) {
        if(p.owningEnemy.state !== p.owningEnemy.Dying) {
            if(frauki.Attacking() || frauki.states.shielded) {
                Collision.OverlapAttackWithEnemyAttack(p, f);
            } else {
                frauki.Hit(p.owningEnemy, p.owningEnemy.damage);
                p.owningEnemy.LandHit();
            }
        }

        if(p.projType === 'mortar' || p.projType === 'detonator') {
            p.pendingDestroy = true;
            events.publish('camera_shake', {magnitudeX: 3, magnitudeY: 1, duration: 200});
            projectileController.MortarExplosion(p.owningEnemy, p.x, p.y, 'air');
        }
        
        if(!p.preserveAfterHit) {
            p.destroy();
        }
    } else if(p.projType === 'bolas' && !p.attached && frauki.state !== frauki.Rolling) {
        p.attached = true;
        frauki.body.velocity.x /= 2;
        frauki.body.velocity.y /= 2;
        p.owningEnemy.waitingForBolas = false;
    } else if(p.projType === 'tar' && frauki.state !== frauki.Rolling) {
        p.destroy();
        frauki.body.velocity.x /= 2;
        frauki.body.velocity.y /= 2;
        frauki.states.tarred = true;
        frauki.timers.SetTimer('tarred', 3000);
    }
};


Collision.CollideEnemiesWithDoors = function(e, d) {
    if(d.body.x < e.body.x) {
        e.body.blocked.left = true;
    } else {
        e.body.blocked.right = true;
    }
};

Collision.OverlapEnemyAttackWithFrauki = function(e, f) {
    if(frauki.states.shielded) {
        Collision.OverlapAttackWithEnemyAttack(e, f);
        return false;
    }

    //if frauki is stunned and the player opened the roll window
    if(!frauki.timers.TimerUp('attack_stun') && !frauki.timers.TimerUp('stun_dodge')) {
        frauki.Roll({override: true});
        return false;
    }

    if(EnemyBehavior.Player.IsDoorBetween(e)) {
        return false;
    }

    e = e.owningEnemy;

    
    if(e.GetCurrentStun() === true) {
        frauki.Stun(e);
    }

    
    
    if(e.GetCurrentDamage() > 0 && (!frauki.Grace() || e.GetCurrentPower()) && !e.Grace()) {
        frauki.Hit(e, e.GetCurrentDamage(), 1000);
        e.LandHit();
    }

    return e.GetCurrentAttackSolid();
};

Collision.OverlapEnemyAttackWithEnemies = function(e, f) {
    e = e.owningEnemy;    

    if(e.GetCurrentDamage() > 0) {
        f.TakeHit(e.GetCurrentDamage());
        e.LandHit();
    }

    return false;
};


Collision.OverlapAttackWithObject = function(f, o) {
    if(o.spriteType === 'enemy') {    
        if(frauki.GetCurrentDamage() > 0) {

            if(!o.isAttacking()) {
                Collision.OverlapAttackWithEnemy(f, o);

            } else if(!o.robotic) {
                Collision.OverlapAttackWithEnemy(f, o);

            } else if(!EnemyBehavior.FacingAttack(o)) {
                Collision.OverlapAttackWithEnemy(f, o);
            }
        }

    } else if(o.spriteType === 'junk') {
        o.JunkHit(o);
    } else if(o.spriteType === 'checkpoint') {
        o.Activate();
    } else if(o.spriteType === 'door') {
        o.OpenDoor(frauki);
    } else if(o.spriteType === 'orb') {
        SmashOrb(frauki, o);
    } else if(o.spriteType === 'expToken') {
        SmashExpToken(frauki, o);
    } else if(o.spriteType === 'upgrade') {
        HitUpgrade(frauki, o);
    } else if(o.spriteType === 'gem_sucker') {
        o.Hit();
    }
};

Collision.OverlapAttackWithEnemy = function(f, e, halfDmg) {
    
    if(e.spriteType !== 'enemy' || !e.timers.TimerUp('grace') || !e.Vulnerable() || e.state === e.Dying || e.state === e.Hurting)
        return;

    if(frauki.states.damageRefactory.indexOf(e) > -1) {
        return false;
    }

    if(EnemyBehavior.Player.IsDoorBetween(e) || EnemyBehavior.Player.IsWallBetween(e)) {
        return;
    }

    var damage = frauki.GetCurrentDamage();

    if(halfDmg) damage /= 2;

    e.TakeHit(damage);
    frauki.LandHit(e, damage);

    if(damage > 0) {
        effectsController.ClashStreak(e.body.center.x, e.body.center.y, game.rnd.between(1, 2)); 
        effectsController.SlowHit(300);
        effectsController.SparkSplash(f, e);
    }

    frauki.animations.paused = true;

    game.time.events.add(200, function() {
        frauki.animations.paused = false;
    });

    e.timers.SetTimer('health_view', 4000);
};

Collision.OverlapAttackWithEnemyAttack = function(e, f) {
    if(e.projType !== undefined) return;

    e = e.owningEnemy;
    
    if(!frauki.timers.TimerUp('clash_wait')) {
        return;
    }

    //if both attacks are zero damage, do nothing
    if(e.GetCurrentDamage() <= 0 && frauki.GetCurrentDamage() <= 0)
        return;

    frauki.LandHit(e, 0);
    e.LandHit();

    effectsController.ClashStreak(e.body.center.x, e.body.center.y, game.rnd.between(1, 2));    

    if(e.GetCurrentDamage() === 0 && frauki.GetCurrentDamage() > 0) {
        e.OnBlock();
    }

    var vel = new Phaser.Point(e.body.center.x - frauki.body.center.x, e.body.center.y - frauki.body.center.y);
    vel = vel.normalize();

    vel.setMagnitude(300);

    e.body.velocity.x = vel.x;
    //e.body.velocity.y = vel.y / 2;
    
    events.publish('stop_attack_sounds', {});
    events.publish('play_sound', {name: 'clang'});

    frauki.timers.SetTimer('clash_wait', 800);

    //if frauki has higher priority, the enemy will be stunned
    //otherwise, frauki gets stunned
    // if(frauki.GetCurrentPriority() > e.GetCurrentPriority()) {
    //     e.timers.SetTimer('grace', 0);
    //     e.timers.SetTimer('attack_stun', 800);
    //     frauki.timers.SetTimer('clash_wait', 800);
    //     frauki.timers.SetTimer('grace', 400);
    // } else {
    //     e.timers.SetTimer('attack', 0);
    //     e.timers.SetTimer('grace', 200);
    //     e.timers.SetTimer('attack_wait', 0);
    //     frauki.timers.SetTimer('attack_stun', 800);
    //     frauki.timers.SetTimer('clash_wait', 800);
    // }

    //frauki.timers.SetTimer('grace', 400);
};


Collision.OverlapEnemiesWithSelf = function(o1, o2) {
    return false;
};

Collision.OverlapLobWithEnemy = function(l, e) {
    if(e.spriteType !== 'enemy' || e.state === e.Hurting || !e.Vulnerable() || e.state === e.Dying)
        return false;

    //seperate conditional to prevent crash!
    if(!e.timers.TimerUp('hit'))
        return false;

    if(!!e.currentAttack && e.currentAttack.priority >= 2) {
        var vel = new Phaser.Point(e.body.center.x - l.body.center.x, e.body.center.y - l.body.center.y);
        vel = vel.normalize();

        vel.setMagnitude(300);

        e.body.velocity.x = vel.x;
        e.body.velocity.y = vel.y;

        events.publish('stop_attack_sounds', {});
        events.publish('play_sound', {name: 'clang'});

        l.body.velocity.x *= -1;
        l.body.velocity.y *= -1;

        effectsController.EnergySplash(l.body, 200, 'neutral', 30);

        game.time.events.add(5, function() {
            l.destroy(); 
            l = null;
        });

        return false;
    }

    var damage = 0;

    //fraukis knockback will increase the amount that the enemy is moved
    e.body.velocity.x = 300;
    e.body.velocity.x *= EnemyBehavior.Player.DirMod(e);
    
    e.body.velocity.y = -200;

    e.timers.SetTimer('hit', 800);
    e.timers.SetTimer('grace', 0);

    e.state = e.Hurting;

    e.TakeHit();

    l.body.enable = false;

    effectsController.EnergySplash(l.body, 200, 'neutral', 30);

    game.time.events.add(5, function() {
        l.destroy(); 
        l = null;
    });

    events.publish('play_sound', { name: 'attack_connect' });

    return false;
};

Collision.OverlapObjectsWithEnvironment = function(o, e) {
    if(o.spriteType === 'shard') {
        return false;
    } else if(o.spriteType === 'enemy') {
        return Collision.CollideEnemyWithEnvironment(o, e);
    } else if(o.spriteType === 'upgrade') {
        return false;
    }

    return true;
};

Collision.CollideEnemyWithEnvironment = function(e, t) {
    if(t.index === 3) {
        return false;
    } else if(t.index === 7) {
        return true;
    } else if(t.index === 17) {
        e.onLeftSlope = true;

        if(e.body.center.x <= t.right + 2 && e.body.center.x >= t.left - 2) {
            if(e.body.velocity.y > 0) {
                var offset = (t.right - Math.round(e.body.center.x));
                if(offset > 16) offset = 16;
                if(offset < 0) offset = 0;

                e.body.y = t.worldY - e.body.height + offset;
                e.body.blocked.down = true;
                e.body.velocity.y = 0;
                //e.body.velocity.x /= 1.25;
            }
        }

        return false;

    //right slope
    } else if(t.index === 18) {
        e.onRightSlope = true;

        if(e.body.center.x <= t.right + 2 && e.body.center.x >= t.left - 2) {
            if(e.body.velocity.y > 0) {
                var offset = 16 - (t.right - Math.round(e.body.center.x));
                if(offset > 16) offset = 16;
                if(offset < 0) offset = 0;

                e.body.y = t.worldY - e.body.height + offset;
                e.body.blocked.down = true;
                e.body.velocity.y = 0;
                //e.body.velocity.x /= 1.25;
            }
        }

        return false;        
    }

    return true;
};


Collision.CollideEffectWithWorld = function(e, w) {

    if(e.parent.effectType === 'drip') {
        effectsController.DripSplash(e);
        e.kill();
        return true;
    }
    else if(e.parent.effectType === 'dripDirty') {
        effectsController.DripDirtySplash(e);
        e.kill();
        return true;
    }

    return false;
};

Collision.OverlapEffectWithWorld = function(e, w) {

    if(w.index === 10 || w.index === 19) {
        if(e.parent.effectType === 'drip') {
            effectsController.DripSplash(e, true);
            e.kill();
        }
        else if(e.parent.effectType === 'dripDirty') {
            effectsController.DripDirtySplash(e, true);
            e.kill();
        }
    }

    return true;
};

Collision.CollideProjectileWithWorld = function(p, t) {
    if(p.projType === 'bolt' && t.index === 1) {
        p.pendingDestroy = true;
        effectsController.Explosion(p);
		events.publish('play_sound', {name: 'explosion', restart: true});
        
    } else if((p.projType === 'mortar' || p.projType === 'detonator') && [1, 4, 5, 8, 17, 18].includes(t.index)) {
        p.pendingDestroy = true;
        events.publish('camera_shake', {magnitudeX: 3, magnitudeY: 1, duration: 200});

        if(p.body.onFloor()) {
            projectileController.MortarExplosion(p.owningEnemy, p.x, p.y, 'floor');
        }
        else {
            projectileController.MortarExplosion(p.owningEnemy, p.x, p.y, 'air');
        }

    } else if(p.projType === 'bolas' && !p.attached) {
        p.pendingDestroy = true;
        p.owningEnemy.waitingForBolas = false;
		events.publish('stop_sound', {name: 'SW8T_bolas_fly'});
        
    } else if(p.projType === 'tar') {
        p.pendingDestroy = true;
        projectileController.MortarExplosion(p.owningEnemy, p.x, p.y);
    }

    if(t.index === 1) {
        return true;
    } else {
        return false;
    }
};

Collision.CollideBatonWithWorld = function(b, t) {
    if(t.index === 1) {
        return true;
    }
};