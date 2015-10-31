var APField = new Class({

    GetterSetter: ['name', 'value', 'stringHelper'],

	$name: '',
	$value: null,
    $stringHelper: null,

	initialize: function (name, value, stringHelper) {
		this.$name = name;
		this.$value = value || 0;
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

    load: function(obj) {
        this.$name = obj.$name;
        this.$value = obj.$value;
        this.$stringHelper = new StringHelper();
    }

});