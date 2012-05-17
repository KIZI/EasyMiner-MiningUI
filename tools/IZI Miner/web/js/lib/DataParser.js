var DataParser = new Class({
	
	config: null,
	DD: null,
	FLs: [],
	FGC: null,
	
	initialize: function (config) {
		this.config = config;
	},
	
	getData: function () {
		new Request.JSON({
			url: this.config.getDataGetURL(),
			secure: true,
			async: false,
			
			onSuccess: function (responseJSON, responseText) {
				this.parseData(responseJSON);
			}.bind(this),
			
			onError: function (text, error) {
				throw 'Error | could not get init data';
			}
		
		}).get();
	},
	
	parseData: function (data) {
		this.DD = new DataDescription(data.DD);
		
		Array.each(data.FLs, function (iFL) {
			var FL = new FeatureList(iFL);
			this.FLs.push(FL);
		}.bind(this));
		
		this.FGC = new FieldGroupConfig(this.DD, data.FGC);
	},
	
	getDD: function () {
		return this.DD;
	},
	
	getFLs: function () {
		return this.FLs;
	},
	
	getFGC: function () {
		return this.FGC;
	}
	
});