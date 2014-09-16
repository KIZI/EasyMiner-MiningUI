
module('Connective');

test('serialize', function () {
	var connective1 = new Connective(1, 'Conjunction');
	var connective2 = new Connective(2, 'Disjunction');
	
	deepEqual(connective1.serialize(), {name: 'AND', type: 'and'});
	deepEqual(connective2.serialize(), {name: 'OR', type: 'or'});
});

test('toString', function () {
	var connective1 = new Connective(1, 'Conjunction');
	var connective2 = new Connective(2, 'Disjunction');
	
	deepEqual(connective1.toString().stripTags(), 'and');
	deepEqual(connective2.toString().stripTags(), 'or');
});