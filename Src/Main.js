var Main = new Phaser.State();

Main.create = function() {

    cameraController = new CameraController();
    inputController = new InputController();
    energyController = new EnergyController();
    audioController = new AudioController();
    triggerController = new TriggerController();
    scriptRunner = new ScriptRunner();
    timerUtil = new TimerUtil();
    objectController = new ObjectController();

    triggerController.Create(map);

    this.restarting = false;

    Frogland.Create();
    
    effectsController = new EffectsController();
    weaponController = new WeaponController();
    projectileController = new ProjectileController();
    speechController = new SpeechController();
    energyController.Create();
    speechController.Create();

    this.gamepadIcon = game.add.image(150, 150, 'UI', 'Gamepad0001');
    this.gamepadIcon.fixedToCamera = true;
    this.gamepadIcon.alpha = 0.5;

    if(game.input.gamepad.padsConnected === 0) {
        this.gamepadIcon.visible = false;
    }

    this.physicsSlowMo = 1;
    this.currentAlpha = 1;

    cameraController.camX = frauki.x;
    cameraController.camY = frauki.y;
    
    effectsController.Fade(false);

    this.UITextures = {};
    this.UITextures.EnergyBar0000 = PIXI.TextureCache[game.cache.getFrameByName('UI', 'EnergyBar0000').uuid];
    this.UITextures.EnergyBar0001 = PIXI.TextureCache[game.cache.getFrameByName('UI', 'EnergyBar0001').uuid];
    this.UITextures.EnergyBar0002 = PIXI.TextureCache[game.cache.getFrameByName('UI', 'EnergyBar0002').uuid];
    this.UITextures.EnergyBar0005 = PIXI.TextureCache[game.cache.getFrameByName('UI', 'EnergyBar0005').uuid];
    this.UITextures.EnergyBar0006 = PIXI.TextureCache[game.cache.getFrameByName('UI', 'EnergyBar0006').uuid];
};

Main.update = function() {

    frauki.UpdateAttackGeometry();
    objectController.Update();
    
    Frogland.Update();

    cameraController.Update();
    inputController.Update();
    effectsController.Update();
    energyController.Update();
    projectileController.Update();
    weaponController.Update();
    speechController.Update();
    triggerController.Update(Frogland.currentLayer);

    this.gamepadIcon.cameraOffset.x = Math.round(pixel.width * 0.27 + cameraController.camX / pixel.scale);
    this.gamepadIcon.cameraOffset.y = Math.round(pixel.height * 0.3 + cameraController.camY / pixel.scale) + 240;
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
    events.publish('play_music', { name: 'Gameover' } ); 

    this.restarting = true;
    game.time.slowMotion = 5;
    var fadeOutTween = effectsController.Fade(true);
    effectsController.Goddess(true);

    events.publish('player_run', {run:false, dir: 'left'});
    events.publish('player_run', {run:false, dir: 'right'});

    cameraController.shakeMagnitudeX = 0;
    cameraController.shakeMagnitudeY = 0;
    cameraController.shakeXTween.stop();
    cameraController.shakeYTween.stop();

    fadeOutTween.onComplete.add(function() {
        PrepareShardsForDeath();
        GameData.SaveShardPositions();
        
        frauki.alpha = 1;
        Frogland.SpawnFrauki();

        frauki.state = frauki.Materializing;
        frauki.SetDirection('right');

        energyController.Reset();
        game.time.slowMotion = 1;
        //game.world.alpha = 1;
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

        effectsController.Goddess(false);

        Frogland.ResetFallenTiles();

        //var cameraMoveTween = game.add.tween(game.camera)

    });
};

