/**
 * Class FieldGroupConfig
 * @license http://www.apache.org/licenses/LICENSE-2.0 Apache License, Version 2.0
 * @link http://github.com/kizi/easyminer-miningui
 *
 * @type Class
 */
var FieldGroupConfig = new Class({
	
	DD: null,
	fieldGroupRootConfigID: 0,
	fieldGroups: {},
	
	initialize: function (DD, data) {
		this.DD = DD;
		this.parseFieldGroups(data);
	},

	parseFieldGroups: function (data) {
		this.fieldGroupRootConfigID = data.rootConfigID;

		Object.each(data.groups, function (value, key) {
			var FG = new FieldGroup(value.id, value.name, value.localizedName, value.explanation, value.childGroups,
									value.connective, (value.id === this.fieldGroupRootConfigID));
			Object.each(value.fieldConfig, function (value, key) { 
				var F = null;
				if (value.coefficient === null) {
					F = new Field(0, this.DD.getAttributeByName(key), null, null, new StringHelper());
				} else if (value.coefficient.type === 'One category') {
					F = new Field(0, this.DD.getAttributeByName(key), value.coefficient.type, value.coefficient.localizedName, new StringHelper(), value.coefficient.category);
				} else {
					F = new Field(0, this.DD.getAttributeByName(key), value.coefficient.type, value.coefficient.localizedName, new StringHelper(), value.coefficient.minimalLength, value.coefficient.maximalLength);
				}
				
				FG.addField(F.getRef().getName(), F);
			}.bind(this));
			this.fieldGroups[value.id] = FG;
		}.bind(this));
	},
	
	getFieldGroupRootConfigID: function () {
		return this.fieldGroupRootConfigID;
	},
	
	getFieldGroup: function (id) {
		if (this.fieldGroups.hasOwnProperty(id)) {
			return this.fieldGroups[id];
		}
		
		return null;
	}
	
});