var MiningManager = new Class({
	
	config: null,
    settings: null,
	FRManager: null,
    dateHelper: null,
	$taskManager: null,

	requests: [],
	inProgress: false,
	finishedStates: ['Solved', 'Interrupted'],
    errorStates: ['Failed'],
	reqDelay: 2500,
	
	initialize: function (config, settings, FRManager, dateHelper, taskManager) {
		this.config = config;
        this.settings = settings;
		this.FRManager = FRManager;
        this.dateHelper = dateHelper;
        this.$taskManager = taskManager;
	},
	
	mineRules: function (rule, limitHits) {
		this.inProgress = true;
		this.FRManager.handleInProgress();
        this.$taskManager.addTask(rule.serialize(), limitHits);
		this.makeRequest(JSON.encode(this.$taskManager.getActiveTask().getRequestData()));
	},
	
	makeRequest: function (data) {
		var request = new Request.JSON({
			url: this.config.getRulesGetURL(),
	        secure: true,
	            
	        onSuccess: function(responseJSON, responseText) {
                if (responseJSON.status === 'ok' && !this.errorStates.contains(responseJSON.taskState)) {
	        	    this.handleSuccessRequest(data, responseJSON);
                } else {
                    this.handleErrorRequest();
                }
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

        this.requests.push(request);
	},
	
	handleSuccessRequest: function (data, responseJSON) {
        if (!this.inProgress) { return; }

		var state = responseJSON.taskState;
		if (this.finishedStates.contains(state)) { // task is finished
			this.inProgress = false;
            this.FRManager.updateDownloadIcons(responseJSON.task, responseJSON.result);
		} else { // task is still running
			this.makeRequest.delay(this.reqDelay, this, data);
		}
		
		var rules = responseJSON.rules;
		var numRules = responseJSON.hasOwnProperty('rules') ? Object.getLength(responseJSON.rules) : 0;
		this.FRManager.renderRules(rules, numRules, this.inProgress, this.$taskManager.getActiveTask());
	},
	
	handleErrorRequest: function () {
        if (!this.inProgress) { return; }

		this.stopMining();
		this.FRManager.handleError();
//        throw 'Failed task: ID: ' + this.$taskManager.getActiveTask().getId() + ', source ID: ' + this.config.getIdDm();
	},
	
	stopMining: function () {
        // stop all requests
        Array.each(this.requests, function (req) {
            if (req.isRunning()) {
                req.cancel();
            }
        });

        // stop remote LM mining
        if (this.inProgress) { // hack around req.cancel(); weird bug
            this.inProgress = false;
            this.stopRemoteMining(this.$taskManager.getActiveTask().getId(), this.$taskManager.getActiveTask().getDebug(), this.config.getStopMiningUrl(), this.$taskManager.getActiveTask().getTaskMode(), this.config.getJoomlaURL());
        }

        this.requests = [];
        this.$taskManager.clearActiveTask();
        this.FRManager.handleStoppedMining();
	},
	
	getInProgress: function () {
		return this.inProgress;
	},

    stopRemoteMining: function(taskId, debug, url, taskMode, joomlaUrl) {
        var data = JSON.encode({
            taskId: taskId,
            debug: debug,
            joomlaUrl: joomlaUrl,
            taskMode: taskMode
        });

        new Request.JSON({
            url: url,
            secure: true
        }).post({'data': data});
    }
});