var AJAXBalancer = new Class({
	
	inProgress: false,
	limit: 5,
	running: 0,
	requests: [],
	limitRuns: 2,
	
	initialize: function () {},
	
	addRequest: function (options, data, ruleId) {
		var date=new Date();
		var simpleUid=date.getTime()+(1000+Math.floor((Math.random() * 1000)));

		options.onComplete = function () {
			this.handleCompletedRequest(simpleUid);
		}.bind(this);

		var req = [new Request.JSON(options), data, ruleId, simpleUid, 0];
		this.requests.push(req);
	},

	handleCompletedRequest : function(simpleUid){
		Array.each(this.requests, function (req, key) {
			if (req[3]==simpleUid){
				if (!req[0].isRunning()){
					if (req[0].isSuccess() || req[3]>this.limitRuns){
						//pokud je požadavek dokončen, nebo byl překročen počet pokusů, odstraníme ho z pole
						this.requests.splice(key,1);
					}
				}
			}
		}.bind(this));

		this.running--;
		this.send();
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
					req[4]++;
					this.running++;
					req[0].post({'data': req[1]});
				}
			}
		}.bind(this));
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