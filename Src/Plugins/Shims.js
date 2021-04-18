Phaser.Sprite.prototype.PlayAnim = function(name) {
    if(this.animations.currentAnim.name !== name)
        this.animations.play(name);
};

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
        this._timeNextFrame = this.game.time.time + ((this.delay) - this._frameDiff);

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

Phaser.Physics.Arcade.prototype.computeVelocity = function (axis, body, velocity, acceleration, drag, max) {
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

Phaser.Sound.prototype.fadeToPause = function (duration) {
    
    if (!this.isPlaying || this.paused)
    {
        return;
    }

    if (duration === undefined) { duration = 1000; }

    if(this.fadeTween && this.fadeTween.isRunning) {
        this.fadeTween.stop();
    }

    this.fadeTween = this.game.add.tween(this).to( { volume: 0 }, duration, Phaser.Easing.Exponential.Out, true);

    //this.fadeTween.onComplete.add(this.fadeComplete, this);
    this.fadeTween.onComplete.add(function() {
        this.pause();
    }, this);
};

Phaser.Sound.prototype.fadeToResume = function (duration, volume) {

    if(this.fadeTween && this.fadeTween.isRunning) {
        this.fadeTween.stop();
    }

    if (duration === undefined) { duration = 1000; }
    if (volume === undefined) { volume = 1; }

    if(this.volume !== volume) {     
        this.fadeTween = this.game.add.tween(this).to( { volume: volume }, duration, Phaser.Easing.Exponential.In, true);
    }
    
    if(this.paused) {      
        this.resume();
    } else {
        this.play();
        
    }
};

Phaser.Sound.prototype.fadeToStop = function (duration) {
    
    if (!this.isPlaying || this.paused)
    {
        return;
    }

    if (duration === undefined) { duration = 1000; }

    this.fadeTween = this.game.add.tween(this).to( { volume: 0 }, duration, Phaser.Easing.Exponential.Out, true);

    //this.fadeTween.onComplete.add(this.fadeComplete, this);
    this.fadeTween.onComplete.add(function() {
        this.stop();
    }, this);
};

Phaser.Animation.prototype.update = function () {
    
    if (this.isPaused || GameState.physicsSlowMo === 0)
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
        this._timeNextFrame = this.game.time.time + (this.delay - this._frameDiff);

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