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

  getCSSID: function () {
    return 'found-rule-' + this.$task.getId() + '-' + this.$id;
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
    console.log(IMs);
    //TODO vrácení výpisu měr zajímavosti...
  },

  getFoundRuleCSSMarkID: function () {
    return 'mark-rule-' + this.$task.getId() + '-' + this.$id;
  },

  getFoundRuleCSSRemoveID: function () {
    return 'remove-rule-' + this.$task.getId() + '-' + this.$id;
  },

  getFoundRuleCSSDetailsID: function () {
    return 'rule-details-' + this.$task.getId() + '-' + this.$id;
  }
});