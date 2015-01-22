var Config = new Class({//TODO Standa: update URLs

  GetterSetter: ['stopMiningUrl', 'supportUrl', 'joomlaURL', 'showFeedback', 'easyMinerCenterUrl'],

  // app info
  //author: 'Radek Skrabal (<a href="mailto:radek@skrabal.me">radek@skrabal.me</a>)',
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
  ruleClipboardRemoveRuleUrl:'/em/rule-clipboard/remove-rule',

  showRuleDetailsUrl: '/em/rules/rule-details',
  getAnalyticalReportsUrl: '/em/reports/get-analytical-reports',//FIXME Standa
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

  getAuthor: function () {
    return this.author;
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
/*
  getEditAttributeURL: function (attributeName) {//TODO
    return this.$joomlaURL + 'index.php?option=com_dbconnect&controller=izi&task=editAttribute&attribute=' + encodeURIComponent(attributeName) + '&kbi=' + this.params.id_dm + '&tmpl=component';
  },*/

  getShowHistogramURL: function (name, type) {
    if (type === 'attribute') {
      return this.$easyMinerCenterUrl + this.showAttributeHistogramUrl +'?miner='+ this.params.id_dm + '&attribute=' + encodeURIComponent(name) + '&mode=iframe';
    } else {
      return this.$easyMinerCenterUrl + this.showColumnHistogramUrl +'?miner='+ this.params.id_dm + '&columnName=' + encodeURIComponent(name) + '&mode=iframe';
    }
  },

  getCreateReportUrl: function () {//TODO
    return this.$joomlaURL + 'index.php?option=com_dbconnect&controller=data&task=saveMinerData&format=raw&type=clipboard&kbi=' + this.params.id_dm;
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

  getGetDataURL: function () {
    return this.$easyMinerCenterUrl+this.getDataUrl + "?id_dm=" + this.params.id_dm + '&lang=' + this.lang;
  },
  //endregion easyMinerCenterUrls

  getRootElementID: function () {
    return this.rootElementID;
  },


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
    //TODO
    order='';

    return this.$easyMinerCenterUrl+this.getRulesUrl
    + '?miner=' + this.params.id_dm
    + '&task=' + taskId
    + '&offset=' + offset
    + '&limit=' + limit
    + '&order=' + order;
  },
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
  getRuleClipboardRemoveRuleUrl: function (taskId, ruleId) {
    return this.$easyMinerCenterUrl+this.ruleClipboardRemoveRuleUrl
    + '?miner=' + this.params.id_dm
    + '&task=' + taskId
    + '&rules=' + ruleId;//jako parametr je možné zadat i více ID oddělených čárkou
  },

  getTaskRenameUrl: function (taskId, newName) {
    return this.$easyMinerCenterUrl+this.ruleClipboardRemoveRuleUrl
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
  }

});