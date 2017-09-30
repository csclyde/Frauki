var Loading = new Phaser.State();

Loading.preload = function() {
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

Loading.create = function() {

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

    //game.add.plugin(Phaser.Plugin.Debug);

    GameData.LoadDataFromStorage();

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = 700;

    game.time.advancedTiming = true;
    game.time.desiredFps = 60;

    game.fpsProblemNotifier.add(function() {
        this.time.desiredFps = this.time.suggestedFps;
        console.log('Switching FPS to: ' + this.time.suggestedFps);
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

    game.state.start('Main', false, false);


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

            this.position.x += this.newVelocity.x * Main.physicsSlowMo;
            this.position.y += this.newVelocity.y * Main.physicsSlowMo;

            if (this.position.x !== this.prev.x || this.position.y !== this.prev.y)
            {
                this.angle = Math.atan2(this.velocity.y, this.velocity.x) * Main.physicsSlowMo;
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

    //console.log(Phaser.Animation)
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
            this._timeNextFrame = this.game.time.time + ((this.delay * (1 / Main.physicsSlowMo)) - this._frameDiff);

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

    // Phaser.Physics.Arcade.Body.prototype.postUpdate = function () {

    //     //  Only allow postUpdate to be called once per frame
    //     if (!this.dirty || !this.enable)
    //     {
    //         return;
    //     }

    //     this.dirty = false;

    //     // if (this.deltaX() < 0)
    //     // {
    //     //     this.facing = Phaser.LEFT;
    //     // }
    //     // else if (this.deltaX() > 0)
    //     // {
    //     //     this.facing = Phaser.RIGHT;
    //     // }

    //     // if (this.deltaY() < 0)
    //     // {
    //     //     this.facing = Phaser.UP;
    //     // }
    //     // else if (this.deltaY() > 0)
    //     // {
    //     //     this.facing = Phaser.DOWN;
    //     // }

    //     if (this.moves)
    //     {
    //         this._dx = this.deltaX();
    //         this._dy = this.deltaY();

    //         if (this.deltaMax.x !== 0 && this._dx !== 0)
    //         {
    //             if (this._dx < 0 && this._dx < -this.deltaMax.x)
    //             {
    //                 this._dx = -this.deltaMax.x;
    //             }
    //             else if (this._dx > 0 && this._dx > this.deltaMax.x)
    //             {
    //                 this._dx = this.deltaMax.x;
    //             }
    //         }

    //         if (this.deltaMax.y !== 0 && this._dy !== 0)
    //         {
    //             if (this._dy < 0 && this._dy < -this.deltaMax.y)
    //             {
    //                 this._dy = -this.deltaMax.y;
    //             }
    //             else if (this._dy > 0 && this._dy > this.deltaMax.y)
    //             {
    //                 this._dy = this.deltaMax.y;
    //             }
    //         }

    //         this.sprite.position.x += this._dx;
    //         this.sprite.position.y += this._dy;
    //         this._reset = true;
    //     }

    //     this.center.setTo(this.position.x + this.halfWidth, this.position.y + this.halfHeight);

    //     if (this.allowRotation)
    //     {
    //         this.sprite.angle += this.deltaZ();
    //     }

    //     this.prev.x = this.position.x;
    //     this.prev.y = this.position.y;
    // };

    // Phaser.Sound.prototype.fadeComplete = function () {

    //     this.onFadeComplete.dispatch(this, this.volume);

    // };

    game.physics.arcade.computeVelocity = function (axis, body, velocity, acceleration, drag, max) {
        if (max === undefined) { max = 10000; }

        if (axis === 1 && body.allowGravity) {
            velocity += (this.gravity.x + body.gravity.x) * this.game.time.physicsElapsed * Main.physicsSlowMo;
        } else if (axis === 2 && body.allowGravity) {
            velocity += (this.gravity.y + body.gravity.y) * this.game.time.physicsElapsed * Main.physicsSlowMo;
        }

        if (acceleration) {
            velocity += acceleration * this.game.time.physicsElapsed * Main.physicsSlowMo;
        } else if (drag) {
            drag *= this.game.time.physicsElapsed;

            if (velocity - drag > 0)  {
                velocity -= drag * Main.physicsSlowMo;
            } else if (velocity + drag < 0) {
                velocity += drag * Main.physicsSlowMo;
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

    // Phaser.Sprite.prototype.preUpdate = function() {

    //     if (!this.preUpdateInWorld())
    //     {
    //         return false;
    //     }

    //     if (!this.preUpdateLifeSpan())
    //     {
    //         return false;
    //     }

    //     if (!this.preUpdatePhysics())
    //     {
    //         return false;
    //     }

    //     return this.preUpdateCore();
    // };

    // Phaser.Component.PhysicsBody.preUpdate = function () {

    //     if(this.body.enable) {
    //         if (this.fresh && this.exists) {

    //             // this.world.setTo(this.parent.position.x + this.position.x, this.parent.position.y + this.position.y);
    //             // this.worldTransform.tx = this.world.x;
    //             // this.worldTransform.ty = this.world.y;

    //             // this.previousPosition.set(this.world.x, this.world.y);
    //             // this.previousRotation = this.rotation;

    //             if (this.body)
    //             {
    //                 this.body.preUpdate();
    //             }

    //             this.fresh = false;

    //             return false;
    //         }

    //         // this.previousPosition.set(this.world.x, this.world.y);
    //         // this.previousRotation = this.rotation;
    //     }

    //     if (!this._exists || !this.parent.exists)
    //     {
    //         this.renderOrderID = -1;
    //         return false;
    //     }

    //     return true;
    // };

    // PIXI.DisplayObjectContainer.prototype.updateTransform = function() {
    //     if (!this.visible)
    //     {
    //         return;
    //     }

    //     this.displayObjectUpdateTransform();

    //     if (this._cacheAsBitmap)
    //     {
    //         return;
    //     }

    //     for (var i = 0, len = this.children.length; i < len; i++)
    //     {
    //         this.children[i].updateTransform();
    //     }
    // };

    // Phaser.TilemapLayer.prototype.postUpdate = function () {

    //     Phaser.Component.FixedToCamera.postUpdate.call(this);

    //     this.scrollX = this.game.camera.x;
    //     this.scrollY = this.game.camera.y;

    //     this.render();
    // };

    // Phaser.Component.Core.postUpdate = function() {

    //     // if (this.key instanceof Phaser.BitmapData)
    //     // {
    //     //     this.key.render();
    //     // }

    //     if (this.components.PhysicsBody)
    //     {
    //         Phaser.Component.PhysicsBody.postUpdate.call(this);
    //     }

    //     if (this.components.FixedToCamera)
    //     {
    //         Phaser.Component.FixedToCamera.postUpdate.call(this);
    //     }

    //     for (var i = 0, len = this.children.length; i < len; i++)
    //     {
    //         this.children[i].postUpdate();
    //     }
    // };
};
