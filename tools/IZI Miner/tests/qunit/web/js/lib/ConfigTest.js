module('Config', {});

test('getDataGetURL', function () {
    var config = new Config();
    config.setLang('en');
    config.setParams({id_dm: '102'});
    config.setDataGetURL('getData.php');

    strictEqual(config.getDataGetURL(), 'getData.php?id_dm=102&lang=en');
});

test('getRulesGetURL', function () {
	var config = new Config();
    config.setLang('en');
    config.setParams({id_dm: '102'});
    config.setRulesGetURL('getRules.php');
	
	strictEqual(config.getRulesGetURL(), 'getRules.php?id_dm=102&lang=en');
});

test('getRulesGetURL with timeout', function () {
	var config = new Config();
    config.setLang('en');
    config.setParams({id_dm: '102', sleep: '5'});
    config.setRulesGetURL('getRules.php');

	strictEqual(config.getRulesGetURL(), 'getRules.php?id_dm=102&sleep=5&lang=en');
});

test('getBKAskURL', function () {
    var config = new Config();
    config.setLang('en');
    config.setParams({id_dm: '102', id_kb: '27'});
    config.setBKGetURL('getBK.php');

    strictEqual(config.getBKAskURL(), 'getBK.php?id_dm=102&id_kb=27&action=ask&lang=en');
});

test('getIdDm', function() {
    var config = new Config();
    config.setParams({id_dm: '25'});

    strictEqual(config.getIdDm(), '25');
});

test('getAddAttributeURL', function() {
    var config = new Config();
    config.setLang('en');
    config.setParams({id_dm: '100'});
    config.setJoomlaURL('http://sewebar.lmcloud.vse.cz/');

    strictEqual(config.getAddAttributeURL('Age'), 'http://sewebar.lmcloud.vse.cz/index.php?option=com_dbconnect&controller=izi&task=newAttribute&col=Age&kbi=100&lang=en');
});

test('getAddAttributeURL 2', function() {
    var config = new Config();
    config.setLang('en');
    config.setParams({id_dm: '100'});
    config.setJoomlaURL('http://sewebar.lmcloud.vse.cz/');

    strictEqual(config.getAddAttributeURL('Age '), 'http://sewebar.lmcloud.vse.cz/index.php?option=com_dbconnect&controller=izi&task=newAttribute&col=Age%20&kbi=100&lang=en');
});

test('getEditAttributeURL', function() {
    var config = new Config();
    config.setLang('en');
    config.setParams({id_dm: '100'});
    config.setJoomlaURL('http://sewebar.lmcloud.vse.cz/');

    strictEqual(config.getEditAttributeURL('Quality'), 'http://sewebar.lmcloud.vse.cz/index.php?option=com_dbconnect&controller=izi&task=editAttribute&attribute=Quality&kbi=100&lang=en');
});

test('getEditAttributeURL 2', function() {
    var config = new Config();
    config.setLang('en');
    config.setParams({id_dm: '100'});
    config.setJoomlaURL('http://sewebar.lmcloud.vse.cz/');

    strictEqual(config.getEditAttributeURL('Quality '), 'http://sewebar.lmcloud.vse.cz/index.php?option=com_dbconnect&controller=izi&task=editAttribute&attribute=Quality%20&kbi=100&lang=en');
});

test('getNewTaskURL', function() {
    var config = new Config();
    config.setJoomlaURL('http://sewebar.lmcloud.vse.cz/');

    strictEqual(config.getNewTaskURL(), 'http://sewebar.lmcloud.vse.cz/index.php?option=com_dbconnect&controller=izi&task=newDataSource&tmpl=component');
});

test('getStopMiningUrl', function() {
    var config = new Config();
    config.setLang('en');
    config.setParams({id_dm: '102'});
    config.setStopMiningUrl('stopMining.php');

    strictEqual(config.getStopMiningUrl(), 'stopMining.php?id_dm=102&lang=en');
});