var ETreeManager = new Class({
	
	ARManager: null,
	config: null,
	DD: null,
	inProgress: false,
	requests: [],
	UIPainter: null,
	
	initialize: function (config, DD, UIPainter) {
		this.config = config;
		this.DD = DD;
        this.UIPainter = UIPainter;
	},
	
	setARManager: function (ARManager) {
		this.ARManager = ARManager;
	},
	
	recommendAttributes: function (rule) {
		this.setInProgress(true);
		this.UIPainter.renderAttributes();
		var attributes = this.getRemainingAttributes(rule.getLiterals());
		var requestData = {
				attributes: attributes,
				rule0: rule.serialize(),
				rules: 1};
		this.makeRequest(JSON.encode(requestData));
	},
	
	setInProgress: function (value) {
		this.inProgress = value;
		if (this.inProgress) {
			this.UIPainter.showETreeProgress();
		} else {
			this.UIPainter.hideETReeProgress();
		}
	},
	
	getRemainingAttributes: function (usedLiterals) {
		var attributes = [];
		Object.each(this.DD.getAttributes(), function(attribute) {
			attributes.include(attribute.getName());
		}.bind(this));
		
		Array.each(usedLiterals, function(usedLiteral) {
			if (attributes.contains(usedLiteral.getAttributeName())) {
				attributes.erase(usedLiteral.getAttributeName());
			}
		}.bind(this));
		
		return attributes;
	},
	
	makeRequest: function (data) {
		var request = new Request.JSON({
			url: this.config.getETreeGetURL(),
	        secure: true,
	            
	        onSuccess: function(responseJSON, responseText) {
	        	this.sortAttributes(data, responseJSON);
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
	
	sortAttributes: function (data, responseJSON) {
		this.setInProgress(false);
		if (responseJSON.length === 0) {
			this.UIPainter.renderActiveRule();
		} else {
			var attributeSorter = new AttributeSorter(this.DD, this.ARManager.getActiveRule());
			var positions = attributeSorter.sort(this.DD.getAttributes(), responseJSON);
			this.DD.sortAttributes(positions);
			
			// repaint attributes
			this.UIPainter.sortAttributes(positions);
		}
	},
	
	handleErrorRequest: function () {
		this.setInProgress(false);
		this.UIPainter.renderActiveRule();
	},
	
	addRequest: function (request) {
		this.requests.push(request);
	},
	
	getInProgress: function() {
		return this.inProgress;
	},

    reset: function () {
        Array.each(this.requests, function (req, key) {
            if (req.running) {
                req.cancel();
            }
        }.bind(this));
        this.clearAllRequests();

        if (this.inProgress) {
            this.inProgress = false;
            this.UIPainter.hideETReeProgress();
        }
    },

    clearAllRequests: function () {
        this.requests = [];
    }

});