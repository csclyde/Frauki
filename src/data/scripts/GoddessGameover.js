ScriptRunner.scripts['goddess_after_killing'] = [
	{ name: 'show_text', props: { text: "Now, I hope that taught you a lesson.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "No more misbehaving.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "I'm watching you Frauki.", portrait: 'Goddess_Neutral' } },
	{ name: 'run_script', props: { name: 'exit_goddess' } },
];

ScriptRunner.scripts['damage_lecture'] = [
	{ name: 'show_text', props: { text: "Umm Frauki... What happened to that nice green energy sword I gave you?", portrait: 'Goddess_Neutral' } },

	{ func: function() {
        events.publish('pan_camera', { to: frauki.body.center, duration: 1000 });
	} },
	{ name: 'wait', props: { amount: 1000 } },

	{ name: 'show_text', props: { text: "Well... I dunno... I mean... It's...", portrait: 'Dazed' } },

	{ func: function() {
        events.publish('pan_camera', { to: goddess.body.center, duration: 1000 });
	} },
	{ name: 'wait', props: { amount: 1000 } },

	{ name: 'show_text', props: { text: "Frauki... why is it all red now like the Alien Robots weapons...?", portrait: 'Goddess_Neutral' } },

	{ func: function() {
        events.publish('pan_camera', { to: frauki.body.center, duration: 1000 });
	} },
	{ name: 'wait', props: { amount: 1000 } },

	{ name: 'show_text', props: { text: "Well, there was this secret club where the Alien Robots hung out. And they started dropping out of the ceiling. And I was like SHLING, CHOP, WOOSH", portrait: 'Mischeif' } },
	{ name: 'show_text', props: { text: "And all the Alien Robots were exploding, and there was this announcer guy, and he was a total jerk...", portrait: 'Mischeif' } },
	{ name: 'show_text', props: { text: "And then he said I was cheating, but also he said earlier that if I won I could have some of their power.", portrait: 'Mischeif' } },
	{ name: 'show_text', props: { text: "I didn't really know what he meant but the door closed behind me, and so I started fighting all these Alien Robots, and--", portrait: 'Mischeif' } },
	
	{ func: function() {
        events.publish('pan_camera', { to: goddess.body.center, duration: 1000 });
	} },
	{ name: 'wait', props: { amount: 1000 } },

	{ name: 'show_text', props: { text: "Ok, ok, stop. Please be quiet... It's fine. I thought you would like the green energy, but I guess not. Whatever.", portrait: 'Goddess_Neutral' } },
	
	{ name: 'run_script', props: { name: 'exit_goddess' } },
];

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
ScriptRunner.scripts['first_gubr_death'] = [
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
	{ name: 'show_text', props: { text: "Yeah, I'll stay out... heh heh...", portrait: 'Mischeif' } },
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
	{ name: 'show_text', props: { text: "I wasn't crying... I'm not a baby...", portrait: 'Displeased' } },
	{ name: 'run_script', props: { name: 'exit_goddess' } },
];

ScriptRunner.scripts['second_ql0k'] = [
	{ name: 'show_text', props: { text: "Don't forget to roll Frauki. If you don't use your roll you're a sitting frog.", portrait: 'Goddess_Neutral' } },
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

ScriptRunner.scripts['second_shortcut'] = [
	{ name: 'show_text', props: { text: "You're opening lots of seals! That's good!", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "I'm proud of you...", portrait: 'Goddess_Neutral' } },
	{ name: 'run_script', props: { name: 'exit_goddess' } },
];

ScriptRunner.scripts['first_kr32_death'] = [
	{ name: 'show_text', props: { text: "I saw that one coming. Yeah...", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "That horrible thing was the KR32 Alien Murderbot.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "It wasn't programmed for anything besides murder.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "I mean, we all like killing a bit. But the KR32 takes it too far.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "Go give it a taste of it's own programming.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "You got it! He's going down!", portrait: 'Mad' } },
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
	{ name: 'show_text', props: { text: "But I really, really... really... want my Prism Gems back...", portrait: 'Goddess_Neutral' } },
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
		"I can tell you're getting close to the first Prism Gem Frauki. Yay!",
		"Ughh, I guess I'll have to make these daisies work. Oh, what do you need Frauki?",
		"Everytime you kill a robot, I feel one drip of precious joy. Make sure and kill lots and lots of them for me, ok.",
		"Pick some flowers for me from the Frogland Gardens, ok Frauki?",
		"Oh, that was frustrating wasn't it. I'm sorry little tadpole.",
		"...I expect more from you Frauki. Don't let me down... please."
	], portrait: 'Goddess_Neutral' } },
	{ name: 'run_script', props: { name: 'exit_goddess' } },
];

