"use strict";

var reload = function() {
    $(config.getRootElementID()).fireEvent('reload');
};

var close = function() {
    $(config.getRootElementID()).fireEvent('closeOverlay');
}

var DomReady = new Class({

	initialize: function () {
		window.addEvent('domready', function () {
			this.ready();
		}.bind(this));
	},
		
	ready: function () {
		var nativeTypeExtender = new NativeTypeExtender();
		nativeTypeExtender.extendAll();
		
		var config = new Config();
		var uri = new URI(window.location.href);
		config.setParams(uri.get('data'));

		var ARB = new ARBuilder(config);
	}

});

var DR = new DomReady();