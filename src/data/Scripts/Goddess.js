ScriptRunner.scripts['enter_goddess'] = [
	{ name: 'disallow_input', props: {} },
	{ name: 'pause_all_music', props: {} },
	{ name: 'play_music', props: { name: 'Choir', fade: 1000 } },

	{ func: function() {
        events.publish('pan_camera', { to: goddess.body.center, duration: 1000 });
	} },	
];

ScriptRunner.scripts['exit_goddess'] = [
	{ func: function() {
        events.publish('pan_camera', { to: frauki.body.center, duration: 1000 });
	} },
	{ name: 'stop_music', props: { name: 'Choir', fade: 1000 } },	

	{ name: 'wait', props: { amount: 1000 } },

	{ name: 'unpause_all_music', props: {} },	
	{ name: 'allow_input', props: {} },

];

ScriptRunner.scripts['goddess_summon_frauki'] = [
	{ name: 'show_text', props: { text: "Frauki... I need your help. Come along now. It's time to get to work...", portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 6000 } },
	{ name: 'hide_text', props: {} },
];

ScriptRunner.scripts['goddess_intro'] = [
	{ name: 'show_text', props: { text: 'There you are Frauki...', portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 5000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'wait', props: { amount: 200 } },
	{ name: 'show_text', props: { text: "It's been a long time since I've seen, well, anyone...", portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 7000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'wait', props: { amount: 200 } },
	{ name: 'show_text', props: { text: "I called you here because I need your help.", portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 7000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'wait', props: { amount: 200 } },
	{ name: 'show_text', props: { text: "These robots have crashed their ship here and are taking over.", portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 7000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'wait', props: { amount: 200 } },
	{ name: 'show_text', props: { text: "They took all the beautiful Prism Shards, and are sucking all the energy out of them.", portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 7000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'wait', props: { amount: 200 } },
	{ name: 'show_text', props: { text: "Go now with my blessing and bring me back those beautiful shining gems, Frauki.", portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 7000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'wait', props: { amount: 200 } },
	{ name: 'show_text', props: { text: "I know you can do it. I'm here for you if you run into any trouble.", portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 7000 } },
	{ name: 'hide_text', props: {} },
	
	{ name: 'run_script', props: { name: 'exit_goddess' } },
	{ name: 'wait', props: { amount: 1000 } },
	{ name: 'play_music', props: { name: 'Ruins', fade: 0 } },
	
];

ScriptRunner.scripts['goddess_welcome_return'] = [
	{ name: 'show_text', props: { text: "Welcome back Frauki. You've got some work to do!", portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 6000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'run_script', props: { name: 'exit_goddess' } },
	{ name: 'wait', props: { amount: 1000 } },
	{ name: 'play_music', props: { name: 'Ruins', fade: 0 } },
];

ScriptRunner.scripts['goddess_console'] = [
	{ name: 'show_text', props: { text: "Oh you poor thing... Don't worry, I've got you back on your feet. Now get out there and give it another shot!", portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 6000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'run_script', props: { name: 'exit_goddess' } },
	{ name: 'wait', props: { amount: 1000 } },
	{ name: 'play_music', props: { name: 'Ruins', fade: 0 } },
];

ScriptRunner.scripts['goddess_shard'] = [
	{ name: 'disallow_input', props: {} },
	{ name: 'show_text', props: { text: 'You found it!! You beautiful little person thing!!', portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 7000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'wait', props: { amount: 250 } },
	{ name: 'show_text', props: { text: 'Great work. Now if you walk up to the door, it will open the first of four seals.', portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 7000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'wait', props: { amount: 250 } },
	{ name: 'show_text', props: { text: 'Find the other three and I will finally be free...', portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 7000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'wait', props: { amount: 250 } },
	{ name: 'show_text', props: { text: 'FREEEEEEEE!!!', portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 7000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'allow_input', props: {} }
];

ScriptRunner.scripts['goddess_hurt_4'] = [
	{ name: 'disallow_input', props: {} },
	{ name: 'show_text', props: { text: "OUCH! What's your problem!? Don't do that again.", portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 2000 } },
	{ name: 'allow_input', props: {} }
];

ScriptRunner.scripts['goddess_hurt_3'] = [
	{ name: 'disallow_input', props: {} },
	{ name: 'show_text', props: { text: "Frauki why are you doing this?? I demand you stop!", portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 2000 } },
	{ name: 'allow_input', props: {} }
];

ScriptRunner.scripts['goddess_hurt_2'] = [
	{ name: 'disallow_input', props: {} },
	{ name: 'show_text', props: { text: "It hurts so bad... stop it you evil creature...", portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 2000 } },
	{ name: 'allow_input', props: {} }
];

ScriptRunner.scripts['goddess_hurt_1'] = [
	{ name: 'disallow_input', props: {} },
	{ name: 'show_text', props: { text: "I'm warning you... if you do that again you're not going to like what happens...", portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 2000 } },
	{ name: 'allow_input', props: {} }
];

ScriptRunner.scripts['goddess_rez_angry'] = [
	{ name: 'disallow_input', props: {} },

	{ name: 'show_text', props: { text: "I really don't appreciate being killed...", portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 3000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'wait', props: { amount: 100 } },
	{ name: 'show_text', props: { text: 'Don\'t.', portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 1000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'wait', props: { amount: 100 } },
	{ name: 'show_text', props: { text: 'Do.', portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 1000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'wait', props: { amount: 100 } },
	{ name: 'show_text', props: { text: 'It.', portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 1000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'wait', props: { amount: 100 } },
	{ name: 'show_text', props: { text: 'Again!!!!!!', portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 2000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'allow_input', props: {} }

];

ScriptRunner.scripts['seal_hall_intro'] = [
	{ name: 'disallow_input', props: {} },

	{ name: 'show_text', props: { text: "Oh my! You've opened the first of four seals! I know you could do it. YOu really are a wonderful little creature.", portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 7000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'wait', props: { amount: 200 } },
	{ name: 'show_text', props: { text: "Now keep it up, I'm sure the other prism shards can't be far. Don't get discouraged. YOu can do this.", portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 7000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'wait', props: { amount: 200 } },
	{ name: 'show_text', props: { text: "Oh yeah, there is a special gift for you in the room behind me. Use that red prism shard to get it!", portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 7000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'allow_input', props: {} }
];

ScriptRunner.scripts['open_second_seal'] = [
	{ name: 'disallow_input', props: {} },

	{ name: 'show_text', props: { text: "You opened the second seal! This is unbelievable...", portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 7000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'show_text', props: { text: "So close to freedom!! No more musty cell...", portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 4000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'wait', props: { amount: 200 } },
	{ name: 'show_text', props: { text: 'No more dank dripping ceiling...', portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 4000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'wait', props: { amount: 200 } },
	{ name: 'show_text', props: { text: 'Just the sweet, juicy nectar of freedom...', portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 4000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'wait', props: { amount: 200 } },
	{ name: 'show_text', props: { text: '...', portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 3000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'wait', props: { amount: 200 } },
	{ name: 'show_text', props: { text: 'Heh heh heh... just... please be careful. Don\'t give up.', portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 7000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'wait', props: { amount: 200 } },
	{ name: 'show_text', props: { text: '...and thanks. Thanks for helping me.', portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 5000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'allow_input', props: {} }
];

ScriptRunner.scripts['open_third_seal'] = [
	{ name: 'disallow_input', props: {} },

	{ name: 'show_text', props: { text: "You opened another seal!! Frauki... the closer you get, the harder it is to wait.", portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 7000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'show_text', props: { text: "Before I met you, I gave up on being free.", portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 7000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'show_text', props: { text: "I gave up on existing at all.", portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 7000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'show_text', props: { text: "As the years and decades went by, my spirit faded into oblivion.", portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 7000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'show_text', props: { text: "I no longer felt real, and time passed for me like it does for a stone.", portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 7000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'show_text', props: { text: "But now that there is just one seal left, I feel real again. I'm so scared of how excited I am. This might be too good to be happening.", portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 7000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'show_text', props: { text: "Please open the last seal. I know I'm asking so much of you. But if I don't escape now, my spirit will be destroyed.", portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 7000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'show_text', props: { text: "I'm so scared...", portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 7000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'allow_input', props: {} }
];

ScriptRunner.scripts['open_fourth_seal'] = [
	{ name: 'disallow_input', props: {} },

	{ name: 'show_text', props: { text: "The last seal is open...", portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 7000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'show_text', props: { text: "I'm free...", portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 7000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'show_text', props: { text: "But I'm scared to leave...", portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 7000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'show_text', props: { text: "Nothing will be the same...", portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 7000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'show_text', props: { text: "But the universe is calling me. I'm leaving this plane of existence.", portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 7000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'show_text', props: { text: "The joy is covering me... Goodbye Frauki... I love you.", portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 7000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'allow_input', props: {} }
];

ScriptRunner.scripts['goddess_restate'] = [
	{ name: 'show_text', props: { text: "Before I met you, I gave up on being free...", portrait: 'Goddess_Neutral' } }
];

ScriptRunner.scripts['goddess_freedom'] = [
	{ name: 'disallow_input', props: {} },

	{ name: 'show_text', props: { text: "Freedom!! No more musty cell...", portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 4000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'wait', props: { amount: 200 } },
	{ name: 'show_text', props: { text: 'No more dank dripping ceiling...', portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 4000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'wait', props: { amount: 200 } },
	{ name: 'show_text', props: { text: 'Just the sweet, juicy nectar of freedom...', portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 4000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'wait', props: { amount: 200 } },
	{ name: 'show_text', props: { text: '...', portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 3000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'wait', props: { amount: 200 } },
	{ name: 'show_text', props: { text: 'Now Frauki, I know I\'ve already asked a lot of you. But there is more to do. That prism shard you hold is a powerful artifact.', portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 9000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'wait', props: { amount: 200 } },
	{ name: 'show_text', props: { text: 'In fact, it\'s one of four powerful artifacts. Together they make up the Mother Prism, an object of great and mysterious power.', portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 9000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'wait', props: { amount: 200 } },
	{ name: 'show_text', props: { text: 'If you could find the remaining three prism shards that have been carelessly tossed around the world... well...', portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 9000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'wait', props: { amount: 200 } },
	{ name: 'show_text', props: { text: 'Just trust me. It will be pretty cool. I know you can do it... I\'m counting on you...', portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 9000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'allow_input', props: {} }

];

ScriptRunner.scripts['goddess_meet_with_shard'] = [
	{ name: 'disallow_input', props: {} },

	{ name: 'wait', props: { amount: 200 } },
	{ name: 'show_text', props: { text: 'Oh, hello there...', portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 4000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'wait', props: { amount: 200 } },
	{ name: 'show_text', props: { text: 'It looks like you\'ve found a Prism Shard! Yes, that big red jewel.', portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 7000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'wait', props: { amount: 200 } },
	{ name: 'show_text', props: { text: 'That\'s very good news, because I happen to need that shard to escape this horrible prison.', portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 7000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'wait', props: { amount: 200 } },
	{ name: 'show_text', props: { text: "I've been in here so long... would you mind just walking up and opening this door for me?", portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 7000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'allow_input', props: {} }

];