var MRManager = new Class({

  // používané proměnné MRManager
  config: null,
  errorMessage: '',
  i18n: null,
  FL: null,
  FRManager: null,
  KBManager: null,
  KBid: 0,
  settings: null,
  tasks: {},
  UIPainter: null,
  UIListener: null,

  initialize: function (config, FL, settings, UIPainter, UIListener, i18n, KBManager) {
    this.config = config;
    this.i18n = i18n;
    this.FL = FL;

    this.settings = settings;
    this.UIPainter = UIPainter;
    this.UIListener = UIListener;

    this.KBManager = KBManager;

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

  loadKnowledgeBase: function (id) {
    this.UIPainter.$UIScroller.rememberLastScroll();
    if(this.KBid != id){
      if(this.tasks[this.KBid]){ this.removeTask(this.tasks[this.KBid]); }
      this.tasks[id] = new MarkedTask(id, '', this.config, 0, this.i18n, this.FL, this.UIPainter, this, true);
      this.KBid = id;
      this.KBManager.setId(id);
    }
    this.tasks[id].reload();
  },

  getUnmarkRequest: function (foundRules, taskId, URL) {
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
        this.handleSuccessMRUnmarkRequest(responseJSON, foundRules, taskId);
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

  getRuleSetsRequest: function(){
    var url = this.config.getKnowledgeBaseGetRuleSetsUrl();

    //region načtení úloh ze serveru
    new Request.JSON({
      url: url,
      secure: true,
      onSuccess: function (responseJSON, responseText) {
        this.UIPainter.renderRulesetsList(responseJSON, this.KBid);
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

  handleSuccessMRUnmarkRequest: function (jsonData, foundRules, taskId){
    if ((foundRules == undefined)||(foundRules.length == 0)){return;}
    this.KBManager.reloadRules = true;
    //if(task.pagesCount > 1){
      this.tasks[taskId].reload();
    /*} else{ TODO asi načítat vždy, jelikož používáme nejen pro unmark, ale zvážit...
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
    }*/
    var isInFr = false;
    Object.each(foundRules, function (value) {
      if(this.FRManager.getFoundRulesByIds(value.$id).length > 0){
        isInFr = true;
      }

    }.bind(this));
    if(this.FRManager.getTaskId() == taskId || isInFr){
      this.FRManager.gotoPage(this.FRManager.currentPage); // reloads FRManager if we unmark in current FR Task
    }
    this.loadKnowledgeBase(this.KBid);
  },

  handleSuccessMRTasksRequest: function (data) {
      Object.each(data, function (value, id) {
        if(!this.tasks[id]){
          this.tasks[id] = new MarkedTask(id, value.name, this.config, value.rule_clipboard_rules, this.i18n, this.FL, this.UIPainter, this, false, value.rules_order, value.state, value.importState);
          this.UIPainter.renderMarkedTask(this.tasks[id], 'maximize');
          this.tasks[id].calculatePagesCount();
        } else if(this.tasks[id].name != value.name){
          this.setTaskName(id, value.name);
        }
      }.bind(this));
  },

  reload: function(taskId, taskName){ // called only from FRManager
    var task = this.tasks[taskId];
    if(!task){
      task = new MarkedTask(taskId, taskName, this.config, 0, this.i18n, this.FL, this.UIPainter, this);
      this.tasks[taskId] = task;
    }
    this.UIPainter.renderMarkedTask(task, 'minimize');
    task.reload();
    this.loadKnowledgeBase(this.KBid);
  },

  removeTask: function(task){
    Object.erase(this.tasks, task.id);
    this.UIPainter.removeMarkedTask(task.id, task.isBase);
  },

  removeCompleteTask: function(task){
    new Request.JSON({
      url: this.config.getRuleClipboardRemoveAllRulesUrl(task.id),
      secure: true,
      onSuccess: function () {
        this.removeTask(task);
        if(this.FRManager.getTaskId() == task.id){
          this.FRManager.gotoPage(1); // reloads FRManager if we removed current FR Task
        }
      }.bind(this)
    }).get();
  },

  editRuleset: function(taskId, newTaskName, newTaskDesc){
    var task = this.tasks[taskId];
    if(task != undefined){
      new Request.JSON({
        url: this.config.getKnowledgeBaseRenameRuleSetUrl(taskId,newTaskName,newTaskDesc),
        secure: true,
        onSuccess: function () {
          this.loadKnowledgeBase(taskId);
          task.setName(newTaskName);
          task.setDesc(newTaskDesc);
          this.UIPainter.renderMarkedTask(task);
        }.bind(this),

        onError: function () {
          alert('Editing ruleset failed. Try again later.');
        }.bind(this),

        onFailure: function () {
          alert('Editing ruleset failed. Try again later.');
        }.bind(this),

        onException: function () {
          alert('Editing ruleset failed. Try again later.');
        }.bind(this),

        onTimeout: function () {
          alert('Editing ruleset failed. Try again later.');
        }.bind(this)
      }).get();
    }
  },

  setTaskName: function(taskId, newTaskName){
    var task = this.tasks[taskId];
    if(task != undefined){
      task.setName(newTaskName);
      this.UIPainter.renderMarkedTask(task);
      this.UIPainter.renderMarkedRules(task);
    }
  },

  /* region rules actions */

  multiFoundRules:function(foundRulesIds, taskId){
    var selectedFoundRules = this.getMarkedRulesByIds(this.cleanMarkedRulesIds(foundRulesIds, taskId), taskId);
    if (selectedFoundRules.length == 0){return;}
    var urlIds = [],
        taskId = selectedFoundRules[0].$task.id;
    Array.each(selectedFoundRules, function(foundRule){
      urlIds.push(foundRule.$id);
      foundRule.setLoading(true);
    }.bind(this));
    urlIds = urlIds.join(',');
    return [selectedFoundRules, urlIds]
  },

  multiKBAddRule: function (foundRulesIds, taskId, relation) {
    var foundRules = this.multiFoundRules(foundRulesIds, taskId);
    this.getUnmarkRequest(foundRules[0],taskId,this.config.getKnowledgeBaseAddRulesUrl(this.KBid,foundRules[1],relation));
  },

  kbAddRule: function (foundRule, relation) {
    this.getUnmarkRequest([foundRule],foundRule.getTaskId(),this.config.getKnowledgeBaseAddRulesUrl(this.KBid,foundRule.getId(true),relation));
  },

  multiKBRemoveRule: function (foundRulesIds, taskId) {
    var foundRules = this.multiFoundRules(foundRulesIds, taskId);
    this.getUnmarkRequest(foundRules[0],taskId,this.config.getKnowledgeBaseRemoveRulesUrl(this.KBid,foundRules[1]));
  },

  kbRemoveRule: function (foundRule) {
    this.getUnmarkRequest([foundRule],foundRule.getTaskId(),this.config.getKnowledgeBaseRemoveRulesUrl(this.KBid,foundRule.getId(true)));
  },

  multiUnmarkFoundRules:function(foundRulesIds, taskId){
    var foundRules = this.multiFoundRules(foundRulesIds, taskId);
    this.getUnmarkRequest(foundRules[0],taskId,this.config.getRuleClipboardRemoveRuleUrl(taskId,foundRules[1]));
  },

  unmarkMarkedRule: function (foundRule) {
    this.getUnmarkRequest([foundRule],foundRule.getTaskId(),this.config.getRuleClipboardRemoveRuleUrl(foundRule.getTaskId(),foundRule.$id));
  }
  /* regionend rules actions */

});