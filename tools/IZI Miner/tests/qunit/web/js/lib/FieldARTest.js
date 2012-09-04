module('FieldAR', {});

test('getCSSRemoveID', function () {
	var field = new FieldAR(1, new Attribute(), null, new StringHelper(), 'Subset', 1, 2);
	
	strictEqual(field.getCSSRemoveID(), 'remove-field-1');
});

test('serialize - One category', function() {
    var field = new FieldAR(null, new Attribute('Age'), 'One category', null, 'good');
    var serialized = {
        name: 'Age',
        category: 'One category',
        fields: [
            {name: 'category', value: 'good'}
        ],
        sign: 'positive'
    };

    deepEqual(field.serialize(), serialized);
});

test('serialize - Subset *', function() {
    var field = new FieldAR(1, new Attribute('District'), 'Subset', null, 1, 1);
    var serialized = {
        name: "District",
        category: "Subset",
        fields :[
            {name: "minLength", value: 1},
            {name: "maxLength", value: 1}
        ],
        sign: 'positive'};

    deepEqual(field.serialize(), serialized);
});

test('serialize - Subset 1-2', function() {
    var field = new FieldAR(1, new Attribute('District'), 'Subset', null, 1, 2);
    var serialized = {
        name: "District",
        category: "Subset",
        fields :[
            {name: "minLength", value: 1},
            {name: "maxLength", value: 2}
        ],
        sign: 'positive'}

    deepEqual(field.serialize(), serialized);
});

test('serialize - negation', function() {
    var field = new FieldAR(null, new Attribute('Age'), 'One category', null, 'good');
    field.changeSign(); // to negative
    var serialized = {
        'category': 'One category',
        'fields': [
            {
                'name': 'category',
                'value': 'good'
            }
        ],
        'name': 'Age',
        sign: 'negative'
    };

    deepEqual(field.serialize(), serialized);
});