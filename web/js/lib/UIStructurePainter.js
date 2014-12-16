var UIStructurePainter = new Class({

    $ARBuilder: null,
    $config: null,
    $dateHelper: null,
    $i18n: null,
    $UIStructureListener: null,
    $UIStructureTemplater: null,
    $elementSizeMeter: null,
    $browserDetector: null,

    initialize: function(config, dateHelper, i18n, UIStructureListener, UIStructureTemplater, UIScroller, elementSizeMeter, browserDetector) {
        this.$config = config;
        this.$dateHelper = dateHelper;
        this.$i18n = i18n;
        this.$UIStructureListener = UIStructureListener;
        this.$UIStructureTemplater = UIStructureTemplater;
        this.$UIStructureTemplater.register();
        this.$UIScroller = UIScroller;
        this.$elementSizeMeter = elementSizeMeter;
        this.$browserDetector = browserDetector;
    },

    render: function() {
        $(this.$config.getRootElementID()).grab(Mooml.render('overlayTemplate'));
        $(this.$config.getRootElementID()).grab(Mooml.render('headerTemplate', {config: this.$config, i18n: this.$i18n, browserDetector: this.$browserDetector}));
        $(this.$config.getRootElementID()).grab(Mooml.render('mainTemplate', {i18n: this.$i18n}));
        $(this.$config.getRootElementID()).grab(Mooml.render('footerTemplate', {config: this.$config, i18n: this.$i18n, dateHelper: this.$dateHelper}));
        this.renderNavigation();
        this.renderActiveRule();
        this.renderMarkedRules();
        this.resizeWindow();

        this.$UIStructureListener.registerResizeEventHandler();
        this.$UIStructureListener.registerSettingsEventHandlers();
        this.$UIStructureListener.registerDataReloadEventHandlers();
        this.$UIStructureListener.registerFoundRulesEventHandlers();
    },

    renderNavigation: function() {
        var navigation = $('navigation');

        // attributes
        var attributes = $('attributes');
        if (attributes) {
            Mooml.render('attributesStructureTemplate', {i18n: this.$i18n, byGroup: this.$ARBuilder.getARManager().getAttributesByGroup(), inProgress: this.$ARBuilder.getETreeManager().getInProgress(), hasHiddenAttributes: false}).replaces(attributes);
        } else {
            navigation.grab(Mooml.render('attributesStructureTemplate', {i18n: this.$i18n, byGroup: false, inProgress: false, hasHiddenAttributes: false}));
        }
        this.$UIStructureListener.registerShowHiddenAttributesEventHandler();

        // data fields
        var dataFields = $('data-fields');
        if (dataFields) {
            Mooml.render('dataFieldsStructureTemplate', {i18n: this.$i18n}).replaces(dataFields);
        } else {
            dataFields = Mooml.render('dataFieldsStructureTemplate', {i18n: this.$i18n});
            navigation.grab(dataFields);
        }

        // reports
        var reports = $('reports');
        if (reports) {
            Mooml.render('reportsStructureTemplate', {i18n: this.$i18n}).replaces(reports);
        } else {
            reports = Mooml.render('reportsStructureTemplate', {i18n: this.$i18n});
            navigation.grab(reports);
        }

        var brBase = $('brBase');
        if (brBase) {
            Mooml.render('brBaseStructureTemplate', {i18n: this.$i18n}).replaces(brBase);
        } else {
            brBase = Mooml.render('brBaseStructureTemplate', {i18n: this.$i18n});
            navigation.grab(brBase);
        }

        this.$UIStructureListener.registerNavigationEventHandlers(this.$i18n);
    },

    showHiddenAttributesButton: function() {
        $('show-hidden-attributes').setStyle('display', 'inline');
    },

    hideHiddenAttributesButton: function() {
        $('show-hidden-attributes').setStyle('display', 'none');
    },

    renderActiveRule: function() {
        Mooml.render('activeRuleTemplate', {rules: false, attributes: false, i18n: this.$i18n, displayAddIM: false}).replaces($('active-rule'));
    },

    renderMarkedRules: function() {
        var workplace = $('workplace');

        // marked rules
        var elementMarkedRules = Mooml.render('markedRulesStructureTemplate', {i18n: this.$i18n});
        workplace.grab(elementMarkedRules);

        this.$UIStructureListener.registerMarkedRulesEventHandlers();
    },

    renderSettingsWindow: function (FLs, selectedFL, autoSuggest, reset, settings) {
        var autoSuggestPossible = (autoSuggest.length > 0);

        var settingsEl = Mooml.render('settingsTemplate', {
            showFeedback: this.$config.getShowFeedback(),
            autoSuggestPossible: autoSuggestPossible,
            i18n: this.$i18n, reset: reset,
            settings: settings
        });
        var elWindow = $('settings-window');
        if (elWindow) { // re-render (autocomplete)
            settingsEl.getElement('.autocomplete').replaces(elWindow.getElement('.autocomplete'));
        } else {
            var overlay = this.showOverlay();
            overlay.grab(settingsEl);
        }
        this.$UIStructureListener.registerSettingsWindowEventHandlers(autoSuggestPossible);

        var elSelect = $('fl-select'),
            isSelected;
        Object.each(FLs, function (FL) {
            isSelected = (FL.getName() === selectedFL.getName());
            elSelect.grab(Mooml.render('flOptionTemplate',
                {
                    FL: FL,
                    isSelected: isSelected
                })
            );
        }.bind(this));

        var me = this,
            elTaskMode = $('task-mode'),
            taskModes = [{value: 'task', name: 'Single-thread'}, {value: 'grid', name: 'Grid'}, {value: 'proc', name: 'Multi-core'}];
        Array.each(taskModes, function(taskMode) {
            isSelected = (taskMode.value === settings.getTaskMode());
            elTaskMode.grab(Mooml.render('taskModeOptionTemplate', {
                i18n: me.$i18n,
                taskMode: taskMode,
                isSelected: isSelected
            }))
        });

        this.posOverlay();
    },

    resizeApplication: function() {
        // Declarations
        var measuredElements = [ $('antecedent'), $('interest-measures'), $('succedent') ];
        var widthFix = 50; // HACK: To prevent reimplementing vast codebase

        /*
        // Set antecedent and consequent to max width within its container
        var ruleWidth = $('ar-wrapper').getWidth() -
            this.$elementSizeMeter.computeBorderlessWidth($('interest-measures'));
        ruleWidth = ruleWidth / 2 - widthFix;
        */
        // FIX: Hardcode antecedent with to 325px to prevent horizontal resizing
        ruleWidth = "325px";
        $('antecedent').setStyle('width', ruleWidth);
        $('succedent').setStyle('width', ruleWidth);

        // Resize the container
        var width = this.$elementSizeMeter.getWidth(measuredElements) + 1; // IE9 hack (+1)
        $('ar-wrapper').setStyle('width', width);

        $('marked-rules').setStyle('width', $('content').getSize().x - $('content').getStyle('padding-right').replace('px', '').toInt() - $('content').getStyle('padding-left').replace('px', '').toInt() - 2);

        this.resizeWindow();
    },

    resizeWindow: function() {
        // fix wrapper width to 100%
        var wrapperWidth = this.$elementSizeMeter.getWidth([$('content'), $('navigation')]);
        if (wrapperWidth > this.$elementSizeMeter.getWidth([window])) {
            $('wrapper').setStyle('width', wrapperWidth);
        }
        else {
            $('wrapper').removeClass('style');
        }

        // fix overlay width & height to 100%
        $('overlay').setStyle('width', wrapperWidth);
        $('overlay').setStyle('height', window.getScrollSize().y);

        // check correct positioning of overlay
        this.posOverlay();
    },

    showLoadData: function() {
        $('overlay').grab(new Element('div', {id: 'loading-data', html: this.$i18n.translate('Loading application data...')}));
        this.showOverlay();
    },

    showLoadingOverlay: function(message) {
        $('overlay').grab(new Element('div', {id: 'loading-data', html: this.$i18n.translate(message)}));
        this.showOverlay();
    },

    showLoadDataError: function() {
        $('loading-data').set('html', this.$i18n.translate('An error occured while loading application data.<br/>Please create a <a href="#" id="new-task-button">new task</a>.'));
        $('loading-data').addClass('error');
        this.$UIStructureListener.registerNewTaskEventHandler();
    },

    showOverlay: function () {
        var elementOverlay = $('overlay');
        elementOverlay.fade('in');

        return elementOverlay;
    },

    hideOverlay: function () {
        var elementOverlay = $('overlay');
        elementOverlay.fade('out');
        elementOverlay.empty();

        return elementOverlay;
    },

    posOverlay: function () {
        var elementOverlay = $('overlay'),
            inner = elementOverlay.getChildren('div'),
            top = inner.getScrollSize();

        if(inner.length > 0) {
            if (top[0]['y'] + 20 > window.innerHeight) {
                inner.addClass("bigger");
                elementOverlay.setStyles({
                    position: 'absolute'
                });
            } else {
                inner.removeClass("bigger");
                elementOverlay.setStyles({
                    position: 'fixed'
                });
            }
        }
    }

});