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
	}

});