var Task = new Class({
    GetterSetter: ['requestData', 'time'],

    $requestData: null,
    $time: null,

    initialize: function(serializedRule, limitHits, debug, joomlaUrl, strictMatch, taskMode, cache) {
        this.$requestData = {
            limitHits: limitHits,
            rule0: serializedRule,
            rules: 1,
            debug: debug,
            joomlaUrl: joomlaUrl,
            strict: strictMatch,
            taskMode: taskMode
        };

        if (cache) { // caching enabled
            this.$requestData.taskId = CryptoJS.MD5(JSON.encode(this.$requestData)).toString(); // MD5 hash from task setting
        } else { // caching disabled
            this.$requestData.taskId = CryptoJS.MD5(JSON.encode(new Date().getTime())).toString(); // MD5 hash from unix timestamp
        }

        this.$time = new Date();
    },

    parseFromObject: function(data) {
        this.$requestData = data.$requestData;
    },

    getId: function() {
        return this.$requestData.taskId;
    },

    getDebug: function() {
        return this.$requestData.debug;
    },

    getTaskMode: function() {
        return this.$requestData.taskMode;
    },

    getCssId: function() {
        return 'task-' + this.$requestData.taskId;
    }
});