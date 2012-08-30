module('Config', {});

test('getDataGetURL', function () {
    var ConfigObj = new Config();
    ConfigObj.setParams({id_dm: '100'});
    ConfigObj.setDataGetURL('getData.php');

    strictEqual(ConfigObj.getDataGetURL(), 'getData.php?id_dm=100&lang=en');
});

test('getRulesGetURL', function () {
	var ConfigObj = new Config();
    ConfigObj.setParams({id_dm: '100', id_kb: '27'});
	ConfigObj.setRulesGetURL('getRules.php');
	
	strictEqual(ConfigObj.getRulesGetURL(), 'getRules.php?id_dm=100&lang=en');
});

test('getBKAskURL', function () {
    var ConfigObj = new Config();
    ConfigObj.setParams({id_dm: '100', id_kb: '27'});
    ConfigObj.setBKGetURL('getBK.php');

    strictEqual(ConfigObj.getBKAskURL(), 'getBK.php?id_dm=100&id_kb=27&action=ask');
});

test('getIdDm', function() {
    var config = new Config();
    config.setParams({id_dm: '25'});

    strictEqual(config.getIdDm(), 25);
});

test('getAddAttributeURL', function() {
    var config = new Config();
    config.setJoomlaURL('http://sewebar.lmcloud.vse.cz/');

    strictEqual(config.getAddAttributeURL('Age'), 'http://sewebar.lmcloud.vse.cz/index.php?option=com_dbconnect&controller=izi&task=newAttribute&col=Age');
});

test('getAddAttributeURL 2', function() {
    var config = new Config();
    config.setJoomlaURL('http://sewebar.lmcloud.vse.cz/');

    strictEqual(config.getAddAttributeURL('Age '), 'http://sewebar.lmcloud.vse.cz/index.php?option=com_dbconnect&controller=izi&task=newAttribute&col=Age%20');
});

test('getEditAttributeURL', function() {
    var config = new Config();
    config.setJoomlaURL('http://sewebar.lmcloud.vse.cz/');

    strictEqual(config.getEditAttributeURL('Quality'), 'http://sewebar.lmcloud.vse.cz/index.php?option=com_dbconnect&controller=izi&task=editAttribute&attribute=Quality');
});

test('getEditAttributeURL 2', function() {
    var config = new Config();
    config.setJoomlaURL('http://sewebar.lmcloud.vse.cz/');

    strictEqual(config.getEditAttributeURL('Quality '), 'http://sewebar.lmcloud.vse.cz/index.php?option=com_dbconnect&controller=izi&task=editAttribute&attribute=Quality%20');
});

test('getNewTaskURL', function() {
    var config = new Config();
    config.setJoomlaURL('http://sewebar.lmcloud.vse.cz/');

    strictEqual(config.getNewTaskURL(), 'http://sewebar.lmcloud.vse.cz/index.php?option=com_dbconnect&controller=izi&task=newIZITask');
});