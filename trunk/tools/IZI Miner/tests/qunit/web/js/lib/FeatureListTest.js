
module('FeatureList');

test('isConnectiveAllowed 1', function() {
    var data = {
        interestMeasures: {},
        BBA: {},
        DBA: {
            maxLevels: 3,
            constraints: {antecedent: {
                Conjunction: true,
                Disjunction: true,
                Negation: true,
                Any: false
            }}
        }};
    var FL = new FeatureList(data);
    var scope = 'antecedent';
    var settings = {1: {}, 2: {}, 3: {}};

    strictEqual(FL.isConnectiveAllowed('Conjunction', scope, settings, 1), true);
    strictEqual(FL.isConnectiveAllowed('Disjunction', scope, settings, 1), true);
    strictEqual(FL.isConnectiveAllowed('Negation', scope, settings, 1), true);
    strictEqual(FL.isConnectiveAllowed('Conjunction', scope, settings, 2), true);
    strictEqual(FL.isConnectiveAllowed('Disjunction', scope, settings, 2), true);
    strictEqual(FL.isConnectiveAllowed('Negation', scope, settings, 2), true);
    strictEqual(FL.isConnectiveAllowed('Conjunction', scope, settings, 3), false);
    strictEqual(FL.isConnectiveAllowed('Disjunction', scope, settings, 3), false);
    strictEqual(FL.isConnectiveAllowed('Negation', scope, settings, 3), true);
});

test('isConnectiveAllowed 2', function() {
    var data = {
        interestMeasures: {},
        BBA: {},
        DBA: {
            maxLevels: 3,
            constraints: {
                antecedent: {
                    Conjunction: false,
                    Disjunction: false,
                    Negation: false,
                    Any: false
            }}
        }};
    var FL = new FeatureList(data);
    var scope = 'antecedent';
    var settings = {1: {}, 2: {}, 3: {}};

    strictEqual(FL.isConnectiveAllowed('Conjunction', scope, settings, 1), false);
    strictEqual(FL.isConnectiveAllowed('Disjunction', scope, settings, 1), false);
    strictEqual(FL.isConnectiveAllowed('Negation', scope, settings, 1), false);
    strictEqual(FL.isConnectiveAllowed('Conjunction', scope, settings, 2), false);
    strictEqual(FL.isConnectiveAllowed('Disjunction', scope, settings, 2), false);
    strictEqual(FL.isConnectiveAllowed('Negation', scope, settings, 2), false);
    strictEqual(FL.isConnectiveAllowed('Conjunction', scope, settings, 3), false);
    strictEqual(FL.isConnectiveAllowed('Disjunction', scope, settings, 3), false);
    strictEqual(FL.isConnectiveAllowed('Negation', scope, settings, 3), false);
});

test('isConnectiveAllowed 3', function() {
    var data = {
        interestMeasures: {},
        BBA: {},
        DBA: {
            maxLevels: 3,
            constraints: {
                antecedent: {
                    Conjunction: true,
                    Disjunction: true,
                    Negation: true,
                    Any: false
                }
            }
        }};
    var FL = new FeatureList(data);
    var scope = 'antecedent';
    var settings = {1: {Conjunction: true}, 2: {}, 3: {}};

    strictEqual(FL.isConnectiveAllowed('Conjunction', scope, settings, 1), true);
    strictEqual(FL.isConnectiveAllowed('Disjunction', scope, settings, 1), true);
    strictEqual(FL.isConnectiveAllowed('Negation', scope, settings, 1), true);
    strictEqual(FL.isConnectiveAllowed('Conjunction', scope, settings, 2), true);
    strictEqual(FL.isConnectiveAllowed('Disjunction', scope, settings, 2), true);
    strictEqual(FL.isConnectiveAllowed('Negation', scope, settings, 2), true);
    strictEqual(FL.isConnectiveAllowed('Conjunction', scope, settings, 3), false);
    strictEqual(FL.isConnectiveAllowed('Disjunction', scope, settings, 3), false);
    strictEqual(FL.isConnectiveAllowed('Negation', scope, settings, 3), true);
});

