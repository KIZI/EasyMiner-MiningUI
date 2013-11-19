var Report = new Class({
    GetterSetter: [ 'taskId', 'taskName' ],

    $taskId: undefined,
    $rules: [],
    $taskName: undefined,

    initialize: function(taskId, taskName) {
        this.$taskId = taskId;
        this.$taskName = taskName;
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