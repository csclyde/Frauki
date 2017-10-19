
TriggerController.prototype.triggers['open_door'] = {
	enter: function(params) {

	},

	stay: function(params) {
		//if there are no enemies within the region
	},

	exit: function(params) {
	}
}

TriggerController.prototype.triggers['return_shard'] = {
	enter: function(params) {
		if(GetCurrentShardType() === 'Will') {
			var shard = frauki.carriedShard;

			shard.returnedToChurch = true;
			DropShard(shard);

			//122 179
			var slowTween = game.add.tween(shard.body.velocity).to({x: 0, y: 0}, 500, Phaser.Easing.Exponential.Out, true);

        	events.publish('fade_music', { volume: 0, duration: 9500, fadeDuration: 2000 });


			slowTween.onComplete.add(function() {
				var placementTween = game.add.tween(shard).to({x: 122 * 16 + 1, y: 179 * 16 + 14}, 5000, Phaser.Easing.Exponential.InOut, true);
				placementTween.onComplete.add(function() {
					GameData.SaveShardPositions();
					events.publish('play_sound', { name: 'fanfare_long' } );
				});
			});

			

			//Frogland.effectsGroup.addChild(shard);


		}
	},

	stay: function(params) {
	},

	exit: function(params) {
	}
};

TriggerController.prototype.triggers['soccer_goal'] = {
	enter: function(params) {
		events.publish('open_door', { door_name: 'soccer_goal' });
	},

	stay: function(params) {
	},

	exit: function(params) {
	}
};

TriggerController.prototype.triggers['heal_to_open_door'] = {
	load: function(trigger) {
		events.subscribe('energy_heal', function() {
			if(this.playerInside) {
				events.publish('open_door', { door_name: 'heal_trainer' });
			 	events.publish('open_door', { door_name: 'tutorial_goodie' });
			}
		}, trigger);
	},

	enter: function(params) {
	},

	stay: function(params) {
	},

	exit: function(params) {
	}
};

TriggerController.prototype.triggers['update_checkpoint'] = {
	enter: function(params) {
		GameData.SetCheckpoint(params.id);
	},

	stay: function(params) {
	},

	exit: function(params) {
	}
};

TriggerController.prototype.triggers['goddess_intro'] = {
	enter: function(params) {

		if(!GameData.GetFlag('goddess_intro') && !GameData.HasShard('Will')) {
			GameData.SetFlag('goddess_intro', true);
			ScriptRunner.run('goddess_intro');

		} else if(!GameData.GetFlag('goddess_intro') && GameData.HasShard('Will')) {
			GameData.SetFlag('goddess_intro', true);
			GameData.SetFlag('goddess_shard', true);
			
			ScriptRunner.run('goddess_meet_with_shard');

		} else if(GameData.GetFlag('goddess_intro') && !GameData.HasShard('Will')) {
			ScriptRunner.run('goddess_restate');

		} else if(!GameData.GetFlag('goddess_shard') && GameData.HasShard('Will')) {
			GameData.SetFlag('goddess_shard', true);
			ScriptRunner.run('goddess_shard');

		} 
	},

	stay: function(params) {
	},

	exit: function(params) {
	}
};

TriggerController.prototype.triggers['vertical_loop'] = {
	enter: function(params) {
		frauki.y = 20 * 16;
		game.camera.y = 0;
		cameraController.camY = 0;
	},

	stay: function(params) {
	},

	exit: function(params) {
	}
};

TriggerController.prototype.triggers['vertical_loop_up'] = {
	enter: function(params) {
		frauki.y = 641 * 16;
		//game.camera.y = 10000;
		//cameraController.camY = 9000;
	},

	stay: function(params) {
	},

	exit: function(params) {
	}
};

TriggerController.prototype.triggers['goddess_spaceship'] = {
	enter: function(params) {
		if(!GameData.GetFlag('goddess_spaceship')) {
			GameData.SetFlag('goddess_spaceship', true);
			GameData.SetVal('goddess_death_message', 'That big, ugly, metal eyesore is the robots space ship. They crashed that pile of junk into my planet many years ago and they haven\'t left since.')
		}
	},

	stay: function(params) {
	},

	exit: function(params) {
	}
};

TriggerController.prototype.triggers['ragnarok'] = {
	enter: function(params) {
		
	},

	stay: function(params) {
	},

	exit: function(params) {
	}
};

TriggerController.prototype.triggers['region_text'] = {
	enter: function(params, trigger) {
	},

	stay: function(params, trigger) {

	},

	exit: function(params, trigger) {
		if(!!params.left && frauki.body.center.x < trigger.x) {
			events.publish('display_region_text', { text: params.left });
		} else if(!!params.right && frauki.body.center.x > trigger.x) {
			events.publish('display_region_text', { text: params.right });
		} else if(!!params.down && frauki.body.center.y > trigger.y) {
			events.publish('display_region_text', { text: params.down });
		} else if(!!params.up && frauki.body.center.y < trigger.y) {
			events.publish('display_region_text', { text: params.up });
		}
	}
}