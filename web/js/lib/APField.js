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
  },

  getNormalizedName: function () {
    return this.$stringHelper.normalizeString(this.$name);
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
  }

});