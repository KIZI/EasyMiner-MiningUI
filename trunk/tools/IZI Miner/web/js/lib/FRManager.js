var FRManager = new Class({
    GetterSetter: ['markedRules'],

	config: null,
	rulesParser: null,
	settings: null,
	i18n: null,
	AJAXBalancer: null,
	UIPainter: null,
	UIListener: null,
	rules: {},
	$markedRules: [],
	maxIndex: 0,
	tips: null,
	
	initialize: function (config, rulesParser, settings, UIPainter, UIListener, i18n) {
		this.config = config;
		this.rulesParser = rulesParser;
		this.settings = settings;
        this.UIPainter = UIPainter;
        this.UIListener = UIListener;
		this.i18n = i18n;
		this.AJAXBalancer = new AJAXBalancer();
		this.tips = new Tips('.found-rule');
		this.tips.addEvent('show', function(tip, el){
		    tip.addClass('tip-visible');
		});
		this.tips.addEvent('hide', function(tip, el){
		    tip.removeClass('tip-visible');
		});

        this.loadMarkedRules();
	},

	initPager: function () {
		this.pager = new Pager($('pager-label'), $('paging'), $('pager'), $('pager-clear'),
            this.i18n.translate('No discovered rules yet. Create an association rule pattern to start mining.'),
            this.i18n.translate('Mining is in progress, it may take a while to get the results.'),
            this.i18n.translate('Mining has finished!'),
            this.i18n.translate('No discovered rules. Try to change the association rule pattern and start mining again.'),
            this.i18n.translate('Mining has been stopped.'),
            this.i18n.translate('An error occured during mining. Try to start mining again or create new data mining task.'));
	},
	
	handleInProgress: function () {
		this.reset();
		this.UIPainter.renderActiveRule();
        this.UIPainter.showStopMiningButton();
        this.UIPainter.hideDownloadButtons();
		this.pager.setInProgress();
	},

    handleStoppedMining: function() {
        this.UIPainter.hideStopMiningButton();
        this.UIPainter.renderActiveRule();
        this.pager.setStopped();
    },
	
	renderRules: function (rules, numRules, inProgress, task) {
		// filter new rules
		rules = this.filterRules(rules);
		var parsedRules = this.rulesParser.parse(rules, task);
		
		if (!inProgress && !numRules) {
			this.pager.setNoRules();
            this.UIPainter.hideStopMiningButton();
			this.UIPainter.renderActiveRule();
		} else if (numRules) {
			if (numRules > Object.getLength(this.rules)) { // new rules to render
				var els = [];
				Array.each(parsedRules, function (r) {
					var FR = new FoundRule(r);
					this.rules[r.getId()] = FR;
					els.push(Mooml.render('foundRuleTemplate', {key: r.getId(), FR: FR, i18n: this.i18n, BK: this.settings.getBKAutoSearch()}));
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
	
				
				if (this.settings.getBKAutoSearch()) {
					this.AJAXBalancer.run.delay(500, this.AJAXBalancer);
				}
			}
			
			if (!inProgress) {
				this.pager.setFinished();
                this.UIPainter.hideStopMiningButton();
			}
			
			this.UIPainter.renderActiveRule();
		}
	},
	
	filterRules: function (rules) {
		var filtered = [];
		var i = 0;
		Array.each(rules, function (rule, key) {
			// TODO one rule
			//if (!value.hasOwnProperty('value')) { return true; } // if one rule is returned, it does not have id
			
			if (++i > this.maxIndex) {
				filtered.push(rule);
			}
		}.bind(this));
		
		return filtered;
	},
	
	buildRequest: function (FR, URL, update) {
		var reqData = {
			limitHits: 1,
			rule0: FR.getRule().serialize(),
			rules: 1,
            debug: this.settings.getDebug(),
            joomlaUrl: this.config.getJoomlaURL()
        };
		
		var options = {
			url: URL,
	        secure: true,
	            
	        onRequest: function () {
	        	if (update) {
	        		this.UIPainter.showFRLoading(FR);
	        	}
			}.bind(this),
	        
	        onSuccess: function(responseJSON, responseText) {
	        	if (update && responseJSON.status == 'ok') {
	        		this.handleSuccessRequest(FR, responseJSON);
	        	} else {
                    this.handleErrorRequest(FR);
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

    // TODO refactor into single class
	handleSuccessRequest: function (FR, data) {
		if (data.confirmation.hits > 0 || data.exception.hits > 0) {
			if (data.confirmation.hits > 0) {
				FR.setInteresting(false);
			} else if (data.exception.hits > 0) {
				FR.setException(true);
			}
		} else {
            FR.setInteresting(true);
        }

        // TODO refactor into UIPainter
		this.tips.attach($(FR.getCSSID()));

		this.UIPainter.updateFoundRule(FR);
	},
	
	handleErrorRequest: function (FR) {
		this.UIPainter.updateFoundRule(FR);
	},
	
	handleError: function () {
		this.pager.reset();
        this.pager.setError();
		this.UIPainter.renderActiveRule();
	},

	reset: function () {
		this.AJAXBalancer.stopAllRequests();
		this.rules = {};
        this.pager.reset();
		this.maxIndex = 0;
        this.UIPainter.renderActiveRule();
        this.UIPainter.hideDownloadButtons();
	},
	
	/* found rules */
	askBK: function (rule) {
		this.buildRequest(rule, this.config.getBKAskURL(), true);
		this.AJAXBalancer.run();
	},
	
	markFoundRule: function (FR) {
		this.AJAXBalancer.stopRequest(FR.getRule().getId());
		this.$markedRules.push(FR);
		this.pager.remove(FR.getCSSID());
		this.UIPainter.renderMarkedRules(null, this.$markedRules);
		
		// index interesting rule into KB
		this.buildRequest(FR, this.config.getBKSaveInterestingURL(), false);
		this.AJAXBalancer.run();

        this.saveMarkedRules();
    },
	
	removeFoundRule: function (FR) {
		this.AJAXBalancer.stopRequest(FR.getRule().getId());
		this.pager.remove(FR.getCSSID());
		
		// index not interesting rule into KB
		this.buildRequest(FR, this.config.getBKSaveNotInterestingURL(), false);
		this.AJAXBalancer.run();
	},
	
	/* marked rules */
	getMarkedRule: function(id) {
		var rule = null;
		Object.each(this.$markedRules, function (markedRule) {
			if (id === markedRule.getId()) {
				rule = markedRule;
			}
		}.bind(this));
		
		return rule;
	},

    getMarkedRules: function(taskId) {
        var rules = [];
        this.$markedRules.each(function(rule) {
            if (rule.getRule().getTask().getId() === taskId) {
                rules.push(rule);
            }
        });

        return rules;
    },

	removeMarkedRule: function(FR) {
		Object.each(this.$markedRules, function (MR, key) {
			if (FR.getRule().getId() === MR.getRule().getId()) {
				delete this.$markedRules[key];
			}
		}.bind(this));

		this.UIPainter.renderMarkedRules(null, this.$markedRules);

        this.saveMarkedRules();
    },

    updateDownloadIcons: function(settingPath, resultPath) {
        this.UIPainter.updateDownloadButtons(settingPath, resultPath);
    },

    saveMarkedRules: function() {
        var data = {
            kbi: this.config.getIdDm(),
            type: 'clipboard',
            data: JSON.stringify(this.$markedRules)
        };

        var request = new Request.JSON({
            url: this.$config.getSaveClipboardUrl(),
            secure: true,

            onSuccess: function() { debugger; },
            onError: function() { debugger; },
            onFailure: function() { debugger; },
            onException: function() { debugger; },
            onTimeout: function() { debugger; }
        }).post(data);
    },

    loadMarkedRules: function() {
        var data = {
            kbi: this.config.getIdDm(),
            type: 'clipboard',
            decode: true
        };

        var request = new Request.JSON({
            url: this.$config.getLoadClipboardUrl(),
            secure: true,

            onSuccess: this.onMarkedRulesLoadSuccess,
            onError: this.onMarkedRulesLoadFailure,
            onFailure: this.onMarkedRulesLoadFailure,
            onException: this.onMarkedRulesLoadFailure,
            onTimeout: this.onMarkedRulesLoadFailure
        }).post(data);
    },

    onMarkedRulesLoadSuccess: function (data, responseJSON) {
        debugger;
        var rules = JSON.parse(data.data);

        this.$markedRules = rules.hasOwnProperty('length') && rules.length > 0 ? rules : [];
        this.renderMarkedRules();
    },

    onMarkedRulesLoadFailure: function () {
        // TODO: Implement
        debugger;
    }
});