var cls = require("../../lib/class")

module.exports = Block = cls.Class.extend({
    init: function(options, worldserver) {
        this.worldserver = worldserver;
        this.trigger = options.trigger;
    },

    destroy: function() {
    },

    handle(event) {
        if(this.worldserver.checkTriggerActive(this.trigger)) {
            this.worldserver.deactivateTrigger(this.trigger);

            return 'then';
        }
        event.data.error = "Trigger is not active."

        return 'error';
    }
})