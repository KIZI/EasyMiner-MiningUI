var MarkedTask = new Class({

  /*
  AJAXBalancer: null,

  //nově používané proměnné s informacemi o stavu
  miningInProgress: false,



  settings: null,
  task: null,
  UIListener: null,*/

  // používané proměnné MarkedTask
  config: null,
  currentPage: null,
  errorMessage: '',
  i18n: null,
  id: null,
  IMs: [],
  FL: null,
  MRManager: null,
  name: null,
  pagesCount: 0,
  pageLoading:false,
  rules: [],
  rulesCount: 0,
  rulesOrder: '',
  rulesPerPage: null,
  UIPainter: null,

  initialize: function (id, name, config, count, i18n, FL, UIPainter, MRManager) {
    this.config = config;
    this.i18n = i18n;
    this.id = id;
    this.FL = FL;
    this.MRManager = MRManager;
    this.name = name;
    var perPageOptions = this.getPerPageOptions();
    this.rulesPerPage = perPageOptions[0];
    this.UIPainter = UIPainter;

    this.gotoPage(1);
  },

  // used

  calculatePagesCount: function(){
    var newPagesCount = Math.ceil(this.rulesCount/this.rulesPerPage);
    if(this.pagesCount != newPagesCount){
      if(this.currentPage > newPagesCount){
        this.gotoPage(newPagesCount); // go to the last page if we were out of range
        this.currentPage = newPagesCount;
      }
      this.pagesCount = newPagesCount;
    }
    this.UIPainter.renderMarkedTask(this);
  },

  getPaginatorType: function(){
    return this.config.getPaginatorType();
  },

  getPerPageOptions: function(){
    return this.config.getPerPageOptions();
  },

  gotoPage: function(page){
    //this.pageLoading = true;
    //this.UIPainter.renderMarkedRules(this);
    var url = this.config.getRuleClipboardGetRulesUrl(this.id, (page - 1) * this.rulesPerPage, this.rulesPerPage, this.rulesOrder);

    //region načtení pravidel ze serveru...
    new Request.JSON({
      url: url,
      secure: true,
      onSuccess: function (responseJSON, responseText) {
        this.currentPage = page;
        this.handleSuccessRulesRequest(responseJSON);
      }.bind(this),

      onError: function () {
        this.handleErrorRulesRequest(page);
      }.bind(this),

      onFailure: function () {
        this.handleErrorRulesRequest(page);
      }.bind(this),

      onException: function () {
        this.handleErrorRulesRequest(page);
      }.bind(this),

      onTimeout: function () {
        this.handleErrorRulesRequest(page);
      }.bind(this)

    }).get();
    //endregion
  },

  handleErrorRulesRequest: function (page){
    this.pageLoading = false;
    this.errorMessage=this.i18n.translate('Loading of tasks rules failed...');
    //this.UIPainter.renderFoundRules();
  },

  handleSuccessRulesRequest: function (data) {
    this.pageLoading = false;
    //var task = this.tasks[taskId];
    this.rules = [];
    if(data.task.rulesCount == 0) {
      this.MRManager.removeTask(this);
    } else{
      this.IMs = this.FL.getRulesIMs(data.task.IMs);
      this.setRulesCount(data.task.rulesCount);

      Object.each(data.rules, function (MRdata, MRid) {
        this.rules.push(new MarkedRule(MRid, MRdata, this));
      }.bind(this));
      this.UIPainter.renderMarkedRules(this);
    }
  },

  reload: function(){
    this.gotoPage(this.currentPage);
  },

  setName: function(name){
    this.name = name;
  },

  setRulesCount: function(rulesCount){
    if(this.rulesCount != rulesCount){
      this.rulesCount = rulesCount;
      this.calculatePagesCount();
    }
  },

  setRulesPerPage: function(count){
    this.rulesPerPage = count;
    this.calculatePagesCount();
    this.gotoPage(1);
  }/*,


  // not used yet



  handleInProgress: function () {
    this.reset();
    this.miningInProgress = true;
    this.UIPainter.renderActiveRule();
    this.UIPainter.renderFoundRules();
  },

  handleStoppedMining: function () {
    this.miningInProgress = false;
    this.UIPainter.renderActiveRule();
    this.UIPainter.renderFoundRules();
  },

  handleSuccessRulesRequest: function (data) {
    //zjištění aktuálních měr zajímavosti
    this.pageLoading=false;
    this.IMs = this.FL.getRulesIMs(data.task.IMs);
    this.rules = [];
    if (data.task && data.task.name!=''){
      this.setTaskName(data.task.name);
    }

    Object.each(data.rules, function (value, key) {
      this.rules.push(new FoundRule(key, value, this.task));
    }.bind(this));

    this.UIPainter.renderFoundRules();
  },

  handleErrorRulesRequest: function (page){
    this.pageLoading=false;
    this.errorMessage=this.i18n.translate('Loading of rules failed...');
    this.UIPainter.renderFoundRules();
  },

  setRulesCount: function(rulesCount){
    this.rulesCount = rulesCount;
    this.calculatePagesCount();
    if (this.rulesCount > 0) {
      this.gotoPage(1);
    }
  },

  buildFoundRulesRequest: function (foundRules, URL) {
    var options = {
      url: URL,
      secure: true,

      onRequest: function () {
        Array.each(foundRules,function(foundRule){
          foundRule.setLoading(true);
          this.UIPainter.updateFoundRule(foundRule);
        }.bind(this));
      }.bind(this),

      onSuccess: function (responseJSON, responseText) {
        this.handleSuccessFoundRulesRequest(responseJSON,foundRules);
      }.bind(this),

      onError: function () {
        this.handleErrorFoundRulesRequest(foundRules);
      }.bind(this),

      onCancel: function () {
        Array.each(foundRules,function(foundRule){
          foundRule.setLoading(false);
          this.UIPainter.updateFoundRule(foundRule);
        }.bind(this));
      }.bind(this),

      onFailure: function () {
        this.handleErrorFoundRulesRequest(foundRules);
      }.bind(this),

      onException: function () {
        this.handleErrorFoundRulesRequest(foundRules);
      }.bind(this),

      onTimeout: function () {
        this.handleErrorFoundRulesRequest(foundRules);
      }.bind(this)
    };
    var reqData=null;
    if(foundRules.length==1){
      this.AJAXBalancer.addRequest(options, JSON.encode(reqData), foundRules[0].getId());
    }else{
      this.AJAXBalancer.addRequest(options, JSON.encode(reqData));
    }
  },

  handleErrorFoundRulesRequest: function (foundRules) {
    if (foundRules.length>0){
      Array.each(foundRules,function(foundRule){
        foundRule.setLoading(false);
        this.UIPainter.updateFoundRule(foundRule);
      }.bind(this));
    }
  },



  handleSuccessFoundRulesRequest: function (jsonData,foundRules){
    if ((foundRules == undefined)||(foundRules.length==0)){return;}

    Array.each(foundRules,function(foundRule){
      if (jsonData.rules[foundRule.$id]){
        foundRule.initialize(foundRule.$id,jsonData.rules[foundRule.$id],this.task);
      }
      foundRule.setLoading(false);
      this.UIPainter.updateFoundRule(foundRule);
    }.bind(this));

  },


  handleError: function () {
    this.miningInProgress = false;
    this.UIPainter.renderActiveRule();
    this.UIPainter.renderFoundRules();
  },

  reset: function () {
    this.AJAXBalancer.stopAllRequests();
    this.errorMessage='';
    this.setRulesCount(0);
    this.IMs = this.FL.getRulesIMs([]);
    this.miningInProgress = false;
  },*/

});