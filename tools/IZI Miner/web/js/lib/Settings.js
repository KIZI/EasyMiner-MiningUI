var Settings = new Class({

    GetterSetter: ['rulesCnt', 'caching', 'BKAutoSearch', 'recEnabled'],

	$rulesCnt: 1000,
    $caching: false,
	$BKAutoSearch: false,
	$recEnabled: true,
	foundRules: {
		AJAXBalancerLimit: 10,
		displayLimit: 10
	}

});