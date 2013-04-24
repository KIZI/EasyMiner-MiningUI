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
        this.$activeTask = new Task(serializedRule, limitHits, this.$settings.getDebug(), this.$config.getJoomlaURL(), this.$settings.getStrictMatch(), this.$settings.getTaskMode(), this.$settings.getCaching());
        this.$tasks.push(this.$activeTask);

        return this.$activeTask;
    },

    clearActiveTask: function() {
        this.$activeTask = null;
    }
});