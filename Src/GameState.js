var GameState = new Phaser.State();

GameState.MAX_PLAYER_HEALTH = 22;
GameState.MAX_APPLES = 3;

GameState.create = function() {

    this.paused = false;
    this.gameTime = 0;
    this.prevTime = game.time.now;
    this.restarting = false;
    this.inMenu = true;
    this.inFinale = false;
    this.inCredits = false;
    this.menuSelectionMade = false;
    
    this.currentMenu = Menus.main;
    this.menuSelection = 0; 

    this.physicsSlowMo = 1;
    this.currentAlpha = 1;
    frauki.alpha = 0;

    this.tweens = {};

    this.death = {
        type: '',
        name: '',
        start: 0,
        end: 0,
    };

    events.subscribe('update_ui', this.UpdateUI, this);
    events.subscribe('select_menu_option', this.MakeMenuSelection, this);
    events.subscribe('menu_change', this.UpdateMenuSelection, this);
    events.subscribe('settings_change', this.UpdateSetting, this);
    events.subscribe('pause_game', this.PauseGame, this);

    this.CreateUI();
    
    ScriptRunner.run('game_start');

    this.profile = {
        frogland: [],
        objects: [],
    }
};

GameState.update = function() {

    this.gameTime += (game.time.now - this.prevTime) * this.physicsSlowMo;
    this.prevTime = game.time.now;
    
    audioController.Update();
    cameraController.Update();
    inputController.Update();
    backdropController.Update();

    Frogland.Update();
 
    if(!this.paused) {
        objectController.Update();
        
        weaponController.Update();
        triggerController.Update();
        effectsController.Update();
        energyController.Update();
        projectileController.Update();
        speechController.Update();
    }

    game.canvas.style.width = (pixel.width * pixel.scale) + "px";
    game.canvas.style.height = (pixel.height * pixel.scale) + "px";

    frauki.alpha = 0;

};

GameState.render = function() {
    // game.debug.body(frauki);
    // game.debug.body(frauki.attackRect);
    // game.debug.body(goddess);
    
    // objectController.GetObjectGroup().forEach(function(o) {
    //     game.debug.body(o);
    //     if(!!o.attackRect) game.debug.body(o.attackRect);
    // });
}

GameState.BeginGameover = function() {
    if(this.restarting === true) {
        return;
    }

    this.restarting = true;

    if(this.tweens.dizzies) this.tweens.dizzies.stop();
    if(this.tweens.slowMo) this.tweens.slowMo.stop();

    this.physicsSlowMo = 0.1;
    this.currentAlpha = 1;

    audioController.Reset();
    inputController.Reset();
    cameraController.Reset();
    energyController.latentHealth = 0;
    energyController.health = 0;
    energyController.shield = 0;
};

GameState.Reset = function() {
    frauki.Reset(); 
    goddess.Reset(); 

    GameState.physicsSlowMo = 1.0;
    
    energyController.Reset();
    objectController.Reset();
    effectsController.Reset();
    triggerController.Reset();
    projectileController.Reset();
    audioController.Reset();
    
    Frogland.Reset();

    this.death.start = game.time.now;

    this.inMenu = false;
    this.inFinale = false;
    this.inCredits = false;
    this.menuSelectionMade = false;
};

GameState.MakeMenuSelection = function() {
    var menuItem = this.GetCurrentMenu()[this.menuSelection];
    
    if(GameState.inMenu && !GameState.menuSelectionMade) {
        if(menuItem.setting === 'music' || menuItem.setting === 'sfx') {
            var currentSetting = GameData.GetSetting(menuItem.setting);
            currentSetting = !currentSetting;
            GameData.SetSetting(menuItem.setting, currentSetting);
            events.publish('update_ui', {});
            events.publish('update_sound_settings', {});
            events.publish('play_sound', {name: 'text_bloop'});
        } else if(menuItem.script === 'unpause_game') {
            if(GameState.inMenu) {
                ScriptRunner.run(menuItem.script);
            }
        } else {
            ScriptRunner.run(menuItem.script);
        }
    }
};

