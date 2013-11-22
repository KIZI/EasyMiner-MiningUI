var ReportManager = new Class({

    $config: null,
    $settings: null,
    $UIPainter: null,

    initialize: function (config, settings, UIPainter) {
        this.$config = config;
        this.$settings = settings;
        this.$UIPainter = UIPainter;
    },

    createReport: function(taskId, rules) {
        var report = this.initReport(taskId, rules);
        this.saveReport(report);
    },

    initReport: function(taskId, rules) {
        var report = new Report(taskId);
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

        this.makeRequest(JSON.encode(requestData));
    },

    makeRequest: function (data) {
        var request = new Request.JSON({
            url: this.$config.getReportSaveUrl(),
            secure: true,

            onSuccess: function(responseJSON, responseText) {
                window.open(this.$config.getJoomlaURL() + 'index.php?option=com_dbconnect&controller=data&task=showArticle&article='+ responseJSON.reportId, '_blank');
                window.focus();

                // TODO: Odprasit
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

        }).post({'data': data});
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