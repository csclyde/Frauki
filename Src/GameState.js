var GameState = new Phaser.State();

GameState.create = function() {

    this.restarting = true;

    this.physicsSlowMo = 1;
    this.currentAlpha = 1;
    frauki.alpha = 0;
    
    var fadeIn = effectsController.Fade(false);
    Frogland.SpawnFrauki();

    fadeIn.onComplete.add(function() {
        frauki.Reset();
        GameState.restarting = false;
        
        //inputController.AllowInput();

        events.publish('play_music', { name: 'Intro' } );

        // if(game.input.keyboard.isDown(inputController.binds.runLeft) || game.input.gamepad.isDown(14)) {
        //     inputController.OnLeft(true);
        // }

        // if(game.input.keyboard.isDown(inputController.binds.runRight) || game.input.gamepad.isDown(15)) {
        //     inputController.OnRight(true);
        // }
    });

    this.tweens = {};

    this.UITextures = {};

    audioController.ambient['surface_wind'].play();

    this.CreateUI();

    events.subscribe('update_ui', this.UpdateUI, this);

    // this.titleLogo = game.add.image(0, 0, 'UI', 'Logo0000');
    // this.titleLogo.fixedToCamera = true;
    // this.titleLogo.cameraOffset.x = 133;
    // this.titleLogo.cameraOffset.y = 30;
};

GameState.update = function() {
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
    triggerController.Update();
    backdropController.Update();

    //this.UpdateUI();
    pixel.context.globalAlpha = this.currentAlpha;

    frauki.alpha = 0;


};

GameState.render = function() {
    // game.debug.body(frauki);
    // game.debug.body(frauki.attackRect);

    // objectController.activeLayer3.forEach(function(o) {
    //     game.debug.body(o);
    //     if(!!o.attackRect) game.debug.body(o.attackRect);
    // });

    // Frogland.door1Group.forEach(function(o) {
    //     game.debug.body(o);
    // });

    // projectileController.projectiles.forEach(function(o) {
    //     game.debug.body(o);
    // });

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

    // pixel.context.drawImage(
    //     game.canvas, 0, 0, game.width, game.height, 
    //     0,
    //     0,
    //     game.width * pixel.scale, 
    //     game.height * pixel.scale
    // );

    //this.DrawUI();
};

GameState.Restart = function() {
    if(this.restarting === true) {
        return;
    }

    events.publish('stop_all_music'); 
    events.publish('stop_all_ambient'); 
    events.publish('play_music', { name: 'Gameover' } );
    audioController.timers.SetTimer('music_reset', 0); 

    speechController.HideSpeech();

    if(this.tweens.dizzies) this.tweens.dizzies.stop();
    if(this.tweens.slowMo) this.tweens.slowMo.stop();

    this.restarting = true;
    this.physicsSlowMo = 0.1;
    this.currentAlpha = 1;
    pixel.context.globalAlpha = 1;
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

        weaponController.Baton.ResetBaton();

        game.time.events.add(300, function() {
            frauki.Reset(); 
            if(!!goddess) goddess.Reset();
        });

        energyController.Reset();
        GameState.physicsSlowMo = 1.0;
        effectsController.Fade(false);

        GameState.restarting = false;

        objectController.Reset();
        effectsController.Reset();

        GameData.ResetNuggCount();

        triggerController.triggerLayers['Triggers'].forEach(function(trig) {
            trig.enterFired = false;
            trig.stayFired = false;
            trig.exitFired = false;
        });

        objectController.CompileObjectList();

        projectileController.DestroyAllProjectiles();

        Frogland.ResetFallenTiles();

        Frogland.SpawnFrauki();

    });
};

