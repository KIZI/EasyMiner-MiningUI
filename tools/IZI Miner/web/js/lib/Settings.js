var Settings = new Class({
    GetterSetter: ['rulesCnt', 'caching', 'debug', 'BKAutoSearch', 'recEnabled', 'strictMatch', 'taskMode'],

	$rulesCnt: 1000,
    $caching: false,
    $debug: false,
	$BKAutoSearch: false,
	$recEnabled: false,
    $strictMatch: false,
    $taskMode: 'TaskPool', // Enum: TaskPool, GridPool, ProcPool
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