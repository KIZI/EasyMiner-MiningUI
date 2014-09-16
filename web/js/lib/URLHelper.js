var URLHelper = new Class({
	
	initialize: function () {},
	
	getURL: function () {
		return window.location.href;
	},
	
	getImagePath: function (image) {
		var matches = this.getURL().match('http://[a-z]{1,}(/izi-miner)');
		var path = matches[1] + '/web/images/' + image;
		
		return path;
	}
	
});