// TO APARTMENTS SHORTCUT //////////

ScriptRunner.scripts['first_checkpoint'] = [
	{ name: 'show_text', props: { text: "Oh, you found one of my little warp apples.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "I was hoping those might help you out!", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "Feels pretty strange, huh? You get used to it, don't worry.", portrait: 'Goddess_Neutral' } },
	{ name: 'run_script', props: { name: 'exit_goddess' } },
];

ScriptRunner.scripts['spider_death'] = [
	{ name: 'show_text', props: { text: "Oh Frauki, yuck. Were you playing around with those nasty little spider?", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "They bit me all over... It really hurt...", portrait: 'Dazed' } },
	{ name: 'show_text', props: { text: "Oh get out of the Cathedral, don't bring any eggs in here.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "That's so gross Frauki. Shoo.", portrait: 'Goddess_Neutral' } },
	{ name: 'run_script', props: { name: 'exit_goddess' } },
];

ScriptRunner.scripts['goddess_console_area4'] = [
	{ name: 'show_text', props: { text: [
		"The Tenements are so ugly. I'm a little embarrased you saw that, Frauki.",
		"Be careful down there Frauki, the Tenemenets are not safe!",
		"Have you been splashing around in that dirty water Frauki? You have a... bit of an aroma...",
		"Don't slip and fall down there Frauki. It's really dangerous!",
		"Keep going Frauki, I know you can get through the Tenements. There's a Prism Gem there for sure!",
	], portrait: 'Goddess_Neutral' } },
	{ name: 'run_script', props: { name: 'exit_goddess' } },
];

// TO CHUTE SHORTCUT //////////
ScriptRunner.scripts['first_hwk9_death'] = [
	{ name: 'show_text', props: { text: "The killer hawk. She is a tough one for sure.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "I've seen her do terrible things. What a nasty piece of work.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "Don't feel too bad Frauki, it's ok that you lost. I kind of expected it.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "You'll get her eventually...", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "Do you really think so?", portrait: 'Enticed' } },
	{ name: 'run_script', props: { name: 'exit_goddess' } },
];

// CHUTE SHORTCUT TO WILL GEM //////////
ScriptRunner.scripts['goddess_console_area5'] = [
	{ name: 'show_text', props: { text: [
		"You're almost out of the Tenements Frauk! The next Prism Gem is so close!",
		"Be careful. Be wise. Be clever. Never give up. Ummm... and keep a smile on your face. Hmm what else...",
		"Oh, what is it Frauki? Back here again? Ok...",
		"What's taking so long...",
	], portrait: 'Goddess_Neutral' } },
	{ name: 'run_script', props: { name: 'exit_goddess' } },
];

// DEPTHS CHECKPOINT TO BASEMENT SHORTCUT //////////
ScriptRunner.scripts['first_h0p8_death'] = [
	{ name: 'show_text', props: { text: "Those grasshopper-looking creeps really weird me out.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "Nope. I don't like them. Yuck.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "I'm just glad it's you and not me having to fight them.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "They could tear my dress Frauki... and we don't want that, do we?", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "Yeah... I guess not.", portrait: 'Displeased' } },
	{ name: 'run_script', props: { name: 'exit_goddess' } },
];

ScriptRunner.scripts['goddess_depths'] = [
	{ name: 'show_text', props: { text: [
		"Wow, you've gone so deep... it's kind of scary Frauki. I haven't been that deep for hundreds of years.",
		"Is everything going ok down there Frauki?",
		"I know it's a little bit... dank... down there. Sorry.",
		"Did the mean little Alien Robots get you again? Oh Frauki...",
		"You're so close Frauki. Get that next Prism Gem! I'll meet you there once you get it.",
	], portrait: 'Goddess_Neutral' } },
	{ name: 'run_script', props: { name: 'exit_goddess' } },
];

// BASEMENT SHORTCUT TO PIPE SHORTCUT //////////
ScriptRunner.scripts['first_AZP3_death'] = [
	{ name: 'show_text', props: { text: "You got punched in the face, Frauki.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "Well, it looked really painful and humiliating.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "Ha ha, yeah, it did.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "Grrr...", portrait: 'Mad' } },
	{ name: 'show_text', props: { text: "Aww, I'm sorry Frauki. It's ok. I'm sorry.", portrait: 'Goddess_Neutral' } },
	{ name: 'run_script', props: { name: 'exit_goddess' } },
];

ScriptRunner.scripts['goddess_depths2'] = [
	{ name: 'show_text', props: { text: [
		"It's getting pretty wet down there, huh? All the water in Frogland has dripped down I guess.",
		"Stay focused, Frauki. You're in the home stretch now. Soon I will have my Prism Gems. Won't that be great?",
		"Oh I can't wait to have my gems back! All your suffering will have been worth it.",
		"Ah ah, no crying. You're a tough killer, not a crybaby. Right?",
	], portrait: 'Goddess_Neutral' } },
	{ name: 'run_script', props: { name: 'exit_goddess' } },
];

// PIPE SHORTCUT TO LUCK GEM //////////
ScriptRunner.scripts['first_sw8t_death'] = [
	{ name: 'show_text', props: { text: "What even was that thing? I've never seen it before.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "I guess he wasn't much of a friend, whatever he was.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "Well, I'm cheering you on, but... yikes... how...", portrait: 'Goddess_Neutral' } },
	{ name: 'run_script', props: { name: 'exit_goddess' } },
];

ScriptRunner.scripts['goddess_depths3'] = [
	{ name: 'show_text', props: { text: [
		"Honestly Frauki, I'm totally lost trying to watch you. I have no idea where you are down there. I'm glad you do though!",
		"I'm honestly really impressed you know how to get around down there. I never would have guessed.",
		"How are you doing little tadpole? Getting tired? It's hard dying over and over, isn't it.",
		"I know how much you want to get my Prism Gems back to me Frauki. Thanks...",
		"What a little trooper you are. Constantly dying and showing back up, then heading right back out.",
		"The Prism Gem is close Frauki, I can taste it. I actually did taste it, once. Not very good. But it's so pretty.",
	], portrait: 'Goddess_Neutral' } },
	{ name: 'run_script', props: { name: 'exit_goddess' } },
];

// FINAL STRETCH //////////
ScriptRunner.scripts['final_stretch'] = [
	{ name: 'show_text', props: { text: [
		"All that's left to do it get through the Alien Robot ship. I can't believe you're almost done!",
		"Go show them what happens when they mess with me. Destroy them without mercy, you little spitfire!",
		"Let's destroy every single Alien Robot! Are you with me?",
		"You are my little angel of destruction. Go forth and kill! Ha ha ha.",
		"This Alien Robot ship should be a piece of cake! Burn it to the ground!",
	], portrait: 'Goddess_Neutral' } },
	{ name: 'run_script', props: { name: 'exit_goddess' } },
];

// GENERIC MESSAGES //////////

ScriptRunner.scripts['goddess_console'] = [
	{ name: 'show_text', props: { text: "Oh you poor thing... Don't worry, I've got you back on your feet. Now get out there and give it another shot!", portrait: 'Goddess_Neutral' } },
	{ name: 'run_script', props: { name: 'exit_goddess' } },
];
