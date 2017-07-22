var FileMap = {};

FileMap.Images = [
	{ Name: 'FrogtownTiles', File: 'Data/World/FrogtownTiles.png' },
	{ Name: 'DepthsTiles', File: 'Data/World/DepthsTiles.png' },
	{ Name: 'TerraceTiles', File: 'Data/World/TerraceTiles.png' },
	{ Name: 'Doodads', File: 'Data/World/Doodads.png' },
	{ Name: 'Collision', File: 'Data/CollisionKey.png' },
	{ Name: 'Background', File: 'Data/World/Sky.png' },
	{ Name: 'parallax1', File: 'Data/World/Parallax1.png' },
	{ Name: 'parallax2', File: 'Data/World/Parallax2.png' },
	{ Name: 'clouds1', File: 'Data/World/Clouds1.png' },
	{ Name: 'clouds2', File: 'Data/World/Clouds2.png' },

	{ Name: 'font', File: 'Data/Sprites/font.png' },

	{ Name: 'cave', File: 'Data/World/Cave.png' },
	{ Name: 'stone', File: 'Data/World/Stone.png' },
];

FileMap.Atlas = [
	{ Name: 'Frauki', File: 'Data/Sprites/Frauki.json', Img: 'Data/Sprites/Frauki.png' },
	{ Name: 'EnemySprites', File: 'Data/Sprites/Enemies.json', Img: 'Data/Sprites/Enemies.png' },
	{ Name: 'Misc', File: 'Data/Sprites/Misc.json', Img: 'Data/Sprites/Misc.png' },
	{ Name: 'UI', File: 'Data/Sprites/UI.json', Img: 'Data/Sprites/UI.png' },
	{ Name: 'Pieces', File: 'Data/Sprites/Pieces.json', Img: 'Data/Sprites/Pieces.png' },
	{ Name: 'Junk', File: 'Data/Sprites/Junk.json', Img: 'Data/Sprites/Junk.png' }
];

