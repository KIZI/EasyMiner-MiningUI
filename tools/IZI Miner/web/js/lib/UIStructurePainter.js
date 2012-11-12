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

        this.$UIStructureListener.registerNavigationEventHandlers();
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

    renderNewTaskWindow: function () {
        var url = this.$config.getNewTaskURL();
        var elWindow = Mooml.render('newTaskTemplate', {url: url});
        var overlay = this.showOverlay();
        overlay.grab(elWindow);

        this.$UIScroller.scrollTo(0, 0);
    },

    renderSettingsWindow: function (FLs, selectedFL, autoSuggest, reset, settings) {
        var autoSuggestPossible = (autoSuggest.length > 0);
        var settings = Mooml.render('settingsTemplate', {autoSuggestPossible: autoSuggestPossible, i18n: this.$i18n, reset: reset, settings: settings});
        var elWindow = $('settings-window');
        if (elWindow) { // re-render (autocomplete)
            settings.getElement('.autocomplete').replaces(elWindow.getElement('.autocomplete'));
        } else {
            var overlay = this.showOverlay();
            overlay.grab(settings);
        }
        this.$UIStructureListener.registerSettingsWindowEventHandlers(autoSuggestPossible);

        var elSelect = $('fl-select');
        Object.each(FLs, function (FL) {
            var isSelected = (FL.getName() === selectedFL.getName());
            elSelect.grab(Mooml.render('flOptionTemplate', {FL: FL, isSelected: isSelected}));
        }.bind(this));
    },

    resizeApplication: function() {
        var width = $('antecedent').getSize().x + $('interest-measures').getSize().x + $('succedent').getSize().x + 1; // IE9 hack (+1)
        $('ar-wrapper').setStyle('width', width);

        this.resizeWindow();
    },

    resizeWindow: function() {
        // fix wrapper width to 100%
        var contentWidth = this.$elementSizeMeter.getWidth($('content'));
        var navigationWidth = this.$elementSizeMeter.getWidth($('navigation'));
        var wrapperWidth = contentWidth + navigationWidth;
        if (wrapperWidth > window.getSize().x) {
            $('wrapper').setStyle('width', wrapperWidth);
        }
        else {
            $('wrapper').removeClass('style');
        }

        // fix overlay width & height to 100%
        $('overlay').setStyle('width', wrapperWidth);
        $('overlay').setStyle('height', window.getScrollSize().y);

    },

    showLoadData: function() {
        $('overlay').grab(new Element('div', {id: 'loading-data', html: this.$i18n.translate('Loading application data...')}));
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
    }

});