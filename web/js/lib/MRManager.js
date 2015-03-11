var MRManager = new Class({

  // používané proměnné MRManager
  config: null,
  errorMessage: '',
  i18n: null,
  FL: null,
  FRManager: null,
  settings: null,
  tasks: {},
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

  cleanMarkedRulesIds: function(foundRulesCSSIDs, taskId){
    var result=[];
    if (!(foundRulesCSSIDs.length>0)){
      return result;
    }
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
        this.handleSuccessMRUnmarkRequest(responseJSON, foundRules);
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

  getTasksRequest: function(){
    var url = this.config.getRuleClipboardGetTasksUrl();

    //region načtení úloh ze serveru
    new Request.JSON({
      url: url,
      secure: true,
      onSuccess: function (responseJSON, responseText) {
        this.handleSuccessMRTasksRequest(responseJSON, true);
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

  getRuleSetsRequest: function(){
    var url = this.config.getKnowledgeBaseGetRuleSetsUrl();

    //region načtení úloh ze serveru
    new Request.JSON({
      url: url,
      secure: true,
      onSuccess: function (responseJSON, responseText) {
        console.log(responseJSON);
        //this.handleSuccessMRTasksRequest(responseJSON, true);
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
    if (rules){
      Object.each(rules, function(value, ruleId){
        if (foundRulesIds.indexOf(ruleId) > -1){
          result.push(value);
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

  handleErrorMRTasksRequest: function (){
    this.pageLoading=false;
    this.errorMessage=this.i18n.translate('Loading of rule clipboard failed...');
  },

  handleSuccessMRUnmarkRequest: function (jsonData, foundRules){
    if ((foundRules == undefined)||(foundRules.length == 0)){return;}
    var taskId = foundRules[0].$task.id,
        task = this.tasks[taskId];
    if(task.pagesCount > 1){
      task.reload();
    } else{
      Object.each(jsonData.rules, function(value, id){
        if(value.selected == 0){
          Object.erase(task.rules, id);
        }
      }.bind(this));
      task.rulesCount = (task.rulesCount - foundRules.length);
      if(task.rulesCount == 0) {
        this.removeTask(task);
      } else{
        this.UIPainter.renderMarkedTask(task);
        this.UIPainter.renderMarkedRules(task);
      }
    }
    if(this.FRManager.getTaskId() == taskId){
      this.FRManager.gotoPage(1); // reloads FRManager if we unmark in current FR Task
    }
  },

  handleSuccessMRTasksRequest: function (data, isBase) {
    Object.each(data, function (value, id) {
      if(!this.tasks[id]){
        this.tasks[id] = new MarkedTask(id, value.name, this.config, value.rule_clipboard_rules, this.i18n, this.FL, this.UIPainter, this, isBase);
        this.UIPainter.renderMarkedTask(this.tasks[id], 'maximize');
        this.tasks[id].calculatePagesCount();
      } else if(this.tasks[id].name != value.name){
        this.setTaskName(id, value.name);
      }
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

  reload: function(taskId, taskName){ // called only from FRManager
    var task = this.tasks[taskId];
    if(!task){
      task = new MarkedTask(taskId, taskName, this.config, 0, this.i18n, this.FL, this.UIPainter, this);
      this.tasks[taskId] = task;
    }
    this.UIPainter.renderMarkedTask(task, 'minimize');
    task.reload();
  },

  removeTask: function(task){
    Object.erase(this.tasks, task.id);
    this.UIPainter.removeMarkedTask(task.id);
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
  }

});