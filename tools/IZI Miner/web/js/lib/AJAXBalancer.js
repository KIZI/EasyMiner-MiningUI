var AJAXBalancer = new Class({
	
	inProgress: false,
	limit: 5,
	running: 0,
	requests: [],
	
	initialize: function () {},
	
	addRequest: function (options, data, ruleId) {
		options.onComplete = function () {
			this.running--;
			this.send();
		}.bind(this);
		
		var req = [new Request.JSON(options), data, ruleId];
		
		this.requests.push(req);
	},
	
	run: function () {
		if (this.requests.length) {
			this.inProgress = true;
			this.send();
		}
	},
	
	send: function() {
		Array.each(this.requests, function (req, key) {
			if (this.running < this.limit) {
				if (!req[0].isRunning() && !req[0].isSuccess()) {
					this.running++;
					req[0].post({'data': req[1]});
				}
			}
		}.bind(this));
	},
	
	handleReqSuccess: function () {
		
	},
	
	handleReqError: function () {
		
	},
	
	stopRequest: function (ruleId) {
		Array.each(this.requests, function (req) {
			if (req[2] === ruleId && req[0].running) {
				req[0].cancel();
			}
		}.bind(this));
	},
	
	stopAllRequests: function () {
		this.inProgress = false;
		Array.each(this.requests, function (req, key) {
			if (req[0].running) {
				req[0].cancel();
			}
		}.bind(this));
		
		this.requests = [];
		this.running = 0;
	}
	
});