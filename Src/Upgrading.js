var Upgrading = new Phaser.State();

Upgrading.preload = function() {

};

Upgrading.create = function() {

    events.subscribe('enter_upgrades', function() {
        game.state.start('Upgrading', false);
    });

    events.subscribe('exit_upgrades', function() {
    	speechController.HideSpeech();
        game.state.start('Main', false);
    });

    this.UITextures = {};

	speechController.Activate('Hit the roll button to continue...', 'Displeased');
    
};

Upgrading.update = function() {

    inputController.Update();
    speechController.Update();
};

Upgrading.render = function() {
    pixel.context.drawImage(
        game.canvas, 0, 0, game.width, game.height, 
        0,
        0,
        game.width * pixel.scale, 
        game.height * pixel.scale
    );

    this.DrawUI();
};

Upgrading.DrawUI = function() {

    this.RenderTextureFromAtlas('Misc', 'EnergyBitPos0000', 565, 10);

    //render the nugg amount, character by character
    var nuggCountString = GameData.GetNuggCount().toString();

    for(var i = 0, len = nuggCountString.length; i < len; i++) {
        var charNum = nuggCountString[i];

        this.RenderTextureFromAtlas('UI', 'Numbers000' + nuggCountString[i], 580 + (i * 10), 10);

    }
    
};

Upgrading.RenderTextureFromAtlas = function(atlas, frame, x, y, scaleX, scaleY, alpha) {
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
