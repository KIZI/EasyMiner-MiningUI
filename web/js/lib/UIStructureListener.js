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
        if (elAutoFilter) {
            elAutoFilter.addEvent('click', function (e) {
                e.stop();
                this.$ARBuilder.changeSettingsAutoFilter(elAutoFilter);
            }.bind(this));
        }

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
            var elRulesCnt = $('rules-cnt');

            if (!elRulesCnt) {
                // TODO Martin: Why return?
                return;
            }

            var rulesCnt = $('rules-cnt').value;
            var FLName = $('fl-select').options[$('fl-select').selectedIndex].value;
            var autoSearch = $('autofilter') ? $('autofilter').hasClass('autofilter-on') : false;
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

    registerNavigationEventHandlers: function (i18n) {
        var attributesToggle = $$('#attributes a.toggle')[0];
        var attributesFilter = $$('#attributes a.filter')[0];
        var attributesFilterBox = $$('#attributes > .datas-filter')[0];
        var resetA = $$('#attributes a.reset-filter')[0];
        var dataFieldsToggle = $$('#data-fields a.toggle')[0];
        var dataFieldsFilter = $$('#data-fields a.filter')[0];
        var dataFieldsFilterBox = $$('#data-fields > .datas-filter')[0];
        var resetD = $$('#data-fields a.reset-filter')[0];

        attributesToggle.addEvent('click', function (event) {
            event.stop();
            var elToggle = $$('#attributes > div')[1];
            elToggle.toggle();
            var elH2 = $$('#attributes h2')[0];
            if(elH2.hasClass('minimize')){
                attributesToggle.set('title', i18n.translate('Maximize'));
                attributesFilterBox.hide();
            } else{ attributesToggle.set('title', i18n.translate('Minimize')); }
            elH2.toggleClass('minimize'); elH2.toggleClass('maximize');
        }.bind(this));

        attributesFilter.addEvent('click', function (event) {
            event.stop();
            attributesFilterBox.toggle();
            attributesFilter.blur();
        }.bind(this));

        $$('#attributes-filter')[0].addEvent('keydown', function(event){
            if(event.key == 'enter'){ attributesFilterBox.hide(); }
        });

        resetA.addEvent('click', function (event) {
            event.stop();
            resetA.getPrevious().set('value', '').fireEvent('keyup');
        }.bind(this));

        dataFieldsFilter.addEvent('click', function (event) {
            event.stop();
            dataFieldsFilterBox.toggle();
            dataFieldsFilter.blur();
        }.bind(this));

        $$('#data-fields-filter')[0].addEvent('keydown', function(event){
            if(event.key == 'enter'){ attributesFilterBox.hide(); }
        });

        resetD.addEvent('click', function (event) {
            event.stop();
            resetD.getPrevious().set('value', '').fireEvent('keyup');
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

        dataFieldsToggle.addEvent('click', function (event) {
            event.stop();
            var elToggle = $$('#data-fields > div')[1];
            elToggle.toggle();
            var elH2 = $$('#data-fields h2')[0];
            if(elH2.hasClass('minimize')){
                dataFieldsToggle.set('title', i18n.translate('Maximize'));
                dataFieldsFilterBox.hide();
            }
            else{ dataFieldsToggle.set('title', i18n.translate('Minimize')); }
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
            this.$ARBuilder.closeOverlay(); /* TODO voláno z iframe, propojit s obecným close */
        }.bind(this));

        // called when com_dbconnect reloads reports
        elIZI.addEvent('reloadReports', function() {
            this.$ARBuilder.reloadReports();
        }.bind(this));

        // called when com_dbconnect reloads reports
        elIZI.addEvent('reloadBRBase', function() {
            this.$ARBuilder.reloadBRBase();
        }.bind(this));
    },

    registerFoundRulesEventHandlers: function() {
        // stop mining
        /*$('stop-mining').addEvent('click', function (e) {
            e.stop();
            this.$ARBuilder.getMiningManager().stopMining();
        }.bind(this));
*/
        //TODO nebude mít smysl...
        // clear rules
        /*
        $('found-rules-pager-clear').addEvent('click', function (e) {
            e.stop();
            this.$ARBuilder.getFRManager().reset();
        }.bind(this));*/
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