var Menus = {
	main: [
		{ text: 'Continue Adventure', script: 'continue_game' },
		{ text: 'New Adventure', script: 'new_game' },
		{ text: 'Settings', script: 'show_settings_menu' },
	],

	pause: [
		{ text: 'Resume Adventure', script: 'unpause_game' },
		{ text: 'Restart', script: 'restart_game' },
		{ text: 'Settings', script: 'show_settings_menu' },
	],

	settings: [
		{ text: 'Sound', script: 'adjust_sound' }, //on / off
		{ text: 'Music Volume', script: 'adjust_music_volume' }, // normal, quiet, really quiet, off
		{ text: 'Sound Volume', script: 'adjust_sound_volume' }, // normal, quiet, really quiet, off
		{ text: 'Configure Controls', script: 'show_controls_menu' },
		{ text: 'Back', script: 'exit_settings_menu' },
	],

	controls: [
		{ text: 'Reset Bindings', script: 'reset_control_bindings' },
		{ text: 'Back', script: 'show_settings_menu' },
	],
};