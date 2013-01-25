var UITemplateRegistrator = new Class({
	
	initialize: function () {
        this.registerNavigation();
        this.registerActiveRule();
        this.registerIMWindow();
        this.registerAddCoefficientWindow();
        this.registerEditConnectiveWindow();
        this.registerFoundRule();
        this.registerMarkedRules();
        this.registerAttributeWindow();
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
			}
			
			li({'class': className},
                a({href: '#', id: attribute.getCSSAddID(), class: 'add', title: i18n.translate('Add to antecedent')}),
                span({id: attribute.getCSSID()}, attribute.getName()),
                showRemoveAttribute ? a({href: '#', id: attribute.getCSSRemoveID(), 'class': 'remove-attribute', 'title': i18n.translate('Remove')}) : '',
                showEditAttribute ? a({href: '#', id: attribute.getCSSEditID(), 'class': 'edit-attribute', 'title': i18n.translate('Edit')}) : '',
                a({href: '#', id: attribute.getCSSShowHistogramID(), 'class': 'show-histogram', 'title': i18n.translate('Show histogram')})
            );
		});

        Mooml.register('dataFieldTemplate', function (data) {
            var i18n = data.i18n,
                field = data.field;

            li({id: field.getCSSID()},
                a({href: '#', id: field.getCSSAddID(), class: 'add', title: i18n.translate('Add to attributes')}),
                span(field.getName()),
                a({href: '#', id: field.getCSSShowHistogramID(), 'class': 'show-histogram', 'title': i18n.translate('Show histogram')})
            );
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
				a({id: IM.getCSSRemoveID(), href: '#', 'class': 'remove-im', 'title': i18n.translate('Remove')}));
		});
		
		Mooml.register('cedentTemplate', function (data) {
			var rule = data.rule,
			    cedent = data.cedent,
			    i18n = data.i18n;

			div({id: cedent.getCSSID(), 'class': 'cedent' + (cedent.getNumFields() === 0 ? ' empty': '')},
				div({id: cedent.getCSSFieldsID(), 'class': 'fields'}, !cedent.getNumFields() ? '<span class="info">Drag & Drop<br/>attribute here</span>' : ''),
			    rule.getGroupFields() && cedent.displayGroupButton() ? '<a href="#" id="' + cedent.getCSSGroupFieldsConfirmID() + '" class="group-fields">' + i18n.translate('Group marked fields') + '</a>' : ''
            );
		});

        Mooml.register('noRestrictionTemplate', function(data) {
            var i18n = data.i18n;

            div({'class': 'no-restriction', 'title': i18n.translate('No restriction box will be considered as empty cedent.')}, i18n.translate('No restriction'));
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
						fieldSign === 'negative' ? a({id: field.getCSSChangeSignID(), href: '#', 'class': 'change-sign ' + fieldSign}) : '',
						span({id: field.getCSSDragID(), 'class': 'field-drag'}, field.toString()),
						div({'class': 'controls'},
							a({id: field.getCSSRemoveID(), href: '#', 'class': 'remove-field', 'title': i18n.translate('Remove')}),
							a({id: field.getEditCoefficientCSSID(), href: '#', 'class': 'edit-coefficient', 'title': i18n.translate('Edit')}),
							fieldSign === 'positive' ? a({id: field.getCSSChangeSignID(), href: '#', 'class': 'change-sign ' + fieldSign}) : '',
                            markFieldAllowed ? a({id: field.getCSSMarkID(), href: '#', 'class': field.isMarked() === true ? 'marked-field': 'mark-field', 'title': field.isMarked() === true ? i18n.translate('Unmark') : i18n.translate('Mark')}) : ''));
			}
		});

		Mooml.register('connectiveTemplate', function (data) {
			var connective = data.connective,
			    i18n = data.i18n;
			
			div({id: connective.getCSSID(), 'class': 'connective'},
				a({href: '#', 'class': 'edit-connective', 'title': i18n.translate('edit connective')}, connective.toString()));
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
				a({id: 'add-im-close', href: '#'}, i18n.translate('Close')),
				h2(i18n.translate('Add interest measure')),
				form({action: '#', method: 'POST', id: 'add-im-form'},
					label({'for': 'add-im-select'}, i18n.translate('Interest measure:')),
					select({name: 'add-im-select', id: 'add-im-select'}),
                    span({'class': 'tooltip info'},
                        span({'class': 'help'},
                            img({src: './images/icon-tooltip-help.png'}),
                            em(i18n.translate('Explanation')),
                            span('')
                        )
                    ),
					div({'class': 'autocomplete clearfix'}),
					input({type: 'submit', value: i18n.translate('Add')})));
		});

		Mooml.register('editIMWindowTemplate', function (data) {
			var i18n = data.i18n,
			    IM = data.IM;
			
			div({id: 'edit-im-window'},
				a({id: 'edit-im-close', href: '#'}, i18n.translate('Close')),
				h2(i18n.translate('Edit interest measure')),
				form({action: '#', method: 'POST', id: 'edit-im-form'},
					label({'for': 'edit-im-select'}, i18n.translate('Interest measure:')),
					em({class: 'normal'}, IM.getLocalizedName()),
					select({name: 'edit-im-select', id: 'edit-im-select', styles: {display: 'none'}}),
                    span({'class': 'tooltip info', 'styles': {display: 'none'}},
                        span({'class': 'help'},
                            img({src: './images/icon-tooltip-help.png'}),
                            em(i18n.translate('Explanation')),
                            span('')
                        )
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

	registerAddCoefficientWindow: function () {
		Mooml.register('addCoefficientWindowTemplate', function (data) {
			var i18n = data.i18n;
			
			div({id: 'add-coefficient-window'},
				a({id: 'add-coefficient-close', href: '#'}, i18n.translate('Close')),
				h2(i18n.translate('Add coefficient')),
				form({action: '#', method: 'POST', id: 'add-coefficient-form'},
					label({'for': 'add-coefficient-select'}, i18n.translate('Coefficient:')),
					span({id: 'add-coefficient-autocomplete'})),
				div({'class': 'clearfix'}));
		});
		
		Mooml.register('editCoefficientWindowTemplate', function (data) {
			var i18n = data.i18n;
			
			div({id: 'edit-coefficient-window'},
				a({id: 'edit-coefficient-close', href: '#'}, i18n.translate('Close')),
				h2(i18n.translate('Edit coefficient')),
				form({action: '#', method: 'POST', id: 'edit-coefficient-form'},
					label({'for': 'edit-coefficient-select'}, i18n.translate('Coefficient:')),
					span({id: 'edit-coefficient-autocomplete'})),
				div({'class': 'clearfix'}));
		});
		
		Mooml.register('addCoefficientWindowAutocompleteTemplate', function (data) {
			var selectedCoefficient = data.selectedCoefficient,
			    i18n = data.i18n;
			
			if (selectedCoefficient.getName() === 'One category') {
				span({id: 'add-coefficient-autocomplete'},
					select({name: 'add-coefficient-select', id: 'add-coefficient-select'}),
                    span({'class': 'tooltip info'},
                        span({'class': 'help'},
                            img({src: './images/icon-tooltip-help.png'}),
                            em(i18n.translate('Explanation')),
                            span('')
                        )
                    ),
					br(),
					label({'for': 'add-coefficient-category'}, selectedCoefficient.fields.category.localizedName + ':'),
					select({name: 'add-coefficient-category', id: 'add-coefficient-category'}),
					input({type: 'submit', value: i18n.translate('Add')}));
			} else {
				span({id: 'add-coefficient-autocomplete'},
					select({name: 'add-coefficient-select', id: 'add-coefficient-select'}),
                    span({'class': 'tooltip info'},
                        span({'class': 'help'},
                            img({src: './images/icon-tooltip-help.png'}),
                            em(i18n.translate('Explanation')),
                            span('')
                        )
                    ),
                    div({'class': 'autocomplete clearfix'},
                        label({'for': 'add-coefficient-minlength'}, selectedCoefficient.fields.minLength.localizedName + ':'),
                        input({type: 'number', min: 1, step: 1, name: 'add-coefficient-minlength', id: 'add-coefficient-minlength', readonly: 'readonly', pattern: '[0-9]+', required: ''}),
                        div({id: 'add-coefficient-minlength-slider', 'class': 'slider'},
                            div({'class': 'knob'})
                        ),
                        label({'for': 'add-coefficient-maxlength'}, selectedCoefficient.fields.maxLength.localizedName + ':'),
                        input({type: 'number', min: 1, step: 1, name: 'add-coefficient-maxlength', id: 'add-coefficient-maxlength', readonly: 'readonly', pattern: '[0-9]+', required: ''}),
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
					select({name: 'edit-coefficient-select', id: 'edit-coefficient-select'}),
                    span({'class': 'tooltip info'},
                        span({'class': 'help'},
                            img({src: './images/icon-tooltip-help.png'}),
                            em(i18n.translate('Explanation')),
                            span('')
                        )
                    ),
					label({'for': 'edit-coefficient-category'}, i18n.translate('Category')),
					select({name: 'edit-coefficient-category', id: 'edit-coefficient-category'}),
                    br({class: 'clearfix'}),
                    br({class: 'clearfix'}),
					input({type: 'submit', value: i18n.translate('Edit')}));
			} else {
				span({id: 'edit-coefficient-autocomplete'},
					select({name: 'edit-coefficient-select', id: 'edit-coefficient-select'}),
                    span({'class': 'tooltip info'},
                        span({'class': 'help'},
                            img({src: './images/icon-tooltip-help.png'}),
                            em(i18n.translate('Explanation')),
                            span('')
                        )
                    ),
					label({'for': 'edit-coefficient-minlength'}, selectedCoefficient.fields.minLength.localizedName + ':'),
					input({type: 'number', min: 1, step: 1, name: 'edit-coefficient-minlength', id: 'edit-coefficient-minlength', readonly: 'readonly', value: field.getMinimalLength(), pattern: '[0-9]+', required: ''}),
					div({id: 'edit-coefficient-minlength-slider', 'class': 'slider'},
					    div({'class': 'knob'})
                    ),
                    label({'for': 'edit-coefficient-maxlength'}, selectedCoefficient.fields.maxLength.localizedName + ':'),
					input({type: 'number', min: 1, step: 1, name: 'edit-coefficient-maxlength', id: 'edit-coefficient-maxlength', readonly: 'readonly', value: field.getMaximalLength(), pattern: '[0-9]+', required: ''}),
					div({id: 'edit-coefficient-maxlength-slider', 'class': 'slider'},
					    div({'class': 'knob'})
                    ),
                    br(),
                    br(),
                    br(),
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
	
	registerEditConnectiveWindow: function() {
		Mooml.register('editConnectiveWindowTemplate', function (data) {
			var i18n = data.i18n;
			
			div({id: 'edit-connective-window'},
				a({id: 'edit-connective-close', href: '#'}, i18n.translate('Close')),
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
	
	registerFoundRule: function () {
		Mooml.register('foundRuleTemplate', function (data) {
			var key = data.key,
			    FR = data.FR,
			    rule = FR.getRule(),
			    i18n = data.i18n,
			    BK = data.BK;
			
			li({id: FR.getCSSID(), 'class': 'found-rule'},
				span({'class': 'rule'}, '<span class="id">' + key + '.</span>' + rule.getIdent()),
				span({'class': 'info'}),
				!BK ? a({id: rule.getFoundRuleCSSBKID(), href: '#', 'class': 'bk', 'title': i18n.translate('Ask background knowledge')}) : '',
				a({id: rule.getFoundRuleCSSMarkID(), href: '#', 'class': 'mark', 'title': i18n.translate('Mark rule')}),
				a({id: rule.getFoundRuleCSSRemoveID(),href: '#', 'class': 'clear', 'title': i18n.translate('Clear rule')}),
				div({'class': 'loading'}, ''),
				span({'class': 'ims'}, rule.getIMIdent())
			);
		});
	},
	
	registerMarkedRules: function () {
		Mooml.register('markedRuleTemplate', function (data) {
			var rule = data.rule,
			    i18n = data.i18n;

			li({id: rule.getMarkedRuleCSSID(), class: 'marked-rule'},
				span({'class': 'rule'}, rule.getIdent()), 
				a({id: rule.getMarkedRuleCSSRemoveID(), href: '#', 'class': 'clear', 'title': i18n.translate('Remove')}),
				span({'class': 'ims'}, rule.getIMIdent()));
		});
	},
	
    registerAttributeWindow: function() {
        Mooml.register('addAttributeTemplate', function (data) {
            var url = data.url;

            div({id: 'add-attribute-window'},
                iframe({src: url}));
        });

        Mooml.register('editAttributeTemplate', function (data) {
            var url = data.url;

            div({id: 'edit-attribute-window'},
                iframe({src: url}));
        });

        Mooml.register('showHistogramTemplate', function (data) {
            var url = data.url;

            div({id: 'show-histogram-window'},
                iframe({src: url}));
        });
    }
	
});