GameState.CreateUI = function() {
    this.UI = game.add.group();

    this.healthFrameStart = game.add.image(10, 10, 'UI', 'HudFrame0000', this.UI);
    this.healthFrameStart.fixedToCamera = true;

    for(var i = 0, len = 14; i < len; i++) {
        this['healthFrameBack' + i] = game.add.image(14 + (i * 5), 13, 'UI', 'HudFrame0003', this.UI);
        this['healthFrameFront' + i] = game.add.image(14 + (i * 5), 10, 'UI', 'HudFrame0001', this.UI);

        this['healthFrameBack' + i].fixedToCamera = true;
        this['healthFrameFront' + i].fixedToCamera = true;

        if(i >= energyController.GetMaxHealthBar()) {
            this['healthFrameBack' + i].visible = false;
            this['healthFrameFront' + i].visible = false;
        }
    }

    this.healthFrameEnd = game.add.image(14 + (energyController.GetMaxHealth() * 5), 10, 'UI', 'HudFrame0002', this.UI);
    this.healthFrameEnd.fixedToCamera = true;

    //health pips
    for(var i = 0, len = 14; i < len; i++) {
        this['healthPip' + i] = game.add.image(14 + (5 * i), 13, 'UI', 'HealthPips0000', this.UI);
        this['healthPip' + i].fixedToCamera = true;
        
        if(i >= energyController.GetHealth()) {
            this['healthPip' + i].visible = false;
        }

        this['shieldPip' + i] = game.add.image(14 + (5 * i), 13, 'UI', 'EnergyPips0000', this.UI);
        this['shieldPip' + i].fixedToCamera = true;
        this['shieldPip' + i].visible = false;
    }

    this.energyFrameStart = game.add.image(10, 22, 'UI', 'HudFrame0000', this.UI);
    this.energyFrameStart.fixedToCamera = true;

    for(var i = 0, len = 4; i < len; i++) {
        this['energyFrameBack' + i] = game.add.image(14 + (i * 5), 25, 'UI', 'HudFrame0003', this.UI);
        this['energyFrameFront' + i] = game.add.image(14 + (i * 5), 22, 'UI', 'HudFrame0001', this.UI);

        this['energyFrameBack' + i].fixedToCamera = true;
        this['energyFrameFront' + i].fixedToCamera = true;

        if(i >= energyController.GetMaxCharge()) {
            this['energyFrameBack' + i].visible = false;
            this['energyFrameFront' + i].visible = false;
        }
    }

    this.energyFrameEnd = game.add.image(14 + (energyController.GetMaxCharge() * 5), 22, 'UI', 'HudFrame0002', this.UI);
    this.energyFrameEnd.fixedToCamera = true;

    //energy pips
    for(var i = 0, len = 4; i < len; i++) {
        this['energyPip' + i] = game.add.image(14 + (5 * i), 25, 'UI', 'EnergyPips0001', this.UI);
        this['energyPip' + i].fixedToCamera = true;
        
        if(i >= energyController.GetCharge()) {
            this['energyPip' + i].visible = false;
        }
    }

    for(var i = 0, len = 6; i < len; i++) {
        this['apple' + i] = game.add.image(-10 + (20 * i), 15, 'Misc', 'Apple0000', this.UI);
        this['apple' + i].fixedToCamera = true;
        this['apple' + i].visible = false;
    }

    this['prismWill'] = game.add.image(-10, 320, 'Misc', 'Shard0005', this.UI);
    this['prismWill'].fixedToCamera = true;
    this['prismWit'] = game.add.image(2, 320, 'Misc', 'Shard0004', this.UI);
    this['prismWit'].fixedToCamera = true;
    this['prismPower'] = game.add.image(14, 320, 'Misc', 'Shard0007', this.UI);
    this['prismPower'].fixedToCamera = true;
    this['prismLuck'] = game.add.image(26, 320, 'Misc', 'Shard0006', this.UI);
    this['prismLuck'].fixedToCamera = true;
};

GameState.UpdateUI = function() {
    for(var i = 0, len = 14; i < len; i++) {
        if(i >= energyController.GetMaxHealthBar()) {
            this['healthFrameBack' + i].visible = false;
            this['healthFrameFront' + i].visible = false;
        } else {
            this['healthFrameBack' + i].visible = true;
            this['healthFrameFront' + i].visible = true;
        }

        if(i >= energyController.GetHealth()) {
            this['healthPip' + i].visible = false;

            if(i < energyController.GetHealth() + energyController.GetShield()) {
                this['shieldPip' + i].visible = true;
            } else {
                this['shieldPip' + i].visible = false;
            }
        } else {
            this['healthPip' + i].visible = true;
            this['shieldPip' + i].visible = false;
            
        }
    }

    this.healthFrameEnd.cameraOffset.x = 14 + (energyController.GetMaxHealthBar() * 5);

    //energy
    for(var i = 0, len = 4; i < len; i++) {
        if(i >= energyController.GetCharge()) {
            this['energyPip' + i].visible = false;
        } else {
            this['energyPip' + i].visible = true;
        }

        if(weaponController.GetNumWeapons() === 0) {
            this['energyFrameBack' + i].visible = false;
            this['energyFrameFront' + i].visible = false;
            this['energyPip' + i].visible = false;
        } else {
            this['energyFrameBack' + i].visible = true;
            this['energyFrameFront' + i].visible = true;
        }
    }

    for(var i = 0, len = 6; i < len; i++) {
        if(i < energyController.GetApples()) {
            this['apple' + i].visible = true;
        } else {
            this['apple' + i].visible = false;
        }
    }

    if(weaponController.GetNumWeapons() === 0) {
        this.energyFrameStart.visible = false;
        this.energyFrameEnd.visible = false;
    } else {
        this.energyFrameStart.visible = true;
        this.energyFrameEnd.visible = true;
    }

    if(GameData.HasShard('Wit')) {
        this['prismWit'].visible = true;
    } else {
        this['prismWit'].visible = false;
    }

    if(GameData.HasShard('Will')) {
        this['prismWill'].visible = true;
    } else {
        this['prismWill'].visible = false;
    }

    if(GameData.HasShard('Luck')) {
        this['prismLuck'].visible = true;
    } else {
        this['prismLuck'].visible = false;
    }

    if(GameData.HasShard('Power')) {
        this['prismPower'].visible = true;
    } else {
        this['prismPower'].visible = false;
    }
};

GameState.DrawUI = function() {
    
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

    //draw an indicator for each obtained shard
    if(GameData.HasShard('Wit')) {
        GameState.RenderTextureFromAtlas('Misc', 'Shard0004', 35, 330);
    }

    if(GameData.HasShard('Will')) {
        GameState.RenderTextureFromAtlas('Misc', 'Shard0005', 20, 330);
    }

    if(GameData.HasShard('Luck')) {
        GameState.RenderTextureFromAtlas('Misc', 'Shard0006', 50, 330);
    }

    if(GameData.HasShard('Power')) {
        GameState.RenderTextureFromAtlas('Misc', 'Shard0007', 65, 330);
    }
};

GameState.RenderTextureFromAtlas = function(atlas, frame, x, y, scaleX, scaleY, alpha) {
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
