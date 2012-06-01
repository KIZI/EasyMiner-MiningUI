var FRManager = new Class({
	
	config: null,
	rulesParser: null,
	settings: null,
	i18n: null,
	AJAXBalancer: null,
	UIPainter: null,
	UIListener: null,
	rules: {},
	maxId: 0,
	markedRules: [],
	tips: null,
	
	initialize: function (config, rulesParser, settings) {
		this.config = config;
		this.rulesParser = rulesParser;
		this.settings = settings;
		this.i18n = new i18n(this.config.getLang());
		this.AJAXBalancer = new AJAXBalancer();
		this.tips = new Tips('.found-rule');
		this.tips.addEvent('show', function(tip, el){
		    tip.addClass('tip-visible');
		});
		this.tips.addEvent('hide', function(tip, el){
		    tip.removeClass('tip-visible');
		});
	},

	setUIPainter: function (UIPainter) {
		this.UIPainter = UIPainter;
	},
	
	setUIListener: function (UIListener) {
		this.UIListener = UIListener;
	},
	
	initPager: function () {
		this.pager = new Pager($('pager-label'), $('paging'), $('pager'), $('pager-clear'), i18n.translate('No discovered rules yet. Create an association rule pattern to start mining.'), i18n.translate('Mining is in progress, it may take a while to get the results.'), i18n.translate('Mining has finished!'), i18n.translate('No discovered rules. Try to change the association rule pattern and start mining again.'));
	},
	
	handleInProgress: function () {
		this.reset();
		this.UIPainter.renderActiveRule();
		this.pager.setInProgress();
		
	},
	
	renderRules: function (rules, numRules, inProgress) {
		// filter new rules
		rules = this.filterRules(rules, this.maxId);
		var parsedRules = this.rulesParser.parse(rules);
		
		if (!inProgress && !numRules && !Object.getLength(this.rules)) {
			this.pager.setNoRules();
			this.UIPainter.renderActiveRule();
		} else {
			var index = 0;
			var els = [];
			Array.each(parsedRules, function (r) {
				var FR = new FoundRule(r);
				this.rules[r.getId()] = FR;
				els.push(Mooml.render('foundRuleTemplate', {key: ++index, FR: FR, i18n: this.i18n, BK: this.settings.getBKAutoSearch()}));
				if (this.settings.getBKAutoSearch()) {
					this.buildRequest(FR, this.config.getBKAskURL(), true);
				}
			}.bind(this));
			
			// render 
			this.pager.add(els);
			
			// register handlers
			Object.each(this.rules, function (FR) {
				this.UIListener.registerFoundRuleEventHandlers(FR, this.settings.getBKAutoSearch());
			}.bind(this));
			
			if (!inProgress) {
				this.pager.setFinished();
			}
			
			if (this.settings.getBKAutoSearch()) {
				this.AJAXBalancer.run.delay(500, this.AJAXBalancer);
			}
			
			this.UIPainter.renderActiveRule();
		}
	},
	
	filterRules: function (rules, maxId) {
		rules = Object.cleanValues(rules, function(value) {
			if (!value.hasOwnProperty('value')) { return true; } // if one rule is returned, it does not have id
			return value.id > maxId;
		}.bind(this));
		
		return rules;
	},
	
	buildRequest: function (FR, URL, update) {
		var reqData = {
				limitHits: 1,
					rule0: FR.getRule().serialize(),
					rules: 1};
		
		var options = {
			url: URL,
	        secure: true,
	            
	        onRequest: function () {
	        	if (update) {
	        		this.UIPainter.showFRLoading(FR);
	        	}
			}.bind(this),
	        
	        onSuccess: function(responseJSON, responseText) {
	        	if (update) {
	        		this.handleSuccessRequest(FR, responseJSON);
	        	}
	        }.bind(this),
	            
	        onError: function () {
	        	this.handleErrorRequest(FR);
	        }.bind(this),
	        
	        onCancel: function () {
	        	this.handleErrorRequest(FR);
	        }.bind(this),
	        
	        onFailure: function () {
	        	this.handleErrorRequest(FR);
	        }.bind(this),
	        
	        onException: function () {
	        	this.handleErrorRequest(FR);
	        }.bind(this),
	        
	        onTimeout: function () {
	        	this.handleErrorRequest(FR);
	        }.bind(this)
		};
		
		this.AJAXBalancer.addRequest(options, JSON.encode(reqData), FR.getRule().getId());
	},
	
	handleSuccessRequest: function (FR, data) {
		if (data && (data.confirmation.hits > 0 || data.exception.hits > 0)) {
			FR.setIndexed(true);
			
			if (data.confirmation.hits > 0) {
				FR.setInteresting(data.confirmation.numInteresting >= data.confirmation.numNotInteresting);
			}
			
			if (data.exception.hits > 0) {
				FR.setException(true);
			}
			
			if (FR.getIndexed()) {
				this.tips.attach($(FR.getCSSID()));
			}
		}
		
		this.UIPainter.updateFoundRule(FR, this.FL);
	},
	
	handleErrorRequest: function (FR) {
		FR.setIndexed(false);
		this.UIPainter.updateFoundRule(FR, this.FL);
	},
	
	handleError: function () {
		this.pager.reset();
		this.UIPainter.renderActiveRule();
	},

	reset: function () {
		this.AJAXBalancer.stopAllRequests();
		this.rules = {};
		this.maxId = 0;
	},
	
	/* found rules */
	askBK: function (rule) {
		this.buildRequest(rule, this.config.getBKAskURL(), true);
		this.AJAXBalancer.run();
	},
	
	markFoundRule: function (FR) {
		this.AJAXBalancer.stopRequest(FR.getRule().getId());
		this.markedRules.push(FR);
		this.pager.remove(FR.getCSSID());
		this.UIPainter.renderMarkedRules(null, this.markedRules);
		
		// index interesting rule into KB
		this.buildRequest(FR, this.config.getBKSaveInterestingURL(), false);
		this.AJAXBalancer.run();
	},
	
	removeFoundRule: function (FR) {
		this.AJAXBalancer.stopRequest(FR.getRule().getId());
		this.pager.remove(FR.getCSSID());
		
		// index not interesting rule into KB
		this.buildRequest(FR, this.config.getBKSaveNotInterestingURL(), false);
		this.AJAXBalancer.run();
	},
	
	clearFoundRules: function () {
		this.AJAXBalancer.stopAllRequests();
		this.pager.reset();
		this.UIPainter.renderActiveRule();
	},
	
	/* marked rules */
	getMarkedRule: function(id) {
		var rule = null;
		Object.each(this.markedRules, function (markedRule) {
			if (id === markedRule.getId()) {
				rule = markedRule;
			}
		}.bind(this));
		
		return rule;
	},
	
	getMarkedRules: function () {
		return this.markedRules;
	},
	
	removeMarkedRule: function(rule) {
		Object.each(this.markedRules, function (MR, key) {
			if (rule.getId() === MR.getRule().getId()) {
				delete this.markedRules[key];
			}
		}.bind(this));

		this.UIPainter.renderMarkedRules(null);
	},

	sortMarkedRules: function (order) {
		var markedRules = [];
		Array.each(order, function (CSSID) {
			if (CSSID !== null) {
				var ruleId = this.stringHelper.getId(CSSID);
				var rule = this.getMarkedRule(ruleId);
				markedRules.push(rule);
			}
		}.bind(this));
		
		this.markedRules = markedRules;
		this.UIPainter.renderMarkedRules(null);
	}
	
});