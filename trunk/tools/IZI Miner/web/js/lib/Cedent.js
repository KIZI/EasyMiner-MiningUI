var Cedent = new Class({

    GetterSetter: ['id', 'level', 'stringHelper', 'connective', 'children', 'scope'],

	$id: 0,
	$level: 0,
	$connective: null,
    $children: [],
	$scope: '',

	initialize: function (id, level, connective, children, scope) {
		this.$id = id;
		this.$level = level;
		this.$connective = connective;
        this.$children = children || [];
		this.$scope = scope;
	},

    parseFromObject: function(data) {
        var me = this,
            child;

        this.$id = data.id;
        this.$level = data.level;
        this.$connective = new Connective(data.connective.id, data.connective.name);

        this.$children = [];
        Array.each(data.children, function(iChild) {
            if (iChild.type === 'cedent') {
                child = new Cedent();
                child.parseFromObject(iChild);
            } else {
                if (iChild.category === 'One category') {
                    child = new FieldAR(new Date().getTime(), iChild.ref, iChild.category, iChild.localizedName, new StringHelper(), iChild.fields[0].value[0]);
                }
            }

            me.$children.push(child);
        });
        this.$scope = data.$scope;
    },
	
	getNextLevel: function () {
		return (this.$level + 1);
	},

    addChild: function(child, position) {
        if (position !== undefined) {
            this.$children = this.$children.insertAt(child, position);
        } else {
            this.$children.include(child);
        }
    },

    removeChild: function(child) {
        this.$children.each(function(c) {
            if (child === c) {
                this.$children.erase(child);
            } else if (!instanceOf(child, Cedent) && instanceOf(c, Cedent)) {
                c.removeChild(child);
            }
        }.bind(this));

        this.update();
    },

    getNumChildren: function() {
        return this.$children.length;
    },

    getNumChildCedents: function() {
        var count = 0;
        this.$children.each(function(child) {
            if (instanceOf(child, Cedent)) {
                count++;
                count += child.getNumChildCedents();
            }
        }.bind(this));

        return count;
    },

    getFields: function() {
        var fields = [];
        this.$children.each(function(child) {
            if (instanceOf(child, Cedent)) {
                fields.append(child.getFields());
            } else {
                fields.push(child);
            }
        }.bind(this));

        return fields;
    },

    getNumFields: function(maxLevel) {
        maxLevel = maxLevel || Infinity;

        var count = 0;
        this.$children.each(function(child) {
            if (instanceOf(child, Cedent)) {
                count += child.getNumFields(maxLevel);
            } else if (this.$level <= maxLevel) {
                count++;
            }
        }.bind(this));

        return count;
    },

	groupChildren: function (cedent) {
        var cedentPosition = undefined, childrenToBeRemoved = [], that = this;
        Array.from(this.$children).each(function(child, position) {
            if (!instanceOf(child, Cedent) && child.isMarked()) {
                child.unMark();
                cedent.addChild(child);
                if (cedentPosition === undefined) {
                    cedentPosition = position;
                }

                childrenToBeRemoved.push(position);
            }
        });

        that.$children = that.$children.removeAt(childrenToBeRemoved);
        that.$children = this.$children.insertAt(cedent, cedentPosition);

        this.update();
	},

	unmarkChildren: function () {
        this.$children.each(function(child) {
            if (!instanceOf(child, Cedent) && child.isMarked()) {
                child.unMark();
            }
        }.bind(this));
	},

	getNumMarkedFields: function () {
        var count = 0;
        this.$children.each(function(child) {
            if (!instanceOf(child, Cedent) && child.isMarked()) {
                count++;
            }
        }.bind(this));

		return count;
	},

	getCSSID: function () {
		return 'cedent-' + this.$id;
	},
	
	getCSSEditConnectiveID: function () {
		return 'edit-connective-' + this.$id;
	},
	
	getCSSAddCedentID: function () {
		return 'add-cedent-' + this.$id;
	},
	
	getCSSFieldsID: function () {
		return 'cedent-fields-' + this.$id;
	},
	
	getCSSGroupFieldsConfirmID: function () {
		return 'group-fields-confirm-' + this.$id;
	},
	
	getCSSInfoID: function () {
		return 'cedent-info-' + this.$id;
	},
	
	getCSSRemoveID: function () {
		return 'remove-cedent-' + this.$id;
	},
	
	getCSSChangeSignID: function () {
		return 'change-cedent-sign-' + this.$id;
	},
	
	isEmpty: function () {
        return (this.$children.length === 0);
	},

    hasOpeningBracket: function(position, level) {
        level = level || this.$level;

        var bracket = this.getBracketByPosition(position);
        var logical = (bracket && bracket.level === level && bracket.start === position) ? true : false;

        return logical;
    },

    hasClosingBracket: function(position, level) {
        level = level || this.$level;

        var bracket = this.getBracketByPosition(position);
        var logical = (bracket && bracket.level === level && bracket.end === position) ? true : false;

        return logical;
    },

    getBracketByPosition: function(position) {
        var bracket = null;
        var brackets = this.getBrackets();
        for (i = 0; i < brackets.length; i++) {
            bracket = brackets[i];
            if (bracket.start === position || bracket.end === position) {
                return bracket;
            }
        }

        return bracket;
    },

    getBrackets: function() {
        var brackets = [];

        var levels = this.getFieldLevels();
        var index = 0;
        var bracket = {};
        var bracketSize = 0, bracketLevel = 1, bracketOpened = false;
        levels.each(function(level) {
            index++;
            if (index === levels.length) { // last item
                if (++bracketSize > 1 && bracketOpened) {
                    bracket = {level: bracketLevel, start: index - bracketSize + 1, end: index};
                    brackets.push(bracket);
                }
            } else if (level !== bracketLevel) { // close bracket
                if (bracketSize > 1 && bracketOpened) {
                    bracket = {level: bracketLevel, start: index - bracketSize, end: index - 1};
                    brackets.push(bracket);
                }

                bracketSize = 1; bracketLevel = level; bracketOpened = true;
            } else { // next item in bracket
                bracketSize++;
            }
        }.bind(this));

        return brackets;
    },

    getFieldLevels: function() {
        var levels = [];
        this.$children.each(function(child) {
            if (instanceOf(child, Cedent)) {
                levels = levels.concat(child.getFieldLevels());
            } else {
                levels.push(this.getLevel());
            }
        }.bind(this));

        return levels;
    },
	
	displayGroupButton: function () {
        return (this.getNumMarkedFields() > 1);
	},
	
	/* misc */
	isAttributeUsed: function (attribute) {
		var used = false;
		this.$children.each(function(child) {
            if (instanceOf(child, Cedent)) {
                if (child.isAttributeUsed(attribute)) {
                    used = true;
                }
            } else {
                if (child.getAttributeName() === attribute.getName()) {
                    used = true;
                }
            }
        }.bind(this));
		
		return used;
	},
	
	isValid: function () {
		var valid = true;
        this.$children.each(function(child) {
            if (instanceOf(child, Cedent)) {
                if (!child.isValid()) {
                    valid = false;
                }
            } else if (!child.getType()) {
                valid = false;
            }
        });

		return valid;
	},
	
	serialize: function () {
		var serialized = {};
        serialized.type = 'cedent';
        serialized.connective = this.$connective.serialize();
        serialized.level = this.$level;
        serialized.children = [];

        this.$children.each(function(child) {
            serialized.children.push(child.serialize()); // APField or Cedent
        }.bind(this));

		return serialized;
	},

    toString: function () {
        if (this.isEmpty()) { return '<div class="cedent">Empty</div>'; }

        var index = 1;

        var string = '<div class="cedent"><div class="fields">';
        if (this.hasOpeningBracket(index)) {
            string += '<span class="left-bracket">(</span>';
        }

        this.$children.each(function(child) {
            string += child.toString(); // APField or Cedent

            if (index < this.getNumChildren()) { // Connective
                string += this.$connective.toString();
                index++;
            }
        }.bind(this));

        if (this.hasClosingBracket(index)) {
            string += '<span class="right-bracket">)</span>';
        }

        string += '</div></div>'

        return string;
    },

    toSettings: function() {
        var settings = {};
        var connective = {};
        connective[this.$connective.getName()] = true;
        settings[this.$level] = connective;

        this.$children.each(function(child) {
            if (instanceOf(child, Cedent)) {
                Object.each(child.toSettings(), function(value, key) {
                    settings[key] = value;
                }.bind(this));
            }
        }.bind(this));

        return settings;
    },

	update: function () {
		if (this.getNumFields(this.$level) === 0 && this.getNumChildren() === 1) {
            this.$connective = this.$children[0].getConnective();
            this.$children = this.$children[0].getChildren();
		}

        this.$children.each(function(child) {
            if (instanceOf(child, Cedent) && child.getNumFields() === 0) {
                this.removeChild(child);
            } else if (instanceOf(child, Cedent) && child.getNumFields(child.getLevel()) === 1) {
                this.removeChild(child);
                this.addChild(child.getChildren()[0]);
            }
        }.bind(this));
	}

});