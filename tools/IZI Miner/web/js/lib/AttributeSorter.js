var AttributeSorter = new Class({
	
	DD: null,
	AR: null,
	
	initialize: function(DD, AR) {
		this.DD = DD;
		this.AR = AR;
	},
	
	sort: function(attributes, recommendation) {
		recommendation = recommendation || [];
		var positions = [];
		
		// sort recommended attributes
		Object.each(recommendation, function(value, name) {
			var index = attributes.indexOfObject(name, Attribute.prototype.getName);
			positions.push(index);
			attributes[index].setValue(value);
		}.bind(this));
		
		// sort remaining attributes
		var usedPositions = [];
		Array.each(attributes, function (value, key) {
			if (this.AR.isAttributeUsed(value)) {
				usedPositions.push(key);
				attributes[key].setValue(0);
			} else if (!positions.contains(key)) { 
				positions.push(key);
				attributes[key].setValue(0);
			}
		}.bind(this));
		positions.append(usedPositions);
		
		return positions;
	}
	
});