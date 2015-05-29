var MiningManager = new Class({

  config: null,
  settings: null,
  FRManager: null,
  dateHelper: null,
  $taskManager: null,

  requests: [],
  inProgress: false,
  finishedStates: ['solved', 'interrupted', 'solved_heads'],
  errorStates: ['failed'],
  reqDelay: 2500,
  miningState: null,

  initialize: function (config, settings, FRManager, dateHelper, taskManager) {
    this.config = config;
    this.settings = settings;
    this.FRManager = FRManager;
    this.dateHelper = dateHelper;
    this.$taskManager = taskManager;
  },

  mineRules: function (rule, limitHits) {
    this.inProgress = true;
    this.miningState = null;
    this.FRManager.handleInProgress();
    this.$taskManager.addTask(rule.serialize(), limitHits);
    this.makeRequest(JSON.encode(this.$taskManager.getActiveTask().getRequestData()));
  },

  makeRequest: function (data) {
    var activeTask = this.$taskManager.getActiveTask();
    if (!activeTask) {
      return;
      /*TODO zobrazení info...*/
    }
    var request = new Request.JSON({
      url: this.config.getStartMiningUrl(activeTask.getId()),
      secure: true,

      onSuccess: function (responseJSON, responseText) {
        if (/*responseJSON.status === 'ok' && */!this.errorStates.contains(responseJSON.state)) {
          this.handleSuccessRequest(data, responseJSON);
        } else {
          this.handleErrorRequest();
        }
      }.bind(this),

      onError: function () {
        this.handleErrorRequest();
      }.bind(this),

      onFailure: function () {
        this.handleErrorRequest();
      }.bind(this),

      onException: function () {
        this.handleErrorRequest();
      }.bind(this),

      onTimeout: function () {
        this.handleErrorRequest();
      }.bind(this)

    }).post({'data': data});

    this.requests.push(request);
  },

  handleSuccessRequest: function (data, responseJSON) {
    if (!this.inProgress) {
      return;
    }

    var state = responseJSON.state;
    var rulesCount = responseJSON.rulesCount;
    var taskName = '';
    if (responseJSON.name != undefined && responseJSON.name!=''){
      taskName = responseJSON.name;
    }
    this.miningState = state;

    if (this.finishedStates.contains(state)) {
      // task is finished
      this.inProgress = false;
      //pokud jsou importovány jen hlavičky, pošleme ještě jeden požadavek
      if (this.miningState='solved_heads'){
        setTimeout(function(){
        var activeTask = this.$taskManager.getActiveTask();
          var request = new Request.JSON({
            url: this.config.getStartMiningUrl(activeTask.getId()),
            secure: true,
            async: true
          }).post({'data': data});
          setTimeout(function(){request.cancel();}.bind(this),1000);
        }.bind(this),1000);
      }
    } else { // task is still running
      this.makeRequest.delay(this.reqDelay, this, data);
    }

    this.FRManager.renderRules(rulesCount, taskName, this.inProgress, this.$taskManager.getActiveTask());
  },

  handleErrorRequest: function () {
    if (!this.inProgress) {
      return;
    }
    this.miningState = 'failed';
    this.stopMining();
    this.FRManager.handleError();
//        throw 'Failed task: ID: ' + this.$taskManager.getActiveTask().getId() + ', source ID: ' + this.config.getIdDm();
  },

  stopMining: function () {
    // stop all requests
    Array.each(this.requests, function (req) {
      if (req.isRunning()) {
        req.cancel();
      }
    });

    // stop remote LM mining
    if (this.inProgress) { // hack around req.cancel(); weird bug
      this.inProgress = false;
      this.miningState = 'interrupted';
      this.stopRemoteMining(this.config.getStopMiningUrl(this.$taskManager.getActiveTask().getId()), this.$taskManager.getActiveTask().getDebug(), this.$taskManager.getActiveTask().getTaskMode());
    }

    this.requests = [];
    this.$taskManager.clearActiveTask();
    this.FRManager.handleStoppedMining();
  },

  getInProgress: function () {
    return this.inProgress;
  },

  getMiningState: function () {
    return this.miningState;
  },

  stopRemoteMining: function (url, debug, taskMode) {
    var data = JSON.encode({
      //taskId: taskId,
      debug: debug,
      //joomlaUrl: joomlaUrl,
      taskMode: taskMode
    });

    new Request.JSON({
      url: url,
      secure: true
    }).post({'data': data});
  }
});