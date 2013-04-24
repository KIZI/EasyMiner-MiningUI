var Config = new Class({

    GetterSetter: ['stopMiningUrl', 'supportUrl', 'joomlaURL'],

	// app info
	author: 'Radek Skrabal (<a href="mailto:radek@skrabal.me">radek@skrabal.me</a>)',
	name: 'I<em>:</em>ZI Miner',
	version: '1.0-beta',
	slogan: 'easy association rule mining',
	copyright: '<a href="http://kizi.vse.cz" title="Department of Information and Knowledge Engineering - University of Economics Prague">DIKE UEP</a>',
	
	// language
	lang: 'en',
	
	// URL settings
	$joomlaURL: 'http://sewebar.lmcloud.vse.cz/',
    params: {},
	BKGetURL: 'getBK.php',
	dataGetURL: 'getData.php',
	ETreeGetURL: 'getEtree.php',
	rulesGetURL: 'getRules.php',
	reportSaveUrl: 'saveReport.php',
    $stopMiningUrl: 'stopMining.php',
    $supportUrl: 'http://www.izi-miner.eu/features',

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
        return this.reportSaveUrl + "?id_dm=" + this.params.id_dm + (this.params.sleep ? '&sleep=' + this.params.sleep : '') + '&lang=' + this.lang;
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

    getShowReportsUrl: function() {
        // TODO: URL?
    },
	
	getRootElementID: function () {
		return this.rootElementID;
	},

    getStopMiningUrl: function() {
        return this.$stopMiningUrl + '?id_dm=' + this.params.id_dm + '&lang=' + this.lang;
    }
	
});