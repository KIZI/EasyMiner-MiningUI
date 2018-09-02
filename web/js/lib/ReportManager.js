/**
 * Class ReportManager
 * @license http://www.apache.org/licenses/LICENSE-2.0 Apache License, Version 2.0
 * @link http://github.com/kizi/easyminer-miningui
 *
 * @type Class
 */
var ReportManager = new Class({

    $config: null,
    $settings: null,
    $UIPainter: null,
    $reports: null,

    initialize: function (config, settings, UIPainter) {
        this.$config = config;
        this.$settings = settings;
        this.$UIPainter = UIPainter;
        this.$reports = {};
    },

    /**
     * Function for loading task details from server
     * @param taskId
     */
    showTaskDetails: function(taskId){
        window.open(this.$config.getTaskDetailsUrl(taskId),'task-details-'+taskId);
    },

    /**
     * Function for loading ruleset in rule editor
     * @param rulesetId
     */
    openRulesEditor: function(rulesetId){
        alert(this.$UIPainter.i18n.translate('Rule editor will be opened in new window. After finishing the work in editor, don´t forget to reload this miner window.'));
        window.open(this.$config.getKnowledgeBaseRuleEditorUrl(rulesetId),'bre-'+rulesetId);
    },

    createReport: function(taskId, taskName) {
        var report = this.initReport(taskId, taskName);
        this.saveReport(report);
    },

    /**
     * Report "factory" method that creates the method object and initializes it.
     * @param taskId Task ID.
     * @param taskName Task Name
     * @returns {Report} Initialised report.
     */
    initReport: function(taskId, taskName) {
        var report = new Report(taskId, taskName);

        return report;
    },

    saveReport: function (report) {
        this.taskId = report.getTaskId();
        var requestData = {
            kbi: this.$config.params.id_dm,
            lmtask: report.getTaskId(),
            rules: report.getRulesIds().join(','),
            taskName: report.getTaskName()
        };

        // Load the article ID if present
        var task = this.$UIPainter.ARBuilder.$FRManager.getTask(report.getTaskId());
        var articleId = task.getArticleId();
        if (articleId !== undefined) {
            this.$reports[report.getTaskId()] = articleId;
        }

        if (this.$reports[report.getTaskId()]) {
            requestData.article = this.$reports[report.getTaskId()];
        }

        this.makeRequest(requestData);
    },

    handleSuccessRequest: function (data, responseJSON) {
    },

    handleErrorRequest: function () {
    },

    exportRulesToBRBase:function(taskId,rules){/*
        var rulesIds = [];
        rules.each(function(rule) {
            rulesIds.push(rule.getRule().getId());
        });

        var overlay = this.$UIPainter.$UIStructurePainter.showLoadingOverlay('Exporting rules to BR base...');
        //region export rules
        var request = new Request.JSON({//TODO Standa error window...
            url: this.$config.getBRBaseSaveRulesUrl(taskId,rulesIds),
            secure: true,

            onSuccess: function(responseJSON, responseText) {
                //this.$UIPainter.renderBRBaseRulesCount(responseJSON.rulesCount);
                this.reloadBRBase();
                this.$UIPainter.$UIStructurePainter.hideOverlay();
            }.bind(this),

            onError: function () {
                this.handleErrorRequest();
                this.$UIPainter.ARBuilder.reloadBRBase();
                this.$UIPainter.$UIStructurePainter.hideOverlay();
            }.bind(this),

            onFailure: function () {
                this.handleErrorRequest();
                this.reloadBRBase();
                this.$UIPainter.ARBuilder.$UIStructurePainter.hideOverlay();
            }.bind(this),

            onException: function () {
                this.handleErrorRequest();
                this.reloadBRBase();
                this.$UIPainter.ARBuilder.$UIStructurePainter.hideOverlay();
            }.bind(this),

            onTimeout: function () {
                this.$UIPainter.ARBuilder.reloadBRBase();
                this.$UIPainter.$UIStructurePainter.hideOverlay();
            }.bind(this)
        }).get();
        //endregion
*/
    },

    loadReports: function() {console.log('load reports');//XXX
        var request = new Request.JSON({
            url: this.$config.getListAnalyticalReportsUrl(),
            secure: true,

            onSuccess: function(responseJSON, responseText) {
                var reports = [];
                Object.each(responseJSON.articles, function(name, id) {
                    reports.push({ id: id, name: name });
                });

//                this.$UIPainter.renderReports([{ id: 1, name: 'Report 1' }, { id: 2, name: 'Report 2' }]);
                this.$UIPainter.renderReports(reports);
                // TODO: Odprasit
//                if (responseJSON.status === 'ok' && !this.errorStates.contains(responseJSON.taskState)) {
//                this.handleSuccessRequest(data, responseJSON);
//                } else {
//                    this.handleErrorRequest();
//                }
            }.bind(this),

            onError: function () {
                this.handleErrorRequest();
            }.bind(this),

            onFailure: function () {
                this.handleErrorRequest();
            }.bind(this),

            onException: function () {
                this.handleErrorRequest();
            }.bind(this),

            onTimeout: function () {
                this.handleErrorRequest();
            }.bind(this)

        }).get();
    }
});