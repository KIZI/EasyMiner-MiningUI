
module('Attribute');

test('Instantiation', function () {
	var attribute = new Attribute('District', ['Praha', 'Brno'], null);
	
	equal(attribute.getName(), 'District');
	deepEqual(attribute.getChoices(), ['Praha', 'Brno']);
});

test('getNormalizedName', function () {
	var stringHelper = new StringHelper();
	var stringHelperMock = this.mock(stringHelper);
	stringHelperMock.expects('normalizeString').once();
	var attribute = new Attribute('District', [], stringHelper);
	
	attribute.getNormalizedName();
	ok(stringHelperMock.verify(), 'getNormalizedName success.');
});

test('getCSSID', function () {
	var attribute = new Attribute('District', [], new StringHelper());
	
	strictEqual(attribute.getCSSID(), 'attribute-nav-district');
});