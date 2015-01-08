function CustomCollider(spriteBody, collisionLayer) {
    //add a collision layer property to the sprite
    spriteBody.collisionLayer = collisionLayer;
    
    console.log('this is happening');
    
    spriteBody.preUpdate = function () {

        if (!this.enable)
        {
            return;
        }

        this.phase = 1;

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

        this.position.x = (this.sprite.world.x - (this.sprite.anchor.x * this.width)) + this.offset.x;
        this.position.y = (this.sprite.world.y - (this.sprite.anchor.y * this.height)) + this.offset.y;
        this.rotation = this.sprite.angle;

        this.preRotation = this.rotation;

        if (this._reset || this.sprite._cache[4] === 1)
        {
            this.prev.x = this.position.x;
            this.prev.y = this.position.y;
        }

        if (this.moves)
        {
            this.game.physics.arcade.updateMotion(this);

            this.newVelocity.set(this.velocity.x * this.game.time.physicsElapsed, this.velocity.y * this.game.time.physicsElapsed);

            //increment the position by the width, and test for collision. if a collision happens, then move it
            //back to the old position and increment pixel by pixel
            //this.position.x += this.newVelocity.x;
            
            //for every pixel that will be moved
            for(var i = 0; i < Math.abs(this.newVelocity.x); i++) {
                console.log('Moving ' + this.newVelocity.x + ' pixels');
                //check the direction of the velocity
                if(this.newVelocity.x > 0) {
                    //move ourselves to the right by a pixel, then check for overlap.
                    //if its no good move back and prevent more movement
                    this.position.x += 1;
                    
                    if(game.physics.arcade.overlap(this, this.collisionLayer)) {
                        this.position.x -= 1;
                        break;
                    }
                } else {
                    this.position.x -= 1;
                    
                    if(game.physics.arcade.overlap(this, this.collisionLayer)) {
                        this.position.x += 1;
                        break;
                    }
                }
            }
            
            //this.position.y += this.newVelocity.y;
            for(var i = 0; i < Math.abs(this.newVelocity.y); i++) {
                //check the direction of the velocity
                if(this.newVelocity.y > 0) {
                    //move ourselves to the right by a pixel, then check for overlap.
                    //if its no good move back and prevent more movement
                    this.position.y += 1;
                    
                    if(game.physics.arcade.overlap(this, this.collisionLayer)) {
                        this.position.y -= 1;
                        break;
                    }
                } else {
                    this.position.y -= 1;
                    
                    if(game.physics.arcade.overlap(this, this.collisionLayer)) {
                        this.position.y += 1;
                        break;
                    }
                }
            }

            if (this.position.x !== this.prev.x || this.position.y !== this.prev.y)
            {
                this.speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
                this.angle = Math.atan2(this.velocity.y, this.velocity.x);
            }

            //  Now the State update will throw collision checks at the Body
            //  And finally we'll integrate the new position back to the Sprite in postUpdate

            if (this.collideWorldBounds)
            {
                this.checkWorldBounds();
            }
        }

        this._dx = this.deltaX();
        this._dy = this.deltaY();

        this._reset = false;
    }
}
