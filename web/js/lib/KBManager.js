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
  isReloading: false, // if is reloading right now
  reloadRules: false, // if should be rules loaded again
  UIPainter: null,
  UIListener: null,
  rules: 0,
  lastModified: null,

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
        if(!isInKb){
          if(rule.getId(true) == ruleId){ // rule is in KB
            rule.setRuleSetRelation(ruleArray.relation);
            rule.setInterestRelation("");
            rule.setInterestRate(0);
            isInKb = true;
          } else if(rule.getInterestRate() != "y" && this.compareName(rule.getIdent(), ruleArray.name)){
            rule.setInterestRate("y");
            rule.setInterestRelation(ruleArray.relation);
          }
        }
      }.bind(this));
      if(type == "found"){
        this.UIPainter.updateFoundRule(rule);
      } else if(type == "marked"){
        this.UIPainter.updateMarkedRule(rule);
      }
      if(!isInKb){
        this.deepAnalyze(rule, type);
      }
    }.bind(this));
  },

  compareName: function(ruleName, ruleSetRuleName){
    if(ruleName == ruleSetRuleName){ // identical
      return true;
    }
    var ruleParts = ruleName.split('→');
    var ruleSetRuleParts = ruleSetRuleName.split('→');
    if((ruleParts[0].trim() == ruleSetRuleParts[0].trim()) || (ruleParts[1].trim() == ruleSetRuleParts[1].trim())){ // same antecedent or consequent
      return true;
    }
    return false;
  },

  basicAnalyze: function (rules, type) {
    if(this.isReloading){
      this.basicAnalyze.delay(100,this,[rules, type]);
      return;
    }
    if(this.reloadRules){
      this.isReloading = true;
      var url = this.config.getKnowledgeBaseGetRulesNamesUrl(this.id);

      //region načtení pravidel ze serveru...
      new Request.JSON({
        url: url,
        secure: true,
        onSuccess: function (responseJSON, responseText) {
          console.log("getRules - success");
          this.rules = responseJSON.rules;
          this.reloadRules = false;
          this.isReloading = false;
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
        if(responseJSON.rule){
          rule.setInterestRate(Math.ceil((responseJSON.max).toFloat()*10)*10);
          rule.setInterestRelation(responseJSON.rule.relation);
          if(type == "found"){
            this.UIPainter.updateFoundRule(rule);
          } else if(type == "marked"){
            this.UIPainter.updateMarkedRule(rule);
          }
        }
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

  checkIfModified: function(lastModified){
    if(this.lastModified != lastModified){
      this.lastModified = lastModified;
      this.reloadRules = true;
    }
  },

});