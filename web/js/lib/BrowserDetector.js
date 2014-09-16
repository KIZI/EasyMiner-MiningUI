var BrowserDetector = new Class({

	isDeprecated: function () {
        var version = Browser.version;

        if (Browser.ie) { // Internet Explorer
            if (version < 9) { return true; }
        } else if (Browser.firefox) { // Firefox
            if (version < 11) { return true; }
        } else if (Browser.chrome) { // Google Chrome
            if (version < 18) { return true; }
        } else if (Browser.safari) { // Apple Safari
            if (version < 5) { return true; }
        } else if (Browser.opera) { // Opera
            if (version < 11) { return true; }
        }

        return false;
    },

    getName: function() {
        if (Browser.ie) {
            return 'Internet Explorer'
        }

        return Browser.name.capitalize();
    },

	getFullName: function () {
        return this.getName() + ' ' + Browser.version;
	}
	
});