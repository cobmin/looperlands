Types = require("../../../shared/js/gametypes");
///MAIN QUESTS///
quests = [
    { //DONE
        id: "OA_QUEST_1",
        name: "Hushwind's Slimy Problem",
        longText: "Ah, traveler! Hushwind used to be a peaceful place. But with King RC's absence, even simple creatures like slimes have grown aggressive, threatening our village. Could you assist us in reducing their numbers outside? It might buy us some time to figure out the larger threat looming over Looporia.",
        startText: "Hello there, adventurer!",
        endText: "Slimes pushed back! - Go see Elara!",
        eventType: "KILL_MOB",
        npc: Types.Entities.TORIN,
        target: Types.Entities.SLIME,
        amount: 30,
        level: 1,
        medal: Types.Medals.RAT
    },
    { //DONE
        id: "OA_QUEST_2",
        name: "Boar's Hide and Seek",
        startText: "Ah, a new face!",
        longText: "You're the one who helped Guard Aleron with the slimes, aren't you? I'm in desperate need of assistance. The boars around the village, usually a source of hides for my work, have become aggressive and are hindering my ability to gather materials. If you could take some down and bring me their hides, it would be of great help to both me and the village. We need to ensure we're well-equipped, especially now with King RC missing and uncertainty clouding our lands.",
        endText: "Boar hides collected!- Go see Eldrin!",
        eventType: "LOOT_ITEM",
        npc: Types.Entities.ELARA,
        target: Types.Entities.BOARHIDE,
        amount: 30,
        level: 2,
        medal: Types.Medals.HEARTH
    },

    { //DONE
        id: "OA_QUEST_3",
        name: "The Slime King's Reign",
        startText: "Ah, just who I needed!",
        longText:  "So, you're the one who's been aiding our people. I commend you for your efforts. But we have a more pressing issue at hand. The sudden surge of slimes around our village is no accident. Our scouts have reported sightings of a creature they've named the 'Slime King' in a nearby cave. We believe it's the source of our troubles. If you could brave the depths and rid us of this menace, it could be the key to understanding the disturbances across Looporia in the wake of King RC's absence.",
        endText: "Slime King slain! - Progress onward!",
        eventType: "KILL_MOB",
        npc: Types.Entities.ELDRIN,
        target: Types.Entities.KINGSLIME,
        amount: 1,
        requiredQuest: "OA_QUEST_1",
        level: 2,
        medal: Types.Medals.HEARTH
    },
    { //DONE
        id: "OA_QUEST_4",
        name: "Planes of Aggression",
        startText: "A timely arrival!",
        longText:  "Traveler, you come at a dire time. My men and I were ambushed. These plains were once calm, but ever since King RC's departure, they've been swarming with these vile creatures we've named 'Gnashlings'. Their numbers are overwhelming. I implore you, if you can thin their ranks, it might give us a fighting chance to reclaim the Windweave Planes and push these creatures back. We need to stabilize this area, or all of Looporia might be at risk.",
        endText: "Gnashlings pushed back! - Go see Draylen!",
        eventType: "KILL_MOB",
        npc: Types.Entities.DRAYLEN,
        target: Types.Entities.GNASHLING,
        amount: 30,
        requiredQuest: "OA_QUEST_3",
        level: 3,
        medal: Types.Medals.HEARTH
    },

    { //IN PROGRESS
        id: "OA_QUEST_5",
        name: "The Key to Thudlord",
        startText: "Ready for your next challenge?",  
        longText: "Your efforts have certainly made a dent in their numbers, but there's another pressing matter. Deep within the plains, there's a formidable creature, Thudlord. He's no ordinary Gnashling; he's their leader and the key to their organized aggression. We've noticed he carries a unique key, which we believe unlocks the sealed chambers in the Windweave Planes, possibly hiding something that's causing the disturbances. Eliminate Thudlord and retrieve that key. It's crucial for understanding and combating the growing menace in Looporia.",
        endText: "Thudlord King slain! - Go see Draylen!",
        eventType: "LOOT_ITEM",
        npc: Types.Entities.DRAYLEN,
        target: Types.Entities.THUDKEY,
        amount: 1,
        requiredQuest: "OA_QUEST_4",
        level: 3,
        medal: Types.Medals.HEARTH
    },
    { //IN PROGRESS
        id: "OA_QUEST_6",
        name: "Relic of Windweave",
        startText: "Ready to make history?", 
        longText: "Your bravery in retrieving the key is commendable. Now, we face an even more challenging task. Our scouts have identified two separate chambers inside the Windweave Planes' caves, each guarded by a formidable leader of the Gnashlings. In the first chamber, you'll encounter Razorclaw, who guards the Luminous Orb. The other chamber is overseen by Grizzlefang, who possesses the Crystalline Shard. Venture deep into both caves, confront these leaders, and retrieve the relics. We believe that together, they hold a power that might be the key to understanding the growing disturbances in Looporia since King RC's disappearance. Once you have both items, return to me. Together, we will unravel this mystery.",
        endText: "Orb obtained! - Progress onward!",
        eventType: "LOOT_ITEM",
        npc: Types.Entities.DRAYLEN,
        target: Types.Entities.ORB,
        amount: 1,
        requiredQuest: "OA_QUEST_5",
        level: 3,
        medal: Types.Medals.HEARTH
    },

    { //DONE
        id: "OA_QUEST_7",
        name: "Webbed pathways",
        startText: "There's much to be done!", 
        longText: "The once serene Silkthread Pass is now cloaked in a veil of darkness, overrun by a relentless tide of spiders. Their webs hang like grim tapestries, turning our cherished paths into treacherous labyrinths. Each step within their realm is fraught with danger, and our villagers whisper of shadows moving in the depths. We need a courageous soul to venture into this brooding abyss and break the arachnid stranglehold. Your actions could be the beacon of light that guides us out of this encroaching gloom.",
        endText: "Spiders have been quelled! - Go see Liora",
        eventType: "KILL_MOB",
        npc: Types.Entities.LIORA,
        target: Types.Entities.SPIDER,
        amount: 30,
        requiredQuest: "OA_QUEST_6",
        level: 4,
        medal: Types.Medals.HEARTH
    },

    {
        id: "OA_QUEST_8",
        name: "Lurking in the Shadows",
        startText: "A hero's welcome to you!", 
        longText: "Within the twisting caverns of Silkthread Pass, a new peril has taken wing. Bats, creatures of the night, now swarm in unnerving numbers, their constant fluttering a sinister soundtrack to our plight. The once whisper-quiet pass echoes with their eerie screeches, casting a shadow over the heart of adventurers brave enough to traverse these paths. We need someone to thin their ranks and collect their wings for study. This may hold the key to understanding why these nocturnal beings have become so unnaturally abundant and aggressive. Your courage in facing this winged infestation will not only aid in restoring tranquility to Silkthread Pass but also help unravel the mysteries lurking within these caves.",
        endText: "Bats have been dealt with! - Go See Liora",
        eventType: "LOOT_ITEM",
        npc: Types.Entities.LIORA,
        target: Types.Entities.BATWING,
        amount: 30,
        requiredQuest: "OA_QUEST_6",
        level: 4,
        medal: Types.Medals.HEARTH
    },

    {
        id: "OA_QUEST_9",
        name: "Twilight's Arachnid",
        startText: "You look like you mean business!", 
        longText: "Nestled within Silkthread Pass, a particularly cunning spider, known as the Arachweave, has become a thorn in our side. More troublesome than legendary, this oversized arachnid has snatched a key vital to our efforts in the pass. The Arachweave is not alone; it's guarded by its loyal offspring, making direct confrontation tricky. Your task is to outmaneuver these guardians, confront the Arachweave, and reclaim the stolen key. While not the mightiest of foes, its defeat is crucial for us to regain control of this area and unlock paths crucial to our mission. Approach with caution and cunning.",
        endText: "Arachweave slain! - Go see Liora",
        eventType: "KILL_MOB",
        npc: Types.Entities.LIORA,
        target: Types.Entities.ARACHWEAVE,
        amount: 1,
        requiredQuest: "OA_QUEST_8",
        level: 4,
        medal: Types.Medals.HEARTH
    },

    {
        id: "OA_QUEST_10",
        name: "I'm not lost, you are!",
        startText: "Here for glory and honor?", 
        longText: "In the enigmatic depths of Dawnbloom Depths lies a hidden abode, shrouded in mystery and whispered tales. This secluded haven belongs to the Dawnbloom Hermit, a recluse rumored to possess knowledge crucial to understanding the secrets of these depths. Your quest is to navigate the labyrinthine passages of this underbrush, marked by both beauty and peril, to find the hermit's dwelling. The journey will not be straightforward, as the Depths are known for their deceptive tranquility and hidden dangers. Locating this elusive sanctuary could be the key to unraveling the enigmas that shroud Dawnbloom and aiding our cause greatly.",
        endText: "Located the house!",
        eventType: "LOOT_ITEM",
        npc: Types.Entities.TORVIN,
        target: Types.Entities.HERMITHOME,
        amount: 1,
        requiredQuest: "OA_QUEST_9",
        level: 4,
        medal: Types.Medals.HEARTH
    },

    {
        id: "OA_QUEST_11",
        name: "Dawnbloom Curse",
        startText: "Greetings traveller",
        longText: "A shadow has fallen over the once vibrant Dawnbloom forest, a curse sudden and inexplicable, draining the life and color from its very essence. The air hangs heavy with a silent despair, and flora and fauna alike wither under its oppressive grip. This malevolent force is not of natural making, and its resolution lies beyond simple remedies. Your mission, should you choose to accept it, is to delve into the heart of Dawnbloom, confront the source of this blight, and break the curse that suffocates the forest. Only a hero of true courage and determination can hope to lift this darkness and restore Dawnbloom to its former glory.",
        endText: "Curse has been lifted!",
        eventType: "KILL_MOB",
        npc: Types.Entities.THAELEN,
        target: Types.Entities.LOOMLEAF,
        amount: 1,
        requiredQuest: "OA_QUEST_9",
        level: 6,
        medal: Types.Medals.HEARTH
    },
    {
        id: "OA_QUEST_12",
        name: "Glacialord's Demise",
        startText: "What's your story, traveler?", 
        longText: "The time has come to face a chilling menace. Everfrost Enclave, once a haven of icy beauty, now trembles under the cold grip of the Glacialord. This towering behemoth of frost and ice has usurped control, turning the enclave into a frozen wasteland. Its power grows each day, and if left unchecked, it could spell disaster for all nearby lands. We need a warrior brave enough to confront this icy titan, to shatter its reign and restore balance to the enclave. The task is daunting, the peril great, but I believe you have the mettle to face this frigid fiend and emerge victorious.",
        endText: "Glacialord defeated!",
        eventType: "KILL_MOB",
        npc: Types.Entities.EDUR,
        target: Types.Entities.GLACIALORD,
        amount: 1,
        requiredQuest: "OA_QUEST_11",
        level: 16,
        medal: Types.Medals.HEARTH
    },
    {
        id: "OA_QUEST_13",
        name: "Icebound Treasures",
        startText: "Your timing is impeccable!", 
        longText: "Alright, here's a task for the bold. Deep within the cavernous expanse of Everfrost Enclave, something precious hides – icebound crystals. These crystals are no ordinary ice; they glitter with a rare and ancient magic, a remnant of the enclave's mystic past. But there's a bit of a snag – their exact location in the cavern is unknown. It's a vast, echoing labyrinth of ice and shadow, and these crystals could be nestled in any icy nook or cranny. So, I'm asking you to delve into the frosty depths, explore the enclave, and gather as many of these crystals as you can uncover. Think of it as a treasure hunt in a frozen wonderland, if you will.",
        endText: "Crystals delivered!",
        eventType: "LOOT_ITEM",
        npc: Types.Entities.LUMI,
        target: Types.Entities.ICEBOUNDCRYSTAL,
        amount: 25,
        requiredQuest: "OA_QUEST_11", // change
        level: 14,
        medal: Types.Medals.HEARTHS
    },
    {
        id: "OA_QUEST_14",
        name: "Satchel's Secrets",
        startText: "Eager for a quest?", 
        longText: "Here's a bit of a tricky one for you. Somewhere deep in the icy bowels of Everfrost Enclave lies a satchel, lost but incredibly valuable. It belonged to a researcher who ventured in to study the enclave's unique environment. Unfortunately, they had to make a hasty retreat, leaving the satchel behind. It contains vital research notes and samples – things we can't afford to lose. Your mission, should you decide to help, is to navigate the treacherous depths of the enclave, locate the satchel, and bring it back. It's a needle in a frosty haystack, but I have a feeling you're just the person for the job.",
        endText: "Recovered Satchel!",
        eventType: "LOOT_ITEM",
        npc: Types.Entities.EDUR,
        target: Types.Entities.SATCHEL,
        amount: 1,
        requiredQuest: "OA_QUEST_11", //change
        level: 14,
        medal: Types.Medals.HEARTH
    },
    {
        id: "OA_QUEST_15",
        name: "Essence of Frost",
        startText: "A hero graces us!", 
        longText: "Got a unique task for you. Inside Everfrost Enclave, there are beings we call crystoliths – living embodiments of ice and stone. When defeated, they release their essence, a substance brimming with raw, elemental energy. However, this essence dissipates quickly, so time is of the essence, quite literally! I need you to venture in, find these crystoliths, defeat them, and collect the essence they release. Quick reflexes are key; you'll have to gather it swiftly before it vanishes into thin air. It's a challenging task, but the rewards – and the knowledge we gain from these essences – could be invaluable.",
        endText: "Extracted essences!",
        eventType: "LOOT_ITEM",
        npc: Types.Entities.GELIDUS,
        target: Types.Entities.ICESSENCE,
        amount: 40,
        requiredQuest: "OA_QUEST_11", //change
        level: 14,
        medal: Types.Medals.HEARTH
    },
    {
        id: "OA_QUEST_16",
        name: "Nightharrows Nightfall",
        startText: "Your presence is a boon!", 
        longText: "A dire challenge awaits at the summit of Frostharrow Keep – the Night King, a formidable foe shrouded in shadow and malice. This towering figure, clad in dark armor, has struck fear across the land, his ruthless actions sparing no mercy for village or villager. Stories of his might have spread far and wide, especially after his devastating confrontations with King RC's elite guard. The time has come to put an end to his reign of terror, to prevent further destruction of our villages. Your mission is to ascend the daunting heights of Frostharrow Keep, confront this dreaded Night King, and defeat him once and for all. This task is not for the faint of heart, but it's crucial to ensure the safety of our lands and people.",
        endText: "King vanquished!",
        eventType: "KILL_MOB",
        npc: Types.Entities.TORIAN,
        target: Types.Entities.NIGHTHARROW,
        amount: 1,
        requiredQuest: "OA_QUEST_12", //change
        level: 21,
        medal: Types.Medals.HEARTH
    },
    {
        id: "OA_QUEST_17",
        name: "Recover doomforged greatswords.",
        startText: "Great to see you again!", 
        longText: "In the grim halls of Frostharrow Keep, the Night King's militia brandishes swords forged in darkness. These weapons are more than mere tools of war; they're symbols of the tyranny that grips our land. Your mission is to infiltrate the keep and relieve these guards of their swords. We plan to melt down these symbols of oppression, reforging them into something that can serve the cause of justice. Be stealthy, be swift, and bring back as many of their swords as you can carry.",
        endText: "King vanquished!",
        eventType: "LOOT_ITEM",
        npc: Types.Entities.TORIAN,
        target: Types.Entities.FORGEDSWORD,
        amount: 40,
        requiredQuest: "OA_QUEST_12", //change
        level: 14,
        medal: Types.Medals.HEARTH
    },

    {
        id: "OA_QUEST_18",
        name: "Defeat the Gloomforged warriors",
        startText: "The legend returns!", 
        longText: "The time has come to strike a decisive blow against the Night King's forces in Frostharrow Keep. His militia, a band of armored brutes, has been instrumental in his reign of terror. We need to weaken their numbers significantly. Your task is to engage and defeat these guards. Each one taken down is a step towards diminishing the Night King's strength and influence. This won't be an easy fight, but it's essential to break the stranglehold they have on the region and to prevent further atrocities.",
        endText: "King vanquished!",
        eventType: "KILL_MOB",
        npc: Types.Entities.TORIAN,
        target: Types.Entities.GLOOMFORGED,
        amount: 40,
        requiredQuest: "OA_QUEST_12", //change
        level: 14,
        medal: Types.Medals.HEARTH
    },
    {
        id: "OA_QUEST_19",
        name: "Tattered Banners",
        startText: "Destiny calls to you!", 
        longText: "Here's a mission of symbolic importance. Throughout Frostharrow Keep, the Night King has draped his banners – dark, foreboding symbols of his rule. These banners not only demoralize our people but also embolden his forces. We need to change that. Your task is to recover these banners from around the keep. By removing them, we'll be striking a blow to the Night King's propaganda and boosting the morale of our own troops. This act of defiance will send a clear message: his reign of terror is nearing its end.",
        endText: "King vanquished!",
        eventType: "LOOT_ITEM",
        npc: Types.Entities.TORIAN,
        target: Types.Entities.BANNER,
        amount: 15,
        requiredQuest: "OA_QUEST_12", //change
        level: 14,
        medal: Types.Medals.HEARTH
    },
    {
        id: "OA_QUEST_20",
        name: "The Spider Queen",
        startText: "May your blade stay sharp!", 
        longText: "Adventurer, I'm glad you've come. While our efforts have driven back many spiders, there remains a looming threat that overshadows our every move: Silkshade, the Spider Queen. Legends whisper of her unmatched power and control over the lesser spiders, casting a veil of darkness across Silkthread Pass. Her lair is deeper within the caves, protected by an intricate web of traps and minions. If we're ever to reclaim Silkthread Pass and bring light back to this area, she must be defeated. Embark on this perilous journey, confront Silkshade, and rid us of her malevolent reign. Only then can we hope for peace and safety in our lands. The fate of Silkthread Pass rests in your hands.",
        endText: "Bested Silkshade",
        eventType: "KILL_MOB",
        npc: Types.Entities.LIORA,
        target: Types.Entities.SILKSHADE,
        amount: 1,
        requiredQuest: "OA_QUEST_6",
        level: 5,
        medal: Types.Medals.HEARTH
    },
///SIDE QUESTS///

    {
        id: "OA_SIDE_1",
        name: "Revenge served..Slimey",
        startText: "Ready to carve your destiny?", 
        longText: "Ah, it's you! Perfect timing. Tried to handle those blasted red slimes myself, but they're tougher than they look. Got a good thrashing, and now I'm in no shape to go back in. But, I've got a plan. Their ooze – it's potent stuff. If we can collect enough, I reckon we can use it to our advantage. There's a cave just behind me, teeming with the red slimes. Could you brave the depths and collect, let's say, 15 samples of Red Ooze? It might be just what we need to turn the tables on these slippery foes.",
        endText: "Collected enough ooze!",
        eventType: "LOOT_ITEM",
        npc: Types.Entities.ELRIC,
        target: Types.Entities.REDOOZE,
        amount: 15,
        level: 2,
        medal: Types.Medals.HEARTH
    },
    {
        id: "OA_SIDE_2",
        name: "Do a Barrel search!",
        startText: "Your courage shines bright!", 
        longText: "Listen up! We've got a bit of a situation here. Those pesky Gnashlings are amassing weapons, hoarding them in their camps like treasures. Can't let that slide, can we? They're clever little critters, hiding their stash in barrels around the camp. Sneaky, right? I need someone with a keen eye and quick feet to scour their camps. We're talking about rummaging through, say, a dozen barrels to confiscate their weapons. It's risky, sure, but it'll give us an edge and maybe put a dent in their plans. You up for a bit of barrel-busting action?",
        endText: "Crippled Gnashling supplies!",
        eventType: "LOOT_ITEM",
        npc: Types.Entities.DRAYLEN,
        target: Types.Entities.WILDBLADE,
        amount: 12,
        level: 4,
        medal: Types.Medals.HEARTH
    },
    {
        id: "OA_SIDE_3",
        name: "Magic Mushrooms!?",
        startText: "Fortune smiles upon you!", 
        longText: "Just beyond Hushwind Village, within the shadowy confines of the nearby cave, a rare and curious flora thrives – Magic Mushrooms. These luminescent fungi are not only a marvel to behold but also hold properties essential to our alchemical studies. However, venturing into the cave is not without its risks, as the environment is as treacherous as it is mystical. I seek an intrepid soul to gather 20 of these glowing mushrooms. Your efforts will not only aid in our research but also help illuminate the darker corners of the cave, possibly revealing secrets long hidden in its depths.",
        endText: "Wow great! Job..feeling..dizzy",
        eventType: "LOOT_ITEM",
        npc: Types.Entities.ATHLYN,
        target: Types.Entities.MAGICMUSHROOM,
        amount: 20,
        level: 1,
        medal: Types.Medals.HEARTH
    },
    {
        id: "OA_SIDE_4",
        name: "Berry Serious",
        startText: "To what do we owe the honor?", 
        longText: "Hello there, dear! I'm in a bit of a pickle and could use your help. You see, I'm baking up some special treats for the village, but I'm running low on berries. There are plenty of berry bushes around town, bursting with juicy berries just perfect for my recipes. Would you be a dear and collect 8 berry bushes for me? Your help would mean the world, and who knows, I might just have a sweet reward waiting for you upon your return!",
        endText: "Whoah whoah! Don't eat those!",
        eventType: "LOOT_ITEM",
        npc: Types.Entities.NEENA,
        target: Types.Entities.WILDFLOWER,
        amount: 8,
        level: 1,
        medal: Types.Medals.HEARTH
    },
    {
        id: "OA_SIDE_5",
        name: "Whiskers' Mischievous Kittens",
        startText: "meow?",
        longText: "Meow! Huh, what's that, Whiskers? You look awfully anxious for a cat usually so laid-back. Ah, I see – your kittens have turned Timeglimmer into their personal playground again, haven't they? It seems our feline friend here is in a bit of a bind. His adorable little troublemakers have wandered off around town, no doubt getting up to all sorts of kitten mischief. Whiskers seems to think you're the purr-fect person for the job. Can you help round up his mischievous kittens? Keep an eye out; they're known for finding the most unexpected hiding spots!",
        endText: "Wow! What a good samaritan!",
        eventType: "LOOT_ITEM",
        npc: Types.Entities.WHISKERS,
        target: Types.Entities.BLACKCAT,
        amount: 7,
        level: 4,
        medal: Types.Medals.HEARTH
    },
    {
        id: "OA_SIDE_6",
        name: "They trixed us! They betrayed us!",
        startText: "The wind favors you today!", 
        longText: "Glink sad, very sad! Glink's friends, no good, big betray! They now Wildgrins, mean, nasty! Glink no understand why friends go bad. Glink thought friends forever, but they turn on Glink. Now Glink alone, but Glink smart, Glink find new friend, yes? You help Glink? Need make Wildgrins go away, too many, too mean! Kill them! show them no mess with Glink! Glink wait, Glink hope. You do good, Glink give shiny thank-you!",
        endText: "That should teach them a lesson!",
        eventType: "KILL_MOB",
        npc: Types.Entities.GLINK,
        target: Types.Entities.WILDGRIN,
        amount: 25,
        level: 6,
        medal: Types.Medals.HEARTH
    },
    {
        id: "OA_SIDE_7",
        name: "My pearls!",
        startText: "They steal from Glink! Get them back!",
        longText: "Bad, bad Wildgrins! They sneaky, they steal Glink's shiny things! Glink's treasures, Glink's sparklies! Glink worked hard for those, yes very hard. Glink no like thieves! You, new friend, help Glink? Need get back Glink's shinies. Wildgrins hide them, keep them, but they Glink's! You find, you bring back to Glink. Glink wait here, hope much. You do this, Glink happy, give you good good reward!",
        endText: "My preciouses!!",
        eventType: "LOOT_ITEM",
        npc: Types.Entities.GLINK,
        target: Types.Entities.GREEN_PEARL,
        amount: 8,
        level: 6,
        medal: Types.Medals.HEARTH
    },
    {
        id: "OA_SIDE_8",
        name: "Slimy coating ",
        startText: "Your bravery is renowned!", 
        longText: "Ah, good timing! Gripnar here need big favor. Me want make weapon stronger, scarier. You see, slimes nearby, they got special sludge. Very sticky, very icky! Gripnar got idea – coat weapon with slime sludge. Make enemies go 'eww' and 'yuck'! But Gripnar busy, can't go slime hunting now. You go, yes? Collect lots of slime sludge for Gripnar. Not too far, just over there. Bring back sludge, Gripnar make weapon nasty. Good deal, yes? You help, Gripnar happy, give you something nice.",
        endText: "Gripnar thanks you!",
        eventType: "LOOT_ITEM",
        npc: Types.Entities.GRIPNAR,
        target: Types.Entities.SLIMEBALL,
        amount: 15,
        level: 2,
        medal: Types.Medals.HEARTH
    },
////EVERPEAK QUESTS
    {
        id: "OA_SIDE_9",
        name: "Fishing Feast! ",
        startText: "Discover the fishing Isle", 
        longText: "Hello, adventurer! I couldn't help but notice you have the look of an expert angler. Odd thing to say? Perhaps, but hear me out. To the northwest lies an extraordinary fishing haven, an island infused with magic by Aldarion the Wavebinder. Its waters teem with a diverse array of fish, a result of Aldarion's enchantment. Be warned though, the abundance comes with its challenges.",
        endText: "Discovered the fishing island!",
        eventType: "LOOT_ITEM",
        npc: Types.Entities.THEDIUS,
        target: Types.Entities.EVERPEAKMAP1,
        amount: 1,
        level: 2,
        medal: Types.Medals.HEARTH
    },
    
    {
        id: "OA_SIDE_10",
        name: "The Gilded Gryphon",
        startText: "Dicover the Gilded Gryphon", 
        longText: "Ah, weary traveler! Your journey has been long and arduous, I can tell. Why not take a well-deserved respite at the Gilded Gryphon Tavern? Nestled in the bustling heart of our city, this legendary inn is the perfect place to relax, replenish, and share tales of your adventures. You'll find it brimming with warmth, good cheer, and perhaps a few intriguing secrets. It's an experience you won't want to miss! Head over there, kick back, and enjoy the hospitality of the Gilded Gryphon.",
        endText: "Discovered the Tavern!",
        eventType: "LOOT_ITEM",
        npc: Types.Entities.ESTELLA,
        target: Types.Entities.EVERPEAKMAP2,
        amount: 1,
        level: 2,
        medal: Types.Medals.HEARTH
    },
    {
        id: "OA_SIDE_11",
        name: "Enchanted Construction",
        startText: "Enchanted Homes", 
        longText: "Greetings, brave explorer! Have you heard about the latest development in our city? There's a curious area that may appear vacant at first glance, but don't be fooled. This is the future site of Enchanted Glade, a visionary project where magic meets architecture. The city's finest mages and craftsmen are weaving enchantments into every brick and beam, promising homes unlike any you've seen. Your task is to venture there and witness the magic in the making. Observe the construction, speak with the workers, and learn about the enchantments being cast. Who knows, you might even catch a glimpse of a house taking shape right before your eyes! This is a chance to be part of our city's history, to see how we're shaping a future where magic elevates everyday life.",
        endText: "Discovered Echanted Isle!",
        eventType: "LOOT_ITEM",
        npc: Types.Entities.NIANDRA,
        target: Types.Entities.EVERPEAKMAP3,
        amount: 1,
        level: 2,
        medal: Types.Medals.HEARTH
    },
    {
        id: "OA_SIDE_12",
        name: "Stormhelm Arena",
        startText: "Discover Stormhelm Arena", 
        longText: "Attention, warriors and spectators alike! Have you felt the rush of battle, the thrill of competition? Near the heart of the city lies the Stormhelm Arena, a grand coliseum where bravery and skill are tested in combat. This is no ordinary arena – here, players can challenge each other in fierce duels while an eager crowd cheers from the stands. Your quest is to find this arena and witness the spectacle of battle. Feel the energy of the crowd, hear the clash of steel, and maybe even step into the ring yourself. Whether you're a fighter seeking glory or a spectator craving excitement, Stormhelm Arena offers an experience like no other. It's a place where legends are made and heroes are born. Will you be part of the action?",
        endText: "Discoevered Stormhelm Arena",
        eventType: "LOOT_ITEM",
        npc: Types.Entities.BLARK,
        target: Types.Entities.EVERPEAKMAP4,
        amount: 1,
        level: 2,
        medal: Types.Medals.HEARTH
    },

    {
        id: "OA_SIDE_13",
        name: "Riverbreeze District",
        startText: "Discover the Riverbreeze District", 
        longText: "Explore the Riverbreeze District to the northeast, where the common and upper classes coexist in harmony. Wander its streets, mingle with diverse residents, and experience the unique blend of everyday life and luxury in this vibrant part of our floating city.",
        endText: "Discovered Riverbreeze District",
        eventType: "LOOT_ITEM",
        npc: Types.Entities.DANIEL,
        target: Types.Entities.EVERPEAKMAP5,
        amount: 1,
        level: 2,
        medal: Types.Medals.HEARTH
    }

    







]




exports.quests = quests;