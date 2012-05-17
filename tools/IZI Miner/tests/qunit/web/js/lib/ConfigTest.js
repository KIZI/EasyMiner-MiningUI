
module('Config');

test('getRulesGetURL', function () {
	var ConfigObj = new Config();
	ConfigObj.setRulesGetURL('getRules.php');
	ConfigObj.setParams('param1=value1');
	
	strictEqual(ConfigObj.getRulesGetURL(), 'getRules.php?param1=value1');
});