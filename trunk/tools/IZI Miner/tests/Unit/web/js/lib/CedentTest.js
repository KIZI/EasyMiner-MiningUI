
module('Cedent', {});

test('isEmpty - yes', function () {
	var cedent = new Cedent(null, null, null, []);
	
	strictEqual(cedent.isEmpty(), true);
});

test('isEmpty - no', function () {
	var cedent = new Cedent(null, null, null, [new FieldAR()]);
	
	strictEqual(cedent.isEmpty(), false);
});

test('isEmpty - no', function () {
	var cedent = new Cedent(null, null, null, [new Cedent()]);
	
	strictEqual(cedent.isEmpty(), false);
});

test('isEmpty - no', function () {
    var cedent = new Cedent(null, null, null, [new FieldAR(), new Cedent()]);

    strictEqual(cedent.isEmpty(), false);
});

test('getCSSID', function () {
	var cedent = new Cedent(1);
	
	strictEqual(cedent.getCSSID(), 'cedent-1');
});

test('getCSSEditConnectiveID', function () {
	var cedent = new Cedent(1);
	
	strictEqual(cedent.getCSSEditConnectiveID(), 'edit-connective-1');
});

test('getCSSAddCedentID', function () {
	var cedent = new Cedent(1);
	
	strictEqual(cedent.getCSSAddCedentID(), 'add-cedent-1');
});

test('getCSSRemoveID', function () {
	var cedent = new Cedent(1);
	
	strictEqual(cedent.getCSSRemoveID(), 'remove-cedent-1');
});

test('getCSSFieldsID', function () {
	var cedent = new Cedent(1);
	
	strictEqual(cedent.getCSSFieldsID(), 'cedent-fields-1');
});

test('getCSSChangeSignID', function () {
	var cedent = new Cedent(1);
	
	strictEqual(cedent.getCSSChangeSignID(), 'change-cedent-sign-1');
});

test('getNextLevel', function () {
	var cedent = new Cedent(null, 1);
	
	strictEqual(cedent.getNextLevel(), 2);
});

test('addChild', function() {
    var cedent = new Cedent();
    cedent.addChild(new FieldAR());

    strictEqual(cedent.isEmpty(), false);
});

test('removeChild 1', function() {
    var cedent = new Cedent();
    var field = new FieldAR();
    cedent.addChild(field);
    cedent.removeChild(field);

    strictEqual(cedent.isEmpty(), true);
});

test('removeChild 2', function() {
    var cedent = new Cedent(null, 1);
    var cedent2 = new Cedent(null, 2);
    var child1 = new FieldAR();
    cedent.addChild(child1);
    var child2 = new FieldAR();
    cedent2.addChild(child2);
    var child3 = new FieldAR();
    cedent2.addChild(child3);
    cedent.addChild(cedent2);
    cedent.removeChild(child1);

    strictEqual(cedent.getNumChildCedents(), 0);
});

test('removeChild 3', function() {
    var cedent = new Cedent(null, 1, new Connective(null, 'Conjunction'));
    var cedent2 = new Cedent(null, 2, new Connective(null, 'Disjunction'));
    var child1 = new FieldAR();
    cedent.addChild(child1);
    var child2 = new FieldAR();
    cedent2.addChild(child2);
    var child3 = new FieldAR();
    cedent2.addChild(child3);
    cedent.addChild(cedent2);
    cedent.removeChild(child3);

    strictEqual(cedent.getConnective().getName(), 'Conjunction');
});

test('removeChild 4', function() {
    var cedent = new Cedent(null, 1, new Connective(null, 'Conjunction'));
    var cedent2 = new Cedent(null, 2, new Connective(null, 'Disjunction'));
    var child1 = new FieldAR();
    cedent.addChild(child1);
    var child2 = new FieldAR();
    cedent2.addChild(child2);
    var child3 = new FieldAR();
    cedent2.addChild(child3);
    cedent.addChild(cedent2);
    cedent.removeChild(child1);

    strictEqual(cedent.getConnective().getName(), 'Disjunction');
});

