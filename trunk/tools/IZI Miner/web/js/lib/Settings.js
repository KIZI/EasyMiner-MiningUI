var Settings = new Class({

    GetterSetter: ['rulesCnt', 'caching', 'debug', 'BKAutoSearch', 'recEnabled'],

	$rulesCnt: 1000,
    $caching: false,
    $debug: false,
	$BKAutoSearch: false,
	$recEnabled: true,
	foundRules: {
		AJAXBalancerLimit: 10,
		displayLimit: 10
	},
    $attributes: {
        editAllowed: false,
        deleteAllowed: true
    },

    isAttributeEditAllowed: function() {
        return this.$attributes.editAllowed;
    },

    isAttributeDeleteAllowed: function() {
        return this.$attributes.deleteAllowed;
    }

});