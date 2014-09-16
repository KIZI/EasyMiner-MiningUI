
module('URLHelper');

test('getURL', function () {
	var URLHelperObj = new URLHelper();
	
	var URL = URLHelperObj.getURL();
	notStrictEqual(URL, '');
});

test('getImagePath', function () {
	var URLHelperObj = new URLHelper();
	var image = 'icon-remove.png';
	var path = '/izi-miner/web/images/icon-remove.png';
	
	strictEqual(URLHelperObj.getImagePath(image), path);
});