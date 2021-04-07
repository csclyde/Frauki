Enemy.prototype.types['Buzzar'] =  function() {

    this.body.setSize(16, 30, 0, 0);
    this.anchor.setTo(0.5);

    this.animations.add('idle', ['Buzzar/Idle0000', 'Buzzar/Idle0001'], 20, true, false);
    this.animations.add('enraged', ['Buzzar/Enraged0000', 'Buzzar/Enraged0001', 'Buzzar/Enraged0002', 'Buzzar/Enraged0003'], 20, true, false);
    this.animations.add('sting', ['Buzzar/Attack0000', 'Buzzar/Attack0001'], 20, false, false);
    this.animations.add('hurt', ['Buzzar/Hurt0000', 'Buzzar/Hurt0001'], 12, true, false);

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

        EnemyBehavior.FaceForward(this);

    };

    this.Act = function() {

        if(EnemyBehavior.Player.IsVisible(this)) {

            if(EnemyBehavior.Player.IsVulnerable(this) && this.CanAttack()) {
                this.Sting();
            } else {
                this.Creep();
            }

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
        
        this.body.velocity.y = Math.sin((this.hoverOffset + GameState.gameTime) / 250) * 100;

        return true;
    };

    this.PreStinging = function() {
        this.PlayAnim('idle');

        this.body.velocity.x = 0;
        this.body.velocity.y = 0;

        if(this.timers.TimerUp('attack')) {
            this.timers.SetTimer('attack', 800);
            this.state = this.Stinging;
            game.physics.arcade.moveToXY(this, frauki.body.center.x, frauki.body.center.y, 400);
            EnemyBehavior.FacePlayer(this);
        }
    };

    this.Stinging = function() {
        this.PlayAnim('sting');

        // game.physics.arcade.overlap(this, frauki, function() {
        //     this.timers.SetTimer('attack', 0);
        // }, null, this);

        if(this.timers.TimerUp('attack') || this.body.onFloor() || this.body.onWall()) {
            this.SetAttackTimer(2000 + game.rnd.between(500, 1500));
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
        locus.x = frauki.body.center.x + (Math.sin(GameState.gameTime / 150) * 30);
        locus.y = frauki.body.center.y - 150 + (Math.sin(GameState.gameTime / 50) * 100 + (Math.random() * 40 - 20));

        //EnemyBehavior.FacePlayer(this);
        game.physics.arcade.moveToXY(this, locus.x, locus.y, 40);

        return true;
    };

    this.Enraged = function() {
        this.PlayAnim('enraged');

        EnemyBehavior.FacePlayer(this);

        if(this.body.x < frauki.body.x)
            this.body.velocity.x += 10;
        else
            this.body.velocity.x -= 10;

        if(this.body.y < frauki.body.y)
            this.body.velocity.y += 10;
        else
            this.body.velocity.y -= 10;

        if(this.body.velocity.x > 200)
            this.body.velocity.x = 200;

        if(this.body.velocity.x < -200)
            this.body.velocity.x = -200;

        if(this.body.velocity.y > 200)
            this.body.velocity.y = 200;

        if(this.body.velocity.y < -200)
            this.body.velocity.y = -200;

        if(this.timers.TimerUp('enraged')) {
            return true;
        }
    }

};
