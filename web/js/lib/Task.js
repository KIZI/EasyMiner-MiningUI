var Task = new Class({
    GetterSetter: ['requestData', 'time'],

    $requestData: null,
    $time: null,

    initialize: function(serializedRule, limitHits, debug, joomlaUrl, strictMatch, taskMode, cache) {
        var taskName = "Task";
        var articleId;

        // Create the task name
        if (serializedRule !== undefined &&
            serializedRule.IMs !== undefined) {

            taskName += " ";
            serializedRule.IMs.each(function (e) {
                taskName += e.name + "(" + e.threshold + "), ";
            });
            taskName = taskName.substring(0, taskName.length - 2);
        }

        this.$requestData = {
            limitHits: limitHits,
            rule0: serializedRule,
            rules: 1,
            debug: debug,
            joomlaUrl: joomlaUrl,
            strict: strictMatch,
            taskMode: taskMode,
            taskName: taskName,
            articleId: articleId
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
    },

    getName: function() {
        return this.$requestData.taskName;
    },

    setName: function(value) {
        this.$requestData.taskName = value;
    },

    getChangeNameCssId: function() {
        return 'rename-task-' + this.$requestData.taskId;
    },

    /**
     * Gets the Sewebar Article ID.
     * @returns int Article ID.
     */
    getArticleId: function() {
        return this.$requestData.articleId;
    },

    /**
     * Sets the Sewebar Article ID.
     * @param int The Sewebar Article ID.
     */
    setArticleId: function(value) {
        this.$requestData.articleId = value;
    }
});