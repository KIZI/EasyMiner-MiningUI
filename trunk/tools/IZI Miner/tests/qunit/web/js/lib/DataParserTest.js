
module('DataParser');

test('getDD', function () {
	var config = new Config();
	config.setDataGetURL('/arbuilder/web/getData.php');
	var dataParser = new DataParser(config);
	dataParser.getData();
	
	strictEqual(dataParser.getDD().countAttributes(), 8);
});

test('getFLs', function () {
	var config = new Config();
	config.setDataGetURL('/arbuilder/web/getData.php');
	var dataParser = new DataParser(config);
	dataParser.getData();
	
	strictEqual(dataParser.getFLs().length, 2);
});

test('getFGC', function () {
	var config = new Config();
	config.setDataGetURL('/arbuilder/web/getData.php');
	var dataParser = new DataParser(config);
	dataParser.getData();
	
	strictEqual(dataParser.getFGC().getFieldGroupRootConfigID(), 1);
});