test('getNumChildren', function() {
    var cedent = new Cedent();
    cedent.addChild(new FieldAR());

    strictEqual(cedent.getNumChildren(), 1);
});

test('getNumChildCedents 1', function() {
    var cedent = new Cedent(null, 1);

    strictEqual(cedent.getNumChildCedents(), 0);
});

test('getNumChildCedents 1', function() {
    var cedent = new Cedent(null, 1);
    var cedent2 = new Cedent(null, 2);
    cedent.addChild(cedent2);

    strictEqual(cedent.getNumChildCedents(), 1);
});

test('getNumFields', function() {
    var cedent = new Cedent(null, 1);
    cedent.addChild(new FieldAR());
    var cedent2 = new Cedent(null, 2);
    cedent2.addChild(new FieldAR());
    cedent.addChild(cedent2);

    // max level undefined
    strictEqual(cedent.getNumFields(), 2);
    strictEqual(cedent2.getNumFields(), 1);

    // max level 1
    strictEqual(cedent.getNumFields(1), 1);
});

test('toString - empty', function() {
    var cedent = new Cedent();

    strictEqual(cedent.toString().stripTags(), 'Empty');
});

test('toString - two fields, level one', function() {
    var cedent = new Cedent(1, 1, new Connective(1, 'Conjunction'));
    cedent.addChild(new FieldAR(1, new Attribute('District')));
    cedent.addChild(new FieldAR(2, new Attribute('Quality')));

    strictEqual(cedent.toString().stripTags(), 'DistrictandQuality');
});

test('toString - two fields, level two', function() {
    var cedent = new Cedent(1, 2, new Connective(1, 'Conjunction'));
    cedent.addChild(new FieldAR(1, new Attribute('District')));
    cedent.addChild(new FieldAR(2, new Attribute('Quality')));

    strictEqual(cedent.toString().stripTags(), '(DistrictandQuality)');
});

test('toString - 1x level one, 2x level two', function() {
    var cedent = new Cedent(1, 1, new Connective(1, 'Conjunction'));
    cedent.addChild(new FieldAR(1, new Attribute('District')));
    var cedent2 = new Cedent(2, 2, new Connective(2, 'Disjunction'));
    cedent2.addChild(new FieldAR(2, new Attribute('Quality')));
    cedent2.addChild(new FieldAR(3, new Attribute('Sex')));
    cedent.addChild(cedent2);

    strictEqual(cedent.toString().stripTags(), 'Districtand(QualityorSex)');
});

test('toString - 2x level one, 2x level two', function() {
    var cedent = new Cedent(1, 1, new Connective(1, 'Conjunction'));
    cedent.addChild(new FieldAR(1, new Attribute('District')));
    cedent.addChild(new FieldAR(2, new Attribute('Quality')));
    var cedent2 = new Cedent(2, 2, new Connective(1, 'Disjunction'));
    cedent2.addChild(new FieldAR(3, new Attribute('Sex')));
    cedent2.addChild(new FieldAR(4, new Attribute('Age')));
    cedent.addChild(cedent2);

    strictEqual(cedent.toString().stripTags(), 'DistrictandQualityand(SexorAge)');
});

test('toString - 1x level one, 4x level two', function() {
    var cedent = new Cedent(1, 1, new Connective(1, 'Disjunction'));
    var cedent2 = new Cedent(2, 2, new Connective(2, 'Conjunction'));
    cedent2.addChild(new FieldAR(1, new Attribute('District')));
    cedent2.addChild(new FieldAR(2, new Attribute('Quality')));
    cedent.addChild(cedent2);
    cedent.addChild(new FieldAR(3, new Attribute('Sex')));
    var cedent3 = new Cedent(3, 2, new Connective(3, 'Conjunction'));
    cedent3.addChild(new FieldAR(4, new Attribute('Age')));
    cedent3.addChild(new FieldAR(5, new Attribute('Salary')));
    cedent.addChild(cedent3);

    strictEqual(cedent.toString().stripTags(), '(DistrictandQuality)orSexor(AgeandSalary)');
});

