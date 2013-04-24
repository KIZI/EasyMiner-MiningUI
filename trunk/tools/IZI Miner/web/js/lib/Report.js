var Report = new Class({
    GetterSetter: [ 'taskId' ],

    $taskId: undefined,
    $rules: [],

    initialize: function(taskId) {
        this.$taskId = taskId;
    },

    addRule: function(rule) {
        this.$rules.push(rule);
    },

    getRulesIds: function() {
        var ids = [];
        Array.each(this.$rules, function (rule) {
            ids.push(rule.getId());
        }.bind(this));

        return ids;
    }
});