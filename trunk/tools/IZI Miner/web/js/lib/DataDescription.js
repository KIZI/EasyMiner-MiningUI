var DataDescription = new Class({

    GetterSetter: ['attributes', 'fields'],

    $id: 0,
    $attributes: [],
    $fields: [],
    $storage: null,

	initialize: function (id, storage) {
        this.$id = id;
        this.$storage = storage;
	},

    parse: function(data) {
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

	parseAttributes: function (attributes) {
        var allHiddenAttributes = this.$storage.getObj('hiddenAttributes') ? this.$storage.getObj('hiddenAttributes') : {};
        var hiddenAttributes = Object.keys(allHiddenAttributes).contains(this.$id) ? Array.from(allHiddenAttributes[this.$id]) : [];

		Object.each(attributes, function (value, name) {
            var hidden = false;
            hiddenAttributes.each(function(attributeName) {
                if (attributeName === name) {
                    hidden = true;
                }
            }.bind(this));
            if (!hidden) {
			    var attribute = new Attribute(name, value.choices, new StringHelper());
			    this.$attributes.push(attribute);
            }
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
        this.$attributes.erase(attribute);

        var allHiddenAttributes = this.$storage.getObj('hiddenAttributes') ? this.$storage.getObj('hiddenAttributes') : {};
        var hiddenAttributes = Object.keys(allHiddenAttributes).contains(this.$id) ? Array.from(allHiddenAttributes[this.$id]) : [];
        hiddenAttributes.include(attribute.getName());

        allHiddenAttributes[this.$id] = hiddenAttributes;
        this.$storage.setObj('hiddenAttributes', allHiddenAttributes);
    },

    parseFields: function (fields) {
        Object.each(fields, function (value, name) {
            var field = new APField(name, value, new StringHelper());
            this.$fields.push(field);
        }.bind(this));
    }
	
});