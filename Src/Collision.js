var Collision = {};

Collision.OverlapFraukiWithObject = function(f, o) {
    if(o.spriteType == 'apple') {

        EatApple(f, o);
        return false;


    } else if(o.spriteType === 'energyNugg') {

        EatEnergyNugg(f, o);
        return false;


    } else if(o.spriteType === 'enemy') {
        return false;

    } else if(o.spriteType === 'door') {
        OpenDoor(f, o);
        return true;


    } else if(o.spriteType === 'junk') {
        return false;


    } else if(o.spriteType === 'TechnoRune') {
        return false;


    } else if(o.spriteType === 'ball') {
        if(frauki.state !== frauki.Rolling) {
            if(frauki.body.velocity.y > 0 && frauki.body.y + frauki.body.height >= o.body.y - 1) {
                //frauki.body.velocity.y = -frauki.body.velocity.y;

                if(frauki.body.velocity.x !== 0) {
                    o.body.velocity.x = frauki.body.velocity.x + game.rnd.between(-100, 100);
                    o.body.angularVelocity = o.body.velocity.x;
                }

                frauki.body.blocked.down = true;

            } else if(frauki.body.center.x > o.body.center.x) {
                o.body.angularVelocity = -200;
            } else {
                o.body.angularVelocity = 200;
            }

            return true;
        } else {
            return false;
        }


    } else if(o.spriteType === 'checkpoint') {
        return false;

    } else if(o.spriteType === 'bigNugg') {
        effectsController.SpawnEnergyNuggets(a.body, frauki.body, 'positive', o.energyAmount);
        o.destroy();
        return false;
    } 

    return true;
};

Collision.OverlapAttackWithObject = function(f, o) {
    if(o.spriteType === 'enemy') {
        Collision.OverlapAttackWithEnemy(f, o);
    } else if(o.spriteType === 'junk') {

        o.JunkHit(o);
    } else if(o.spriteType === 'ball') {
        var vel = new Phaser.Point(o.body.center.x - frauki.body.center.x, o.body.center.y - frauki.body.center.y);
        vel = vel.normalize();

        vel.setMagnitude(800);

        o.body.velocity.x = vel.x + frauki.body.velocity.x;
        o.body.velocity.y = vel.y - 200 + frauki.body.velocity.y;

        if(frauki.body.center.x > o.body.center.x) {
            o.body.angularVelocity = -800;
        } else {
            o.body.angularVelocity = 800;
        }
    } else if(o.spriteType === 'checkpoint') {
        o.CheckpointHit();
    } else if(o.spriteType === 'TechnoRune') {
        EatTechnoRune(f, o);
    } else if(o.spriteType === 'door') {
        OpenDoor(frauki, o);
    }
};

Collision.OverlapAttackWithEnemy = function(f, e) {

    if(e.spriteType !== 'enemy' || !e.Vulnerable() || e.state === e.Dying)
        return;

    //seperate conditional to prevent crash!
    if(!e.timers.TimerUp('grace'))
        return;

    var damage = frauki.GetCurrentDamage();

    //if frauki is blocking
    if(damage <= 0){
        if(e.CanCauseDamage()) {
            energyController.RemoveEnergy(e.damage * 3);
        } else {
            return;
        }

    }

    e.body.velocity.x = (250 * frauki.GetCurrentKnockback()) + 200;
    e.body.velocity.x *= e.PlayerDirMod();
    
    e.body.velocity.y = (frauki.GetCurrentJuggle() * -200) - 200;
    //if(e.robotic) e.body.velocity.y /= 2;

    e.timers.SetTimer('hit', e.baseStunDuration + (250 * damage));
    e.timers.SetTimer('grace', e.baseStunDuration + (250 * damage));

    e.poise -= damage;
    e.state = e.Hurting;

    e.energy -= damage;

    console.log('Enemy taking ' + damage + ', at ' + e.energy + '/' + e.maxEnergy);

    if(e.energy <= 0) {

        e.timers.SetTimer('hit', 1000);
        e.timers.SetTimer('grace', 300);

        //e.body.velocity.x *= 1.2;
        //e.body.velocity.y *= 1.2;

        setTimeout(DestroyEnemy, e.robotic ? 800 : game.rnd.between(250, 350), e);

        if(e.robotic) events.publish('play_sound', { name: 'robosplosion' });

        if(!!e.carriedShard) {
            DropShard(e.carriedShard);
        }

    } else {
        e.TakeHit();
    }

    effectsController.SpawnEnergyNuggets(e.body, frauki.body, 'positive', damage * 3);
    
    if(damage > 0) {
        events.publish('play_sound', { name: 'attack_connect' });
        effectsController.EnergySplash(e.body, 100, 'negative', 15, e.body.velocity);
    } else {
        events.publish('play_sound', { name: 'clang' });
    }

    frauki.LandHit(e, damage);
};

