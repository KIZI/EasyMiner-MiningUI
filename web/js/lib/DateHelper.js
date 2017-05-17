/**
 * Class DataHelper
 * @license http://www.apache.org/licenses/LICENSE-2.0 Apache License, Version 2.0
 * @link http://github.com/kizi/easyminer-miningui
 *
 * @type Class
 */
var DateHelper = new Class({

	getYear: function() {
		var today = new Date();

		return today.get('year');
	},

    getTime: function() {
        var today = new Date();

        return today.getTime(); // UNIX time in milliseconds
    }
	
});