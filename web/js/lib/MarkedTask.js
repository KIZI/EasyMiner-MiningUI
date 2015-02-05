var MarkedTask = new Class({

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
  rules: {},
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
    this.rules = {};
    if(data.task.rulesCount == 0) {
      this.MRManager.removeTask(this);
    } else{
      this.IMs = this.FL.getRulesIMs(data.task.IMs);
      this.setRulesCount(data.task.rulesCount);

      Object.each(data.rules, function (MRdata, MRid) {
        this.rules[MRid] = new MarkedRule(MRid, MRdata, this);
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
  }

});