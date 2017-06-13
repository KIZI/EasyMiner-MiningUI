/**
 * Class Report
 * @license http://www.apache.org/licenses/LICENSE-2.0 Apache License, Version 2.0
 * @link http://github.com/kizi/easyminer-miningui
 *
 * @type Class
 */
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