var UITemplateRegistrator = new Class({
  initialize: function () {
    this.registerNavigation();
    this.registerActiveRule();
    this.registerIMWindow();
    this.registerClickAddAttributeWindow();
    this.registerAddCoefficientWindow();
    this.registerEditConnectiveWindow();
    this.registerFoundRules();
    this.registerMarkedRules();
    this.registerRuleIMs();
    this.registerAttributeWindow();
    this.registerCurrentUser();
  },

  registerNavigation: function () {
    Mooml.register('attributeByListTemplate', function (data) {
      var i18n = data.i18n,
        attribute = data.attribute,
        isUsed = data.isUsed,
        showEditAttribute = data.showEditAttribute,
        showRemoveAttribute = data.showRemoveAttribute;

      var className = '';
      if (attribute.isRecommended()) {
        className = 'rec1';
      } else if (attribute.isPartiallyRecommended()) {
        className = 'rec2';
      } else if (isUsed) {
        className = 'used';
      } else if (attribute.isHidden()) {
        className = 'hidden';
      }

      li({'class': className},
          input({type:'checkbox',id:attribute.getCSSCheckboxID(), class:'attribute-checkbox', 'data-id': attribute.getName()}),
        a({href: '#', id: attribute.getCSSAddID(), class: 'add', title: i18n.translate('Add attribute')}),
        span({id: attribute.getCSSID(), title: attribute.getName()}, attribute.getName()),
        showRemoveAttribute ? a({
          href: '#',
          id: attribute.getCSSRemoveID(),
          'class': 'remove-attribute',
          'title': i18n.translate('Hide')
        }) : '',
        showEditAttribute ? a({
          href: '#',
          id: attribute.getCSSEditID(),
          'class': 'edit-attribute',
          'title': i18n.translate('Edit')
        }) : '',
        a({
          href: '#',
          id: attribute.getCSSShowHistogramID(),
          'class': 'show-histogram',
          'title': i18n.translate('Show histogram')
        })
      );
    });

    Mooml.register('dataFieldTemplate', function (data) {
      var i18n = data.i18n,
        field = data.field;

      li({id: field.getCSSID()},
          input({type:'checkbox',id:field.getCSSCheckboxID(), class:'data-field-checkbox', 'data-id': field.getName()}),
        a({href: '#', id: field.getCSSAddID(), class: 'add', title: i18n.translate('Add to attributes')}),
        span({title: field.getName()}, field.getName()),
        a({
          href: '#',
          id: field.getCSSShowHistogramID(),
          'class': 'show-histogram',
          'title': i18n.translate('Show histogram')
        })
      );
    });

    Mooml.register('changeRulesetWindowTemplate', function (data) {
      var i18n = data.i18n;

      div({id: 'change-ruleset-window'},
          a({id: 'overlay-close', href: '#', 'title': i18n.translate('Close')}),
          h2(i18n.translate('Current ruleset')),
          div({id: 'current-ruleset', class: 'actionsDiv bigButtons'}),
          br(),
          h2(i18n.translate('Change ruleset to')),
          div({id: 'change-ruleset-list', class: 'actionsDiv bigButtons'}),
          br(),
          input({id: 'add-ruleset', type: 'submit', value: i18n.translate('Add new ruleset')}));
    });

    Mooml.register('exportWindowTemplate', function (data) {
      var i18n = data.i18n,
          type = data.type,
          links = data.links,
          isMiningInProgress=data.isMiningInProgress,
          isImportInProgress=data.isImportInProgress,
          domLinks = [];

      Object.each(links, function (value, id) {
        console.log(value);
        if ((!isMiningInProgress || value.miningInProgress) && (!isImportInProgress || value.importInProgress)) {
          domLinks.push(a({href: value.url, target: "_blank"}, value.text));
        }
      }.bind(this));

      div({id: 'export-window'},
          a({id: 'overlay-close', href: '#', 'title': i18n.translate('Close')}),
          h2(i18n.translate('Export '+type)),
          div({id: 'export-list', class: 'actionsDiv bigButtons'},
              domLinks
          ));
    });

    Mooml.register('changeRulesetWindowItemTemplate', function (data) {
      var id = data.id,
          name = data.name+' (rules: '+data.rulesCount+')';

      a({href: '#', rel: id}, name,
        span(data.description));
    });

    Mooml.register('changeRulesetWindowAddTemplate', function (data) {
      var i18n = data.i18n;

      form({id: 'add-ruleset-form'},
          label({for: 'add-ruleset-name'}, i18n.translate('Ruleset name:')),
          input({id: 'add-ruleset-name', type: 'text'}),
          ' * '+i18n.translate('required'),
          label({for: 'add-ruleset-description'}, i18n.translate('Ruleset description:')),
          input({id: 'add-ruleset-description', type: 'text'}),
          input({id: 'add-ruleset-submit', type: 'submit', value: i18n.translate('Add ruleset')}),
          input({id: 'add-ruleset-storno', type: 'reset', value: i18n.translate('Storno')}))
    });

    Mooml.register('activeRulesetTemplate', function (data) {
      span({id: 'kb-ruleset'},
          strong(data.name),
          br(),
          data.i18n.translate('rules')+': '+data.count
      );
    });

    Mooml.register('knowledgeBaseTemplate', function (data) {
      var id = data.rule_set_id,
          name = data.name+' ('+data.rulesCount+')';

      option({'value': id, 'selected': data.selected}, name);
    });

    Mooml.register('reportTemplate', function (data) {
      var i18n = data.i18n,
        report = data.report,
        url = data.url;

      li({id: 'report' + report.id}, a({href: url, target: '_blank'}, report.name));
    });

    Mooml.register('createUserReportWindowTemplate', function (data) {
      div({id: 'create-user-report-window'},
        a({
            id: 'overlay-close',
            href: '#',
            'title': i18n.translate('Close')
          }
        ),
        iframe({src: data.url}));
    });
  },

  registerActiveRule: function () {
    Mooml.register('interestMeasureTemplate', function (data) {
      var IM = data.IM,
        i18n = data.i18n;

      div({id: IM.getCSSID(), class: 'im'},
        span({'class': 'name', 'title': IM.getFields().localizedName},
          IM.getLocalizedName() + ': ',
          IM.hasThreshold() ? span({'class': 'threshold'}, IM.getThreshold()) : '',
          IM.hasThreshold() && IM.hasAlpha() ? ', ' : '',
          IM.hasAlpha() ? span({'class': 'alpha'}, 'α ' + IM.getAlpha()) : ''),
        a({id: IM.getCSSEditID(), href: '#', 'class': 'edit-im', 'title': i18n.translate('Edit')}),
        a({id: IM.getCSSRemoveID(), href: '#', 'class': (IM.$required?'remove-im required':'remove-im'), 'title': i18n.translate('Remove')}));
    });

    Mooml.register('cedentTemplate', function (data) {
      var rule = data.rule,
        cedent = data.cedent,
        i18n = data.i18n;

      div({id: cedent.getCSSID(), 'class': 'cedent' + (cedent.getNumFields() === 0 ? ' empty' : '')},
        div({
          id: cedent.getCSSFieldsID(),
          'class': 'fields'
        }, !cedent.getNumFields() ? '<span class="info">Drag & Drop<br/>attribute here</span>' : ''),
        rule.getGroupFields() && cedent.displayGroupButton() ? '<a href="#" id="' + cedent.getCSSGroupFieldsConfirmID() + '" class="group-fields">' + i18n.translate('Group marked fields') + '</a>' : ''
      );
    });

    Mooml.register('noRestrictionTemplate', function (data) {
      var i18n = data.i18n;

      div({
        'class': 'no-restriction',
        'title': i18n.translate('No restriction box will be considered as empty cedent.')
      }, i18n.translate('No restriction'));
    });

    Mooml.register('fieldTemplate', function (data) {
      var field = data.field,
        i18n = data.i18n,
        markFieldAllowed = data.markFieldAllowed;

      var fieldSign = field.getSign().toLowerCase();

      if (field.getType() === null) {
        div({id: field.getCSSID(), 'class': 'field'},
          span({id: field.getCSSDragID()}, field.toString()));
      } else {
        div({id: field.getCSSID(), 'class': 'field'},
          fieldSign === 'negative' ? a({
            id: field.getCSSChangeSignID(),
            href: '#',
            'class': 'change-sign ' + fieldSign
          }) : '',
          span({id: field.getCSSDragID(), 'class': 'field-drag'}, field.toString()),
          div({'class': 'controls'},
            a({id: field.getCSSRemoveID(), href: '#', 'class': 'remove-field', 'title': i18n.translate('Remove')}),
            a({
              id: field.getEditCoefficientCSSID(),
              href: '#',
              'class': 'edit-coefficient',
              'title': i18n.translate('Edit')
            }),
            fieldSign === 'positive' ? a({
              id: field.getCSSChangeSignID(),
              href: '#',
              'class': 'change-sign ' + fieldSign
            }) : '',
            markFieldAllowed ? a({
              id: field.getCSSMarkID(),
              href: '#',
              'class': field.isMarked() === true ? 'marked-field' : 'mark-field',
              'title': field.isMarked() === true ? i18n.translate('Unmark') : i18n.translate('Mark')
            }) : ''));
      }
    });

    Mooml.register('connectiveTemplate', function (data) {
      var connective = data.connective,
          editable = data.editable,
          i18n = data.i18n;

      div({id: connective.getCSSID(), 'class': 'connective'},
          ((editable) ? a({href: '#', 'class': 'edit-connective', 'title': i18n.translate('edit connective')}, connective.toString()) : connective.toString())
      );

    });

    Mooml.register('bracketTemplate', function (data) {
      var isLeft = data.isLeft;

      if (isLeft === true) {
        span({'class': 'left-bracket'}, '(');
      } else {
        span({'class': 'right-bracket'}, ')');
      }
    });
  },

  registerIMWindow: function () {
    Mooml.register('addIMWindowTemplate', function (data) {
      var i18n = data.i18n;

      div({id: 'add-im-window'},
        a({id: 'overlay-close', href: '#', 'title': i18n.translate('Close')}),
        h2(i18n.translate('Add interest measure')),
        form({action: '#', method: 'POST', id: 'add-im-form', novalidate: ''},
          label({'for': 'add-im-select'}, i18n.translate('Interest measure:')),
          select({name: 'add-im-select', id: 'add-im-select'}),
            p({'class': 'help'},
                span('')
            ),
          div({'class': 'autocomplete clearfix'}),
          input({type: 'submit', value: i18n.translate('Add')})));
    });

    Mooml.register('editIMWindowTemplate', function (data) {
      var i18n = data.i18n,
        IM = data.IM;

      div({id: 'edit-im-window'},
        a({id: 'overlay-close', href: '#', 'title': i18n.translate('Close')}),
        h2(i18n.translate('Edit interest measure')),
        form({action: '#', method: 'POST', id: 'edit-im-form', novalidate: ''},
          label({'for': 'edit-im-select'}, i18n.translate('Interest measure:')),
          em({class: 'normal'}, IM.getLocalizedName()),
          select({name: 'edit-im-select', id: 'edit-im-select', styles: {display: 'none'}}),
            p({'class': 'help'},
                span('')
            ),
          div({'class': 'autocomplete clearfix'}),
          input({type: 'submit', value: i18n.translate('Edit')})));
    });

    Mooml.register('IMWindowSelectOptionTemplate', function (data) {
      var IM = data.IM,
        isSelected = data.isSelected;

      if (isSelected === true) {
        option({'value': IM.name, 'selected': 'selected'}, IM.getLocalizedName());
      } else {
        option({'value': IM.name}, IM.getLocalizedName());
      }
    });
  },

  registerClickAddAttributeWindow: function () {
    Mooml.register('clickAddAttributeWindowTemplate', function (data) {
      var i18n = data.i18n;

      div({id: 'click-add-attribute-window'},
        a({id: 'overlay-close', href: '#', 'title': i18n.translate('Close')}),
        h2(i18n.translate('Add attribute')),
        form({action: '#', method: 'POST', id: 'click-add-attribute-form'},
          div({class: 'clearfix'},
            label({'for': 'click-add-attribute-select'}, i18n.translate('Add to')),
            select({name: 'click-add-attribute-select', id: 'click-add-attribute-select'},
              option({'value': 'antecedent'}, i18n.translate('Antecedent')),
              option({'value': 'consequent'}, i18n.translate('Consequent'))
            )
          ),
          input({type: 'submit', value: i18n.translate('Add')})
        )
      );
    });
  },

  registerAddCoefficientWindow: function () {
    Mooml.register('addCoefficientWindowTemplate', function (data) {
      var i18n = data.i18n;

      div({id: 'add-coefficient-window'},
        a({id: 'add-coefficient-close', href: '#', 'title': i18n.translate('Close')}),
        h2(i18n.translate('Set value type')),
        form({action: '#', method: 'POST', id: 'add-coefficient-form'},
          label({'for': 'add-coefficient-select'}, i18n.translate('Value type:')),
          select({name: 'add-coefficient-select', id: 'add-coefficient-select'}),
          span({id: 'add-coefficient-autocomplete'})),
        div({'class': 'clearfix'}));
    });

    Mooml.register('editCoefficientWindowTemplate', function (data) {
      var i18n = data.i18n;

      div({id: 'edit-coefficient-window'},
        a({id: 'overlay-close', href: '#', 'title': i18n.translate('Close')}),
        h2(i18n.translate('Edit value type')),
        form({action: '#', method: 'POST', id: 'edit-coefficient-form'},
          label({'for': 'edit-coefficient-select'}, i18n.translate('Value type:')),
          select({name: 'edit-coefficient-select', id: 'edit-coefficient-select'}),
          span({id: 'edit-coefficient-autocomplete'})),
        div({'class': 'clearfix'}));
    });

    Mooml.register('addCoefficientWindowAutocompleteTemplate', function (data) {
      var selectedCoefficient = data.selectedCoefficient,
        i18n = data.i18n;

      if (selectedCoefficient.getName() === 'One category') {
        span({id: 'add-coefficient-autocomplete'},
          //select({name: 'add-coefficient-select', id: 'add-coefficient-select'}),
            p({'class': 'help'},
                span('')
            ),
            div({'class': 'autocomplete clearfix'},
                label({'for': 'add-coefficient-category'}, selectedCoefficient.fields.category.localizedName + ':'),
                select({name: 'add-coefficient-category', id: 'add-coefficient-category'})
            ),
          input({type: 'submit', value: i18n.translate('Add')}));
      } else {
        span({id: 'add-coefficient-autocomplete'},
          //select({name: 'add-coefficient-select', id: 'add-coefficient-select'}),
            p({'class': 'help'},
                span('')
            ),
          div({'class': 'autocomplete clearfix'},
            label({id: 'add-coefficient-minlength-label', 'for': 'add-coefficient-minlength'}, selectedCoefficient.fields.minLength.localizedName + ':'),
            input({
              type: 'number',
              min: 1,
              step: 1,
              name: 'add-coefficient-minlength',
              id: 'add-coefficient-minlength',
              readonly: 'readonly',
              pattern: '[0-9]+',
              required: ''
            }),
            div({id: 'add-coefficient-minlength-slider', 'class': 'slider'},
              div({'class': 'knob'})
            ),
            label({id: 'add-coefficient-maxlength-label', 'for': 'add-coefficient-maxlength'}, selectedCoefficient.fields.maxLength.localizedName + ':'),
            input({
              type: 'number',
              min: 1,
              step: 1,
              name: 'add-coefficient-maxlength',
              id: 'add-coefficient-maxlength',
              readonly: 'readonly',
              pattern: '[0-9]+',
              required: ''
            }),
            div({id: 'add-coefficient-maxlength-slider', 'class': 'slider'},
              div({'class': 'knob'})
            )
          ),
          input({type: 'submit', value: i18n.translate('Add')}));
      }
    });

    Mooml.register('editCoefficientWindowAutocompleteTemplate', function (data) {
      var field = data.field,
        selectedCoefficient = data.selectedCoefficient,
        i18n = data.i18n;

      if (selectedCoefficient.getName() === 'One category') {
        span({id: 'edit-coefficient-autocomplete'},
          //select({name: 'edit-coefficient-select', id: 'edit-coefficient-select'}),
            p({'class': 'help'},
                span('')
            ),
            div({'class': 'autocomplete clearfix'},
                label({'for': 'edit-coefficient-category'}, selectedCoefficient.fields.category.localizedName + ':'),
                select({name: 'edit-coefficient-category', id: 'edit-coefficient-category'})
            ),
          //label({'for': 'edit-coefficient-category'}, i18n.translate('Category')),
          input({type: 'submit', value: i18n.translate('Edit')}));
      } else {
        span({id: 'edit-coefficient-autocomplete'},
          //select({name: 'edit-coefficient-select', id: 'edit-coefficient-select'}),
            p({'class': 'help'},
                span('')
            ),
            div({'class': 'autocomplete clearfix'},
                label({id: 'edit-coefficient-minlength-label', 'for': 'edit-coefficient-minlength'}, selectedCoefficient.fields.minLength.localizedName + ':'),
                input({
                    type: 'number',
                    min: 1,
                    step: 1,
                    name: 'edit-coefficient-minlength',
                    id: 'edit-coefficient-minlength',
                    readonly: 'readonly',
                    value: field.getMinimalLength(),
                    pattern: '[0-9]+',
                    required: ''
                }),
                div({id: 'edit-coefficient-minlength-slider', 'class': 'slider'},
                    div({'class': 'knob'})
                ),
                label({id: 'edit-coefficient-maxlength-label', 'for': 'edit-coefficient-maxlength'}, selectedCoefficient.fields.maxLength.localizedName + ':'),
                input({
                    type: 'number',
                    min: 1,
                    step: 1,
                    name: 'edit-coefficient-maxlength',
                    id: 'edit-coefficient-maxlength',
                    readonly: 'readonly',
                    value: field.getMaximalLength(),
                    pattern: '[0-9]+',
                    required: ''
                }),
                div({id: 'edit-coefficient-maxlength-slider', 'class': 'slider'},
                    div({'class': 'knob'})
                )
            ),
          input({type: 'submit', value: i18n.translate('Edit')}));
      }
    });

    Mooml.register('addCoefficientWindowSelectOptionTemplate', function (data) {
      var coefficient = data.coefficient,
        isSelected = data.isSelected;

      if (isSelected === true) {
        option({'value': coefficient.getName(), 'selected': 'selected'}, coefficient.getLocalizedName());
      } else {
        option({'value': coefficient.getName()}, coefficient.getLocalizedName());
      }
    });

    Mooml.register('editCoefficientWindowSelectOptionTemplate', function (data) {
      var coefficient = data.coefficient,
        isSelected = data.isSelected;

      if (isSelected === true) {
        option({'value': coefficient.getName(), 'selected': 'selected'}, coefficient.getLocalizedName());
      } else {
        option({'value': coefficient.getName()}, coefficient.getLocalizedName());
      }
    });

    Mooml.register('addCoefficientWindowSelectOption2Template', function (data) {
      var choice = data.choice;

      option({'value': choice}, choice);
    });

    Mooml.register('editCoefficientWindowSelectOption2Template', function (data) {
      var choice = data.choice,
        isSelected = data.isSelected;

      if (isSelected === true) {
        option({'value': choice, 'selected': 'selected'}, choice);
      } else {
        option({'value': choice}, choice);
      }
    });

  },

  registerEditConnectiveWindow: function () {
    Mooml.register('editConnectiveWindowTemplate', function (data) {
      var i18n = data.i18n;

      div({id: 'edit-connective-window'},
        a({id: 'overlay-close', href: '#', 'title': i18n.translate('Close')}),
        h2(i18n.translate('Edit connective')),
        form({action: '#', method: 'POST', id: 'edit-connective-form'},
          div({class: 'clearfix'},
            label({'for': 'edit-connective-select'}, i18n.translate('Connective')),
            select({name: 'edit-connective-select', id: 'edit-connective-select'})
          ),
          input({type: 'submit', value: i18n.translate('Edit')})
        )
      );
    });

    Mooml.register('editConnectiveWindowSelectOptionTemplate', function (data) {
      var connective = data.connective,
        isSelected = data.isSelected;

      if (isSelected === true) {
        option({'value': connective, 'selected': 'selected'}, connective);
      } else {
        option({'value': connective}, connective);
      }
    });
  },

  registerFoundRules: function () {
    /**
     * Template for 1 found rule
     */
    Mooml.register('foundRuleTemplate', function (data) {
      var
        foundRule = data.foundRule,
        i18n = data.i18n,
        IMs = data.IMs,
          positiveElm,
          negativeElm,
          title;

      if(foundRule.getRuleSetRelation()=="positive"){
        positiveElm = a({id: foundRule.getKBAddPositiveCSSID(), href:'#', class:'kbRemovePositive', title:i18n.translate('Remove from Knowledge Base')});
        negativeElm = a({id: foundRule.getKBAddNegativeCSSID(), href:'#', class:'kbAddNegative', title:i18n.translate('Add to Knowledge Base as not interesting')});
      } else if(foundRule.getRuleSetRelation()=="negative") {
        positiveElm = a({id: foundRule.getKBAddPositiveCSSID(), href:'#', class:'kbAddPositive', title:i18n.translate('Add to Knowledge Base as interesting')});
        negativeElm = a({id: foundRule.getKBAddNegativeCSSID(), href:'#', class:'kbRemoveNegative', title:i18n.translate('Remove from Knowledge Base')});
      } else{
        if(foundRule.getInterestRelation()=="positive"){
          if(foundRule.getInterestRate()=="y"){
            positiveElm = a({id: foundRule.getKBAddPositiveCSSID(), href:'#', class:'kbAddPositive kbPositiveNotice', title:i18n.translate('Add to Knowledge Base as interesting')});
            title = i18n.translate('Seems to be similar to interesting Rule in Knowledge Base - is checking deeply');
          } else{
            positiveElm = a({id: foundRule.getKBAddPositiveCSSID(), href:'#', class:'kbAddPositive kbPositive'+foundRule.getInterestRate(), title:i18n.translate('Add to Knowledge Base as interesting')});
            title = i18n.translate('Up to '+foundRule.getInterestRate()+'% similarity with interesting Rule in Knowledge Base');
          }
          negativeElm = a({id: foundRule.getKBAddNegativeCSSID(), href:'#', class:'kbAddNegative', title:i18n.translate('Add to Knowledge Base as not interesting')});
        } else if(foundRule.getInterestRelation()=="negative"){
          if(foundRule.getInterestRate()=="y"){
            negativeElm = a({id: foundRule.getKBAddNegativeCSSID(), href:'#', class:'kbAddNegative kbNegativeNotice', title:i18n.translate('Add to Knowledge Base as not interesting')});
            title = i18n.translate('Seems to be similar to not interesting Rule in Knowledge Base - is checking deeply');
          } else{
            negativeElm = a({id: foundRule.getKBAddNegativeCSSID(), href:'#', class:'kbAddNegative kbNegative'+foundRule.getInterestRate(), title:i18n.translate('Add to Knowledge Base as not interesting')});
            title = i18n.translate('Up to '+foundRule.getInterestRate()+'% similarity with not interesting Rule in Knowledge Base');
          }
          positiveElm = a({id: foundRule.getKBAddPositiveCSSID(), href:'#', class:'kbAddPositive', title:i18n.translate('Add to Knowledge Base as interesting')});
        } else{
            positiveElm = a({id: foundRule.getKBAddPositiveCSSID(), href:'#', class:'kbAddPositive', title:i18n.translate('Add to Knowledge Base as interesting')});
            negativeElm = a({id: foundRule.getKBAddNegativeCSSID(), href:'#', class:'kbAddNegative', title:i18n.translate('Add to Knowledge Base as not interesting')});
        }
      }

      li({id: foundRule.getCSSID(), 'class': 'found-rule'+(foundRule.isSelected()?' selected':'')+' KB'+foundRule.getRuleSetRelation()+(foundRule.isLoading()?' loading':''), title: title},
        input({type:'checkbox',id:foundRule.getCSSID()+'-checkbox', class:'found-rule-checkbox'}),
        label({for: foundRule.getCSSID()+'-checkbox', 'class': 'rule'}, foundRule.getIdent()),
        span({class:'ruleActions'},
          (foundRule.isSelected()?
            a({id: foundRule.getUnmarkCSSID(), href: '#', 'class': 'unmark', 'title': i18n.translate('Remove from Rule Clipboard')})
            :
            a({id: foundRule.getMarkCSSID(), href: '#', 'class': 'mark', 'title': i18n.translate('Add to Rule Clipboard')})
          ),
          positiveElm,
          negativeElm,
          a({id: foundRule.getDetailsCSSID(),href: '#','class': 'details','title': i18n.translate('Show rule details')})
        ),
        span({'class': 'ims'}, Mooml.render('ruleIMs', {ruleValues: foundRule.getRuleValues(), IMs: IMs}))
      );
    });

    Mooml.register('foundRulesTemplate',function(data){
      var FRManager = data.FRManager;
      var foundRulesContainer = ul({id:'found-rules-rules'});

      if (FRManager.errorMessage!='' && FRManager.errorMessage!=null){
        p({'class':'error'},"XXX"+FRManager.errorMessage+'XXX');
      }else{
        Array.each(FRManager.rules,function(foundRule){
          foundRulesContainer.grab(Mooml.render('foundRuleTemplate',{
            IMs: data.FRManager.IMs,
            foundRule: foundRule,
            i18n: data.i18n
          }));
        }.bind([data,foundRulesContainer]));
      }

    });

    Mooml.register('linksPaginator',function(data){
      var gotoFunction = data.gotoFunction,
          pagesCount = data.pagesCount,
          currentPage = parseInt(data.currentPage || 1);
      var pageSteps=4;

      if (pagesCount>1){
        var pageStart=currentPage-pageSteps;
        if (pageStart<1){
          pageEnd=currentPage+pageSteps-(pageStart-1);//připočtění položek nepoužitých vlevo
          pageStart=1;
        }else{
          var pageEnd=currentPage+pageSteps;
        }
        if ((pageEnd+2)>=pagesCount){
          pageStart=pageStart-(pageEnd-pagesCount);//připočtení položek nepoužitých vpravo
          pageEnd=pagesCount;
        }
        if (pageStart>3){
          //odkaz na první stránku (pokud není v základním přehledu)
          a({href:'#',events:{
            click: function (e) {
              e.stop();
              gotoFunction(1);
            }.bind(gotoFunction)
          }},1);
          span('...');
        }else{
          pageStart=1;
        }
        for(var i=pageStart;i<=pageEnd;i++){
          a({
            href:'#',
            events:{
              click: function (e) {
                e.stop();
                gotoFunction(e.target.get('text'));
              }.bind(gotoFunction)
            },
            class: (currentPage==i?'active':'')
          },i);
        }
        if (pageEnd<pagesCount){
          //odkaz na poslední stránku (pokud není v základním přehledu)
          span('...');
          a({href:'#',events:{
            click: function (e) {
              e.stop();
              gotoFunction(e.target.get('text'));
            }.bind(gotoFunction)
          }},pagesCount);
        }
      }
    });

    Mooml.register('selectPaginator',function(data) {
      var gotoFunction = data.gotoFunction,
        pagesCount = data.pagesCount,
        currentPage = data.currentPage;

      if (pagesCount > 1) {
        //left arrow
        if (currentPage > 1) {
          a({
            href: '#',
            events:{
              click: function(e){
                e.stop();
                gotoFunction(currentPage-1);
              }.bind([gotoFunction,currentPage])
            }
          },'&lt;');
        } else {
          a({
            href: '#',
            class: 'disabled',
            events:{
              click: function(e){
                e.stop();
              }
            }
          },'&lt;');
        }
        //select
        var options=[];
        for(var i=1;i<=pagesCount;i++){
          var option=new Element('option', {value: i, text: i+' / '+pagesCount});
          if (i==currentPage){
            option.setAttribute('selected', 'selected');
          }
          options.push(option);
        }
        select({
          events: {
            change: function (e) {
              var page = e.target.get('value');
              e.stop();
              gotoFunction(page);
            }.bind(gotoFunction)
          }
        },options);
        //right arrow
        if (currentPage < pagesCount) {
          a({
            href: '#',
            events:{
              click: function(e){
                e.stop();
                gotoFunction(currentPage+1);
              }.bind([gotoFunction,currentPage])
            }
          },'&gt;');
        } else {
          a({
            href: '#',
            class: 'disabled',
            events:{
              click: function(e){
                e.stop();
              }
            }
          },'&gt;');
        }
      }
    });

    Mooml.register('foundRulesPaginator',function(data){
        var FRManager = data.FRManager,
          i18n = data.i18n,
          pageLoading = data.FRManager.pageLoading;

        var gotoFunction = function(page){
          FRManager.gotoPage(page);
        }.bind(FRManager);

        div({class:('paginator'+(pageLoading?' loading':''))},
          (FRManager.pagesCount > 1 ? (Mooml.render(FRManager.getPaginatorType(),{
            gotoFunction: gotoFunction,
            pagesCount: FRManager.pagesCount,
            currentPage: FRManager.currentPage
          })):''),
          span({class:'loading'},i18n.translate('loading...'))
        );
      }
    );

    Mooml.register('foundRulesControlsTemplate', function (data) {
      var i18n = data.i18n,
          IMs = data.FRManager.IMs,
          FRManager = data.FRManager;

      var orderSelect=select({
        id:'found-rules-order',
        events: {
          change: function (e) {
            FRManager.rulesOrder = e.target.get('value');
            e.stop();
            FRManager.gotoPage(1);
          }.bind(FRManager)
        }
      });
      Array.each(IMs, function (IM) {
        var option = new Element('option', {value: IM.getName(), text: IM.getLocalizedName()});
        if (IM.getName() == FRManager.rulesOrder) {
          option.setAttribute('selected', 'selected');
        }
        orderSelect.grab(option);
      }.bind([FRManager, orderSelect]));

      var perPageSelect = new Element('select',
        {
          id: 'found-rules-per-page',
          events: {
            change: function (e) {
              e.stop();
              FRManager.setRulesPerPage(e.target.get('value'));
            }.bind(FRManager)
          }
        }
      );
      var perPage = FRManager.rulesPerPage;
      Array.each(FRManager.getPerPageOptions(), function (perPageCount) {
        var option = new Element('option', {value: perPageCount, text: perPageCount});
        if (perPage == perPageCount) {
          option.setAttribute('selected', 'selected');
        }
        perPageSelect.grab(option)
      }.bind([perPageSelect, perPage]));

      div({'class':'found-rules-controls'},
        Mooml.render('foundRulesPaginator',{FRManager:FRManager,i18n:i18n}),
        label({'for':'found-rules-order'},i18n.translate('Rules order:')),
        orderSelect,
        label({'for':'found-rules-per-page'},i18n.translate('Rules per page:')),
        perPageSelect
      );
    });

    Mooml.register('foundRulesMultiControlsTemplate', function (data) {
      var i18n = data.i18n,
        IMs = data.FRManager.IMs,
        FRManager = data.FRManager;
      div({id:'found-rules-multi-controls'},
        a({
          class: 'all',
          title: i18n.translate('Select all')
        }),
        a({
          class: 'invert',
          title: i18n.translate('Invert selection')
        }),
        a({
          class:'none',
          title: i18n.translate('Select none')
        }),
        span({class:'actions'},
          a({
            href:'#',
            class:'mark',
            title:i18n.translate('Add to Rule Clipboard')
          },i18n.translate('Add selected...')),
          a({
            href:'#',
            class:'unmark',
            title:i18n.translate('Remove from Rule Clipboard')
          },i18n.translate('Remove...')),
          a({
            href:'#',
            class:'kbAddPositive',
            title:i18n.translate('Add to Knowledge Base as interesting')
          },i18n.translate('Interesting')),
          a({
            href:'#',
            class:'kbAddNegative',
            title:i18n.translate('Add to Knowledge Base as not interesting')
          },i18n.translate('Not interesting'))
        ),
        span({class:'task-actions'},
          a({
            href:'#',
            class:'mark-all'+(FRManager.importInProgress?' disabled':''),
            title:(FRManager.importInProgress?i18n.translate('Import of results is still in progress'):i18n.translate('Add all rules to Rule Clipboard'))
          },i18n.translate('Add all rules')),
          a({
            href:'#',
            class:'task-details'+(FRManager.importInProgress?' disabled':''),
            title:(FRManager.importInProgress?i18n.translate('Import of results is still in progress'):i18n.translate('Show task details'))
          },i18n.translate('Task details')),
          a({
            href:'#',
            class:'task-export',
            title:i18n.translate('Show task export options')
          },i18n.translate('Task export'))
        )
      );
    });
  },

  registerRuleIMs: function () {
    Mooml.register('ruleIMs', function (data) {
      var imValuesPrecision = 1000;

      Array.each(data.IMs, function (IM) {
        var str = IM.getLocalizedName() + ': <span class="value">' + (Math.round(IM.calculate(data.ruleValues.a, data.ruleValues.b, data.ruleValues.c, data.ruleValues.d) * imValuesPrecision) / imValuesPrecision)+'</span>';
        span({}, str);
      }.bind([data, this]));
    })
  },

  registerMarkedRules: function () {
    // to be able to re-render IMs in selectbox TODO merge be aware of id vs. class
    Mooml.register('markedRulesOrderTemplate', function (data) {
      var IMs = data.FRManager.IMs,
          FRManager = data.FRManager,
          taskId = FRManager.id;

      var orderSelect=select({
        id:'marked-rules-order-'+taskId,
        events: {
          change: function (e) {
            FRManager.rulesOrder = e.target.get('value');
            e.stop();
            FRManager.gotoPage(1);
          }.bind(FRManager)
        }
      });
      // set DEFAULT option
      var option = new Element('option', {value: 'DEFAULT', text: data.i18n.translate('Found order')});
      if (FRManager.rulesOrder == 'DEFAULT') {
        option.setAttribute('selected', 'selected');
      }
      orderSelect.grab(option);
      Array.each(IMs, function (IM) {
        var option = new Element('option', {value: IM.getName(), text: IM.getLocalizedName()});
        if (IM.getName() == FRManager.rulesOrder) {
          option.setAttribute('selected', 'selected');
        }
        orderSelect.grab(option);
      }.bind([FRManager, orderSelect]));
    });
    // same as foundRulesControlsTemplate - differences only in ids and adding markedRulesOrderTemplate TODO merge be aware of id vs. class
    Mooml.register('markedRulesControlsTemplate', function (data) {
      var i18n = data.i18n,
          IMs = data.FRManager.IMs,
          FRManager = data.FRManager,
          taskId = FRManager.id;

      var perPageSelect = new Element('select',
          {
            id: 'marked-rules-per-page-'+taskId,
            events: {
              change: function (e) {
                e.stop();
                FRManager.setRulesPerPage(e.target.get('value'));
              }.bind(FRManager)
            }
          }
      );
      var perPage = FRManager.rulesPerPage;
      Array.each(FRManager.getPerPageOptions(), function (perPageCount) {
        var option = new Element('option', {value: perPageCount, text: perPageCount});
        if (perPage == perPageCount) {
          option.setAttribute('selected', 'selected');
        }
        perPageSelect.grab(option)
      }.bind([perPageSelect, perPage]));

      div({'class':'marked-rules-controls'},
          Mooml.render('foundRulesPaginator',{FRManager:FRManager,i18n:i18n}),
          label({'for':'marked-rules-order-'+taskId},i18n.translate('Rules order:')),
          Mooml.render('markedRulesOrderTemplate',data),
          label({'for':'marked-rules-per-page-'+taskId},i18n.translate('Rules per page:')),
          perPageSelect
      );
    });

    // same as foundRulesMultiControlsTemplate - differences only in task-actions TODO merge be aware of id vs. class
    Mooml.register('markedRulesMultiControlsTemplate', function (data) {
      var i18n = data.i18n,
          task = data.FRManager,
          actions,
          taskActions;
      if(task.isBase){
        status = 'minimize';
        actions = span({class:'actions'},
          a({
            href:'#',
            class:'kb-unmark',
            title:i18n.translate('Remove from Knowledge base')
          },i18n.translate('Remove...'))
        );
        taskActions = span({class:'task-actions'},
          a({
            href:task.id,
            class:'task-export',
            rel:'ruleset',
            title:i18n.translate('Show ruleset export options')
          },i18n.translate('Ruleset export'))
        );
      } else{
        actions = span({class:'actions'},
          /*a({
           href:'#',
           class:'mark',
           title:i18n.translate('Add to Rule Clipboard')
           },i18n.translate('Add selected...')),*/
          a({
            href:'#',
            class:'unmark',
            title:i18n.translate('Remove from Rule Clipboard')
          },i18n.translate('Remove...')),
          a({
            href:'#',
            class:'kb-add',
            rel:'positive',
            title:i18n.translate('Interesting')
          },i18n.translate('Interesting')),
          a({
            href:'#',
            class:'kb-add',
            rel:'negative',
            title:i18n.translate('Not interesting')
          },i18n.translate('Not interesting'))
        );
        taskActions = span({class:'task-actions'},
          /*a({
           href:'#',
           class:'mark-all',
           title:i18n.translate('Add all rules to Rule Clipboard')
           },i18n.translate('Add all rules')),*/
          a({
            href:'#',
            class:'task-details'+(task.isImportInProgress()?' disabled':''),
            title:(task.isImportInProgress()?i18n.translate('Import of results is still in progress'):i18n.translate('Show task details'))
          },i18n.translate('Task details')),
          a({
            href:'#',
            class:'task-export',
            rel:'task',
            title:i18n.translate('Show task export options')
          },i18n.translate('Task export'))
        );
      }
      div({class:'marked-rules-multi-controls'},
          div({class: 'marked-rules-checkbox-controls'},
              a({
                class: 'all',
                title: i18n.translate('Select all')
              }),
              a({
                class: 'invert',
                title: i18n.translate('Invert selection')
              }),
              a({
                class:'none',
                title: i18n.translate('Select none')
              }),
              actions
          ),
          taskActions
          /*span({class:'task-actions'},
              /*a({
                href:'#',
                class:'mark-all',
                title:i18n.translate('Add all rules to Rule Clipboard')
              },i18n.translate('Add all rules')),/
              a({
                href:'#',
                class:'task-details',
                title:i18n.translate('Show task details')
              },i18n.translate('Task details'))
          )*/
      );
    });
    // Marked task
    Mooml.register('taskTemplate', function (data) {
      var task = data.FRManager,
          status = data.status,
          name;
      if(task.isBase){
        status = 'minimize';
        name = div(
            {class: 'marked-rules-task-name'},
            task.name,
            span({class: 'count'}, '(rules:  ', strong(task.rulesCount), ')'),
            a({href: '#', class: 'rename-task', title: data.i18n.translate('Rename task')})
        );
      } else{
        name = div(
            {class: 'marked-rules-task-name'},
            a({href: '#', class: 'toggle'},
              span({class: 'toggle'}, '')
            ),
            a({href: '#', class: 'toggle'},task.name),
            span({class: 'count'}, '(rules:  ', strong(task.rulesCount), ')'),
            a({href: '#', class: 'rename-task', title: data.i18n.translate('Rename task')}),
            a({href: '#', class: 'remove-task', title: data.i18n.translate('Remove task from Rule clipboard')})
        );
      }
      div(
          {id: 'task-'+task.id, class: status},
          name,
          Mooml.render('markedRulesControlsTemplate',data),
          ul(),
          Mooml.render('markedRulesMultiControlsTemplate',data)
      );
      /*ul({id: task.getCssId(), class: 'task'},
        li({},
          div({class: 'marked-task'},
            span(
              task.getName()
            ), a({
              id: task.getChangeNameCssId(),
              href: '#',
              class: 'rename',
              title: i18n.translate('Rename')
            })
          ),
          a({styles: {display: 'none'}, id: 'openWindow-' + task.getId(), href: '#', target: '_blank'}, '&nbsp;'),
          a({
            class: 'exportBusinessRules',
            id: 'exportBusinessRules-' + task.getId(),
            href: '#',
            title: i18n.translate('Export Business Rules to BR base')
          }, i18n.translate('Export BR')),
          a({
            class: 'modelTester',
            id: 'modelTester-' + task.getId(),
            href: '#',
            title: i18n.translate("Check classification model")
          }, i18n.translate('Check model')),
          a({class: 'createReport', id: 'createReport-' + task.getId(), href: '#'}, i18n.translate('Show task details'))
        )
      );*/
    });

    // Marked rule
    Mooml.register('markedRuleTemplate', function (data) {
      var markedRule = data.rule,
          i18n = data.i18n,
          IMs = data.IMs,
          positiveElm,
          negativeElm,
          title;

      if(markedRule.getRuleSetRelation()=="positive"){
        positiveElm = a({id: markedRule.getUpCSSID(), href:'#', class:'kbRemovePositive', title:i18n.translate('Remove from Knowledge Base')});
        negativeElm = a({id: markedRule.getDownCSSID(), href:'#', class:'kbAddNegative', title:i18n.translate('Add to Knowledge Base as not interesting')});
      } else if(markedRule.getRuleSetRelation()=="negative") {
        positiveElm = a({id: markedRule.getUpCSSID(), href:'#', class:'kbAddPositive', title:i18n.translate('Add to Knowledge Base as interesting')});
        negativeElm = a({id: markedRule.getDownCSSID(), href:'#', class:'kbRemoveNegative', title:i18n.translate('Remove from Knowledge Base')});
      } else{
        if(markedRule.getInterestRelation()=="positive"){
          if(markedRule.getInterestRate()=="y"){
            positiveElm = a({id: markedRule.getUpCSSID(), href:'#', class:'kbAddPositive kbPositiveNotice', title:i18n.translate('Add to Knowledge Base as interesting')});
            title = i18n.translate('Seems to be similar to interesting Rule in Knowledge Base - is checking deeply');
          } else{
            positiveElm = a({id: markedRule.getUpCSSID(), href:'#', class:'kbAddPositive kbPositive'+markedRule.getInterestRate(), title:i18n.translate('Add to Knowledge Base as interesting')});
            title = i18n.translate('Up to '+markedRule.getInterestRate()+'% similarity with interesting Rule in Knowledge Base');
          }
          negativeElm = a({id: markedRule.getDownCSSID(), href:'#', class:'kbAddNegative', title:i18n.translate('Add to Knowledge Base as not interesting')});
        } else if(markedRule.getInterestRelation()=="negative"){
          if(markedRule.getInterestRate()=="y"){
            negativeElm = a({id: markedRule.getDownCSSID(), href:'#', class:'kbAddNegative kbNegativeNotice', title:i18n.translate('Add to Knowledge Base as not interesting')});
            title = i18n.translate('Seems to be similar to not interesting Rule in Knowledge Base - is checking deeply');
          } else{
            negativeElm = a({id: markedRule.getDownCSSID(), href:'#', class:'kbAddNegative kbNegative'+markedRule.getInterestRate(), title:i18n.translate('Add to Knowledge Base as not interesting')});
            title = i18n.translate('Up to '+markedRule.getInterestRate()+'% similarity with not interesting Rule in Knowledge Base');
          }
          positiveElm = a({id: markedRule.getUpCSSID(), href:'#', class:'kbAddPositive', title:i18n.translate('Add to Knowledge Base as interesting')});
        } else{
            positiveElm = a({id: markedRule.getUpCSSID(), href:'#', class:'kbAddPositive', title:i18n.translate('Add to Knowledge Base as interesting')});
            negativeElm = a({id: markedRule.getDownCSSID(), href:'#', class:'kbAddNegative', title:i18n.translate('Add to Knowledge Base as not interesting')});
        }
      }

      /*li({id: ruleId, class: 'marked-rule'},
        span({'class': 'rule'}, rule.getIdent()),
        a({id: rule.getMarkedRuleCSSRemoveID(), href: '#', 'class': 'clear', 'title': i18n.translate('Remove')}),
        span({'class': 'ims'}, rule.getIMIdent()));*/
      
      li({id: markedRule.getCSSID(), 'class': 'marked-rule'+(markedRule.isLoading()?' loading':''), title: title},
          input({type:'checkbox',id:markedRule.getCSSID()+'-checkbox', class:'marked-rule-checkbox'}),
          label({for: markedRule.getCSSID()+'-checkbox', 'class': 'rule'}, markedRule.getIdent()),
          span({class:'ruleActions'},
              a({id: markedRule.getUnmarkCSSID(), href: '#', 'class': 'clear', 'title': i18n.translate('Remove from Rule Clipboard')}),
              a({id: markedRule.getDetailsCSSID(),href: '#','class': 'details','title': i18n.translate('Show rule details')}),
              positiveElm,
              negativeElm
          ),
          span({'class': 'ims'}, Mooml.render('ruleIMs', {ruleValues: markedRule.getRuleValues(), IMs: IMs}))
      );
    });

    // KB rule
    Mooml.register('KBRuleTemplate', function (data) {
      var markedRule = data.rule,
          i18n = data.i18n,
          IMs = data.IMs;

      li({id: markedRule.getCSSID(), 'class': 'marked-rule'+(markedRule.isLoading()?' loading':'')},
          input({type:'checkbox',id:markedRule.getCSSID()+'-checkbox', class:'marked-rule-checkbox'}),
          label({for: markedRule.getCSSID()+'-checkbox', 'class': 'rule'}, markedRule.getIdent()),
          span({class:'ruleActions'},
              a({id: markedRule.getKBRemoveCSSID(), href: '#', 'class': 'clear', 'title': i18n.translate('Remove from Knowledge base')}),
              a({id: markedRule.getDetailsCSSID(),href: '#','class': 'details','title': i18n.translate('Show rule details')})
          ),
          span({'class': 'ims'}, Mooml.render('ruleIMs', {ruleValues: markedRule.getRuleValues(), IMs: IMs}))
      );
    });

    Mooml.register('exportBusinessRulesDialogTemplate', function (data) {
      var url = data.url;

      div({id: 'export-business-rules-window'},
        iframe({src: url})
      );
    });

    Mooml.register('showRuleDetailsDialogTemplate', function (data) {
      var i18n = data.i18n,
        url = data.url;

      div({id: 'show-rule-details-window'},
        a({
            id: 'overlay-close',
            href: '#',
            'title': i18n.translate('Close')
          }
        ),
        iframe({src: url})
      );
    });

    Mooml.register('modelTesterDialogTemplate', function (data) {
      var url = data.url;

      div({id: 'model-tester-window'},
        iframe({src: url})
      );
    });

    // Rename ruleset overlay
    Mooml.register('renameRulesetWindowTemplate', function (data) {
      var i18n = data.i18n,
          taskId = data.taskId,
          taskName = data.taskName,
          taskDesc = data.taskDesc;

      div({
            id: 'rename-task-window'
          },
          a({
                id: 'overlay-close',
                href: '#',
                'title': i18n.translate('Close')
              }
          ),
          h2(
              i18n.translate('Rename the Ruleset')
          ),
          form({
                action: '#',
                method: 'POST',
                id: 'rename-task-form'
              },
              label({
                    'for': 'rename-task-input'
                  },
                  i18n.translate('New name:')),
              input({
                name: 'rename-task-input',
                id: 'rename-task-input',
                type: 'text',
                value: taskName,
                maxlength: '100'
              }),
              div({class: 'clearfix'}),
              label({
                    'for': 'rename-task-input-desc'
                  },
                  i18n.translate('New description:')),
              textarea({
                name: 'rename-task-input-desc',
                id: 'rename-task-input-desc',
                type: 'text',
                value: taskDesc
              }),
              input({
                type: 'hidden',
                id: 'rename-task-id',
                value: taskId
              }),
              br(),
              div(
                  span({
                    id: 'rename-task-error'
                  })
              ),
              div({
                class: 'autocomplete clearfix'
              }),
              input({
                type: 'submit',
                value: i18n.translate('Rename')
              })
          )
      );
    });

    // Rename task overlay
    Mooml.register('renameTaskWindowTemplate', function (data) {
      var i18n = data.i18n,
        taskId = data.taskId,
        taskName = data.taskName;

      div({
          id: 'rename-task-window'
        },
        a({
            id: 'overlay-close',
            href: '#',
            'title': i18n.translate('Close')
          }
        ),
        h2(
          i18n.translate('Rename the Task')
        ),
        form({
            action: '#',
            method: 'POST',
            id: 'rename-task-form'
          },
          label({
              'for': 'rename-task-input'
            },
            i18n.translate('New name:')),
          input({
            name: 'rename-task-input',
            id: 'rename-task-input',
            type: 'text',
            value: taskName,
            maxlength: '100'
          }),
          input({
            type: 'hidden',
            id: 'rename-task-id',
            value: taskId
          }),
          br(),
          div(
            span({
              id: 'rename-task-error'
            })
          ),
          div({
            'class': 'autocomplete clearfix'
          }),
          input({
            type: 'submit',
            value: i18n.translate('Rename')
          })
        )
      );
    });
  },

  registerAttributeWindow: function () {
    Mooml.register('addAttributeTemplate', function (data) {
      var i18n = data.i18n,
        url = data.url;

      div({id: 'add-attribute-window'},
        a({
            id: 'overlay-close',
            href: '#',
            'title': i18n.translate('Close')
          }
        ),
        iframe({src: url}));
    });

    Mooml.register('addAttributesTemplate', function (data) {
      var i18n = data.i18n,
          url = data.url;

      div({id: 'add-attributes-window'},
          a({
                id: 'overlay-close',
                href: '#',
                'title': i18n.translate('Close')
              }
          ),
          iframe({src: url}));
    });

    Mooml.register('editAttributeTemplate', function (data) {
      var i18n = data.i18n,
        url = data.url;

      div({id: 'edit-attribute-window'},
        a({
            id: 'overlay-close',
            href: '#',
            'title': i18n.translate('Close')
          }
        ),
        iframe({src: url}));
    });

    Mooml.register('showHistogramTemplate', function (data) {
      var i18n = data.i18n,
        url = data.url;

      div({id: 'show-histogram-window'},
        a({
            id: 'overlay-close',
            href: '#',
            'title': i18n.translate('Close')
          }
        ),
        iframe({src: url}));
    });

    Mooml.register('reportWindowTemplate', function (data) {
      var i18n = data.i18n,
        url = data.url;

      div({id: 'report-window'},
        a({
            id: 'overlay-close',
            href: '#',
            'title': i18n.translate('Close')
          }
        ),
        iframe({src: url}));
    });

  },

  registerCurrentUser: function () {
    Mooml.register('userWarningWindowTemplate', function (data) {
      div({id: 'user-warning-window'},
        p(data.message),
        div(
          a({href:data.url},'OK')
        )
      );
    });

    Mooml.register('loadingErrorWindowTemplate', function (data) {
      div({id: 'loading-data-window', class:'error'},
        p(data.i18n.translate('An error occured while loading application data.')),
        div(
          a({href:data.url},'OK')
        )
      );
    });
  }

});
