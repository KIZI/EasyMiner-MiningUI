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