var cls = require("../../lib/class")

module.exports = Block = cls.Class.extend({
    init: function(options) {
        this.tag = options.tag;
        this.value = options.value;
    },

    destroy: function() {
    },

    handle(event) {
        return "true";
    }
})