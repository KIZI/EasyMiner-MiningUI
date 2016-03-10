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
  },

  load: function (obj) {
    this.$name = obj.$name;
    this.$value = obj.$value;
    this.$stringHelper = new StringHelper();
  }

});