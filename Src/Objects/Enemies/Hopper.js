Enemy.prototype.types['Hopper'] =  function() {

    this.body.setSize(25, 12, 0, 5);
    this.anchor.setTo(0.5, 0.5);

    this.animations.add('idle', ['Misc/Hopper0000'], 10, true, false);
    this.animations.add('jump', ['Misc/Hopper0001'], 10, true, false);
    this.animations.add('fall', ['Misc/Hopper0002'], 10, true, false);
    

    this.damage = 1;
    this.energy = 1;

    this.body.maxVelocity.y = 500;


    this.updateFunction = function() {
        
    };

    this.Act = function() {
        this.Hop();
    };

    this.CanCauseDamage = function() {
        if(!this.body.onFloor()) {
            return true;
        } else {
            return false;
        }
    };

    this.LandHit = function() {
        
    };

    ///////////////////////////////ACTIONS////////////////////////////////////
    this.Hop = function() {

        this.body.velocity.x = 300;
        this.body.velocity.y = -200;

        if(game.rnd.between(0, 1) === 1) {
            this.body.velocity.x *= -1;
        }

        this.timers.SetTimer('jump_wait', game.rnd.between(1000, 2000));
        EnemyBehavior.FaceForward(this);
    };

    ////////////////////////////////STATES////////////////////////////////////
    this.Idling = function() {
        if(this.body.onFloor()) {
            this.PlayAnim('idle');
            this.body.drag.x = 600;
        } else if(this.body.velocity.y < 0) {
            this.PlayAnim('jump');
            this.body.drag.x = 200;
        } else if(this.body.velocity.y > 0) {
            this.PlayAnim('fall');
            this.body.drag.x = 200;
        }



        if(this.timers.TimerUp('jump_wait')) {
            return true;
        } else {
            return false;
        }
    };

};
