var Config = new Class({

    GetterSetter: ['stopMiningUrl'],

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
	dataSetURL: 'setData.php',
	ETreeGetURL: 'getEtree.php',
	rulesGetURL: 'getRules.php',
    $stopMiningUrl: 'stopMining.php',
		
	// root element
	rootElementID: 'ARBuilder',
	
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
        return this.params.id_dm.toInt();
    },
	
	getBKAskURL: function () {
		return this.BKGetURL + '?' + 'id_dm=' + this.params.id_dm + '&id_kb=' + this.params.id_kb + '&action=ask';
	},
	
	getBKSaveInterestingURL: function () {
		return this.BKGetURL + '?' + 'id_dm=' + this.params.id_dm + '&id_kb=' + this.params.id_kb + '&action=saveInteresting';
	},
	
	getBKSaveNotInterestingURL: function () {
		return this.BKGetURL + '?' + 'id_dm=' + this.params.id_dm + '&id_kb=' + this.params.id_kb + '&action=saveNotInteresting';
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
	
	getDataSetURL: function () {
		return this.dataSetURL;
	},
	
	getRulesGetURL: function () {
		return this.rulesGetURL + "?id_dm=" + this.params.id_dm + (this.params.sleep ? '&sleep=' + this.params.sleep : '') + '&lang=' + this.lang;
	},
	
	setRulesGetURL: function (URL) {
		this.rulesGetURL = URL;
	},
	
	getETreeGetURL: function () {
		return this.ETreeGetURL + "?id_dm=" + this.params.id_dm;
	},

    getAddAttributeURL: function(fieldName) {
        return this.$joomlaURL + 'index.php?option=com_dbconnect&controller=izi&task=newAttribute&col=' + encodeURIComponent(fieldName) + '&kbi=' + this.params.id_dm + '&lang=' + this.lang;
    },

    getEditAttributeURL: function(attributeName) {
        return this.$joomlaURL + 'index.php?option=com_dbconnect&controller=izi&task=editAttribute&attribute=' + encodeURIComponent(attributeName) + '&kbi=' + this.params.id_dm + '&lang=' + this.lang;
    },

    getNewTaskURL: function() {
        return this.$joomlaURL + 'index.php?option=com_dbconnect&controller=izi&task=newDataSource&tmpl=component';
    },
	
	getRootElementID: function () {
		return this.rootElementID;
	},

    getStopMiningUrl: function() {
        return this.$stopMiningUrl + '?id_dm=' + this.params.id_dm + '&lang=' + this.lang;
    }
	
});