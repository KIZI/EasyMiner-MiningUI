var DataParser = new Class({
	
	config: null,
    $async: true,
	DD: null,
	FLs: [],
	FGC: null,
	
	initialize: function (config, async) {
		this.config = config;
        this.$async = async;
	},
	
	getData: function (callback, errCallback, bind, delay) {
		new Request.JSON({
			url: this.config.getDataGetURL(),
			secure: true,
			async: this.$async,

			onSuccess: function (responseJSON, responseText) {
                if (responseJSON.status == 'error') {
                    errCallback.delay(delay, bind);
                    return;
                }
				this.parseData(responseJSON);

                if (instanceOf(callback, Function)) {
                    callback.delay(delay, bind);
                }
			}.bind(this),
			
			onError: function (text, error) {
				errCallback.delay(delay, bind);
			}
		
		}).get();
	},
	
	parseData: function (data) {
		this.DD = new DataDescription(data.DD, new Storage());
        this.DD.parse(data.DD);
		
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