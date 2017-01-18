var Main = new Phaser.State();

Main.create = function() {

    Frogland.SpawnFrauki();

    this.restarting = true;

    this.physicsSlowMo = 1;
    this.currentAlpha = 1;

    cameraController.camX = frauki.x + 41;
    cameraController.camY = frauki.y + 111;
    
    var fadeIn = effectsController.Fade(false);
    Frogland.SpawnFrauki();

    fadeIn.onComplete.add(function() {
        frauki.state = frauki.Materializing;
        frauki.alpha = 1;
        Main.restarting = false;

        if(game.input.keyboard.isDown(inputController.binds.runLeft) || game.input.gamepad.isDown(14)) {
            inputController.OnLeft(true);
        }

        if(game.input.keyboard.isDown(inputController.binds.runRight) || game.input.gamepad.isDown(15)) {
            inputController.OnRight(true);
        }
    });

    this.UITextures = {};
    // this.UITextures.EnergyBar0000 = PIXI.TextureCache[game.cache.getFrameByName('UI', 'EnergyBar0000').uuid];
    // this.UITextures.EnergyBar0001 = PIXI.TextureCache[game.cache.getFrameByName('UI', 'EnergyBar0001').uuid];
    // this.UITextures.EnergyBar0002 = PIXI.TextureCache[game.cache.getFrameByName('UI', 'EnergyBar0002').uuid];
    // this.UITextures.EnergyBar0005 = PIXI.TextureCache[game.cache.getFrameByName('UI', 'EnergyBar0005').uuid];
    // this.UITextures.EnergyBar0006 = PIXI.TextureCache[game.cache.getFrameByName('UI', 'EnergyBar0006').uuid];

    audioController.ambient['surface_wind'].play();
};

Main.update = function() {

    frauki.UpdateAttackGeometry();
    objectController.Update();
    
    Frogland.Update();

    audioController.Update();
    cameraController.Update();
    inputController.Update();
    effectsController.Update();
    energyController.Update();
    projectileController.Update();
    weaponController.Update();
    speechController.Update();
    triggerController.Update(Frogland.currentLayer);
    backdropController.Update();
};

Main.render = function() {
    // game.debug.body(frauki);
    // game.debug.body(frauki.attackRect);

    // Frogland.objectGroup_3.forEach(function(o) {
    //     game.debug.body(o);
    //     if(!!o.attackRect) game.debug.body(o.attackRect);
    // });

    // Frogland.door1Group.forEach(function(o) {
    //     game.debug.body(o);
    // });

    /*projectileController.projectiles.forEach(function(o) {
        game.debug.body(o);
    });*/

    // var rekt = triggerController.triggerLayers['Triggers_3'][0];
    // game.debug.geom(new Phaser.Rectangle(rekt.x, rekt.y, rekt.width, rekt.height));

    // effectsController.loadedEffects.forEach(function(o) {
    //     game.debug.geom(new Phaser.Rectangle(o.x, o.y, o.width, o.height));
    // });

    // if(!!weaponController.Lob.lobbies) {
    //     weaponController.Lob.lobbies.forEach(function(o) {
    //         if(!!o.body) {
    //             game.debug.geom(new Phaser.Rectangle(o.body.x, o.body.y, o.body.width, o.body.height));
    //         }
    //     });  
    // }

    // if(!!weaponController.GetAttackGeometry()) {
    //     game.debug.geom(new Phaser.Rectangle(weaponController.GetAttackGeometry().x, weaponController.GetAttackGeometry().y, weaponController.GetAttackGeometry().w, weaponController.GetAttackGeometry().h));
    // }

    pixel.context.drawImage(
        game.canvas, 0, 0, game.width, game.height, 
        0,
        0,
        game.width * pixel.scale, 
        game.height * pixel.scale
    );

    this.DrawUI();
};