test('hasBracket - test 1', function() {
    var cedent = new Cedent(1, 1, new Connective(1, 'Conjunction'));
    cedent.addChild(new FieldAR(1, new Attribute('District')));
    cedent.addChild(new FieldAR(2, new Attribute('Quality')));
    cedent.addChild(new FieldAR(3, new Attribute('Sex')));

    // level 1
    strictEqual(cedent.hasOpeningBracket(1, 1), false);
    strictEqual(cedent.hasClosingBracket(1, 1), false);
    strictEqual(cedent.hasOpeningBracket(2, 1), false);
    strictEqual(cedent.hasClosingBracket(2, 1), false);
    strictEqual(cedent.hasOpeningBracket(3, 1), false);
    strictEqual(cedent.hasClosingBracket(3, 1), false);

    // level 2
    strictEqual(cedent.hasOpeningBracket(1, 1), false);
    strictEqual(cedent.hasClosingBracket(1, 1), false);
    strictEqual(cedent.hasOpeningBracket(2, 1), false);
    strictEqual(cedent.hasClosingBracket(2, 1), false);
    strictEqual(cedent.hasOpeningBracket(3, 1), false);
    strictEqual(cedent.hasClosingBracket(3, 1), false);
});

test('hasBracket - test 2', function() {
    var cedent = new Cedent(1, 2, new Connective(1, 'Conjunction'));
    cedent.addChild(new FieldAR(1, new Attribute('District')));
    cedent.addChild(new FieldAR(2, new Attribute('Quality')));
    cedent.addChild(new FieldAR(3, new Attribute('Sex')));

    // level 1
    strictEqual(cedent.hasOpeningBracket(1, 1), false);
    strictEqual(cedent.hasClosingBracket(1, 1), false);
    strictEqual(cedent.hasOpeningBracket(2, 1), false);
    strictEqual(cedent.hasClosingBracket(2, 1), false);
    strictEqual(cedent.hasOpeningBracket(3, 1), false);
    strictEqual(cedent.hasClosingBracket(3, 1), false);

    // level 2
    strictEqual(cedent.hasOpeningBracket(1, 2), true);
    strictEqual(cedent.hasClosingBracket(1, 2), false);
    strictEqual(cedent.hasOpeningBracket(2, 2), false);
    strictEqual(cedent.hasClosingBracket(2, 2), false);
    strictEqual(cedent.hasOpeningBracket(3, 2), false);
    strictEqual(cedent.hasClosingBracket(3, 2), true);
});

test('hasBracket - test 3', function() {
    var cedent = new Cedent(1, 1, new Connective(1, 'Conjunction'));
    cedent.addChild(new FieldAR(1, new Attribute('District')));
    var cedent2 = new Cedent(2, 2, new Connective(1, 'Disjunction'));
    cedent2.addChild(new FieldAR(2, new Attribute('Quality')));
    cedent2.addChild(new FieldAR(3, new Attribute('Sex')));
    cedent.addChild(cedent2);

    // level 1
    strictEqual(cedent.hasOpeningBracket(1, 1), false);
    strictEqual(cedent.hasClosingBracket(1, 1), false);
    strictEqual(cedent.hasOpeningBracket(2, 1), false);
    strictEqual(cedent.hasClosingBracket(2, 1), false);
    strictEqual(cedent.hasOpeningBracket(3, 1), false);
    strictEqual(cedent.hasClosingBracket(3, 1), false);

    // level 2
    strictEqual(cedent.hasOpeningBracket(1, 2), false);
    strictEqual(cedent.hasClosingBracket(1, 2), false);
    strictEqual(cedent.hasOpeningBracket(2, 2), true);
    strictEqual(cedent.hasClosingBracket(2, 2), false);
    strictEqual(cedent.hasOpeningBracket(3, 2), false);
    strictEqual(cedent.hasClosingBracket(3, 2), true);
});

