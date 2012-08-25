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
		var antecedentNumLiterals = rule.getAntecedent().getNumFields();
		if (antecedentNumLiterals  < this.rulePatterns.Antecedent.minNumberOfBBAs || antecedentNumLiterals  > this.rulePatterns.Antecedent.maxNumberOfBBAs || !rule.getAntecedent().isValid()) {
			valid = false;
		}

		// succedent
		var succedentNumLiterals = rule.getSuccedent().getNumFields();
		if (succedentNumLiterals < this.rulePatterns.Consequent.minNumberOfBBAs || succedentNumLiterals > this.rulePatterns.Consequent.maxNumberOfBBAs || !rule.getSuccedent().isValid()) {
			valid = false;
		}

		// general
		if ((antecedentNumLiterals + succedentNumLiterals) < this.rulePatterns.GeneralConstraint.minNumberOfBBAs ||
			(antecedentNumLiterals + succedentNumLiterals) > this.rulePatterns.GeneralConstraint.maxNumberOfBBAs) {
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