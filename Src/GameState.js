var GameState = new Phaser.State();

GameState.MAX_PLAYER_HEALTH = 14;
GameState.MAX_APPLES = 6;

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

    events.subscribe('update_ui', this.UpdateUI, this);
    events.subscribe('select_menu_option', this.MakeMenuSelection, this);
    events.subscribe('menu_change', this.UpdateMenuSelection, this);

    this.CreateUI();
    
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

GameState.BeginGameover = function() {
    if(this.restarting === true) {
        return;
    }

    this.restarting = true;

    if(this.tweens.dizzies) this.tweens.dizzies.stop();
    if(this.tweens.slowMo) this.tweens.slowMo.stop();

    this.physicsSlowMo = 0.1;
    this.currentAlpha = 1;
    pixel.context.globalAlpha = 1;

    audioController.Reset();
    inputController.Reset();
    cameraController.Reset();
};

GameState.Reset = function() {
    frauki.Reset(); 
    if(!!goddess) goddess.Reset();

    GameState.physicsSlowMo = 1.0;
    GameState.restarting = false;
    
    energyController.Reset();
    objectController.Reset();
    effectsController.Reset();
    triggerController.Reset();
    projectileController.Reset();
};

GameState.MakeMenuSelection = function() {
    if(GameState.inMainMenu && !GameState.menuSelectionMade) {
        this.menuSelectionMade = true;
    
        if(this.menuSelection === 'new') {
            ScriptRunner.run('new_game');
        } else {
            ScriptRunner.run('continue_game');
        }
    }
};

GameState.UpdateMenuSelection = function(params) {
    if(this.inMainMenu && !this.menuSelectionMade) {
        if(this.menuSelection === 'continue') {
            this.menuSelection = 'new';
        } else {
            this.menuSelection = 'continue';
        }

        events.publish('update_ui', {});
        events.publish('play_sound', {name: 'text_bloop'});   
    }
};

GameState.CreateUI = function() {
    this.UI = game.add.group();
    this.UI.fixedToCamera = true;
    this.Menu = game.add.group();
    this.Menu.fixedToCamera = true;        

    if(this.inMainMenu) {
        this.UI.alpha = 0;
    }

    this.logo = game.add.image(pixel.width / 2, pixel.height / 3, 'UI', 'Logo0000', this.Menu);
    this.logo.anchor.setTo(0.5);

    this.continueGame = game.add.bitmapText(pixel.width / 2, 200, 'diest64','', 16, this.Menu);
    this.continueGame.anchor.setTo(0.5);
    this.continueGame.setText('- Continue Adventure -');
    
    this.newGame = game.add.bitmapText(pixel.width / 2, 220, 'diest64','', 16, this.Menu);
    this.newGame.anchor.setTo(0.5);
    this.newGame.setText('New Adventure');
    

    this.healthFrameStart = game.add.image(10, 10, 'UI', 'HudFrame0000', this.UI);

    for(var i = 0; i < this.MAX_PLAYER_HEALTH; i++) {
        this['healthFrameBack' + i] = game.add.image(14 + (i * 5), 13, 'UI', 'HudFrame0003', this.UI);
        this['healthFrameFront' + i] = game.add.image(14 + (i * 5), 10, 'UI', 'HudFrame0001', this.UI);

        if(i >= energyController.GetMaxHealthBar()) {
            this['healthFrameBack' + i].visible = false;
            this['healthFrameFront' + i].visible = false;
        }
    }

    this.healthFrameEnd = game.add.image(14 + (energyController.GetMaxHealth() * 5), 10, 'UI', 'HudFrame0002', this.UI);

    //health pips
    for(var i = 0; i < this.MAX_PLAYER_HEALTH; i++) {
        this['healthPip' + i] = game.add.image(14 + (5 * i), 13, 'UI', 'HealthPips0000', this.UI);
        
        if(i >= energyController.GetHealth()) {
            this['healthPip' + i].visible = false;
        }

        this['shieldPip' + i] = game.add.image(14 + (5 * i), 13, 'UI', 'EnergyPips0000', this.UI);
        this['shieldPip' + i].visible = false;
    }

    for(var i = 0; i < this.MAX_APPLES; i++) {
        this['apple' + i] = game.add.image(-10 + (20 * i), 15, 'Misc', 'Apple0000', this.UI);
        this['apple' + i].visible = false;
    }

    this['prismWill'] = game.add.image(-10, 320, 'Misc', 'Shard0005', this.UI);
    this['prismWill'].visible = false;
    this['prismWit'] = game.add.image(2, 320, 'Misc', 'Shard0004', this.UI);
    this['prismWit'].visible = false;
    this['prismPower'] = game.add.image(14, 320, 'Misc', 'Shard0007', this.UI);
    this['prismPower'].visible = false;
    this['prismLuck'] = game.add.image(26, 320, 'Misc', 'Shard0006', this.UI);
    this['prismLuck'].visible = false; 
};

GameState.UpdateUI = function() {

    if(this.inMainMenu) {
        if(this.menuSelection === 'continue') {
            this.continueGame.setText('- Continue Adventure -');
            this.newGame.setText('New Adventure');
        }
        else {
            this.continueGame.setText('Continue Adventure');
            this.newGame.setText('- New Adventure -');
        }
        return;
    }

    for(var i = 0; i < this.MAX_PLAYER_HEALTH; i++) {
        this['healthFrameBack' + i].visible = (i < energyController.GetMaxHealthBar());
        this['healthFrameFront' + i].visible = (i < energyController.GetMaxHealthBar());

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

    for(var i = 0; i < this.MAX_APPLES; i++) {
        this['apple' + i].visible = i < energyController.GetApples();
    }

    this['prismWit'].visible = GameData.HasShard('Wit');
    this['prismWill'].visible = GameData.HasShard('Will');
    this['prismLuck'].visible = GameData.HasShard('Luck');
    this['prismPower'].visible = GameData.HasShard('Power');       
};
