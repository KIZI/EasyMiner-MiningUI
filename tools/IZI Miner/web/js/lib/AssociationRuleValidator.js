var AssociationRuleValidator = new Class({
	
	rulePatterns: [],
	IMCombinations: [],
	
	initialize: function (rulePatterns, IMCombinations) {
		this.rulePatterns = rulePatterns;
		this.IMCombinations = IMCombinations;
	},
	
	isValid: function (rule) {
		var valid = true;
		
		// antecedent
		var antecedentNumLiterals = rule.getAntecedent().getNumLiterals();
		if (antecedentNumLiterals  < this.rulePatterns.Antecedent.minNumberOfBBAs || antecedentNumLiterals  > this.rulePatterns.Antecedent.maxNumberOfBBAs || !rule.getAntecedent().isValid()) {
			valid = false;
		}

		// succedent
		var succedentNumLiterals = rule.getSuccedent().getNumLiterals();
		if (succedentNumLiterals < this.rulePatterns.Consequent.minNumberOfBBAs || succedentNumLiterals > this.rulePatterns.Consequent.maxNumberOfBBAs || !rule.getSuccedent().isValid()) {
			valid = false;
		}

		// general
		if ((antecedentNumLiterals + succedentNumLiterals) < this.rulePatterns.Antecedent.minNumberOfBBAs || 
			(antecedentNumLiterals + succedentNumLiterals) > this.rulePatterns.Antecedent.maxNumberOfBBAs) {
			valid = false;
		}

		if (this.IMCombinations.length) {
			var IMs = [];
			Object.each(rule.getIMs(), function (IM) {
				IMs.include(IM.getName());
			}.bind(this));
			
			var IMsValid = false;
			Array.each(this.IMCombinations, function (IMComb) {
				if (IMs.equalsTo(IMComb)) {
					IMsValid = true;
				}
			}.bind(this));
			
			valid = valid && IMsValid;
		} else if (!Object.getLength(rule.getIMs())) {
			valid = false;
		}
	
		return valid;
	}
	
});