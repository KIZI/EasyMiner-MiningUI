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

    registerSettingsWindowEventHandlers: function (ASPossible) {
        // change FL
        var elSelect = $('fl-select');
        elSelect.addEvent('change', function (e) {
            e.stop();
            var FLName = elSelect.options[elSelect.selectedIndex].value;
            this.$ARBuilder.updateSettingsWindow(FLName);
        }.bind(this));

        // change autoFilter
        var elAutoFilter = $('autofilter');
        elAutoFilter.addEvent('click', function (e) {
            e.stop();
            this.$ARBuilder.changeSettingsAutoFilter(elAutoFilter);
        }.bind(this));

        // change attribute suggestion
        if (ASPossible) {
            var elAS = $('as');
            elAS.addEvent('click', function (e) {
                e.stop();
                this.$ARBuilder.changeSettingsAS(elAS);
            }.bind(this));
        }

        // change caching
        $('cache').addEvent('click', function (e) {
            e.stop();
            this.$ARBuilder.changeCaching($('cache'));
        }.bind(this));

        // change debug information
        $('debug').addEvent('click', function (e) {
            e.stop();
            this.$ARBuilder.changeDebug($('debug'));
        }.bind(this));

        // change strict match
        $('strict').addEvent('click', function(e) {
            e.stop();
            this.$ARBuilder.changeStrict($('strict'));
        }.bind(this));

        // save
        var elSubmit = $('settings-form').getElement('input[type=submit]');
        elSubmit.removeEvent('click');
        elSubmit.addEvent('click', function (e) {
            e.stop();
            var elRulesCnt = $('rules-cnt'); if (!elRulesCnt) { return; }
            var rulesCnt = $('rules-cnt').value;
            var FLName = $('fl-select').options[$('fl-select').selectedIndex].value;
            var autoSearch = $('autofilter').hasClass('autofilter-on');
            var autoSuggest = $('as').hasClass('autosuggest-on');
            var cache = $('cache').hasClass('cache-on');
            var debug = $('debug').hasClass('debug-on');
            var strict = $('strict').hasClass('strict-on');
            var taskMode = $('task-mode').options[$('task-mode').selectedIndex].value;

            this.$ARBuilder.saveSettings(rulesCnt, FLName, autoSearch, autoSuggest, cache, debug, strict, taskMode);
        }.bind(this));

        // close
        var elClose = $('settings-close');
        elClose.addEvent('click', function (e) {
            this.$ARBuilder.closeSettingsWindow();
            e.stop();
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

        var me = this;
        $('createUserReport').addEvent('click', function(event) {
            me.$ARBuilder.openCreateUserReportkWindow();
        });
    },

    registerShowHiddenAttributesEventHandler: function() {
        $('show-hidden-attributes').addEvent('click', function(e) {
            e.stop();
            this.$ARBuilder.showHiddenAttributes();
        }.bind(this));
    },

    registerDataReloadEventHandlers: function() {
        var elIZI = $(this.$ARBuilder.getConfig().getRootElementID());

        // called when com_dbconnect window is closed
        elIZI.addEvent('reload', function() {
            this.$UIStructurePainter.hideOverlay();
            this.$ARBuilder.reloadAttributes();
        }.bind(this));

        elIZI.addEvent('closeOverlay', function() {
            this.$ARBuilder.closeOverlay();
        }.bind(this));

        // called when com_dbconnect reloads reports
        elIZI.addEvent('reloadReports', function() {
            this.$ARBuilder.reloadReports();
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