FileMap.Audio = [
	{ Name: 'attack_slash', File: 'Data/Sfx/attack_slash.wav', Volume: 0.8, Loop: false },
	{ Name: 'attack_jump', File: 'Data/Sfx/attack_jump.wav', Volume: 1.6, Loop: false },
	{ Name: 'attack_fall', File: 'Data/Sfx/attack_fall.wav', Volume: 1.6, Loop: false },
	{ Name: 'attack_overhead', File: 'Data/Sfx/attack_overhead.wav', Volume: 1.6, Loop: false },
	{ Name: 'attack_stab', File: 'Data/Sfx/attack_stab.wav', Volume: 0.8, Loop: false },
	{ Name: 'attack_dive_charge', File: 'Data/Sfx/attack_dive_charge.wav', Volume: 0.4, Loop: false },
	{ Name: 'attack_dive_fall', File: 'Data/Sfx/attack_dive_fall.wav', Volume: 0.4, Loop: true },
	{ Name: 'attack_dive_land', File: 'Data/Sfx/attack_dive_land.wav', Volume: 0.5, Loop: false },
	{ Name: 'attack_connect', File: 'Data/Sfx/attack_connect.wav', Volume: 0.9, Loop: false },

	{ Name: 'jump', File: 'Data/Sfx/jump.wav', Volume: 0.2, Loop: false },
	{ Name: 'roll', File: 'Data/Sfx/roll.wav', Volume: 0.2, Loop: false },
	{ Name: 'ouch', File: 'Data/Sfx/Ouch.wav', Volume: 0.7, Loop: false },
	{ Name: 'running', File: 'Data/Sfx/run.wav', Volume: 0.2, Loop: true },
	{ Name: 'slide', File: 'Data/Sfx/slide.wav', Volume: 0.3, Loop: false },
	{ Name: 'no_energy', File: 'Data/Sfx/no_energy.wav', Volume: 0.7, Loop: false },
	{ Name: 'airhike', File: 'Data/Sfx/airhike.wav', Volume: 0.2, Loop: false },
	{ Name: 'energy_bit', File: 'Data/Sfx/energy_bit.wav', Volume: 0.2, Loop: false },
	{ Name: 'clang', File: 'Data/Sfx/clang.wav', Volume: 0.3, Loop: false },
	{ Name: 'smash', File: 'Data/Sfx/smash.wav', Volume: 0.7, Loop: false },
	{ Name: 'robosplosion', File: 'Data/Sfx/robosplosion.wav', Volume: 0.9, Loop: false },
	{ Name: 'apple', File: 'Data/Sfx/apple.wav', Volume: 1.0, Loop: false },
	{ Name: 'low_health', File: 'Data/Sfx/low_health.wav', Volume: 0.6, Loop: true },
	{ Name: 'drip', File: 'Data/Sfx/water.wav', Volume: 0.02, Loop: false },
	{ Name: 'speech', File: 'Data/Sfx/speech.ogg', Volume: 0.2, Loop: true },

	{ Name: 'door_break', File: 'Data/Sfx/door_break.wav', Volume: 5.0, Loop: false },
	{ Name: 'crystal_door', File: 'Data/Sfx/crystal_door.wav', Volume: 0.5, Loop: false },
	{ Name: 'skull_door', File: 'Data/Sfx/skull_door.wav', Volume: 0.9, Loop: false },
	{ Name: 'door_rumble', File: 'Data/Sfx/door_rumble.wav', Volume: 0.4, Loop: false },
	{ Name: 'door_slam', File: 'Data/Sfx/door_slam.wav', Volume: 0.4, Loop: false },
	{ Name: 'fanfare_long', File: 'Data/Sfx/fanfare_long.ogg', Volume: 14.0, Loop: false },
	{ Name: 'fanfare_short', File: 'Data/Sfx/fanfare_short.ogg', Volume: 0.8, Loop: false },

	{ Name: 'floor_crumble', File: 'Data/Sfx/crumble.wav', Volume: 5.0, Loop: false },
	{ Name: 'text_bloop', File: 'Data/Sfx/text.wav', Volume: 0.4, Loop: false },
	{ Name: 'lose_energy_bits', File: 'Data/Sfx/lose_energy_bits.wav', Volume: 0.6, Loop: false },

	{ Name: 'heal_1', File: 'Data/Sfx/healing_1.wav', Volume: 0.8, Loop: false },
	{ Name: 'heal_2', File: 'Data/Sfx/healing_2.wav', Volume: 0.8, Loop: false },
	{ Name: 'heal_3', File: 'Data/Sfx/healing_3.wav', Volume: 0.8, Loop: false },
	{ Name: 'heal_4', File: 'Data/Sfx/healing_4.wav', Volume: 0.8, Loop: false },
	{ Name: 'heal_5', File: 'Data/Sfx/healing_5.wav', Volume: 0.8, Loop: false },
	{ Name: 'heal_6', File: 'Data/Sfx/healing_6.wav', Volume: 0.8, Loop: false },
	{ Name: 'heal_7', File: 'Data/Sfx/healing_7.wav', Volume: 0.8, Loop: false },
	{ Name: 'heal_8', File: 'Data/Sfx/healing_8.wav', Volume: 0.8, Loop: false },
	{ Name: 'heal_9', File: 'Data/Sfx/healing_9.wav', Volume: 0.8, Loop: false },
	{ Name: 'heal_10', File: 'Data/Sfx/healing_10.wav', Volume: 0.8, Loop: false },
	{ Name: 'heal_11', File: 'Data/Sfx/healing_11.wav', Volume: 0.8, Loop: false },

	{ Name: 'gain_energy_1', File: 'Data/Sfx/gain_energy_1.wav', Volume: 0.8, Loop: false },
	{ Name: 'gain_energy_2', File: 'Data/Sfx/gain_energy_2.wav', Volume: 0.8, Loop: false },
	{ Name: 'gain_energy_3', File: 'Data/Sfx/gain_energy_3.wav', Volume: 0.8, Loop: false },
	{ Name: 'gain_energy_4', File: 'Data/Sfx/gain_energy_4.wav', Volume: 0.8, Loop: false },

	{ Name: 'lose_energy_1', File: 'Data/Sfx/lose_energy_1.wav', Volume: 0.8, Loop: false },
	{ Name: 'lose_energy_2', File: 'Data/Sfx/lose_energy_2.wav', Volume: 0.8, Loop: false },
	{ Name: 'lose_energy_3', File: 'Data/Sfx/lose_energy_3.wav', Volume: 0.8, Loop: false },
	{ Name: 'lose_energy_4', File: 'Data/Sfx/lose_energy_4.wav', Volume: 0.8, Loop: false },

	{ Name: 'baton_throw_0', File: 'Data/Sfx/baton_throw_1.wav', Volume: 1.2, Loop: false },
	{ Name: 'baton_throw_1', File: 'Data/Sfx/baton_throw_2.wav', Volume: 1.2, Loop: false },
	{ Name: 'baton_throw_2', File: 'Data/Sfx/baton_throw_3.wav', Volume: 1.2, Loop: false },
	{ Name: 'baton_throw_3', File: 'Data/Sfx/baton_throw_4.wav', Volume: 1.2, Loop: false },
	{ Name: 'baton_throw_4', File: 'Data/Sfx/baton_throw_5.wav', Volume: 1.2, Loop: false },

	{ Name: 'baton_spin_0', File: 'Data/Sfx/baton_spin_1.wav', Volume: 1.2, Loop: true },
	{ Name: 'baton_spin_1', File: 'Data/Sfx/baton_spin_2.wav', Volume: 1.2, Loop: true },
	{ Name: 'baton_spin_2', File: 'Data/Sfx/baton_spin_3.wav', Volume: 1.2, Loop: true },
	{ Name: 'baton_spin_3', File: 'Data/Sfx/baton_spin_4.wav', Volume: 1.2, Loop: true },
	{ Name: 'baton_spin_4', File: 'Data/Sfx/baton_spin_5.wav', Volume: 1.2, Loop: true },
	
	{ Name: 'baton_catch', File: 'Data/Sfx/baton_catch.wav', Volume: 1.2, Loop: false },

	{ Name: 'attack_windup', File: 'Data/Sfx/attack_windup.wav', Volume: 0.5, Loop: false },
	{ Name: 'AZP3_step', File: 'Data/Sfx/AZP3_step.wav', Volume: 1.0, Loop: false },
	{ Name: 'AZP3_punch', File: 'Data/Sfx/AZP3_punch.wav', Volume: 1.0, Loop: false },

	{ Name: 'KR32_attack', File: 'Data/Sfx/KR32_attack.wav', Volume: 1.5, Loop: false },
	{ Name: 'KR32_stab', File: 'Data/Sfx/KR32_stab.wav', Volume: 1.0, Loop: false },

];

