module('AssociationRuleValidator');

test('validate - invalid', function () {
    var rulePatterns = {
        Antecedent: {name: "Antecedent", minNumberOfBBAs: 1, maxNumberOfBBAs: 1},
        Condition: {name: "Condition", minNumberOfBBAs: 0, maxNumberOfBBAs: 0},
        Consequent: {name: "Consequent", minNumberOfBBAs: 1, maxNumberOfBBAs: 1},
        GeneralConstraint: {name: "GeneralConstraint", minNumberOfBBAs: 2, maxNumberOfBBAs: 2}
    };
    var IMCombinations = [];
    var validator = new AssociationRuleValidator(rulePatterns, IMCombinations);
    var rule = new AssociationRule();
    rule.addAntecedent(new Cedent());
    rule.addSuccedent(new Cedent());

    strictEqual(validator.isValid(rule), false);
});

test('validate - valid', function () {
    var rulePatterns = {
        Antecedent: {name: "Antecedent", minNumberOfBBAs: 1, maxNumberOfBBAs: 1},
        Condition: {name: "Condition", minNumberOfBBAs: 0, maxNumberOfBBAs: 0},
        Consequent: {name: "Consequent", minNumberOfBBAs: 1, maxNumberOfBBAs: 1},
        GeneralConstraint: {name: "GeneralConstraint", minNumberOfBBAs: 2, maxNumberOfBBAs: 2}
    };
    var IMCombinations = [];
    var validator = new AssociationRuleValidator(rulePatterns, IMCombinations);
    var rule = new AssociationRule();
    var antecedent = new Cedent(null, 1);
    antecedent.addChild(new FieldAR(null, null, 'One category', null, null));
    rule.addAntecedent(antecedent);
    rule.addIM(new InterestMeasureAR());
    var succedent = new Cedent(null, 1);
    succedent.addChild(new FieldAR(null, null, 'One category', null, null));
    rule.addSuccedent(succedent);

    strictEqual(validator.isValid(rule), true);
});