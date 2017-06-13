"use strict";

/**
 * Init script for EasyMiner-MiningUI javascript UI
 *
 * @license http://www.apache.org/licenses/LICENSE-2.0 Apache License, Version 2.0
 * @link http://github.com/kizi/easyminer-miningui
 */

var config = null;

var reload = function() {
    $(config.getRootElementId()).fireEvent('reload');
};

var removeOverlayClose = function(){
  $("overlay-close").destroy();
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

