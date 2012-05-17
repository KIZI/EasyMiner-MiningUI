
module('InterestMeasureAR');

test('toString', function () {
	var IM1 = new InterestMeasureAR('Support', '', '', [], null, 0.8859);
	var IM2 = new InterestMeasureAR('Support', '', '', [], null, 0.8854);
	
	strictEqual(IM1.toString().stripTags(), 'Support:0.886');
	strictEqual(IM2.toString().stripTags(), 'Support:0.885');
});