var MarkedRule = new Class({

  /*Properties: ['exception', 'interesting', 'rule'],

  $exception: null,
  $interesting: null,*/


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
  // used

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

  isLoading: function(){
    return (this.$loading || false);
  },

  setLoading: function(loading){
    this.$loading = loading;
  }/*,

  // not used yet

  parseFromObject: function (data) {
    this.$rule = new AssociationRule();
    this.$rule.parseFromObject(data);
  },


  isException: function () {
    return (this.$exception !== null);
  },

  isInteresting: function () {
    return (this.$interesting !== null);
  },

  getIMIdent: function (IMs) {

    //TODO vrácení výpisu měr zajímavosti...
  },

  getMarkCSSID: function () {
    return 'mark-' + this.getCSSID();
  },

  isSelected: function(){
    return this.$rule.selected==1;
  },

  setSelected: function(value){
    this.$rule.selected = value;
  }*/

});