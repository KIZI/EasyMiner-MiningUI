/**
 * Class UIStructureListener
 * @license http://www.apache.org/licenses/LICENSE-2.0 Apache License, Version 2.0
 * @link http://github.com/kizi/easyminer-miningui
 *
 * @type Class
 */
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

    registerUnsupportedBrowserEventHandler: function (field) {
        // submit
        var elementSubmit = $('unsupported-browser-form').getElement('input[type=submit]');
        elementSubmit.addEvent('click', function (event) {
            event.stop();
            this.$UIStructurePainter.hideOverlay();
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
        var attributesSelectable = $$('#attributes a.selectable')[0];
        var attributesSelected = $$('#attributes .navigation-checkbox-controls')[0];
        var attributesFilter = $$('#attributes a.filter')[0];
        var attributesFilterBox = $$('#attributes > .datas-filter')[0];
        var attributesFilterInput = attributesFilterBox.getElement('#attributes-filter');
        var resetA = $$('#attributes a.reset-filter')[0];
        var dataFieldsToggle = $$('#data-fields a.toggle')[0];
        var dataFieldsSelectable = $$('#data-fields a.selectable')[0];
        var dataFieldsSelected = $$('#data-fields .navigation-checkbox-controls')[0];
        var dataFieldsFilter = $$('#data-fields a.filter')[0];
        var dataFieldsFilterBox = $$('#data-fields > .datas-filter')[0];
        var dataFieldsFilterInput = dataFieldsFilterBox.getElement('#data-fields-filter');
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

        attributesSelectable.addEvent('click', function (event) {
            event.stop();
            var attributesElm = $('attributes');
            if(attributesElm.hasClass('show-checkboxes')){
                attributesElm.removeClass('show-checkboxes');
                this.$ARBuilder.UIPainter.showAddAllUnusedAttributesLink();
            } else{
                attributesElm.addClass('show-checkboxes');
                this.$ARBuilder.UIListener.checkAttributesSelectedCheckboxes();
            }

        }.bind(this));

        attributesSelected.getElements('.all').addEvent('click',function(event){
            //select all checkboxes
            event.stop();
            $('attributes').getElements('.attribute-checkbox').each(function(checkbox){
                checkbox.checked=true;
            });
            this.$ARBuilder.UIListener.checkAttributesSelectedCheckboxes();
        }.bind(this));
        attributesSelected.getElements('.none').addEvent('click',function(event){
            //unselect all checkboxes
            event.stop();
            $('attributes').getElements('.attribute-checkbox').each(function(checkbox){
                checkbox.checked=false;
            });
            this.$ARBuilder.UIListener.checkAttributesSelectedCheckboxes();
        }.bind(this));
        attributesSelected.getElements('.invert').addEvent('click',function(event){
            //select all checkboxes
            event.stop();
            $('attributes').getElements('.attribute-checkbox').each(function(checkbox){
                checkbox.checked=!checkbox.checked;
            });
            this.$ARBuilder.UIListener.checkAttributesSelectedCheckboxes();
        }.bind(this));

        attributesSelected.getElement('#add-selected-attributes').addEvent('click', function (event) {
            event.stop();
            this.$ARBuilder.openClickAddAttributeWindow(this.getAttributesSelectedIds());
        }.bind(this));

        attributesFilter.addEvent('click', function (event) {
            event.stop();
            if(attributesFilterBox.getStyle('display') == 'none'){
                attributesFilterBox.show();
                attributesFilterInput.focus();
                attributesFilterInput.select();
            } else{
                attributesFilterBox.hide();
            }
            //attributesFilter.blur();
        }.bind(this));

        $$('#attributes-filter')[0].addEvent('keydown', function(event){
            if(event.key == 'enter'){ attributesFilterBox.hide(); }
        });

        resetA.addEvent('click', function (event) {
            event.stop();
            resetA.getPrevious().set('value', '').fireEvent('keyup');
            attributesFilterBox.hide();
        }.bind(this));

        dataFieldsSelectable.addEvent('click', function (event) {
            event.stop();
            $('data-fields').toggleClass('show-checkboxes');
        }.bind(this));

        dataFieldsSelected.getElements('.all').addEvent('click',function(event){
            //select all checkboxes
            event.stop();
            $('data-fields').getElements('.data-field-checkbox').each(function(checkbox){
                checkbox.checked=true;
            });
            this.$ARBuilder.UIListener.checkDataFieldsSelectedCheckboxes();
        }.bind(this));
        dataFieldsSelected.getElements('.none').addEvent('click',function(event){
            //unselect all checkboxes
            event.stop();
            $('data-fields').getElements('.data-field-checkbox').each(function(checkbox){
                checkbox.checked=false;
            });
            this.$ARBuilder.UIListener.checkDataFieldsSelectedCheckboxes();
        }.bind(this));
        dataFieldsSelected.getElements('.invert').addEvent('click',function(event){
            //select all checkboxes
            event.stop();
            $('data-fields').getElements('.data-field-checkbox').each(function(checkbox){
                checkbox.checked=!checkbox.checked;
            });
            this.$ARBuilder.UIListener.checkDataFieldsSelectedCheckboxes();
        }.bind(this));

        dataFieldsSelected.getElement('#add-selected-data-fields').addEvent('click', function (event) {
            event.stop();
            this.$ARBuilder.openAddAttributesWindow(this.getDataFieldsSelectedIds());
        }.bind(this));

        dataFieldsFilter.addEvent('click', function (event) {
            event.stop();
            if(dataFieldsFilterBox.getStyle('display') == 'none'){
                dataFieldsFilterBox.show();
                dataFieldsFilterInput.focus();
                dataFieldsFilterInput.select();
            } else{
                dataFieldsFilterBox.hide();
            }
            //dataFieldsFilter.blur();
        }.bind(this));

        $$('#data-fields-filter')[0].addEvent('keydown', function(event){
            if(event.key == 'enter'){ attributesFilterBox.hide(); }
        });

        resetD.addEvent('click', function (event) {
            event.stop();
            resetD.getPrevious().set('value', '').fireEvent('keyup');
            dataFieldsFilterBox.hide();
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

        /*$('kb-select').addEvent('change', function (event) {
            this.$ARBuilder.$MRManager.loadKnowledgeBase(event.target.getSelected().get("value"));
        }.bind(this));*/

        $('change-ruleset').addEvent('click', function (event) {
            this.$ARBuilder.openChangeRulesetWindow();
        }.bind(this));

        var me = this;
        $('createUserReport').addEvent('click', function(event) {
            me.$ARBuilder.openCreateUserReportkWindow();
        });
    },

    getAttributesSelectedIds: function(){
        var selectedCheckboxes=$$('#attributes .attribute-checkbox:checked');
        if (selectedCheckboxes.length > 0){
            var result=[];
            Array.each(selectedCheckboxes,function(checkbox){
                result.push(checkbox.get('data-id'));
            }.bind(result))
        }
        return result;
    },

    getDataFieldsSelectedIds: function(){
        var selectedCheckboxes=$$('#data-fields .data-field-checkbox:checked');
        if (selectedCheckboxes.length > 0){
            var result=[];
            Array.each(selectedCheckboxes,function(checkbox){
                result.push(checkbox.get('data-id'));
            }.bind(result))
        }
        return result;
    },

    registerShowHiddenAttributesEventHandler: function() {
        $('show-hidden-attributes').addEvent('click', function(e) {
            e.stop();
            this.$ARBuilder.showHiddenAttributes();
            this.$UIStructurePainter.hideHiddenAttributesButton();
        }.bind(this));
    },

    registerAddAllUnusedAttributesEventHandler: function(){
        $('add-all-unused-attributes').addEvent('click', function(e){
            e.stop();
            //select all unused attributes and add them
            var ARManager = this.$ARBuilder.getARManager();
            var activeRule= ARManager.getActiveRule();
            var attributeNameFilter=this.$ARBuilder.attributesFilter.prepareTestRegExp();
            var attributeNames=[];
            Array.each(this.$ARBuilder.getDD().getAttributes(), function (attribute) {
                if (activeRule.isAttributeUsed(attribute)){return;/*atributte is already used*/}
                if (!attributeNameFilter.test(attribute.getName())){return;/*name of attribute does not match the current filter*/}
                if ((attribute.isHidden())){return;/*it is hidden attribute*/}
                //prepare list with names of unused attributes
                attributeNames.push(attribute.name);
            }.bind(this));
            //open window for target selection
            this.$ARBuilder.openClickAddAttributeWindow(attributeNames);
        }.bind(this));
    },

    registerDataReloadEventHandlers: function() {
        var elIZI = $(this.$ARBuilder.getConfig().getRootElementId());

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


    registerMarkedRulesEventHandlers: function () {
        var links = $('marked-rules-tabs'),
            linkTasks = links.getElement('.marked-rules-tasks'),
            linkBase = links.getElement('.marked-rules-base'),
            elMarkedRules = $('marked-rules'),
            elTasks = elMarkedRules.getElement('.marked-rules-tasks-content'),
            elBase = elMarkedRules.getElement('.marked-rules-base-content');
        linkTasks.addEvent('click', function(e){
            e.stop();
            if(!linkTasks.hasClass('marked-rules-tab-active')){
                linkBase.removeClass('marked-rules-tab-active');
                linkTasks.addClass('marked-rules-tab-active');
                var openMrTasks = elTasks.getElements('div.minimize');
                Array.each(openMrTasks, function (value) {
                    // reloads tasks by id from elm id (without "task-" at begin)
                    this.$ARBuilder.$MRManager.tasks[value.get('id').substring(5)].reload();
                }.bind(this));
                elTasks.show();
                elBase.hide();
            }
        }.bind(this));
        linkBase.addEvent('click', function(e){
            e.stop();
            if(!linkBase.hasClass('marked-rules-tab-active')){
                this.$ARBuilder.$MRManager.loadKnowledgeBase(this.$ARBuilder.$MRManager.KBid);
                linkTasks.removeClass('marked-rules-tab-active');
                linkBase.addClass('marked-rules-tab-active');
                elBase.show();
                elTasks.hide();
            }
        }.bind(this));
    }
});