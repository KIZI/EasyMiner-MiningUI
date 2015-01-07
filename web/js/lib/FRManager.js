var FRManager = new Class({
  GetterSetter: ['markedRules'],

  config: null,
  FL: null,
  rulesParser: null,
  settings: null,
  i18n: null,
  AJAXBalancer: null,
  UIPainter: null,
  UIListener: null,
  //rules: {},
  //$markedRules: [],
  maxIndex: 0,
  tips: null,
  miningInProgress: false,

  initialize: function (config, FL, rulesParser, settings, UIPainter, UIListener, i18n) {
    this.config = config;
    this.FL=FL;
    this.rulesParser = rulesParser;//TODO remove...
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

  initPager: function () {
    this.pager = new FRPager($('found-rules-pager-label'), $('found-rules-paging'), $('found-rules-count'), $('found-rules-pager'), $('found-rules-pager-clear'),
      this.task,
      this.config,
      this.FL,
      this,
      this.i18n);
  },

  handleInProgress: function () {
    this.reset();//TODO ??
    this.miningInProgress=true;
    this.UIPainter.renderActiveRule();
    this.pager.setInProgress();
  },

  handleStoppedMining: function () {
    /*this.UIPainter.hideStopMiningButton();*/
    this.miningInProgress=false;
    this.UIPainter.renderActiveRule();
    this.pager.setStopped();
  },

  renderRules: function (rulesCount, inProgress, task) {
    this.pager.task=task;
    this.miningInProgress=inProgress;
    // filter new rules
    //TODO remove: rules = this.filterRules(rules);
    /////var parsedRules = this.rulesParser.parse(rules, task);

    if (!inProgress && !rulesCount) {
      this.pager.setNoRules();
      /*this.UIPainter.hideStopMiningButton();*/
      this.UIPainter.renderActiveRule();
    } else{
      this.pager.setRulesCount(rulesCount);
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
          this.pager.setFinished();
        } else {
          this.pager.setInterrupted(this.settings.getRulesCnt());
        }
      }

      this.UIPainter.renderActiveRule();

    }
  },
/*
  filterRules: function (rules) {
    console.log('FRManager filterRules');
    var filtered = [];
    var i = 0;
    Array.each(rules, function (rule, key) {
      // TODO one rule
      //if (!value.hasOwnProperty('value')) { return true; } // if one rule is returned, it does not have id

      if (++i > this.maxIndex) {
        filtered.push(rule);
      }
    }.bind(this));

    return filtered;
  },*/

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

  handleErrorRequest: function (FR) {
    console.log('FRManager handleErrorRequest');
    this.UIPainter.updateFoundRule(FR);
  },

  handleError: function () {
    console.log('FRManager handleError');
    this.pager.reset();
    this.pager.setError();
    this.miningInProgress=false;
    this.UIPainter.renderActiveRule();
  },

  reset: function () {
    this.AJAXBalancer.stopAllRequests();
    this.rules = {};
    this.pager.reset();
    this.maxIndex = 0;
    this.UIPainter.renderActiveRule();
  },

  /* found rules */
  askBK: function (rule) {
    this.buildRequest(rule, this.config.getBKAskURL(), true);
    this.AJAXBalancer.run();
  },

  markFoundRule: function (FR) {alert('označení pravidla...');
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

  removeFoundRule: function (FR) {alert('removeFoundRule');
    this.AJAXBalancer.stopRequest(FR.getRule().getId());
    this.pager.remove(FR.getCSSID());

    // index not interesting rule into KB
    this.buildRequest(FR, this.config.getBKSaveNotInterestingURL(), false);
    this.AJAXBalancer.run();
  },

  /* marked rules */
  getMarkedRule: function (id) {alert('getMarkedRule');
    var rule = null;
    Object.each(this.$markedRules, function (markedRule) {
      if (id === markedRule.getId()) {
        rule = markedRule;
      }
    }.bind(this));

    return rule;
  },

  getMarkedRules: function (taskId) {alert('getMarkedRules');
    var rules = [];
    this.$markedRules.each(function (rule) {
      if (rule.getRule().getTask().getId() === taskId) {
        rules.push(rule);
      }
    });

    return rules;
  },

  removeMarkedRule: function (FR) {alert('removeMarkedRules');
    Object.each(this.$markedRules, function (MR, key) {
      if (FR.getRule().getId() === MR.getRule().getId()) {
        delete this.$markedRules[key];
      }
    }.bind(this));

    this.UIPainter.renderMarkedRules(null, this.$markedRules);

    this.saveMarkedRules();
  },

  saveMarkedRules: function () {alert('saveMarkedRules');
    var rules = [];
    Array.each(this.$markedRules, function (rule) {
      rules.push(rule.getRule().serialize());
    });

    var data = {
      miner: this.config.getIdDm(),
      type: 'clipboard',
      data: JSON.stringify(rules)
    };

    var request = new Request.JSON({
      url: this.config.getSaveClipboardUrl(),
      secure: true
    }).post(data);
  },

  /**
   * Gets the task based on its ID.
   * @param taskId ID of the task to get.
   */
  getTask: function (taskId) {
    // Declarations
    var task = null;

    // Find the task
    this.$markedRules.each(function (e) {
      if (e.$rule.task.$requestData.taskId == taskId) {
        task = e;
        return false;
      }
    });

    // Return
    return task.$rule.task;
  },

  /**
   * Renames the task.
   * @param taskId Task id to rename.
   * @param newTaskName A new task name to set.
   */
  renameTask: function (taskId, newTaskName) {
    // Rename the task
    var task = this.getTask(taskId);
    task.setName(newTaskName);

    // Refresh the task name
    this.UIPainter.renderMarkedRules(null, this.$markedRules);

    // Save the task
    this.saveMarkedRules();
  }

});