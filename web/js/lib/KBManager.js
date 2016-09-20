var KBManager = new Class({

  errorMessage: '',
  FL: null,
  FRManager: null,
  KBid: 0,
  settings: null,
  tasks: {},
  // používané proměnné KBManager
  config: null,
  i18n: null,
  id: null,
  reloadRules: false, // if should be rules loaded again
  UIPainter: null,
  UIListener: null,
  rules: 0,
  rulesCount: 0,

  initialize: function (config, UIPainter, UIListener, i18n) {
    this.config = config;
    this.i18n = i18n;
    this.UIPainter = UIPainter;
    this.UIListener = UIListener;
  },

  basicAnalyze: function(rule){
    var ruleName = rule.$rule.text;
    Object.each(this.rules, function (ruleData, ruleId) {
      if(ruleName == ruleData.text){
        console.log(rule);
        rule.setInterestRate('0.1');
        this.UIPainter.updateFoundRule(rule);
      }
    }.bind(this));
  },

  getRules: function () {
    if(this.reloadRules){
      var url = this.config.getKnowledgeBaseGetRulesUrl(this.id, 0, this.rulesCount, null); // TO-DO get only names...

      //region načtení pravidel ze serveru...
      new Request.JSON({
        url: url,
        secure: true,
        onSuccess: function (responseJSON, responseText) {
          console.log("getRules - success");
          this.rules = responseJSON.rules;
          this.reloadRules = false;
        }.bind(this),

        onError: function () {
          console.log("getRules - error");
        }.bind(this),

        onFailure: function () {
          console.log("getRules - failure");
        }.bind(this),

        onException: function () {
          console.log("getRules - exception");
        }.bind(this),

        onTimeout: function () {
          console.log("getRules - timeout");
        }.bind(this)

      }).get();
      //endregion
    }
    return this.rules;
  },

  setId: function(id){
    this.id = id;
    this.reloadRules = true;
  },

  setRulesCount: function(count){
    if(this.rulesCount != count){
      this.rulesCount = count;
      this.reloadRules = true;

      this.getRules(); // just for test
    }
  },

});