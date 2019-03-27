/**
 * Class APField
 * @license http://www.apache.org/licenses/LICENSE-2.0 Apache License, Version 2.0
 * @link http://github.com/kizi/easyminer-miningui
 *
 * @type Class
 */
var APField = new Class({

  GetterSetter: ['id', 'name', 'type', 'stringHelper'],

  $id: null,
  $name: '',
  $type: null,
  $stringHelper: null,

  initialize: function (id, name, type, stringHelper) {
    this.$id = id;
    this.$name = name;
    this.$stringHelper = stringHelper;
    this.showInNavFiled = false;
  },

  getNormalizedName: function () {
    return this.$stringHelper.normalizeString(this.$name);
  },

  getShowInNavField: function () {
    return this.showInNavFiled;
  },

  setShowInNavField: function (show) {
    this.showInNavFiled = show;
  },

  getCSSID: function () {
    return 'field-nav-' + this.getNormalizedName();
  },

  getCSSAddID: function () {
    return 'field-nav-add-' + this.getNormalizedName();
  },

  getCSSCheckboxID: function () {
    return 'field-checkbox-' + this.getNormalizedName();
  },

  getCSSShowHistogramID: function () {
    return 'field-nav-show-histogram-' + this.getNormalizedName();
  },

  getCSSNavControlShowMenuField: function () {
		return 'field-nav-control-menu-' + this.getNormalizedName();
  },
  
  getCSSNavAttributeControlField: function () {
    return 'field-nav-attribute-control-' + this.getNormalizedName();
  }

});