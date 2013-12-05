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

    createReport: function(taskId, rules, taskName) {
        var report = this.initReport(taskId, rules, taskName);
        this.saveReport(report);
    },

    initReport: function(taskId, rules, taskName) {
        var report = new Report(taskId, taskName);
        Array.each(rules, function(FR) {
            report.addRule(FR.getRule());
        }.bind(this));

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

        if (this.$reports[report.getTaskId()]) {
            requestData.article = this.$reports[report.getTaskId()];
        }

        this.makeRequest(requestData);
    },

    makeRequest: function (data) {
        window.open(this.$config.getJoomlaURL()+'index.php?option=com_dbconnect&controller=data&task=showInfo&message=GENERATING_TASK_DETAILS','pmmlWindow_'+data.lmtask);
        var request = new Request.JSON({
            url: this.$config.getReportSaveUrl(),
            secure: true,

            onSuccess: function(responseJSON, responseText) {
            
                if ((responseJSON.result==='ok')&&(responseJSON.article>0)){
                  this.$reports[this.taskId] = responseJSON.article;

                  if (!window.open(this.$config.getJoomlaURL() + 'index.php?option=com_dbconnect&controller=data&task=showArticle&article='+ responseJSON.article,'pmmlWindow_'+data.lmtask)){
                    //TODO handle error
                  }
                }else{
                  window.open(this.$config.getJoomlaURL()+'index.php?option=com_dbconnect&controller=data&task=showInfo&message=GENERATING_TASK_DETAILS_FAILED','pmmlWindow_'+data.lmtask);
                }
                
                
                // TODO: Handle failure
//                if (responseJSON.status === 'ok' && !this.errorStates.contains(responseJSON.taskState)) {
//                    this.handleSuccessRequest(data, responseJSON);
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

        }).post(data);
    },

    handleSuccessRequest: function (data, responseJSON) {
    },

    handleErrorRequest: function () {
    },

    loadReports: function() {
        var request = new Request.JSON({
            url: this.$config.getListReportsUrl(),
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