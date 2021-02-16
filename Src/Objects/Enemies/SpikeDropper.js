Enemy.prototype.types['SpikeDropper'] =  function() {

    this.body.setSize(25, 25, 0, 5);
    this.anchor.setTo(0.5, 0.5);

    this.animations.add('cling', ['Misc/SpikeDropper0000'], 10, true, false);
    this.animations.add('neutral', ['Misc/SpikeDropper0001'], 10, true, false);
    this.animations.add('fall', ['Misc/SpikeDropper0002'], 10, true, false);
    this.animations.add('squash', ['Misc/SpikeDropper0003'], 10, true, false);
    

    this.damage = 1;
    this.energy = 1;

    this.body.maxVelocity.y = 500;
    this.body.allowGravity = false;
    this.body.bounce.setTo(0);
    this.body.drag.x = 100;

    this.isSolid = true;


    this.updateFunction = function() {
        if(this.body.allowGravity === false && EnemyBehavior.Player.IsBelow(this) && EnemyBehavior.Player.IsVisible(this)) {
            this.Drop();
        }
    };

    this.Act = function() {
        this.state = this.Idling;
    };

    this.CanCauseDamage = function() {
        return true;
    };

    this.LandHit = function() {
        
    };

    ///////////////////////////////ACTIONS////////////////////////////////////
    this.Drop = function() {
        this.body.allowGravity = true;
    };

    this.Squash = function() {
		events.publish('play_sound', {name: 'Dropper_bounce', restart: true});

        if(this.timers.TimerUp('squash_wait')) {
            this.state = this.Squashing;
            this.timers.SetTimer('squash_wait', 75);
        }
    }

    ////////////////////////////////STATES////////////////////////////////////
    this.Idling = function() {
        if(!this.body.allowGravity) {
            this.PlayAnim('cling');
        } else {
            this.PlayAnim('neutral');
        }

        if(this.body.onFloor()) {
            this.Squash();
        }
        
        return false;
    };

    this.Squashing = function() {
        this.PlayAnim('squash');

        if(this.timers.TimerUp('squash_wait')) {
            this.state = this.Idling;
            this.body.velocity.y = game.rnd.between(-200, -350);
            this.body.velocity.x = game.rnd.between(-200, 200);
        }
    };

};
