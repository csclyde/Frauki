var FileMap = {};

FileMap.Images = [
	{ Name: 'FrogtownTiles', File: 'Data/World/FrogtownTiles.png' },
	{ Name: 'DepthsTiles', File: 'Data/World/DepthsTiles.png' },
	{ Name: 'TerraceTiles', File: 'Data/World/TerraceTiles.png' },
	{ Name: 'Doodads', File: 'Data/World/Doodads.png' },
	{ Name: 'Collision', File: 'Data/World/CollisionKey.png' },
	{ Name: 'Background', File: 'Data/World/Sky.png' },
	{ Name: 'mountain', File: 'Data/World/Mountain.png' },
	{ Name: 'clouds1', File: 'Data/World/Clouds1.png' },
	{ Name: 'clouds2', File: 'Data/World/Clouds2.png' },
	{ Name: 'clouds3', File: 'Data/World/Clouds3.png' },

	{ Name: 'cave', File: 'Data/World/Cave.png' },
	{ Name: 'dark_cave', File: 'Data/World/DarkCave.png' },
	{ Name: 'stone', File: 'Data/World/Stone.png' },
	{ Name: 'metal', File: 'Data/World/Metal.png' },
];

FileMap.Atlas = [
	{ Name: 'Frauki', File: 'Data/Sprites/Frauki.json', Img: 'Data/Sprites/Frauki.png' },
	{ Name: 'EnemySprites', File: 'Data/Sprites/Enemies.json', Img: 'Data/Sprites/Enemies.png' },
	{ Name: 'Misc', File: 'Data/Sprites/Misc.json', Img: 'Data/Sprites/Misc.png' },
	{ Name: 'UI', File: 'Data/Sprites/UI.json', Img: 'Data/Sprites/UI.png' },
	{ Name: 'Pieces', File: 'Data/Sprites/Pieces.json', Img: 'Data/Sprites/Pieces.png' },
];

