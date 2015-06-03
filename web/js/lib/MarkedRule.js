var MarkedRule = new Class({

  // používané proměnné MarkedRule
  $id: null,
  $loading: false,
  $rule: null,
  $task: null,

  initialize: function (id, rule, task) {
    this.$id = id;
    this.$rule = rule;
    this.$task = task;
  },

  getCSSID: function () {
    return 'marked-rule-' + this.getId();
  },

  getDetailsCSSID: function () {
    return 'details-' + this.getCSSID();
  },

  getId: function(onlyRuleId){
    if (onlyRuleId){
      return this.$id;
    }else{
      return this.$task.id + '-' + this.$id;
    }
  },

  getIdent: function () {
    return this.$rule.text;
  },

  getRuleValues: function(){
    return {
      a:this.$rule.a,
      b:this.$rule.b,
      c:this.$rule.c,
      d:this.$rule.d
    };
  },

  getTaskId: function(){
    return this.$task.id;
  },

  getUnmarkCSSID: function(){
    return 'unmark-' + this.getCSSID();
  },

  getUpCSSID: function(){
    return 'up-' + this.getCSSID();
  },

  getDownCSSID: function(){
    return 'down-' + this.getCSSID();
  },

  getKBRemoveCSSID: function(){
    return 'kbRemove-' + this.getCSSID();
  },

  getKBAddCSSID: function(){
    return 'kbAdd-' + this.getCSSID();
  },

  isLoading: function(){
    return (this.$loading || false);
  },

  setLoading: function(loading){
    this.$loading = loading;
  }

});