GameState.UpdateMenuSelection = function(params) {
    if(this.inMenu && !this.menuSelectionMade) {
        if(params.dir === 'up') {
            this.menuSelection--;
            if(this.menuSelection < 0) this.menuSelection = this.GetCurrentMenu().length - 1;
        }
        else {
            this.menuSelection++;
            if(this.menuSelection >= this.GetCurrentMenu().length) this.menuSelection = 0;
        }

        events.publish('update_ui', {});
        events.publish('play_sound', {name: 'text_bloop'});
    }
};

GameState.UpdateSetting = function(params) {
    if(this.inMenu && !this.menuSelectionMade) {
        var menuItem = this.GetCurrentMenu()[this.menuSelection];
        var currentSetting = GameData.GetSetting(menuItem.setting);
        if(menuItem.setting === 'sound') {

            if(params.dir === 'up') {
                currentSetting += 1;
            } else {
                currentSetting -= 1;            
            }

            currentSetting = Phaser.Math.clamp(currentSetting, 0, 8);

        }
        else {
            currentSetting = !currentSetting;
        }

        GameData.SetSetting(menuItem.setting, currentSetting);

        events.publish('update_ui', {});
        events.publish('update_sound_settings', {});
        events.publish('play_sound', {name: 'text_bloop'});
    }
};

GameState.PauseGame = function() {
    if(this.inCredits) {
        this.inCredits = false;
        ScriptRunner.run('return_to_menu');
    }
    else if(!this.inMenu && !this.paused && !speechController.speechVisible && !this.restarting) {
        ScriptRunner.run('pause_game');
    }
};

GameState.CreateUI = function() {
    
    //CREATE THE IN GAME HUD
    this.HUD = game.add.group(undefined, 'hud');
    this.HUD.fixedToCamera = true;

    if(this.inMenu) {
        this.HUD.alpha = 0;
    }

    this.healthFrameStart = game.add.image(10, 10, 'UI', 'HudFrame0000', this.HUD);

    for(var i = 0; i < this.MAX_PLAYER_HEALTH; i++) {
        this['healthFrameBack' + i] = game.add.image(14 + (i * 5), 13, 'UI', 'HudFrame0003', this.HUD);
        this['healthFrameFront' + i] = game.add.image(14 + (i * 5), 10, 'UI', 'HudFrame0001', this.HUD);
    }

    this.healthFrameEnd = game.add.image(0, 10, 'UI', 'HudFrame0002', this.HUD);

    //health pips
    for(var i = 0; i < this.MAX_PLAYER_HEALTH; i++) {
        this['healthPip' + i] = game.add.image(14 + (5 * i), 13, 'UI', 'HealthPips0000', this.HUD);
        this['shieldPip' + i] = game.add.image(14 + (5 * i), 13, 'UI', 'EnergyPips0000', this.HUD);
    }

    for(var i = 0; i < this.MAX_APPLES; i++) {
        this['apple' + i] = game.add.image(-10 + (20 * i), 15, 'Misc', 'Apple0000', this.HUD);
    }

    this.prismWit = game.add.image(-10, 320, 'Misc', 'Shard0004', this.HUD);
    this.prismWill = game.add.image(2, 320, 'Misc', 'Shard0005', this.HUD);
    this.prismLuck = game.add.image(14, 320, 'Misc', 'Shard0006', this.HUD);
    this.prismPower = game.add.image(26, 320, 'Misc', 'Shard0007', this.HUD);
    
    //CREATE THE MAIN MENU
    this.Menu = game.add.group(undefined, 'main_menu');
    this.Menu.fixedToCamera = true;    

    this.logo = game.add.image(pixel.width / 2, pixel.height / 3 - 20, 'UI', 'Logo20000');
    this.Menu.add(this.logo);
    this.logo.anchor.setTo(0.5);

    this.menuText = [];
    for(var i = 0; i < 6; i++) {
        var text = game.add.bitmapText(pixel.width / 2, 220 + i * 20, 'bubble','', 18);
        this.Menu.add(text);
        text.anchor.setTo(0.5);
        text.setText('');
        this.menuText.push(text);
    }

    this.settingsMenu = game.add.group(undefined, 'settings_menu');
    this.settingsMenu.fixedToCamera = true;
    this.settingsMenu.visible = false;

    this.soundSliderFrame = game.add.image(400, 209, 'UI', 'Settings0000', this.settingsMenu);
    this.soundPips = [];

    this.musicSetting = game.add.bitmapText(400, 229, 'bubble','ON', 18);
    this.settingsMenu.add(this.musicSetting);
    this.sfxSetting = game.add.bitmapText(400, 249, 'bubble','OFF', 18);
    this.settingsMenu.add(this.sfxSetting);


    for(var i = 0; i < 8; i++) {
        var soundPip = game.add.image(407 + (i * 7), 212, 'UI', 'Settings0001', this.settingsMenu);
        this.soundPips.push(soundPip);
    }

    this.creditsText = game.add.bitmapText(320, 180, 'bubble','', 18);
    this.creditsText.anchor.setTo(0.5);
    this.creditsText.fixedToCamera = true;

    var screenDarkBmd = game.add.bitmapData(game.width, game.height);
    screenDarkBmd.ctx.fillStyle = 'black';
    screenDarkBmd.ctx.fillRect(0,0, game.width, game.height);
    this.screenDark = game.add.sprite(0, 0, screenDarkBmd);
    this.screenDark.fixedToCamera = true;
    this.screenDark.name = 'screen_dark';

};