FileMap.Audio = [
	{ Name: 'attack_slash', File: 'Data/Sfx/attack_slash.ogg', Volume: 0.8, Loop: false },
	{ Name: 'attack_jump', File: 'Data/Sfx/attack_jump.ogg', Volume: 1.6, Loop: false },
	{ Name: 'attack_fall', File: 'Data/Sfx/attack_fall.ogg', Volume: 1.6, Loop: false },
	{ Name: 'attack_overhead', File: 'Data/Sfx/attack_overhead.ogg', Volume: 1.6, Loop: false },
	{ Name: 'attack_stab', File: 'Data/Sfx/attack_stab.ogg', Volume: 0.8, Loop: false },
	{ Name: 'attack_dive_charge', File: 'Data/Sfx/attack_dive_charge.ogg', Volume: 0.4, Loop: false },
	{ Name: 'attack_dive_fall', File: 'Data/Sfx/attack_dive_fall.ogg', Volume: 0.4, Loop: true },
	{ Name: 'attack_dive_land', File: 'Data/Sfx/attack_dive_land.ogg', Volume: 0.5, Loop: false },
	{ Name: 'attack_connect', File: 'Data/Sfx/attack_connect.ogg', Volume: 0.9, Loop: false },

	{ Name: 'frauki_jump', File: 'Data/Sfx/frauki_jump.ogg', Volume: 0.2, Loop: false },
	{ Name: 'frauki_roll', File: 'Data/Sfx/frauki_roll.ogg', Volume: 0.2, Loop: false },
	{ Name: 'frauki_airhike', File: 'Data/Sfx/frauki_airhike.ogg', Volume: 0.2, Loop: false },
	{ Name: 'frauki_ouch', File: 'Data/Sfx/frauki_ouch.ogg', Volume: 0.7, Loop: false },
	{ Name: 'frauki_running', File: 'Data/Sfx/frauki_run.ogg', Volume: 0.2, Loop: true },
	{ Name: 'frauki_stun', File: 'Data/Sfx/frauki_stun.ogg', Volume: 0.8, Loop: false },
	{ Name: 'frauki_slide', File: 'Data/Sfx/frauki_slide.ogg', Volume: 0.3, Loop: false },
	{ Name: 'frauki_materialize', File: 'Data/Sfx/frauki_materialize.ogg', Volume: 1.0, Loop: false },
	{ Name: 'frauki_materialize_end', File: 'Data/Sfx/frauki_materialize_end.ogg', Volume: 0.2, Loop: false },

	{ Name: 'no_energy', File: 'Data/Sfx/no_energy.ogg', Volume: 0.7, Loop: false },
	{ Name: 'energy_bit', File: 'Data/Sfx/energy_bit.ogg', Volume: 0.2, Loop: false },
	{ Name: 'clang', File: 'Data/Sfx/clang.ogg', Volume: 0.3, Loop: false },
	{ Name: 'smash', File: 'Data/Sfx/smash.ogg', Volume: 0.7, Loop: false },
	{ Name: 'apple', File: 'Data/Sfx/apple.ogg', Volume: 1.0, Loop: false },
	{ Name: 'low_health', File: 'Data/Sfx/low_health.ogg', Volume: 0.6, Loop: true },
	{ Name: 'speech', File: 'Data/Sfx/speech.ogg', Volume: 0.2, Loop: true },
	
	{ Name: 'robosplosion', File: 'Data/Sfx/robosplosion.ogg', Volume: 0.9, Loop: false },
	{ Name: 'drip', File: 'Data/Sfx/water.ogg', Volume: 0.02, Loop: false },
	{ Name: 'door_break', File: 'Data/Sfx/door_break.ogg', Volume: 5.0, Loop: false },
	{ Name: 'crystal_door', File: 'Data/Sfx/crystal_door.ogg', Volume: 0.5, Loop: false },
	{ Name: 'skull_door', File: 'Data/Sfx/skull_door.ogg', Volume: 0.9, Loop: false },
	{ Name: 'door_rumble', File: 'Data/Sfx/door_rumble.ogg', Volume: 0.4, Loop: false },
	{ Name: 'door_slam', File: 'Data/Sfx/door_slam.ogg', Volume: 0.4, Loop: false },

	{ Name: 'floor_crumble', File: 'Data/Sfx/crumble.ogg', Volume: 5.0, Loop: false },
	{ Name: 'text_bloop', File: 'Data/Sfx/text.ogg', Volume: 0.4, Loop: false },
	{ Name: 'lose_energy_bits', File: 'Data/Sfx/lose_energy_bits.ogg', Volume: 0.6, Loop: false },

	{ Name: 'heal_1', File: 'Data/Sfx/healing_1.ogg', Volume: 0.8, Loop: false },
	{ Name: 'heal_2', File: 'Data/Sfx/healing_2.ogg', Volume: 0.8, Loop: false },
	{ Name: 'heal_3', File: 'Data/Sfx/healing_3.ogg', Volume: 0.8, Loop: false },
	{ Name: 'heal_4', File: 'Data/Sfx/healing_4.ogg', Volume: 0.8, Loop: false },
	{ Name: 'heal_5', File: 'Data/Sfx/healing_5.ogg', Volume: 0.8, Loop: false },
	{ Name: 'heal_6', File: 'Data/Sfx/healing_6.ogg', Volume: 0.8, Loop: false },
	{ Name: 'heal_7', File: 'Data/Sfx/healing_7.ogg', Volume: 0.8, Loop: false },
	{ Name: 'heal_8', File: 'Data/Sfx/healing_8.ogg', Volume: 0.8, Loop: false },
	{ Name: 'heal_9', File: 'Data/Sfx/healing_9.ogg', Volume: 0.8, Loop: false },
	{ Name: 'heal_10', File: 'Data/Sfx/healing_10.ogg', Volume: 0.8, Loop: false },
	{ Name: 'heal_11', File: 'Data/Sfx/healing_11.ogg', Volume: 0.8, Loop: false },

	{ Name: 'gain_energy_1', File: 'Data/Sfx/gain_energy_1.ogg', Volume: 0.8, Loop: false },
	{ Name: 'gain_energy_2', File: 'Data/Sfx/gain_energy_2.ogg', Volume: 0.8, Loop: false },
	{ Name: 'gain_energy_3', File: 'Data/Sfx/gain_energy_3.ogg', Volume: 0.8, Loop: false },
	{ Name: 'gain_energy_4', File: 'Data/Sfx/gain_energy_4.ogg', Volume: 0.8, Loop: false },

	{ Name: 'lose_energy_1', File: 'Data/Sfx/lose_energy_1.ogg', Volume: 0.8, Loop: false },
	{ Name: 'lose_energy_2', File: 'Data/Sfx/lose_energy_2.ogg', Volume: 0.8, Loop: false },
	{ Name: 'lose_energy_3', File: 'Data/Sfx/lose_energy_3.ogg', Volume: 0.8, Loop: false },
	{ Name: 'lose_energy_4', File: 'Data/Sfx/lose_energy_4.ogg', Volume: 0.8, Loop: false },

	{ Name: 'baton_throw_0', File: 'Data/Sfx/baton_throw_1.ogg', Volume: 1.2, Loop: false },
	{ Name: 'baton_throw_1', File: 'Data/Sfx/baton_throw_2.ogg', Volume: 1.2, Loop: false },
	{ Name: 'baton_throw_2', File: 'Data/Sfx/baton_throw_3.ogg', Volume: 1.2, Loop: false },
	{ Name: 'baton_throw_3', File: 'Data/Sfx/baton_throw_4.ogg', Volume: 1.2, Loop: false },
	{ Name: 'baton_throw_4', File: 'Data/Sfx/baton_throw_5.ogg', Volume: 1.2, Loop: false },

	{ Name: 'baton_spin_0', File: 'Data/Sfx/baton_spin_1.ogg', Volume: 1.2, Loop: true },
	{ Name: 'baton_spin_1', File: 'Data/Sfx/baton_spin_2.ogg', Volume: 1.2, Loop: true },
	{ Name: 'baton_spin_2', File: 'Data/Sfx/baton_spin_3.ogg', Volume: 1.2, Loop: true },
	{ Name: 'baton_spin_3', File: 'Data/Sfx/baton_spin_4.ogg', Volume: 1.2, Loop: true },
	{ Name: 'baton_spin_4', File: 'Data/Sfx/baton_spin_5.ogg', Volume: 1.2, Loop: true },
	
	{ Name: 'baton_catch', File: 'Data/Sfx/baton_catch.ogg', Volume: 1.2, Loop: false },

	{ Name: 'attack_windup', File: 'Data/Sfx/attack_windup.ogg', Volume: 0.5, Loop: false },
	{ Name: 'enemy_jump', File: 'Data/Sfx/enemy_jump.ogg', Volume: 0.7, Loop: false },
	{ Name: 'robot_jump_med', File: 'Data/Sfx/robot_jump_med.ogg', Volume: 0.7, Loop: false },
	{ Name: 'robot_land_med', File: 'Data/Sfx/robot_land_med.ogg', Volume: 0.7, Loop: false },
	{ Name: 'AZP3_step', File: 'Data/Sfx/AZP3_step.ogg', Volume: 1.0, Loop: false },
	{ Name: 'AZP3_punch_windup', File: 'Data/Sfx/AZP3_punch_windup.ogg', Volume: 1.0, Loop: false },
	{ Name: 'AZP3_punch', File: 'Data/Sfx/AZP3_punch.ogg', Volume: 1.0, Loop: false },
	{ Name: 'AZP3_slide_windup', File: 'Data/Sfx/AZP3_slide_windup.ogg', Volume: 1.0, Loop: false },
	{ Name: 'AZP3_slide', File: 'Data/Sfx/AZP3_slide.ogg', Volume: 1.0, Loop: false },
	{ Name: 'AZP3_slide_impact', File: 'Data/Sfx/AZP3_slide_impact.ogg', Volume: 1.0, Loop: false },
	{ Name: 'AZP3_hammer_windup', File: 'Data/Sfx/AZP3_hammer_windup.ogg', Volume: 0.6, Loop: false },

	{ Name: 'GUBr_tremble', File: 'Data/Sfx/GUBr_tremble.ogg', Volume: 0.2, Loop: false },
	{ Name: 'GUBr_laugh', File: 'Data/Sfx/GUBr_laugh.ogg', Volume: 0.6, Loop: false },
	{ Name: 'GUBr_step', File: 'Data/Sfx/GUBr_step.ogg', Volume: 0.4, Loop: true },
	{ Name: 'GUBr_attack', File: 'Data/Sfx/GUBr_attack.ogg', Volume: 0.4, Loop: false },

	{ Name: 'KR32_attack', File: 'Data/Sfx/KR32_attack.ogg', Volume: 1.5, Loop: false },
	{ Name: 'KR32_stab', File: 'Data/Sfx/KR32_stab.ogg', Volume: 1.0, Loop: false },
	{ Name: 'KR32_jump', File: 'Data/Sfx/KR32_jump.ogg', Volume: 1.0, Loop: false },
	{ Name: 'KR32_land', File: 'Data/Sfx/KR32_land.ogg', Volume: 1.0, Loop: false },
	{ Name: 'KR32_step', File: 'Data/Sfx/KR32_step.ogg', Volume: 0.4, Loop: false },

	{ Name: 'H0P8_jump', File: 'Data/Sfx/H0P8_jump.ogg', Volume: 0.4, Loop: false },
	{ Name: 'H0P8_land', File: 'Data/Sfx/H0P8_land.ogg', Volume: 1.0, Loop: false },
	{ Name: 'H0P8_attack', File: 'Data/Sfx/H0P8_attack.ogg', Volume: 1.0, Loop: false },

	{ Name: 'QL0k_attack', File: 'Data/Sfx/QL0k_attack.ogg', Volume: 1.0, Loop: false },

	{ Name: 'SW8T_jump', File: 'Data/Sfx/SW8T_jump.ogg', Volume: 1.0, Loop: false },
	{ Name: 'SW8T_land', File: 'Data/Sfx/SW8T_land.ogg', Volume: 1.0, Loop: false },
	{ Name: 'SW8T_step', File: 'Data/Sfx/SW8T_step.ogg', Volume: 1.0, Loop: false },
	{ Name: 'SW8T_shield', File: 'Data/Sfx/SW8T_shield.ogg', Volume: 1.0, Loop: false },
	{ Name: 'SW8T_bolas_fly', File: 'Data/Sfx/SW8T_bolas_fly.ogg', Volume: 1.0, Loop: false },
	{ Name: 'SW8T_baton_attack', File: 'Data/Sfx/SW8T_baton_attack.ogg', Volume: 1.0, Loop: false },
	{ Name: 'SW8T_mortar_shot', File: 'Data/Sfx/SW8T_mortar_shot.ogg', Volume: 1.0, Loop: false },
	{ Name: 'SW8T_mortar_explode', File: 'Data/Sfx/SW8T_mortar_explode.ogg', Volume: 1.0, Loop: false },

	{ Name: 'RKN1d_attack', File: 'Data/Sfx/RKN1d_attack.ogg', Volume: 1.0, Loop: false },
	{ Name: 'RKN1d_jump', File: 'Data/Sfx/H0P8_jump.ogg', Volume: 1.0, Loop: false },
	{ Name: 'RKN1d_land', File: 'Data/Sfx/RKN1d_land.ogg', Volume: 1.0, Loop: false },

	{ Name: 'fungu_shoot', File: 'Data/Sfx/fungu_shoot.ogg', Volume: 1.0, Loop: false },
	{ Name: 'Insectoid_attack', File: 'Data/Sfx/Insectoid_attack.ogg', Volume: 0.8, Loop: false },
	{ Name: 'Dropper_bounce', File: 'Data/Sfx/Dropper_bounce.ogg', Volume: 0.15, Loop: false },

	{ Name: 'explosion', File: 'Data/Sfx/explosion.ogg', Volume: 1.0, Loop: false },

];

