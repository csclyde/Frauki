ScriptRunner.scripts['goddess_surprised_death1'] = [
	{ name: 'show_text', props: { text: "Oh. You died already...", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "...", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "Well, get back out there and try again Frauki.", portrait: 'Goddess_Neutral' } },
	{ name: 'run_script', props: { name: 'exit_goddess' } },
];

ScriptRunner.scripts['goddess_surprised_death2'] = [
	{ name: 'show_text', props: { text: "Hmm. You didn't get very far that time either...", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "Must have been bad luck. Just be careful Frauki. Take your time.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "Now do what I say and get back out there.", portrait: 'Goddess_Neutral' } },
	{ name: 'run_script', props: { name: 'exit_goddess' } },
];

ScriptRunner.scripts['goddess_surprised_death3'] = [
	{ name: 'show_text', props: { text: "Frauki... you're having some trouble...", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "I thought you would know what you were doing...", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "Well, I choose to still believe in you.", portrait: 'Goddess_Neutral' } },
	{ name: 'run_script', props: { name: 'exit_goddess' } },
];

ScriptRunner.scripts['goddess_surprised_death_final'] = [
	{ name: 'show_text', props: { text: "Keep trying... I guess.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "Maybe you'll get it eventually...", portrait: 'Goddess_Neutral' } },
	{ name: 'run_script', props: { name: 'exit_goddess' } },
];

ScriptRunner.scripts['first_gubr'] = [
	{ name: 'show_text', props: { text: "Ouch, looks like that annoying little robot got you.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "He's a coward, but look out for his poker.", portrait: 'Goddess_Neutral' } },
	{ name: 'run_script', props: { name: 'exit_goddess' } },
];

ScriptRunner.scripts['first_buzzar'] = [
	{ name: 'show_text', props: { text: "Oh my, those flying bugs are really annoying, aren't they.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "Don't cry now Frauki, it's ok.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "Just watch out, when you hit them they get pretty angry.", portrait: 'Goddess_Neutral' } },
	{ name: 'run_script', props: { name: 'exit_goddess' } },
];

ScriptRunner.scripts['first_health_upgrade'] = [
	{ name: 'show_text', props: { text: "Look at you Frauki, you got some more health!", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "That's very cool! Keep getting more health.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "I think it will really help your progress.", portrait: 'Goddess_Neutral' } },
	{ name: 'run_script', props: { name: 'exit_goddess' } },
];

ScriptRunner.scripts['first_shortcut'] = [
	{ name: 'show_text', props: { text: "You opened another seal!", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "Frauki, you're doing such a good job. Keep it up.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "Even though you died it's ok, you can use that seal to get back!", portrait: 'Goddess_Neutral' } },
	{ name: 'run_script', props: { name: 'exit_goddess' } },
];

ScriptRunner.scripts['goddess_console_area1'] = [
	{ name: 'show_text', props: { text: [
		"Ouch, that one looked pretty bad Frauki. But keep trying! My Prism Gems still need saving.",
		"You're not thinking about giving up, are you Frauki? I want my Prism Gems!",
		"You can do better, Frauki. Go do what I tell you or you'll be in trouble.",
		"Aww, I'm sorry Frauki. You just got creamed pretty hard. Well, wipe those tears away and try again.",
		"Don't even think about giving up! Or I'll be very mad.",
		"Well, that wasn't your best attempt. Try to do your best, each and every time!",
		"It will get easier, Frauki. Just keep trying!",
		"You didn't think it would be easy, did you Frauki? The Alien Robots are mean and nasty and relentless!",
		"Hmmmm... you tried, I guess. Just make sure and do better this time.",
	], portrait: 'Goddess_Neutral' } },
	{ name: 'run_script', props: { name: 'exit_goddess' } },
];

ScriptRunner.scripts['goddess_console'] = [
	{ name: 'show_text', props: { text: "Oh you poor thing... Don't worry, I've got you back on your feet. Now get out there and give it another shot!", portrait: 'Goddess_Neutral' } },
	{ name: 'run_script', props: { name: 'exit_goddess' } },
];
