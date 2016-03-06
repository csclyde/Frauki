Enemy.prototype.types['Buzzar'] =  function() {

    this.body.setSize(16, 30, 0, 0);
    this.anchor.setTo(0.5);

    this.animations.add('idle', ['Buzzar/Idle0000', 'Buzzar/Idle0001'], 20, true, false);
    this.animations.add('sting', ['Buzzar/Attack0000', 'Buzzar/Attack0001'], 20, false, false);
    this.animations.add('hurt', ['Buzzar/Hurt0000', 'Buzzar/Hurt0001'], 20, true, false);

    this.wanderDirection = 'left';

    this.anger = 1;

    this.hoverOffset = Math.random() * 300;
    
    this.energy = 2;
    this.damage = 1;

    this.baseStunDuration = 800;

    this.body.drag.setTo(0);


    this.updateFunction = function() {

        this.body.allowGravity = false;
        this.body.gravity.y = 0;

    };

    this.Act = function() {

        if(EnemyBehavior.Player.IsVisible(this)) {

            if(this.timers.TimerUp('creep_waiting')) {
                this.Sting();
            } else {
                this.Creep();
            }

        //     if(this.body.onFloor()) {

        //         if(EnemyBehavior.Player.IsDangerous(this) || EnemyBehavior.Player.IsNear(this, 20)) {
        //             this.Dodge();
        //         }
        //         else if(EnemyBehavior.Player.IsNear(this, 50)) {
        //             this.Dodge();
        //         } 
        //         else if(!frauki.body.onFloor()) {
        //             this.Hop();
        //         } 
        //         else {
        //             if(EnemyBehavior.RollDice(2, 1)) {
        //                 this.Scuttle();
        //             } else {
        //                 this.Hop();
        //             }
        //         }

        //     } else {
        //         if(EnemyBehavior.Player.IsBelow(this)) {
        //             this.Dive();
        //         }
        //     }

        } else {
            this.state = this.Idling;
        }
    };

    this.CanCauseDamage = function() {
        if(this.state === this.Stinging || this.state === this.Enraged) {
            return true;
        } else {
            return false;
        }
    };

    this.LandHit = function() {
        if(this.state === this.Enraged) {
            this.timers.SetTimer('enraged', 0);
        }
    };

    ///////////////////////////////ACTIONS////////////////////////////////////
    this.Sting = function() {
        if(frauki.body.y <= this.body.y)
            return;

        this.timers.SetTimer('attack', 600);

        EnemyBehavior.FacePlayer(this);
        this.state = this.PreStinging;
    };

    this.Creep = function() {
        this.state = this.Creepin;
    };

    this.ChangeDirection = function() {
        if(this.wanderDirection === 'right') {
            this.wanderDirection = 'left';
        } else {
            this.wanderDirection = 'right';
        }
    };

    this.Die = function() {
        this.anger = 1;
        this.state = this.Idling;
    };

    ////////////////////////////////STATES////////////////////////////////////
    this.Idling = function() {
        this.PlayAnim('idle');
        
        this.body.velocity.y = Math.sin((this.hoverOffset + game.time.now) / 250) * 100;

        if(this.wanderDirection === 'left') {
            this.body.velocity.x = 100;
        } else if(this.wanderDirection === 'right') {
            this.body.velocity.x = -100;
        }

        if(this.body.onWall()) {
            this.ChangeDirection();
        }

        return true;
    };

    this.PreStinging = function() {
        this.PlayAnim('idle');

        this.body.velocity.x = 0;
        this.body.velocity.y = 0;

        if(this.timers.TimerUp('attack')) {
            this.timers.SetTimer('attack', 800);
            this.state = this.Stinging;
            game.physics.arcade.moveToXY(this, frauki.body.center.x, frauki.body.center.y, 450);
            EnemyBehavior.FacePlayer(this);
        }
    };

    this.Stinging = function() {
        this.PlayAnim('sting');

        // game.physics.arcade.overlap(this, frauki, function() {
        //     this.timers.SetTimer('attack', 0);
        // }, null, this);

        if(this.timers.TimerUp('attack') || this.body.onFloor() || this.body.onWall()) {
            this.timers.SetTimer('creep_waiting', 3000 + game.rnd.between(500, 1500));
            return true;
        }

    };

    this.Hurting = function() {
    	this.PlayAnim('hurt');

        this.body.allowGravity = true;
        //this.body.gravity.y = game.physics.arcade.gravity.y * 2;

        if(this.timers.TimerUp('hit')) {
            this.state = this.Enraged;
            this.timers.SetTimer('enraged', 5000);
        }
            
    };

    this.Creepin = function() {
    	this.PlayAnim('idle');

        //move to a point somewhere above fraukis head
        var locus = {};
        locus.x = frauki.body.center.x + (Math.sin(game.time.now / 150) * 30);
        locus.y = frauki.body.center.y - 150 + (Math.sin(game.time.now / 50) * 100 + (Math.random() * 40 - 20));

        EnemyBehavior.FacePlayer(this);
        game.physics.arcade.moveToXY(this, locus.x, locus.y, 40);

        return true;
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

        if(this.body.velocity.x > 450)
            this.body.velocity.x = 450;

        if(this.body.velocity.x < -450)
            this.body.velocity.x = -450;

        if(this.body.velocity.y > 450)
            this.body.velocity.y = 450;

        if(this.body.velocity.y < -450)
            this.body.velocity.y = -450;

        if(this.timers.TimerUp('enraged')) {
            return true;
        }
    }

};
