var UIPainter = new Class({
	
	config: null,
	UIColorizer: null,
	UIListener: null,
    dateHelper: null,
    UITemplateRegistrator: null,

	pager: null,
	
	rootElement: null,
	i18n: null,

	callbackStack: [],

	// sort attributes
	sortDuration: 750,
	morphDuration: 500,
	
	// dispose element
	disposeDuration: 750,
	
	initialize: function (ARBuilder, config, i18n, UIColorizer, UIListener, dateHelper, UITemplateRegistrator) {
		this.ARBuilder = ARBuilder;
        this.config = config;
		this.rootElement = $(this.config.getRootElementID());
		this.i18n = i18n;
		this.UIColorizer = UIColorizer;
		this.UIListener = UIListener;
		this.dateHelper = dateHelper;
		this.UITemplateRegistrator = UITemplateRegistrator;
	},
	
	getDisposeDuration: function () {
		return this.disposeDuration;
	},

    renderOverlay: function() {
        this.rootElement.grab(Mooml.render('overlayTemplate'));
    },

	createUI: function () {
		this.renderAll();
	},

	renderAll: function () {
		this.renderStructure();
		this.renderNavigation();
		this.renderContent();
        this.resizeWindow();
	},

	renderStructure: function () {
		this.rootElement.grab(Mooml.render('headerTemplate', {config: this.config, i18n: this.i18n}));
		this.rootElement.grab(Mooml.render('mainTemplate', {config: this.config, dateHelper: this.dateHelper, i18n: this.i18n}));
		this.rootElement.grab(Mooml.render('footerTemplate', {config: this.config, i18n: this.i18n}));
        this.UIListener.registerResizeEventHandler();
		this.UIListener.registerSettingsEventHandlers();
        this.UIListener.registerDataReloadEventHandlers();
        this.UIListener.registerFoundRulesEventHandlers();
	},

    resizeWindow: function() {
        var contentWidth = Math.max($$('header')[0].getSize().x + 13, $(window).getSize().x);
        var contentHeight = Math.max($$('header')[0].getSize().y + $('wrapper').getSize().y + $$('footer')[0].getSize().y + 60, $(window).getSize().y);

        // fix overlay width to 100%
        $('overlay').setStyle('width', contentWidth);

        // fix overlay height to 100%
        $('overlay').setStyle('height', contentHeight);

        // fix wrapper width to 100%
        $('wrapper').setStyle('width', contentWidth);
    },
	
	renderNavigation: function () {
		// attributes
		this.renderAttributes();

        // data fields
        this.renderDataFields();

        this.UIListener.registerNavigationEventHandlers();
	},
	
	renderAttributes: function(navigation) {
		var navigation = $('navigation');
		var attributes = $('attributes');
		if (attributes) {
			Mooml.render('attributesStructureTemplate', {i18n: this.i18n, byGroup: this.ARBuilder.getARManager().getAttributesByGroup(), inProgress: this.ARBuilder.getETreeManager().getInProgress()}).replaces(attributes);
		} else {
			navigation.grab(Mooml.render('attributesStructureTemplate', {i18n: this.i18n, byGroup: this.ARBuilder.getARManager().getAttributesByGroup(), inProgress: this.ARBuilder.getETreeManager().getInProgress()}));
		}
		
		if (this.ARBuilder.getARManager().getAttributesByGroup() === true) {
			this.renderAttributesByGroup(navigation.getElement('ul'));
		} else {
			this.renderAttributesByList();
		}
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
			elementParent.grab(Mooml.render('attributeByListTemplate', {i18n: this.i18n, isUsed: this.ARBuilder.getARManager().getActiveRule().isAttributeUsed(attribute), attribute: attribute}));
			this.UIListener.registerAttributeEventHandler(attribute);
		} else { // re-render
			var element = $(attribute.getCSSID());
			element.set('morph', {duration: this.morphDuration});
			if (attribute.isRecommended()) {
				element.morph({
					'background-image': 'url(images/icon-rec1.png',
					'background-repeat': 'no-repeat',
					'color': '#434343'});
			} else if (attribute.isPartiallyRecommended()) {
				element.morph({
					'background-image': 'url(images/icon-rec2.png',
					'background-repeat': 'no-repeat',
					'color': '#434343'});
			} else if (this.ARBuilder.getARManager().getActiveRule().isAttributeUsed(attribute)) {
				element.morph({
					'background-image': 'none',
					'color': '#AAA'});
			} else {
				element.morph({
					'background-image': 'none',
					'color': '#434343'});
			}
		}
	},

    renderAddAttributeWindow: function(field) {
        var overlay = this.showOverlay();
        var url = this.config.getAddAttributeURL(field.getName());
        var window = Mooml.render('addAttributeTemplate', {i18n: this.i18n, url: url});
        overlay.grab(window);
        this.scrollTo();
    },

    renderEditAttributeWindow: function (attribute) {
        var overlay = this.showOverlay();
        var url = this.config.getEditAttributeURL(attribute.getName());
        var window = Mooml.render('editAttributeTemplate', {i18n: this.i18n, url: url});
        overlay.grab(window);
        this.scrollTo();
    },

    renderNewTaskWindow: function () {
        var url = this.config.getNewTaskURL();
        var elWindow = Mooml.render('newTaskTemplate', {i18n: this.i18n, url: url});
        var overlay = this.showOverlay();
        overlay.grab(elWindow);
        this.scrollTo();
    },

    scrollTo: function (x, y) {
        x = x || 0;
        y = y || 0;
        $(this.config.getRootElementID()).scrollTo(x, y);
    },

    removeAttribute: function(attribute) {
        $(attribute.getCSSID()).getParent().destroy();
    },

    renderDataFields: function() {
        var navigation = $('navigation');
        var dataFields = $('data-fields');
        if (dataFields) {
            dataFields = Mooml.render('dataFieldsStructureTemplate', {i18n: this.i18n}).replaces(dataFields);
        } else {
            dataFields = Mooml.render('dataFieldsStructureTemplate', {i18n: this.i18n});
            navigation.grab(dataFields);
        }

        this.ARBuilder.getDD().getFields().each(function(field) {
            this.renderDataField(field, dataFields.getElement('ul'));
            this.UIListener.registerDataFieldEventHandler(field);
        }.bind(this));
    },

    renderDataField: function(field, elementParent) {
        var DF = Mooml.render('dataFieldTemplate', {field: field});
        elementParent.grab(Mooml.render('dataFieldTemplate', {field: field}));
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
	
	renderMarkedRulesBox: function () {
		var main = $('main');
		
		// marked rules
		var elementMarkedRules = Mooml.render('markedRulesStructureTemplate', {i18n: this.i18n});
		main.grab(elementMarkedRules);
		this.renderMarkedRules(elementMarkedRules.getElement('ul'));
		
		this.UIListener.registerMarkedRulesEventHandlers();
	},
	
	renderMarkedRules: function (elementParent, markedRules) {
		if (!elementParent) { // re-render
			elementParent = $$('#marked-rules ul')[0];
			elementParent.empty();
		}

		var i = 0;
		Object.each(markedRules, function (FR) {
			FR.getRule().setId(++i);
			var elementRule = Mooml.render('markedRuleTemplate', {i18n: this.i18n, rule: FR.getRule()});
			elementParent.grab(elementRule);
			this.UIListener.registerMarkedRuleEventHandlers(FR);
		}.bind(this));

		var sortables = new Sortables(elementParent, {
			clone: true,
			revert: true,
			
			onComplete: function (element) {
				this.ARBuilder.getARManager().sortMarkedRules(sortables.serialize());
			}.bind(this)
		});
	},
	
	initFieldGroup: function (id) { // recursive
		var FG = this.ARBuilder.getFGC().getFieldGroup(id);

		var returnEl = new Element('li', {id: 'fg-' + id + '-name', 'class': 'field-group-drag', html: '<span>' + FG.getLocalizedName() + '</span>', title: FG.getExplanation()});
		var FGEl = new Element('ul', {id: 'fg-' + id, 'class': 'field-group'}).inject(returnEl);
		//if (FG.getId() !== 1) {
			this.callbackStack.push({func: this.UIListener.registerFieldGroupEventHandler, args: [FG]});
		//}

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
	
	renderContent: function () {
		this.renderActiveRule();
		this.renderMarkedRulesBox();
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
		
		this.updateScrollbar();
	},
	
	renderCedent: function (cedent, elementParent) {
		var elementCedent = Mooml.render('cedentTemplate', {rule: this.ARBuilder.getARManager().getActiveRule(), cedent: cedent, i18n: this.i18n});
		if (elementParent !== null) { // new cedent
			elementParent.grab(elementCedent);
		} else { // re-render
			// re-render
			elementCedent.replaces($(cedent.getCSSID()));
		}
		
		var elementFields = elementCedent.getElement('div.fields');

        var index = 1;

        if (cedent.hasOpeningBracket(index)) {
            var elementLeftBracket = Mooml.render('bracketTemplate', {isLeft: true});
            elementFields.grab(elementLeftBracket);
        }

        cedent.getChildren().each(function(child) {
            if (instanceOf(child, Cedent)) { // Cedent
                this.renderCedent(child, elementFields);
            } else { // FieldAR
                this.renderField(child, elementFields, cedent);
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
	
	renderField: function (field, elementParent, cedent) {
		if (elementParent !== null) { // new field
			var elementField = Mooml.render('fieldTemplate', {field: field, i18n: this.i18n, cedent: cedent});
			elementParent.grab(elementField);
		} else { // re-render
			var elementField = Mooml.render('fieldTemplate', {field: field, i18n: this.i18n, cedent: cedent});
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
		var overlay = this.showOverlay();
		overlay.grab(Mooml.render('addIMWindowTemplate', {i18n: this.i18n}));
		var selectedIM = IMs[Object.keys(IMs)[0]];
		Object.each(IMs, function (IM) {
			var isSelected = (IM.getName() === selectedIM.getName());
			$('add-im-select').grab(Mooml.render('IMWindowSelectOptionTemplate', {IM: IM, isSelected: isSelected}));
		}.bind(this));
		
		this.renderIMAutocomplete('add', selectedIM);

		this.UIListener.registerIMFormEventHandler('add');
	},
	
	renderEditIMWindow: function(IMs, selectedIM) {
		var overlay = this.showOverlay();
		overlay.grab(Mooml.render('editIMWindowTemplate', {i18n: this.i18n, IM: selectedIM}));
		Object.each(IMs, function (IM) {
			var isSelected = (IM.getName() === selectedIM.getName());
			$('edit-im-select').grab(Mooml.render('IMWindowSelectOptionTemplate', {IM: IM, isSelected: isSelected}));
		}.bind(this));
		
		this.renderIMAutocomplete('edit', selectedIM);

		this.UIListener.registerIMFormEventHandler('edit');
	},
	
	renderIMAutocomplete: function (action, selectedIM) {
		var elAutocomplete = $(action + '-im-form').getElement('.autocomplete').empty();
		Array.each(selectedIM.getFields(), function (f) {
			var IMSlider = new InterestMeasureSlider(elAutocomplete, f, action, selectedIM);
		}.bind(this));
	},
	
	renderAddCoefficientWindow: function (field) {
		var overlay = this.showOverlay();
		overlay.grab(Mooml.render('addCoefficientWindowTemplate', {i18n: this.i18n}));
		var selectedCoefficient = this.ARBuilder.getFL().getDefaultBBACoef();
		this.renderAddCoefficientAutocomplete(field, selectedCoefficient);
	},
	
	renderEditCoefficientWindow: function (field) {
		var overlay = this.showOverlay();
		overlay.grab(Mooml.render('editCoefficientWindowTemplate', {i18n: this.i18n}));
		var selectedCoefficient = this.ARBuilder.getFL().getBBACoefficient(field.getType());
		this.renderEditCoefficientAutocomplete(field, selectedCoefficient);
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
				var coefficientSlider1 = new CoefficientAddSlider($('add-coefficient-minlength-slider'), $('add-coefficient-minlength'), selectedCoefficient.fields.minLength);
			} else {
				$('add-coefficient-minlength').set('value', selectedCoefficient.fields.minLength.minValue);
				$('add-coefficient-minlength-slider').setStyles({display: 'none'});
			}
			if (selectedCoefficient.fields.maxLength.minValue < selectedCoefficient.fields.maxLength.maxValue) {
				var coefficientSlider2 = new CoefficientAddSlider($('add-coefficient-maxlength-slider'), $('add-coefficient-maxlength'), selectedCoefficient.fields.maxLength);
			} else {
				$('add-coefficient-maxlength').set('value', selectedCoefficient.fields.maxLength.minValue);
				$('add-coefficient-maxlength-slider').setStyles({display: 'none'});
			}
		}
		
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
				var coefficientSlider1 = new CoefficientEditSlider($('edit-coefficient-minlength-slider'), $('edit-coefficient-minlength'), selectedCoefficient.fields.minLength);
			} else {
				$('edit-coefficient-minlength').set('value', selectedCoefficient.fields.minLength.minValue);
				$('edit-coefficient-minlength-slider').setStyles({display: 'none'});
			}
			if (selectedCoefficient.fields.maxLength.minValue < selectedCoefficient.fields.maxLength.maxValue) {
				var coefficientSlider2 = new CoefficientEditSlider($('edit-coefficient-maxlength-slider'), $('edit-coefficient-maxlength'), selectedCoefficient.fields.maxLength, coefficientSlider1);
			} else {
				$('edit-coefficient-maxlength').set('value', selectedCoefficient.fields.maxLength.minValue);
				$('edit-coefficient-maxlength-slider').setStyles({display: 'none'});
			}
		}
		
		this.UIListener.registerEditCoefficientFormEventHandler(field);
	},
	
	renderEditConnectiveWindow: function (cedent) {
		var overlay = this.showOverlay();
		overlay.grab(Mooml.render('editConnectiveWindowTemplate', {i18n: this.i18n}));

        if (this.ARBuilder.getFL().isConnectiveAllowed('Conjunction', cedent.getScope(), this.ARBuilder.getARManager().getActiveRule().toSettings()[cedent.getScope()], cedent.getLevel())) {
            $('edit-connective-select').grab(Mooml.render('editConnectiveWindowSelectOptionTemplate', {isSelected: cedent.getConnective().getName() === 'Conjunction', connective: 'Conjunction'}));
        }

        if (this.ARBuilder.getFL().isConnectiveAllowed('Disjunction', cedent.getScope(), this.ARBuilder.getARManager().getActiveRule().toSettings()[cedent.getScope()], cedent.getLevel())) {
            $('edit-connective-select').grab(Mooml.render('editConnectiveWindowSelectOptionTemplate', {isSelected: cedent.getConnective().getName() === 'Disjunction', connective: 'Disjunction'}));
        }

		this.UIListener.registerEditConnectiveFormEventHandler(cedent);
	},
	
	/* active rule */
	updateScrollbar: function (scrollerWidth, width) {
		var scrollerWidth = $('ar-scroller').getSize().x;
		var width = $('antecedent').getSize().x + $('interest-measures').getSize().x + $('succedent').getSize().x + 1; // IE9 hack (+1)
		$('ar-wrapper').setStyle('width', width);
		
		if (width > scrollerWidth) {
			$('ar-scroller').setStyle('overflow-x', 'scroll');
		} else {
			$('ar-scroller').setStyle('overflow-x', 'hidden');
		}
	},
	
	/* found rules */
	updateFoundRule: function (FR) {
		var elFR = $(FR.getCSSID());
		if (!elFR) { return; }
		
		if (FR.getIndexed()) {
			elFR.set('morph', {duration: this.morphDuration});
			elFR.setStyle('cursor', 'help');
			
			var elFRInfo = elFR.getElement('.info');
            // TODO refactor into external CSS style
			elFRInfo.setStyle('display', 'block');
			elFRInfo.setStyle('background', "rgba(255, 255, 255, 0.5) url('./images/sprite-icons.png') -16px -465px no-repeat");
			var elFRHelp = elFRInfo.getElement('.help');
			if (FR.isInteresting()) {
				if (FR.getInteresting()) { // marked as interesting
					elFR.setStyle('font-weight', 'bold');
					
					elFR.store('tip:text', this.i18n.translate('Association rule is considered as interesting.'));
				} else { // marked as not interesting
					Array.each(elFR.getChildren('*:not(span.info)'), function (child) {
						child.set('morph', {duration: this.morphDuration});
						child.morph({'opacity': '0.3'});
					}.bind(this));
					
					elFR.store('tip:text', this.i18n.translate('Association rule is considered as not interesting.'));
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
		
	clearCedentInfo: function (cedent) {
		$(cedent.getCSSInfoID()).empty();
	},
	
	/* navigation */
	showETreeProgress: function () {
		$('etree-progress').fade('in');
    },
	
	hideETReeProgress: function () {
		$('etree-progress').fade('out');
	},
    
    /* overlay */
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
	
	/* misc */
	showElement: function (el) {
		var options = {'opacity': '1'};
		this.morph(el, options);
	},
	
	hideElement: function (el) {
		var options = {'opacity': '0'};
		this.morph(el, options);
	},
	
	morph: function (el, options, duration) {
		duration = duration || this.morphDuration;
		el.set('morph', {duration: duration});
		el.morph(options);
	},
	
	disposeFoundRules: function () {
		var delay = 0;
		var delayTime = 100;
		Array.each($$('#found-rules li'), function (el) {
			delay += delayTime;
			this.disposeElement.delay(delay, this, el);
		}.bind(this));
	},
	
	disposeElement: function (el) {
		var clone = el.clone().setStyles(el.getCoordinates()).setStyles({
			opacity: 0.7,
			position: 'absolute'
	    }).inject(document.body);
		el.destroy();
		
		clone.set('morph', {duration: this.disposeDuration});
		clone.morph({
			'opacity': '0',
			'height': '0'
		});
		clone.destroy.delay(this.disposeDuration, clone);
	},
	
	destroyElement: function (el) {
		el.destroy();
	},
	
	/* settings */
	renderSettingsWindow: function (FLs, selectedFL, autoSuggest, reset, settings) {
		var settings = Mooml.render('settingsTemplate', {autoSuggestPossible: (autoSuggest.length > 0), i18n: this.i18n, reset: reset, settings: settings});
		var elWindow = $('settings-window');
		if (elWindow) { // re-render (autocomplete)
			settings.getElement('.autocomplete').replaces(elWindow.getElement('.autocomplete'));
			this.UIListener.registerSettingsWindowEventHandlers(autoSuggestPossible);
		} else {
			var overlay = this.showOverlay();
			overlay.grab(settings);
			this.UIListener.registerSettingsWindowEventHandlers(autoSuggestPossible);
		}
		
		var elSelect = $('fl-select');
		Object.each(FLs, function (FL) {
			var isSelected = (FL.getName() === selectedFL.getName());
			elSelect.grab(Mooml.render('flOptionTemplate', {FL: FL, isSelected: isSelected}));
		}.bind(this));
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

    showLoadData: function() {
        $('overlay').grab(new Element('div', {id: 'loading-data', html: this.i18n.translate('Loading application data...')}));
        this.showOverlay();
    },

    showLoadDataError: function() {
        $('loading-data').set('html', this.i18n.translate('An error occured while loading application data.'));
        $('loading-data').addClass('error');
    }

});