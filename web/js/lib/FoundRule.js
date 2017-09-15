/**
 * Class FoundRule
 * @license http://www.apache.org/licenses/LICENSE-2.0 Apache License, Version 2.0
 * @link http://github.com/kizi/easyminer-miningui
 *
 * @type Class
 */
var FoundRule = new Class({

  Properties: ['exception', 'interesting', 'rule'],

  $exception: null,
  $interesting: null,
  $interestRate: 0,
  $interestRelation: null,
  $loading: false,

  $id: null,
  $rule: null,
  $task: null,

  initialize: function (id, rule, task) {
    this.$id = id;
    this.$rule = rule;
    this.$task = task;
  },
/*
  parseFromObject: function (data) {
    this.$rule = new AssociationRule();
    this.$rule.parseFromObject(data);
  },*/

  getId: function(onlyRuleId){
    if (onlyRuleId){
      return this.$id;
    }else{
      return this.$task.getId() + '-' + this.$id;
    }
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

  getKBAddNegativeCSSID: function(){
    return 'kbAddNegative-' + this.getCSSID();
  },

  getKBAddPositiveCSSID: function(){
    return 'kbAddPositive-' + this.getCSSID();
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
  },

  isInRuleSet: function(){
    return this.$rule.ruleSetRelation!="";
  },

  setRuleSetRelation: function(relation){
    this.$rule.ruleSetRelation=relation;
  },

  getRuleSetRelation: function(){
    return this.$rule.ruleSetRelation;
  },

  isLoading: function(){
    return (this.$loading || false);
  },

  setLoading: function(loading){
    this.$loading=loading;
  },

  getInterestRate: function () {
    return this.$interestRate;
  },

  setInterestRate: function(value){
    this.$interestRate = value;
  },

  getInterestRelation: function () {
    return this.$interestRelation;
  },

  setInterestRelation: function(relation){
    this.$interestRelation = relation;
  },

  getTaskId: function(){
    return this.$task.getId();
  }

});