Enemy.prototype.types['NPC'] =  function() {

	this.body.setSize(20, 20, 0, 0);
	this.anchor.setTo(0.5);

	this.animations.add('gnome_city', ['NPC/cool0000'], 10, true, false);
    this.animations.add('gnome_cooking', ['NPC/cooking0000', 'NPC/cooking0001', 'NPC/cooking0002', 'NPC/cooking0003', 'NPC/cooking0004', 'NPC/cooking0005', 'NPC/cooking0006', 'NPC/cooking0007', 'NPC/cooking0008'], 3, true, false);
	this.animations.add('gnome_cool', ['NPC/cool0000', 'NPC/cool0001', 'NPC/cool0002', 'NPC/cool0003', 'NPC/cool0004', 'NPC/cool0005', 'NPC/cool0006', 'NPC/cool0007'], 4, true, false);
	this.animations.add('gnome_fishing', ['NPC/fishing0000', 'NPC/fishing0001', 'NPC/fishing0002', 'NPC/fishing0003', 'NPC/fishing0004', 'NPC/fishing0005', 'NPC/fishing0006', 'NPC/fishing0007', 'NPC/fishing0008', 'NPC/fishing0009', 'NPC/fishing0010', 'NPC/fishing0011', 'NPC/fishing0012', 'NPC/fishing0013', 'NPC/fishing0014'], 10, true, false);
	this.animations.add('gnome_garden', ['NPC/garden0000', 'NPC/garden0001', 'NPC/garden0002', 'NPC/garden0003', 'NPC/garden0004', 'NPC/garden0005', 'NPC/garden0006', 'NPC/garden0007', 'NPC/garden0008', 'NPC/garden0009', 'NPC/garden0010', 'NPC/garden0011'], 3, true, false);
	this.animations.add('gnome_gossip', ['NPC/gossip0000', 'NPC/gossip0001'], 3, true, false);
	this.animations.add('gnome_cowboy', ['NPC/hopper_rider0000', 'NPC/hopper_rider0001', 'NPC/hopper_rider0002', 'NPC/hopper_rider0003', 'NPC/hopper_rider0004', 'NPC/hopper_rider0005', 'NPC/hopper_rider0006', 'NPC/hopper_rider0007'], 4, true, false);
	this.animations.add('gnome_love', ['NPC/love_gnomes0000', 'NPC/love_gnomes0001', 'NPC/love_gnomes0002', 'NPC/love_gnomes0003', 'NPC/love_gnomes0004', 'NPC/love_gnomes0005', 'NPC/love_gnomes0006', 'NPC/love_gnomes0007'], 4, true, false);
	this.animations.add('gnome_mushroom', ['NPC/cool0000'], 10, true, false);
	this.animations.add('gnome_pickaxe', ['NPC/pickaxe0000', 'NPC/pickaxe0001', 'NPC/pickaxe0002', 'NPC/pickaxe0003', 'NPC/pickaxe0004', 'NPC/pickaxe0005', 'NPC/pickaxe0006', 'NPC/pickaxe0007', 'NPC/pickaxe0008', 'NPC/pickaxe0009', 'NPC/pickaxe0010', 'NPC/pickaxe0011', 'NPC/pickaxe0012', 'NPC/pickaxe0013', 'NPC/pickaxe0014', 'NPC/pickaxe0015', 'NPC/pickaxe00016', 'NPC/pickaxe0017', 'NPC/pickaxe0018'], 5, true, false);
	this.animations.add('gnome_sleepy', ['NPC/sleepy0000', 'NPC/sleepy0001', 'NPC/sleepy0002', 'NPC/sleepy0003', 'NPC/sleepy0004', 'NPC/sleepy0005'], 1, true, false);
	this.animations.add('gnome_windy', ['NPC/windy0000', 'NPC/windy0001', 'NPC/windy0002', 'NPC/windy0003', 'NPC/windy0004', 'NPC/windy0005', 'NPC/windy0006'], 5, true, false);
    this.animations.add('gnome_boat', ['NPC/boat0000', 'NPC/boat0001', 'NPC/boat0002', 'NPC/boat0003', 'NPC/boat0004', 'NPC/boat0005'], 5, true, false);

	this.animations.add('robo_puncher', ['NPC/robo_puncher0000', 'NPC/robo_puncher0001', 'NPC/robo_puncher0002', 'NPC/robo_puncher0003'], 4, true, false);
	this.animations.add('robo_chonker', ['NPC/robo_chonker0000', 'NPC/robo_chonker0001', 'NPC/robo_chonker0002', 'NPC/robo_chonker0003', 'NPC/robo_chonker0004', 'NPC/robo_chonker0005', 'NPC/robo_chonker0006', 'NPC/robo_chonker0007', 'NPC/robo_chonker0008', 'NPC/robo_chonker0009', 'NPC/robo_chonker0010'], 4, true, false);
	this.animations.add('robo_armed', ['NPC/robo_armed0000', 'NPC/robo_armed0001', 'NPC/robo_armed0002', 'NPC/robo_armed0003', 'NPC/robo_armed0004'], 4, true, false);
	this.animations.add('robo_spikey', ['NPC/robo_spikey0000', 'NPC/robo_spikey0001', 'NPC/robo_spikey0002', 'NPC/robo_spikey0003', 'NPC/robo_spikey0004', 'NPC/robo_spikey0005'], 4, true, false);
	this.animations.add('robo_samurai', ['NPC/robo_samurai0000', 'NPC/robo_samurai0001', 'NPC/robo_samurai0002', 'NPC/robo_samurai0003', 'NPC/robo_samurai0004', 'NPC/robo_samurai0005'], 4, true, false);
	this.animations.add('robo_slickback', ['NPC/robo_slickback0000', 'NPC/robo_slickback0001', 'NPC/robo_slickback0002'], 4, true, false);
	this.animations.add('robo_oldie', ['NPC/robo_oldie0000', 'NPC/robo_oldie0001', 'NPC/robo_oldie0002', 'NPC/robo_oldie0003', 'NPC/robo_oldie0004', 'NPC/robo_oldie0005', 'NPC/robo_oldie0006', 'NPC/robo_oldie0007', 'NPC/robo_oldie0008', 'NPC/robo_oldie0009', 'NPC/robo_oldie0010', 'NPC/robo_oldie0011', 'NPC/robo_oldie0012', 'NPC/robo_oldie0013'], 4, true, false);
	this.animations.add('robo_bouncer', ['NPC/robo_oldie0000', 'NPC/robo_oldie0001', 'NPC/robo_oldie0002', 'NPC/robo_oldie0003', 'NPC/robo_oldie0004', 'NPC/robo_oldie0005', 'NPC/robo_oldie0006', 'NPC/robo_oldie0007', 'NPC/robo_oldie0008', 'NPC/robo_oldie0009', 'NPC/robo_oldie0010', 'NPC/robo_oldie0011', 'NPC/robo_oldie0012', 'NPC/robo_oldie0013'], 4, true, false);
	this.animations.add('robo_brokenanimationsystemcomon', ['NPC/robo_oldiefdsaf0000'], 4, true, false);
	


    this.energy = 1;
	this.baseStunDuration = 400;

	this.collideWithPlayer = function() { return false; }
	this.Vulnerable = function() { return false; }
	
	this.body.drag.x = 500;
	
	this.state = this.Idling;

	this.create = function() {
		
		this.SetDirection('right');
	};

	this.updateFunction = function() {

	};

	this.Act = function() {
        this.state = this.Idling;
        this.body.velocity.x = 0;
    };

    this.OnHit = function() {
    	
    };

    this.Reset = function() {
    	
	};
	
	////////////////////////////////STATES////////////////////////////////////
	this.Idling = function() {
		this.PlayAnim(this.name);

		if(this.properties.name === 'boat') {
			this.body.gravity.y = -700;
		}
		//EnemyBehavior.FacePlayer(this);

		return true;
	};

	this.Hurting = function() {
		this.PlayAnim('hit');

		if(this.timers.TimerUp('hit')) {
			this.state = this.Idling;
			return true;
		}

		return false;
	};

	this.attackFrames = {

	};
};
