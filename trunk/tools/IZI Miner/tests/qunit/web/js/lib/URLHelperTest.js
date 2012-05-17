
module('URLHelper');

test('getURL', function () {
	var URLHelperObj = new URLHelper();
	
	var URL = URLHelperObj.getURL();
	notStrictEqual(URL, '');
});

test('getURLParams', function () {
	var URLHelperObj = new URLHelper();
	var URL1 = 'localhost/arbuilder/web/getData.php?param1=x&param2=y';
	var URL2 = 'localhost/arbuilder/web/getData.php';
	
	strictEqual(URLHelperObj.getURLParams(URL1), 'param1=x&param2=y');
	strictEqual(URLHelperObj.getURLParams(URL2), null);
});

test('getImagePath', function () {
	var URLHelperObj = new URLHelper();
	var image = 'icon-remove.png';
	var path = '/arbuilder/web/images/icon-remove.png';
	
	strictEqual(URLHelperObj.getImagePath(image), path);
});