FileMap.Music = [
	{ Name: 'Surface', File: 'Data/Music/Surface.xm', Volume: 0.3, Loop: true },
	{ Name: 'Ruins', File: 'Data/Music/Ruins.xm', Volume: 0.3, Loop: true },
	//{ Name: 'Choir', File: 'Data/Music/Choir.xm', Volume: 0.15, Loop: true },
	{ Name: 'Underwater', File: 'Data/Music/Underwater.xm', Volume: 0.15, Loop: true },
	{ Name: 'Landfill', File: 'Data/Music/Landfill.xm', Volume: 0.15, Loop: true },
	{ Name: 'Gameover', File: 'Data/Music/Game Over (Dead Frauki).xm', Volume: 0.4, Loop: false },
	{ Name: 'Tenements', File: 'Data/Music/Kowloon.xm', Volume: 0.4, Loop: true },
	{ Name: 'Intro', File: 'Data/Music/Intro.xm', Volume: 0.4, Loop: true }
];

FileMap.Ambient = [
	{ Name: 'surface_wind', File: 'Data/Sfx/surface_wind.ogg', Volume: 0.50, Loop: true },
	{ Name: 'cave_wind', File: 'Data/Sfx/cave_wind.ogg', Volume: 2, Loop: true },
];

FileMap.Enemies = [
	{ Name: 'Insectoid', Tile: 85 },
	{ Name: 'Buzzar', Tile: 86 },
	{ Name: 'Sporoid', Tile: 87 },
	{ Name: 'R2BTU', Tile: 88 },
	{ Name: 'CreeperThistle', Tile: 89 },
	{ Name: 'H0P8', Tile: 90 },
	{ Name: 'Haystax', Tile: 91 },
	{ Name: 'GUBr', Tile: 92 },
	{ Name: 'Goddess', Tile: 93 },
	{ Name: 'Pincer', Tile: 94 },
	{ Name: 'Mask', Tile: 95 },
	{ Name: 'Fungu', Tile: 96 },
	{ Name: 'QL0k', Tile: 97 },
	{ Name: 'KR32', Tile: 98 },
	{ Name: 'A3PZ', Tile: 99 },
	{ Name: 'HWK9', Tile: 100 },
	{ Name: 'RKN1d', Tile: 101 }
];

FileMap.Junk = [
	{ Name: 'Barrel', Tile: 105 },
	{ Name: 'Plant', Tile: 106 },
	{ Name: 'Pot', Tile: 107 },
	{ Name: 'Egg', Tile: 108 },
	{ Name: 'Pot2', Tile: 109 },
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
	{ Name: 'Goddess_Neutral', Frame: 'PortraitsGoddess_Neutral' }
];