Main.DrawUI = function() {
    
    //render the energy bar backdrops
    this.RenderTextureFromAtlas('UI', 'EnergyBar0001', 12, 12);
    this.RenderTextureFromAtlas('UI', 'EnergyBar0001', 12, 24);

    //the stamina bar
    this.RenderTextureFromAtlas('UI', 'EnergyBar0002', 12, 23, energyController.GetEnergy() / 15);

    //if theyre carrying the wit shard
    if(GetCurrentShardType() === 'Wit') {
        //oscillate the opacity of the white bar on top
        this.RenderTextureFromAtlas('UI', 'EnergyBar0003', 12, 23, energyController.GetEnergy() / 15, 1, (Math.sin(game.time.now / 80) + 1) / 2);
    }

    //the health bar
    this.RenderTextureFromAtlas('UI', 'EnergyBar0004', 12, 12, energyController.GetHealth() / 30);

    //oscillate the white bar on top of the health if they have will
    if(energyController.GetHealth() <= energyController.GetMaxHealth() * 0.35) {
        //oscillate the opacity of the white bar on top
        this.RenderTextureFromAtlas('UI', 'EnergyBar0003', 12, 12, energyController.GetHealth() / 30, 1, (Math.sin(game.time.now / 80) + 1) / 2);
    }

    //the special bar
    this.RenderTextureFromAtlas('UI', 'EnergyBar0006', 12, 34, energyController.GetCharge() / 30);

    //finally, the frame on top of everything else
    this.RenderTextureFromAtlas('UI', 'EnergyBar0000', 10, 10);

    for(var i = 0; i < GameData.GetMaxApples(); i++) {
        if(i < energyController.GetApples()) {
            //if this is the last apple in the stable and they are healing
            if(i === energyController.GetApples() - 1 && frauki.state === frauki.Healing) {
                //drain the graphic
                if(game.time.now - frauki.timers.Timestamp('heal_charge') < 200) {
                    this.RenderTextureFromAtlas('Misc','Apple0002', 10 + (20 * i), 45); 
                } else if(game.time.now - frauki.timers.Timestamp('heal_charge') < 400) {
                    this.RenderTextureFromAtlas('Misc','Apple0003', 10 + (20 * i), 45); 
                } else if(game.time.now - frauki.timers.Timestamp('heal_charge') < 600) {
                    this.RenderTextureFromAtlas('Misc','Apple0004', 10 + (20 * i), 45); 
                } else if(game.time.now - frauki.timers.Timestamp('heal_charge') < 800) {
                    this.RenderTextureFromAtlas('Misc','Apple0005', 10 + (20 * i), 45); 
                } else {
                    this.RenderTextureFromAtlas('Misc','Apple0006', 10 + (20 * i), 45); 
                }
            
            //otherwise, just draw the full apple
            } else {
                this.RenderTextureFromAtlas('Misc','Apple0000', 10 + (20 * i), 45); 
                
            }
        } else {
            this.RenderTextureFromAtlas('Misc','Checkpoint0005', 10 + (20 * i), 45); 
        }
    }

    for(var i = 0; i < weaponController.weaponList.length; i++) {
        pixel.context.globalAlpha = weaponController.currentWeapon === weaponController.weaponList[i] ? 1 : 0.3;
        this.RenderTextureFromAtlas('UI', weaponController.weaponList[i].FrameName, (100 + 25 * i), 10);
    }


    // pixel.context.globalAlpha = weaponController.currentWeapon === weaponController.weaponList[1] ? 1 : 0.3;

    // this.RenderTextureFromAtlas('UI', 'UpgradeIconLob', 125, 10);

    // pixel.context.globalAlpha = weaponController.currentWeapon === weaponController.weaponList[2] ? 1 : 0.3;

    // this.RenderTextureFromAtlas('UI', 'UpgradeIconShield', 150, 10);

    pixel.context.globalAlpha = this.currentAlpha;


    if(speechController.speechVisible) {

        // pixel.context.globalAlpha = 0.7;
        // this.RenderTextureFromAtlas('UI', 'Speech0000', 20, 520);
        // this.RenderTextureFromAtlas('UI', 'Speech0001', 240, 520);
        // pixel.context.globalAlpha = 1;

        // this.RenderTextureFromAtlas('UI', 'PortraitsFraukiNeutral', 50, 495);
        
    }

    //draw an arrow pointing towards the shard
    if(GetCurrentShardType() === 'None') {

        Frogland.shardGroup.forEach(function(s) {
            if(s.pickedUp && !s.returnedToChurch) {
                var diff = new Phaser.Point(s.body.center.x - frauki.body.center.x, s.body.center.y - frauki.body.center.y);
                diff = diff.normalize();

                diff.setMagnitude(90);

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
