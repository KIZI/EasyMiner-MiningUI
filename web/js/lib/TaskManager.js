/**
 * Class TaskManager
 * @license http://www.apache.org/licenses/LICENSE-2.0 Apache License, Version 2.0
 * @link http://github.com/kizi/easyminer-miningui
 *
 * @type Class
 */
var TaskManager = new Class({
    GetterSetter: ['activeTask'],

    $settings: null,
    $activeTask: null,
    $tasks: [],

    initialize: function (config, settings) {
        this.$config = config;
        this.$settings = settings;
    },

    addTask: function(serializedRule, limitHits) {
        this.$activeTask = new Task(serializedRule, limitHits, this.$settings.getDebug(), this.$settings.getStrictMatch(), this.$settings.getTaskMode(), this.$settings.getCaching());
        this.$tasks.push(this.$activeTask);

        return this.$activeTask;
    },

    clearActiveTask: function() {
        this.$activeTask = null;
    }
});