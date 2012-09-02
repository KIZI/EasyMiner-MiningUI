var RulesParser = new Class({
	
	DD: null,
	FL: null,
	maxCedentID: 0,
	maxConnectiveID: 0,
	maxFieldID: 0,
	openingBrackets: ['lbrac'],
	closingBrackets: ['rbrac'],
	attributes: ['attr'],
	booleans: ['and', 'or', 'neg'],
	
	initialize: function (ARBuilder, DD, FL) {
		this.DD = DD;
		this.FL = FL;
		
		ARBuilder.addEvent('updateFL', function (FL) {
			this.FL = FL;
		}.bind(this));
	},
	
	parse: function (data) {
		var rules = [];
		Array.each(data, function (iRule) {
			var rule = new AssociationRule(null);
			rule.setId(iRule.id);
			rule.addAntecedent(this.parseCedent('antecedent', iRule.antecedent, 1));
			rule.addSuccedent(this.parseCedent('consequent', iRule.consequent, 1));
			Array.each(iRule.IM, function(iIM) {
				rule.addIM(this.parseIM(iIM));
			}.bind(this));
			rules.push(rule);
		}.bind(this));
		
		return rules;
	},
	
	parseCedent: function (scope, cedent, depth) {
		var brToSolve = this.findOutterBrackets(cedent); // brackets to solve at this level
	    var bracketsInterval = this.mergeIntervals(brToSolve);
	    var bToSolve = this.findBooleans(cedent, bracketsInterval); // booleans to solve at this level
	    var connective = null;
	    
	    if (bToSolve.length) {
	    	Array.each(bToSolve, function (b) {
				connective = new Connective(this.generateConnectiveID(), b.type === 'and' ? 'Conjunction' : 'Disjunction');
			}.bind(this));
	    } else {
	    	connective = new Connective(this.generateConnectiveID(), 'Conjunction');
		}
	    var aToSolve = this.findAttributes(cedent, bracketsInterval); // attributes to solve at this level
	    
	    var partialCedent = new Cedent(this.generateCedentID(), depth, connective, [], scope);
	    Array.each(aToSolve, function (attribute, k) {
	    	var vals = [];
	    	Array.each(attribute.fields, function (f) {
				vals.push(f.value);
			}.bind(this));

	    	var literalRef = new FieldFR(this.generateFieldID(), this.DD.getAttributeByName(attribute.name), attribute.category, new StringHelper(), vals);	
	    	if (attribute.sign == 'negative') {
                literalRef.changeSign();
            }

	    	if (k > 0 && bToSolve[k - 1] && bToSolve[k - 1].type === 'neg') {
	    		literalRef.setNegativeSign();
	    	}
	    	partialCedent.addChild(literalRef);
		}.bind(this));
	    
	    Array.each(brToSolve, function (br) {
	    	if ((cedent[br.start + 1] !== -1) && (cedent[br.end - 1] !== -1) && true || ((br.start + 1) < (br.end -1))) {
	    		var newCedent = cedent.slice(br.start + 1, br.end);
	    		var childCedent = this.parseCedent(scope, newCedent, depth + 1);
	    		partialCedent.addChildCedent(childCedent);
	    	}
		}.bind(this));

	    return partialCedent;
	},
	
	findOutterBrackets: function (cedent, minBracketSize) {
	    minBracketSize = minBracketSize || 5;
		var oBrackets = [];

	    var oBracketsStack = [];
	    var oBracketStart = 0;
	    Array.each(cedent, function (obj, k) {
	    	if (this.openingBrackets.contains(obj.type)) {
		        if (!oBrackets.length) {
		          oBracketStart = k;
		        }
		        oBracketsStack.push(obj.type);
	    	} else if (this.closingBrackets.contains(obj.type)) {
	    		oBracketsStack.pop();
	    		if (!oBracketsStack.length && ((k - oBracketStart + 1) >= minBracketSize)) { // we do have outter bracket end here
	    			oBrackets.push({start: oBracketStart, end: k});
	    		}
	    	}	
	    }.bind(this));
	    
	    return oBrackets;
	},
	
	mergeIntervals: function (intervals) {
	    var interval = [];
	    Array.each(intervals, function (int) {
	    	for (var i = int.start; i <= int.end; i++) {
	    		interval.push(i);
	    	}
		}.bind(this));

	    return interval;
	},
	
	findBooleans: function(cedent, bracketsInterval) {
	    var booleans = [];

	    Array.each(cedent, function (obj, k) {
	    	if (!bracketsInterval.contains(k) && this.booleans.contains(obj.type)) {
		        booleans[k] = obj;
	    	}
		}.bind(this));

	    return booleans;
	},
	
	findAttributes: function(cedent, bracketsInterval) {
	    var attributes = [];

	    Array.each(cedent, function (obj, k) {
	    	if (!bracketsInterval.contains(k) && this.attributes.contains(obj.type)) {
	    		attributes[k] = obj;
	    	}
	    }.bind(this));

	    return attributes;
	},
	
	parseIM: function (IM) {
		var IMPrototype = this.FL.getIM(IM.name);
		return new InterestMeasureAR(IM.name, IMPrototype.getLocalizedName(), IMPrototype.getExplanation(), IMPrototype.getThresholdType(), IMPrototype.getCompareType(), IMPrototype.getFields(), IMPrototype.getStringHelper(), IM.fields.value, null);
	},
	
	generateCedentID: function () {
		return ++this.maxCedentID;
	},
	
	generateConnectiveID: function () {
		return ++this.maxConnectiveID;
	},
	
	generateFieldID: function () {
		return ++this.maxFieldID;
	},
	
	getIMPrototype: function (name) {
		return this.FL.getIM(name);
	}
	
});