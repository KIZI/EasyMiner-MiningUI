var DataParser = new Class({

  config: null,
  $settings: null,
  $async: true,
  DD: null,
  minerType: '',
  minerName: '',
  rulesetId: '',
  rulesetName: '',
  FLs: [],
  FGC: null,

  initialize: function (config, settings, async) {
    this.config = config;
    this.$settings = settings;
    this.$async = async;
  },

  getData: function (callback, errCallback, bind, delay) {var data = JSON.encode({
      debug: this.$settings.getDebug()
    });

    new Request.JSON({
      url: this.config.getGetDataURL(),
      secure: true,
      async: this.$async,

      onSuccess: function (responseJSON) {
        if (responseJSON.status == 'error') {
          errCallback.delay(delay, bind);
          return;
        }
        this.parseData(responseJSON, this.config.getMinerId());

        if (instanceOf(callback, Function)) {
          callback.delay(delay, bind);
        }
      }.bind(this),
      onError: function () {
        errCallback.delay(delay, bind);
      },
      onFailure: function () {
        errCallback.delay(delay, bind);
      },
      onException: function () {
        errCallback.delay(delay, bind);
      },
      onTimeout: function () {
        errCallback.delay(delay, bind);
      }
    }).post({'data': data});
  },

  parseData: function (data, id) {
    this.DD = new DataDescription(id, this.config);
    this.DD.setHiddenAttributes(data.miner_config.hiddenAttributes);
    this.DD.parse(data.DD);

    Array.each(data.FLs, function (iFL) {
      var FL = new FeatureList(iFL);
      this.FLs.push(FL);
    }.bind(this));

    this.FGC = new FieldGroupConfig(this.DD, data.FGC);

    this.minerType=data.miner_type;
    this.minerName=data.miner_name;

    this.rulesetId=data.miner_ruleset.id;
  },

  getDD: function () {
    return this.DD;
  },

  getMinerType: function(){
    return this.minerType
  },

  getMinerName: function(){
    return this.minerName
  },

  getFLs: function () {
    return this.FLs;
  },

  getFGC: function () {
    return this.FGC;
  }

});