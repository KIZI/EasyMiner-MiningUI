var Config = new Class({

    GetterSetter: [ 'stopMiningUrl', 'supportUrl', 'joomlaURL', 'showFeedback' ],

	// app info
	//author: 'Radek Skrabal (<a href="mailto:radek@skrabal.me">radek@skrabal.me</a>)',
	name: 'EasyMiner',
	version: '1.0',
	slogan: 'easy association rule mining',
	copyright: '<a href="http://kizi.vse.cz" title="Department of Information and Knowledge Engineering">KIZI</a>, <a href="http://www.vse.cz">University of Economics</a>, Prague',
	
	// language
	lang: 'en',
	
	// URL settings
	$joomlaURL: 'http://sewebar-dev.lmcloud.vse.cz/',
    $showFeedback: false,
    params: {},
	BKGetURL: 'getBK.php',
	dataGetURL: 'getData.php',
	ETreeGetURL: 'getEtree.php',
	rulesGetURL: 'getRules.php',
	reportSaveUrl: 'saveReport.php',
    $stopMiningUrl: 'stopMining.php',
    $supportUrl: 'http://easyminer.eu/',

	// root element
	rootElementID: 'IZIMiner',
	
	initialize: function () {},

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

    setLang: function(lang) {
        this.lang = lang;
    },

    setJoomlaURL: function(url) {
        this.$joomlaURL = url;
    },
	
	setParams: function (params) {
		this.params = params;
	},

    getIdDm: function() {
        return this.params.id_dm;
    },
	
	getBKAskURL: function () {
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
    },
	
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

    getReportSaveUrl: function () {
        return this.$joomlaURL + 'index.php?option=com_dbconnect&controller=data&task=savePMMLArticle&format=raw';
    },

    getListReportsUrl: function() {
        return this.$joomlaURL + 'index.php?option=com_dbconnect&controller=data&task=listKBIArticles&format=raw&kbi=' + this.params.id_dm;
    },

    getLoadClipboardUrl: function() {
        return this.$joomlaURL + 'index.php?option=com_dbconnect&controller=data&task=loadMinerData&format=raw';
    },

    getSaveClipboardUrl: function() {
        return this.$joomlaURL + 'index.php?option=com_dbconnect&controller=data&task=saveMinerData&format=raw';
    },

	getETreeGetURL: function () {
		return this.ETreeGetURL + "?id_dm=" + this.params.id_dm;
	},

    getAddAttributeURL: function(fieldName) {
        return this.$joomlaURL + 'index.php?option=com_dbconnect&controller=izi&task=newAttribute&col=' + encodeURIComponent(fieldName) + '&kbi=' + this.params.id_dm + '&tmpl=component';
    },

    getEditAttributeURL: function(attributeName) {
        return this.$joomlaURL + 'index.php?option=com_dbconnect&controller=izi&task=editAttribute&attribute=' + encodeURIComponent(attributeName) + '&kbi=' + this.params.id_dm + '&tmpl=component';
    },

    getNewTaskURL: function() {
        return this.$joomlaURL + 'index.php?option=com_dbconnect&controller=izi&task=newTask&tmpl=component&close=no';
    },

    getShowHistogramURL: function(name, type) {
        if (type === 'attribute') {
            return this.$joomlaURL + 'index.php?option=com_dbconnect&controller=izi&task=previewAttribute&tmpl=component&kbi=' + this.params.id_dm + '&attribute=' + encodeURIComponent(name);
        } else {
            return this.$joomlaURL + 'index.php?option=com_dbconnect&controller=izi&task=previewColumn&tmpl=component&kbi=' + this.params.id_dm + '&col=' + encodeURIComponent(name);
        }
    },

    getCreateReportUrl: function() {
        return this.$joomlaURL + 'index.php?option=com_dbconnect&controller=data&task=saveMinerData&format=raw&type=clipboard&kbi=' + this.params.id_dm;
    },

    getCreateUserReportUrl: function() {
        return this.$joomlaURL + 'index.php?option=com_dbconnect&controller=izi&task=newReportArticle&tmpl=component&kbi=' + this.params.id_dm;
    },

    getShowReportUrl: function(id) {
        return this.$joomlaURL + 'index.php?option=com_dbconnect&controller=data&task=showArticle&article=' + id;
    },

    getExportBusinessRulesUrl: function(taskId, rulesIds) {
        return this.$joomlaURL + 'index.php?option=com_dbconnect&controller=data&task=exportBR&format=raw&kbi=' + this.params.id_dm + '&lmtask=' + taskId + '&rules=' + rulesIds.join();
    },

    getUserLoginUrl: function() {
        return this.$joomlaURL + 'index.php?option=com_dbconnect&controller=user&task=login&tmpl=component';
    },

    getUserLogoutUrl: function() {
        return this.$joomlaURL + 'index.php?option=com_dbconnect&controller=user&task=logout&tmpl=component';
    },
	
	getRootElementID: function () {
		return this.rootElementID;
	},

    getStopMiningUrl: function() {
        return this.$stopMiningUrl + '?id_dm=' + this.params.id_dm + '&lang=' + this.lang;
    }
	
});