FileMap.Music = [
	{ Name: 'Intro', File: 'Data/Music/menu.ogg', Volume: 0.15, Loop: true },
	{ Name: 'Goddess', File: 'Data/Music/goddess.ogg', Volume: 0.15, Loop: true },
	{ Name: 'Gameover', File: 'Data/Music/game_over.ogg', Volume: 0.15, Loop: false },
	{ Name: 'Chamber', File: 'Data/Music/chamber.ogg', Volume: 0.15, Loop: true },
	{ Name: 'Ruins', File: 'Data/Music/ruins.ogg', Volume: 0.15, Loop: true },
	{ Name: 'Tenements', File: 'Data/Music/tenements.ogg', Volume: 0.15, Loop: true },
	{ Name: 'Decimation', File: 'Data/Music/decimation.ogg', Volume: 0.15, Loop: true },
	{ Name: 'Underwater', File: 'Data/Music/underwater.ogg', Volume: 0.15, Loop: true },
	{ Name: 'Sunshine', File: 'Data/Music/sunshine.ogg', Volume: 0.15, Loop: true },
	{ Name: 'Frogtown', File: 'Data/Music/frogtown_theme.ogg', Volume: 0.15, Loop: true },
	{ Name: 'Denoument', File: 'Data/Music/denoument.ogg', Volume: 0.15, Loop: true },
	{ Name: 'Loopy', File: 'Data/Music/loopy.ogg', Volume: 0.10, Loop: true },
	{ Name: 'FanfareLong', File: 'Data/Music/fanfare_long.ogg', Volume: 14.0, Loop: false },
	{ Name: 'FanfareShort', File: 'Data/Music/fanfare_short.ogg', Volume: 0.8, Loop: false },
];

