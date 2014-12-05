//TODO přepracovat...
var Pager = new Class({
  Implements: [Options, Events],

  task: null,
  config: null,
  IMs:[],
  rules:[],

  innerElement: '.scroller',
  transition: Fx.Transitions.Cubic.easeOut,
  duration: 500,

  numPages: 0,
  currentPage: 0,
  perPage: 10,//TODO dodělat select...
  rulesCount: 0,
  rulesOrder: null, //TODO dodělat select...

  lineHeight: 55,
  prevSymbol: '<',
  nextSymbol: '>',
  elControlType: 'span',

  // labels
  textInit: '',
  textProgress: '',
  textFinished: '',
  textNoRules: '',
  $textStopped: '',
  $textError: '',

  initialize: function (label, paging, foundRulesCount, container, clear, task, config, i18n, textInit, textProgress, textFinished, textNoRules, textStopped, textError) {
    this.task=task;
    this.config=config;
    this.i18n=i18n;
    this.label = label;
    this.paging = paging;
    this.foundRulesCount = foundRulesCount;
    this.container = container;
    this.clear = clear;
    this.textInit = textInit;
    this.textProgress = textProgress;
    this.textFinished = textFinished;
    this.textNoRules = textNoRules;
    this.$textStopped = textStopped;
    this.$textError = textError;
    this.content = this.container.getElement(this.innerElement);
    this.content.set('tween', {transition: this.transition, duration: this.duration});

    this.reset();
  },

  reset: function () {
    this.setInitialized();

    this.rulesCount = 0;
    this.rules=[];
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
    this.label.set('text', this.textInit);
  },

  setInProgress: function () {
    this.reset();
    this.content.tween('margin-top', "-0px");
    this.fireEvent('onScroll', this.currentPage);

    this.label.removeProperty('class');
    this.label.addClass('mining-in-progress');
    this.label.set('text', this.textProgress);
  },

  setRulesCount: function(rulesCount){//TODO
    this.rulesCount=rulesCount;
    this.foundRulesCount.set('text','found rules: '+rulesCount);

    if (this.rulesCount>0){
      this.gotoPage(1);//FIXME
    }
  },

  setInterrupted: function (limit) {
    this.label.removeProperty('class');
    this.label.addClass('mining-stopped');
    this.label.set('text', 'Mining has been stopped, because maximum number of hypotheses has been found (' + limit + ').'); // TODO: Localize
  },

  setFinished: function () {
    this.label.removeProperty('class');
    this.label.addClass('mining-finished');
    this.label.set('text', this.textFinished);
  },

  setNoRules: function () {
    this.label.removeProperty('class');
    this.label.addClass('mining-norules');
    this.label.set('text', this.textNoRules);
    //TODO rulesCount content...
  },

  setStopped: function () {
    this.label.removeProperty('class');
    this.label.addClass('mining-stopped');
    this.label.set('text', this.$textStopped);
  },

  setError: function () {
    this.label.removeProperty('class');
    this.label.addClass('mining-error');
    this.label.set('text', this.$textError);
  },

  /*
  add: function (rules) {alert('přepracovat!');
    //Array.each(rules, function (r, key) {
    //  this.rules.push(r);
    //}.bind(this));
    this.createControls();
    this.render(rules);
  },*/

  remove: function (loc) {alert('přepracovat!');
   /* var el = $(loc);
    this.rules.erase(el);
    el.destroy();

    this.numPages = Math.max(Math.ceil(this.rulesCount / this.perPage), 1);
    if (this.numPages < this.currentPage) { // scroll to last page
      this.currentPage = this.numPages;
      this.gotoPage(this.currentPage);
    }*/
    this.createControls();
  },

  createControls: function () {
    this.numPages = Math.ceil(this.rulesCount / this.perPage);
    this.paging.empty();
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
    Array.each(this.rules, function (r, key) {
      this.content.grab(r);
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
    } else {
      this.currentPage = locator;
    }
//TODO
    var url=this.config.getGetRulesUrl(this.task.getId(),(this.currentPage-1)*this.perPage,this.perPage,this.order);
    alert('gotoPage '+this.currentPage);
    alert(url);

    //region načtení pravidel ze serveru...
    var request = new Request.JSON({
      url: url,
      secure: true,
      onSuccess: function (responseJSON, responseText) {
        alert('success');
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

    ////var scrollTo = Math.max((this.lineHeight * this.perPage) * (this.currentPage - 1) - (2 * (this.currentPage - 1)), 0);


    //TODO načtení dané stránky pravidel...
    ///return;

    //this.content.tween('margin-top', "-" + scrollTo + "px");
    //this.fireEvent('onScroll', this.currentPage);

    //this.createControls();
  },

  handleSuccessRulesRequest: function(data){
    //TODO vypsání pravidel
    console.log(data);

    this.setIMs(data.task.IMs);
    this.rules=[];

    Object.each(data.rules,function(value,key){
      var foundRule=new FoundRule(key,value,this.task);
      this.rules.push(Mooml.render('foundRuleTemplate',{
        foundRule: foundRule,
        i18n: this.i18n,
        IMs: this.IMs
      }));
    }.bind(this));

/*
    for(var ruleId in data.task.rules){
      var r = new FoundRule(data.task.rules[ruleId]);
      this.rules.push(Mooml.render('foundRuleTemplate', {
        key: r.getId(),
        FR: FR,
        i18n: this.i18n,
        BK: this.settings.getBKAutoSearch()
      }));
    }*/
    /*
    Array.each(data., function (r) {
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
*/



    this.createControls();
    this.renderRules();
  },

  handleErrorRulesRequest: function(){
    alert('error while loading rules from server...');//FIXME dodělat nějakou smysluplnou hlášku
    this.createControls();
  },

  setIMs:function(IMs){
    //TODO doplnění výchozích měr zajímavosti...
    this.IMs=IMs;
  }

});
