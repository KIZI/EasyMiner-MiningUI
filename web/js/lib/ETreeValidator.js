/**
 * Class ETreeValidator
 * @license http://www.apache.org/licenses/LICENSE-2.0 Apache License, Version 2.0
 * @link http://github.com/kizi/easyminer-miningui
 *
 * @type Class
 */
var ETreeValidator = new Class({
	
	rulePatterns: [],
	IMCombinations: [],
	
	initialize: function () {},
	
	isValid: function (rule) {
		var valid = true;
		
		// antecedent
		// TODO everything is possible, should be evaluated by some algorithm to be sure the setting is not too difficult
		// TODO valid = false
		
		// IM
		if (!rule.getNumIMs()) {
			valid = false;
		}
		/*
		else {
			var IM = rule.getFirstIM();
			var lcname = IM.getName().toLowerCase();
			if (!lcname.contains('chi')) {
				valid = false;
			}
		}*/

		// succedent
		var succedentNumLiterals = rule.getSuccedent().getNumFields();
		if (succedentNumLiterals !== 1) {
			valid = false;
		}
		
		return valid;
	}
	
});