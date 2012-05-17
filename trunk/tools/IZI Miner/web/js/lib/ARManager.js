var ARManager = new Class({
	
	DD: null,
	FL: null,
	stringHelper: null,
	miningManager: null,
	ETreeManager: null,
	settings: null,
	UIPainter: null,
	UITemplateRegistrator: null,
	
	activeRule: null,
	ETreeValidator: null,
	maxCedentID: 0,
	maxFieldID: 0,
	attributesByGroup: false,
	
	initialize: function (ARBuilder, DD, FL, miningManager, ETreeManager, settings) {
		this.DD = DD;
		this.FL = FL;
		this.stringHelper = new StringHelper();
		this.miningManager = miningManager;
		this.ETreeManager = ETreeManager;
		this.settings = settings;
		
		this.ETreeValidator = new ETreeValidator();
		
		this.initARValidator();
		this.initBlankAR();
		
		ARBuilder.addEvent('updateFL', function (FL) {
			this.FL = FL;
		}.bind(this));
	},
	
	setUIPainter: function (UIPainter) {
		this.UIPainter = UIPainter;
	},
	
	initBlankAR: function () {
		this.maxCedentID = 0;
		this.maxFieldID = 0;
		
		var AR = new AssociationRule(this.initARValidator());

		// antecedent
		var antecedent = this.initCedent('antecedent', 1);
		AR.addAntecedent(antecedent);
		
		// succedent
		var succedent = this.initCedent('consequent', 1);
		AR.addSuccedent(succedent);
		
		this.activeRule = AR;
	},
	
	initARValidator: function () {
		return new AssociationRuleValidator(this.FL.getRulePattern(), this.FL.getIMCombinations());
	},
	
	initCedent: function (scope, level) {
		return new Cedent(this.generateCedentID(), level, this.FL.getDBAConstraint(scope, level), this.FL.getDefaultConnective(), [], [], scope);
	},
	
	hasPossibleIMs: function () {
		return Object.getLength(this.getPossibleIMs()) > 0;
	},

	getPossibleIMs: function () {
		return this.FL.getPossibleIMs(this.activeRule.getIMs());
	},
	
	getActiveRule: function () {
		return this.activeRule;
	},
	
	openAddIMWindow: function () {
		var possibleIMs = this.getPossibleIMs();
		this.UIPainter.renderAddIMWindow(possibleIMs);
	},
	
	closeAddIMWindow: function () {
		this.UIPainter.hideOverlay();
	},
	
	addAntecedent: function (antecedent) {
		this.activeRule.addAntecedent(antecedent);
	},
	
	addIM: function (name, thresholdValue, alphaValue) {
		var IMPrototype = this.getIMPrototype(name);
		var IM = new InterestMeasureAR(name, IMPrototype.getDefaultValue(), IMPrototype.getLocalizedName(), IMPrototype.getExplanation(), IMPrototype.getThresholdType(), IMPrototype.getCompareType(), IMPrototype.getFields(), IMPrototype.getStringHelper(), thresholdValue, alphaValue);
		this.activeRule.addIM(IM);
		
		this.UIPainter.hideOverlay();
		this.UIPainter.renderActiveRule();
	},
	
	editIM: function (IM) {
		this.activeRule.editIM(IM, $(IM.getCSSValueID()).get('text'));
		this.setActiveRuleChanged();
		this.UIPainter.renderActiveRule();
	},
	
	removeIM: function (IM) {
		this.activeRule.removeIM(IM.getName());
		this.UIPainter.renderActiveRule();
	},
	
	setIMChanged: function () {
		this.setActiveRuleChanged();
		this.UIPainter.renderActiveRule();
	},
	
	addAttribute: function (cedent, attribute) {
		var field = new FieldAR(this.generateFieldID(), attribute, null, new StringHelper());
		cedent.addLiteralRef(field);

		this.UIPainter.renderActiveRule();
		this.openAddCoefficientWindow(field);
	},
	
	openAddCoefficientWindow: function(field) {
		this.UIPainter.renderAddCoefficientWindow(field);
	},
	
	addCoefficient: function() {
		var field = arguments[0];
		if (arguments.length === 3) { // One category
			field.setCoefficient(arguments[1], arguments[2]);
		} else {
			field.setCoefficient(arguments[1], arguments[2], arguments[3]);
		}

		if (!this.attributesByGroup) {
			this.sortAttributes();
		}
		this.setActiveRuleChanged();
		this.UIPainter.renderActiveRule();
		this.closeAddCoefficientWindow();
	},
	
	editCoefficient: function() {
		var field = arguments[0];
		if (arguments.length === 3) { // One category
			field.setCoefficient(arguments[1], arguments[2]);
		} else {
			field.setCoefficient(arguments[1], arguments[2], arguments[3]);
		}
		
		this.setActiveRuleChanged();
		this.UIPainter.renderActiveRule();
		this.closeEditCoefficientWindow();
	},
	
	updateAddCoefficientAutocomplete: function (field, name) {
		var coefficient = this.FL.getBBACoefficient(name);
		this.UIPainter.renderAddCoefficientAutocomplete(field, coefficient);
	},
	
	closeAddCoefficientWindow: function () {
		this.UIPainter.hideOverlay();
	},
	
	openEditCoefficientWindow: function(field) {
		this.UIPainter.renderEditCoefficientWindow(field);
	},
	
	updateEditCoefficientAutocomplete: function (field, name) {
		var coefficient = this.FL.getBBACoefficient(name);
		this.UIPainter.renderEditCoefficientAutocomplete(field, coefficient);
	},
	
	closeEditCoefficientWindow: function () {
		this.UIPainter.hideOverlay();
	},
	
	openEditConnectiveWindow: function (cedent) {
		this.UIPainter.renderEditConnectiveWindow(cedent);
	},
	
	editConnective: function(cedent, connectiveName) {
		cedent.setConnective(connectiveName);
		
		this.UIPainter.renderCedent(cedent, null);
		this.setActiveRuleChanged();
		this.closeEditConnectiveWindow();
	},
	
	closeEditConnectiveWindow: function () {
		this.UIPainter.hideOverlay();
	},
	
	addField: function (field, cedent) {
		if (field.getType() === 'One category') {
			var fieldAR = new FieldAR(this.generateFieldID(), field.getRef(), field.getType(), new StringHelper(), field.getCategory());
		} else {
			var fieldAR = new FieldAR(this.generateFieldID(), field.getRef(), field.getType(), new StringHelper(), field.getMinimalLength(), field.getMaximalLength());
		}
		this.activeRule.addField(fieldAR, cedent);
		this.UIPainter.renderActiveRule();
	},
	
	addFieldAR: function (field, cedent) {
		this.activeRule.removeField(field);
		this.activeRule.addField(field, cedent);
		this.UIPainter.renderActiveRule();
	},
	
	removeField: function (field) {
		this.activeRule.removeField(field);
		
		if (!this.attributesByGroup) {
			this.sortAttributes();
		}
		this.setActiveRuleChanged();
		this.UIPainter.renderActiveRule();
	},
	
	changeFieldSign: function(field) {
		this.activeRule.changeFieldSign(field);
		this.UIPainter.renderActiveRule();
	},

	addFieldGroup: function (FG, cedent) {
		cedent.setConnective(FG.getConnective());
		Object.each(FG.getFields(), function (field) {
			if (field.getType() === 'One category') {
				var fieldAR = new FieldAR(this.generateFieldID(), field.getRef(), field.getType(), new StringHelper(), field.getCategory());
			} else {
				var fieldAR = new FieldAR(this.generateFieldID(), field.getRef(), field.getType(), new StringHelper(), field.getMinimalLength(), field.getMaximalLength());
			}
			this.activeRule.addField(fieldAR, cedent);
		}.bind(this));
		
		this.UIPainter.renderActiveRule();
		this.setActiveRuleChanged();
	},
	
	groupFields: function (cedent) {
		if (cedent.getNumLiteralRefs() !== cedent.getNumMarkedFields()) {
			var newCedent = new Cedent(this.generateCedentID(), cedent.getNextLevel(), this.FL.getDBAConstraint(cedent.getScope(), cedent.getNextLevel()), this.FL.getDefaultConnective(), [], [], cedent.getScope());
			cedent.groupLiteralRefs(newCedent);
		} else {
			cedent.unmarkLiteralRefs();
		}
		this.UIPainter.renderActiveRule();
		this.setActiveRuleChanged();
	},
	
	rejectGroupFields: function (cedent) {
		this.activeRule.setGroupFields(false);
		this.UIPainter.clearCedentInfo(cedent);
	},
	
	changeMark: function(field) {
		field.changeMark();
		this.activeRule.setGroupFields(true);
		this.UIPainter.renderActiveRule();
	},
	
	addCedent: function (cedent) {
		var childCedent = new Cedent(this.generateCedentID(), cedent.getNextLevel(), this.FL.getDBAConstraint(cedent.getScope(), cedent.getNextLevel()), this.FL.getDefaultConnective(), [], [], cedent.getScope());
		cedent.addChildCedent(childCedent);
		this.UIPainter.renderCedent(cedent, null);
		this.setActiveRuleChanged();
	},
	
	removeCedent: function (cedent) {
		if (cedent.getLevel() === 1) {
			var blankCedent = this.initCedent(cedent.getScope(), cedent.getLevel());
			this.activeRule.setCedent(cedent, blankCedent);
		} else {
			this.activeRule.removeCedent(cedent);
			this.setActiveRuleChanged();
		}
		
		this.UIPainter.renderActiveRule();
	},
	
	changeCedentSign: function(cedent) {
		cedent.changeSign();
		this.setActiveRuleChanged();
		this.UIPainter.renderCedent(cedent, null);
	},

	setActiveRuleChanged: function () {
		this.activeRule.setChanged(true);
	},
	
	getIMPrototype: function (name) {
		return this.FL.getIM(name);
	},
	
	displayAttributesByGroup: function () {
		this.attributesByGroup = true;
		this.UIPainter.renderAttributes();
	},
	
	displayAttributesByList: function () {
		this.attributesByGroup = false;
		this.UIPainter.renderAttributes();
		this.sortAttributes();
	},
	
	generateCedentID: function () {
		return ++this.maxCedentID;
	},
	
	generateFieldID: function () {
		return ++this.maxFieldID;
	},
	
	getAttributesByGroup: function () {
		return this.attributesByGroup;
	},
	
	/* attribute sort */
	sortAttributes: function () {
		var attributeSorter = new AttributeSorter(this.DD, this.activeRule);
		var positions = attributeSorter.sort(this.DD.getAttributes());
		this.DD.sortAttributes(positions);
		
		// repaint attributes
		this.UIPainter.sortAttributes(positions);
	},
	
	/* mining */
	display4ftTaskBox: function () {
		return (this.activeRule.isValid() && (true || this.activeRule.isChanged()) && !this.miningManager.getInProgress());
	},
	
	displayETreeTaskBox: function () {
		return this.settings.getRecEnabled() && ((true || this.activeRule.isChanged()) && !this.ETreeManager.getInProgress() && this.ETreeValidator.isValid(this.activeRule));
	},
	
	mineRulesConfirm: function () {
		this.miningManager.mineRules(this.activeRule, this.settings.getRulesCnt());
	},

	recommendAttributesConfirm: function () {
		this.ETreeManager.recommendAttributes(this.activeRule);
		this.UIPainter.renderActiveRule();
	}

});