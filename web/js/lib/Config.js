var Config = new Class({//TODO Standa: update URLs

  GetterSetter: ['stopMiningUrl', 'supportUrl', 'joomlaURL', 'showFeedback', 'easyMinerCenterUrl'],

  // app info
  name: 'EasyMiner',
  version: '2.0-dev',
  slogan: 'easy association rule mining',
  copyright: '<a href="http://kizi.vse.cz" title="Department of Information and Knowledge Engineering">KIZI</a>, <a href="http://www.vse.cz">University of Economics</a>, Prague',
  rulesPerPage: 20,

  // language
  lang: 'en',

  //region EasyMinerCenter config
  //TODO
  $easyMinerCenterUrl: '/easyminercenter',
  newMinerUrl: '/em/data/new-miner',
  userLoginUrl: '/em/user/login',
  userLogoutUrl: '/em/user/logout',
  userDetailsUrl: '/em/user/details',
  userInfoUrl: '/em/user/info',
  getDataUrl: '/em/izi-ui/get-data',
  loadMinerDataUrl: '/em/helper/load-data',
  saveMinerDataUrl: '/em/helper/save-data',
  showAttributeHistogramUrl: '/em/data/attribute-histogram',
  showColumnHistogramUrl: '/em/data/column-histogram',
  addAttributeUrl: '/em/attributes/add-attribute',
  getRulesUrl: '/em/tasks/get-rules',
  startMiningUrl: '/em/tasks/start-mining',
  stopMiningUrl: '/em/tasks/stop-mining',
  taskRenameUrl: '/em/tasks/rename-task',
  ruleClipboardGetTasksUrl: '/em/rule-clipboard/get-tasks',
  ruleClipboardGetRulesUrl:'/em/rule-clipboard/get-rules',
  ruleClipboardAddRuleUrl:'/em/rule-clipboard/add-rule',
  ruleClipboardAddAllRulesUrl:'/em/rule-clipboard/add-all-rules',
  ruleClipboardRemoveRuleUrl:'/em/rule-clipboard/remove-rule',

  ruleClipboardAddToKnowledgeBaseUrl: '/em/rule-clipboard/add-to-ruleset',//TODO Standa

  knowledgeBaseGetRulesUrl:'/em/knowledge-base/get-rules',//TODO Standa
  knowledgeBaseGetRulesetsUrl: '/em/knowledge-base/rulesets',//TODO Standa
  knowledgeBaseAddRulesetUrl: '/em/knowledge-base/add-ruleset',//TODO Standa
  knowledgeBaseAddRuleUrl: '/em/knowledge-base/add-rule',//TODO Standa
  knowledgeBaseRemoveRuleUrl: '/em/knowledge-base/remove-rule',//TODO Standa
  knowledgeBaseRulesetRenameUrl: '/em/knowledge-base/rename-ruleset',//TODO Standa

  showRuleDetailsUrl: '/em/rules/rule-details',
  showTaskDetailsUrl: '/em/tasks/task-details',
  getTaskPMMLUrl: '/em/tasks/task-pmml',
  //endregion

  // URL settings
  $joomlaURL: 'http://sewebar-dev.lmcloud.vse.cz/',
  $showFeedback: false,
  params: {},
  ////BKGetURL: 'getBK.php',
  ETreeGetURL: 'getEtree.php',
  rulesGetURL: 'getRules.php',
  reportSaveUrl: 'saveReport.php',

  $supportUrl: 'http://easyminer.eu/',

  perPageOptions: [10, 20, 50, 100],

  // root element
  rootElementID: 'IZIMiner',

  initialize: function () {
  },

  getName: function () {
    return this.name;
  },

  getVersion: function () {
    return this.version;
  },

  getSlogan: function () {
    return this.slogan;
  },

  getCopyright: function () {
    return this.copyright;
  },

  getLang: function () {
    return this.lang;
  },

  setLang: function (lang) {
    this.lang = lang;
  },

  setJoomlaURL: function (url) {
    this.$joomlaURL = url;
  },

  setParams: function (params) {
    this.params = params;
  },

  getIdDm: function () {
    return this.params.id_dm;
  },

  /*getBKAskURL: function () {
    return this.BKGetURL + '?' + 'id_dm=' + this.params.id_dm + '&id_kb=' + this.params.id_kb + '&action=ask&lang=' + this.lang;
  },

  getBKSaveInterestingURL: function () {
    return this.BKGetURL + '?' + 'id_dm=' + this.params.id_dm + '&id_kb=' + this.params.id_kb + '&action=saveInteresting&lang=' + this.lang;
  },

  getBKSaveNotInterestingURL: function () {
    return this.BKGetURL + '?' + 'id_dm=' + this.params.id_dm + '&id_kb=' + this.params.id_kb + '&action=saveNotInteresting&lang=' + this.lang;
  },

  setBKGetURL: function (url) {
    this.BKGetURL = url;
  },*/

  getDataGetURL: function () {
    return this.dataGetURL + "?id_dm=" + this.params.id_dm + '&lang=' + this.lang;
  },

  setDataGetURL: function (url) {
    this.dataGetURL = url;
  },

  getRulesGetURL: function () {
    return this.rulesGetURL + "?id_dm=" + this.params.id_dm + (this.params.sleep ? '&sleep=' + this.params.sleep : '') + '&lang=' + this.lang;
  },

  setRulesGetURL: function (URL) {
    this.rulesGetURL = URL;
  },

  getReportSaveUrl: function () {//TODO
    return this.$joomlaURL + 'index.php?option=com_dbconnect&controller=data&task=savePMMLArticle&format=raw';
  },

  getListAnalyticalReportsUrl: function () {
    return this.$easyMinerCenterUrl+this.loadMinerDataUrl+'?miner='+this.params.id_dm;
  },

  getLoadClipboardUrl: function () {
    return this.$easyMinerCenterUrl+this.loadMinerDataUrl+'?miner='+this.params.id_dm;;
  },

  getETreeGetURL: function () {
    return this.ETreeGetURL + "?id_dm=" + this.params.id_dm;
  },

  getAddAttributeURL: function (fieldName) {
    return this.$easyMinerCenterUrl + this.addAttributeUrl + '?columnName='+encodeURIComponent(fieldName) + '&miner=' + this.params.id_dm + '&mode=iframe';
  },

  getShowHistogramURL: function (name, type) {
    if (type === 'attribute') {
      return this.$easyMinerCenterUrl + this.showAttributeHistogramUrl +'?miner='+ this.params.id_dm + '&attribute=' + encodeURIComponent(name) + '&mode=iframe';
    } else {
      return this.$easyMinerCenterUrl + this.showColumnHistogramUrl +'?miner='+ this.params.id_dm + '&columnName=' + encodeURIComponent(name) + '&mode=iframe';
    }
  },

  getCreateUserReportUrl: function () {//TODO
    return this.$joomlaURL + 'index.php?option=com_dbconnect&controller=izi&task=newReportArticle&tmpl=component&kbi=' + this.params.id_dm;
  },

  getShowReportUrl: function (reportId) {//TODO
    return this.$joomlaURL + 'index.php?option=com_dbconnect&controller=data&task=showArticle&article=' + reportId;
  },

  getExportBusinessRulesUrl: function (taskId, rulesIds) {//TODO
    return this.$joomlaURL + 'index.php?option=com_dbconnect&controller=data&task=exportBR&format=raw&kbi=' + this.params.id_dm + '&lmtask=' + taskId + '&rules=' + rulesIds.join();
  },

  getModelTesterUrl: function (taskId, rulesIds) {//TODO
    return this.$joomlaURL + 'index.php?option=com_dbconnect&controller=data&task=modelTester&tmpl=component&kbi=' + this.params.id_dm + '&lmtask=' + taskId + '&rules=' + rulesIds.join();
  },

  //region easyMinerCenterUrls
  getUserLoginUrl: function () {
    return this.$easyMinerCenterUrl+this.userLoginUrl+'?url='+encodeURIComponent(location.href);
  },

  getUserLogoutUrl: function () {
    return this.$easyMinerCenterUrl+this.userLogoutUrl;
  },

  getUserDetailsUrl: function () {
    return this.$easyMinerCenterUrl+this.userDetailsUrl;
  },

  getUserInfoUrl: function(){
    return this.$easyMinerCenterUrl+this.userInfoUrl;
  },

  getNewTaskURL: function () {
    return this.$easyMinerCenterUrl+this.newMinerUrl;
  },

  getRuleDetailsUrl:function(taskId,ruleId){
    return this.$easyMinerCenterUrl+this.showRuleDetailsUrl
      + '?miner=' + this.params.id_dm
      + '&task=' + taskId
      + '&rule=' + ruleId
      + '&mode=iframe';
  },

  getTaskDetailsUrl:function(taskId){
    return this.$easyMinerCenterUrl+this.showTaskDetailsUrl
      + '?miner=' + this.params.id_dm
      + '&task=' + taskId;
  },

  getGetDataURL: function () {
    return this.$easyMinerCenterUrl+this.getDataUrl + "?id_dm=" + this.params.id_dm + '&lang=' + this.lang;
  },
  //endregion easyMinerCenterUrls

  getRootElementID: function () {
    return this.rootElementID;
  },

  //region mining
  getStartMiningUrl: function (taskId) {
    return this.$easyMinerCenterUrl+this.startMiningUrl + '?miner=' + this.params.id_dm + '&task=' + taskId;
  },
  getStopMiningUrl: function (taskId) {
    return this.$easyMinerCenterUrl+this.stopMiningUrl + '?miner=' + this.params.id_dm+ '&task=' + taskId;
  },
  getGetRulesUrl: function (taskId,offset,limit,order) {
    offset = (typeof offset === "undefined") ? 0 : offset;
    limit = ((typeof limit === "undefined") || (limit == null) || (limit == 0)) ? this.rulesPerPage : limit;
    order = (typeof order === "undefined") ? '' : order;

    return this.$easyMinerCenterUrl+this.getRulesUrl
    + '?miner=' + this.params.id_dm
    + '&task=' + taskId
    + '&offset=' + offset
    + '&limit=' + limit
    + '&order=' + order;
  },
  //endregion mining

  //region knowledgeBase
  getKnowledgeBaseGetRulesUrl: function (rulesetId,offset,limit,order) {
    offset = (typeof offset === "undefined") ? 0 : offset;
    limit = ((typeof limit === "undefined") || (limit == null) || (limit == 0)) ? this.rulesPerPage : limit;
    order = (typeof order === "undefined") ? '' : order;

    return this.$easyMinerCenterUrl+this.knowledgeBaseGetRulesUrl
      + '?miner=' + this.params.id_dm //atribut je pouze volitelný, pokud je použit, je daný ruleset nastaven jako výchozí
      + '&ruleset=' + rulesetId
      + '&offset=' + offset
      + '&limit=' + limit
      + '&order=' + order;
  },
  getKnowledgeBaseGetRulesetsUrl: function () {
    return this.$easyMinerCenterUrl+this.knowledgeBaseGetRulesetsUrl
      + '?miner=' + this.params.id_dm;
  },
  getKnowledgeBaseAddRulesetUrl: function(name){
    return this.$easyMinerCenterUrl+this.knowledgeBaseAddRulesetUrl
      + '?miner=' + this.params.id_dm //atribut je pouze volitelný (pokud je použit, je nastaven daný ruleset jako výchozí)
      + 'name=' + name;
  },
  getKnowledgeBaseRulesetRenameUrl: function (rulesetId, newName) {
    return this.$easyMinerCenterUrl+this.taskRenameUrl
      + '?ruleset=' + rulesetId
      + '&name=' + newName;
  },
  getKnowledgeBaseAddRuleUrl: function (rulesetId, ruleId) {
    return this.$easyMinerCenterUrl+this.knowledgeBaseAddRuleUrl
      + '?ruleset=' + rulesetId
      + '&rules=' + ruleId;//jako parametr je možné zadat i více ID oddělených čárkou
  },
  getKnowledgeBaseAddRuleClipboardUrl: function(rulesetId,taskId){
    return this.$easyMinerCenterUrl+this.ruleClipboardAddToKnowledgeBaseUrl
      + '?miner=' + this.params.id_dm
      + '&task=' + taskId
      + '&ruleset=' + rulesetId
  },
  getKnowledgeBaseRemoveRuleUrl: function (rulesetId, ruleId) {
    return this.$easyMinerCenterUrl+this.knowledgeBaseRemoveRuleUrl
      + '?ruleset=' + rulesetId
      + '&rules=' + ruleId;//jako parametr je možné zadat i více ID oddělených čárkou
  },
  //endregion knowledgeBase

  //region ruleClipboard
  getRuleClipboardGetRulesUrl: function (taskId,offset,limit,order) {
    offset = (typeof offset === "undefined") ? 0 : offset;
    limit = ((typeof limit === "undefined") || (limit == null) || (limit == 0)) ? this.rulesPerPage : limit;
    order = (typeof order === "undefined") ? '' : order;

    return this.$easyMinerCenterUrl+this.ruleClipboardGetRulesUrl
    + '?miner=' + this.params.id_dm
    + '&task=' + taskId
    + '&offset=' + offset
    + '&limit=' + limit
    + '&order=' + order;
  },
  getRuleClipboardGetTasksUrl: function () {
    return this.$easyMinerCenterUrl+this.ruleClipboardGetTasksUrl
    + '?miner=' + this.params.id_dm;
  },
  getRuleClipboardAddRuleUrl: function (taskId, ruleId) {
    return this.$easyMinerCenterUrl+this.ruleClipboardAddRuleUrl
    + '?miner=' + this.params.id_dm
    + '&task=' + taskId
    + '&rules=' + ruleId;//jako parametr je možné zadat i více ID oddělených čárkou
  },
  getRuleClipboardAddAllRulesUrl: function(taskId,ruleIds){
    if (ruleIds == undefined){
      ruleIds='';
    }
    return this.$easyMinerCenterUrl+this.ruleClipboardAddAllRulesUrl
      + '?miner=' + this.params.id_dm
      + '&task=' + taskId
      + '&returnRules=' + ruleIds;//jako parametr je možné zadat i více ID oddělených čárkou
  },
  getRuleClipboardRemoveRuleUrl: function (taskId, ruleId) {
    return this.$easyMinerCenterUrl+this.ruleClipboardRemoveRuleUrl
    + '?miner=' + this.params.id_dm
    + '&task=' + taskId
    + '&rules=' + ruleId;//jako parametr je možné zadat i více ID oddělených čárkou
  },
  //endregion
  getTaskRenameUrl: function (taskId, newName) {
    return this.$easyMinerCenterUrl+this.taskRenameUrl
      + '?miner=' + this.params.id_dm
      + '&task=' + taskId
      + '&name=' + newName;
  },


  getPerPageOptions: function(){
    return this.perPageOptions;
  },

  getPaginatorType: function(){
    //return 'selectPaginator';
    return 'linksPaginator';
  },

  getAutoShowAttributeBinningDialog: function(){//TODO udělat konfigurovatelné
    return false;
  }

});