FileMap.Ambient = [
	{ Name: 'ambient_surface', File: 'Data/Music/ambient_surface.ogg', Volume: 0.3, Loop: true },
	{ Name: 'ambient_cave', File: 'Data/Music/ambient_cave.ogg', Volume: 0.3, Loop: true },
	{ Name: 'ambient_ship', File: 'Data/Music/ambient_ship.ogg', Volume: 0.3, Loop: true },
	{ Name: 'ambient_tenements', File: 'Data/Music/ambient_tenements.ogg', Volume: 0.3, Loop: true },
];

FileMap.Enemies = [
	{ Name: 'Insectoid', Tile: 85 },
	{ Name: 'Buzzar', Tile: 86 },
	{ Name: 'Sporoid', Tile: 87 },
	{ Name: 'Hopper', Tile: 145 },
	{ Name: 'SpikeDropper', Tile: 146 },
	{ Name: 'Crabby', Tile: 148 },
	{ Name: 'Fungu', Tile: 96 },
	{ Name: 'Goddess', Tile: 93 },
	{ Name: 'H0P8', Tile: 90 },
	{ Name: 'GUBr', Tile: 92 },
	{ Name: 'SW8T', Tile: 94 },
	{ Name: 'QL0k', Tile: 97 },
	{ Name: 'KR32', Tile: 98 },
	{ Name: 'A3PZ', Tile: 99 },
	{ Name: 'HWK9', Tile: 100 },
	{ Name: 'RKN1d', Tile: 101 },
	{ Name: 'NPC', Tile: 149 },
];