test('toString - test 4', function() {
    var cedent = new Cedent(1, 1, new Connective(1, 'Conjunction'));
    cedent.addChild(new FieldAR(1, new Attribute('District')));
    cedent.addChild(new FieldAR(2, new Attribute('Quality')));
    var cedent2 = new Cedent(2, 2, new Connective(1, 'Disjunction'));
    cedent2.addChild(new FieldAR(3, new Attribute('Sex')));
    cedent2.addChild(new FieldAR(4, new Attribute('Age')));
    cedent.addChild(cedent2);

    // level 1
    strictEqual(cedent.hasOpeningBracket(1, 1), false);
    strictEqual(cedent.hasClosingBracket(1, 1), false);
    strictEqual(cedent.hasOpeningBracket(2, 1), false);
    strictEqual(cedent.hasClosingBracket(2, 1), false);
    strictEqual(cedent.hasOpeningBracket(3, 1), false);
    strictEqual(cedent.hasClosingBracket(3, 1), false);
    strictEqual(cedent.hasOpeningBracket(4, 1), false);
    strictEqual(cedent.hasClosingBracket(4, 1), false);

    // level 2
    strictEqual(cedent.hasOpeningBracket(1, 2), false);
    strictEqual(cedent.hasClosingBracket(1, 2), false);
    strictEqual(cedent.hasOpeningBracket(2, 2), false);
    strictEqual(cedent.hasClosingBracket(2, 2), false);
    strictEqual(cedent.hasOpeningBracket(3, 2), true);
    strictEqual(cedent.hasClosingBracket(3, 2), false);
    strictEqual(cedent.hasOpeningBracket(4, 2), false);
    strictEqual(cedent.hasClosingBracket(4, 2), true);
});

test('toString - test 5', function() {
    var cedent = new Cedent(1, 1, new Connective(1, 'Conjunction'));
    var cedent2 = new Cedent(2, 2, new Connective(1, 'Disjunction'));
    cedent2.addChild(new FieldAR(1, new Attribute('District')));
    cedent2.addChild(new FieldAR(2, new Attribute('Quality')));
    cedent.addChild(cedent2);
    cedent.addChild(new FieldAR(3, new Attribute('Sex')));
    var cedent3 = new Cedent(3, 2, new Connective(1, 'Disjunction'));
    cedent3.addChild(new FieldAR(4, new Attribute('Age')));
    cedent3.addChild(new FieldAR(5, new Attribute('Salary')));
    cedent.addChild(cedent3);

    // level 1
    strictEqual(cedent.hasOpeningBracket(1, 1), false);
    strictEqual(cedent.hasClosingBracket(1, 1), false);
    strictEqual(cedent.hasOpeningBracket(2, 1), false);
    strictEqual(cedent.hasClosingBracket(2, 1), false);
    strictEqual(cedent.hasOpeningBracket(3, 1), false);
    strictEqual(cedent.hasClosingBracket(3, 1), false);
    strictEqual(cedent.hasOpeningBracket(4, 1), false);
    strictEqual(cedent.hasClosingBracket(4, 1), false);
    strictEqual(cedent.hasOpeningBracket(5, 1), false);
    strictEqual(cedent.hasClosingBracket(5, 1), false);

    // level 2
    strictEqual(cedent.hasOpeningBracket(1, 2), true);
    strictEqual(cedent.hasClosingBracket(1, 2), false);
    strictEqual(cedent.hasOpeningBracket(2, 2), false);
    strictEqual(cedent.hasClosingBracket(2, 2), true);
    strictEqual(cedent.hasOpeningBracket(3, 2), false);
    strictEqual(cedent.hasClosingBracket(3, 2), false);
    strictEqual(cedent.hasOpeningBracket(4, 2), true);
    strictEqual(cedent.hasClosingBracket(4, 2), false);
    strictEqual(cedent.hasOpeningBracket(5, 2), false);
    strictEqual(cedent.hasClosingBracket(5, 2), true);
});

test('isAttributeUsed - no', function() {
    var attribute = new Attribute('District');
    var attribute2 = new Attribute('Quality');
    var cedent = new Cedent();
    cedent.addChild(new FieldAR(null, attribute2));

    strictEqual(cedent.isAttributeUsed(attribute), false);
});

