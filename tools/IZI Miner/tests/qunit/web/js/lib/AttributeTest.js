
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
    var stringHelper = new StringHelper();
    var stringHelperMock = this.mock(stringHelper);
    stringHelperMock.expects('normalizeString').once().returns('district');
	var attribute = new Attribute('District', [], stringHelper);
	
	strictEqual(attribute.getCSSID(), 'attribute-nav-district');
    ok(stringHelperMock.verify(), 'stringHelper call success');
});

test('getCSSEditID', function () {
    var stringHelper = new StringHelper();
    var stringHelperMock = this.mock(stringHelper);
    stringHelperMock.expects('normalizeString').once().returns('district');;
    var attribute = new Attribute('District', [], stringHelper);

    strictEqual(attribute.getCSSEditID(), 'attribute-edit-district');
    ok(stringHelperMock.verify(), 'stringHelper call success');
});

test('getCSSRemoveID', function () {
    var stringHelper = new StringHelper();
    var stringHelperMock = this.mock(stringHelper);
    stringHelperMock.expects('normalizeString').once().returns('district');;
    var attribute = new Attribute('District', [], stringHelper);

    strictEqual(attribute.getCSSRemoveID(), 'attribute-remove-district');
    ok(stringHelperMock.verify(), 'stringHelper call success');
});

test('load', function() {
    var attribute = new Attribute();
    attribute.load({name: 'District', stringHelper: {}, value: 0});

    strictEqual(attribute.getName(), 'District');
    strictEqual(instanceOf(attribute.getStringHelper(), StringHelper), true);
    strictEqual(attribute.getValue(), 0);
});
