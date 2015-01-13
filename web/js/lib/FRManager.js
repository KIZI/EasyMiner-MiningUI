var FRManager = new Class({

  config: null,
  FL: null,
  settings: null,
  i18n: null,
  AJAXBalancer: null,
  UIPainter: null,
  UIListener: null,
  tips: null,
  errorMessage: '',

  //nově používané proměnné s informacemi o stavu
  task: null,
  miningInProgress: false,

  IMs: [],
  rules: [],

  rulesCount: 0,
  rulesOrder: null,
  rulesPerPage: null,
  currentPage: null,
  pagesCount: 0,


  initialize: function (config, FL, settings, UIPainter, UIListener, i18n) {
    this.config = config;
    var perPageOptions=this.getPerPageOptions();
    this.rulesPerPage=perPageOptions[0];
    console.log(config);

    this.FL = FL;
    this.settings = settings;
    this.UIPainter = UIPainter;
    this.UIListener = UIListener;
    this.i18n = i18n;
    this.AJAXBalancer = new AJAXBalancer();
    this.tips = new Tips('.found-rule');
    this.tips.addEvent('show', function (tip, el) {
      tip.addClass('tip-visible');
    });
    this.tips.addEvent('hide', function (tip, el) {
      tip.removeClass('tip-visible');
    });

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
    var url = this.config.getGetRulesUrl(this.task.getId(), (page - 1) * this.rulesPerPage, this.rulesPerPage, this.rulesOrder);

    //region načtení pravidel ze serveru...
    var request = new Request.JSON({
      url: url,
      secure: true,
      onSuccess: function (responseJSON, responseText) {
        this.currentPage=page;
        this.handleSuccessRulesRequest(responseJSON);
      }.bind(this).bind(page),

      onError: function () {
        this.handleErrorRulesRequest(page);
      }.bind(this).bind(page),

      onFailure: function () {
        this.handleErrorRulesRequest(page);
      }.bind(this).bind(page),

      onException: function () {
        this.handleErrorRulesRequest(page);
      }.bind(this).bind(page),

      onTimeout: function () {
        this.handleErrorRulesRequest(page);
      }.bind(this).bind(page)

    }).get();
    //endregion
  },

  handleSuccessRulesRequest: function (data) {
    //zjištění aktuálních měr zajímavosti
    this.IMs = this.FL.getRulesIMs(data.task.IMs);
    this.rules = [];

    Object.each(data.rules, function (value, key) {
      this.rules.push(new FoundRule(key, value, this.task));
    }.bind(this));

    this.UIPainter.renderFoundRules();
  },

  handleErrorRulesRequest: function (page){
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


  renderRules: function (rulesCount, inProgress, task) {
    this.task = task;
    this.miningInProgress = inProgress;

    if (!inProgress && !rulesCount) {
      this.UIPainter.renderActiveRule();
    } else {
      this.setRulesCount(rulesCount);
      /*if (numRules) {
       if (numRules > Object.getLength(this.rules)) { // new rules to render
       var els = [];
       Array.each(parsedRules, function (r) {
       var FR = new FoundRule(r);
       this.rules[r.getId()] = FR;
       els.push(Mooml.render('foundRuleTemplate', {
       showFeedback: this.config.getShowFeedback(),
       key: r.getId(),
       FR: FR,
       i18n: this.i18n,
       BK: this.settings.getBKAutoSearch()
       }));
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
       }*/

      if (!inProgress) {
        /*TODO
        if (rulesCount < this.settings.getRulesCnt()) {
          this.setFinished();
        } else {
          this.setInterrupted(this.settings.getRulesCnt());
        }
        */
      }

      this.UIPainter.renderActiveRule();
      this.UIPainter.renderFoundRules();
    }
  },

  buildRequest: function (foundRule, URL, update) {//TODO předělat ajax balancer
    console.log('FRManager buildRequest');

    var options = {
      url: URL,
      secure: true,

      onRequest: function () {
        if (update){
          this.UIPainter.showFRLoading(foundRule);
        }
      }.bind(this),

      onSuccess: function (responseJSON, responseText) {
        if (update && responseJSON.status == 'ok') {
          this.handleSuccessRequest(foundRule, responseJSON);
        } else {
          this.handleErrorRequest(foundRule);
        }
      }.bind(this),

      onError: function () {
        this.handleErrorRequest(foundRule);
      }.bind(this),

      onCancel: function () {
        this.handleErrorRequest(foundRule);
      }.bind(this),

      onFailure: function () {
        this.handleErrorRequest(foundRule);
      }.bind(this),

      onException: function () {
        this.handleErrorRequest(foundRule);
      }.bind(this),

      onTimeout: function () {
        this.handleErrorRequest(foundRule);
      }.bind(this)
    };

    this.AJAXBalancer.addRequest(options, JSON.encode(reqData), foundRule.getCSSID());
  },

  // TODO refactor into single class
  handleErrorRequest: function (FR) {//TODO ???
    console.log('FRManager handleErrorRequest');
    this.UIPainter.updateFoundRule(FR);
  },

  handleSuccessRequest: function (FR, data) {
    console.log('FRManager handleSuccessRequest');
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


  handleError: function () {
    this.miningInProgress = false;
    this.UIPainter.renderActiveRule();
    this.UIPainter.renderFoundRules();
  },

  reset: function () {
    this.AJAXBalancer.stopAllRequests();
    this.errorMessage='';
    this.setRulesCount(0);
    this.miningInProgress = false;
  },

  markFoundRule: function (foundRule) {
    alert('označení pravidla...');
    this.AJAXBalancer.stopRequest(foundRule.getId());
    console.log(this.task.getId());
    console.log(this.task.getName());
    ///this.buildRequest(FR, this.config.getRuleClipboardAddRuleUrl(,foundRule.getId()), false);
    ///this.AJAXBalancer.run();
    /////TODO odeslání ajaxového požadavku pro přidání do rule clipboard
    //TODO vykreslení pravidla v rule clipboard
    //this.UIPainter.renderMarkedRules(null, this.$markedRules);

    // index interesting rule into KB
    /*
     this.buildRequest(FR, this.config.getBKSaveInterestingURL(), false);
     this.AJAXBalancer.run();

     this.saveMarkedRules();*/
  },

  unmarkFoundRule: function (foundRule) {
    alert('odznačení pravidla...');
    this.AJAXBalancer.stopRequest(foundRule.getId());

    //TODO odeslání ajaxového požadavku pro přidání do rule clipboard
    //TODO vykreslení pravidla v rule clipboard
    //this.UIPainter.renderMarkedRules(null, this.$markedRules);

    // index interesting rule into KB
    /*
     this.buildRequest(FR, this.config.getBKSaveInterestingURL(), false);
     this.AJAXBalancer.run();

     this.saveMarkedRules();*/
  },

  removeFoundRule: function (FR) {
    alert('removeFoundRule');
    this.AJAXBalancer.stopRequest(FR.getRule().getId());

    // index not interesting rule into KB
    this.buildRequest(FR, this.config.getBKSaveNotInterestingURL(), false);
    this.AJAXBalancer.run();
  },

  /**
   * Gets the task based on its ID.
   * @param taskId ID of the task to get.
   */
  getTask: function (taskId) {
  //TODO ???
    // Declarations
    var task = null;
/*
    // Find the task
    this.$markedRules.each(function (e) {
      if (e.$rule.task.$requestData.taskId == taskId) {
        task = e;
        return false;
      }
    });*/

    // Return
    return task.$rule.task;
  },

  /**
   * Renames the task.
   * @param taskId Task id to rename.
   * @param newTaskName A new task name to set.
   */
  renameTask: function (taskId, newTaskName) {
  //TODO Standa: předělat...
    // Rename the task
    var task = this.getTask(taskId);
    task.setName(newTaskName);

    // Refresh the task name
    this.UIPainter.renderMarkedRules(null);

  },

  getPerPageOptions: function(){
    return this.config.getPerPageOptions();
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
  }

});