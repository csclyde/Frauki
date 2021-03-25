ScriptRunner.scripts['goddess_chat_intro'] = [
	{ name: 'show_text', props: { text: "Yes, Frauki? What is it?", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "Oh, just saying hi.", portrait: 'Neutral' } },
	{ name: 'show_text', props: { text: "Right.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "Well... I think I gave you pretty clear instructions Frauki.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "Run along now and... follow them. Please.", portrait: 'Goddess_Neutral' } },
	{ name: 'run_script', props: { name: 'exit_goddess' } },
];
