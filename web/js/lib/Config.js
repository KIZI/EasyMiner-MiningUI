
var Config = new Class({
    GetterSetter: ['stopMiningUrl', 'showFeedback', 'minerId', 'rootElementId'],

  rulesPerPage: 20,//TODO
  $minerId: 61,

  // language
  lang: 'en',

  //region EasyMinerCenter config
  //TODO

  newMinerUrl: "\/easyminercenter\/em\/data\/new-miner",
  //users actions
  userLoginUrl: "\/easyminercenter\/em\/user\/login",
  userInfoUrl:  "\/easyminercenter\/em\/user\/info",


  getDataUrl: "\/easyminercenter\/em\/mining-ui\/get-data?miner=__MINERID__",
  showAttributeHistogramUrl: "\/easyminercenter\/em\/data\/attribute-histogram?miner=__MINERID__&attribute=__ATTRIBUTE__&mode=iframe",
  showColumnHistogramUrl: "\/easyminercenter\/em\/data\/column-histogram?miner=__MINERID__&columnName=__COLUMNNAME__&mode=iframe",
  addAttributeUrl: "\/easyminercenter\/em\/attributes\/add-attribute?miner=__MINERID__&columName=__COLUMNNAME__&mode=iframe",
  getRulesUrl: "\/easyminercenter\/em\/tasks\/get-rules?miner=__MINERID__&task=__TASKID__&offset=-999991999&limit=-999992999&order=__ORDER__".replace('-999991999','__OFFSET__').replace('-999992999','__LIMIT__'),
  startMiningUrl: "\/easyminercenter\/em\/tasks\/start-mining?miner=__MINERID__&task=__TASKID__",
  stopMiningUrl: "\/easyminercenter\/em\/tasks\/stop-mining?miner=__MINERID__&task=__TASKID__",
  taskRenameUrl: "\/easyminercenter\/em\/tasks\/rename-task?miner=__MINERID__&task=__TASKID__&name=__NAME__",
  ruleClipboardGetTasksUrl: "\/easyminercenter\/em\/rule-clipboard\/get-tasks?miner=__MINERID__",
  ruleClipboardGetRulesUrl: "\/easyminercenter\/em\/rule-clipboard\/get-rules?miner=__MINERID__&task=__TASKID__&offset=-999991999&limit=-999992999&order=__ORDER__".replace('-999991999','__OFFSET__').replace('-999992999','__LIMIT__'),
  ruleClipboardAddRuleUrl: "\/easyminercenter\/em\/rule-clipboard\/add-rule?miner=__MINERID__&task=__TASKID__&rules=__RULEIDS__",
  ruleClipboardAddAllRulesUrl: "\/easyminercenter\/em\/rule-clipboard\/add-all-rules?miner=__MINERID__&task=__TASKID__&returnRules=__RETURNRULES__",
  ruleClipboardRemoveRuleUrl:  "\/easyminercenter\/em\/rule-clipboard\/remove-rule?miner=__MINERID__&task=__TASKID__&rules=__RULEIDS__",

  ruleClipboardAddToKnowledgeBaseUrl: "\/easyminercenter\/em\/rule-clipboard\/add-rules-to-rule-set?miner=__MINERID__&task=__TASKID__&ruleset=__RULESETID__&relation=__RELATION__",
  ruleClipboardRemoveFromKnowledgeBaseUrl: "\/easyminercenter\/em\/rule-clipboard\/remove-rules-from-rule-set?miner=__MINERID__&task=__TASKID__&ruleset=__RULESETID__",


  knowledgeBaseGetRulesUrl: "\/easyminercenter\/kb\/rule-sets\/get-rules?id=__RULESETID__&offset=-999991999&limit=-999992999&order=__ORDER__".replace('-999991999','__OFFSET__').replace('-999992999','__LIMIT__'),
  knowledgeBaseGetRuleSetsUrl: "\/easyminercenter\/kb\/rule-sets\/list",

  knowledgeBaseAddRuleSetUrl: "\/easyminercenter\/kb\/rule-sets\/new?name=__NAME__",
  knowledgeBaseRenameRuleSetUrl: "\/easyminercenter\/kb\/rule-sets\/rename?id=__RULESETID__&name=__NAME__",
  knowledgeBaseDeleteRuleSetUrl: "\/easyminercenter\/kb\/rule-sets\/delete?id=__RULESETID__",

  knowledgeBaseAddRulesUrl: "\/easyminercenter\/kb\/rule-sets\/add-rules?id=__RULESETID__&rules=__RULEIDS__&relation=__RELATION__&result=__RESULT__",
  knowledgeBaseRemoveRulesUrl: "\/easyminercenter\/kb\/rule-sets\/remove-rules?id=__RULESETID__&rules=__RULEIDS__&result=__RESULT__",
  knowledgeBaseRemoveAllRulesUrl: "\/easyminercenter\/kb\/rule-sets\/remove-all-rules?id=__RULESETID__",


  showRuleDetailsUrl: "\/easyminercenter\/em\/rules\/rule-details?miner=__MINERID__&task=__TASKID__&rule=__RULE__&mode=iframe",
  showTaskDetailsUrl: "\/easyminercenter\/em\/tasks\/task-details?miner=__MINERID__&task=__TASKID__",
  getTaskPMMLUrl: "\/easyminercenter\/em\/tasks\/task-pmml",
  //endregion


  $showFeedback: false,
  $rootElementId: 'IZIMiner',

  perPageOptions: [10, 20, 50, 100],


  initialize: function () {
  },

  getLang: function () {
    return this.lang;
  },

  setLang: function (lang) {
    this.lang = lang;
  },

  getListAnalyticalReportsUrl: function () {
    //FIXME
    console.log('not implemented: getListAnalyticalReportsUrl');
    return '';
  },

  getETreeGetURL: function () {
    //FIXME
    console.log('not implemented: getETreeGetURL');
    return '';
  },

  getAddAttributeURL: function (fieldName) {
    return  this.addAttributeUrl.replace('__MINERID__',this.getMinerId()).replace('__COLUMNNAME__',taskId(fieldName));
  },

  getShowHistogramURL: function (name, type) {
    if (type === 'attribute') {
      return  this.showAttributeHistogramUrl.replace('__MINERID__',this.getMinerId()).replace('__ATTRIBUTE__',encodeURIComponent(name));
    } else {
      return  this.showColumnHistogramUrl.replace('__MINERID__',this.getMinerId()).replace('__COLUMNNAME__',encodeURIComponent(name));
    }
  },

  //region easyMinerCenterUrls
  getUserLoginUrl: function () {
    return this.userLoginUrl+'?url='+encodeURIComponent(location.href);
  },

  getUserDetailsUrl: function () {
    return this.userDetailsUrl;
  },

  getUserInfoUrl: function(){
    return this.userInfoUrl;
  },

  getNewTaskURL: function () {
    return this.newMinerUrl;
  },

  getRuleDetailsUrl:function(taskId,ruleId){
    return this.showRuleDetailsUrl.replace('__MINERID__',this.getMinerId()).replace('__TASKID__',taskId).replace('__RULE__',ruleId);
  },

  getTaskDetailsUrl:function(taskId){
    return this.showTaskDetailsUrl.replace('__MINERID__', this.getMinerId()).replace('__TASKID__', taskId);
  },

  getGetDataURL: function () {
    return this.getDataUrl.replace('__MINERID__', this.getMinerId());
  },
  //endregion easyMinerCenterUrls

  getRootElementID: function () {
    return this.rootElementID;
  },

  //region mining
  getStartMiningUrl: function (taskId) {
    return this.startMiningUrl.replace('__MINERID__',this.getMinerId()).replace('__TASKID__',encodeURIComponent(taskId));
  },
  getStopMiningUrl: function (taskId) {
    return this.stopMiningUrl.replace('__MINERID__',this.getMinerId()).replace('__TASKID__',taskId);
  },
  getGetRulesUrl: function (taskId,offset,limit,order) {
    offset = (typeof offset === "undefined") ? 0 : offset;
    limit = ((typeof limit === "undefined") || (limit == null) || (limit == 0)) ? this.rulesPerPage : limit;
    order = (typeof order === "undefined") ? '' : order;
    return this.getRulesUrl.replace('__MINERID__',this.getMinerId()).replace('__TASKID__',taskId).replace('__OFFSET__',offset).replace('__LIMIT__',limit).replace('__ORDER__',order);
  },
  //endregion mining

  //region knowledgeBase
  getKnowledgeBaseGetRulesUrl: function (rulesetId,offset,limit,order) {
    offset = (typeof offset === "undefined") ? 0 : offset;
    limit = ((typeof limit === "undefined") || (limit == null) || (limit == 0)) ? this.rulesPerPage : limit;
    order = (typeof order === "undefined") ? '' : order;

    //FIXME
    order='';

    return this.knowledgeBaseGetRulesUrl.replace('__RULESETID__',rulesetId).replace('__OFFSET__',offset).replace('__LIMIT__',limit).replace('__ORDER__',order);
  },

  getKnowledgeBaseGetRuleSetsUrl: function () {
    return this.knowledgeBaseGetRuleSetsUrl;
  },

  getKnowledgeBaseAddRuleSetUrl: function(name){
    return this.knowledgeBaseAddRuleSetUrl.replace('__NAME__',name);
  },

  getKnowledgeBaseRenameRuleSetUrl: function (rulesetId, newName) {
    return this.knowledgeBaseRenameRuleSetUrl.replace('__RULESETID__',rulesetId).replace('__NAME__',newName);
  },
  getKnowledgeBaseDeleteRuleSetUrl: function (rulesetId){
    return this.knowledgeBaseDeleteRuleSetUrl.replace('__RULESETID__',rulesetId);
  },

  /**
   * Funkce pro sestavení adresy pro přidání pravidla do knowledge base
   * @param {string} rulesetId
   * @param {string} ruleIds  - jako parametr je možné zadat i více ID oddělených čárkou
   * @param {string} relation
   * @param {boolean} returnRules
   * @returns {string}
   */
  getKnowledgeBaseAddRulesUrl: function (rulesetId, ruleIds, relation, returnRules) {
    relation = (typeof relation === "undefined" || relation=='') ? 'positive' : relation;
    return this.knowledgeBaseAddRulesUrl.replace('__RULESETID__',rulesetId).replace('__RULEIDS__',ruleIds).replace('__RELATION__',relation).replace('__RESULT__',(returnRules?'rules':''));
  },

  /**
   * Funkce pro sestavení adresy pro odebrání pravidla z knowledge base
   * @param {string} rulesetId
   * @param {string} ruleId
   * @param {boolean} returnRules
   * @returns {string}
   */
  getKnowledgeBaseRemoveRulesUrl: function (rulesetId, ruleId, returnRules) {
    return this.knowledgeBaseRemoveRulesUrl.replace('__RULESETID__',rulesetId).replace('__RULEIDS',ruleId).replace('__RESULT__',(returnRules?'rules':''));
  },

  getKnowledgeBaseRemoveAllRulesUrl: function (rulesetId) {
    return this.knowledgeBaseRemoveAllRulesUrl.replace('__RULESETID__',rulesetId);
  },

  getKnowledgeBaseAddRuleClipboardUrl: function(rulesetId,taskId,relation){
    relation = (typeof relation === "undefined" || relation=='') ? 'positive' : relation;
    return this.ruleClipboardAddToKnowledgeBaseUrl.replace('__MINERID__',this.getMinerId()).replace('__TASKID__',taskId).replace('__RULESETID__',rulesetId).replace('__RELATION__',relation);
  },

  getKnowledgeBaseRemoveRuleClipboardUrl: function(rulesetId,taskId){
    return this.ruleClipboardRemoveFromKnowledgeBaseUrl.replace('__MINERID__',this.getMinerId()).replace('__TASKID__',taskId).replace('__RULESETID__',rulesetId);
  },

  //endregion knowledgeBase

  //region ruleClipboard
  getRuleClipboardGetRulesUrl: function (taskId,offset,limit,order) {
    offset = (typeof offset === "undefined") ? 0 : offset;
    limit = ((typeof limit === "undefined") || (limit == null) || (limit == 0)) ? this.rulesPerPage : limit;
    order = (typeof order === "undefined") ? '' : order;

    return this.ruleClipboardGetRulesUrl.replace('__MINERID__',this.getMinerId()).replace('__TASKID__',taskId).replace('__OFFSET__',offset).replace('__LIMIT__',limit).replace('__ORDER__',order);
  },
  getRuleClipboardGetTasksUrl: function () {
    return this.ruleClipboardGetTasksUrl.replace('__MINERID__',this.getMinerId());
  },
  getRuleClipboardAddRuleUrl: function (taskId, ruleId) {
    //jako parametr je možné zadat i více ID oddělených čárkou
    return this.ruleClipboardAddRuleUrl.replace('__MINERID__',this.getMinerId()).replace('__TASKID__',taskId).replace('__RULEIDS__',ruleId);
  },
  getRuleClipboardAddAllRulesUrl: function(taskId,ruleIds){
    if (ruleIds == undefined){
      ruleIds='';//jako parametr je možné zadat i více ID oddělených čárkou
    }
    return this.ruleClipboardAddAllRulesUrl.replace('__MINERID__',this.getMinerId()).replace('__TASKID__',taskId).replace('__RETURNRULES__',ruleIds);
  },
  getRuleClipboardRemoveRuleUrl: function (taskId, ruleId) {
    //jako parametr je možné zadat i více ID oddělených čárkou
    return this.ruleClipboardRemoveRuleUrl.replace('__MINERID__',this.getMinerId()).replace('__TASKID__',taskId).replace('__RULEIDS__',ruleId);
  },
  //endregion
  getTaskRenameUrl: function (taskId, newName) {
    return this.taskRenameUrl.replace('__MINERID__',this.getMinerId()).replace('__TASKID__',taskId).replace('__NAME__',newName);
  },

  getPerPageOptions: function(){
    return this.perPageOptions;
  },

  getPaginatorType: function(){
    //return 'selectPaginator';
    return 'linksPaginator';
  },

  getAutoShowAttributeBinningDialog: function(){
    return false;
  }

});