
module('InterestMeasure');

test('getName', function () {
	var IM = new InterestMeasure('Support');
	
	strictEqual(IM.getName(), 'Support');
});

test('getLocalizedName', function () {
	var IM1 = new InterestMeasure('Support', 'Support - localized');
	var IM2 = new InterestMeasure('Support', '', '', [], null);
	
	strictEqual(IM1.getLocalizedName(), 'Support - localized');
	strictEqual(IM2.getLocalizedName(), 'Support');
});

test('getNormalizedName', function () {
	var stringHelper = new StringHelper();
    var stringHelperMock = sinon.mock(stringHelper);
	stringHelperMock.expects('normalizeString').once();
	var IM = new InterestMeasure('Above Average Dependence', '', '', '', '', [], stringHelper);
	
	IM.getNormalizedName();
	ok(stringHelperMock.verify(), 'getNormalizedName success.');
});

test('getCSSID', function () {
	var IM = new InterestMeasure('Above Average Dependence', '', '', '', '', [], new StringHelper());
	
	strictEqual(IM.getCSSID(), 'im-above-average-dependence');
});

test('getCSSRemoveID', function () {
	var IM = new InterestMeasure('Above Average Dependence', '', '', '', '', [], new StringHelper());
	
	strictEqual(IM.getCSSRemoveID(), 'im-above-average-dependence-remove');
});

test('getCSSSliderID', function () {
		var IM = new InterestMeasure('Above Average Dependence', '', '', '', '', [], new StringHelper());
		
		strictEqual(IM.getCSSSliderID(), 'im-above-average-dependence-slider');
});

test('getCSSValueID', function () {
	var IM = new InterestMeasure('Above Average Dependence', '', '', '', '', [], new StringHelper());
	
	strictEqual(IM.getCSSValueID(), 'im-above-average-dependence-value');
});