var ARManager = new Class({

  $ARBuilder: null,
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

  initialize: function (ARBuilder, DD, FL, miningManager, ETreeManager, settings, UIPainter) {
    this.$ARBuilder = ARBuilder;
    this.DD = DD;
    this.FL = FL;
    this.stringHelper = new StringHelper();
    this.miningManager = miningManager;
    this.ETreeManager = ETreeManager;
    this.settings = settings;
    this.UIPainter = UIPainter;

    this.ETreeValidator = new ETreeValidator();

    this.initARValidator();
    this.initBlankAR();

    this.$ARBuilder.addEvent('updateFL', function (FL) {
      this.FL = FL;
    }.bind(this));
  },

  setDD: function (DD) {
    this.DD = DD;
  },

  initBlankAR: function () {
    this.maxCedentID = 0;
    this.maxFieldID = 0;

    this.activeRule = new AssociationRule(this.initARValidator());

    // antecedent
    var antecedent = this.initCedent('antecedent', 1);
    this.activeRule.addAntecedent(antecedent);

    // default interest measures
    this.FL.getDefaultIMs().each(function (IMPrototype) {
      var IM = IMPrototype.initIMAR(IMPrototype);
      if (IM.getName() === 'SUPP') {
        var minimalSupport = this.DD.calculateMinimalSupport();
        if (IM.getThreshold().toFloat() < minimalSupport) {
          IM.setThreshold(minimalSupport);
        }
      }
      this.activeRule.addIM(IM);
    }.bind(this));

    // succedent
    var succedent = this.initCedent('consequent', 1);
    this.activeRule.addSuccedent(succedent);
  },

  initARValidator: function () {
    return new AssociationRuleValidator(this.FL.getRulePattern(), this.FL.getIMCombinations());
  },

  initCedent: function (scope, level, parentCedent) {
    return new Cedent(this.generateCedentID(), level, this.FL.getDefaultConnective(level, this.activeRule.toSettings(), scope), [], scope);
  },

  hasPossibleIMs: function () {
    return Object.getLength(this.FL.getPossibleIMs(this.activeRule.getIMs())) > 0;
  },

  getActiveRule: function () {
    return this.activeRule;
  },

  openAddIMWindow: function () {
    var possibleIMs = this.FL.getPossibleIMs(this.activeRule.getIMs());
    this.UIPainter.renderAddIMWindow(possibleIMs);
  },

  openEditIMWindow: function (selectedIM) {
    var IMs = this.FL.getIMs();
    this.UIPainter.renderEditIMWindow(IMs, selectedIM);
  },

  /**
   * Opens the rename task window overlay.
   * @param taskId Task ID to rename.
   * @param taskName original name of the task
   */
  openRenameTaskWindow: function (taskId, taskName) {
    this.UIPainter.renderRenameTaskWindow(taskId, taskName);
  },

  addAntecedent: function (antecedent) {
    this.activeRule.addAntecedent(antecedent);
  },

  addIM: function (IMPrototype, thresholdValue, alphaValue) {
    var IM = new InterestMeasureAR(IMPrototype.getName(), IMPrototype.getLocalizedName(), IMPrototype.getExplanation(), IMPrototype.getThresholdType(), IMPrototype.getCompareType(), IMPrototype.getFields(), IMPrototype.getStringHelper(), IMPrototype.getDefault(), thresholdValue, alphaValue);
    this.activeRule.addIM(IM);
    this.setActiveRuleChanged();
    this.UIPainter.hideOverlay();
    this.UIPainter.renderActiveRule();
  },

  editIM: function (IMPrototype, thresholdValue, alphaValue) {
    this.activeRule.editIM(IMPrototype, thresholdValue, alphaValue);
    this.setActiveRuleChanged();
    this.UIPainter.hideOverlay();
    this.UIPainter.renderActiveRule();
  },

  removeIM: function (IM) {
    this.activeRule.removeIM(IM.getName());
    this.setActiveRuleChanged();
    this.UIPainter.renderActiveRule();
  },

  addAttribute: function (cedent, attribute) {
    var field = new FieldAR(
      this.generateFieldID(),
      attribute,
      null,
      null,
      new StringHelper()
    );
    cedent.addChild(field);

    this.UIPainter.renderActiveRule();
    this.openAddCoefficientWindow(field);
  },

  addAttributeToCedent: function (attribute) {
    var field = new FieldAR(this.generateFieldID(), attribute, 'Subset', null, new StringHelper(), 1, 1);
    this.activeRule.getAntecedent().addChild(field);
    if (!this.attributesByGroup) {
      this.sortAttributes();
    }
    this.UIPainter.renderActiveRule();
  },

  openAddCoefficientWindow: function (field) {
    this.UIPainter.renderAddCoefficientWindow(field);
  },

  addCoefficient: function () {
    var field = arguments[0];
    if (arguments.length === 4) { // One category
      field.setCoefficient(arguments[1], arguments[2], arguments[3]);
    } else {
      field.setCoefficient(arguments[1], arguments[2], arguments[3], arguments[4]);
    }

    if (!this.attributesByGroup) {
      this.sortAttributes();
    }
    this.setActiveRuleChanged();
    this.UIPainter.renderActiveRule();
    this.UIPainter.hideOverlay();
  },

  editCoefficient: function () {
    var field = arguments[0];
    if (arguments.length === 4) { // One category
      field.setCoefficient(arguments[1], arguments[2], arguments[3]);
    } else {
      field.setCoefficient(arguments[1], arguments[2], arguments[3], arguments[4]);
    }

    this.setActiveRuleChanged();
    this.UIPainter.renderActiveRule();
    this.UIPainter.hideOverlay();
  },

  updateAddCoefficientAutocomplete: function (field, name) {
    var coefficient = this.FL.getBBACoefficient(name);
    this.UIPainter.renderAddCoefficientAutocomplete(field, coefficient);
  },

  openEditCoefficientWindow: function (field) {
    this.UIPainter.renderEditCoefficientWindow(field);
  },

  updateEditCoefficientAutocomplete: function (field, name) {
    var coefficient = this.FL.getBBACoefficient(name);
    this.UIPainter.renderEditCoefficientAutocomplete(field, coefficient);
  },

  openEditConnectiveWindow: function (cedent) {
    this.UIPainter.renderEditConnectiveWindow(cedent);
  },

  editConnective: function (cedent, connectiveName) {
    var connective = new Connective(this.FL.generateConnectiveID(), connectiveName);
    cedent.setConnective(connective);

    this.setActiveRuleChanged();
    this.UIPainter.renderActiveRule();
    this.UIPainter.hideOverlay();
  },

  addField: function (field, cedent) {
    var fieldAR = {};
    if (field.getType() === 'One category') {
      fieldAR = new FieldAR(this.generateFieldID(), field.getRef(), field.getType(), field.getLocalizedName(), new StringHelper(), field.getCategory());
    } else {
      fieldAR = new FieldAR(this.generateFieldID(), field.getRef(), field.getType(), field.getLocalizedName(), new StringHelper(), field.getMinimalLength(), field.getMaximalLength());
    }
    this.activeRule.addField(fieldAR, cedent);
    this.UIPainter.renderActiveRule();
  },

  addFieldAR: function (field, cedent) {
    this.activeRule.removeField(field);
    this.activeRule.addField(field, cedent);
    this.activeRule.update();
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

  changeFieldSign: function (field) {
    this.activeRule.changeFieldSign(field);
    this.setActiveRuleChanged();
    this.UIPainter.renderActiveRule();
  },

  addFieldGroup: function (FG, cedent) {
    var connective = new Connective(this.FL.generateConnectiveID(), FG.getConnective());
    cedent.setConnective(connective);

    Object.each(FG.getFields(), function (field) {
      var fieldAR = {};
      if (field.getType() === 'One category') {
        fieldAR = new FieldAR(this.generateFieldID(), field.getRef(), field.getType(), field.getLocalizedName(), new StringHelper(), field.getCategory());
      } else {
        fieldAR = new FieldAR(this.generateFieldID(), field.getRef(), field.getType(), field.getLocalizedName(), new StringHelper(), field.getMinimalLength(), field.getMaximalLength());
      }
      this.activeRule.addField(fieldAR, cedent);
    }.bind(this));

    this.UIPainter.renderActiveRule();
    this.setActiveRuleChanged();
  },

  groupFields: function (cedent) {
    if (cedent.getNumFields(cedent.getLevel()) !== cedent.getNumMarkedFields()) {
      var level = cedent.getNextLevel();
      var newCedent = new Cedent(this.generateCedentID(), level, this.FL.getDefaultConnective(level, this.activeRule.toSettings(), cedent.getScope()), [], cedent.getScope());
      cedent.groupChildren(newCedent);
    } else {
      cedent.unmarkChildren();
    }
    this.UIPainter.renderActiveRule();
    this.setActiveRuleChanged();
  },

  changeMark: function (field) {
    field.changeMark();
    this.activeRule.setGroupFields(true);
    this.UIPainter.renderActiveRule();
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

  setActiveRuleChanged: function () {
    this.activeRule.setChanged(true);
    this.$ARBuilder.stopMining();
  },

  getIMPrototype: function (name) {
    return this.FL.getIM(name);
  },

    getFLConnectives: function (scope) {
        return this.FL.getAllowedConnectives(scope);
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

  miningInProgress: function () {
    return this.miningManager.getInProgress();
  },

  getMiningState: function () {
    return this.miningManager.getMiningState();
  },

  displayETreeTaskBox: function () {
    return this.settings.getRecEnabled() && ((true || this.activeRule.isChanged()) && !this.ETreeManager.getInProgress() && this.ETreeValidator.isValid(this.activeRule));
  },

  mineRulesConfirm: function () {
    this.activeRule.setChanged(false);//pravidlo není změněno (je právě spuštěno dolování)
    this.miningManager.mineRules(this.activeRule, this.settings.getRulesCnt());
  },

  recommendAttributesConfirm: function () {
    this.ETreeManager.recommendAttributes(this.activeRule);
    this.UIPainter.renderActiveRule();
  },

  /**
   * Renames the task.
   * @param taskId Task id to be renamed.
   * @param newTaskName A new task name.
   */
  renameTask: function (taskId, newTaskName) {
    // Rename the task
    this.$ARBuilder.$FRManager.renameTask(taskId, newTaskName);
  },

  /**
   * Displays an error
   * @param elementId
   * @param errorMessage
   */
  displayError: function (sourceElementId, messageElementId, message) {
    $(sourceElementId).set('class', 'invalid-value');
    $(messageElementId).set('text', message);
  }

});