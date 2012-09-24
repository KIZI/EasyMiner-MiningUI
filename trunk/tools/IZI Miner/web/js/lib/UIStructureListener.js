var UIStructureListener = new Class({
	
	$ARBuilder: null,
	$UIStructurePainter: null,

	initialize: function (ARBuilder) {
		this.$ARBuilder = ARBuilder;
	},
	
    setUIStructurePainter: function(UIStructurePainter) {
        this.$UIStructurePainter = UIStructurePainter;
    },

    registerResizeEventHandler: function() {
        window.addEvent('resize', function() {
            this.$UIStructurePainter.resizeWindow();
        }.bind(this));
    },

    registerNewTaskEventHandler: function() {
        $('new-task-button').addEvent('click', function (e) {
            e.stop();
            this.$UIStructurePainter.hideOverlay();
            this.$ARBuilder.openNewTaskWindow();
        }.bind(this));
    },

    registerSettingsEventHandlers: function () {
        $('new-task').addEvent('click', function (e) {
            e.stop();
            this.$ARBuilder.openNewTaskWindow();
        }.bind(this));

        $('settings-open').addEvent('click', function (e) {
            e.stop();
            this.$ARBuilder.openSettingsWindow();
        }.bind(this));
    },

    registerNavigationEventHandlers: function () {
        var el = $$('#attributes a.toggle')[0];
        el.addEvent('click', function (event) {
            event.stop();
            var elToggle = $$('#attributes > div')[0];
            elToggle.toggle();
            var elH2 = $$('#attributes h2')[0];
            elH2.toggleClass('minimize'); elH2.toggleClass('maximize');
        }.bind(this));

//		if (this.ARBuilder.getARManager().getAttributesByGroup()) {
//			// attributes by list
//			$('attributes-by-list').addEvent('click', function (event) {
//				event.stop();
//				this.ARBuilder.getARManager().displayAttributesByList();
//			}.bind(this));
//		} else {
//			// attributes by group
//			$('attributes-by-group').addEvent('click', function (event) {
//				this.ARBuilder.getARManager().displayAttributesByGroup();
//				event.stop();
//			}.bind(this));
//		}

        var el = $$('#data-fields a.toggle')[0];
        el.addEvent('click', function (event) {
            event.stop();
            var elToggle = $$('#data-fields > div')[0];
            elToggle.toggle();
            var elH2 = $$('#data-fields h2')[0];
            elH2.toggleClass('minimize'); elH2.toggleClass('maximize');
        }.bind(this));
    },

    registerDataReloadEventHandlers: function() {
        // called when com_dbconnect window is closed
        var elIZI = $(this.$ARBuilder.getConfig().getRootElementID());
        elIZI.addEvent('reload', function() {
            this.$ARBuilder.reloadAttributes();
        }.bind(this));

        // TODO refactor into another function
        var elIZI = $(this.$ARBuilder.getConfig().getRootElementID());
        elIZI.addEvent('closeOverlay', function() {
            this.$ARBuilder.closeOverlay();
        }.bind(this));
    },

    registerFoundRulesEventHandlers: function() {
        // stop mining
        $('stop-mining').addEvent('click', function (e) {
            e.stop();
            this.$ARBuilder.getMiningManager().stopMining();
        }.bind(this));

        // clear rules
        $('pager-clear').addEvent('click', function (e) {
            e.stop();
            this.$ARBuilder.getFRManager().reset();
        }.bind(this));
    },

    registerMarkedRulesEventHandlers: function () {
        var elDropdown = $$('#marked-rules a.toggle')[0];
        elDropdown.addEvent('click', function (event) {
            event.stop();
            var elToggle = $$('#marked-rules > div')[0];
            elToggle.toggle();
            var elH2 = $$('#marked-rules h2')[0];
            elH2.toggleClass('minimize'); elH2.toggleClass('maximize');
        }.bind(this));
    }

});