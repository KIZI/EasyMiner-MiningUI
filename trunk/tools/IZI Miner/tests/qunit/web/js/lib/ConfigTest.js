
module('Config');

test('getRulesGetURL', function () {
	var ConfigObj = new Config();
    ConfigObj.setParams({id_dm: '25', id_kb: '27'});
	ConfigObj.setRulesGetURL('getRules.php');
	
	strictEqual(ConfigObj.getRulesGetURL(), 'getRules.php?id_dm=25');
});

test('getBKAskURL', function () {
    var ConfigObj = new Config();
    ConfigObj.setParams({id_dm: '25', id_kb: '27'});
    ConfigObj.setBKGetURL('getBK.php');

    strictEqual(ConfigObj.getBKAskURL(), 'getBK.php?id_dm=25&id_kb=27&action=ask');
});

test('getIdDm', function() {
    var config = new Config();
    config.setParams({id_dm: '25'});

    strictEqual(config.getIdDm(), 25);
});