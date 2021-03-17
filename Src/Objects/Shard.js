Shard = function(game, x, y, name) {
    //instantiate the sprite
    Phaser.Sprite.call(this, game, x, y, 'Misc');
    this.spriteType = 'shard';
    
    //enable its physics body
    game.physics.enable(this, Phaser.Physics.ARCADE);
    
    this.body.setSize(16, 16, 0, 2);
    this.anchor.setTo(0.5, 0.5);
    this.body.bounce.y = 0.5;
    this.body.bounce.x = 0.5;
    this.body.drag.setTo(0);
    //this.body.gravity.y = game.physics.arcade.gravity.y * 2;

    this.state = this.Floating;

    this.body.allowGravity = false;

    this.timers = new TimerUtil();

    this.currentLayer = Frogland.shardLayer;
    this.shardFrame = name;

    this.animations.add('Wit', ['Shard0000'], 10, false, false);
    this.animations.add('Will', ['Shard0001'], 10, false, false);
    this.animations.add('Luck', ['Shard0002'], 10, false, false);
    this.animations.add('Power', ['Shard0003'], 10, false, false);
    this.animations.add('Derp', ['Shard0002'], 10, false, false);

    objectController.shardList.push(this);
    
    if(this.currentLayer === Frogland.currentLayer) {
        this.visible = true;
    } else {
        this.visible = false;
    }
};

Shard.prototype = Object.create(Phaser.Sprite.prototype);
Shard.prototype.constructor = Shard;

Shard.prototype.create = function() {
};

Shard.prototype.update = function() {
    if(!this.body.enable) return;
    
    if(!!this.state) this.state();

    if(this.beingUsed === true) {
        this.visible = true;
    } else if(this.visible && GameData.HasShard(this.name)) {
        this.visible = false;
        this.dead = true;
    } else if(!GameData.HasShard(this.name)) {
        this.visible = true;
    }

};

function PickUpShard(f, a) {

    if(!GameData.HasShard(a.name)) {
        GameData.AddShard(a.name);

        events.publish('update_ui', {});
        
        if(a.name == 'Will') {
            if(GameData.GetFlag('goddess_intro')) {
                ScriptRunner.run('demo_' + a.name);
            } else {
                ScriptRunner.run('demo_' + a.name + '_no_intro');
            }
        }
        else {
            ScriptRunner.run('demo_' + a.name);
        }

        a.ReturnToUI();
        
    }
};

Shard.prototype.ReturnToUI = function() {
    effectsController.ScreenFlash();
    events.publish('play_sound', {name: 'crystal_door'});
    events.publish('play_music', {name: 'fanfare_short', restart: true });

    if(this.name === 'Will') {
        ScriptRunner.run('demo_Will');
    }
    
    this.visible = false;
    this.dead = true;
};

Shard.prototype.PlayAnim = function(name) {
    if(this.animations.currentAnim.name !== name)
        this.animations.play(name);
};

Shard.prototype.Floating = function() {
    this.PlayAnim(this.name);

    if(this.dead) {
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
        return;
    }

    this.body.velocity.y = Math.sin(GameState.gameTime / 150) * 30;
    this.body.velocity.x = 0;
};

Shard.prototype.collideWithPlayer = function(f) {
    PickUpShard(f, this);
    return false;
};