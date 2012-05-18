/*global Class: false */ 

var Cedent = new Class({

	id: 0,
	level: 0,
	constraint: {},
	connective: null,
	literalRefs: [],
	childCedents: [],
	scope: '',
	sign: true,
	colors: {0: '#FF9999', 1: '#CC99FF', 2: '#99CCFF', 3: '#FFFF99', 4: '#99FFCC', 5: '#FFCC99'},

	initialize: function (id, level, constraint, connective, literalRefs, childCedents, scope) {
		this.id = id;
		this.level = level;
		this.constraint = constraint;
		this.connective = connective;
		this.literalRefs = literalRefs;
		this.childCedents = childCedents;
		this.scope = scope;
	},
	
	getId: function () {
		return this.id;
	},
	
	setId: function (id) {
		this.id = id;
	},
	
	getLevel: function () {
		return this.level;
	},
	
	getNextLevel: function () {
		return (this.level + 1);
	},
	
	getConstraint: function () {
		return this.constraint;
	},
	
	getConnective: function () {
		return this.connective;
	},
	
	setConnective: function (connectiveName) {
		this.connective.set(connectiveName);
	},
	
	addLiteralRef: function (literalRef) {
		this.literalRefs.push(literalRef);
	},
	
	getLiteralRefs: function () {
		return this.literalRefs;
	},
	
	removeLiteralRef: function (literalRef) {
		var removed = false;
		Array.each(this.literalRefs, function (litRef, key) {
			if (litRef.getId() === literalRef.getId()) {
				this.literalRefs = this.literalRefs.remove(key);
				removed = true;
			}
		}.bind(this));
		
		if (removed !== true) {
			Array.each(this.childCedents, function (childCedent) {
				if (childCedent.removeLiteralRef(literalRef) === true) {
					removed = true;
				}
			}.bind(this));
		}
		
		return removed;
	},
	
	getNumLiteralRefs: function () {
		var count = 0;
		Object.each(this.literalRefs, function () {
			count++;
		}.bind(this));
		
		return count;
	},
	
	groupLiteralRefs: function (newCedent) {	
		Array.each(this.literalRefs, function (field, key) {
			if (field.isMarked()) {
				field.unMark();
				newCedent.addLiteralRef(field);
				this.removeLiteralRef(field);
			}
		}.bind(this));
		this.addChildCedent(newCedent);
	},
	
	unmarkLiteralRefs: function () {
		Array.each(this.literalRefs, function (field, key) {
			if (field.isMarked()) {
				field.unMark();
			}
		}.bind(this));
	},
	
	addChildCedent: function (cedent) {
		this.childCedents.push(cedent);
	},
	
	getChildCedents: function () {
		return this.childCedents;
	},
	
	getNumChildCedents: function () {
		var count = 0;
		Object.each(this.childCedents, function () {
			count++;
		}.bind(this));
		
		return count;
	},
	
	removeChildCedent: function (cedent) {
		Object.each(this.childCedents, function (childCedent, key) {
			if (childCedent.getId() === cedent.getId()) {
				delete this.childCedents[key];
			} else {
				childCedent.removeChildCedent(cedent);
			}
		}.bind(this));
	},
	
	getNumChildren: function () {
		return this.getNumLiteralRefs() + this.getNumChildCedents();
	},
	
	getNumLiterals: function () {
		var numLiterals = this.getNumLiteralRefs();
		Object.each(this.childCedents, function (cedent) {
			numLiterals += cedent.getNumLiterals();
		}.bind(this));
		
		return numLiterals;
	},
	
	getLiterals: function () {
		var literals = Array.clone(this.literalRefs);
		
		Array.each(this.childCedents, function (childCedent) {
			literals.append(childCedent.getLiterals());
		}.bind(this));
		
		return literals;
	},
	
	getScope: function () {
		return this.scope;
	},
	
	getNumMarkedFields: function () {
		var count = 0;
		Array.each(this.getLiteralRefs(), function (field, key) {
			if (field.isMarked()) { count++; }
		}.bind(this));
		
		return count;
	},
	
	getCSSID: function () {
		return 'cedent-' + this.id;
	},
	
	getCSSEditConnectiveID: function () {
		return 'edit-connective-' + this.id;
	},
	
	getCSSAddCedentID: function () {
		return 'add-cedent-' + this.id;
	},
	
	getCSSFieldsID: function () {
		return 'cedent-fields-' + this.id;
	},
	
	getCSSGroupFieldsConfirmID: function () {
		return 'group-fields-confirm-' + this.id;
	},
	
	getCSSGroupFieldsRejectID: function () {
		return 'group-fields-reject-' + this.id;
	},
	
	getCSSInfoID: function () {
		return 'cedent-info-' + this.id;
	},
	
	getCSSRemoveID: function () {
		return 'remove-cedent-' + this.id;
	},
	
	getCSSChangeSignID: function () {
		return 'change-cedent-sign-' + this.id;
	},
	
	isEmpty: function () {
		return (Object.getLength(this.literalRefs) === 0 && Object.getLength(this.childCedents) === 0);
	},
	
	getSign: function () {
		return (this.sign === true ? 'positive' : 'negative');
	},
	
	changeSign: function () {
		this.sign = !this.sign;			
	},
	
	setPositiveSign: function () {
		this.sign = true;
	},
	
	hasPositiveSign: function () {
		return this.sign;
	},
	
	isNegativeSignAllowed: function () {
		return this.constraint.Disjunction;
	},
	
	getBackgroundColor: function () {
		return this.colors[this.id % 6];
	},
	
	hasBrackets: function () {
		if ((this.level === 1 && this.getNumLiteralRefs() > 1 && this.getNumLiterals() !== this.getNumLiteralRefs()) || (this.level === 2 && this.getNumLiteralRefs() > 1)) {
			return true;
		}
		//else if (this.getNumLiteralRefs() > 2) {
		//	return true;
		//}
		
		return false;
	},
	
	/*
	hasBrackets: function () {
		if (this.getNumLiteralRefs() > 1 && (this.getNumLiterals() > this.getNumLiteralRefs() + 1)) {
			return true;
		} else if (this.getNumLiteralRefs() > 1) {
			return true;
		}
		
		return false;
	},*/
	
	displayChangeSign: function () {
		return this.isNegativeSignAllowed() && this.hasBrackets();
	},
	
	displayGroupButton: function () {
		var numMarkedFields = 0;
		Object.each(this.literalRefs, function (literalRef) {
			if (literalRef.isMarked()) { numMarkedFields++; }
		}.bind(this));
		
		return (numMarkedFields > 1);
	},
	
	/* misc */
	
	isAttributeUsed: function (attribute) {
		var used = false;
		Array.each(this.literalRefs, function (literalRef) {
			if (literalRef.getAttributeName() === attribute.getName()) {
				used = true;
			}
		}.bind(this));
		
		Array.each(this.childCedents, function (childCedent) {
			if (childCedent.isAttributeUsed(attribute)) {
				used = true;
			}
		}.bind(this));
		
		return used;
	},
	
	isValid: function () {
		var valid = true;
		Array.each(this.literalRefs, function (literalRef) {
			if (!literalRef.getType()) {
				valid = false;
			}
		}.bind(this));
		
		Array.each(this.childCedents, function (childCedent) {
			if (!childCedent.isValid()) {
				valid = false;
			}
		}.bind(this));
		
		return valid;
	},
	
	serialize: function () {
		var serialized = [];
		
		if (this.hasPositiveSign() !== true) { 
			serialized.push({name: 'NEG', type: 'neg'});
		}
		if (this.hasBrackets()) { 
			serialized.push({name: '(', type: 'lbrac'});
		}
		
		var i = 0;
		Array.each(this.literalRefs, function (literalRef) {
			if (!literalRef.hasPositiveSign()) {
				serialized.push({name: 'NEG', type: 'neg'});
			}
			serialized.push(literalRef.serialize());
			if (this.getNumChildren() !== ++i) {
				serialized.push(this.connective.serialize());
			}
		}.bind(this));
		
		Array.each(this.childCedents, function (childCedent) {
			serialized.combine(childCedent.serialize());
			if (this.getNumChildren() !== ++i) {
				serialized.push(this.connective.serialize());
			}
		}.bind(this));
		
		if (this.hasBrackets()) { 
			serialized.push({name: ')', type: 'rbrac'});
		}
		
		return serialized;
	},
	
	update: function () {
		if (this.getNumLiteralRefs() === 0 && this.getNumChildren() === 1) {
			var childCedent = this.childCedents[0];
			this.literalRefs = childCedent.getLiteralRefs();
			this.childCedents = childCedent.getChildCedents();
		}
		
		Array.each(this.childCedents, function (childCedent) {
			if (childCedent.getNumLiterals() === 0) {
				this.removeChildCedent(childCedent);
			}
		}.bind(this));
	},
	
	toString: function () {
		if (this.isEmpty()) { return 'Any'; }
		
		var string = '';
		if (this.hasPositiveSign() !== true) { string += '<span class="field-sign negative">'; }
		if (this.hasBrackets()) { 
			string += '('; 
			//string += '<span class="left-bracket">(</span>'; 
		}
		
		//string += '<span class="rule">';
		
		var i = 0;
		Array.each(this.literalRefs, function (field) {
			string += field.toStringAR();
			if (this.getNumChildren() !== ++i) {
				string += '<span class="connective">' + this.connective.toString() + '</span>';
			}
		}.bind(this));
		
		Array.each(this.getChildCedents(), function (childCedent) {
			string += childCedent.toString();
			if (this.getNumChildren() !== ++i) {
				string += '<span class="connective">' + this.connective.toString() + '</span>';
			}
		}.bind(this));
		
		//string += '</span>';
		
		if (this.hasBrackets()) { 
			string += ' )'; 
			//string += '<span class="right-bracket">)</span>'; 
		}
		if (this.hasPositiveSign() !== true) { string += '</span>'; }
		
		return string;
	}

});