var UIStructureTemplater = new Class({
    register: function() {
        this.registerStructure();
        this.registerSettings();
        this.registerNavigation();
        this.registerActiveRule();
        this.registerMarkedRules();
    },

    registerStructure: function() {
        Mooml.register('overlayTemplate', function () {
            section({id: 'overlay'},
                div({id: 'overlay-inner'})
            );
        });

        Mooml.register('headerTemplate', function (data) {
            var i18n = data.i18n,
                config = data.config,
                browserDetector = data.browserDetector;

            header(
                browserDetector.isDeprecated() ? div({id: 'browser-warning'}, i18n.translate('WARNING: You are using an old and deprecated version of web browser') + ' (' + browserDetector.getFullName() + '). ' + i18n.translate('Please upgrade to enjoy this application!')) : '',
                div({id: 'settings'},
                a({href: '#', id: 'new-task'}, i18n.translate('New task')),
                a({
                    'id': 'go-to-cms',
                    'href': '..',
                    'target': 'blank'
                }, i18n.translate('Go to CMS')),
                a({href: config.getSupportUrl(), id: 'support', target: '_blank'}, i18n.translate('Support')),
                a({href: '#', id: 'settings-open'}, i18n.translate('Settings'))),
                h1(config.getName() + '<sup>' + config.getVersion() + '</sup><span>' + config.getSlogan() + '</span>'))
        });

        Mooml.register('mainTemplate', function (data) {
            var i18n = data.i18n;

            div({id: 'wrapper', 'class': 'clearfix'},
                section({id: 'workplace', 'class': 'clearfix'},
                    section({id: 'content'},
                        section({id: 'active-rule'}),
                        section({id: 'found-rules'},
                            h2(i18n.translate('Discovered rules')),
                            div({id: 'pager-label'}),
                            div({id: 'found-rules-count'}),
                            a({id: 'stop-mining', href: '#'}, i18n.translate('Stop mining')),//TODO úprava stopovacího tlačítka
                            div({id: 'paging'}),
                            div({id: 'pager'},
                                ul({'class': 'scroller'})),
                            a({id: 'view-task-setting', href: '#', target: '_blank'}, i18n.translate('Task setting')),
                            a({id: 'view-task-result', href: '#', target: '_blank'}, i18n.translate('Task result')),
                            a({id: 'pager-clear', href: '#'}, i18n.translate('Clear rules'))
                        )
                    )
                ),
                nav({id: 'navigation'})
            );
        });
                     
        Mooml.register('footerTemplate', function (data) {
            var i18n = data.i18n,
                config = data.config,
                dateHelper = data.dateHelper;
                
            footer('Copyright &copy; ' + config.getCopyright() + ', ' + dateHelper.getYear());
        });
    },

    registerSettings: function() {
        Mooml.register('newTaskTemplate', function (data) {
            var url = data.url;

            div({id: 'new-task-window'},
                iframe({src: url}));
        });

        Mooml.register('settingsTemplate', function (data) {
            var autoSuggestPossible = data.autoSuggestPossible,
                i18n = data.i18n,
                reset = data.reset,
                settings = data.settings;

            div({id: 'settings-window'},
                a({id: 'settings-close', href: '#'}, i18n.translate('Close')),
                h2(i18n.translate('Settings')),
                form({action: '#', method: 'POST', id: 'settings-form'},
                    div(
                        span({'class': 'category'}, i18n.translate('Association rule pattern restrictions'))),
                    div({'class': 'autocomplete'},
                        div(
                            label({'for': 'fl-select'}, i18n.translate('Restrictions') + ':'),
                            select({name: 'fl-select', id: 'fl-select'}),
                            reset ? span({'class': 'tooltip warning'},
                                span({'class': 'warning'},
                                    img({src: './images/icon-tooltip-warning.png'}),
                                    em(i18n.translate('Association rule pattern reset')),
                                    i18n.translate('Association rule pattern has to be reset due to new restrictions.'))) : '',
                                span({'class': 'tooltip info'},
                                    span({'class': 'help'},
                                        img({src: './images/icon-tooltip-help.png'}),
                                        em(i18n.translate('Restrictions')),
                                        i18n.translate('These are predefined association rule pattern restrictions, which do not depend on analysed data. The more expert the looser they are.')))),
                        div(
                            label({'for': 'as-select', 'class': 'thin'}, i18n.translate('Attribute suggestion') + ':'),
                            autoSuggestPossible ? a({id: 'as', 'href': '#', 'class': settings.getRecEnabled() ? 'autosuggest-on' : 'autosuggest-off'}, i18n.translate(settings.getRecEnabled() ? 'On': 'Off')) : span({'class': 'autosuggest-off'}, i18n.translate(settings.getRecEnabled() ? 'On': 'Off')),
                            span({id: 'as-select'}))),
                    div(
                        span({'class': 'category'}, i18n.translate('Discovered rules'))),
                    div(
                        label({'for': 'task-mode'}, i18n.translate('Task mode') + ':'),
                        select({name: 'task-mode', id: 'task-mode'})
                    ),
                    div(
                        label({
                            'for': 'rulesCnt'
                        }, i18n.translate('Limit') + ':'),
                        input({
                            'id': 'rules-cnt',
                            'type': 'number',
                            'class': 'shortnr',
                            'value': settings.getRulesCnt()
                        }),
                        span({'class': 'tooltip info'},
                            span({'class': 'help'},
                                img({src: './images/icon-tooltip-help.png'}),
                                em(i18n.translate('Limit')),
                                i18n.translate('Maximal number of association rules to be searched for.')
                            )
                        )
                    ),
                    /*data.showFeedback ? div(
                        label(i18n.translate('Auto filter') + ':'),
                        a({id: 'autofilter', 'href': '#', 'class': settings.getBKAutoSearch() ? 'autofilter-on' : 'autofilter-off'}, i18n.translate(settings.getBKAutoSearch() ? 'On': 'Off')),
                        span({'class': 'tooltip info'},
                            span({'class': 'help'},
                                img({src: './images/icon-tooltip-help.png'}),
                                em(i18n.translate('Auto filter')),
                                i18n.translate('Association rules are automaticaly filtered according to expert background knowledge. This guarantees that only interesting association rules are left.')))
                    ) : '', condition makes problem in IE11, in config is false => we don't use it */
                    div(
                        label(i18n.translate('Cache') + ':'),
                        a({id: 'cache', 'href': '#', 'class': settings.getCaching() ? 'cache-on' : 'cache-off'}, i18n.translate(settings.getCaching() ? 'On': 'Off')),
                        span({'class': 'tooltip info'},
                            span({'class': 'help'},
                                img({src: './images/icon-tooltip-help.png'}),
                                em(i18n.translate('Cache')),
                                i18n.translate('Some mining results are automatically cached so that they are retrieved much faster next time.')))
                    ),
                    div(
                        label(i18n.translate('Debug mode') + ':'),
                        a({id: 'debug', 'href': '#', 'class': settings.getDebug() ? 'debug-on' : 'debug-off'}, i18n.translate(settings.getDebug() ? 'On': 'Off')),
                        span({'class': 'tooltip info'},
                            span({'class': 'help'},
                                img({src: './images/icon-tooltip-help.png'}),
                                em(i18n.translate('Debug mode')),
                                i18n.translate('Application shows and logs more information in debug mode.')))
                    ),
                    div(
                        label(i18n.translate('Strict match') + ':'),
                        a({id: 'strict', 'href': '#', 'class': settings.getStrictMatch() ? 'strict-on' : 'strict-off'}, i18n.translate(settings.getStrictMatch() ? 'On': 'Off')),
                        span({'class': 'tooltip info'},
                            span({'class': 'help'},
                                img({src: './images/icon-tooltip-help.png'}),
                                em(i18n.translate('Strict match')),
                                i18n.translate('All attributes from task setting must appear in discovered rules.')))
                    ),
                    br({'class': 'clearfix'}),
                    input({type: 'submit', 'value': i18n.translate('Save')})));
        });

        Mooml.register('flOptionTemplate', function (data) {
            var FL = data.FL,
                isSelected = data.isSelected;

            if (isSelected === true) {
                option({'value': FL.getName(), 'selected': 'selected'}, FL.getLocalizedName());
            } else {
                option({'value': FL.getName()}, FL.getLocalizedName());
            }
        });

        Mooml.register('taskModeOptionTemplate', function (data) {
            var i18n = data.i18n,
                taskMode = data.taskMode,
                isSelected = data.isSelected;

            if (isSelected === true) {
                option({value: taskMode.value, selected: 'selected'}, i18n.translate(taskMode.name));
            } else {
                option({value: taskMode.value}, i18n.translate(taskMode.name));
            }
        });
    },

    registerNavigation: function() {
        Mooml.register('attributesStructureTemplate', function (data) {
            var byGroup = data.byGroup,
                inProgress = data.inProgress,
                i18n = data.i18n,
                hasHiddenAttributes = data.hasHiddenAttributes;

            if (byGroup) {
                section({id: 'attributes'},
                    h2({'class': 'minimize'}, i18n.translate('Attributes'), a({href: '#', 'class': 'toggle'}, '')),
                    div(
                        ul(),
                        span({id: 'etree-progress', styles: {'visibility': inProgress ? 'visible' : 'hidden'}}, i18n.translate('Sort in progress.')),
                        div(a({id: 'attributes-by-list', href: '#'}, i18n.translate('attributes')))));
            } else {
                section({id: 'attributes'},
                    h2({'class': 'minimize'}, i18n.translate('Attributes'), a({href: '#', 'class': 'toggle', 'title': i18n.translate('Minimize')}, ''), a({href: '#', 'class': 'filter', 'title': i18n.translate('Filter')}, '')),
                    div({'class': 'datas-filter'},
                        input({
                            'id': 'attributes-filter',
                            'type': 'text'
                        }),
                        a({href: '#', 'class': 'reset-filter', 'title': i18n.translate('Reset filter')})),
                    div({'class': 'clearfix'},
                        ul({'class': 'clearfix'}),
                        span({id: 'etree-progress', styles: {'visibility': inProgress ? 'visible' : 'hidden'}}, i18n.translate('Sort in progress.')),
                        a({id: 'show-hidden-attributes', href: '#', styles: {'display': hasHiddenAttributes ? 'inline' : 'none'}}, 'Show hidden attributes')
//						div(a({id: 'attributes-by-group', href: '#'}, i18n.translate('predefined attributes')))
                    ));
            }
        });

        Mooml.register('dataFieldsStructureTemplate', function (data) {
            var i18n = data.i18n;

            section({id: 'data-fields'},
                h2({'class': 'minimize'}, i18n.translate('Data fields'), a({href: '#', 'class': 'toggle', 'title': i18n.translate('Minimize')}, ''), a({href: '#', 'class': 'filter', 'title': i18n.translate('Filter')}, '')),
                div({'class': 'datas-filter'},
                    input({
                        'id': 'data-fields-filter',
                        'type': 'text'
                    }),
                    a({href: '#', 'class': 'reset-filter', 'title': i18n.translate('Reset filter')})),
                div(
                    ul({'class': 'clearfix'})));
        });

        Mooml.register('reportsStructureTemplate', function (data) {
            var i18n = data.i18n;

            section({ id: 'reports', class: 'clearfix' },
                h2({'class': 'minimize'}, i18n.translate('Analytical Reports'), a({href: '#', 'class': 'toggle'}, '')),
                ul(),
                a({ href: '#', id: 'createUserReport' }, i18n.translate('Create new report'))
            );
        });

        Mooml.register('brBaseStructureTemplate', function (data) {
            var i18n = data.i18n;

            section({ id: 'brBase', class: 'clearfix' },
                h2({}, i18n.translate('BR Base'), a({href: '#', 'class': 'toggle'}, '')),
                div({id:'brBaseCounter'}),
                a({ href: '#', id: 'showBRBase' }, i18n.translate('Show BR base'))
            );
        });
    },

    registerActiveRule: function() {
        Mooml.register('activeRuleTemplate', function (data) {
            var rules = data.rules,
                attributes = data.attributes,
                taskBox = rules || attributes,
                i18n = data.i18n,
                displayAddIM = data.displayAddIM;

            if (taskBox) {
                var taskText = i18n.translate('Do you want to');
                if (rules && attributes) {
                    taskText += ' <a href="#" id="mine-rules-confirm">' + i18n.translate('mine rules') + '</a> ' + i18n.translate('or') + ' <a href="#" id="recommend-attributes-confirm">' + i18n.translate('recommend next attribute') + '</a>' + '?';
                } else if (rules) {
                    taskText += ' <a href="#" id="mine-rules-confirm">' + i18n.translate('mine rules') + '</a>' + '?';
                } else if (attributes) {
                    taskText += ' <a href="#" id="recommend-attributes-confirm">' + i18n.translate('recommend next attribute') + '</a>' + '?';
                }
            }

            section({id: 'active-rule'},
                h2(i18n.translate('Association rule pattern')),
                    div({id: 'ar-wrapper', 'class': 'clearfix'},
                        div({id: 'antecedent'},
                            h3(i18n.translate('Antecedent'))
                        ),
                        div({id: 'interest-measures'},
                            h3(i18n.translate('Interest measures')),
                            div(),
                            displayAddIM ? a({href: '#', id: 'add-im'}, i18n.translate('Add interest measure')) : ''),
                        div({id: 'succedent'}, h3(i18n.translate('Consequent')))
                    ),
                div({'class': 'clearfix'}),
                span({id: 'action-box', styles: {'visibility': taskBox ? 'visible' : 'hidden'}}, taskText));
                //TODO přidání tlačítka pro spuštění minování...
        });
    },

    registerMarkedRules: function() {
        Mooml.register('markedRulesStructureTemplate', function (data) {
            var i18n = data.i18n;

            section({id: 'marked-rules'},
                h2({'class': 'minimize'}, i18n.translate('Rule clipboard'), a({href: '#', 'class': 'toggle'}, '')),
                div({ class: 'clearfix' },
                    ul()
                )
            );
        });
    }
});