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

  compareNames: function(rules, type){
    Object.each(rules, function(ruleData, ruleId){
      var rule = rules[ruleId],
          isInKb = false;
      Object.each(this.rules, function (ruleArray, ruleId) {
        if(rule.getId(true) == ruleId){ // rule is in KB
          rule.setRuleSetRelation(ruleArray.relation);
          this.UIPainter.updateMarkedRule(rule);
          isInKb = true;
        } else if(rule.getIdent() == ruleArray.name){
          rule.setInterestRate('0.1');
          if(type == "found"){
            this.UIPainter.updateFoundRule(rule);
          } else if(type == "marked"){
            this.UIPainter.updateMarkedRule(rule);
          }
        }
      }.bind(this));
      if(!isInKb){
        this.deepAnalyze(rule, type);
      }
    }.bind(this));
  },

  basicAnalyze: function (rules, type) {
    if(this.reloadRules){
      var url = this.config.getKnowledgeBaseGetRulesNamesUrl(this.id);

      //region načtení pravidel ze serveru...
      new Request.JSON({
        url: url,
        secure: true,
        onSuccess: function (responseJSON, responseText) {
          console.log("getRules - success");
          this.rules = responseJSON.rules;
          this.reloadRules = false;
          this.compareNames(rules, type);
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
    } else{
      this.compareNames(rules, type);
    }
  },

  deepAnalyze: function (rule, type) {
    var url = this.config.getKnowledgeBaseCompareRuleUrl(rule.$id, this.id);

    //region analýzy pravidla na serveru...
    new Request.JSON({
      url: url,
      secure: true,
      onSuccess: function (responseJSON, responseText) {
        console.log("deepAnalyze - success");
      }.bind(this),

      onError: function () {
        console.log("deepAnalyze - error");
      }.bind(this),

      onFailure: function () {
        console.log("deepAnalyze - failure");
      }.bind(this),

      onException: function () {
        console.log("deepAnalyze - exception");
      }.bind(this),

      onTimeout: function () {
        console.log("deepAnalyze - timeout");
      }.bind(this)

    }).get();
    //endregion
  },

  setId: function(id){
    this.id = id;
    this.reloadRules = true;
  },

  setRulesCount: function(count){
    if(this.rulesCount != count){
      this.rulesCount = count;
      this.reloadRules = true;
    }
  },

});