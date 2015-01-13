var FoundRule = new Class({

  Properties: ['exception', 'interesting', 'rule'],

  $exception: null,
  $interesting: null,

  $id: null,
  $rule: null,
  $task: null,

  initialize: function (id, rule, task) {
    this.$id = id;
    this.$rule = rule;
    this.$task = task;
  },

  parseFromObject: function (data) {
    this.$rule = new AssociationRule();
    this.$rule.parseFromObject(data);
  },

  getId: function(){
    return this.$task.getId() + '-' + this.$id;
  },

  getCSSID: function () {
    return 'found-rule-' + this.getId();
  },

  isException: function () {
    return (this.$exception !== null);
  },

  isInteresting: function () {
    return (this.$interesting !== null);
  },

  getIdent: function () {
    //TODO vrácení záznamu pravidla...
    return this.$rule.text;
  },

  getIMIdent: function (IMs) {

    //TODO vrácení výpisu měr zajímavosti...
  },

  getMarkCSSID: function () {
    return 'mark-' + this.getCSSID();
  },

  getUnmarkCSSID: function(){
    return 'unmark-' + this.getCSSID();
  },

  getDetailsCSSID: function () {
    return 'details-' + this.getCSSID();
  },

  getRuleValues: function(){
    return {
      a:this.$rule.a,
      b:this.$rule.b,
      c:this.$rule.c,
      d:this.$rule.d
    };
  },

  isSelected: function(){
    return this.$rule.selected==1;
  },

  setSelected: function(value){
    this.$rule.selected = value;
  }

});