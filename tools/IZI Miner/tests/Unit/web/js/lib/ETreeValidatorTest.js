module('ETreeValidator');

test('validate - invalid', function () {
    var validator = new ETreeValidator();
    var rule = new AssociationRule();
    rule.addAntecedent(new Cedent());
    rule.addSuccedent(new Cedent());

    strictEqual(validator.isValid(rule), false);
});

test('validate - valid', function () {
    var validator = new ETreeValidator();
    var rule = new AssociationRule();
    var antecedent = new Cedent(null, 1);
    antecedent.addChild(new FieldAR());
    rule.addAntecedent(antecedent);
    rule.addIM(new InterestMeasureAR());
    var succedent = new Cedent(null, 1);
    succedent.addChild(new FieldAR());
    rule.addSuccedent(succedent);

    strictEqual(validator.isValid(rule), true);
});