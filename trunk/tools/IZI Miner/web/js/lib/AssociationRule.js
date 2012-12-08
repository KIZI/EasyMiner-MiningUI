/*global Class: false */ 

var AssociationRule = new Class({
	
	id: 0,
	ident: '',
	antecedent: null,
	succedent: null,
	condition: null,
	IMs: {},
	changed: false,
	groupFields: true,
	validator: null,
	
	initialize: function (validator) {
		this.validator = validator;
	},
	
	/* id */
	getId: function() {
		return this.id;
	},
	
	setId: function (id) {
		this.id = id;
	},
	
	/* ident */
	getIdent: function () {
		return this.generateIdent();
	},
	
	generateIdent: function () {
		var ident = '';
		if (this.antecedent !== null) {
			ident += this.antecedent.toString();
		} else {
			ident += '<div class="cedent">Empty</div>';
		}
		
		ident += '<span class="quantifier">=></span>';
		
		if (this.succedent !== null) {
			ident += this.succedent.toString();
		} else {
			ident += '<div class="cedent">Empty</div>';
		}
		
		return ident;
	},
	
	getIMIdent: function () {
		if (Object.getLength(this.IMs) !== 0) {
			return this.generateIMsIdent(this.IMs);
		} else {
			return ' []';
		}
	},

	/* cedent */
	addField: function (field, cedent) {
		cedent.addChild(field);
		this.setChanged(true);
	},
	
	removeField: function (field) {
		this.antecedent.removeChild(field);
		this.succedent.removeChild(field);
		this.setChanged(true);
	},
	
	changeFieldSign: function (field) {
		field.changeSign();
		this.setChanged(true);
	},

	setCedent: function (cedent, newCedent) {
		if (this.antecedent.getId() === cedent.getId()) {
			this.antecedent = newCedent;
		} else {
			this.succedent = newCedent;
		}
	},
	
	removeCedent: function (cedent) {
		var removed = this.antecedent.removeChildCedent(cedent);
		if (removed !== true) {
			this.succedent.removeChildCedent(cedent);
		}
	},
	
	update: function () {
		this.antecedent.update();
		this.succedent.update();
	},
	
	getLiterals: function () {
		var literals = this.antecedent.getFields();
		literals.append(this.succedent.getFields());
		
		return literals;
	},
	
	/* antecedent */	
	getAntecedent: function () {
		return this.antecedent;
	},
	
	addAntecedent: function (cedent) {
		this.antecedent = cedent;
	},
	
	/* succedent */
	getSuccedent: function () {
		return this.succedent;
	},
	
	addSuccedent: function (cedent) {
		this.succedent = cedent;
	},
	
	/* condition */
	getCondition: function () {
		return this.condition;
	},
	
	/* IMs */
	getIMs: function () {
		return this.IMs;
	},
	
	getFirstIM: function () {
		if (this.getNumIMs() > 0) {
			return this.IMs[Object.keys(this.IMs)[0]];
		}
		
		return null;
	},
	
	getNumIMs: function () {
		return Object.getLength(this.IMs);
	},
	
	addIM: function (IM) {
		this.IMs[IM.getName()] = IM;
		this.setChanged(true);
	},
	
	editIM: function(IM, threshold, alpha) {
		this.IMs[IM.getName()].setThreshold(threshold);
		this.IMs[IM.getName()].setAlpha(alpha);
		this.setChanged(true);
	},
	
	removeIM: function (name) {
		delete this.IMs[name];
		this.setChanged(true);
	},
	
	generateIMsIdent: function (IMs) {
		var ident = '[';
		var i = 0;
		Object.each(IMs, function (IM) {
			ident += IM.toString();
			if (Object.getLength(IMs) !== ++i) {
				ident += ', ';
			}
		}.bind(this));
		ident += ']';
		
		return ident;
	},
	
	/* changed */
	isChanged: function () {
		return this.changed;
	},
	
	setChanged: function (value) {
		this.changed = value;
	},
	
	/* group fields */
	getGroupFields: function () {
		return this.groupFields;
	},
	
	setGroupFields: function (value) {
		this.groupFields = value;
	},
	
	/* misc */
	getMarkedRuleCSSID: function () {
		return 'marked-rule-' + this.id;
	},
	
	getMarkedRuleCSSRemoveID: function () {
		return 'remove-marked-rule-' + this.id;
	},
		
	getFoundRuleCSSBKID: function () {
		return 'bk-found-rule-' + this.id;
	},
	
	getFoundRuleCSSMarkID: function () {
		return 'mark-found-rule-' + this.id;
	},
	
	getFoundRuleCSSRemoveID: function () {
		return 'remove-found-rule-' + this.id;	
	},
	
	isAttributeUsed: function(attribute) {
		return (this.antecedent.isAttributeUsed(attribute) || this.succedent.isAttributeUsed(attribute));
	},
	
	isValid: function() {
		return this.validator.isValid(this);
	},
	
	serialize: function () {
		var serialized = {};
        serialized.antecedent = this.antecedent.serialize();

        serialized.IMs = [];
		Object.each(this.IMs, function (IM) {
			serialized.IMs.push(IM.serialize());
		}.bind(this));

		serialized.succedent = this.succedent.serialize();
		
		return serialized;
	},

    toSettings: function() {
        var settings = {};
        settings['antecedent'] = {};
        if (this.antecedent) {
            settings['antecedent'] = this.antecedent.toSettings();
        }
        settings['consequent'] = {};
        if (this.succedent) {
            settings['consequent'] = this.succedent.toSettings();
        }

        return settings;
    }
	
});