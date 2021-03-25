var Menus = {
	main: [
		{ getText: function() { return "ABCDEFGHIJKLMNOPQRSTUVWXYZ" }, script: 'continue_game' },
		{ getText: function() { return 'Continue Adventure' }, script: 'continue_game' },
		{ getText: function() { return 'New Adventure' }, script: 'new_game' },
		{ getText: function() { return 'Settings' }, script: 'show_settings_menu' },
	],

	pause: [
		{ getText: function() { return 'Resume Adventure' }, script: 'unpause_game' },
		{ getText: function() { return 'Restart' }, script: 'restart_game' },
		{ getText: function() { return 'Settings' }, script: 'show_settings_menu' },
	],

	settings: [
		{ 	
			getText: function() { return this.options[GameData.GetSoundSetting()] }, 
			script: 'adjust_sound',
			options: ['Normal Sound', 'Quiet Sound', 'Really Quiet Sound', 'No Sound']
		}, 
		{ getText: function() { return 'Configure Controls' }, script: 'show_controls_menu' },
		{ getText: function() { return 'Back' }, script: 'exit_settings_menu' },
	],

	controls: [
		{ getText: function() { return 'Reset Bindings' }, script: 'reset_control_bindings' },
		{ getText: function() { return 'Back' }, script: 'show_settings_menu' },
	],
};