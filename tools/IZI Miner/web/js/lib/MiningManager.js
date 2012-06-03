var MiningManager = new Class({
	
	config: null,
	FRManager: null,
	
	requests: [],
	inProgress: false,
	finishedStates: ['Solved', 'Interrupted'],
	reqDelay: 1000,
	
	initialize: function (config, FRManager) {
		this.config = config;
		this.FRManager = FRManager;
	},
	
	mineRules: function (rule, limitHits) {
		this.inProgress = true;
		this.FRManager.handleInProgress();
		
		var requestData = {
				limitHits: limitHits,
				rule0: rule.serialize(),
				rules: 1};
		this.makeRequest(JSON.encode(requestData));
	},
	
	makeRequest: function (data) {
		var request = new Request.JSON({
			url: this.config.getRulesGetURL(),
	        secure: true,
	            
	        onSuccess: function(responseJSON, responseText) {
	        	this.handleSuccessRequest(data, responseJSON);
	        }.bind(this),
	            
	        onError: function () {
	        	this.handleErrorRequest();
	        }.bind(this),
	        
	        onCancel: function () {
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
		var state = responseJSON.taskState;
		if (this.finishedStates.contains(state)) { // task is finished
			this.inProgress = false;
		} else { // task is still running
			this.makeRequest.delay(this.reqDelay, this, data);
		}
		
		var rules = responseJSON.rules;
		var numRules = responseJSON.hasOwnProperty('rules') ? Object.getLength(responseJSON.rules) : 0;
		if (numRules) {
			this.FRManager.renderRules(rules, numRules, this.inProgress);
		}
	},
	
	handleErrorRequest: function () {
		this.inProgress = false;
		this.stopAllRequests();
		this.clearAllRequests();
		this.FRManager.handleError();
	},
	
	addRequest: function (request) {
		this.requests.push(request);
	},
	
	stopAllRequests: function () {
		Array.each(this.requests, function (req, key) {
			if (req.running) {
				req.cancel();
			}
		}.bind(this));
	},
	
	clearAllRequests: function () {
		this.requests = [];
	},
	
	getInProgress: function () {
		return this.inProgress;
	}
	
});