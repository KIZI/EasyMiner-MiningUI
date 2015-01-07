var FRManager = new Class({

  config: null,
  FL: null,
  settings: null,
  i18n: null,
  AJAXBalancer: null,
  UIPainter: null,
  UIListener: null,
  tips: null,
  //TODO dočasně
  perPageOptions: [10, 20, 50, 100],

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

  handleInProgress: function () {//xxx má fungovat
    this.reset();//TODO ??
    this.miningInProgress = true;
    this.UIPainter.renderActiveRule();
    this.UIPainter.renderFoundRules();
  },

  handleStoppedMining: function () {//xxx má fungovat....
    /*this.UIPainter.hideStopMiningButton();*/
    this.miningInProgress = false;
    this.UIPainter.renderActiveRule();
    this.UIPainter.renderFoundRules();
  },

  gotoPage: function(page){
    //TODO zkontrolovat a vyčistit
    if (typeof locator === 'object') {
      var page = $(locator.target).retrieve('page');
      if (page === 'next') {
        this.currentPage++;
      } else if (page === 'prev') {
        this.currentPage--;
      } else {
        this.currentPage = page;
      }
    } else if (locator != null) {
      this.currentPage = locator;
    }

    var url = this.config.getGetRulesUrl(this.task.getId(), (this.currentPage - 1) * this.perPage, this.perPage, this.order);

    //region načtení pravidel ze serveru...
    var request = new Request.JSON({
      url: url,
      secure: true,
      onSuccess: function (responseJSON, responseText) {
        this.handleSuccessRulesRequest(responseJSON);
      }.bind(this),

      onError: function () {
        this.handleErrorRulesRequest();
      }.bind(this),

      onFailure: function () {
        this.handleErrorRulesRequest();
      }.bind(this),

      onException: function () {
        this.handleErrorRulesRequest();
      }.bind(this),

      onTimeout: function () {
        this.handleErrorRulesRequest();
      }.bind(this)

    }).get();
    //endregion
  },

  handleSuccessRulesRequest: function (data) {//FIXME
    //zjištění aktuálních měr zajímavosti
    this.IMs = this.FL.getRulesIMs(data.task.IMs);
    this.rules = [];

    Object.each(data.rules, function (value, key) {
      this.rules.push(new FoundRule(key, value, this.task));
    }.bind(this));

    this.createControls();
    this.renderRules();
  },

  handleErrorRulesRequest: function () {
    alert('error while loading rules from server...');//FIXME dodělat nějakou smysluplnou hlášku
    this.createControls();
  },

  setRulesCount: function(rulesCount){
    this.rulesCount = rulesCount;
    //XXX this.foundRulesCount.set('text', 'found rules: ' + rulesCount);

    if (this.rulesCount > 0) {
      this.gotoPage(1);//FIXME
    }
  },


  renderRules: function (rulesCount, inProgress, task) {///xxx má fungovat...
    this.task = task;
    this.miningInProgress = inProgress;
    // filter new rules
    //TODO remove: rules = this.filterRules(rules);
    /////var parsedRules = this.rulesParser.parse(rules, task);

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
        if (rulesCount < this.settings.getRulesCnt()) {
          this.setFinished();
        } else {
          this.setInterrupted(this.settings.getRulesCnt());
        }
      }

      this.UIPainter.renderActiveRule();
      this.UIPainter.renderFoundRules();
    }
  },

  buildRequest: function (FR, URL, update) {
    console.log('FRManager buildRequest');
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

      onSuccess: function (responseJSON, responseText) {
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
    this.setRulesCount(0);
    this.miningInProgress = false;
    //this.UIPainter.renderActiveRule();
    //this.UIPainter.renderFoundRules();
  },

  /* found rules */
  askBK: function (rule) {
    this.buildRequest(rule, this.config.getBKAskURL(), true);
    this.AJAXBalancer.run();
  },

  markFoundRule: function (FR) {
    alert('označení pravidla...');
    this.AJAXBalancer.stopRequest(FR.getId());

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

  }

});