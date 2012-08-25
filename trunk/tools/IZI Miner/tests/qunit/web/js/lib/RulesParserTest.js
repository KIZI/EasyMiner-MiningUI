module('RulesParser');

test('findOutterBrackets', function () {
	var rulesParser = new RulesParser(new Element('body')); // ugly hack
	var cedent1 = [];
	var cedent2 = [{"name": "District", "type": "attr"}, {"name": "OR", "type": "or"}, {"name":"Salary", "type":"attr"}];
	var cedent3 = [{"name": "(", "type": "lbrac"}, {"name": "District", "type": "attr"}, {"name": "OR", "type": "or"}, {"name":"Salary", "type":"attr"}, {"name": ")", "type": "rbrac"}];
	
	deepEqual(rulesParser.findOutterBrackets(cedent1), []);
	deepEqual(rulesParser.findOutterBrackets(cedent2), []);
	deepEqual(rulesParser.findOutterBrackets(cedent3), [{start: 0, end: 4}]);
});

test('mergeIntervals', function () {
	var rulesParser = new RulesParser(new Element('body')); // ugly hack
	var intervals1 = [];
	var intervals2 = [{start: 0, end: 2}];
	var intervals3 = [{start: 1, end: 3}, {start: 5, end: 5}];
	
	deepEqual(rulesParser.mergeIntervals(intervals1), []);
	deepEqual(rulesParser.mergeIntervals(intervals2), [0, 1, 2]);
	deepEqual(rulesParser.mergeIntervals(intervals3), [1, 2, 3, 5]);
});

test('findBooleans', function () {
	var rulesParser = new RulesParser(new Element('body')); // ugly hack
	var cedent1 = [];
	var cedent2 = [{"name": "District", "type": "attr"}, {"name": "OR", "type": "or"}, {"name":"Salary", "type":"attr"}];
	var cedent3 = [{"name": "District", "type": "attr"}, {"name": "OR", "type": "or"}, {"name":"Salary", "type":"attr"}, {"name": "AND", "type": "and"}, {"name": "OR", "type": "or"}, {"name": "NEG", "type": "neg"}];
	var bracketsInterval = [0, 1, 2];
	
	deepEqual(rulesParser.findBooleans(cedent1, bracketsInterval), []);
	deepEqual(rulesParser.findBooleans(cedent2, bracketsInterval), []);
	deepEqual(rulesParser.findBooleans(cedent3, bracketsInterval), [undefined, undefined, undefined, {"name": "AND", "type": "and"}, {"name": "OR", "type": "or"}, {"name": "NEG", "type": "neg"}]);
});

test('findAttributes', function () {
	var rulesParser = new RulesParser(new Element('body')); // ugly hack
	var cedent1 = [];
	var cedent2 = [{"name": "District", "type": "attr"}, {"name": "OR", "type": "or"}, {"name":"Salary", "type":"attr"}];
	var cedent3 = [{"name": "District", "type": "attr"}, {"name": "OR", "type": "or"}, {"name":"Salary", "type":"attr"}, {"name": "District", "type": "attr"}, {"name":"Salary", "type":"attr"}];
	var bracketsInterval = [0, 1, 2];
	
	deepEqual(rulesParser.findAttributes(cedent1, bracketsInterval), []);
	deepEqual(rulesParser.findAttributes(cedent2, bracketsInterval), []);
	deepEqual(rulesParser.findAttributes(cedent3, bracketsInterval), [undefined, undefined, undefined, {"name": "District", "type": "attr"}, {"name":"Salary", "type":"attr"}]);
});
