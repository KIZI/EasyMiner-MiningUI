
module('FieldGroup');

test('Instantiation', function () {
	var fieldGroup = new FieldGroup(1, 'Root', 'Root', 'Root attribute group.', [2, 3], 'Conjunction', true);
	
	equal(fieldGroup.getId(), 1);
	equal(fieldGroup.getName(), 'Root');
	equal(fieldGroup.getLocalizedName(), 'Root');
	equal(fieldGroup.getExplanation(), 'Root attribute group.');
	deepEqual(fieldGroup.getFields(), {});
	deepEqual(fieldGroup.getChildGroups(), [2, 3]);
	equal(fieldGroup.getConnective(), 'Conjunction');
	equal(fieldGroup.getIsRoot(), true);
});

test('addField', function () {
	var fieldGroup = new FieldGroup();
	var field = new Field();
	fieldGroup.addField('key', field);
	
	deepEqual(fieldGroup.getField('key'), field);
});

test('getField', function () {
	var fieldGroup = new FieldGroup();
	
	equal(fieldGroup.getField('invalidKey'), null);
});

test('getLocalizedName 1', function () {
	var fieldGroup = new FieldGroup(null, 'Root', 'Localized root');
	
	equal(fieldGroup.getLocalizedName(), 'Localized root');
});

test('getLocalizedName 2', function () {
	var fieldGroup = new FieldGroup(null, 'Root');
	
	equal(fieldGroup.getLocalizedName(), 'Root');
});
