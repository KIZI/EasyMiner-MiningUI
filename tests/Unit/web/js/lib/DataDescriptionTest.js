module('DataDescription', {});

test('parseRecordCount', function() {
    var DD = new DataDescription(1, new Storage());
    DD.parse({recordCount: 6135});

    strictEqual(DD.getRecordCount(), 6135);
});

test('calculateMinimalSupport', function() {
    var DD = new DataDescription(1, new Storage());
    DD.parse({recordCount: 6135});

    strictEqual(DD.calculateMinimalSupport(), 0.01);
});

test('parseAttributes', function () {
    var DD = new DataDescription(1, new Storage());
    DD.parse({transformationDictionary: {District: {}}});

    strictEqual(DD.getAttributes().length, 1);
});

test('parseFields', function () {
    var DD = new DataDescription(1, new Storage());
    DD.parse({dataDictionary: {orders: {}}});

    strictEqual(DD.getFields().length, 1);
});

test('removeAttribute', function() {
    var DD = new DataDescription(1, new Storage());
    DD.parse({transformationDictionary: {District: {}, Age: {}}});
    var attribute = DD.getAttributeByName('District');
    DD.removeAttribute(attribute);

    strictEqual(DD.getAttributes().length, 1);

    // clean up
    localStorage.removeItem('hiddenAttributes');
});

test('isPersisted 1', function() {
    var DD = new DataDescription(1, new Storage());
    localStorage.setItem('DD_1', JSON.stringify(DD));

    strictEqual(DD.isPersisted(1), true);

    // clean up
    localStorage.removeItem('DD_1');
});

test('isPersisted 2', function() {
    var DD = new DataDescription(1, new Storage());

    strictEqual(DD.isPersisted(1), false);
});

test('load', function() {
    var DD = new DataDescription(1, new Storage());
    DD.parse({transformationDictionary: {District: {}}, dataDictionary: {orders: {}}});
    localStorage.setItem('DD_1', JSON.stringify(DD));

    DD = new DataDescription(1, new Storage());
    DD.load();

    strictEqual(DD.getAttributes().length, 1);
    strictEqual(DD.getFields().length, 1);

    // clean up
    localStorage.removeItem('DD_1');
});

test('save', function() {
    var DD = new DataDescription(1, new Storage());
    DD.parse({transformationDictionary: {District: {}}, dataDictionary: {orders: {}}});
    DD.save();
    var obj = JSON.parse(localStorage.getItem('DD_1'));

    strictEqual(obj.$attributes.length, 1);
    strictEqual(obj.$fields.length, 1);

    // clean up
    localStorage.removeItem('DD_1');
});