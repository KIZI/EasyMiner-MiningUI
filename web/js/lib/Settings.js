/**
 * Class Settings
 * @license http://www.apache.org/licenses/LICENSE-2.0 Apache License, Version 2.0
 * @link http://github.com/kizi/easyminer-miningui
 *
 * @type Class
 */
var Settings = new Class({
    GetterSetter: ['rulesCnt', 'caching', 'debug', 'BKAutoSearch', 'recEnabled', 'strictMatch', 'taskMode'],

	$rulesCnt: 10000,//TODO configure max count of rules
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