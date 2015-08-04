var DataDescription = new Class({

    GetterSetter: ['attributes', 'fields', 'recordCount'],

    $id: 0,
    $recordCount: 0,
    $attributes: [],
    $fields: [],
    $storage: null,
    $config: null,
    $hiddenAttributes: [],

	initialize: function (id, storage, config) {
        this.$id = id;
        this.$storage = storage;
        this.$config = config;
	},

    parse: function(data) {
        this.parseRecordCount(data.recordCount);
        this.parseAttributes(data.transformationDictionary);
        this.parseFields(data.dataDictionary);
    },

    isPersisted: function() {
        return (typeOf(this.$storage.getObj('DD_' + this.$id)) === 'object');
    },

    load: function() {
        var data = this.$storage.getObj('DD_' + this.$id);
        Array.from(data.$attributes).each(function(obj) {
            var attribute = new Attribute();
            attribute.load(obj);
            this.$attributes.push(attribute);
        }.bind(this));

        Array.from(data.$fields).each(function(obj) {
            var field = new APField();
            field.load(obj);
            this.$fields.push(field);
        }.bind(this));

        return this;
    },

    save: function() {
        this.$storage.setObj('DD_' + this.$id, this);
    },

    parseRecordCount: function (recordCount) {
        this.$recordCount = parseInt(recordCount);
    },

    calculateMinimalSupport: function() {
        return (1.0 / this.$recordCount).ceilWithPrecision(3);//upravena pøesnost pro povolení i 0.001
    },

	parseAttributes: function (attributes) {
        this.$attributes = [];
        var hiddenAttributes = this.getHiddenAttributes();
		Object.each(attributes, function (value, name) {
            var hidden = false;
            if (hiddenAttributes.contains(name)) {
                hidden = true;
            }
            var attribute = new Attribute(name, value.choices, new StringHelper(), hidden);
            this.$attributes.push(attribute);
		}.bind(this));
	},
	
	getAttributeByName: function (name) {
		var retval = null;
		Array.each(this.$attributes, function(attr) {
			if (attr.getName() === name) {
				retval = attr;
			}
		}.bind(this));
		
		return retval;
	},
	
	getAttributeByPos: function (pos) {
		return this.$attributes[pos];
	},

	sortAttributes: function (positions) {
		var attributes = [];
		Array.each(positions, function (pos) {
			var attr = this.getAttributeByPos(pos);
			attributes.push(attr);
		}.bind(this));
		
		this.$attributes = attributes;
	},

    removeAttribute: function(attribute) {
        attribute.setHidden(true);

        this.$hiddenAttributes.include(attribute.getName());

        this.requestHiddenAttributes();
    },

    requestHiddenAttributes: function() {
        var hiddenAttributesString = String.from(this.$hiddenAttributes);
        var url = this.$config.getMinerSetConfigParamUrl('hiddenAttributes',hiddenAttributesString);

        //region vloení nového rulesetu
        new Request.JSON({
            url: url,
            secure: true,
            onSuccess: function (responseJSON, responseText) {
                console.log('Hidden attributes saved to server');
            }.bind(this),
            onError: function () {
                console.log('Unable to save hidden attributes to server');
            }.bind(this),
            onFailure: function () {
                console.log('Unable to save hidden attributes to server');
            }.bind(this),
            onException: function () {
                console.log('Unable to save hidden attributes to server');
            }.bind(this),
            onTimeout: function () {
                console.log('Unable to save hidden attributes to server');
            }.bind(this)
        }).get();
        //endregion
    },

    showHiddenAttributes: function() {
        var hiddenAttributes = this.getHiddenAttributes();
        Array.each(hiddenAttributes, function (name) {
            var attr = this.getAttributeByName(name);
            if(attr){
                attr.setHidden(false);
            }
        }.bind(this));
        this.$hiddenAttributes = [];
        this.requestHiddenAttributes();
    },

    parseFields: function (fields) {
        Object.each(fields, function (value, name) {
            var field = new APField(name, value, new StringHelper());
            this.$fields.push(field);
        }.bind(this));
    },

    getHiddenAttributes: function(id) {
        return this.$hiddenAttributes;
    },

    hasHiddenAttributes: function() {
        return this.$hiddenAttributes.length > 0;
    },

    setHiddenAttributes: function(data) {
	if (typeof data === "undefined"){
	  this.$hiddenAttributes = [];
	}else{
       	  this.$hiddenAttributes = (data.length > 0) ? data.split(',') : [];
	}
    }
	
});
