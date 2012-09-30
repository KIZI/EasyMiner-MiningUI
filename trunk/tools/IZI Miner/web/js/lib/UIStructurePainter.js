var UIStructurePainter = new Class({

    $config: null,
    $dateHelper: null,
    $i18n: null,
    $UIStructureListener: null,
    $UIStructureTemplater: null,

    initialize: function(config, dateHelper, i18n, UIStructureListener, UIStructureTemplater, UIScroller) {
        this.$config = config;
        this.$dateHelper = dateHelper;
        this.$i18n = i18n;
        this.$UIStructureListener = UIStructureListener;
        this.$UIStructureTemplater = UIStructureTemplater;
        this.$UIStructureTemplater.register();
        this.$UIScroller = UIScroller;
    },

    render: function() {
        $(this.$config.getRootElementID()).grab(Mooml.render('overlayTemplate'));
        $(this.$config.getRootElementID()).grab(Mooml.render('headerTemplate', {config: this.$config, i18n: this.$i18n}));
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
            Mooml.render('attributesStructureTemplate', {i18n: this.$i18n, byGroup: this.$ARBuilder.getARManager().getAttributesByGroup(), inProgress: this.$ARBuilder.getETreeManager().getInProgress()}).replaces(attributes);
        } else {
            navigation.grab(Mooml.render('attributesStructureTemplate', {i18n: this.$i18n, byGroup: false, inProgress: false}));
        }

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

    resizeApplication: function() {
        var width = $('antecedent').getSize().x + $('interest-measures').getSize().x + $('succedent').getSize().x + 1; // IE9 hack (+1)
        $('ar-wrapper').setStyle('width', width);

        this.resizeWindow();
    },

    resizeWindow: function() {
        var contentWidth = Math.max($$('header')[0].getSize().x + 13, $(window).getSize().x, $('workplace').getSize().x + $('navigation').getSize().x + 40);
        var contentHeight = Math.max($$('header')[0].getSize().y + $('wrapper').getSize().y + $$('footer')[0].getSize().y + 60, $(window).getSize().y);

        // fix overlay width to 100%
        $('overlay').setStyle('width', contentWidth);

        // fix overlay height to 100%
        $('overlay').setStyle('height', contentHeight);

        // fix wrapper width to 100%
        $('wrapper').setStyle('width', contentWidth);
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