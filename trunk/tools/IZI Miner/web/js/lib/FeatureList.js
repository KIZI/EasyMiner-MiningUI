var FeatureList = new Class({
	
	// user interface
	priority: 0,
	miningMode: true,
	name: '',
	localizedName: '',
	explanation: '',
	autoSuggest: [],
	
	// rule pattern
	rulePattern: [],
	
	// building blocks
	// - interest measures
	IMTreshold: '',
	IMs: [],
	IMCombinations: [],
	
	// - basic boolean attribute
	BBACoefficient: '',
	BBACoefficients: [],
	
	// - derived boolean attribute
	DBAMaxLevels: null,
	DBAConstraints: {},
	
	// custom properties
	maxConnectiveID: 0,
	
	initialize: function (data) {
		this.parseUserInterface(data);
		this.parseRulePattern(data);
		this.parseBuildingBlocks(data);
	},
	
	parseUserInterface: function (data) {
		this.priority = data.priority;
		this.miningMode = data.miningMode;
		this.name = data.name;
		this.localizedName = data.localizedName;
		this.explanation = data.explanation;
		this.autoSuggest = data.autoSuggest;
	},
	
	parseRulePattern: function (data) {
		Object.each(data.rulePattern, function (value, key) {
			this.rulePattern[key] = new RulePattern(key, value.minNumberOfBBAs, value.maxNumberOfBBAs);
		}.bind(this));
	},
	
	parseBuildingBlocks: function (data) {
		// interest measures
		this.IMTreshold = data.interestMeasures.treshold;
		
		Object.each(data.interestMeasures.types, function (value, key) {
			this.IMs[key] = new InterestMeasure(key, value.localizedName, value.explanation, value.thresholdType, value.compareType, value.fields, new StringHelper(), value.default);
		}.bind(this));
		
		Object.each(data.interestMeasures.combinations, function (value, key) {
			this.IMCombinations[key] = value;
		}.bind(this));
		
		// basic boolean attribute
		this.BBACoefficient = data.BBA.coefficient;
		
		Object.each(data.BBA.coefficients, function (value, key) {
			var BBACoef = new BBACoefficient(key, value.localizedName, value.Explanation);
			
			Object.each(value.fields, function (value, key) {
				BBACoef.addField(key, value);
			}.bind(this));
			
			this.BBACoefficients[key] = BBACoef;
		}.bind(this));
		
		// derived boolean attribute
		this.DBAMaxLevels = data.DBA.maxLevels;

        this.DBAConstraints = {};
		Object.each(data.DBA.constraints, function (DBAC, scope) {
            this.DBAConstraints[scope] = {};
			Object.each(DBAC, function(value, key) {
				this.DBAConstraints[scope][key] = value;
			}.bind(this));
		}.bind(this));
	},
	
	getName: function () {
		return this.name;
	},
	
	getLocalizedName: function () {
		if (this.localizedName) {
			return this.localizedName;
		}
		
		return this.name;
	},
	
	getExplanation: function () {
		return this.explanation;
	},
	
	getAutoSuggest: function () {
		return this.autoSuggest;
	},
	
	getRulePattern: function () {
		return this.rulePattern;
	},
	
	getIM: function (name) {
		if (this.IMs.hasOwnProperty(name)) {
			return this.IMs[name];
		}
		
		return null;
	},
	
	getIMs: function () {
		return this.IMs;
	},

    getDefaultIMs: function () {
        var defaultIMs = [];
        Object.each(this.IMs, function (IM) {
            if (IM.getDefault()) {
                defaultIMs.push(IM);
            }
        }.bind(this));

        return defaultIMs;
    },

	getRemainingIMs: function (usedIMs) {
		var remainingIMs = [];
		Object.each(this.IMs, function (IM, name) {
			var found = false;
			Object.each(usedIMs, function (usedIM) {
				if (IM.getName() === usedIM.getName()) {
					found = true;
				}
			}.bind(this));
			if (found === false) {
				remainingIMs.push(IM);
			}
		}.bind(this));
		
		return remainingIMs;
	},
	
	getPossibleIMs: function (usedIMs) {
		var possibleIMs = [];
		
		if (Object.getLength(usedIMs) === 0) {
			possibleIMs = this.getIMs();
		} else if (this.getIMCombinations().length === 0) {
      possibleIMs = this.getRemainingIMs(usedIMs);
    } else {
			Array.each(this.getIMCombinations(), function (IMCombination) {
				var applicableCombination = true;
				Object.each(usedIMs, function (usedIM) {
					if (!IMCombination.contains(usedIM.getName()) || IMCombination.length === 1) {
						applicableCombination = false;
					}
				}.bind(this));
				
				if (applicableCombination === true) {
					var applicableIMCombination = Array.clone(IMCombination);
					Object.each(usedIMs, function (usedIM) {
						applicableIMCombination.erase(usedIM.getName());
					}.bind(this));
					
					Array.each(applicableIMCombination, function (IMName) {
						var IM = this.getIM(IMName);
						possibleIMs[IM.getName()] = IM;
					}.bind(this));
				}
			}.bind(this));
		}
		
		return possibleIMs;
	},
	
	getIMCombinations: function () {
		return this.IMCombinations;
	},
	
	getBBACoefficient: function (name) {
		return this.BBACoefficients[name];
	},
	
	getBBACoefficients: function () {
		return this.BBACoefficients;
	},
	
	getDefaultBBACoef: function () {
		return this.getBBACoefficients()[Object.keys(this.getBBACoefficients())[0]];
	},

    getAllowedConnectives: function(scope) {
        var array = [];
        Object.each(this.DBAConstraints[scope], function(value, key) {
            if (value) {
                array.push(key);
            }
        });

        return array;
    },

    isConnectiveAllowed: function(type, scope, settings, level) {
        switch (type) {
            case 'Conjunction':
                var connectiveUsed = 0;
                var connectives = this.getAllowedConnectives(scope);
                Object.each(settings, function(setting, lvl) {
                    if (setting['Conjunction'] || setting['Disjunction']) { connectiveUsed++; }
                }.bind(this));

                if (connectives.contains('Conjunction') && (connectiveUsed < this.DBAMaxLevels) && (level < 3) && !(level === 2 && settings[1]['Disjunction'])) {
                    return true;
                }

                break;
            case 'Disjunction':
                var conjunctionUsedCount = 0;
                var disjunctionUsedCount = 0;
                var connectives = this.getAllowedConnectives(scope);
                Object.each(settings, function(setting, lvl) {
                    if (setting['Disjunction'] && level == lvl) {
                        // continue;
                    } else {
                        if (setting['Disjunction']) {
                            disjunctionUsedCount++;
                        } else if (setting['Conjunction']) {
                            conjunctionUsedCount++;
                        }
                    }
                }.bind(this));

                if (connectives.contains('Disjunction') && ((conjunctionUsedCount + disjunctionUsedCount) < this.DBAMaxLevels) && disjunctionUsedCount < 1 && level < 3) {
                    return true;
                }

                break;
            case 'Negation':
                var connectives = this.getAllowedConnectives(scope);

                return connectives.contains('Negation');
        }

        return false;
    },

	getDefaultConnective: function (level, settings, scope) {
        if (this.isConnectiveAllowed('Conjunction', scope, settings[scope], level)) {
            return new Connective(this.generateConnectiveID(), 'Conjunction');
        }

        return new Connective(this.generateConnectiveID(), 'Disjunction');
	},
	
	generateConnectiveID: function () {
		return ++this.maxConnectiveID;
	},

    hasCedentNoRestriction: function(cedent) {
        if (cedent.getNumFields() > 0) { return false; } // only empty cedents can have no restriction

        return (this.rulePattern[cedent.getScope().capitalize()].minNumberOfBBAs === 0);
    }
	
});