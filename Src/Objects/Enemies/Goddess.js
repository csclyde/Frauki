Enemy.prototype.types['Goddess'] =  function() {

	goddess = this;

	this.body.setSize(40, 45, 0, 0);
	this.anchor.setTo(0.5);

    this.animations.add('idle', ['NPC/Goddess0000', 'NPC/Goddess0001'], 2, true, false);
    this.animations.add('stuff', ['NPC/Stand0000'], 10, false, false);

    this.energy = 5;
    this.baseStunDuration = 400;

	this.body.drag.x = 500;
	this.body.allowGravity = false;

	this.Vulnerable = function() { return false; }

	this.SetDirection('left');	
	
    this.messageQueue = GameData.GetVal('goddess_message_queue');
    this.deathMessage = GameData.GetVal('goddess_death_message');
	this.currentPortrait = 'Goddess_Neutral';
    
	this.updateFunction = function() {
		
	};

	this.Act = function() {
        this.state = this.Idling;
        this.body.velocity.x = 0;
    };

    this.OnHit = function() {
    	if(this.energy > 0) {
    		ScriptRunner.run('goddess_hurt_' + this.energy);
			GameData.SetFlag('goddess_smacked', true);
    	} else {
    		GameData.SetFlag('goddess_killed', true);
    	}
	};

    this.Reset = function() {

    };

	///////////////////////////////ACTIONS////////////////////////////////////
	this.GetSpeech = function() {

	};

	this.GetGameoverScript = function() {
		if(!GameData.HasShard('Wit')) {
			//INTRO AREA TRIGGERS
			if(!GameData.GetFlag('intro_finished')) {
				if(GameState.death.name === 'tower_troll' && !GameData.GetFlag('tower_troll1')) {
					GameData.SetFlag('tower_troll1', true);
					return 'tower_troll1';
				}
				else if(GameState.death.name === 'tower_troll' && !GameData.GetFlag('tower_troll2')) {
					GameData.SetFlag('tower_troll2', true);
					return 'tower_troll2';
				}
				else if(GameState.death.name === 'tower_troll' && !GameData.GetFlag('tower_troll3')) {
					GameData.SetFlag('tower_troll3', true);
					return 'tower_troll3';
				}
				else if(GameState.death.name === 'tower_troll' && !GameData.GetFlag('tower_troll_final')) {
					GameData.SetFlag('tower_troll_final', true);
					return 'tower_troll_final';
				}
				else if(!GameData.GetFlag('first_death')) {
					GameData.SetFlag('first_death', true);
					return 'goddess_surprised_death1';
				}
				else if(!GameData.GetFlag('second_death')) {
					GameData.SetFlag('second_death', true);
					return 'goddess_surprised_death2';
				}
				else if(!GameData.GetFlag('third_death')) {
					GameData.SetFlag('third_death', true);
					return 'goddess_surprised_death3';
				}
				else {
					return 'goddess_surprised_death_final';
				}
			}
			//FIRST RUINS AREA TRIGGERS
			else if(!GameData.IsDoorOpen('statue_shortcut')) {
				if(GameData.data.upgrades.includes('Health2')  && !GameData.GetFlag('first_health_upgrade')) {
					GameData.SetFlag('first_health_upgrade', true);
					return 'first_health_upgrade';
				}
				else if(GameState.death.type === 'Buzzar' && !GameData.GetFlag('first_buzzar')) {
					GameData.SetFlag('first_buzzar', true);
					return 'first_buzzar';
				}
				else if(GameState.death.name === 'first_gubr' && !GameData.GetFlag('first_gubr')) {
					GameData.SetFlag('first_gubr', true);
					return 'first_gubr';
				}
				else {
					return 'goddess_console_area1';
				}
			}
			//SECOND RUINS AREA
			else if(!GameData.IsDoorOpen('drop_to_right')) {
				
				if(GameState.death.name === 'first_ql0k' && !GameData.GetFlag('first_ql0k')) {
					GameData.SetFlag('first_ql0k', true);
					return 'first_ql0k';
				}
				else if(GameState.death.name === 'second_ql0k' && !GameData.GetFlag('second_ql0k')) {
					GameData.SetFlag('second_ql0k', true);
					return 'second_ql0k';
				}
				else if(!GameData.GetFlag('statue_shortcut')) {
					GameData.SetFlag('statue_shortcut', true);
					return 'first_shortcut';
				}
				else {
					return 'goddess_console_area2';
				}
			}
			//GARDENS BEFORE WIT GEM
			else {	
				if(GameState.death.name === 'first_kr32' && !GameData.GetFlag('first_kr32')) {
					GameData.SetFlag('first_kr32', true);
					return 'first_kr32';
				}
				else if(GameState.death.name === 'wit_guard' && !GameData.GetFlag('wit_guard')) {
					GameData.SetFlag('wit_guard', true);
					return 'wit_guard';
				}
				else if(GameState.death.name === 'wit_guard' && !GameData.GetFlag('wit_guard2')) {
					GameData.SetFlag('wit_guard2', true);
					return 'wit_guard2';
				}
				else if(GameState.death.name === 'wit_guard' && !GameData.GetFlag('wit_guard3')) {
					GameData.SetFlag('wit_guard3', true);
					return 'wit_guard3';
				}
				else if(GameState.death.name === 'wit_guard') {
					return 'wit_guard_final';
				}
				else if(!GameData.GetFlag('ship_frontdoor')) {
					GameData.SetFlag('ship_frontdoor', true);
					return 'second_shortcut';
				}
				else {
					return 'goddess_console_area3';
				}
			}
		}
		else if(!GameData.HasShard('Will')) {
			//WIT GEM TO APARTMENTS SHORTCUT
			if(!GameData.IsDoorOpen('apartments_to_tower')) {
				if(GameData.IsCheckPointActive('1') && !GameData.GetFlag('first_checkpoint')) {
					GameData.SetFlag('first_checkpoint', true);
					return 'first_checkpoint';
				}
				else if(GameState.death.type === 'RKN1d' && !GameData.GetFlag('spider_death')) {
					GameData.SetFlag('spider_death', true);
					return 'spider_death';
				}
				else {
					return 'goddess_console_area4';
				}
			}
			//APARTMENTS SHORTCUT TO CHUTE SHORTCUT
			else if(!GameData.IsDoorOpen('vent_to_arches')) {
				if(GameState.death.name === 'first_hwk9' && !GameData.GetFlag('first_hwk9')) {
					GameData.SetFlag('first_hwk9', true);
					return 'first_hwk9';
				}
				else {
					return 'goddess_console_area4';
				}
			}
			//CHUTE SHORTCUT TO WILL GEM
			else {
				return 'goddess_console_area5';
			}
		}
		else if(!GameData.HasShard('Luck')) {
			if(!GameData.IsDoorOpen('deep_house_basement')) {
				
			}
			//BASEMENT SHORTCUT TO PIPE SHORTCUT
			else if(!GameData.IsDoorOpen('second_depths_cut')) {
				
			}
			//PIPE SHORTCUT TO HARD SHORTCUT
			else if(!GameData.IsDoorOpen('hard_depths_cut')) {
				
			}
			//HARD SHORTCUT TO LUCK GEM
			else {
				
			}
		}
		else if(!GameData.HasShard('Power')) {
			return 'goddess_console';
		}
		else {
			return 'goddess_console';			
		}

	};

	this.GetChatScript = function() {
		return 'goddess_chat_intro';
		
		if(!GameData.HasShard('Wit')) {
			//INTRO AREA TRIGGERS
			if(!GameData.GetFlag('intro_finished')) {
				
			}
			//FIRST RUINS AREA TRIGGERS
			else if(!GameData.IsDoorOpen('statue_shortcut')) {
				
			}
			//SECOND RUINS AREA
			else if(!GameData.IsDoorOpen('drop_to_right')) {
				
			}
			//GARDENS BEFORE WIT GEM
			else {	
				return 'goddess_chat_intro';			
			}
		}
		else if(!GameData.HasShard('Will')) {
			//WIT GEM TO APARTMENTS SHORTCUT
			if(!GameData.IsDoorOpen('apartments_to_tower')) {
				
			}
			//APARTMENTS SHORTCUT TO CHUTE SHORTCUT
			else if(!GameData.IsDoorOpen('vent_to_arches')) {
				
			}
			//CHUTE SHORTCUT TO WILL GEM
			else {
				return 'goddess_chat_intro';
			}
		}
		else if(!GameData.HasShard('Luck')) {
			if(!GameData.IsDoorOpen('deep_house_basement')) {
				
			}
			//BASEMENT SHORTCUT TO PIPE SHORTCUT
			else if(!GameData.IsDoorOpen('second_depths_cut')) {
				
			}
			//PIPE SHORTCUT TO HARD SHORTCUT
			else if(!GameData.IsDoorOpen('hard_depths_cut')) {
				
			}
			//HARD SHORTCUT TO LUCK GEM
			else {
				return 'goddess_chat_intro';			
			}
		}
		else if(!GameData.HasShard('Power')) {
			return 'goddess_chat_intro';
		}
		else {
			return 'goddess_chat_intro';			
		}
	};

	this.GetPortrait = function() {
		return this.currentPortrait;
	};

	////////////////////////////////STATES////////////////////////////////////
	this.Idling = function() {
		this.PlayAnim('idle');

		this.body.velocity.y = Math.sin((GameState.gameTime) / 500) * 5;		

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
};