Collision.OverlapAttackWithEnemyAttack = function(e, f) {

    //if both attacks are zero damage, do nothing
    if(e.owningEnemy.currentAttack.damage <= 0 && frauki.GetCurrentDamage() <= 0)
        return;

    console.log('Frauki: ' + frauki.GetCurrentPriority(), 'Enemy:' + e.owningEnemy.currentAttack.priority);

    //if fraukis attack has priority over the enemies attack, they cant block it
    if(frauki.GetCurrentPriority() > e.owningEnemy.currentAttack.priority) {
        console.log('Frauki broke through enemy attack');
        game.physics.arcade.overlap(frauki.attackRect, e.owningEnemy, Collision.OverlapAttackWithEnemy);
        return;
    } else if(frauki.GetCurrentPriority() < e.owningEnemy.currentAttack.priority && e.owningEnemy.currentAttack.damage > 0) {
        console.log('Enemy broke through Frauki attack');
        frauki.Interrupt();
        game.physics.arcade.overlap(e, frauki, Collision.OverlapEnemyAttackWithFrauki);
        return;
    }

    effectsController.SparkSplash(frauki.attackRect, e);

    e = e.owningEnemy;

    frauki.LandHit(e, 0);

    var vel = new Phaser.Point(e.body.center.x - frauki.body.center.x, e.body.center.y - frauki.body.center.y);
    vel = vel.normalize();

    vel.setMagnitude(400);

    e.body.velocity.x = vel.x;
    e.body.velocity.y = vel.y / 2;

    events.publish('stop_attack_sounds', {});
    events.publish('play_sound', {name: 'clang'});

    e.timers.SetTimer('grace', 400);
    frauki.timers.SetTimer('frauki_hit', 300);

    energyController.RemoveEnergy(e.currentAttack.damage * 3);

    if(!!e.Block) e.Block();
};

Collision.OverlapEnemyAttackWithFrauki = function(e, f) {

    if(!!e.owningEnemy && e.owningEnemy.currentAttack.damage > 0) {
        frauki.Hit(e.owningEnemy, e.owningEnemy.currentAttack.damage, 1000);
        e.owningEnemy.LandHit();
    }
};

Collision.OverlapObjectsWithSelf = function(o1, o2) {
    if(o1.spriteType === 'enemy' && o2.spriteType === 'enemy' && o1.robotic === o2.robotic) {
        return true;
    } else if(o1.spriteType === 'junk' && o2.spriteType === 'junk') {
        return true;
    } else if(o1.spriteType === 'ball' && o2.spriteType === 'junk') {
        if(o1.body.velocity.getMagnitude() > 200) {
            o2.JunkHit(o2);
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
};

Collision.OverlapLobWithEnemy = function(l, e) {
    if(e.spriteType !== 'enemy' || e.state === e.Hurting || !e.Vulnerable() || e.state === e.Dying)
        return false;

    //seperate conditional to prevent crash!
    if(!e.timers.TimerUp('hit'))
        return false;

    if(!!e.currentAttack && e.currentAttack.priority >= 2) {
        //effectsController.SparkSplash(l, e);

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

        setTimeout(function() {
            l.destroy(); 
            l = null;
        }, 5);

        return false;
    }

    var damage = 0;

    //fraukis knockback will increase the amount that the enemy is moved
    e.body.velocity.x = 300;
    e.body.velocity.x *= e.PlayerDirMod();
    
    e.body.velocity.y = -200;

    e.timers.SetTimer('hit', 800);
    e.timers.SetTimer('grace', 0);

    e.state = e.Hurting;

    e.TakeHit();

    l.body.enable = false;

    effectsController.EnergySplash(l.body, 200, 'neutral', 30);

    setTimeout(function() {
        l.destroy(); 
        l = null;
    }, 5);

    events.publish('play_sound', { name: 'attack_connect' });

    return false;
};

Collision.OverlapObjectsWithEnvironment = function(o, e) {
    if(o.spriteType === 'shard') {
        //return false;
    }

    return true;
};

Collision.CollideFraukiWithProjectile = function(f, p) {

    if(p.projType === 'tar' || p.projType === 'spore') {
        if(p.owningEnemy.state !== p.owningEnemy.Dying) {
            frauki.Hit(p.owningEnemy, p.owningEnemy.damage);
        }
        
        p.destroy();
    }
};

Collision.CollideFraukiWithEnvironment = function(f, tile) {
    //13 - 16

    //solid tile
    if(tile.index === 1 || tile.index === 8 || tile.index === 9) { 
        return true;

    //water
    } else if(tile.index === 2 || tile.index === 10 || tile.index === 13 || tile.index === 14 || tile.index === 15 || tile.index === 16) { 
        frauki.states.inWater = true;

        if(tile.index === 10) effectsController.Splash(tile);

        if(tile.index === 13) frauki.states.flowDown = true;
        if(tile.index === 14) frauki.states.flowRight = true;
        if(tile.index === 15) frauki.states.flowUp = true;
        if(tile.index === 16) frauki.states.flowLeft = true;

        
        return false;

    //trick wall
    } else if(tile.index === 3) {
        if(frauki.state === frauki.Rolling || frauki.InAttackAnim()) {
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

        return true;

    } else if(tile.index === 7) {

        if(tile.dislodged === true) {
            return false;
        }

        return true;

    //updraft
    } else if(tile.index === 11) {
        frauki.states.inUpdraft = true;

    //spikes
    } else if(tile.index === 12) {

    //left slope
    } else if(tile.index === 17) {
        frauki.states.onLeftSlope = true;

    //right slope
    } else if(tile.index === 18) {
        frauki.states.onRightSlope = true;
    }
};

Collision.CollideEffectWithWorld = function(e, w) {

    if(e.parent.effectType === 'drip') {
        effectsController.DripSplash(e);
        e.kill();
        return true;
    }

    return false;
};

Collision.OverlapEffectWithWorld = function(e, w) {

    if(w.index === 10) {
        if(e.parent.effectType === 'drip') {
            effectsController.DripSplash(e);
            e.kill();
        }
    }
    

    return true;
};

Collision.OverlapFraukiWithShard = function(f, s) {
    if(!s.owner) {
        PickUpShard(f, s);
    }
    
    return false;
};

Collision.OverlapShardWithObject = function(s, o) {
    if(o.spriteType === 'door') {
        OpenDoor(frauki, o);
    }
};