var MRManager = new Class({

  //nově používané proměnné s informacemi o stavu
  /*task: null,
  miningInProgress: false,
  pageLoading:false,

  IMs: [],

  rulesCount: 0,
  rulesOrder: null,
  currentPage: null,
  pagesCount: 0,*/

  // používané proměnné MRManager
  config: null,
  errorMessage: '',
  i18n: null,
  FL: null,
  tasks: {},
  //rulesPerPage: null,
  settings: null,
  UIPainter: null,
  UIListener: null,

  initialize: function (config, FL, settings, UIPainter, UIListener, i18n) {
    this.config = config;
    this.i18n = i18n;
    this.FL = FL;

    this.settings = settings;
    this.UIPainter = UIPainter;
    this.UIListener = UIListener;

    this.getTasksRequest();
  },
  // used

  cleanMarkedRulesIds: function(foundRulesCSSIDs, taskId){
    var result=[];
    if (!(foundRulesCSSIDs.length>0)){
      return result;
    }
    //var taskId = this.getTaskId();
    Array.each(foundRulesCSSIDs, function(id){
      var regExp = /^marked-rule-(.+)-(\d+)-checkbox$/;
      var idArr = id.split('-');
      if(regExp.test(id)){
        if(taskId != idArr[2]){
          return;
        }
        result.push(idArr[3]);
      }
    }.bind([taskId, result]));
    return result;
  },

  getUnmarkRequest: function (foundRules, URL) {
    new Request.JSON({
      url: URL,
      secure: true,

      onRequest: function () {
        Array.each(foundRules,function(foundRule){
          foundRule.setLoading(true);
          this.UIPainter.updateMarkedRule(foundRule);
        }.bind(this));
      }.bind(this),

      onSuccess: function (responseJSON, responseText) {
        this.handleSuccessMRUnmarkRequest(responseJSON,foundRules);
      }.bind(this),

      onError: function () {
        this.handleErrorMRUnmarkRequest(foundRules);
      }.bind(this),

      onCancel: function () {
        Array.each(foundRules,function(foundRule){
          foundRule.setLoading(false);
          this.UIPainter.updateMarkedRule(foundRule);
        }.bind(this));
      }.bind(this),

      onFailure: function () {
        this.handleErrorMRUnmarkRequest(foundRules);
      }.bind(this),

      onException: function () {
        this.handleErrorMRUnmarkRequest(foundRules);
      }.bind(this),

      onTimeout: function () {
        this.handleErrorMRUnmarkRequest(foundRules);
      }.bind(this)
    }).get();
  },

  /*getRulesRequest: function(taskId,offset,limit,order){
    var url = this.config.getRuleClipboardGetRulesUrl(taskId,offset,limit,order);

    //region načtení pravidel úlohy ze serveru
    new Request.JSON({
      url: url,
      secure: true,
      onSuccess: function (responseJSON, responseText) {
        this.handleSuccessMRRulesRequest(taskId, responseJSON);
      }.bind(this),

      onError: function () {
        this.handleErrorMRRulesRequest();
      }.bind(this),

      onFailure: function () {
        this.handleErrorMRRulesRequest();
      }.bind(this),

      onException: function () {
        this.handleErrorMRRulesRequest();
      }.bind(this),

      onTimeout: function () {
        this.handleErrorMRRulesRequest();
      }.bind(this)

    }).get();
    //endregion
  },*/

  getTasksRequest: function(){
    //this.UIPainter.renderFoundRules();
    var url = this.config.getRuleClipboardGetTasksUrl();

    //region načtení úloh ze serveru
    new Request.JSON({
      url: url,
      secure: true,
      onSuccess: function (responseJSON, responseText) {
        this.handleSuccessMRTasksRequest(responseJSON);
      }.bind(this),

      onError: function () {
        this.handleErrorMRTasksRequest();
      }.bind(this),

      onFailure: function () {
        this.handleErrorMRTasksRequest();
      }.bind(this),

      onException: function () {
        this.handleErrorMRTasksRequest();
      }.bind(this),

      onTimeout: function () {
        this.handleErrorMRTasksRequest();
      }.bind(this)

    }).get();
    //endregion
  },

  getMarkedRulesByIds: function(foundRulesIds, taskId){
    var result = [],
        rules = this.tasks[taskId].rules;
    if (rules.length > 0){
      Array.each(rules, function(rule){
        if (foundRulesIds.indexOf(rule.$id) > -1){
          result.push(rule);
        }
      }.bind([foundRulesIds, result]));
    }
    return result;
  },

  handleErrorMRUnmarkRequest: function (foundRules) {
    if (foundRules.length>0){
      Array.each(foundRules,function(foundRule){
        foundRule.setLoading(false);
        this.UIPainter.updateMarkedRule(foundRule);
      }.bind(this));
    }
  },

  /*handleErrorMRRulesRequest: function (){
    this.pageLoading=false;
    this.errorMessage=this.i18n.translate('Loading of tasks rules failed...');
    //this.UIPainter.renderFoundRules();
  },*/

  handleErrorMRTasksRequest: function (){
    this.pageLoading=false;
    this.errorMessage=this.i18n.translate('Loading of rule clipboard failed...');
    //this.UIPainter.renderFoundRules();
  },

  handleSuccessMRUnmarkRequest: function (jsonData, foundRules){
    if ((foundRules == undefined)||(foundRules.length == 0)){return;}

    //console.log(foundRules);
    /*Array.each(foundRules,function(foundRule){ we don't need to remove from array - it will be reloaded
      Object.erase(task, foundRule.$id);
    }.bind(this));*/
    this.tasks[foundRules[0].$task.id].reload();
  },

  /*handleSuccessMRRulesRequest: function (taskId, data) {
    //this.pageLoading=false;
    var task = this.tasks[taskId];
    task.setIMs(this.FL.getRulesIMs(data.task.IMs));
    task.emptyRules();*/

    /*if (data.task && data.task.name!=''){
      this.setTaskName(data.task.name);
    }*/

    /*Object.each(data.rules, function (MRdata, MRid) {
      task.addRule(new MarkedRule(MRid, MRdata, task));
    }.bind(this));
    this.UIPainter.renderMarkedRules(task);
  },*/

  handleSuccessMRTasksRequest: function (data) {
    //console.log(data);
    //console.log(Object.keys(data).length);

    Object.each(data, function (value, id) {
      this.tasks[id] = new MarkedTask(id, value.name, value.rule_clipboard_rules, this.i18n, this.FL, this.UIPainter, this.config);
      this.UIPainter.renderMarkedTask(this.tasks[id]);
      //this.getRulesRequest(id);
    }.bind(this));
  },

  multiUnmarkFoundRules:function(foundRulesIds, taskId){
    var selectedFoundRules = this.getMarkedRulesByIds(this.cleanMarkedRulesIds(foundRulesIds, taskId), taskId);
    if (selectedFoundRules.length == 0){return;}
    var urlIds = [],
        taskId = selectedFoundRules[0].$task.id;
    Array.each(selectedFoundRules, function(foundRule){
      urlIds.push(foundRule.$id);
      foundRule.setLoading(true);
    }.bind(this));
    urlIds = urlIds.join(',');
    this.getUnmarkRequest(selectedFoundRules,this.config.getRuleClipboardRemoveRuleUrl(taskId,urlIds));
  },

  setTaskName: function(taskId, newTaskName){
    var task = this.tasks[taskId];
    if(task != undefined){
      task.setName(newTaskName);
      this.UIPainter.renderMarkedTask(task);
      this.UIPainter.renderMarkedRules(task);
    }
  },

  unmarkMarkedRule: function (foundRule) {
    this.getUnmarkRequest([foundRule],this.config.getRuleClipboardRemoveRuleUrl(foundRule.getTaskId(),foundRule.$id));
  }/*,


  // not used yet

  getPerPageOptions: function(){
    return this.config.getPerPageOptions();
  },

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

  gotoPage: function(page){
    this.pageLoading=true;
    this.UIPainter.renderFoundRules();
    var url = this.config.getGetRulesUrl(this.task.getId(), (page - 1) * this.rulesPerPage, this.rulesPerPage, this.rulesOrder);

    //region načtení pravidel ze serveru...
    new Request.JSON({
      url: url,
      secure: true,
      onSuccess: function (responseJSON, responseText) {
        this.currentPage=page;
        this.handleSuccessMarkedRulesRequest(responseJSON);
      }.bind(this),

      onError: function () {
        this.handleErrorMarkedRulesRequest(page);
      }.bind(this),

      onFailure: function () {
        this.handleErrorMarkedRulesRequest(page);
      }.bind(this),

      onException: function () {
        this.handleErrorMarkedRulesRequest(page);
      }.bind(this),

      onTimeout: function () {
        this.handleErrorMarkedRulesRequest(page);
      }.bind(this)

    }).get();
    //endregion
  },

  setRulesCount: function(rulesCount){
    this.rulesCount = rulesCount;
    this.calculatePagesCount();
    if (this.rulesCount > 0) {
      this.gotoPage(1);
    }
  },

  renderRules: function (rulesCount, taskName, inProgress, task) {
    this.task = task;
    this.miningInProgress = inProgress;
    if (taskName!=''){
      this.setTaskName(taskName);
    }
    this.setRulesCount(rulesCount);
    this.UIPainter.renderActiveRule();
    this.UIPainter.renderFoundRules();
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
  },

  handleRenameTaskFinished: function(taskId){
    if (this.getTaskId()==taskId){
      //pokud jde o přejmenování aktuální úlohy, musíme ji překreslit (znovu načteme aktuální stránku s pravidly)
      this.gotoPage(this.currentPage);
    }
  },


  getPaginatorType: function(){
    return this.config.getPaginatorType();
  },

  setRulesPerPage: function(count){
    this.rulesPerPage=count;
    this.calculatePagesCount();
    this.gotoPage(1);
  },

  calculatePagesCount: function(){
    this.pagesCount=Math.ceil(this.rulesCount/this.rulesPerPage);
  },

  getTaskName: function(){
    return this.task.getName();
  },

  getTaskId: function(){
    return this.task.getId();
  }*/

});