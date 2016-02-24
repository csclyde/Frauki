Enemy.prototype.types['CreeperThistle'] =  function() {

    this.body.setSize(30, 25, 0, 0);
    this.anchor.setTo(.5);

    var frames = ["CreeperThistle/CreeperThistle0000", "CreeperThistle/CreeperThistle0001", "CreeperThistle/CreeperThistle0002", "CreeperThistle/CreeperThistle0003"];
    var i = Math.floor(Math.random() * 4);
    while(i--) {
        frames.push(frames.shift());
    }

    this.animations.add('idle', frames, 10, true, false);
    this.animations.add('shit', ["CreeperThistle/CreeperThistle0000"], 10, true, false);

    this.energy = 0.5;
    this.body.immovable = true;
    this.damage = 1;
    //this.body.allowGravity = false;

    this.state = this.Idling;

    //this.frameName = "CreeperThistle/CreeperThistle000" + 

    this.updateFunction = function() {
        this.rotation = this.Rotation;
    };

    this.CanCauseDamage =  function() {
        return true;
    }

    ///////////////////////////////ACTIONS////////////////////////////////////

    ////////////////////////////////STATES////////////////////////////////////
    this.Idling = function() {
        this.PlayAnim('idle');
    };

    this.Hurting = function() {
        this.PlayAnim('idle');

        if(this.timers.TimerUp('hit')) {
            this.state = this.Idling;
        }
    };

};
