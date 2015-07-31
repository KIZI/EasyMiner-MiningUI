var ARBuilder = new Class({
  GetterSetter: ['DD', 'FGC', 'ETreeManager', 'config', 'ARManager', 'FRManager', 'MRManager', 'miningManager', 'reportManager'],
  Implements: Events,

  $config: null,
  settings: null,
  dataParser: null,
  $rulesParser: null,
  $minerType:'',
  $minerName:'',
  $FRManager: null,
  $MRManager: null,
  $miningManager: null,
  $ETreeManager: null,
  $ARManager: null,
  $UIStructureListener: null,
  $UIStructurePainter: null,
  UIPainter: null,
  UIListener: null,
  $i18n: null,
  $DD: null,
  FLs: [],
  defFLIndex: 0,
  $FGC: null,
  $callbackDelay: 1000, // miliseconds
  $reportManager: null,
  $currentUser:null,
  //filter for attributes palette
  attributesFilter:null,

  // init basics
  initialize: function (config) {
    this.$config = config;
    this.settings = new Settings();
    this.$i18n = new i18n(this.$config.getLang());

    // Paint application structure
    this.$UIStructureListener = new UIStructureListener(this);
    this.$UIStructurePainter = new UIStructurePainter(this.$config, new DateHelper(), this.$i18n, this.$UIStructureListener, new UIStructureTemplater(), new UIScroller($(this.$config.getRootElementId())), new ElementSizeMeter(), new BrowserDetector(), this);
    this.$UIStructureListener.setUIStructurePainter(this.$UIStructurePainter);
    this.$UIStructurePainter.render();

    this.UIListener = new UIListener(this, new UIColorizer(), new DragDropHelper(new UIColorizer()), new ColorHelper());
    this.UIPainter = new UIPainter(this, this.$config, this.settings, this.$i18n, new UIColorizer(), this.UIListener, new DateHelper(), new UITemplateRegistrator(), new UIScroller($(this.$config.getRootElementId())), this.$UIStructurePainter);
    this.UIListener.setUIPainter(this.UIPainter);

    this.$reportManager = new ReportManager(this.$config, this.settings, this.UIPainter);

    this.$currentUser = new CurrentUser(this, this.UIPainter, this.$config, this.$i18n);

    if (this.$config.getMinerId()) {
      this.loadData();
    } else {
      this.openNewTaskWindow();
    }
  },

  loadData: function () {
    this.handleLoadData();
    this.dataParser = new DataParser(this.$config, this.settings, true);
    this.dataParser.getData(this.initApplication, this.handleLoadDataError, this, this.$config.getMinerId() != 'TEST' ? this.$callbackDelay : 0);
  },

  reloadData: function () {
    this.handleLoadData();
    this.dataParser = new DataParser(this.$config, this.settings, true);
    this.dataParser.getData(this.repaintData, this.handleLoadDataError, this, this.$config.getMinerId() != 'TEST' ? this.$callbackDelay : 0);
  },

  repaintData: function () {
    this.$DD = this.dataParser.getDD();
    this.$minerType=this.dataParser.getMinerType();
    this.$minerName=this.dataParser.getMinerName();

    this.FLs = this.dataParser.getFLs();
    this.$FGC = this.dataParser.getFGC();

    this.$rulesParser.setDD(this.$DD);
    this.$ETreeManager.setDD(this.$DD);
    this.$ARManager.setDD(this.$DD);

    this.reset();
    this.$UIStructurePainter.hideOverlay();
  },

  handleLoadData: function () {
    this.$UIStructurePainter.showLoadData();
  },

  handleLoadDataError: function () {
    this.$UIStructurePainter.showLoadDataError();
  },

  initApplication: function () {
    this.$UIStructurePainter.hideOverlay();

    this.$DD = this.dataParser.getDD();
    this.$minerType=this.dataParser.getMinerType();
    this.$minerName=this.dataParser.getMinerName();
    this.FLs = this.dataParser.getFLs();
    this.$FGC = this.dataParser.getFGC();

    this.$rulesParser = new RulesParser(this, this.$DD, this.getDefFL());
    this.$MRManager = new MRManager(this.$config, this.getDefFL(), this.settings, this.UIPainter, this.UIListener, this.$i18n);
    this.$MRManager.loadKnowledgeBase(this.dataParser.rulesetId); // init KB by id from data
    this.$FRManager = new FRManager(this.$config, this.getDefFL(), this.settings, this.UIPainter, this.UIListener, this.$MRManager, this.$i18n);
    this.$miningManager = new MiningManager(this.$config, this.settings, this.$FRManager, new DateHelper(), new TaskManager(this.$config, this.settings));
    this.$ETreeManager = new ETreeManager(this.$config, this.settings, this.$DD, this.UIPainter);
    this.$ARManager = new ARManager(this, this.$DD, this.getDefFL(), this.$miningManager, this.$ETreeManager, this.settings, this.UIPainter);
    this.$ETreeManager.setARManager(this.$ARManager);

    this.UIPainter.createUI();
    this.$UIStructurePainter.resizeApplication();

    this.$currentUser.loadUser();

    this.$reportManager.loadReports();
  },

  getDD: function () {
    return this.$DD;
  },

  getMinerType: function(){
    return this.$minerType;
  },

  getMinerName: function(){
    return this.$minerName;
  },

  getFL: function () {
    return this.getDefFL();
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

  openNewTaskWindow: function () {
    //redirect to new task...
    window.location.href=this.$config.getNewTaskURL();
  },

  // TODO hide settings when no data loaded - errorception.com bug http://errorception.com/projects/506ac563d3f654c85c000d91/errors/507aaa88340af6684b1a01a0
  openSettingsWindow: function () {
    this.$UIStructurePainter.renderSettingsWindow(
      this.FLs,
      this.getDefFL(),
      this.getDefFL().getAutoSuggest(),
      false,
      this.settings
    );
    //this.UIPainter.updateOverlayPosition(false);

    // HACK: Set the settings limit value, because it is not generated by Mooml
    $('rules-cnt').value = this.settings.getRulesCnt();
  },

  updateSettingsWindow: function (FLName) {
    var FL = this.getFLByName(FLName);
    var ARValidator = new AssociationRuleValidator(FL.getRulePattern(), FL.getIMCombinations());
    var reset = this.getDefFL().getName() !== FLName && !ARValidator.isValid(this.$ARManager.getActiveRule()) && this.$ARManager.getActiveRule().isChanged();
    this.$UIStructurePainter.renderSettingsWindow(this.FLs, FL, FL.getAutoSuggest(), reset, this.settings);
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
    if (el.hasClass('autosuggest-on')) {
      el.text = this.$i18n.translate('On');
    } else {
      el.text = this.$i18n.translate('Off');
    }
  },

  changeCaching: function (el) {
    el.toggleClass('cache-on');
    el.toggleClass('cache-off');
    if (el.hasClass('cache-on')) {
      el.text = this.$i18n.translate('On');
    } else {
      el.text = this.$i18n.translate('Off');
    }
  },

  changeDebug: function (el) {
    el.toggleClass('debug-on');
    el.toggleClass('debug-off');
    if (el.hasClass('debug-on')) {
      el.text = this.$i18n.translate('On');
    } else {
      el.text = this.$i18n.translate('Off');
    }
  },

  changeStrict: function (el) {
    el.toggleClass('strict-on');
    el.toggleClass('strict-off');
    if (el.hasClass('strict-on')) {
      el.text = this.$i18n.translate('On');
    } else {
      el.text = this.$i18n.translate('Off');
    }
  },

  closeSettingsWindow: function () {
    // Must be called before the settings window is destroyed
    //this.UIPainter.updateOverlayPosition(true);
    this.$UIStructurePainter.hideOverlay();
  },

  saveSettings: function (rulesCnt, FLName, autoSearch, autoSuggest, cache, debug, strict, taskMode) {
    // settings
    this.settings.setRulesCnt(rulesCnt);
    this.settings.setBKAutoSearch(autoSearch);
    this.settings.setRecEnabled(autoSuggest);
    this.settings.setCaching(cache);
    this.settings.setDebug(debug);
    this.settings.setStrictMatch(strict);
    this.settings.setTaskMode(taskMode);

    // FL switch
    var FL = this.getFLByName(FLName);
    var ARValidator = new AssociationRuleValidator(FL.getRulePattern(), FL.getIMCombinations());
    if (this.getDefFL().getName() !== FLName && !ARValidator.isValid(this.$ARManager.getActiveRule())) { // switch FL
      this.setDefFL(FLName);
      this.$ARManager.initBlankAR();
      this.UIPainter.sortAttributes();
    } else {
      this.setDefFL(FLName);
    }
    this.UIPainter.renderActiveRule();

    // Must be called before the settings window is destroyed
    //this.UIPainter.updateOverlayPosition(true);
    this.$UIStructurePainter.hideOverlay();
  },

  openChangeRulesetWindow: function () {
    this.UIPainter.renderChangeRulesetWindow();
  },

  openAddAttributeWindow: function (field) {
    this.UIPainter.renderAddAttributeWindow(field);
  },

    openClickAddAttributeWindow: function (field) {
        this.UIPainter.renderClickAddAttributeWindow(field);
    },

  openEditAttributeWindow: function (attribute) {
    this.UIPainter.renderEditAttributeWindow(attribute);
  },

  openShowHistogramWindow: function (name, type) {
    this.UIPainter.renderShowHistogramWindow(name, type);
  },

  openReportWindow: function (id, name) {
    this.UIPainter.renderReportWindow(id, name);
  },

  openCreateUserReportkWindow: function () {
    this.UIPainter.renderCreateUserReportWindow();
  },

  // TODO handle load data error
  reloadAttributes: function () {
    this.reloadData();
  },

  closeOverlay: function () {
    this.$UIStructurePainter.hideOverlay();
  },

  removeAttribute: function (attribute) {
    // remove attribute
    this.$DD.removeAttribute(attribute);
    this.$UIStructurePainter.showHiddenAttributesButton();
    this.UIPainter.removeAttribute(attribute);

    // reset UI
    this.reset();
  },

  reset: function () {
    // navigation
    this.UIPainter.renderNavigation();

    // active rule
    // TODO reset only if necessary
    //this.$ARManager.initBlankAR();

    this.stopMining();

    // found rules
    // TODO reset only if necessary
//        this.$FRManager.reset();

    // marked rules
    // TODO reset only if necessary
//        this.$FRManager.removeMarkedRules();

    // ETree
    this.$ETreeManager.reset();
  },

  stopMining: function () {
    this.$miningManager.stopMining();
  },

  showHiddenAttributes: function () {
    this.$DD.showHiddenAttributes();
    this.reloadData();
  },

  createReport: function (taskId) {//TODO Standa předělat
    this.$reportManager.createReport(
      taskId,
      this.$FRManager.getTask(taskId).getName()
    );
  },

  reloadReports: function () {
    this.$reportManager.loadReports();
  },

  openExportBusinessRulesDialog: function (taskId) {
    alert('openExportBusinessRulesDialog');
    //this.UIPainter.renderExportBusinessRulesDialog(taskId, this.$FRManager.getMarkedRules(taskId));
  },

  openBRBaseDialog: function () {
    this.UIPainter.renderBRBaseDialog();
  },

  exportRulesToBRBase: function (taskId) {//TODO Standa
    alert('exportRulesToBRBase');
    ///this.$reportManager.exportRulesToBRBase(taskId, this.$FRManager.getMarkedRules(taskId));
  },

  openModelTesterDialog: function (taskId) {
    alert('openModelTesterDialog');
    ///this.UIPainter.renderModelTesterDialog(taskId, this.$FRManager.getMarkedRules(taskId));
  }
});