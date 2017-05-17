/**
 * Class URLHelper
 * @license http://www.apache.org/licenses/LICENSE-2.0 Apache License, Version 2.0
 * @link http://github.com/kizi/easyminer-miningui
 *
 * @type Class
 * TODO probably on in use...
 */
var URLHelper = new Class({
	
	initialize: function () {},
	
	getURL: function () {
		return window.location.href;
	},
	
	getImagePath: function (image) {
		var matches = this.getURL().match('http://[a-z]{1,}(/izi-miner)');
		return matches[1] + '/web/images/' + image;
	}
	
});