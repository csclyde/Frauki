var GameState = new Phaser.State();

GameState.create = function() {

    this.restarting = false;
    this.inMainMenu = true;
    this.menuSelectionMade = false;
    this.menuSelection = 'continue';    

    this.physicsSlowMo = 1;
    this.currentAlpha = 1;
    frauki.alpha = 0;

    this.tweens = {};

    this.UITextures = {};

    this.CreateUI();

    events.subscribe('update_ui', this.UpdateUI, this);
    events.subscribe('select_menu_option', this.SelectMenu, this);
    
    ScriptRunner.run('game_start');
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

    pixel.context.globalAlpha = this.currentAlpha;

    game.canvas.style.width = (pixel.width * pixel.scale) + "px";
    game.canvas.style.height = (pixel.height * pixel.scale) + "px";

    frauki.alpha = 0;
};

GameState.Restart = function() {
    if(this.restarting === true) {
        return;
    }

    events.publish('stop_all_music'); 
    events.publish('stop_all_ambient'); 
    audioController.timers.SetTimer('music_reset', 0);

    speechController.HideSpeech();

    if(this.tweens.dizzies) this.tweens.dizzies.stop();
    if(this.tweens.slowMo) this.tweens.slowMo.stop();

    this.restarting = true;
    this.physicsSlowMo = 0.1;
    this.currentAlpha = 1;
    pixel.context.globalAlpha = 1;
    var fadeOutTween = effectsController.Fade(true, 4000);

    inputController.OnLeft(false);
    inputController.OnRight(false);
    inputController.OnUp(false);
    inputController.OnDown(false);

    cameraController.shakeMagnitudeX = 0;
    cameraController.shakeMagnitudeY = 0;
    if(cameraController.shakeXTween) cameraController.shakeXTween.stop();
    if(cameraController.shakeYTween) cameraController.shakeYTween.stop();

    fadeOutTween.onComplete.add(function() {

        frauki.Reset(); 
        if(!!goddess) goddess.Reset();

        game.time.events.add(800, function() {
            frauki.state = frauki.Materializing;
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

        //frauki.Reset();
        frauki.state = frauki.PreMaterializing;    
    });

    return fadeOutTween;
};

GameState.SelectMenu = function() {
    this.menuSelectionMade = true;

    if(this.menuSelection === 'new') {
        ScriptRunner.run('new_game');
    } else {
        ScriptRunner.run('continue_game');
    }
};

GameState.CreateUI = function() {
    this.UI = game.add.group();
    this.Menu = game.add.group();

    this.logo = game.add.image(pixel.width / 2, pixel.height / 3, 'UI', 'Logo0000', this.Menu);
    this.logo.anchor.setTo(0.5);
    this.logo.fixedToCamera = true;

    this.continueGame = game.add.bitmapText(pixel.width / 2, 200, 'diest64','', 16, this.Menu);
    this.continueGame.fixedToCamera = true;
    this.continueGame.anchor.setTo(0.5);
    this.continueGame.setText('- Continue Game -');
    
    this.newGame = game.add.bitmapText(pixel.width / 2, 220, 'diest64','', 16, this.Menu);
    this.newGame.fixedToCamera = true;
    this.newGame.anchor.setTo(0.5);
    this.newGame.setText('New Game');
    


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

    for(var i = 0, len = 6; i < len; i++) {
        this['apple' + i] = game.add.image(-10 + (20 * i), 15, 'Misc', 'Apple0000', this.UI);
        this['apple' + i].fixedToCamera = true;
        this['apple' + i].visible = false;
    }

    this['prismWill'] = game.add.image(-10, 320, 'Misc', 'Shard0005', this.UI);
    this['prismWill'].fixedToCamera = true;
    this['prismWill'].visible = false;
    this['prismWit'] = game.add.image(2, 320, 'Misc', 'Shard0004', this.UI);
    this['prismWit'].fixedToCamera = true;
    this['prismWit'].visible = false;
    this['prismPower'] = game.add.image(14, 320, 'Misc', 'Shard0007', this.UI);
    this['prismPower'].fixedToCamera = true;
    this['prismPower'].visible = false;
    this['prismLuck'] = game.add.image(26, 320, 'Misc', 'Shard0006', this.UI);
    this['prismLuck'].fixedToCamera = true;
    this['prismLuck'].visible = false;

    if(this.inMainMenu) {
        this.UI.alpha = 0;
    }

    effectsController.screenDark.bringToTop();    
};

GameState.UpdateUI = function() {

    if(this.inMainMenu) {
        if(this.menuSelection === 'continue') {
            this.continueGame.setText('- Continue Game -');
            this.newGame.setText('New Game');
        }
        else {
            this.continueGame.setText('Continue Game');
            this.newGame.setText('- New Game -');
        }

        return;
    }

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

    for(var i = 0, len = 6; i < len; i++) {
        if(i < energyController.GetApples()) {
            this['apple' + i].visible = true;
        } else {
            this['apple' + i].visible = false;
        }
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

    effectsController.screenDark.bringToTop();    
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

    this.RenderTextureFromAtlas('UI', 'NuggCounterBack0000', 562, 7, 1, 1, 0.8);

    this.RenderTextureFromAtlas('Misc', 'EnergyBitNeutral0000', 565, 10);

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