test('isAttributeUsed - yes', function() {
    var attribute = new Attribute('District');
    var cedent = new Cedent();
    cedent.addChild(new FieldAR(null, attribute));

    strictEqual(cedent.isAttributeUsed(attribute), true);
});

test('isAttributeUsed - yes', function() {
    var attribute = new Attribute('District');
    var cedent = new Cedent();
    var cedent2 = new Cedent();
    cedent2.addChild(new FieldAR(null, attribute));
    cedent.addChild(cedent2);

    strictEqual(cedent.isAttributeUsed(attribute), true);
});

test('update', function() {
    var cedent = new Cedent();
    var cedent2 = new Cedent();
    cedent2.addChild(new FieldAR());
    cedent2.addChild(new FieldAR());
    cedent.addChild(cedent2);
    cedent.update();

    strictEqual(cedent.getNumChildren(), 2);
});

test('groupChildren - two fields at the beginning', function() {
    var cedent = new Cedent(1, 1);
    var cedent2 = new Cedent(1, 2);
    var child1 = new FieldAR();
    child1.mark();
    cedent.addChild(child1);
    var child2 = new FieldAR();
    cedent.addChild(child2);
    child2.mark();
    var child3 = new FieldAR();
    cedent.addChild(child3);
    cedent.groupChildren(cedent2);

    strictEqual(instanceOf(cedent.getChildren()[0], Cedent), true);
    strictEqual(instanceOf(cedent.getChildren()[1], FieldAR), true);
    strictEqual(cedent.getNumFields(1), 1);
    strictEqual(cedent2.getNumFields(), 2);
});

test('groupChildren - two fields at the end', function() {
    var cedent = new Cedent(1, 1);
    var cedent2 = new Cedent(1, 2);
    var child1 = new FieldAR();
    cedent.addChild(child1);
    var child2 = new FieldAR();
    cedent.addChild(child2);
    child2.mark();
    var child3 = new FieldAR();
    child3.mark();
    cedent.addChild(child3);
    cedent.groupChildren(cedent2);

    strictEqual(instanceOf(cedent.getChildren()[0], FieldAR), true);
    strictEqual(instanceOf(cedent.getChildren()[1], Cedent), true);
    strictEqual(cedent.getNumFields(1), 1);
    strictEqual(cedent2.getNumFields(), 2);
});

test('groupChildren - two fields in the middle', function() {
    var cedent = new Cedent(1, 1);
    var cedent2 = new Cedent(1, 2);
    var child1 = new FieldAR();
    cedent.addChild(child1);
    var child2 = new FieldAR();
    cedent.addChild(child2);
    child2.mark();
    var child3 = new FieldAR();
    child3.mark();
    cedent.addChild(child3);
    var child4 = new FieldAR();
    cedent.addChild(child4);
    cedent.groupChildren(cedent2);

    strictEqual(instanceOf(cedent.getChildren()[0], FieldAR), true);
    strictEqual(instanceOf(cedent.getChildren()[1], Cedent), true);
    strictEqual(instanceOf(cedent.getChildren()[2], FieldAR), true);
    strictEqual(cedent.getNumFields(1), 2);
    strictEqual(cedent2.getNumFields(), 2);
});

test('groupChildren - one field in the middle and one field at the end', function() {
    var cedent = new Cedent(1, 1);
    var cedent2 = new Cedent(1, 2);
    var child1 = new FieldAR();
    cedent.addChild(child1);
    var child2 = new FieldAR();
    cedent.addChild(child2);
    child2.mark();
    var child3 = new FieldAR();
    cedent.addChild(child3);
    var child4 = new FieldAR();
    child4.mark();
    cedent.addChild(child4);
    cedent.groupChildren(cedent2);

    strictEqual(instanceOf(cedent.getChildren()[0], FieldAR), true);
    strictEqual(instanceOf(cedent.getChildren()[1], Cedent), true);
    strictEqual(instanceOf(cedent.getChildren()[2], FieldAR), true);
    strictEqual(cedent.getNumFields(1), 2);
    strictEqual(cedent2.getNumFields(), 2);
});

