Enemy.prototype.types['Insectoid'] =  function() {

    this.body.setSize(50, 25, 0, 10);
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
        
    };

    this.LandHit = function() {
        
    };

    ///////////////////////////////ACTIONS////////////////////////////////////
    this.Hop = function() {

        this.body.velocity.x = game.rnd.between(-300, 300);
        this.body.velocity.y = game.rnd.between(-100, -200);
        this.timers.SetTimer('jump_wait', game.rnd.between(1000, 2000));
        EnemyBehavior.FaceForward(this);
    };

    ////////////////////////////////STATES////////////////////////////////////
    this.Idling = function() {
        if(this.body.onFloor()) {
            this.PlayAnim('idle');
        } else if(this.body.velocity.y < 0) {
            this.PlayAnim('jump');
        } else if(this.body.velocity.y > 0) {
            this.PlayAnim('fall');
        }



        if(this.timers.TimerUp('jump_wait')) {
            return true;
        } else {
            return false;
        }
    };

};
