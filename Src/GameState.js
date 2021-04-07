var GameState = new Phaser.State();

GameState.MAX_PLAYER_HEALTH = 14;
GameState.MAX_APPLES = 6;

GameState.create = function() {

    this.paused = false;
    this.gameTime = 0;
    this.prevTime = game.time.now;
    this.restarting = false;
    this.inMenu = true;
    this.inFinale = false;
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
};

GameState.Reset = function() {
    frauki.Reset(); 

    GameState.physicsSlowMo = 1.0;
    
    energyController.Reset();
    objectController.Reset();
    effectsController.Reset();
    triggerController.Reset();
    projectileController.Reset();

    if(!!goddess) goddess.Reset(); 
    
    Frogland.Reset();

    this.death.start = game.time.now;
};

GameState.MakeMenuSelection = function() {
    if(GameState.inMenu && !GameState.menuSelectionMade) {
        ScriptRunner.run(this.GetCurrentMenu()[this.menuSelection].script);
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
        if(!!menuItem.setting) {
            var currentSetting = GameData.GetSetting(menuItem.setting);

            if(params.dir === 'up') {
                currentSetting += 1;
            }
            else {
                currentSetting -= 1;                
            }

            currentSetting = Phaser.Math.clamp(currentSetting, 0, 8);

            GameData.SetSetting(menuItem.setting, currentSetting);
    
            events.publish('update_ui', {});
            events.publish('update_sound_settings', {});
            events.publish('play_sound', {name: 'text_bloop'});
        }
    }
};

GameState.PauseGame = function() {
    if(!this.inMenu && !this.paused && !speechController.speechVisible && !this.restarting) {
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

    this['prismWit'] = game.add.image(-10, 320, 'Misc', 'Shard0004', this.HUD);
    this['prismWill'] = game.add.image(2, 320, 'Misc', 'Shard0005', this.HUD);
    this['prismLuck'] = game.add.image(14, 320, 'Misc', 'Shard0006', this.HUD);
    this['prismPower'] = game.add.image(26, 320, 'Misc', 'Shard0007', this.HUD);
    
    //CREATE THE MAIN MENU
    this.Menu = game.add.group(undefined, 'main_menu');
    this.Menu.fixedToCamera = true;        

    this.logo = game.add.image(pixel.width / 2, pixel.height / 3, 'UI', 'Logo0000');
    this.Menu.add(this.logo);
    this.logo.anchor.setTo(0.5);    

    this.menuText = [];
    for(var i = 0; i < 6; i++) {
        var text = game.add.bitmapText(pixel.width / 2, 200 + i * 20, 'bubble','', 18);
        this.Menu.add(text);
        text.anchor.setTo(0.5);
        text.setText('');
        this.menuText.push(text);
    }

    this.settingsMenu = game.add.group(undefined, 'settings_menu');
    this.settingsMenu.fixedToCamera = true;
    this.settingsMenu.visible = false;

    this.soundSliderFrame = game.add.image(400, 189, 'UI', 'Settings0000', this.settingsMenu);
    this.musicSliderFrame = game.add.image(400, 209, 'UI', 'Settings0000', this.settingsMenu);
    this.effectsSliderFrame = game.add.image(400, 229, 'UI', 'Settings0000', this.settingsMenu);

    this.soundPips = [];
    this.musicPips = [];
    this.sfxPips = [];

    for(var i = 0; i < 8; i++) {
        var soundPip = game.add.image(407 + (i * 7), 192, 'UI', 'Settings0001', this.settingsMenu);
        this.soundPips.push(soundPip);

        var musicPip = game.add.image(407 + (i * 7), 212, 'UI', 'Settings0001', this.settingsMenu);
        this.musicPips.push(musicPip);

        var sfxPip = game.add.image(407 + (i * 7), 232, 'UI', 'Settings0001', this.settingsMenu);
        this.sfxPips.push(sfxPip);
    
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

        for(var i = 0; i < 8; i++) {
            this.soundPips[i].visible = i < soundSetting;
            this.musicPips[i].visible = i < musicSetting;
            this.sfxPips[i].visible = i < sfxSetting;
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

    this['prismWit'].visible = GameData.HasShard('Wit');
    this['prismWill'].visible = GameData.HasShard('Will');
    this['prismLuck'].visible = GameData.HasShard('Luck');
    this['prismPower'].visible = GameData.HasShard('Power');       
};
