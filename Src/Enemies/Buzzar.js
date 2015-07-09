Enemy.prototype.types['Buzzar'] =  function() {

    this.body.setSize(16, 30, 0, 5);
    this.anchor.setTo(0.5, 0.5);

    this.animations.add('idle', ['Buzzar/Idle0000', 'Buzzar/Idle0001'], 20, true, false);
    this.animations.add('sting', ['Buzzar/Attack0000', 'Buzzar/Attack0001'], 20, false, false);
    this.animations.add('hurt', ['Buzzar/Hurt0000'], 20, true, false);

    this.wanderDirection = 'left';

    this.hitVel = 0;

    this.stingTimer = 0;
    this.stingRestTimer = 0;

    this.anger = 1;

    this.hoverOffset = Math.random() * 300;
    
    this.weight = 0.5;
    this.energy = 4;
    this.damage = 3;
    this.poise = 5;

    this.wanderTimer = 0;

    this.squashTween = null;

    this.baseStunDuration = 800;
    this.playerSeen = false;

    this.updateFunction = function() {

        if(!!this.squashTween && !this.squashTween.isRunning) {
            this.scale.y = 1;
        }

        this.body.allowGravity = false;
        this.body.gravity.y = 0;

    };

    ///////////////////////////////ACTIONS////////////////////////////////////
    this.Sting = function() {
        if(frauki.body.y <= this.body.y)
            return;

        this.stingTimer = game.time.now + 400;
        this.stingRestTimer = game.time.now + 300 + (Math.random() * 1500);

        this.state = this.PreStinging;
        this.squashTween = game.add.tween(this.scale).to({y: 0.7}, 300, Phaser.Easing.Exponential.Out, true);
    };

    this.ChangeDirection = function() {
        var dir = Math.random() * 4;

        if(this.body.touching.left)
            this.wanderDirection = 'right';
        else if(this.body.touching.right)
            this.wanderDirection = 'left';
    };

    this.TakeHit = function(power) {

        //a durability stat should modify how long they are stunned for. also, the amount of dmg
        if(this.anger < 3) this.anger++;
        else this.state = this.Enraged;


        if(this.state === this.Stinging || this.state === this.PreStinging) {
        	this.state = this.Idling;
        }

    };

    this.Die = function() {
        this.anger = 1;
        this.state = this.Idling;
    };

    ////////////////////////////////STATES////////////////////////////////////
    this.Idling = function() {

        if(this.playerSeen === true) {
            this.state = this.Creepin;
        }
        
        this.PlayAnim('idle');

        
        this.body.velocity.y = Math.sin((this.hoverOffset + game.time.now) / 250) * 100;
        //this.body.velocity.x = Math.sin(game.time.now / 1000) * 20;

        if(this.wanderTimer > game.time.now) {
            switch(this.wanderDirection) {
                case 'left': this.body.velocity.x -= 30; break;
                case 'right': this.body.velocity.x += 30; break;
            }

            this.wanderTimer = game.time.now + 1000 + (Math.random() * 200);
        }

        if(this.PlayerIsVisible())
            this.state = this.Creepin;

        if(this.body.onFloor() || this.body.onWall())
            this.ChangeDirection();
    };

    this.PreStinging = function() {
        this.PlayAnim('idle');
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;

        if(game.time.now > this.stingTimer) {
            this.stingTimer = game.time.now + 2000;
            this.state = this.Stinging;
            this.squashTween = game.add.tween(this.scale).to({y: 1.5}, 200, Phaser.Easing.Exponential.In, true);
            game.physics.arcade.moveToXY(this, frauki.body.center.x, frauki.body.center.y, 450);
        }
    };

    this.Stinging = function() {
        this.PlayAnim('sting');

        if(this.game.time.now > this.stingTimer)
            this.state = this.Idling;

        if(this.body.onFloor() || this.body.onWall())
            this.state = this.Idling;

        game.physics.arcade.overlap(this, frauki, function() {
            this.state = this.Idling;
        }, null, this);
    };

    this.Hurting = function() {
    	this.PlayAnim('hurt');

        this.body.allowGravity = true;
        this.body.gravity.y = game.physics.arcade.gravity.y * 2;

        if(this.timers.TimerUp('hit')) {
            this.state = this.Idling;
        }
            
    };

    this.Creepin = function() {
    	this.PlayAnim('idle');

        if(!this.PlayerIsVisible()) {
            //this.state = this.Idling;
            this.playerSeen = true;
        }

        //move to a point somewhere above fraukis head
        var locus = {};
        locus.x = frauki.body.center.x + (Math.sin(game.time.now / 150) * 50);
        locus.y = frauki.body.center.y - 300 + (Math.sin(game.time.now / 50) * 100 + (Math.random() * 40 - 20));

        game.physics.arcade.moveToXY(this, locus.x, locus.y, 40);

        if(Math.floor(Math.random() * 100) <= this.anger && game.time.now > this.stingRestTimer && this.PlayerIsVisible()) 
            this.Sting();
    };

    this.Enraged = function() {
        this.PlayAnim('idle');

        if(this.body.x < frauki.body.x)
            this.body.velocity.x += 10;
        else
            this.body.velocity.x -= 10;

        if(this.body.y < frauki.body.y)
            this.body.velocity.y += 10;
        else
            this.body.velocity.y -= 10;

        if(this.body.velocity.x > 600)
            this.body.velocity.x = 600;

        if(this.body.velocity.x < -600)
            this.body.velocity.x = -600;

        if(this.body.velocity.y > 600)
            this.body.velocity.y = 600;

        if(this.body.velocity.y < -600)
            this.body.velocity.y = -600;
    }

};
