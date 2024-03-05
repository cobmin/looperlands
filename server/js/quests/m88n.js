Types = require("../../../shared/js/gametypes");
quests = [
    {
        id: "KINGFROGGY_QUEST_1",
        name: "The King's Blue Pop Request",
        startText: ["If we can't get these darn balloon animals under control the whole cloud kingdom is going to float away!",
        "The King has requested that you pop 100 blue balloon dogs to see if that helps."],
        endText: "Thanks for your help popping those blue balloon dogs! It looks like we're still floating higher and higher though.",
        eventType: "KILL_MOB",
        npc: Types.Entities.KINGFROGGY,
        target: Types.Entities.BALLOONDOGB,
        amount: 100,
        level: 1,
        medal: Types.Medals.SKULL
    },
    {
        id: "KINGFROGGY_QUEST_2",
        name: "The King's Yellow Pop Request",
        startText: ["If we can't get these darn balloon animals under control the whole cloud kingdom is going to float away!",
        "The King has requested that you pop 100 yellow balloon dogs."],
        endText: "Thanks for your help popping those yellow balloon dogs! It looks like we're still floating higher and higher though.",
        eventType: "KILL_MOB",
        npc: Types.Entities.KINGFROGGY,
        target: Types.Entities.BALLOONDOGY,
        amount: 100,
        requiredQuest: "KINGFROGGY_QUEST_1",
        level: 4,
        medal: Types.Medals.SKULL
    },
    {
        id: "KINGFROGGY_QUEST_3",
        name: "The King's Green Pop Request",
        startText: ["If we can't get these darn balloon animals under control the whole cloud kingdom is going to float away!", 
        "The King has requested that you pop 100 green balloon dogs."],
        endText: "Thanks for your help popping those green balloon dogs! It looks like we're still floating higher and higher though.",
        eventType: "KILL_MOB",
        npc: Types.Entities.KINGFROGGY,
        target: Types.Entities.BALLOONDOGG,
        amount: 100,
        requiredQuest: "KINGFROGGY_QUEST_2",
        level: 6,
        medal: Types.Medals.SKULL
    },
    {
        id: "KINGFROGGY_QUEST_4",
        name: "The King's Aqua Pop Request",
        startText: ["If we can't get these darn balloon animals under control the whole cloud kingdom is going to float away!",
        "The King has requested that you pop 100 aqua balloon dogs."],
        endText: "Thanks for your help popping those aqua balloon dogs! It looks like we're still floating higher and higher though.",
        eventType: "KILL_MOB",
        npc: Types.Entities.KINGFROGGY,
        target: Types.Entities.BALLOONDOGA,
        amount: 100,
        requiredQuest: "KINGFROGGY_QUEST_3",
        level: 8,
        medal: Types.Medals.SKULL
    },
    {
        id: "KINGFROGGY_QUEST_5",
        name: "The King's Violet Pop Request",
        startText: ["If we can't get these darn balloon animals under control the whole cloud kingdom is going to float away!",
        "The King has requested that you pop 100 violet balloon dogs."],
        endText: "Thanks for your help popping those violet balloon dogs! It looks like we're still floating higher and higher though.",
        eventType: "KILL_MOB",
        npc: Types.Entities.KINGFROGGY,
        target: Types.Entities.BALLOONDOGV,
        amount: 100,
        requiredQuest: "KINGFROGGY_QUEST_4",
        level: 10,
        medal: Types.Medals.SKULL
    },
    {
        id: "KINGFROGGY_QUEST_6",
        name: "The King's Pink Pop Request",
        startText: ["If we can't get these darn balloon animals under control the whole cloud kingdom is going to float away!",
        "The King has requested that you pop 100 pink balloon dogs."],
        endText: "Thanks for your help popping those pink balloon dogs! It looks like we're still floating higher and higher though. I bet that menacing looking hotdog has a lot of helium in it.",
        eventType: "KILL_MOB",
        npc: Types.Entities.KINGFROGGY,
        target: Types.Entities.BALLOONDOGP,
        amount: 100,
        requiredQuest: "KINGFROGGY_QUEST_5",
        level: 12,
        medal: Types.Medals.SKULL
    },
    {
        id: "KINGFROGGY_QUEST_7",
        name: "The King's Red Pop Request",
        startText: ["If we can't get these darn balloon animals under control the whole cloud kingdom is going to float away!",
        "The King has requested that you pop 5 red balloon hotdogs."],
        endText: "Thanks for your help popping those red balloon hotdogs! It looks like we're still floating higher and higher though. Hmmm, I thought for sure that would do it. We have one more chance...",
        eventType: "KILL_MOB",
        npc: Types.Entities.KINGFROGGY,
        target: Types.Entities.BALLOONHOTDOGR,
        amount: 5,
        requiredQuest: "KINGFROGGY_QUEST_6",
        level: 20,
        medal: Types.Medals.SKULL
    },
    {
        id: "KINGFROGGY_QUEST_8",
        name: "The King's Orange Pop Request",
        startText: ["If we can't get these darn balloon animals under control the whole cloud kingdom is going to float away!",
        "The King has requested that you pop 1 orange balloon giraffe."],
        endText: "Thanks for your help popping all of those balloon animals! You did it!! Thank you! It looks like we're going to stay in this stratosphere for now!",
        eventType: "KILL_MOB",
        npc: Types.Entities.KINGFROGGY,
        target: Types.Entities.BALLOONGIRAFFEO,
        amount: 1,
        requiredQuest: "KINGFROGGY_QUEST_7",
        level: 20,
        medal: Types.Medals.SKULL
    }
]

exports.quests = quests;