FileMap.Junk = [
	{ Name: 'Barrel', Tile: 105 },
	{ Name: 'Plant', Tile: 106 },
	{ Name: 'Pot', Tile: 107 },
	{ Name: 'Egg', Tile: 108 },
	{ Name: 'Pot2', Tile: 109 },
	{ Name: 'Crate', Tile: 110 },
];

FileMap.Runes = [
	{ Name: 'Lob', Tile: 125 },
	{ Name: 'Shield', Tile: 126 },
	{ Name: 'Saw', Tile: 127 }
];

FileMap.Portraits = [
	{ Name: 'Neutral', Frame: 'PortraitsFraukiNeutral' },
	{ Name: 'Mad', Frame: 'PortraitsFraukiMad' },
	{ Name: 'Dazed', Frame: 'PortraitsFraukiDazed' },
	{ Name: 'Enticed', Frame: 'PortraitsFraukiEnticed' },
	{ Name: 'Displeased', Frame: 'PortraitsFraukiDispleased' },
	{ Name: 'Mischeif', Frame: 'PortraitsFraukiMischeif' },
	{ Name: 'Silly', Frame: 'PortraitsFraukiMischeif' },
	{ Name: 'Goddess_Neutral', Frame: 'PortraitsGoddess_Neutral' },
	{ Name: 'red', Frame: '' },
	{ Name: 'green', Frame: '' },
];
