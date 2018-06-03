var LoadingState = new Phaser.State();

LoadingState.preload = function() {
    game.canvas.style['display'] = 'none';
    pixel.canvas = Phaser.Canvas.create(pixel.width * pixel.scale, pixel.height * pixel.scale);
    pixel.canvas.width = pixel.width * pixel.scale;
    pixel.canvas.height = pixel.height *  pixel.scale;
    pixel.context = pixel.canvas.getContext('2d');
    Phaser.Canvas.addToDOM(pixel.canvas);
    Phaser.Canvas.setSmoothingEnabled(pixel.context, false);

    pixel.canvas.style['padding-left'] = 0;
    pixel.canvas.style['padding-right'] = 0;
    pixel.canvas.style['margin-left'] = 'auto';
    pixel.canvas.style['margin-right'] = 'auto';
    pixel.canvas.style['display'] = 'block';
    pixel.canvas.style['width'] = pixel.canvas.width;

    pixel.context.drawImage(game.canvas, 0, 0, game.width, game.height, 0, 0, pixel.width * pixel.scale, pixel.height * pixel.scale);

    Phaser.TilemapParser.INSERT_NULL = true;
    game.load.tilemap('Frogland', 'Data/World/Frogland.json', null, Phaser.Tilemap.TILED_JSON);

    //load images
    FileMap.Images.forEach(function(img) {
        game.load.image(img.Name, img.File);
    });

    //load atlases
    FileMap.Atlas.forEach(function(atlas) {
        game.load.atlasJSONHash(atlas.Name, atlas.Img, atlas.File);
    });

    //load audio
    FileMap.Audio.forEach(function(audio) {
        game.load.audio(audio.Name, audio.File);
    });

    //load music
    FileMap.Music.forEach(function(music) {
        //game.load.audio(music.Name, music.File);
        game.load.binary(music.Name, music.File);
    });

    FileMap.Ambient.forEach(function(music) {
        game.load.audio(music.Name, music.File);
    });

    game.load.bitmapFont('diest64', 'Data/Sprites/diest64.png', 'Data/Sprites/diest64.fnt');

    game.renderer.renderSession.roundPixels = false;
};

