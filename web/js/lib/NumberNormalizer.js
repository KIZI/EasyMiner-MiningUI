/**
 * Class NumberNormalizer
 * @license http://www.apache.org/licenses/LICENSE-2.0 Apache License, Version 2.0
 * @link http://github.com/kizi/easyminer-miningui
 *
 * @type Class
 */
var NumberNormalizer = new Class({
	
	prevStart: 0,
	prevEnd: 0,
	prevPricision: 0,
	start: 0,
	end: 0,
	precision: 0,
	numSteps: 0,
	minValueInclusive: true,
	maxValueInclusive: true,
	
	initialize: function(prevStart, prevEnd, prevPrecision, start, end, precision, numSteps, minValueInclusive, maxValueInclusive) {
		this.prevPrecision = prevPrecision;
		this.precision = precision;
		this.prevStart = this.normalizePrevStart(prevStart, prevEnd, numSteps, minValueInclusive);
		this.prevEnd = this.normalizePrevEnd(prevStart, prevEnd, numSteps, maxValueInclusive);
		this.start = this.normalizeStart(start, end, numSteps, minValueInclusive);
		this.end = this.normalizeEnd(start, end, numSteps, maxValueInclusive);
		this.numSteps = this.normalizeNumSteps(numSteps, minValueInclusive, maxValueInclusive);
		this.minValueInclusive = minValueInclusive;
		this.maxValueInclusive = maxValueInclusive;
	},
	
	normalizePrevStart: function (prevStart, prevEnd, numSteps, minValueInclusive) {
		return prevStart + this.prevRound((this.diff(prevStart, prevEnd) / numSteps) * (!minValueInclusive & 1));
	},
	
	normalizePrevEnd: function (prevStart, prevEnd, numSteps, maxValueInclusive) {
		return prevEnd - this.prevRound((this.diff(prevStart, prevEnd) / numSteps) * (!maxValueInclusive & 1));
	},
	
	normalizeStart: function (start, end, numSteps, minValueInclusive) {
		return start + this.round((this.diff(start, end) / numSteps) * (!minValueInclusive & 1));
	},
	
	normalizeEnd: function (start, end, numSteps, maxValueInclusive) {
		return end - this.round((this.diff(start, end) / numSteps) * (!maxValueInclusive & 1));
	},
	
	normalizeNumSteps: function (numSteps, minValueInclusive, maxValueInclusive) {
		return numSteps + (minValueInclusive & 1) + (maxValueInclusive & 1);
	},
	
	diff: function (a, b) {
		return Math.abs(a - b);
	},
	
	round: function (number) {
		return number.round(this.precision);
	},

	prevRound: function (number) {
		return number.round(this.prevPrecision);
	},
	
	normalize: function(number) {
		var ratio = number / Math.abs(this.prevStart - this.prevEnd);
		var normalizedNumber = Math.abs(this.start - this.end) * ratio;
		normalizedNumber = this.round(normalizedNumber);
		
		return normalizedNumber;
	},
	
	validate: function (number) {
		// convert to number if necessary
		if (typeof number  === 'number') {
			number = this.round(number);
		} else if (typeof number === 'string') {
			number = number.toFloat();
			number = this.round(number);
		} else {
			number = this.prevStart;
		}
		
		// validate number
		if (number < this.prevStart) {
			number = this.prevStart;
		} else if (number > this.prevEnd) {
			number = this.prevEnd;
		}
		
		return number;
	},
	
	format: function (number) {
		return number.format({decimal: '.', decimals: this.precision});
	}
	
});