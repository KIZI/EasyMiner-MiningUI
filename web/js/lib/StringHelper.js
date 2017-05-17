/**
 * Class StringHelper
 * @license http://www.apache.org/licenses/LICENSE-2.0 Apache License, Version 2.0
 * @link http://github.com/kizi/easyminer-miningui
 *
 * @type Class
 */
var StringHelper = new Class({
	
	initialize: function () {
		
	},
	
	normalizeString: function (string) {
		string = string.replace(/^\s+/,"");
		string = string.toLowerCase();
		if (string.contains(' -')) {
			string = string.replace(' -', '-');
		}
		if (string.contains('- ')) {
			string = string.replace('- ', '-');
		}
        while (string.contains('  ')) {
            string = string.replace('  ', ' ');
        }
		while (string.contains(' ')) {
			string = string.replace(' ', '-');
		}
		string = string.strTr(['á', 'ä', 'ď', 'ě', 'ë', 'š', 'č', 'ř', 'ž', 'ý', 'á', 'í', 'ň', 'ó', 'ö', 'é', 'ť', 'ü', 'ů', 'ú'], 
								['a', 'a', 'd', 'e', 'e', 's', 'c', 'r', 'z', 'y', 'a', 'i', 'n', 'o', 'o', 'e', 't', 'u', 'u', 'u']);		
		string = string.replace(/[^a-zA-Z0-9-]+/g,'');
		
		return string;
	},
	
	getId: function (string) {
		var parts = string.split('-');
		var id = parts.getLast().toInt();
		
		return id;
	}
	
});