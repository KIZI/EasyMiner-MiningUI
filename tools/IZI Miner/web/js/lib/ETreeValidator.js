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
		var succedentNumLiterals = rule.getSuccedent().getNumLiterals();
		if (succedentNumLiterals !== 1) {
			valid = false;
		}
		
		return valid;
	}
	
});