test('groupChildren - 3 children at the beginning', function() {
    var cedent = new Cedent(1, 1);
    var child1 = new FieldAR();
    child1.mark();
    cedent.addChild(child1);
    var child2 = new FieldAR();
    cedent.addChild(child2);
    child2.mark();
    var child3 = new FieldAR();
    child3.mark();
    cedent.addChild(child3);
    var child4 = new FieldAR();
    cedent.addChild(child4);

    var cedent2 = new Cedent(1, 2);
    cedent.groupChildren(cedent2);

    strictEqual(instanceOf(cedent.getChildren()[0], Cedent), true);
    strictEqual(instanceOf(cedent.getChildren()[1], FieldAR), true);
    strictEqual(cedent.getNumFields(1), 1);
    strictEqual(cedent2.getNumFields(), 3);
});

test('groupChildren - 3 children in the middle', function() {
    var cedent = new Cedent(1, 1);
    var child1 = new FieldAR();
    cedent.addChild(child1);
    var child2 = new FieldAR();
    cedent.addChild(child2);
    child2.mark();
    var child3 = new FieldAR();
    child3.mark();
    cedent.addChild(child3);
    var child4 = new FieldAR();
    child4.mark();
    cedent.addChild(child4);
    var child5 = new FieldAR();
    cedent.addChild(child5);

    var cedent2 = new Cedent(1, 2);
    cedent.groupChildren(cedent2);

    strictEqual(instanceOf(cedent.getChildren()[0], FieldAR), true);
    strictEqual(instanceOf(cedent.getChildren()[1], Cedent), true);
    strictEqual(instanceOf(cedent.getChildren()[2], FieldAR), true);
    strictEqual(cedent.getNumFields(1), 2);
    strictEqual(cedent2.getNumFields(), 3);
});

test('groupChildren - 3 children at the end', function() {
    var cedent = new Cedent(1, 1);
    var child1 = new FieldAR();
    cedent.addChild(child1);
    var child2 = new FieldAR();
    cedent.addChild(child2);
    child2.mark();
    var child3 = new FieldAR();
    child3.mark();
    cedent.addChild(child3);
    var child4 = new FieldAR();
    child4.mark();
    cedent.addChild(child4);

    var cedent2 = new Cedent(1, 2);
    cedent.groupChildren(cedent2);

    strictEqual(instanceOf(cedent.getChildren()[0], FieldAR), true);
    strictEqual(instanceOf(cedent.getChildren()[1], Cedent), true);
    strictEqual(cedent.getNumFields(1), 1);
    strictEqual(cedent2.getNumFields(), 3);
});

test('toSettings 1', function() {
    var cedent = new Cedent(null, 1, new Connective(null, 'Conjunction'), []);
    var settings = {1: {Conjunction: true}};

    deepEqual(cedent.toSettings(), settings);
});

test('toSettings 2', function() {
    var cedent = new Cedent(null, 1, new Connective(null, 'Disjunction'), []);
    var settings = {1: {Disjunction: true}};

    deepEqual(cedent.toSettings(), settings);
});

test('toSettings 3', function() {
    var cedent = new Cedent(null, 1, new Connective(null, 'Conjunction'), []);
    var cedent2 = new Cedent(null, 2, new Connective(null, 'Disjunction'), []);
    cedent.addChild(cedent2);
    var settings = {1: {Conjunction: true}, 2: {Disjunction: true}};

    deepEqual(cedent.toSettings(), settings);
});

test('serialize - empty children', function() {
    var cedent = new Cedent(null, 1, new Connective(null, 'Conjunction'), []);
    var serialized = cedent.serialize();

    strictEqual(serialized.type, 'cedent');
    strictEqual(instanceOf(serialized.connective, Object), true);
    strictEqual(serialized.level, 1);
    strictEqual(serialized.children.length, 0);
});

test('serialize - children', function() {
    var cedent = new Cedent(null, 1, new Connective(null, 'Conjunction'), [new FieldAR(null, new Attribute('Age'), 'One category', null, null, 'low'), new Cedent(null, 1, new Connective(null, 'Conjunction'), [])]);
    var serialized = cedent.serialize();

    strictEqual(serialized.children.length, 2);
});
