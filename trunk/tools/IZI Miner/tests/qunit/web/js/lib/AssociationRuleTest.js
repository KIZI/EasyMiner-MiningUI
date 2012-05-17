
module('AssociationRule');

test('generateIdent - antecedent', function () {
	var AR = new AssociationRule();
	
	// antecedent
	var field = new FieldAR(1, new Attribute('District'), 'One category', null, 'Praha');
	var antecedent = new Cedent(1, 1, {}, new Connective(1, 'Conjunction'), [field], []);
	AR.addAntecedent(antecedent);
	
	strictEqual(AR.generateIdent().stripTags(), 'District(Praha) => Any []');
});

test('generateIdent - IM', function () {
	var AR = new AssociationRule();
	
	// IM
	AR.addIM(new InterestMeasureAR('Support', '', '', null, null, 0.850));
	
	strictEqual(AR.generateIdent().stripTags(), 'Any => Any[Support:0.850]');
});

test('generateIdent - succedent', function () {
	var AR = new AssociationRule();
	
	// succedent
	var field = new FieldAR(1, new Attribute('Quality'), 'Subset', null, 1, 2);
	var succedent = new Cedent(1, 1, null, null, [field], []);
	AR.addSuccedent(succedent);
	
	strictEqual(AR.generateIdent().stripTags(), 'Any => Quality(Subset 1-2) []');
});

test('getIdent - own', function () {
	// has own ident
	var AR = new AssociationRule();
	AR.setIdent('District(Praha) => Quality(good)[Support: 0.850]');
	
	strictEqual(AR.getIdent(), 'District(Praha) => Quality(good)[Support: 0.850]');
});

test('getIdent - generated', function () {
	// does not have ident, generate
	var AR = new AssociationRule();
	
	// antecedent
	var field1 = new FieldAR(1, new Attribute('District'), 'One category', null, 'Praha');
	var antecedent = new Cedent(1, 1, null, null, [field1], []);
	AR.addAntecedent(antecedent);
	
	// IM
	AR.addIM(new InterestMeasureAR('Support', '', '', null, null, 0.850));
	
	// succedent
	var field2 = new FieldAR(2, new Attribute('Quality'), 'Subset', null, 1, 2);
	var succedent = new Cedent(2, 1, null, null, [field2], []);
	AR.addSuccedent(succedent);
	
	strictEqual(AR.getIdent().stripTags(), 'District(Praha) => Quality(Subset 1-2)[Support:0.850]');
});

test('getIdent - changed', function () {
	// does not have ident, changed, generate
	var AR = new AssociationRule();
	AR.setIdent('District (Praha) => Quality (good) [Confidence: 0.85]');
	AR.setChanged(true);
	
	strictEqual(AR.getIdent(), 'Any => Any []');
});

test('getMarkedRuleCSSID', function () {
	var rule = new AssociationRule();
	rule.setId(1);
	
	strictEqual(rule.getMarkedRuleCSSID(), 'marked-rule-1');
});

test('getMarkedRuleCSSRemoveID', function () {
	var rule = new AssociationRule();
	rule.setId(1);
	
	strictEqual(rule.getMarkedRuleCSSRemoveID(), 'remove-marked-rule-1');
});