Main.Restart = function() {
    if(this.restarting === true) {
        return;
    }

    events.publish('stop_all_music'); 
    events.publish('stop_all_ambient'); 
    events.publish('play_music', { name: 'Gameover' } );
    audioController.timers.SetTimer('music_reset', 0); 

    speechController.HideSpeech();

    this.restarting = true;
    game.time.slowMotion = 5;
    var fadeOutTween = effectsController.Fade(true);

    inputController.OnLeft(false);
    inputController.OnRight(false);
    inputController.OnUp(false);
    inputController.OnDown(false);

    cameraController.shakeMagnitudeX = 0;
    cameraController.shakeMagnitudeY = 0;
    if(cameraController.shakeXTween) cameraController.shakeXTween.stop();
    if(cameraController.shakeYTween) cameraController.shakeYTween.stop();

    fadeOutTween.onComplete.add(function() {
        PrepareShardsForDeath();
        GameData.SaveShardPositions();

        weaponController.Baton.ResetBaton();

        game.time.events.add(300, function() {
            frauki.Reset(); 
        });

        energyController.Reset();
        game.time.slowMotion = 1;
        effectsController.Fade(false);

        Main.restarting = false;

        
        Frogland.objectGroup_4.removeAll(true);
        Frogland.objectGroup_3.removeAll(true);
        Frogland.objectGroup_2.removeAll(true);

        objectController.CreateObjectsLayer(4);
        objectController.CreateObjectsLayer(3);
        objectController.CreateObjectsLayer(2);

        effectsController.dicedPieces4 = game.add.group(Frogland.objectGroup_4);
        effectsController.dicedPieces3 = game.add.group(Frogland.objectGroup_3);
        effectsController.dicedPieces2 = game.add.group(Frogland.objectGroup_2);

        GameData.ResetNuggCount();

        triggerController.triggerLayers['Triggers_4'].forEach(function(trig) {
            trig.enterFired = false;
            trig.stayFired = false;
            trig.exitFired = false;
        });

        triggerController.triggerLayers['Triggers_3'].forEach(function(trig) {
            trig.enterFired = false;
            trig.stayFired = false;
            trig.exitFired = false;
        });

        triggerController.triggerLayers['Triggers_3'].forEach(function(trig) {
            trig.enterFired = false;
            trig.stayFired = false;
            trig.exitFired = false;
        });

        objectController.CompileObjectList();

        projectileController.DestroyAllProjectiles();

        Frogland.ResetFallenTiles();

        Frogland.SpawnFrauki();

        //game.state.start('Upgrading', false, false);

    });
};

