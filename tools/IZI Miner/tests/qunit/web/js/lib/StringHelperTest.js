module('StringHelper', {});

test('normalizedString', function () {
	var stringHelper = new StringHelper();
	var tests = [[' abcdef', 'abcdef'],
	             ['abc def', 'abc-def'],
	             ['abc  def', 'abc-def'],
	             ['abc def ghi', 'abc-def-ghi'],
	             ['abc - def', 'abc-def'],
	             ['áäďěëščřžýáíňóöéťüůú', 'aadeescrzyainooetuuu'],
	             ['A', 'a'],
	             ['~!@#$%^&*()_+={}[]:"|;\\\'?.<,>/', ''],
                 ['a ', 'a-']];
	
	Object.each(tests, function(test) {
		strictEqual(stringHelper.normalizeString(test[0]), test[1]);
	});
});

test('getId', function () {
	var stringHelper = new StringHelper();
	var string = 'marked-rule-1';
	var id = 1;
	
	strictEqual(stringHelper.getId(string), id);
});