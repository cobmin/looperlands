var cls = require("../../lib/class")
const {PlayerEventBroker} = require("../../quests/playereventbroker");

module.exports = Event = cls.Class.extend({
    eventType: PlayerEventBroker.Events.KILL_MOB,
    init: function(options) {
        this.mob = options.mob;
    },

    destroy: function() {
    },

    handle(event) {
        return (event.data.mob.kind === this.mob);
    }
})