test('isConnectiveAllowed 4', function() {
    var data = {
        interestMeasures: {},
        BBA: {},
        DBA: {
            maxLevels: 3,
            constraints: {antecedent: {
                Conjunction: true,
                Disjunction: true,
                Negation: true,
                Any: false
            }}
        }};
    var FL = new FeatureList(data);
    var scope = 'antecedent';
    var settings = {1: {Disjunction: true}, 2: {}, 3: {}};

    strictEqual(FL.isConnectiveAllowed('Conjunction', scope, settings, 1), true);
    strictEqual(FL.isConnectiveAllowed('Disjunction', scope, settings, 1), true);
    strictEqual(FL.isConnectiveAllowed('Negation', scope, settings, 1), true);
    strictEqual(FL.isConnectiveAllowed('Conjunction', scope, settings, 2), false);
    strictEqual(FL.isConnectiveAllowed('Disjunction', scope, settings, 2), false);
    strictEqual(FL.isConnectiveAllowed('Negation', scope, settings, 2), true);
    strictEqual(FL.isConnectiveAllowed('Conjunction', scope, settings, 3), false);
    strictEqual(FL.isConnectiveAllowed('Disjunction', scope, settings, 3), false);
    strictEqual(FL.isConnectiveAllowed('Negation', scope, settings, 3), true);
});

test('isConnectiveAllowed 5', function() {
    var data = {
        interestMeasures: {},
        BBA: {},
        DBA: {
            maxLevels: 3,
            constraints: {antecedent: {
                Conjunction: true,
                Disjunction: true,
                Negation: true,
                Any: false
            }}
        }};
    var FL = new FeatureList(data);
    var scope = 'antecedent';
    var settings = {1: {Conjunction: true}, 2: {Conjunction: true}, 3: {}};

    strictEqual(FL.isConnectiveAllowed('Conjunction', scope, settings, 1), true);
    strictEqual(FL.isConnectiveAllowed('Disjunction', scope, settings, 1), true);
    strictEqual(FL.isConnectiveAllowed('Negation', scope, settings, 1), true);
    strictEqual(FL.isConnectiveAllowed('Conjunction', scope, settings, 2), true);
    strictEqual(FL.isConnectiveAllowed('Disjunction', scope, settings, 2), true);
    strictEqual(FL.isConnectiveAllowed('Negation', scope, settings, 2), true);
    strictEqual(FL.isConnectiveAllowed('Conjunction', scope, settings, 3), false);
    strictEqual(FL.isConnectiveAllowed('Disjunction', scope, settings, 3), false);
    strictEqual(FL.isConnectiveAllowed('Negation', scope, settings, 3), true);
});

test('isConnectiveAllowed 6', function() {
    var data = {
        interestMeasures: {},
        BBA: {},
        DBA: {
            maxLevels: 3,
            constraints: {
                antecedent: {
                    Conjunction: true,
                    Disjunction: true,
                    Negation: true,
                    Any: false
                }
            }
        }};
    var FL = new FeatureList(data);
    var scope = 'antecedent';
    var settings = {1: {Conjunction: true}, 2: {Disjunction: true}, 3: {}};

    strictEqual(FL.isConnectiveAllowed('Conjunction', scope, settings, 1), true);
    strictEqual(FL.isConnectiveAllowed('Disjunction', scope, settings, 1), false);
    strictEqual(FL.isConnectiveAllowed('Negation', scope, settings, 1), true);
    strictEqual(FL.isConnectiveAllowed('Conjunction', scope, settings, 2), true);
    strictEqual(FL.isConnectiveAllowed('Disjunction', scope, settings, 2), true);
    strictEqual(FL.isConnectiveAllowed('Negation', scope, settings, 2), true);
    strictEqual(FL.isConnectiveAllowed('Conjunction', scope, settings, 3), false);
    strictEqual(FL.isConnectiveAllowed('Disjunction', scope, settings, 3), false);
    strictEqual(FL.isConnectiveAllowed('Negation', scope, settings, 3), true);
});