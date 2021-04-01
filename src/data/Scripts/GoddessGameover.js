// INTRO AREA //////////
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

// TO STATUE SHORTCUT //////////
ScriptRunner.scripts['first_gubr'] = [
	{ name: 'show_text', props: { text: "Ouch, looks like that annoying little robot got you.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "He's a coward, but watch out for his little poker. It's really painful.", portrait: 'Goddess_Neutral' } },
	{ name: 'run_script', props: { name: 'exit_goddess' } },
];

ScriptRunner.scripts['tower_troll1'] = [
	{ name: 'show_text', props: { text: "Frauki, were you playing around in the crashed ship?", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "Tsk tsk, it's much too dangerous there. You're not ready.", portrait: 'Goddess_Neutral' } },
	{ name: 'run_script', props: { name: 'exit_goddess' } },
];

ScriptRunner.scripts['tower_troll2'] = [
	{ name: 'show_text', props: { text: "Frauki, do what I tell you. Please.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "You're not ready for the ship yet.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "So unless you like getting punched in the face, be a good girl and stay out!", portrait: 'Goddess_Neutral' } },
	{ name: 'run_script', props: { name: 'exit_goddess' } },
];

ScriptRunner.scripts['tower_troll3'] = [
	{ name: 'show_text', props: { text: "You're being very naughty, playing about in that ship.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "You have work to do, silly girl. Just stop it.", portrait: 'Goddess_Neutral' } },
	{ name: 'run_script', props: { name: 'exit_goddess' } },
];

ScriptRunner.scripts['tower_troll_final'] = [
	{ name: 'show_text', props: { text: "Hmmmph. Maybe I just won't bring you back next time.", portrait: 'Goddess_Neutral' } },
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

// TO WELL SHORTCUT //////////

ScriptRunner.scripts['first_ql0k'] = [
	{ name: 'show_text', props: { text: "Oopsie... looks like you got a little booboo from the turret.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "It doesn't move, so you should have no problem cutting those things down.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "So wipe those tears and try again!", portrait: 'Goddess_Neutral' } },
	{ name: 'run_script', props: { name: 'exit_goddess' } },
];

ScriptRunner.scripts['second_ql0k'] = [
	{ name: 'show_text', props: { text: "Don't forget to roll Frauki. If you don't use your roll you're a sitting duck.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "Go back and try again Frauki.", portrait: 'Goddess_Neutral' } },
	{ name: 'run_script', props: { name: 'exit_goddess' } },
];

ScriptRunner.scripts['goddess_console_area2'] = [
	{ name: 'show_text', props: { text: [
		"You're making good progress little tadpole! Keep trying. You can do this.",
		"Aww, did little Frauki get an owwie? Ha ha ha. Oh sorry I don't mean to laugh.",
		"Oh Frauki. Sometimes I wonder about you...",
		"Did you try your best? That's right. I know. Just do better this time, for me, ok?"
	], portrait: 'Goddess_Neutral' } },
	{ name: 'run_script', props: { name: 'exit_goddess' } },
];

// TO WIT GEM //////////

ScriptRunner.scripts['first_kr32'] = [
	{ name: 'show_text', props: { text: "I saw that one coming. Yeah...", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "That horrible thing was the KR32 Alien Murderbot.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "It wasn't programmed for anything besides murder.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "I mean, we all like killing a bit. But the KR32 takes it too far.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "Go give it a taste of it's own programming.", portrait: 'Goddess_Neutral' } },
	{ name: 'run_script', props: { name: 'exit_goddess' } },
];

ScriptRunner.scripts['wit_guard'] = [
	{ name: 'show_text', props: { text: "YOU WERE SO CLOSE!", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "YOU WERE RIGHT THERE!", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "HOW!", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "Oh, I'm sorry... You were robbed.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "That was just not fair. Ugh...", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "Well, hmm. Once more. Go.", portrait: 'Goddess_Neutral' } },
	{ name: 'run_script', props: { name: 'exit_goddess' } },
];

ScriptRunner.scripts['wit_guard2'] = [
	{ name: 'show_text', props: { text: "AGAIN??", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "Are you kidding with me Frauki?", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "I just don't even know what to say.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "It's not your fault... you tried your best... it's not your fault.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "I'll keep telling myself that.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "But I really, really... really... want my Prism Shards back...", portrait: 'Goddess_Neutral' } },
	{ name: 'run_script', props: { name: 'exit_goddess' } },
];

ScriptRunner.scripts['wit_guard3'] = [
	{ name: 'show_text', props: { text: "Ok. Well. It is what it is.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "You're trying. I know. I'm sorry if I am harsh on your Frauki.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "But you really are playing with my emotions now.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "Ahem. Nice, I'm going to be nice.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "Good job Frauki! You can do it! Keep trying!", portrait: 'Goddess_Neutral' } },
	{ name: 'run_script', props: { name: 'exit_goddess' } },
];

ScriptRunner.scripts['wit_guard_final'] = [
	{ name: 'show_text', props: { text: "Again.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "Go.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "Now.", portrait: 'Goddess_Neutral' } },
	{ name: 'run_script', props: { name: 'exit_goddess' } },
];

ScriptRunner.scripts['goddess_console_area3'] = [
	{ name: 'show_text', props: { text: [
		"You're really not doing too bad Frauki. A little clumsy, but that's ok!",
		"I can tell you're getting close to the first Prism Shard Frauki. Yay!",
		"Ughh, I guess I'll have to make these daisies work. Oh, what do you need Frauki?",
		"Everytime you kill a robot, I feel one drip of precious joy. Make sure and kill lots and lots of them for me, ok.",
		"Pick some flowers for me from the Frogland Gardens, ok Frauki?",
		"Oh, that was frustrating wasn't it. I'm sorry little tadpole.",
		"...I expect more from you Frauki. Don't let me down... please."
	], portrait: 'Goddess_Neutral' } },
	{ name: 'run_script', props: { name: 'exit_goddess' } },
];

// GENERIC MESSAGES //////////

ScriptRunner.scripts['goddess_console'] = [
	{ name: 'show_text', props: { text: "Oh you poor thing... Don't worry, I've got you back on your feet. Now get out there and give it another shot!", portrait: 'Goddess_Neutral' } },
	{ name: 'run_script', props: { name: 'exit_goddess' } },
];
