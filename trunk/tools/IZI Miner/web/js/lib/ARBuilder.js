var ARBuilder = new Class({
	Implements: Events,

	config: null,
	settings: null,
	dataParser: null,
	FRManager: null,
	miningManager: null,
	ETreeManager: null,
	ARManager: null,
	UIColorizer: null,
	UIPainter: null,
	UIListener: null,
	DD: null,
	FLs: [],
	defFLIndex: 0,
	FGC: null,
	
	// init basics
	initialize: function (config) {
		this.config = config;
		this.settings = new Settings();
		this.initDataParser();
		this.DD = this.dataParser.getDD();
        this.FLs = this.dataParser.getFLs();
        this.FGC = this.dataParser.getFGC();

        this.FRManager = new FRManager(this.config, new RulesParser(this, this.DD, this.getDefFL()), this.settings);
        this.miningManager = new MiningManager(this.config, this.FRManager);
        this.ETreeManager = new ETreeManager(this.config, this.DD);
        this.ARManager = new ARManager(this, this.DD, this.getDefFL(), this.miningManager, this.ETreeManager, this.settings);
        this.ETreeManager.setARManager(this.ARManager);
        this.UIColorizer = new UIColorizer();
        this.UIListener = new UIListener(this, this.ARManager, this.FRManager, this.UIColorizer);
        this.UIPainter = new UIPainter(this, this.config, this.DD, this.getDefFL(), this.FGC, this.ARManager, this.FRManager, this.miningManager, this.ETreeManager, this.UIColorizer, this.UIListener);
        this.UIListener.setUIPainter(this.UIPainter);
        this.ARManager.setUIPainter(this.UIPainter);
        this.ETreeManager.setUIPainter(this.UIPainter);
        this.FRManager.setUIPainter(this.UIPainter);
        this.FRManager.setUIListener(this.UIListener);
    },

    initDataParser: function() {
        this.dataParser = new DataParser(this.config);
        this.dataParser.getData();
    },

	// run ARB
	run: function () {
		this.UIPainter.createUI();
		this.FRManager.initPager();
	},

	getDefFL: function () {
		return this.FLs[this.defFLIndex];
	},
	
	setDefFL: function (FLName) {
		Array.each(this.FLs, function (FL, key) {
			if (FL.getName() === FLName) {
				this.defFLIndex = key;
			}
		}.bind(this));
	
		this.fireEvent('updateFL', this.getDefFL());
	},
	
	getFLByName: function (FLName) {
		var index = null;
		Array.each(this.FLs, function (FL, key) {
			if (FL.getName() === FLName) {
				index = key;
			}
		}.bind(this));
		
		return index !== null ? this.FLs[index] : null;
	},

    getConfig: function() {
        return this.config;
    },

    openNewTaskWindow: function () {
        this.UIPainter.renderNewTaskWindow();
    },

	openSettingsWindow: function () {
		this.UIPainter.renderSettingsWindow(this.FLs, this.getDefFL(), this.getDefFL().getAutoSuggest(), false, this.settings);
	},
	
	updateSettingsWindow: function (FLName) {
		var FL = this.getFLByName(FLName);
		var ARValidator = new AssociationRuleValidator(FL.getRulePattern(), FL.getIMCombinations());
		var reset = this.getDefFL().getName() !== FLName && !ARValidator.isValid(this.ARManager.getActiveRule()) && this.ARManager.getActiveRule().isChanged();
		this.UIPainter.renderSettingsWindow(this.FLs, FL, FL.getAutoSuggest(), reset, this.settings);
	},
	
	changeSettingsAutoFilter: function (el) {
		el.toggleClass('autofilter-on');
		el.toggleClass('autofilter-off');
		if (el.text === this.UIPainter.i18n.translate('On')) {
			el.text = this.UIPainter.i18n.translate('Off');
		} else {
			el.text = this.UIPainter.i18n.translate('On');
		}
	},
	
	changeSettingsAS: function (el) {
		el.toggleClass('autosuggest-on');
		el.toggleClass('autosuggest-off');
		if (el.text === this.UIPainter.i18n.translate('On')) {
			el.text = this.UIPainter.i18n.translate('Off');
		} else {
			el.text = this.UIPainter.i18n.translate('On');
		}
	},

	closeSettingsWindow: function () {
		this.UIPainter.hideOverlay();
	},
	
	saveSettings: function(rulesCnt, FLName, autoSearch, autoSuggest) {
		// settings
		this.settings.setRulesCnt(rulesCnt);
		this.settings.setBKAutoSearch(autoSearch);
		this.settings.setRecEnabled(autoSuggest);
		
		// FL switch
		var FL = this.getFLByName(FLName);
		var ARValidator = new AssociationRuleValidator(FL.getRulePattern(), FL.getIMCombinations());
		if (this.getDefFL().getName() !== FLName && !ARValidator.isValid(this.ARManager.getActiveRule())) { // switch FL
			this.setDefFL(FLName);
			this.ARManager.initBlankAR();
			this.UIPainter.sortAttributes();
		} else {
			this.setDefFL(FLName);
		}
		this.UIPainter.renderActiveRule();
		
		this.UIPainter.hideOverlay();
	},

    openAddAttributeWindow: function(field) {
        this.UIPainter.renderAddAttributeWindow(field);
    },

    openEditAttributeWindow: function (attribute) {
        this.UIPainter.renderEditAttributeWindow(attribute);
    },

    reloadAttributes: function() {
        this.initDataParser();
        // TODO show loading indicator
        this.UIPainter.renderNavigation();
        this.reset();
        this.UIPainter.hideOverlay();
    },

    removeAttribute: function(attribute) {
        // remove attribute
        this.DD.removeAttribute(attribute);
        this.UIPainter.removeAttribute(attribute);

        // reset UI
        this.reset();
    },

    reset: function() {
        // active rule
        this.ARManager.initBlankAR();

        // mining
        this.miningManager.stopAllRequests();
        // TODO call KBI to stop mining

        // found rules
        // TODO reset only if necessary
        this.FRManager.reset();

        // marked rules
        // TODO reset only if necessary
        this.FRManager.removeMarkedRules();

        // ETree
        this.ETreeManager.reset();
    }

});