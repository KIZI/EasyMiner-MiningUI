var UIPainter = new Class({
	
    ARBuilder: null,
	config: null,
    $settings: null,
	UIColorizer: null,
	UIListener: null,
    dateHelper: null,
    UITemplateRegistrator: null,
    $UIScroller: null,
    $UIStructurePainter: null,

	pager: null,
	
	rootElement: null,
	i18n: null,

	callbackStack: [],

	// sort attributes
	sortDuration: 750,
	morphDuration: 500,
	
	// dispose element
	disposeDuration: 750,

    // Overlay height, used when manipulating with its position
    overlayHeight: null,

    // Settings window top margin, used when manipulating with overlay position
    settingsWindowTopMargin: null,
	
	initialize: function (ARBuilder, config, settings, i18n, UIColorizer, UIListener, dateHelper, UITemplateRegistrator, UIScroller, UIStructurePainter) {
		this.ARBuilder = ARBuilder;
        this.config = config;
        this.$settings = settings;
		this.rootElement = $(this.config.getRootElementID());
		this.i18n = i18n;
		this.UIColorizer = UIColorizer;
		this.UIListener = UIListener;
		this.dateHelper = dateHelper;
		this.UITemplateRegistrator = UITemplateRegistrator;
        this.$UIScroller = UIScroller;
        this.$UIStructurePainter = UIStructurePainter;
	},

	createUI: function () {
		this.renderNavigation();
		this.renderActiveRule();
	},

	renderNavigation: function () {
		// attributes
		this.renderAttributes();

        // data fields
        this.renderDataFields();
	},
	
	renderAttributes: function(navigation) {
		if (this.ARBuilder.getARManager().getAttributesByGroup() === true) {
			this.renderAttributesByGroup(navigation.getElement('ul'));
		} else {
			this.renderAttributesByList();
		}

        if (this.ARBuilder.getDD().hasHiddenAttributes()) {
            this.$UIStructurePainter.showHiddenAttributesButton();
        } else {
            this.$UIStructurePainter.hideHiddenAttributesButton();
        }
        var attributesFilter = $$('#attributes a.filter')[0];
      var myFilter = new ElementFilter('attributes-filter', '#attributes-by-list li', {
        trigger: 'keyup',
        cache: true,
        onShow: function(element) {
            element.setStyle('display','list-item');
        },
        onHide: function(element) {
            element.setStyle('display','none');
        },
          onComplete: function(element) {
              attributesFilter.addClass('filter-active');
          },
          onNull: function(element) {
              attributesFilter.removeClass('filter-active');
          }
      });
	},
	
	renderAttributesByGroup: function (elementParent) {
		elementParent = elementParent || $$('nav#navigation ul')[0];
		elementParent.setAttribute('id', 'attributes-by-group');
		if (elementParent.hasChildNodes()) {
			elementParent.empty();
		}

		elementParent.grab(this.initFieldGroup(this.ARBuilder.getFGC().getFieldGroupRootConfigID()));
		while (callback = this.callbackStack.pop()) {
			callback.func.apply(this.UIListener , callback.args);
		}
	},
	
	renderAttributesByList: function() {
		var elementParent = $$('nav#navigation ul')[0];
		elementParent.setAttribute('id', 'attributes-by-list');
		if (elementParent.hasChildNodes()) {
			elementParent.empty();
		}

		Object.each(this.ARBuilder.getDD().getAttributes(), function (attribute) {
			this.renderAttributeByList(attribute, elementParent);
		}.bind(this));
	},
	
	renderAttributeByList: function (attribute, elementParent) {
		if (elementParent) { // insert
            var elementAttribute = Mooml.render('attributeByListTemplate', {i18n: this.i18n, isUsed: this.ARBuilder.getARManager().getActiveRule().isAttributeUsed(attribute), attribute: attribute, showEditAttribute: this.$settings.isAttributeEditAllowed(), showRemoveAttribute: this.$settings.isAttributeDeleteAllowed()});
			elementParent.grab(elementAttribute);
			this.UIListener.registerAttributeEventHandler(attribute, this.$settings.isAttributeEditAllowed(), this.$settings.isAttributeDeleteAllowed());
		} else { // re-render
			var element = $(attribute.getCSSID());
			element.set('morph', {duration: this.morphDuration});
            element.removeAttribute('class');
            if (attribute.isRecommended()) {
                element.addClass('rec1');
			} else if (attribute.isPartiallyRecommended()) {
                element.addClass('rec2');
			} else if (this.ARBuilder.getARManager().getActiveRule().isAttributeUsed(attribute)) {
				element.morph({
					'color': '#AAA'});
			} else {
				element.morph({
					'color': '#434343'});
			}
		}
	},

    renderAddAttributeWindow: function(field) {
        var overlay = this.$UIStructurePainter.showOverlay();
        var url = this.config.getAddAttributeURL(field.getName());
        var window = Mooml.render('addAttributeTemplate', {i18n: this.i18n, url: url});
        overlay.grab(window);

        this.$UIScroller.scrollTo(0, 0);
    },

    renderEditAttributeWindow: function (attribute) {
        var overlay = this.$UIStructurePainter.showOverlay();
        var url = this.config.getEditAttributeURL(attribute.getName());
        var window = Mooml.render('editAttributeTemplate', {i18n: this.i18n, url: url});
        overlay.grab(window);

        this.$UIScroller.scrollTo(0, 0);
    },

    renderUserLogoutWindow: function() {
        var overlay = this.$UIStructurePainter.showOverlay();
        var window = Mooml.render('userLogoutWindowTemplate', { i18n: this.i18n, url: this.config.getUserLogoutUrl() });
        overlay.grab(window);

        this.$UIScroller.scrollTo(0, 0);
    },

    renderShowHistogramWindow: function(name, type) {
        var overlay = this.$UIStructurePainter.showOverlay();
        var window = Mooml.render('showHistogramTemplate', {i18n: this.i18n, url: this.config.getShowHistogramURL(name, type)});
        overlay.grab(window);

        this.$UIScroller.scrollTo(0, 0);
    },

    renderReportWindow: function(id, name) {
        var overlay = this.$UIStructurePainter.showOverlay();
        var window = Mooml.render('reportWindowTemplate', {i18n: this.i18n, url: this.config.getShowReportUrl(id) } );
        overlay.grab(window);

        this.$UIScroller.scrollTo(0, 0);
    },

    removeAttribute: function(attribute) {
        $(attribute.getCSSID()).getParent().destroy();
    },

    renderDataFields: function() {
        var dataFields = $$('#data-fields ul')[0];
        dataFields.empty();
        this.ARBuilder.getDD().getFields().each(function(field) {
            this.renderDataField(field, dataFields);
            this.UIListener.registerDataFieldEventHandler(field);
        }.bind(this));
        var dataFieldsFilter = $$('#data-fields a.filter')[0];
      var myFilter = new ElementFilter('data-fields-filter', '#data-fields li', {
        trigger: 'keyup',
        cache: true,
        onShow: function(element) {
        element.setStyle('display','list-item');
        },
        onHide: function(element) {
        element.setStyle('display','none');
        },
          onComplete: function(element) {
              dataFieldsFilter.addClass('filter-active');
          },
          onNull: function(element) {
              dataFieldsFilter.removeClass('filter-active');
          }
      });
    },

    renderDataField: function(field, elementParent) {
        elementParent.grab(Mooml.render('dataFieldTemplate', {i18n: this.i18n, field: field}));
    },
	
	sortAttributes: function (positions) {
		var sorter = new Fx.Sort($$('#attributes > div > ul > li'), {
			transition: Fx.Transitions.Cubic.easeInOut,
			duration: this.sortDuration
		});
		
		sorter.sort(positions).chain(function () {
			sorter.rearrangeDOM();
			
			Array.each(this.ARBuilder.getDD().getAttributes(), function (attribute) {
				this.renderAttributeByList(attribute);
			}.bind(this));
			
			this.renderAttributes.delay((this.sortDuration + this.morphDuration) * 1.5, this);
		}.bind(this));
	},

    renderReports: function(reports) {
        var elReports = $$('#reports ul')[0];
        elReports.empty();
        reports.each(function(report) {
            this.renderReport(report, elReports);
        }.bind(this));
    },

    renderBRBaseRulesCount: function(count) {
        if (count>0){
            $('brBaseCounter').set('html',this.i18n.translate('Saved rules count: ')+count);
        }else{
            $('brBaseCounter').set('html',this.i18n.translate('No rules saved yet.'));
        }
        this.UIListener.registerBRBaseEventHandler();//TODO přesunout na lepší místo
    },

    renderReport: function(report, elParent) {
        elParent.grab(Mooml.render('reportTemplate', { i18n: this.i18n, report: report, url: this.config.getShowReportUrl(report.id) }));
//        this.UIListener.registerReportEventHandler(report);
    },

    // TODO: odprasit
    renderUserAccountBox: function(user) {
        var elUserAccount = new Element('div', {
            styles: {
                display: 'inline',
                float: 'left',
                'margin-left': '20px'
            }
        });

        var me = this;
        if (user.id) {
            // TODO: Odprasit
            $('reports').show();

            var elUser = new Element('span', {
                id: 'user',
                html: user.name + ' - ',
                styles: {
                    background: 'url("http://icons.iconarchive.com/icons/dryicons/simplistica/24/user-icon.png") no-repeat scroll 0 0 transparent',
                    color: '#CEE7F7',
                    float: 'left',
                    'font-size': '14px',
                    'font-weight': 'bold',
                    'line-height': '24px',
                    'padding-left': '30px'
                }
            });
            elUser.inject(elUserAccount);

            var logout = new Element('a', {
                href: this.config.getUserLogoutUrl(),
                html: 'logout',
                styles: {
                    'padding-top': '2px',
                    'padding-left': '5px'
                }
            });
            logout.inject(elUserAccount);
        } else {
            $('reports').hide();

            var elUser = new Element('span', {
                id: 'user',
                html: 'Anonymous - ',
                styles: {
                    background: 'url("http://icons.iconarchive.com/icons/dryicons/simplistica/24/user-icon.png") no-repeat scroll 0 0 transparent',
                    color: '#CEE7F7',
                    float: 'left',
                    'font-size': '14px',
                    'font-weight': 'bold',
                    'line-height': '24px',
                    'padding-left': '30px'
                }
            });
            elUser.inject(elUserAccount);

            var login = new Element('a', {
                href: this.config.getUserLoginUrl(),
                html: 'login',
                styles: {
                    'padding-top': '2px',
                    'padding-left': '5px'
                }/*,
                events: {
                    click: function(event) {
                        event.stop();
                        me.renderUserLoginWindow();
                    }
                }*/
            });
            login.inject(elUserAccount);
        }

        elUserAccount.inject($('settings'));
    },

	renderMarkedRules: function (elementParent, markedRules) {
		var me = this;

        if (!elementParent) { // re-render
			elementParent = $$('#marked-rules ul')[0];
			elementParent.empty();
		}

        var taskId,
            sortedRules = {};
		Object.each(markedRules, function (FR) {
            taskId = FR.getRule().getTask().getId();
            if (!sortedRules.hasOwnProperty(taskId)) {
                sortedRules[taskId] = [];
            }
            sortedRules[taskId].push(FR);
		}.bind(this));

		var i = 0,
            taskParent,
            lastTaskId,
            taskIds = [];
		Object.each(sortedRules, function (foundRules, taskId) {
            taskIds.include(taskId);

            if (taskId !== lastTaskId) {
                taskParent = Mooml.render('taskTemplate', { i18n: this.i18n, task: foundRules[0].getRule().getTask() });
                elementParent.grab(taskParent);
                lastTaskId = taskId;
            }
            Array.each(foundRules, function(FR) {
//                FR.getRule().setId(++i);
                var elementRule = Mooml.render('markedRuleTemplate', {i18n: this.i18n, rule: FR.getRule()});
                taskParent.grab(elementRule);
                this.UIListener.registerMarkedRuleEventHandlers(FR);
            }.bind(this));
		}.bind(this));

        taskIds.each(function(taskId) {
            me.UIListener.registerMarkedRulesTaskEventHandlers(taskId);
        });
    },
	
	initFieldGroup: function (id) { // recursive
		var FG = this.ARBuilder.getFGC().getFieldGroup(id);

		var returnEl = new Element('li', {id: 'fg-' + id + '-name', 'class': 'field-group-drag', html: '<span>' + FG.getLocalizedName() + '</span>', title: FG.getExplanation()});
		var FGEl = new Element('ul', {id: 'fg-' + id, 'class': 'field-group'}).inject(returnEl);
	    this.callbackStack.push({func: this.UIListener.registerFieldGroupEventHandler, args: [FG]});

		if (Object.getLength(FG.getFields()) > 0) {
			Object.each(FG.getFields(), function (field, key) {
				new Element('li', {id: field.getCSSID(), html: field.toString()}).inject(FGEl);
				this.callbackStack.push({func: this.UIListener.registerFieldEventHandler, args: [field]});
			}.bind(this));
		}
		
		Array.each(FG.getChildGroups(), function (value, key) {
			this.initFieldGroup(value).inject(FGEl); // call recursion
		}.bind(this));
		
		return returnEl;
	},
	
	renderActiveRule: function () {
        Mooml.render('activeRuleTemplate', {rules: this.ARBuilder.getARManager().display4ftTaskBox(), attributes: this.ARBuilder.getARManager().displayETreeTaskBox(), i18n: this.i18n, displayAddIM: this.ARBuilder.getARManager().hasPossibleIMs()}).replaces($('active-rule'));

        var elementParent = $('antecedent');
		this.renderCedent(this.ARBuilder.getARManager().getActiveRule().getAntecedent(), elementParent);
		
		Object.each(this.ARBuilder.getARManager().getActiveRule().getIMs(), function(IM, key) {
			this.renderIM(IM);
		}.bind(this));
		
		var elementParent = $('succedent');
		this.renderCedent(this.ARBuilder.getARManager().getActiveRule().getSuccedent(), elementParent);
		
		this.UIListener.registerActiveRuleEventHandlers(this.ARBuilder.getARManager().getActiveRule());
		
		this.$UIStructurePainter.resizeApplication();
	},
	
	renderCedent: function (cedent, elementParent) {
		var elementCedent = Mooml.render('cedentTemplate', {rule: this.ARBuilder.getARManager().getActiveRule(), cedent: cedent, i18n: this.i18n});
		if (elementParent !== null) { // new cedent
			elementParent.grab(elementCedent);
		} else { // re-render
			// re-render
			elementCedent.replaces($(cedent.getCSSID()));
		}

        var noRestriction = this.ARBuilder.getDefFL().hasCedentNoRestriction(cedent);
        if (noRestriction) {
            tips = new Tips('.no-restriction');
            tips.addEvent('show', function(tip, el){
                tip.addClass('tip-visible');
            });
            tips.addEvent('hide', function(tip, el){
                tip.removeClass('tip-visible');
            });

            var elementNoRestriction = Mooml.render('noRestrictionTemplate', {i18n: this.i18n});
            elementParent.grab(elementNoRestriction);
            tips.attach(elementNoRestriction);
        }

		var elementFields = elementCedent.getElement('div.fields');

        var index = 1;

        if (cedent.hasOpeningBracket(index)) {
            var elementLeftBracket = Mooml.render('bracketTemplate', {isLeft: true});
            elementFields.grab(elementLeftBracket);
        }

        var settings = this.ARBuilder.getARManager().getActiveRule().toSettings()[cedent.getScope()];
        var markFieldsAllowed = (cedent.getNumFields(cedent.getLevel()) > 2) &&
            (this.ARBuilder.getDefFL().isConnectiveAllowed('Conjunction', cedent.getScope(), settings, cedent.getNextLevel()) || this.ARBuilder.getDefFL().isConnectiveAllowed('Disjunction', cedent.getScope(), settings, cedent.getNextLevel()));

        cedent.getChildren().each(function(child) {
            if (instanceOf(child, Cedent)) { // Cedent
                this.renderCedent(child, elementFields);
            } else { // FieldAR
                this.renderField(child, elementFields, cedent, markFieldsAllowed);
            }

            if (index < cedent.getNumChildren()) { // Connective
                this.renderConnective(cedent.getConnective(), elementFields);
            }

            index++;
        }.bind(this));

        if (cedent.hasClosingBracket(index - 1)) {
            var rightBracket = Mooml.render('bracketTemplate', {isLeft: false});
            elementFields.grab(rightBracket);
        }

		this.UIListener.registerCedentEventHandlers(cedent, this.ARBuilder.getARManager().getActiveRule());
	},
	
	renderField: function (field, elementParent, cedent, markFielsdAllowed) {
        if (elementParent !== null) { // new field
			var elementField = Mooml.render('fieldTemplate', {field: field, i18n: this.i18n, markFieldAllowed: markFielsdAllowed});
			elementParent.grab(elementField);
		} else { // re-render
			var elementField = Mooml.render('fieldTemplate', {field: field, i18n: this.i18n, markFieldAllowed: markFielsdAllowed});
			elementField.replaces($(field.getCSSID()));
		}
		
		if (field.getType() !== null) {
			this.UIListener.registerEditCoefficientEventHandler(field);
			this.UIListener.registerFieldAREventHandlers(field, cedent);
		}
	},

    renderConnective: function (connective, elementParent) {
        var elementConnective = Mooml.render('connectiveTemplate', {connective: connective, i18n: this.i18n});
        elementParent.grab(elementConnective);
    },

	renderIM: function (IM) {
		var elementParent = $$('div#interest-measures > div')[0];
		elementParent.grab(Mooml.render('interestMeasureTemplate', {IM: IM, i18n: this.i18n}));
	    this.UIListener.registerIMEventHandler(IM);
	}, 
	
	renderAddIMWindow: function (IMs) {
		var overlay = this.$UIStructurePainter.showOverlay();
		overlay.grab(Mooml.render('addIMWindowTemplate', {i18n: this.i18n}));
		var selectedIM = IMs[Object.keys(IMs)[0]];
		Object.each(IMs, function (IM) {
			var isSelected = (IM.getName() === selectedIM.getName());
			$('add-im-select').grab(Mooml.render('IMWindowSelectOptionTemplate', {IM: IM, isSelected: isSelected}));
		}.bind(this));

        this.renderExplanation(selectedIM);
		this.renderIMAutocomplete('add', selectedIM);

		this.UIListener.registerIMFormEventHandler('add');
	},
	
	renderEditIMWindow: function(IMs, selectedIM) {
		var overlay = this.$UIStructurePainter.showOverlay();
		overlay.grab(Mooml.render('editIMWindowTemplate', {i18n: this.i18n, IM: selectedIM}));
		Object.each(IMs, function (IM) {
			var isSelected = (IM.getName() === selectedIM.getName());
			$('edit-im-select').grab(Mooml.render('IMWindowSelectOptionTemplate', {IM: IM, isSelected: isSelected}));
		}.bind(this));

        this.renderExplanation(selectedIM);
		this.renderIMAutocomplete('edit', selectedIM);

		this.UIListener.registerIMFormEventHandler('edit');
	},
	
	renderIMAutocomplete: function (action, IM) {
		var elAutocomplete = $(action + '-im-form').getElement('.autocomplete').empty();
		Array.each(IM.getFields(), function (f) {
			new InterestMeasureSlider(elAutocomplete, f, action, IM, IM.getName() === 'SUPP' ? this.ARBuilder.getDD().calculateMinimalSupport() : this.ARBuilder.getDD().getRecordCount(), this.config.lang);
		}.bind(this));
	},

    /**
     * Renders the rename task window in an overlay.
     * @param taskId Task id to rename.
     */
    renderRenameTaskWindow: function(taskId) {
        // Locals
        var overlay = this.$UIStructurePainter.showOverlay();
        var taskName = this.ARBuilder.$FRManager.getTask(taskId)
            .$requestData.taskName;

        // Render
        overlay.grab(Mooml.render(
            'renameTaskWindowTemplate',
            {
                i18n: this.i18n,
                taskId: taskId,
                taskName: taskName
            }
        ));

        // Register event handlers for the new controls
        this.UIListener.registerTaskRenameEventHandlers();
    },

    renderExplanation: function(IM) {
        $$('#overlay .help span')[0].set('html', IM.getExplanation());
    },
	
	renderAddCoefficientWindow: function (field) {
		var overlay = this.$UIStructurePainter.showOverlay();
		overlay.grab(Mooml.render('addCoefficientWindowTemplate', {i18n: this.i18n}));
		var selectedCoefficient = this.ARBuilder.getFL().getDefaultBBACoef();
		this.renderAddCoefficientAutocomplete(field, selectedCoefficient);
	},
	
	renderEditCoefficientWindow: function (field) {
		var overlay = this.$UIStructurePainter.showOverlay();
		overlay.grab(Mooml.render('editCoefficientWindowTemplate', {i18n: this.i18n}));
		var selectedCoefficient = this.ARBuilder.getFL().getBBACoefficient(field.getType());
		this.renderEditCoefficientAutocomplete(field, selectedCoefficient);
	},

    renderClickAddAttributeWindow: function (field) {
        var overlay = this.$UIStructurePainter.showOverlay();
        overlay.grab(Mooml.render('clickAddAttributeWindowTemplate', {i18n: this.i18n}));
        this.UIListener.registerClickAddAttributeFormEventHandler(field);
    },
	
	renderAddCoefficientAutocomplete: function(field, selectedCoefficient) { 
		Mooml.render('addCoefficientWindowAutocompleteTemplate', {i18n: this.i18n, selectedCoefficient: selectedCoefficient}).replaces($('add-coefficient-autocomplete'));
		
		Object.each(this.ARBuilder.getFL().getBBACoefficients(), function (BBACoefficient) {
			var isSelected = (BBACoefficient.getName() === selectedCoefficient.getName());
			$('add-coefficient-select').grab(Mooml.render('addCoefficientWindowSelectOptionTemplate', {coefficient: BBACoefficient, isSelected: isSelected}));
		}.bind(this));
		if (selectedCoefficient.getName() === 'One category') {
			var select = $('add-coefficient-category');
			Array.each(field.getRef().getChoices(), function (choice) {
				select.grab(Mooml.render('addCoefficientWindowSelectOption2Template', {choice: choice}));
			});
		} else {
			if (selectedCoefficient.fields.minLength.minValue < selectedCoefficient.fields.minLength.maxValue) {
                var coefData = selectedCoefficient.fields.minLength;
                var maxChoicesExceeded = (coefData.maxValue > field.getRef().getNumChoices());
				var slider1 = new CoefficientAddSlider($('add-coefficient-minlength-slider'), $('add-coefficient-minlength'), coefData.minValue, coefData.minValueInclusive, maxChoicesExceeded ? field.getRef().getNumChoices() : coefData.maxValue, maxChoicesExceeded ? true : coefData.maxValueInclusive);
			} else {
				$('add-coefficient-minlength').set('value', selectedCoefficient.fields.minLength.minValue);
				$('add-coefficient-minlength-slider').setStyles({display: 'none'});
			}
			if (selectedCoefficient.fields.maxLength.minValue < selectedCoefficient.fields.maxLength.maxValue) {
                var coefData = selectedCoefficient.fields.maxLength;
                var maxChoicesExceeded = (coefData.maxValue > field.getRef().getNumChoices());
                var slider2 = new CoefficientAddSlider($('add-coefficient-maxlength-slider'), $('add-coefficient-maxlength'), coefData.minValue, coefData.minValueInclusive, maxChoicesExceeded ? field.getRef().getNumChoices() : coefData.maxValue, maxChoicesExceeded ? true : coefData.maxValueInclusive);
			} else {
				$('add-coefficient-maxlength').set('value', selectedCoefficient.fields.maxLength.minValue);
				$('add-coefficient-maxlength-slider').setStyles({display: 'none'});
			}

            if (slider1 && slider2) {
                slider1.setNextSlider(slider2);
                slider2.setPreviousSlider(slider1);
            }
		}

        this.renderExplanation(selectedCoefficient);
		this.UIListener.registerAddCoefficientFormEventHandler(field);
	},
	
	renderEditCoefficientAutocomplete: function(field, selectedCoefficient) {
		Mooml.render('editCoefficientWindowAutocompleteTemplate', {field: field, i18n: this.i18n, selectedCoefficient: selectedCoefficient}).replaces($('edit-coefficient-autocomplete'));
		
		Object.each(this.ARBuilder.getFL().getBBACoefficients(), function (BBACoefficient) {
			var isSelected = (BBACoefficient.getName() === selectedCoefficient.getName());
			$('edit-coefficient-select').grab(Mooml.render('editCoefficientWindowSelectOptionTemplate', {coefficient: BBACoefficient, isSelected: isSelected}));
		}.bind(this));
		
		if (selectedCoefficient.getName() === 'One category') {
			var select = $('edit-coefficient-category');
			Array.each(field.getRef().getChoices(), function (choice) {
				var isSelected = (choice === field.getCategory());
				select.grab(Mooml.render('editCoefficientWindowSelectOption2Template', {choice: choice, isSelected: isSelected}));
			});
		} else {
			if (selectedCoefficient.fields.minLength.minValue < selectedCoefficient.fields.minLength.maxValue) {
                var coefData = selectedCoefficient.fields.minLength;
                var maxChoicesExceeded = (coefData.maxValue > field.getRef().getNumChoices());
				var slider1 = new CoefficientEditSlider($('edit-coefficient-minlength-slider'), $('edit-coefficient-minlength'), coefData.minValue, coefData.minValueInclusive, maxChoicesExceeded ? field.getRef().getNumChoices() : coefData.maxValue, maxChoicesExceeded ? true : coefData.maxValueInclusive);
			} else {
				$('edit-coefficient-minlength').set('value', selectedCoefficient.fields.minLength.minValue);
				$('edit-coefficient-minlength-slider').setStyles({display: 'none'});
			}
			if (selectedCoefficient.fields.maxLength.minValue < selectedCoefficient.fields.maxLength.maxValue) {
                var coefData = selectedCoefficient.fields.maxLength;
                var maxChoicesExceeded = (coefData.maxValue > field.getRef().getNumChoices());
                var slider2 = new CoefficientEditSlider($('edit-coefficient-maxlength-slider'), $('edit-coefficient-maxlength'), coefData.minValue, coefData.minValueInclusive, maxChoicesExceeded ? field.getRef().getNumChoices() : coefData.maxValue, maxChoicesExceeded ? true : coefData.maxValueInclusive);
			} else {
				$('edit-coefficient-maxlength').set('value', selectedCoefficient.fields.maxLength.minValue);
				$('edit-coefficient-maxlength-slider').setStyles({display: 'none'});
			}

            if (slider1 && slider2) {
                slider1.setNextSlider(slider2);
                slider2.setPreviousSlider(slider1);
            }
		}

        this.renderExplanation(selectedCoefficient);
		this.UIListener.registerEditCoefficientFormEventHandler(field);
	},
	
	renderEditConnectiveWindow: function (cedent) {
		var overlay = this.$UIStructurePainter.showOverlay();
		overlay.grab(Mooml.render('editConnectiveWindowTemplate', {i18n: this.i18n}));

        if (this.ARBuilder.getFL().isConnectiveAllowed('Conjunction', cedent.getScope(), this.ARBuilder.getARManager().getActiveRule().toSettings()[cedent.getScope()], cedent.getLevel())) {
            $('edit-connective-select').grab(Mooml.render('editConnectiveWindowSelectOptionTemplate', {isSelected: cedent.getConnective().getName() === 'Conjunction', connective: 'Conjunction'}));
        }

        if (this.ARBuilder.getFL().isConnectiveAllowed('Disjunction', cedent.getScope(), this.ARBuilder.getARManager().getActiveRule().toSettings()[cedent.getScope()], cedent.getLevel())) {
            $('edit-connective-select').grab(Mooml.render('editConnectiveWindowSelectOptionTemplate', {isSelected: cedent.getConnective().getName() === 'Disjunction', connective: 'Disjunction'}));
        }

		this.UIListener.registerEditConnectiveFormEventHandler(cedent);
	},

    renderCreateUserReportWindow: function() {
        var overlay = this.$UIStructurePainter.showOverlay();
        overlay.grab(Mooml.render('createUserReportWindowTemplate', { i18n: this.i18n, url: this.config.getCreateUserReportUrl() }))
    },

	/* found rules */
	updateFoundRule: function (FR) {
		var elFR = $(FR.getCSSID());
		if (!elFR) { return; }
		
		if (FR.isInteresting() || FR.isException()) {
			elFR.set('morph', {duration: this.morphDuration});
			elFR.setStyle('cursor', 'help');
			
			var elFRInfo = elFR.getElement('.info');
            // TODO refactor all into external CSS style
			elFRInfo.setStyle('display', 'block');
			var elFRHelp = elFRInfo.getElement('.help');
			if (FR.isInteresting()) {
				if (FR.getInteresting()) { // marked as interesting
					elFR.setStyle('font-weight', 'bold');
					
					elFR.store('tip:text', this.i18n.translate('Association rule is novel.'));
				} else { // marked as not interesting
					Array.each(elFR.getChildren('*:not(span.info)'), function (child) {
						child.set('morph', {duration: this.morphDuration});
						child.morph({'opacity': '0.3'});
					}.bind(this));
					
					elFR.store('tip:text', this.i18n.translate('Association rule confirms an already known rule.'));
				}
			} else if (FR.isException()) {
				elFR.setStyle('font-weight', 'bold');
				elFR.morph({'color': '#C91E1D'});
				
				elFR.store('tip:text', this.i18n.translate('This rule is an exception to a rule stored in knowledge base.'));
			}
			
			if (!this.ARBuilder.getFL().getAutoSuggest()) {
				var elBK = elFR.getElement('.bk');
				elBK.morph({'display': 'none'});
			}
			
		}
		
		var elLoading = elFR.getElement('.loading');
		if (elLoading) {
			elLoading.set('morph', {duration: this.morphDuration});
			elLoading.morph({
				'opacity': '0.0'
			});
		}
	},
	
	showFRLoading: function (FR) {
		var elLoading = $(FR.getCSSID()).getElement('.loading');
		elLoading.set('morph', {duration: this.morphDuration});
		elLoading.morph({
			'opacity': '1',
			'visibility': 'visible'
		});
	},

    renderExportBusinessRulesDialog: function(taskId, rules) {
        var rulesIds = [];
        rules.each(function(rule) {
            rulesIds.push(rule.getRule().getId());
        });

        var overlay = this.$UIStructurePainter.showOverlay();
        overlay.grab(Mooml.render('exportBusinessRulesDialogTemplate', { i18n: this.i18n, url: this.config.getExportBusinessRulesUrl(taskId, rulesIds) }))
    },

    renderBRBaseDialog: function() {
        var overlay = this.$UIStructurePainter.showOverlay();
        overlay.grab(Mooml.render('showBRBaseDialogTemplate', { i18n: this.i18n, url: this.config.getBRBaseShowUrl() }))
    },

    renderModelTesterDialog: function(taskId, rules) {
        var rulesIds = [];
        rules.each(function(rule) {
            rulesIds.push(rule.getRule().getId());
        });

        var overlay = this.$UIStructurePainter.showOverlay();
        overlay.grab(Mooml.render('modelTesterDialogTemplate', { i18n: this.i18n, url: this.config.getModelTesterUrl(taskId, rulesIds) }))
    },
		
	/* navigation */
	showETreeProgress: function () {
		$('etree-progress').fade('in');
    },
	
	hideETReeProgress: function () {
		$('etree-progress').fade('out');
	},
    
	morph: function (el, options, duration) {
		duration = duration || this.morphDuration;
		el.set('morph', {duration: duration});
		el.morph(options);
	},
	
    showStopMiningButton: function() {
        $('stop-mining').setStyle('visibility', 'visible');
    },

    hideStopMiningButton: function() {
        $('stop-mining').setStyle('visibility', 'hidden');
    },

    updateDownloadButtons: function(settingPath, resultPath) {
        $('view-task-setting').setStyle('visibility', 'visible');
        $('view-task-setting').set('href', settingPath);

        $('view-task-result').setStyle('visibility', 'visible');
        $('view-task-result').set('href', resultPath);
    },

    hideDownloadButtons: function() {
        $('view-task-setting').setStyle('visibility', 'hidden');
        $('view-task-result').setStyle('visibility', 'hidden');
    },

    hideOverlay: function() {
        this.$UIStructurePainter.hideOverlay();
    },

    /**
     * Updates the overlay window css position.
     * @param isFixed True if the window should be fixed, false otherwise.
     */
    updateOverlayPosition: function(isFixed) {
        var overlay = $('overlay');
        var newHeight = null;

        // Change the position and size
        if (isFixed) {
            overlay.setStyle('height', this.overlayHeight);
            $('settings-window').setStyle('margin-top', this.settingsWindowTopMargin);
            overlay.setStyle('position', 'fixed');
        } else {
            this.overlayHeight = overlay.getStyle('height');
            this.settingsWindowTopMargin = $('settings-window').getStyle('margin-top');

            newHeight = $$('body').getStyle('height');
            overlay.setStyles({
                height: newHeight,
                position: 'absolute'
            });
            $('settings-window').setStyle('margin-top', '10px');
        }
    }

});