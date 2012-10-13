var DataParser = new Class({
	
	config: null,
    $settings: null,
    $async: true,
	DD: null,
	FLs: [],
	FGC: null,
	
	initialize: function (config, settings, async) {
		this.config = config;
        this.$settings = settings;
        this.$async = async;
	},

	getData: function (callback, errCallback, bind, delay) {
        var data = JSON.encode({
            debug: this.$settings.getDebug()
        });

		new Request.JSON({
			url: this.config.getDataGetURL(),
			secure: true,
			async: this.$async,

			onSuccess: function (responseJSON, responseText) {
                if (responseJSON.status == 'error') {
                    errCallback.delay(delay, bind);
                    return;
                }
				this.parseData(responseJSON, this.config.getIdDm());

                if (instanceOf(callback, Function)) {
                    callback.delay(delay, bind);
                }
			}.bind(this),
			
			onError: function (text, error) {
				errCallback.delay(delay, bind);
			}
		
		}).post({'data': data});
	},
	
	parseData: function (data, id) {
		this.DD = new DataDescription(id, new Storage());
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