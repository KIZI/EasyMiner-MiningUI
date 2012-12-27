var MiningManager = new Class({
	
	config: null,
    settings: null,
	FRManager: null,
    dateHelper: null,
	
	requests: [],
	inProgress: false,
    taskId: '',
    requestData: {},
	finishedStates: ['Solved', 'Interrupted'],
    errorStates: ['Failed'],
	reqDelay: 2500,
	
	initialize: function (config, settings, FRManager, dateHelper) {
		this.config = config;
        this.settings = settings;
		this.FRManager = FRManager;
        this.dateHelper = dateHelper;
	},
	
	mineRules: function (rule, limitHits) {
		this.inProgress = true;
		this.FRManager.handleInProgress();
		
		this.requestData = {
				limitHits: limitHits,
				rule0: rule.serialize(),
				rules: 1,
                debug: this.settings.getDebug()
        };

        if (this.settings.getCaching()) { // caching enabled
            this.taskId = CryptoJS.MD5(JSON.encode(this.requestData)).toString(); // MD5 hash from task setting
        } else { // caching disabled
            this.taskId = CryptoJS.MD5(JSON.encode(this.dateHelper.getTime())).toString(); // MD5 hash from unix timestamp
        }
        this.requestData.modelName = this.taskId;

		this.makeRequest(JSON.encode(this.requestData));
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
	        
		this.addRequest(request);
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
		this.FRManager.renderRules(rules, numRules, this.inProgress);
	},
	
	handleErrorRequest: function () {
        if (!this.inProgress) { return; }

        var taskId = this.taskId;
		this.stopMining();
		this.FRManager.handleError();
        throw 'Failed task: ID: ' + taskId + ', source ID: ' + this.config.getIdDm();
	},
	
	addRequest: function (request) {
		this.requests.push(request);
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
            this.stopRemoteMining(this.taskId, this.settings.getDebug(), this.config.getStopMiningUrl());
            this.FRManager.handleStoppedMining();
        }

        this.requestData = {};
        this.requests = [];
        this.taskId = '';
	},
	
	getInProgress: function () {
		return this.inProgress;
	},

    stopRemoteMining: function(taskId, debug, url) {
        var data = JSON.encode({
            taskId: taskId,
            debug: debug
        });

        var request = new Request.JSON({
            url: url,
            secure: true
        }).post({'data': data});
    }
	
});