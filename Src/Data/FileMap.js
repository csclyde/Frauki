var FileMap = {};

FileMap.Images = [
	{ Name: 'FrogtownTiles', File: 'Data/World/FrogtownTiles.png' },
	{ Name: 'DepthsTiles', File: 'Data/World/DepthsTiles.png' },
	{ Name: 'TerraceTiles', File: 'Data/World/TerraceTiles.png' },
	{ Name: 'Doodads', File: 'Data/World/Doodads.png' },
	{ Name: 'Collision', File: 'Data/CollisionKey.png' },
	{ Name: 'Background', File: 'Data/World/Sky.png' },
	{ Name: 'parallax1', File: 'Data/World/Parallax1.png' },
	{ Name: 'parallax2', File: 'Data/World/Parallax2.png' }
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
	{ Name: 'attack_slash', File: 'Data/Sfx/attack_slash.wav', Volume: 0.5, Loop: false },
	{ Name: 'attack_stab', File: 'Data/Sfx/attack_stab.wav', Volume: 0.5, Loop: false },
	{ Name: 'attack_dive_charge', File: 'Data/Sfx/attack_dive_charge.wav', Volume: 0.4, Loop: false },
	{ Name: 'attack_dive_fall', File: 'Data/Sfx/attack_dive_fall.wav', Volume: 0.4, Loop: true },
	{ Name: 'attack_dive_land', File: 'Data/Sfx/attack_dive_land.wav', Volume: 0.5, Loop: false },
	{ Name: 'attack_connect', File: 'Data/Sfx/attack_connect.wav', Volume: 0.4, Loop: false },

	{ Name: 'jump', File: 'Data/Sfx/jump.wav', Volume: 0.3, Loop: false },
	{ Name: 'ouch', File: 'Data/Sfx/Ouch.wav', Volume: 0.7, Loop: false },
	{ Name: 'running', File: 'Data/Sfx/run.wav', Volume: 0.2, Loop: true },
	{ Name: 'slide', File: 'Data/Sfx/slide.wav', Volume: 0.3, Loop: false },
	{ Name: 'no_energy', File: 'Data/Sfx/no_energy.wav', Volume: 0.7, Loop: false },
	{ Name: 'airhike', File: 'Data/Sfx/airhike.wav', Volume: 0.3, Loop: false },
	{ Name: 'energy_bit', File: 'Data/Sfx/energy_bit.wav', Volume: 0.2, Loop: false },
	{ Name: 'clang', File: 'Data/Sfx/clang.wav', Volume: 0.3, Loop: false },
	{ Name: 'smash', File: 'Data/Sfx/smash.wav', Volume: 0.7, Loop: false },
	{ Name: 'robosplosion', File: 'Data/Sfx/robosplosion.wav', Volume: 0.9, Loop: false }
];

FileMap.Music = [
	{ Name: 'Surface', File: 'Data/Music/Surface.xm', Volume: 0.5, Loop: true },
	{ Name: 'Ruins', File: 'Data/Music/Ruins.xm', Volume: 0.5, Loop: true },
	{ Name: 'Underwater', File: 'Data/Music/Underwater.xm', Volume: 0.5, Loop: true },
	{ Name: 'Landfill', File: 'Data/Music/Landfill.xm', Volume: 0.5, Loop: true },
	{ Name: 'Gameover', File: 'Data/Music/Game Over (Dead Frauki).xm', Volume: 0.4, Loop: false },
];

FileMap.Enemies = [
	{ Name: 'Insectoid', Tile: 85 },
	{ Name: 'Buzzar', Tile: 86 },
	{ Name: 'Sporoid', Tile: 87 },
	{ Name: 'Madman', Tile: 88 },
	{ Name: 'CreeperThistle', Tile: 89 },
	{ Name: 'Incarnate', Tile: 90 },
	{ Name: 'Haystax', Tile: 91 },
	{ Name: 'Bizarro', Tile: 92 },
	{ Name: 'Lancer', Tile: 93 },
	{ Name: 'Pincer', Tile: 94 },
	{ Name: 'Mask', Tile: 95 },
	{ Name: 'Fungu', Tile: 96 },
	{ Name: 'Skelegon', Tile: 97 },
	{ Name: 'KR32', Tile: 98 },
	{ Name: 'A3PZ', Tile: 99 },
	{ Name: 'HWK9', Tile: 100 }
];

FileMap.Junk = [
	{ Name: 'Barrel/Barrel0000', Tile: 105 },
	{ Name: 'Plant/Plant0000', Tile: 106 },
	{ Name: 'Pot/Pot0000', Tile: 107 }
];

FileMap.Runes = [
	{ Name: 'Lob', Tile: 125 },
	{ Name: 'Shield', Tile: 126 },
	{ Name: 'Mace', Tile: 127 }
];
