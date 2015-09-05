var Collision = {};

Collision.OverlapFraukiWithObject = function(f, o) {
    if(o.spriteType == 'apple') {

        EatApple(f, o);
        return false;

    } else if(o.spriteType === 'energyNugg') {

        EatEnergyNugg(f, o);
        return false;

    } else if(o.spriteType === 'enemy') {

        if(o.CanCauseDamage() && o.state !== o.Dying) {
            frauki.Hit(o, o.damage);
        }

        return false;
    } else if(o.spriteType === 'door') {

        OpenDoor(f, o);

        return true;
    } else if(o.spriteType === 'junk') {
        return false;
    } else if(o.spriteType === 'TechnoRune') {
        effectsController.EnergySplash(o.body, 100, 'positive');
        frauki.upgrades.attackStab = true;
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
    }
};

Collision.OverlapAttackWithEnemy = function(f, e) {

    if(e.spriteType !== 'enemy' || e.state === e.Hurting || !e.Vulnerable() || e.state === e.Dying)
        return;

    //seperate conditional to prevent crash!
    if(!e.timers.TimerUp('hit'))
        return;

    var damage = frauki.GetCurrentDamage();

    //fraukis knockback will increase the amount that the enemy is moved. The weight
    //of the enemy will work against that. 
    e.body.velocity.x = (600 * frauki.GetCurrentKnockback()) - (600 * e.weight);
    if(e.body.velocity.x < 50) e.body.velocity.x = 50;
    e.body.velocity.x *= e.PlayerDirMod();
    
    e.body.velocity.y = -200 + (frauki.GetCurrentJuggle() * -200);

    e.timers.SetTimer('hit', e.baseStunDuration + (100 * damage));

    e.poise -= damage;
    e.state = e.Hurting;

    e.energy -= damage;

    console.log('Enemy is taking ' + damage + ', now at ' + e.energy + '/' + e.maxEnergy, 'x: ' + e.body.velocity.x, 'y: ' + e.body.velocity.y);

    if(e.energy <= 0) {

        e.timers.SetTimer('hit', 1000);

        e.body.velocity.x *= 1.2;
        e.body.velocity.y *= 1.2;

        setTimeout(function() {
            e.Die();
            e.state = e.Dying;

            effectsController.EnergySplash(e.body.center, 200, 'negative', 20);
            effectsController.Explosion(e.body.center);
            effectsController.DiceEnemy(e, e.body.center.x, e.body.center.y);

            damage = e.maxEnergy;

            //energyController.AddPower(e.maxEnergy / 2);
            effectsController.SpawnEnergyNuggets(e.body.center, frauki.body.center, 'positive', e.EnemyDirection(), e.maxEnergy / 2); 
            //effectsController.MakeHearts(e.maxEnergy / 4);

            e.destroy();
        }, e.robotic ? 800 : game.rnd.between(250, 350));

        if(e.robotic) events.publish('play_sound', { name: 'robosplosion' });

    } else {
        e.TakeHit();
    }

    events.publish('play_sound', { name: 'attack_connect' });
    effectsController.EnergySplash(e.body.center, 100, 'negative', 15, e.body.velocity);

    frauki.LandHit(e, damage);
};

Collision.OverlapAttackWithEnemyAttack = function(e, f) {

    console.log(frauki.GetCurrentPriority(), e.owningEnemy.currentAttack.priority);

    //if fraukis attack has priority over the enemies attack, they cant block it
    if(frauki.GetCurrentPriority() > e.owningEnemy.currentAttack.priority) {
        game.physics.arcade.overlap(frauki.attackRect, e.owningEnemy, Collision.OverlapAttackWithEnemy);
        return;
    }

    effectsController.SparkSplash(frauki.attackRect, e);

    e = e.owningEnemy;

    frauki.LandHit(e, 0);

    var vel = new Phaser.Point(e.body.center.x - frauki.body.center.x, e.body.center.y - frauki.body.center.y);
    vel = vel.normalize();

    vel.setMagnitude(300);

    e.body.velocity.x = vel.x;
    e.body.velocity.y = vel.y;

    events.publish('stop_attack_sounds', {});
    events.publish('play_sound', {name: 'clang'});

    e.timers.SetTimer('hit', 400);
    frauki.timers.SetTimer('frauki_hit', 300);
};

Collision.OverlapAttackWithEnvironment = function(a, t) {
    effectsController.AttackReflection();
};

Collision.OverlapEnemyAttackWithFrauki = function(e, f) {

    if(e.owningEnemy.currentAttack.damage > 0) {
        frauki.Hit(e.owningEnemy, e.owningEnemy.currentAttack.damage, 650);
    }

};

Collision.OverlapObjectsWithSelf = function(o1, o2) {
    if(o1.spriteType === 'enemy' && o2.spriteType === 'enemy') {
        return true;
    } else if(o1.spriteType === 'junk' && o2.spriteType === 'junk') {
        return true;
    } else {
        return false;
    }
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
    if(tile.index === 1 || tile.index === 9) { 
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
    if(e.effectType === 'drip') {
        effectsController.DripSplash(e);
        e.kill();
        return true;
    }

    return false;
};
