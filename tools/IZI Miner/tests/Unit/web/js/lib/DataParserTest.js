module('DataParser', {});

test('getDD', function () {
	var config = new Config();
    var settings = new Settings();
	config.setDataGetURL('/izi-miner/web/getData.php');
    config.setParams({id_dm: 'TEST'});
	var dataParser = new DataParser(config, settings, false);
	dataParser.getData();

	strictEqual(instanceOf(dataParser.getDD(), DataDescription), true);
    strictEqual(dataParser.getDD().getAttributes().length, 8);
    strictEqual(dataParser.getDD().getFields().length, 10);
});

test('getFLs', function () {
	var config = new Config();
    var settings = new Settings();
	config.setDataGetURL('/izi-miner/web/getData.php');
    config.setParams({id_dm: 'TEST'});
	var dataParser = new DataParser(config, settings, false);
	dataParser.getData();
	
	strictEqual(dataParser.getFLs().length, 2);
});

test('getFGC', function () {
	var config = new Config();
    var settings = new Settings();
    config.setDataGetURL('/izi-miner/web/getData.php');
    config.setParams({id_dm: 'TEST'});
	var dataParser = new DataParser(config, settings, false);
	dataParser.getData();

    strictEqual(instanceOf(dataParser.getFGC(), FieldGroupConfig), true);
	strictEqual(dataParser.getFGC().getFieldGroupRootConfigID(), 1);
});