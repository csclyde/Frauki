var Collision = {};

Collision.OverlapFraukiWithObject = function(f, o) {

    if(o.spriteType == 'apple') {

        EatApple(f, o);
        return false;


    } else if(o.spriteType === 'energyNugg') {

        EatEnergyNugg(f, o);
        return false;


    } else if(o.spriteType === 'enemy') {
        if(o.CanCauseDamage() || 
            frauki.state === frauki.Rolling ||
            frauki.state === frauki.Falling ||
            frauki.state === frauki.Flipping ||
            (frauki.Attacking() && frauki.GetCurrentDamage() > 0)) {
            return false;
        } else {

            if(frauki.body.y + frauki.body.height <= o.body.y + (frauki.body.height / 3) || o.body.y + o.body.height <= frauki.body.y + (o.body.height / 3)) {
                return false;
            } else {
                return true;
            }
        }

    } else if(o.spriteType === 'door') {
        OpenDoor(f, o);

        if((o.state === o.Open || o.state === o.Opening) && frauki.state === frauki.Rolling && o.canRollUnder === true) {
            return false;
        } else {
            return true;
        }

    } else if(o.spriteType === 'orb') {
        return false;

    } else if(o.spriteType === 'junk') {

        if(frauki.state === frauki.Rolling) {
            o.JunkHit(o);
        }

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

    } else if(o.spriteType === 'AltarBank') {
        
        return false;
    } 

    return true;
};

Collision.OverlapAttackWithObject = function(f, o) {
    if(o.spriteType === 'enemy') {

        if(frauki.GetCurrentDamage() > 0) {

            if(!o.Attacking()) {
                Collision.OverlapAttackWithEnemy(f, o);

            } else if(!o.robotic) {
                Collision.OverlapAttackWithEnemy(f, o);

            } else if(!EnemyBehavior.FacingAttack(o)) {
                Collision.OverlapAttackWithEnemy(f, o);

            } else if(o.Attacking() && frauki.GetCurrentPriority() > o.GetCurrentPriority()) {
                o.timers.SetTimer('grace', 0);
                events.publish('play_sound', {name: 'clang'});
                Collision.OverlapAttackWithEnemy(f, o, true);
            }
            //they can be hit if theyre not attacking, or they are attacking
            //but facing away from the player
            // if(!o.Attacking() || !EnemyBehavior.FacingPlayer(o) || !o.robotic) {
            // }
        }

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
    } else if(o.spriteType === 'orb') {
        SmashOrb(frauki, o);
    } else if(o.spriteType === 'AltarBank') {
        HitAltarBank(frauki, o);
    }
};

Collision.OverlapAttackWithEnemy = function(f, e, halfDmg) {

    if(e.spriteType !== 'enemy' || !e.timers.TimerUp('grace') || !e.Vulnerable() || e.state === e.Dying || e.state === e.Hurting)
        return;

    var damage = frauki.GetCurrentDamage();

    if(halfDmg) damage /= 2;

    e.TakeHit(damage);
    frauki.LandHit(e, damage);

    e.timers.SetTimer('health_view', 4000);

};

Collision.OverlapAttackWithEnemyAttack = function(e, f) {
    e = e.owningEnemy;

    if(!e.timers.TimerUp('grace')) {
        return;
    }

    //if both attacks are zero damage, do nothing
    if(e.GetCurrentDamage() <= 0 && frauki.GetCurrentDamage() <= 0)
        return;

    //if theyre blocking with a shield then remove energy
    if(frauki.states.shielded) {
        energyController.RemoveCharge(1);
        energyController.RemoveEnergy(e.GetCurrentDamage() * 2);

        if(energyController.GetEnergy() <= 0) {
            events.publish('activate_weapon', { activate: false });
            //play stun sound
            frauki.Stun(e);

            effectsController.ShatterShield();
            events.publish('play_sound', {name: 'crystal_door', restart: true });
        }

    } 

    frauki.LandHit(e, 0);
    e.LandHit();
    e.timers.SetTimer('attack', 0);

    var vel = new Phaser.Point(e.body.center.x - frauki.body.center.x, e.body.center.y - frauki.body.center.y);
    vel = vel.normalize();

    vel.setMagnitude(200);

    e.body.velocity.x = vel.x;
    //e.body.velocity.y = vel.y / 2;
    
    events.publish('stop_attack_sounds', {});
    events.publish('play_sound', {name: 'clang'});

    e.timers.SetTimer('grace', 400);
    e.timers.SetTimer('attack_wait', 0);
    frauki.timers.SetTimer('attack_stun', 1000);
    //frauki.timers.SetTimer('frauki_grace', 400);
};

Collision.OverlapEnemyAttackWithFrauki = function(e, f) {
    if(frauki.states.shielded) {
        Collision.OverlapAttackWithEnemyAttack(e, f);
        return;
    }

    e = e.owningEnemy;

    if(e.GetCurrentDamage() > 0 && !frauki.Grace()) {
        frauki.Hit(e, e.GetCurrentDamage(), 1000);
        e.LandHit();
    }
};

Collision.OverlapObjectsWithSelf = function(o1, o2) {
    if(o1.spriteType === 'enemy' && o2.spriteType === 'enemy' && o1.robotic === o2.robotic) {
        return true;
    } else if(o1.spriteType === 'junk' && o2.spriteType === 'junk') {
        return false;
    } else if(o1.spriteType === 'ball' && o2.spriteType === 'junk') {
        if(o1.body.velocity.getMagnitude() > 200) {
            o2.JunkHit(o2);
            return true;
        } else {
            return false;
        }
    } else if(o1.spriteType === 'enemy' && o2.spriteType === 'door') {
        return true;
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
        //return false;
    }

    return true;
};

Collision.CollideFraukiWithProjectile = function(f, p) {

    if(p.projType === 'tar' || p.projType === 'spore') {
        if(p.owningEnemy.state !== p.owningEnemy.Dying) {
            if(frauki.Attacking() || frauki.states.shielded) {
                Collision.OverlapAttackWithEnemyAttack(p, f);
            } else {
                frauki.Hit(p.owningEnemy, p.owningEnemy.damage);
            }
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

        if(frauki.body.y + frauki.body.height > (tile.y * 16) + 1 && frauki.body.y + frauki.body.height <= tile.bottom * 16) {

            if(frauki.body.velocity.y > 0) {
                var offset = (tile.right - frauki.body.center.x);
                if(offset > 16) offset = 16;
                if(offset < 0) offset = 0;

                frauki.body.y = (tile.y * 16) - frauki.body.height + offset;
                frauki.body.blocked.down = true;
                frauki.body.velocity.y = 0;
                //frauki.body.velocity.x /= 1.25;
            }
        }

    //right slope
    } else if(tile.index === 18) {
        frauki.states.onRightSlope = true;

        if(frauki.body.y + frauki.body.height > (tile.y * 16) + 1 && frauki.body.y + frauki.body.height <= tile.bottom * 16) {

            if(frauki.body.velocity.y > 0) {
                var offset = 16 - (tile.right - frauki.body.center.x);
                if(offset > 16) offset = 16;
                if(offset < 0) offset = 0;

                frauki.body.y = (tile.y * 16) - frauki.body.height + offset;
                frauki.body.blocked.down = true;
                frauki.body.velocity.y = 0;
                //frauki.body.velocity.x /= 1.25;
            }
        }
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
            effectsController.DripSplash(e, true);
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