GameState.Fade = function(show, dur) {
    this.screenDark.bringToTop();
    if(show) {
        this.screenDark.alpha = 0;
        this.screenDark.visible = true;
        return game.add.tween(this.screenDark).to( { alpha: 1 }, dur || 2500, Phaser.Easing.Linear.In, true);
    } else {
        return game.add.tween(this.screenDark).to( { alpha: 0 }, dur || 1000, Phaser.Easing.Quintic.In, true);
    }
};

GameState.GetCurrentMenu = function() {
    return this.currentMenu.filter(function(menu, i) { return !menu.condition || menu.condition(); });
};

GameState.UpdateUI = function() {

    if(this.inMenu) {
        this.menuText.forEach(function(text) {
            text.setText('');
        });

        this.GetCurrentMenu().forEach(function(menu, i) {
            if(!!menu) {
                if(this.menuSelection === i) {
                    this.menuText[i].setText('~ ' + menu.getText() + ' ~');
                } else {
                    this.menuText[i].setText(menu.getText());
                }
            } 
        }, this);

        var soundSetting = GameData.GetSetting('sound');
        var musicSetting = GameData.GetSetting('music');
        var sfxSetting = GameData.GetSetting('sfx');

        if(musicSetting) {
            this.musicSetting.setText('ON');
        } else {
            this.musicSetting.setText('OFF');
        }

        if(sfxSetting) {
            this.sfxSetting.setText('ON');
        } else {
            this.sfxSetting.setText('OFF');
        }

        for(var i = 0; i < 8; i++) {
            this.soundPips[i].visible = i < soundSetting;
        }
    }

    for(var i = 0; i < this.MAX_PLAYER_HEALTH; i++) {
        this['healthFrameBack' + i].visible = (i < energyController.GetMaxHealthBar());
        this['healthFrameFront' + i].visible = (i < energyController.GetMaxHealthBar());

        if(i >= energyController.GetHealth()) {
            this['healthPip' + i].visible = false;

            if(i < (energyController.GetHealth() + energyController.GetShield())) {
                this['shieldPip' + i].visible = true;
            } else {
                this['shieldPip' + i].visible = false;
            }
        } else {
            this['healthPip' + i].visible = true;
            this['shieldPip' + i].visible = false;
            
        }
    }

    this.healthFrameEnd.x = 14 + (energyController.GetMaxHealthBar() * 5);

    for(var i = 0; i < this.MAX_APPLES; i++) {
        this['apple' + i].visible = i < energyController.GetApples();
    }

    this['prismWit'].visible = GameData.HasGem('Wit');
    this['prismWill'].visible = GameData.HasGem('Will');
    this['prismLuck'].visible = GameData.HasGem('Luck');
    this['prismPower'].visible = GameData.HasGem('Power');   
};
