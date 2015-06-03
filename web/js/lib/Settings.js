var Settings = new Class({
    GetterSetter: ['rulesCnt', 'caching', 'debug', 'BKAutoSearch', 'recEnabled', 'strictMatch', 'taskMode'],

	$rulesCnt: 10000,//TODO Standa nastavení maximálního počtu pravidel
    $caching: false,
    $debug: false,
	$BKAutoSearch: false,
	$recEnabled: false,
    $strictMatch: false,
    $taskMode: 'task', // Enum: task, grid, proc
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