"use strict";

var config = null;

var reload = function() {
    $(config.getRootElementId()).fireEvent('reload');
};

var close = function() {
    $(config.getRootElementId()).fireEvent('closeOverlay');
};

var reloadReports = function() {
    $(config.getRootElementId()).fireEvent('reloadReports');
};

window.addEvent('domready', function () {
  var nativeTypeExtender = new NativeTypeExtender();
  nativeTypeExtender.extendAll();

  config = new Config();
  config.setMinerId(minerId);
  config.setRootElementId(rootElementId);

	var ARB = new ARBuilder(config);
});