Main.DrawUI = function() {
    
    this.RenderTextureFromAtlas('UI', 'HudFrame0000', 10, 10);

    for(var i = 0, len = energyController.GetMaxHealth(); i < len; i++) {
        this.RenderTextureFromAtlas('UI', 'HudFrame0003', 14 + (i * 7), 13);
        this.RenderTextureFromAtlas('UI', 'HudFrame0001', 14 + (i * 7), 10);
    }

    this.RenderTextureFromAtlas('UI', 'HudFrame0002', 14 + (energyController.GetMaxHealth() * 7), 10);

    //health pips
    for(var i = 0, len = energyController.GetHealth(); i < len; i++) {
        var pipFrame = '';
        var quarter = energyController.GetMaxHealth() / 4;

        if(i < quarter) {
            pipFrame = 'HealthPips0000';
        } else if(i < quarter * 2) {
            pipFrame = 'HealthPips0001';
        } else if(i < quarter * 3) {
            pipFrame = 'HealthPips0002';
        } else {
            pipFrame = 'HealthPips0003';
        } 
        
        this.RenderTextureFromAtlas('UI', pipFrame, 14 + (7 * i), 13);
    }

    if(weaponController.GetNumWeapons() > 0) {
        this.RenderTextureFromAtlas('UI', 'HudFrame0000', 10, 22);

        for(var i = 0, len = energyController.GetMaxCharge(); i < len; i++) {
            this.RenderTextureFromAtlas('UI', 'HudFrame0003', 14 + (i * 7), 25);
            this.RenderTextureFromAtlas('UI', 'HudFrame0001', 14 + (i * 7), 22);
        }


        this.RenderTextureFromAtlas('UI', 'HudFrame0002', 14 + (energyController.GetMaxCharge() * 7), 22);

        for(var i = 0, len = energyController.GetCharge(); i < len; i++) {
            var pipFrame = '';

            if(i < 1) {
                pipFrame = 'EnergyPips0000';
            } else if(i < 2) {
                pipFrame = 'EnergyPips0001';
            } else if(i < 3) {
                pipFrame = 'EnergyPips0002';
            } else {
                pipFrame = 'EnergyPips0003';
            } 
            
            this.RenderTextureFromAtlas('UI', pipFrame, 14 + (7 * i), 25);
        }
        
    }

    // for(var i = 0, len = energyController.GetCharge(); i < len; i++) {
    //     var pipFrame = '';

    //     if(i < 3) {
    //         pipFrame = 'ChargePips0000';
    //     } else if(i < 6) {
    //         pipFrame = 'ChargePips0001';
    //     } else if(i < 9) {
    //         pipFrame = 'ChargePips0002';
    //     } else {
    //         pipFrame = 'ChargePips0003';
    //     }

    //     this.RenderTextureFromAtlas('UI', pipFrame, 15 + (5 * i), 24);
    // }
   

    for(var i = 0; i < energyController.GetApples(); i++) {
        //if this is the last apple in the stable and they are healing
        if(i === energyController.GetApples() - 1 && frauki.state === frauki.Healing) {
            //drain the graphic
            if(game.time.now - frauki.timers.Timestamp('heal_charge') < 200) {
                this.RenderTextureFromAtlas('Misc','Apple0002', 10 + (20 * i), 35); 
            } else if(game.time.now - frauki.timers.Timestamp('heal_charge') < 400) {
                this.RenderTextureFromAtlas('Misc','Apple0003', 10 + (20 * i), 35); 
            } else if(game.time.now - frauki.timers.Timestamp('heal_charge') < 600) {
                this.RenderTextureFromAtlas('Misc','Apple0004', 10 + (20 * i), 35); 
            } else if(game.time.now - frauki.timers.Timestamp('heal_charge') < 800) {
                this.RenderTextureFromAtlas('Misc','Apple0005', 10 + (20 * i), 35); 
            } else {
                this.RenderTextureFromAtlas('Misc','Apple0006', 10 + (20 * i), 35); 
            }
        
        //otherwise, just draw the full apple
        } else {
            this.RenderTextureFromAtlas('Misc','Apple0000', 10 + (20 * i), 35); 
            
        }    
    }

    // for(var i = 0; i < weaponController.weaponList.length; i++) {
    //     pixel.context.globalAlpha = weaponController.currentWeapon === weaponController.weaponList[i] ? 1 : 0.3;
    //     this.RenderTextureFromAtlas('UI', weaponController.weaponList[i].FrameName, (102 + 25 * i), 10);
    // }

    this.RenderTextureFromAtlas('UI', 'NuggCounterBack0000', 562, 7, 1, 1, 0.8);

    this.RenderTextureFromAtlas('Misc', 'EnergyBitNeutral0000', 565, 10);

    //render the nugg amount, character by character
    var nuggCountString = GameData.GetNuggCount().toString();

    for(var i = 0, len = nuggCountString.length; i < len; i++) {
        var charNum = nuggCountString[i];

        this.RenderTextureFromAtlas('UI', 'Numbers000' + nuggCountString[i], 580 + (i * 10), 10);

    }


    pixel.context.globalAlpha = this.currentAlpha;


    //draw an arrow pointing towards the shard
    if(GetCurrentShardType() === 'None') {

        Frogland.shardGroup.forEach(function(s) {
            if(s.pickedUp && !s.returnedToChurch) {
                var diff = new Phaser.Point(s.body.center.x - frauki.body.center.x, s.body.center.y - frauki.body.center.y);

                var dist = diff.getMagnitude();

                diff = diff.normalize();

                //diff.setMagnitude(90);
                if(dist > 900) {
                    diff.setMagnitude(90);
                } else if(dist < 150) {
                    diff.setMagnitude(15);
                } else {
                    diff.setMagnitude(dist / 10);
                }

                var opacity = 1;

                if(s.currentLayer !== Frogland.currentLayer) {
                    opacity = 0.5;
                }

                var shardIndicator = 'Shard0004';

                if(s.shardFrame === 'Shard0000') shardIndicator = 'Shard0004';
                if(s.shardFrame === 'Shard0001') shardIndicator = 'Shard0005';
                if(s.shardFrame === 'Shard0002') shardIndicator = 'Shard0006';
                if(s.shardFrame === 'Shard0003') shardIndicator = 'Shard0007';

                Main.RenderTextureFromAtlas('Misc', shardIndicator, (game.camera.width / 2) + diff.x, (game.camera.height / 2) + diff.y, 1, 1, opacity);

            }
        });
    }
};

Main.RenderTextureFromAtlas = function(atlas, frame, x, y, scaleX, scaleY, alpha) {
    var oldAlpha = pixel.context.globalAlpha;
    pixel.context.globalAlpha = alpha || oldAlpha;

    if(scaleX !== 0) scaleX = scaleX || 1;
    if(scaleY !== 0) scaleY = scaleY || 1;

    if(scaleX < 0) scaleX = 0;
    if(scaleY < 0) scaleY = 0;

    x *= pixel.scale;
    y *= pixel.scale;

    var texture;

    if(!this.UITextures[frame]) {
        texture = PIXI.TextureCache[game.cache.getFrameByName(atlas, frame).uuid];
    } else {
        texture = this.UITextures[frame];
    }
    
    var offset;

    if(texture.trim){
      offset = {x: texture.trim.x, y: texture.trim.y}
    }else{
      offset = {x: 0, y:0}
    }

    pixel.context.drawImage(texture.baseTexture.source,
                           texture.frame.x,
                           texture.frame.y,
                           texture.frame.width,
                           texture.frame.height,
                           offset.x + x,
                           offset.y + y,
                           texture.frame.width * pixel.scale * scaleX,
                           texture.frame.height * pixel.scale * scaleY);

    pixel.context.globalAlpha = oldAlpha;
};
