var UIStructureTemplater = new Class({
  register: function () {
    this.registerStructure();
    this.registerSettings();
    this.registerNavigation();
    this.registerActiveRule();
    this.registerFoundRules();
    this.registerMarkedRules();
    this.registerMarkedRulesTabs();
    this.registerUnsupportedBrowserWindow();
  },

  registerStructure: function () {
    Mooml.register('overlayTemplate', function () {
      section({id: 'overlay'},
        div({id: 'overlay-inner'})
      );
    });

    Mooml.register('mainTemplate', function (data) {
      var i18n = data.i18n;

      div({id: 'wrapper', 'class': 'clearfix'},
        section({id: 'workplace', 'class': 'clearfix'},
          section({id: 'content'},
            section({id: 'active-rule'}),
            section({id: 'found-rules'})
          )
        ),
        nav({id: 'navigation'})
      );
    });
  },

  registerUnsupportedBrowserWindow: function () {
    Mooml.register('unsupportedBrowserWindowTemplate', function (data) {
      var i18n = data.i18n,
          name = data.browserName;

      div({id: 'unsupported-browser-window'},
          //a({id: 'overlay-close', href: '#'}, i18n.translate('Close')),
          h2(i18n.translate('Unsupported browser')),
          form({action: '#', method: 'POST', id: 'unsupported-browser-form'},
              div({class: 'clearfix'},
                  span(i18n.translate('WARNING: You are using an old and deprecated version of web browser') + ' (' + name + '). ' + i18n.translate('Please upgrade to enjoy this application!'))
              ),
              input({type: 'submit', value: i18n.translate('I understand')})
          )
      );
    });
  },

  registerSettings: function () {
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
                span({'class': 'warningImg'}),
                span({'class': 'warningImg'},
                  em(i18n.translate('Association rule pattern reset')),
                  i18n.translate('Association rule pattern has to be reset due to new restrictions.'))) : '',
              span({'class': 'tooltip info'},
                span({'class': 'helpImg'}),
                span({'class': 'help'},
                  em(i18n.translate('Restrictions')),
                  i18n.translate('These are predefined association rule pattern restrictions, which do not depend on analysed data. The more expert the looser they are.')))),
            div(
              label({'for': 'as-select', 'class': 'thin'}, i18n.translate('Attribute suggestion') + ':'),
              autoSuggestPossible ? a({
                id: 'as',
                'href': '#',
                'class': settings.getRecEnabled() ? 'autosuggest-on' : 'autosuggest-off'
              }, i18n.translate(settings.getRecEnabled() ? 'On' : 'Off')) : span({'class': 'autosuggest-off'}, i18n.translate(settings.getRecEnabled() ? 'On' : 'Off')),
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
              span({'class': 'helpImg'}),
              span({'class': 'help'},
                em(i18n.translate('Limit')),
                i18n.translate('Maximal number of association rules to be searched for.')
              )
            )
          ),
          /*data.showFeedback ? div(
           label(i18n.translate('Auto filter') + ':'),
           a({id: 'autofilter', 'href': '#', 'class': settings.getBKAutoSearch() ? 'autofilter-on' : 'autofilter-off'}, i18n.translate(settings.getBKAutoSearch() ? 'On': 'Off')),
           span({'class': 'tooltip info'},
           span({'class': 'helpImg'}),
           span({'class': 'help'},
           em(i18n.translate('Auto filter')),
           i18n.translate('Association rules are automaticaly filtered according to expert background knowledge. This guarantees that only interesting association rules are left.')))
           ) : '', condition makes problem in IE11, in config is false => we don't use it */
          div(
            label(i18n.translate('Cache') + ':'),
            a({
              id: 'cache',
              'href': '#',
              'class': settings.getCaching() ? 'cache-on' : 'cache-off'
            }, i18n.translate(settings.getCaching() ? 'On' : 'Off')),
            span({'class': 'tooltip info'},
              span({'class': 'helpImg'}),
              span({'class': 'help'},
                em(i18n.translate('Cache')),
                i18n.translate('Some mining results are automatically cached so that they are retrieved much faster next time.')))
          ),
          div(
            label(i18n.translate('Debug mode') + ':'),
            a({
              id: 'debug',
              'href': '#',
              'class': settings.getDebug() ? 'debug-on' : 'debug-off'
            }, i18n.translate(settings.getDebug() ? 'On' : 'Off')),
            span({'class': 'tooltip info'},
              span({'class': 'helpImg'}),
              span({'class': 'help'},
                em(i18n.translate('Debug mode')),
                i18n.translate('Application shows and logs more information in debug mode.')))
          ),
          div(
            label(i18n.translate('Strict match') + ':'),
            a({
              id: 'strict',
              'href': '#',
              'class': settings.getStrictMatch() ? 'strict-on' : 'strict-off'
            }, i18n.translate(settings.getStrictMatch() ? 'On' : 'Off')),
            span({'class': 'tooltip info'},
              span({'class': 'helpImg'}),
              span({'class': 'help'},
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

  registerNavigation: function () {
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
            span({
              id: 'etree-progress',
              styles: {'display': inProgress ? 'block' : 'none'}
            }, i18n.translate('Sort in progress.')),
            div(a({id: 'attributes-by-list', href: '#'}, i18n.translate('attributes')))));
      } else {
        section({id: 'attributes'},
          h2({'class': 'minimize'}, i18n.translate('Attributes'), a({
            href: '#',
            'class': 'toggle',
            'title': i18n.translate('Minimize')
          }, ''), a({href: '#', 'class': 'filter', 'title': i18n.translate('Filter')}, ''),
            a({href: '#', 'class': 'selectable', 'title': i18n.translate('Selectable')}, '')),
          div({'class': 'datas-filter'},
            input({
              'id': 'attributes-filter',
              'title': i18n.translate('Input part of requested attribute name - special characters * and ? are supported.'),
              'type': 'text'
            }),
            a({href: '#', 'class': 'reset-filter', 'title': i18n.translate('Reset filter')})),
          div({'class': 'clearfix'},
            ul({'class': 'clearfix'}),
            span({
              id: 'etree-progress',
              styles: {'display': inProgress ? 'block' : 'none'}
            }, i18n.translate('Sort in progress.')),
            a({
              id: 'show-hidden-attributes',
              href: '#',
              styles: {'display': hasHiddenAttributes ? 'inline' : 'none'},
              title: i18n.translate('Show hidden attributes')
            }, i18n.translate('Show hidden')),
              div({class: 'navigation-checkbox-controls'},
                  a({
                      class: 'all',
                      title: i18n.translate('Select all')
                  }),
                  a({
                      class: 'invert',
                      title: i18n.translate('Invert selection')
                  }),
                  a({
                      class: 'none',
                      title: i18n.translate('Select none')
                  }),
                  a({
                      id: 'add-selected-attributes',
                      href: '#',
                      title: i18n.translate('Add selected attributes to rule pattern...')
                  }, i18n.translate('Add selected'))
              ),
              a({
                  id: 'add-all-unused-attributes',
                  href: '#',
                  title: i18n.translate('Add all unused attributes to rule pattern...')
              }, i18n.translate('Add all unused'))
//						div(a({id: 'attributes-by-group', href: '#'}, i18n.translate('predefined attributes')))
          ));
      }
    });

    Mooml.register('dataFieldsStructureTemplate', function (data) {
      var i18n = data.i18n;

      section({id: 'data-fields'},
        h2({'class': 'minimize'}, i18n.translate('Data fields'), a({
          href: '#',
          'class': 'toggle',
          'title': i18n.translate('Minimize')
        }, ''), a({href: '#', 'class': 'filter', 'title': i18n.translate('Filter')}, ''),
            a({href: '#', 'class': 'selectable', 'title': i18n.translate('Selectable')}, '')),
        div({'class': 'datas-filter'},
          input({
            'id': 'data-fields-filter',
            'title': i18n.translate('Input part of requested data field name - special characters * and ? are supported.'),
            'type': 'text'
          }),
          a({href: '#', 'class': 'reset-filter', 'title': i18n.translate('Reset filter')})),
        div(
            {'class': 'clearfix'},
          ul(),
            div({class: 'navigation-checkbox-controls'},
                a({
                  class: 'all',
                  title: i18n.translate('Select all')
                }),
                a({
                  class: 'invert',
                  title: i18n.translate('Invert selection')
                }),
                a({
                  class: 'none',
                  title: i18n.translate('Select none')
                }),
                a({
                  id: 'add-selected-data-fields',
                  href: '#',
                  title: i18n.translate('Add all selected data fields to attributes...')
                }, i18n.translate('Add selected to attributes'))
            )
        ));
    });

    Mooml.register('knowledgeBaseSelectStructureTemplate', function (data) {
      var i18n = data.i18n;

      section({id: 'knowledge-base-select'},
          h2({'class': 'minimize'}, i18n.translate('Knowledge base')),
          div({'class': 'clearfix'},
              strong({id: 'kb-ruleset'}, i18n.translate('Loading')+'...'),
              br(),
              /*label({'for': 'kb-select'}, i18n.translate('Active ruleset: ')),
              select({name: 'kb-select', id: 'kb-select'},
                  option({value: 2}, i18n.translate('Test ruleset (4)'))
              ),*/
              a({href: '#', 'id': 'change-ruleset', 'title': i18n.translate('Change ruleset')}, i18n.translate('Change ruleset'))
          ));
    });

    Mooml.register('reportsStructureTemplate', function (data) {
      var i18n = data.i18n;

      section({id: 'reports', class: 'clearfix', style: "display:none;"/*TODO pracovní skrytí bloku s analytickými zprávami*/},
        h2({'class': 'minimize'}, i18n.translate('Analytical Reports'), a({href: '#', 'class': 'toggle'}, '')),
        ul(),
        a({href: '#', id: 'createUserReport'}, i18n.translate('Create new report'))
      );
    });

  },

  registerActiveRule: function () {

    Mooml.register('arActionBoxTemplate',function(data){
      var rules=data.rules,
          pruningAvailable=data.pruningAvailable,
          pruningAllowed=data.pruningAllowed,
          pruningActive=data.pruningActive,
          miningInProgress=data.miningInProgress,
          i18n=data.i18n;

      if (rules){
        a({id: 'start-mining', href: '#'}, i18n.translate('Mine rules...'));
        if (pruningAvailable){
          div({id:'start-mining-with-pruning-label', title:i18n.translate('Prune founded rules using algorithm CBA (for classification). Allowed only for rule pattern with exactly one attribute in consequent.')},
            input({type:"checkbox", value:"CBA", disabled:(!pruningAllowed), defaultChecked:(pruningActive&&pruningAllowed), name:"start-mining-with-pruning", id:"start-mining-with-pruning"}),
            label({for:'start-mining-with-pruning'},i18n.translate('with pruning...'))
          );
        }
      }
      if (miningInProgress){
        a({id: 'stop-mining', href: '#'}, i18n.translate('Stop mining'));
      }
    });

    Mooml.register('activeRuleTemplate', function (data) {
      var rules = data.rules,
        attributes = data.attributes,
        taskBox = rules || attributes,
        i18n = data.i18n,
        displayAddIM = data.displayAddIM,
        miningInProgress = data.miningInProgress || false,
        activeRuleChanged = data.activeRuleChanged || false,
        miningState = data.miningState || '',
        miningProgressText = '',
        pruningAvailable = data.pruningAvailable || false,
        pruningAllowed = data.pruningAllowed || false,
        pruningActive = data.pruningActive || false;

      if (taskBox) {
        var taskText = i18n.translate('Do you want to');
        if (rules && attributes) {
          taskText += ' <a href="#" id="mine-rules-confirm">' + i18n.translate('mine rules') + '</a> ' + i18n.translate('or') + ' <a href="#" id="recommend-attributes-confirm">' + i18n.translate('recommend next attribute') + '</a>' + '?';
        } else if (rules) {
          taskText += ' <a href="#" id="mine-rules-confirm">' + i18n.translate('mine rules') + '</a>' + '?';
        } else if (attributes) {
          taskText += ' <a href="#" id="recommend-attributes-confirm">' + i18n.translate('recommend next attribute') + '</a>' + '?';
        }
        taskText += ' ' + i18n.translate('Or edit the rule pattern...');
      }

      if (activeRuleChanged) {
        //došlo ke změně vzoru pravidla
        if (taskBox && taskText != '') {
          miningProgressText = div({'class': 'question'}, taskText);
        } else {
          miningProgressText = div({'class': 'info'}, i18n.translate('Create an association rule pattern to start mining...'));
        }
      } else {
        if (miningInProgress) {
          miningProgressText = div({'class': 'in_progress'}, i18n.translate('Mining is in progress, it may take a while to get the results.'));
        } else if (miningState == 'solved') {
          if (data.foundRulesCount==0){
            miningProgressText = div({'class': 'solved'}, i18n.translate('Mining has finished, but no rules were found!'),' ', i18n.translate('Try to modify the rule pattern...'));
          }else{
            miningProgressText = div({'class': 'solved'}, i18n.translate('Mining has finished!'), ' ', i18n.translate('Work with discovered rules, or modify the rule pattern...'));
          }
        } else if (miningState == 'failed') {
          miningProgressText = div({'class': 'failed'}, i18n.translate('Mining has failed! Please try to modify the rule pattern...'));
        } else if (miningState == 'interrupted') {
          miningProgressText = div({'class': 'interrupted'}, i18n.translate('Mining was interrupted. Please try to modify the rule pattern...'));
        } else {
          miningProgressText = div({'class': 'info'}, i18n.translate('Create an association rule pattern to start mining...'));
        }
      }

      section({id: 'active-rule'},
        h2(i18n.translate('Association rule pattern')),
        div({id: 'ar-wrapper', 'class': 'clearfix'},
          div({id: 'antecedent'},
            h3(i18n.translate('Antecedent'),
                a({
                    href: '#',
                    id: 'empty-antecedent',
                    'title': i18n.translate('Empty')
                })
            )
          ),
          div({id: 'interest-measures'},
            h3(i18n.translate('Interest measures')),
            div(),
            displayAddIM ? a({href: '#', id: 'add-im'}, i18n.translate('Add interest measure')) : ''),
          div({id: 'succedent'}, h3(i18n.translate('Consequent'),
              a({
                  href: '#',
                  id: 'empty-succedent',
                  'title': i18n.translate('Empty')
              })
          ))
        ),
        div({'class': 'clearfix'}),
        div({id: 'ar-action-box'},
          Mooml.render('arActionBoxTemplate',{rules:rules,pruningAvailable:pruningAvailable,pruningAllowed:pruningAllowed,pruningActive:pruningActive,miningInProgress:miningInProgress,i18n:i18n}),
          miningProgressText
        )
      );
    });
  },

  registerFoundRules: function () {

    Mooml.register('foundRulesStructureTemplate', function (data) {
      var FRManager=data.FRManager;
      if (FRManager.rulesCount>0){

        var rulesCountInfo = '('+data.i18n.translate('rules: ')+' <strong>'+FRManager.rulesCount+'</strong>';
        if (FRManager.miningInterrupted){
          rulesCountInfo+=', '+data.i18n.translate('interrupted');
        }
        if (FRManager.miningInProgress){
          rulesCountInfo+=', '+data.i18n.translate('mining in progress...');
        }else if(FRManager.importInProgress){
          rulesCountInfo+=', '+data.i18n.translate('results import in progress...');
        }
        rulesCountInfo+=')';
        //máme nějaká pravidla pro zobrazení
        section({id: 'found-rules'},
          h2(data.i18n.translate('Discovered rules')),
          div(
            {id: 'found-rules-task-name'},
            FRManager.getTaskName(),
            span({class: 'count'},rulesCountInfo),
            a({href: '#', class: 'rename-task' , title: data.i18n.translate('Rename task') })
          ),
          Mooml.render('foundRulesControlsTemplate',data),
          Mooml.render('foundRulesTemplate',data),
          Mooml.render('foundRulesMultiControlsTemplate',data)
        );
      }else{
        section({id:'found-rules'});
      }

    });


  },

  registerMarkedRules: function () {
    Mooml.register('markedRulesStructureTemplate', function (data) {
      var i18n = data.i18n;

      section({id: 'marked-rules'},
          div({class: 'marked-rules-tasks-content empty'},
              div(
                  {class: 'marked-rules-empty marked-rules-task-name'},
                  data.i18n.translate('Here you can collect interesting rules...')
              )
          ),
          div({class: 'marked-rules-base-content empty'},
              div(
                  {class: 'marked-rules-empty marked-rules-task-name'},
                  data.i18n.translate('Here you can collect interesting rules...')
              )
          )
      );
    });
  },

    registerMarkedRulesTabs: function () {
        Mooml.register('markedRulesTabsStructureTemplate', function (data) {
            var i18n = data.i18n;

                section({id: 'marked-rules-tabs'},
                    h2({'class': 'marked-rules-tab marked-rules-tasks marked-rules-tab-active'},
                        a(i18n.translate('Rule clipboard'))),
                    h2({'class': 'marked-rules-tab marked-rules-base'},
                        a(i18n.translate('Knowledge base')))
                );
        });
    }
});