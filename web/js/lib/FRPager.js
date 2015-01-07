var FRPager = new Class({
  Implements: [Options, Events],

  perPageOptions: [10, 20, 50, 100],
  task: null,
  config: null,
  FL: null,
  FRManager: null,
  IMs: [],
  rules: [],
  state: null,

  innerElement: '.scroller',
  transition: Fx.Transitions.Cubic.easeOut,
  duration: 500,

  numPages: 0,
  currentPage: 0,
  perPage: 10,//TODO dodělat select...
  rulesCount: 0,
  rulesOrder: null,

  lineHeight: 55,
  prevSymbol: '<',
  nextSymbol: '>',
  elControlType: 'span',

  initialize: function (label, paging, foundRulesCount, container, clear, task, config, FL, FRManager, i18n) {
    this.task = task;
    this.config = config;
    this.FL = FL;
    this.FRManager = FRManager;
    this.i18n = i18n;
    this.label = label;
    this.paging = paging;
    this.foundRulesCount = foundRulesCount;
    this.container = container;
    this.clear = clear;

    this.content = this.container.getElement(this.innerElement);
    this.content.set('tween', {transition: this.transition, duration: this.duration});

    this.reset();
  },

  reset: function () {
    this.setInitialized();

    this.rulesCount = 0;
    this.rules = [];
    this.numPages = 1;
    this.currentPage = 1;
    this.container.setStyles({display: 'none'});
    this.clear.setStyles({display: 'none'});
    this.content.empty();
    this.paging.empty();
    this.foundRulesCount.empty();
  },

  setInitialized: function () {
    this.label.removeProperty('class');
    this.label.addClass('mining-not-started');
    this.state = 'not_started';
    this.label.set('text', this.i18n.translate('No discovered rules yet. Create an association rule pattern to start mining.'));
  },

  setInProgress: function () {
    this.reset();
    this.content.tween('margin-top', "-0px");
    this.fireEvent('onScroll', this.currentPage);

    this.label.removeProperty('class');
    this.state = 'in_progress';
    this.label.addClass('mining-in-progress');
    this.label.set('text', this.i18n.translate('Mining is in progress, it may take a while to get the results.'));
  },

  setRulesCount: function (rulesCount) {//TODO
    this.rulesCount = rulesCount;
    this.foundRulesCount.set('text', 'found rules: ' + rulesCount);

    if (this.rulesCount > 0) {
      this.gotoPage(1);//FIXME
    }
  },

  setInterrupted: function (limit) {
    console.log('setInterrupted');
    this.label.removeProperty('class');
    this.label.addClass('mining-stopped');
    this.state = 'stopped';
    this.label.set('text', 'Mining has been stopped, because maximum number of hypotheses has been found (' + limit + ').'); // TODO: Localize
  },

  setFinished: function () {
    console.log('setFinished');
    this.label.removeProperty('class');
    this.label.addClass('mining-finished');
    this.state = 'finished';
    this.label.set('text', this.i18n.translate('Mining has finished!'));
  },

  setNoRules: function () {
    this.label.removeProperty('class');
    this.label.addClass('mining-norules');
    this.state = 'no_rules';
    this.label.set('text', this.i18n.translate('No discovered rules. Try to change the association rule pattern and start mining again.'));
    //TODO rulesCount content...
  },

  setStopped: function () {
    console.log('setStopped');
    this.label.removeProperty('class');
    this.label.addClass('mining-stopped');
    this.state = 'stopped';
    this.label.set('text', this.i18n.translate('Mining has been stopped.'));
  },

  setError: function () {
    this.label.removeProperty('class');
    this.label.addClass('mining-error');
    this.label.set('text', this.i18n.translate('An error occured during mining. Try to start mining again or create new data mining task.'));
  },

  /*
   add: function (rules) {alert('přidání pravidla do rule clipboard!');
   //Array.each(rules, function (r, key) {
   //  this.rules.push(r);
   //}.bind(this));
   this.createControls();
   this.render(rules);
   },

   remove: function (loc) {alert('přepracovat!');
   /* var el = $(loc);
   this.rules.erase(el);
   el.destroy();

   this.numPages = Math.max(Math.ceil(this.rulesCount / this.perPage), 1);
   if (this.numPages < this.currentPage) { // scroll to last page
   this.currentPage = this.numPages;
   this.gotoPage(this.currentPage);
   }
   this.createControls();
   },*/

  createControls: function () {
    this.paging.empty();

    this.paging.grab(this.createOrderSelect());

    this.numPages = Math.ceil(this.rulesCount / this.perPage);
    this.paging.grab(new Element(this.elControlType, {
      'class': 'pager-prev ' + (this.currentPage === 1 ? 'in' : '') + 'active',
      text: this.prevSymbol,
      events: this.currentPage !== 1 ? {
        click: function (e) {
          this.gotoPage(e);
        }.bind(this)
      } : {}
    }).store('page', 'prev'));

    // page 1
    this.paging.grab(this.createControlItem(1));
    if (this.currentPage > 4) {
      this.paging.grab(this.createEmptyControlItem());
      this.paging.grab(this.createControlItem(this.currentPage - 2));
      this.paging.grab(this.createControlItem(this.currentPage - 1));
    } else if (this.currentPage > 3) {
      this.paging.grab(this.createControlItem(this.currentPage - 2));
      this.paging.grab(this.createControlItem(this.currentPage - 1));
    } else if (this.currentPage > 2) {
      this.paging.grab(this.createControlItem(this.currentPage - 1));
    }

    // current page
    if (this.currentPage > 1) {
      this.paging.grab(this.createControlItem(this.currentPage));
    }

    // next page
    if ((this.currentPage + 3) < this.numPages) {
      this.paging.grab(this.createControlItem(this.currentPage + 1));
      this.paging.grab(this.createControlItem(this.currentPage + 2));
      this.paging.grab(this.createEmptyControlItem());
    } else if ((this.currentPage + 2) < this.numPages) {
      this.paging.grab(this.createControlItem(this.currentPage + 1));
      this.paging.grab(this.createControlItem(this.currentPage + 2));
    } else if ((this.currentPage + 1) < this.numPages) {
      this.paging.grab(this.createControlItem(this.currentPage + 1));
    }

    // last page
    if (this.currentPage < this.numPages) {
      this.paging.grab(this.createControlItem(this.numPages));
    }

    this.paging.grab(new Element(this.elControlType, {
      'class': 'pager-next ' + (this.currentPage === this.numPages ? 'in' : '') + 'active',
      text: this.nextSymbol,
      events: this.currentPage !== this.numPages ? {
        click: function (e) {
          this.gotoPage(e);
        }.bind(this)
      } : {}
    }).store('page', 'next'));

  },

  createOrderSelect: function () {//FIXME
    var orderElement = new Element('span', {'id': 'fr-order-count'});

    orderElement.grab(new Element('label', {for: 'fr-order', html: this.i18n.translate('order:')}));
    var orderSelect = new Element('select',
      {
        'id': 'fr-order',
        events: {
          change: function (e) {
            this.order = e.target.get('value');
            e.stop();
            this.gotoPage(1);
          }.bind(this)
        }
      }
    );
    var IMs = this.getIMs();
    var order = this.order;
    Array.each(IMs, function (IM) {
      var option = new Element('option', {value: IM.getName(), text: IM.getLocalizedName()});
      if (IM.getName() == order) {
        option.setAttribute('selected', 'selected');
      }
      orderSelect.grab(option);
    }.bind([order, orderSelect]));
    orderElement.grab(orderSelect);

    orderElement.grab(new Element('label', {for: 'fr-per-page', html: this.i18n.translate('Rules per page:')}));
    var perPageSelect = new Element('select',
      {
        id: 'fr-per-page',
        events: {
          change: function (e) {
            this.perPage = e.target.get('value');
            e.stop();
            this.gotoPage(1);
          }.bind(this)
        }
      }
    );
    var perPage = this.perPage;
    Array.each(this.perPageOptions, function (perPageCount) {
      var option = new Element('option', {value: perPageCount, text: perPageCount});
      if (perPage == perPageCount) {
        option.setAttribute('selected', 'selected');
      }
      perPageSelect.grab(option)
    }.bind([perPageSelect, perPage]));
    orderElement.grab(perPageSelect);
    return orderElement
  },

  createControlItem: function (pageId) {
    var item = new Element(this.elControlType, {
      'class': 'pager-actuator' + (this.currentPage === pageId ? ' active' : ''),
      text: pageId,
      events: {
        click: function (e) {
          this.gotoPage(e);
        }.bind(this)
      }
    }).store('page', pageId);

    return item;
  },

  createEmptyControlItem: function () {
    var item = new Element(this.elControlType, {
      'class': 'pager-actuator-empty',
      text: '...'
    }).store('page', '...');

    return item;
  },

  renderRules: function () {
    this.container.setStyles({display: 'block'});
    this.clear.setStyles({display: 'block'});
    this.content.empty();

    Array.each(this.rules, function (foundRule, key) {
      this.content.grab(Mooml.render('foundRuleTemplate', {
        foundRule: foundRule,
        i18n: this.i18n,
        IMs: this.IMs
      }));

      this.FRManager.UIListener.registerFoundRuleEventHandlers(foundRule);
    }.bind(this));
  },

  gotoPage: function (locator) {
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

  handleSuccessRulesRequest: function (data) {
    //zjištění aktuálních měr zajímavosti
    this.setIMs(this.FL.getRulesIMs(data.task.IMs));
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

  setIMs: function (IMs) {
    this.IMs = IMs;
  },

  getIMs: function () {
    return this.IMs;
  }

});