LoadingState.create = function() {

    Phaser.Sprite.prototype.PlayAnim = function(name) {
        if(this.animations.currentAnim.name !== name)
            this.animations.play(name);
    };

    Phaser.Sprite.prototype.GetProp = function(name) {
        if(!!this.properties.length > 0) {
            var prop = this.properties.find(function(prop) {
                return prop.name === name;
            });
            return (!!prop) ? prop.value : null;
        }

        return null;
    }

    Phaser.Tilemap.prototype.forEach = function (callback, context, x, y, width, height, layer) {

        layer = this.getLayer(layer);

        this.copy(x, y, width, height, layer);

        if (this._results.length < 2)
        {
            return;
        }

        this._results.forEach(callback, context);

        //this.paste(x, y, this._results, layer);

    };

    Phaser.Tilemap.prototype.getTile = function (x, y, layer, nonNull) {

        if (nonNull === undefined) { nonNull = false; }

        layer = this.getLayer(layer);

        if (x >= 0 && x < this.layers[layer].width && y >= 0 && y < this.layers[layer].height)
        {
            if (!!this.layers[layer].data[y][x] && this.layers[layer].data[y][x].index === -1)
            {
                if (nonNull)
                {
                    return this.layers[layer].data[y][x];
                }
                else
                {
                    return null;
                }
            }
            else
            {
                return this.layers[layer].data[y][x];
            }
        }
        else
        {
            return null;
        }

    };

    Phaser.Tilemap.prototype.createFromObjects = function (name, gid, key, frame, exists, autoCull, group, CustomClass, adjustY, adjustSize) {
        
        if (exists === undefined) { exists = true; }
        if (autoCull === undefined) { autoCull = false; }
        if (group === undefined) { group = this.game.world; }
        if (CustomClass === undefined) { CustomClass = Phaser.Sprite; }
        if (adjustY === undefined) { adjustY = true; }
        if (adjustSize === undefined) { adjustSize = true; }

        if (!this.objects[name])
        {
            console.warn('Tilemap.createFromObjects: Invalid objectgroup name given: ' + name, this.objects);
            return;
        }

        for (var i = 0; i < this.objects[name].length; i++)
        {
            var found = false;
            var obj = this.objects[name][i];

            if (obj.gid !== undefined && typeof gid === 'number' && obj.gid === gid)
            {
                found = true;
            }
            else if (obj.id !== undefined && typeof gid === 'number' && obj.id === gid)
            {
                found = true;
            }
            else if (obj.name !== undefined && typeof gid === 'string' && obj.name === gid)
            {
                found = true;
            }

            if (found)
            {
                var sprite = new CustomClass(this.game, parseFloat(obj.x, 10), parseFloat(obj.y, 10), key, frame);

                sprite.name = obj.name;
                sprite.autoCull = autoCull;
                sprite.exists = exists;
                sprite.visible = obj.visible;

                if (adjustSize)
                {
                    if (obj.width)
                    {
                        sprite.width = obj.width;
                    }

                    if (obj.height)
                    {
                        sprite.height = obj.height;
                    }
                }

                if (obj.rotation)
                {
                    sprite.angle = obj.rotation;
                }

                if (adjustY)
                {
                    sprite.y -= sprite.height;
                }

                group.add(sprite);

                if(!!obj.properties) {
                    for(var k = 0; k < obj.properties.length; k++) {
                        //sprite[obj.properties[k].name] = obj.properties[k].value;
                        group.set(sprite, obj.properties[k].name, obj.properties[k].value, false, false, 0, true);
                    }
                }
            }
        }

    };

    //game.add.plugin(Phaser.Plugin.Debug);

    GameData.LoadDataFromStorage();

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = 700;

    game.time.advancedTiming = true;
    game.time.desiredFps = 60;

    game.fpsProblemNotifier.add(function() {
        this.time.desiredFps = this.time.suggestedFps;
    }, game);

    cameraController = new CameraController();
    inputController = new InputController();
    energyController = new EnergyController();
    audioController = new AudioController();
    triggerController = new TriggerController();
    timerUtil = new TimerUtil();
    objectController = new ObjectController();
    backdropController = new BackdropController();
    effectsController = new EffectsController();

    Frogland.Create();
    
    weaponController = new WeaponController();
    projectileController = new ProjectileController();
    speechController = new SpeechController();
    speechController.Create();

    ScriptRunner.create();

    game.state.start('GameState', false, false);


    Phaser.Physics.Arcade.Body.prototype.preUpdate = function () {

        if (!this.enable || this.game.physics.arcade.isPaused)
        {
            return;
        }

        this.dirty = true;

        //  Store and reset collision flags
        this.wasTouching.none = this.touching.none;
        this.wasTouching.up = this.touching.up;
        this.wasTouching.down = this.touching.down;
        this.wasTouching.left = this.touching.left;
        this.wasTouching.right = this.touching.right;

        this.touching.none = true;
        this.touching.up = false;
        this.touching.down = false;
        this.touching.left = false;
        this.touching.right = false;

        this.blocked.up = false;
        this.blocked.down = false;
        this.blocked.left = false;
        this.blocked.right = false;

        this.embedded = false;

        this.updateBounds();

        this.position.x = (this.sprite.world.x - (this.sprite.anchor.x * this.width)) + this.sprite.scale.x * this.offset.x;
        //this.position.x -= this.sprite.scale.x < 0 ? this.width : 0;

        this.position.y = (this.sprite.world.y - (this.sprite.anchor.y * this.height)) + this.sprite.scale.y * this.offset.y;
        //this.position.y -= this.sprite.scale.y < 0 ? this.height : 0;

        this.rotation = this.sprite.angle;

        this.preRotation = this.rotation;

        if (this._reset || this.sprite.fresh)
        {
            this.prev.x = this.position.x;
            this.prev.y = this.position.y;
        }

        if (this.moves)
        {
            this.game.physics.arcade.updateMotion(this);

            this.newVelocity.set(this.velocity.x * this.game.time.physicsElapsed, this.velocity.y * this.game.time.physicsElapsed);

            this.position.x += this.newVelocity.x * GameState.physicsSlowMo;
            this.position.y += this.newVelocity.y * GameState.physicsSlowMo;

            if (this.position.x !== this.prev.x || this.position.y !== this.prev.y)
            {
                this.angle = Math.atan2(this.velocity.y, this.velocity.x) * GameState.physicsSlowMo;
            }

            this.speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);

            //  Now the State update will throw collision checks at the Body
            //  And finally we'll integrate the new position back to the Sprite in postUpdate

            if (this.collideWorldBounds)
            {
                if (this.checkWorldBounds() && this.onWorldBounds)
                {
                    this.onWorldBounds.dispatch(this.sprite, this.blocked.up, this.blocked.down, this.blocked.left, this.blocked.right);
                }
            }
        }

        this._dx = this.deltaX();
        this._dy = this.deltaY();

        this._reset = false;
    };

    Phaser.Animation.prototype.update = function () {

        if (this.isPaused)
        {
            return false;
        }

        if (this.isPlaying && this.game.time.time >= this._timeNextFrame)
        {
            this._frameSkip = 1;

            //  Lagging?
            this._frameDiff = this.game.time.time - this._timeNextFrame;

            this._timeLastFrame = this.game.time.time;

            if (this._frameDiff > this.delay)
            {
                //  We need to skip a frame, work out how many
                this._frameSkip = Math.floor(this._frameDiff / this.delay);
                this._frameDiff -= (this._frameSkip * this.delay);
            }

            //  And what's left now?
            this._timeNextFrame = this.game.time.time + ((this.delay * (1 / GameState.physicsSlowMo)) - this._frameDiff);

            if (this.isReversed)
            {
                this._frameIndex -= this._frameSkip;
            }
            else
            {
                this._frameIndex += this._frameSkip;
            }

            if (!this.isReversed && this._frameIndex >= this._frames.length || this.isReversed && this._frameIndex <= -1)
            {
                if (this.loop)
                {
                    // Update current state before event callback
                    this._frameIndex = Math.abs(this._frameIndex) % this._frames.length;

                    if (this.isReversed)
                    {
                        this._frameIndex = this._frames.length - 1 - this._frameIndex;
                    }

                    this.currentFrame = this._frameData.getFrame(this._frames[this._frameIndex]);

                    //  Instead of calling updateCurrentFrame we do it here instead
                    if (this.currentFrame)
                    {
                        this._parent.setFrame(this.currentFrame);
                    }

                    this.loopCount++;
                    this._parent.events.onAnimationLoop$dispatch(this._parent, this);
                    this.onLoop.dispatch(this._parent, this);

                    if (this.onUpdate)
                    {
                        this.onUpdate.dispatch(this, this.currentFrame);

                        // False if the animation was destroyed from within a callback
                        return !!this._frameData;
                    }
                    else
                    {
                        return true;
                    }
                }
                else
                {
                    this.complete();
                    return false;
                }
            }
            else
            {
                return this.updateCurrentFrame(true);
            }
        }

        return false;

    };

    game.physics.arcade.computeVelocity = function (axis, body, velocity, acceleration, drag, max) {
        if (max === undefined) { max = 10000; }

        if (axis === 1 && body.allowGravity) {
            velocity += (this.gravity.x + body.gravity.x) * this.game.time.physicsElapsed * GameState.physicsSlowMo;
        } else if (axis === 2 && body.allowGravity) {
            velocity += (this.gravity.y + body.gravity.y) * this.game.time.physicsElapsed * GameState.physicsSlowMo;
        }

        if (acceleration) {
            velocity += acceleration * this.game.time.physicsElapsed * GameState.physicsSlowMo;
        } else if (drag) {
            drag *= this.game.time.physicsElapsed;

            if (velocity - drag > 0)  {
                velocity -= drag * GameState.physicsSlowMo;
            } else if (velocity + drag < 0) {
                velocity += drag * GameState.physicsSlowMo;
            } else {
                velocity = 0;
            }
        }

        if (velocity > max) {
            velocity = max;
        } else if (velocity < -max) {
            velocity = -max;
        }

        return velocity;
    };

};
