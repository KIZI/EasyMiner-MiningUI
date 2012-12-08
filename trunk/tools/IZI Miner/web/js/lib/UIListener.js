var UIListener = new Class({
	
	ARBuilder: null,
	UIColorizer: null,
	UIPainter: null,
    $dragDropHelper: null,

	initialize: function (ARBuilder, UIColorizer, dragDropHelper, colorHelper) {
		this.ARBuilder = ARBuilder;
		this.UIColorizer = UIColorizer;
        this.$dragDropHelper = dragDropHelper;
        this.$colorHelper = colorHelper;
	},
	
	setUIPainter: function (UIPainter) {
		this.UIPainter = UIPainter;
	},

	registerAttributeEventHandler: function (attribute, showEditAttribute, showRemoveAttribute) {
        // drag & drop
        $(attribute.getCSSID()).addEvent('mousedown', function (event) {
            event.stop();
            if (event.rightClick) { return false; } // disable right click drag & drop

            var draggable = this.$dragDropHelper.createDraggable($(attribute.getCSSID()));
            var droppable = $$('div.cedent');
            var drag = this.$dragDropHelper.createDrag(draggable, droppable, {color: this.$colorHelper.getCedentBackgroundColor(), borderColor: this.$colorHelper.getCedentBorderColor(), highlightColor: this.$colorHelper.getCedentHighlightBackgroundColor(), highlightBorderColor: this.$colorHelper.getCedentHighlightBorderColor(), enterColor: this.$colorHelper.getCedentEnterBackgroundColor(), callback: function(element) { element.fireEvent('addAttribute', attribute); }});

		    drag.start(event);
            this.UIColorizer.tween(droppable, this.$colorHelper.getCedentHighlightBackgroundColor());
            this.UIColorizer.tween(droppable, this.$colorHelper.getCedentHighlightBorderColor(), 'border-color');
		}.bind(this));

        if (showEditAttribute) { // edit
            $(attribute.getCSSEditID()).addEvent('click', function(event) {
                event.stop();
                this.ARBuilder.openEditAttributeWindow(attribute);
            }.bind(this));
        }

        if (showRemoveAttribute) { // remove
            $(attribute.getCSSRemoveID()).addEvent('click', function(event) {
                event.stop();
                this.ARBuilder.removeAttribute(attribute);
            }.bind(this));
        }
	},

    registerDataFieldEventHandler: function(field) {
        $(field.getCSSID()).addEvent('mousedown', function (event) {
            event.stop();
            if (event.rightClick) { return false; } // disable right click drag & drop

            var draggable = this.$dragDropHelper.createDraggable($(field.getCSSID()));
            var droppable = $('attributes');
            var drag = this.$dragDropHelper.createDrag(draggable, droppable, {color: this.$colorHelper.getAttributesBackgroundColor(), highlightColor: this.$colorHelper.getAttributesHighlightBackgroundColor(), enterColor: this.$colorHelper.getAttributesEnterBackgroundColor(), callback: function() { this.ARBuilder.openAddAttributeWindow(field); }, scope: this});

            drag.start(event);
            this.UIColorizer.tween(droppable, this.$colorHelper.getAttributesHighlightBackgroundColor());
        }.bind(this));
    },

	registerFieldEventHandler: function (field) {
		$(field.getCSSID()).addEvent('mousedown', function (event) {
            event.stop();
            if (event.rightClick) { return false; } // disable right click drag & drop

            var draggable = this.$dragDropHelper.createDraggable($(field.getCSSID()));
            var droppable = $$('div.cedent');
            var drag = this.$dragDropHelper.createDrag(draggable, droppable, {color: this.$colorHelper.getCedentBackgroundColor(), borderColor: this.$colorHelper.getCedentBorderColor(), highlightColor: this.$colorHelper.getCedentHighlightBackgroundColor(), highlightBorderColor: this.$colorHelper.getCedentHighlightBorderColor(), enterColor: this.$colorHelper.getCedentEnterBackgroundColor(), callback: function(element) { element.fireEvent('addField', field); }});
			
			drag.start(event);
            this.UIColorizer.tween(droppable, this.$colorHelper.getCedentHighlightBackgroundColor());
            this.UIColorizer.tween(droppable, this.$colorHelper.getCedentHighlightBorderColor(), 'border-color');
		}.bind(this));
	},
	
	registerFieldGroupEventHandler: function (FG) {
		$(FG.getCSSNameID()).addEvent('mousedown', function (event) {
			event.stop();
			
			// disable right click drag & drop
			if (event.rightClick) {
				return false;
			}
			
			var draggedFG = $(FG.getCSSNameID());
			var clone = draggedFG.clone().setStyles(draggedFG.getCoordinates()).setStyles({
				opacity: 0.7,
				position: 'absolute'
		    }).inject(document.body);

		    var drag = new Drag.Move(clone, {
		        droppables: $$('div.cedent'),

		        onDrop: function (dragging, elementCedent) {
		        	dragging.destroy();
		        	if (elementCedent !== null) {
		        		elementCedent.fireEvent('addFieldGroup', FG);
		        		this.UIColorizer.dragDrop(elementCedent);
		        	}
		        }.bind(this),
		        
		        onEnter: function (dragging, elementCedent) {
		        	this.UIColorizer.dragEnter(elementCedent);
		        }.bind(this),
		        
		        onLeave: function (dragging, elementCedent) {
		        	this.UIColorizer.dragLeave(elementCedent);
		        }.bind(this),
		        
		        onCancel: function (dragging) {
		        	dragging.destroy();
		        }
		    });
			
			drag.start(event);
			
		}.bind(this));
	},

	registerActiveRuleEventHandlers: function (rule) {
		if (this.ARBuilder.getARManager().hasPossibleIMs()) {
			// open add IM window
			$('add-im').addEvent('click', function (event) {
				event.stop();
				this.ARBuilder.getARManager().openAddIMWindow();
			}.bind(this));
		}
		
		if (this.ARBuilder.getARManager().display4ftTaskBox()) {
			$('mine-rules-confirm').addEvent('click', function (event) {
				event.stop();
				this.ARBuilder.getARManager().mineRulesConfirm();
			}.bind(this));
		}
		
		if (this.ARBuilder.getARManager().displayETreeTaskBox()) {
			$('recommend-attributes-confirm').addEvent('click', function (event) {
				event.stop();
				this.ARBuilder.getARManager().recommendAttributesConfirm();
			}.bind(this));
		}
	},
	
	registerIMEventHandler: function (IM) {
		// edit
		$(IM.getCSSEditID()).addEvent('click', function (e) {
			e.stop();
			this.ARBuilder.getARManager().openEditIMWindow(IM);
		}.bind(this));
		
		// remove
		$(IM.getCSSRemoveID()).addEvent('click', function (e) {
			e.stop();
			this.ARBuilder.getARManager().removeIM(IM);
		}.bind(this));
	},
	
	registerIMFormEventHandler: function (action) {
		// submit
		var elementSubmit = $(action + '-im-form').getElement('input[type=submit]');
		elementSubmit.addEvent('click', function (event) {
			event.stop();
			var elementSelect = $(action + '-im-select');
			var IMName = elementSelect.options[elementSelect.selectedIndex].value;
			var IM = this.ARBuilder.getARManager().getIMPrototype(IMName);

            var validator = new IMValidator();
            if (IM.getName() === 'SUPP') {
                var valid = true;
            } else {
                var valid = validator.validate(IM, action);
            }

			if (valid) {
				var thresholdValue = IM.hasThreshold() ? $(action + '-im-threshold-value').value : null;
				var alphaValue = IM.hasAlpha() ? $(action + '-im-alpha-value').value : null;
				if (action === 'add') {
					var IM = this.ARBuilder.getARManager().addIM(IM, thresholdValue, alphaValue);
				} else {
					var IM = this.ARBuilder.getARManager().editIM(IM, thresholdValue, alphaValue);
				}
			}
		}.bind(this));
		
		// change IM
		var elementSelect = $(action + '-im-select');
		elementSelect.addEvent('change', function (e) {
			e.stop();
			var IMName = elementSelect.options[elementSelect.selectedIndex].value;
			var IM = this.ARBuilder.getARManager().getIMPrototype(IMName);
			this.UIPainter.renderIMAutocomplete(action, IM);
            this.UIPainter.renderExplanation(IM);
		}.bind(this));
		
		// close
		var elementClose = $(action + '-im-close');
		elementClose.addEvent('click', function (event) {
			this.ARBuilder.getARManager().closeIMWindow();
			event.stop();
		}.bind(this));
	},
	
	registerCedentEventHandlers: function (cedent, rule) {
		// add attribute (fired by drag & drop)
		$(cedent.getCSSID()).addEvent('addAttribute', function (attribute) {
			this.ARBuilder.getARManager().addAttribute(cedent, attribute);
		}.bind(this));
		
		// add preset field (fired by drag & drop)
		$(cedent.getCSSID()).addEvent('addField', function (field) {
			this.ARBuilder.getARManager().addField(field, cedent);
		}.bind(this));
		
		// add preset field group
		$(cedent.getCSSID()).addEvent('addFieldGroup', function (FG) {
			this.ARBuilder.getARManager().addFieldGroup(FG, cedent);
		}.bind(this));
		
		// add field (fired by drag & drop)
		$(cedent.getCSSID()).addEvent('addFieldAR', function (field) {
			this.ARBuilder.getARManager().addFieldAR(field, cedent);
		}.bind(this));
		
		// edit connective
		var elCons = $$('#' + cedent.getCSSID() + ' a.edit-connective');
		Array.each(elCons, function (elCon) {
			elCon.addEvent('click', function (e) {
				e.stop();
                if (!$('edit-connective-window')) {
                    this.ARBuilder.getARManager().openEditConnectiveWindow(cedent);
                }
			}.bind(this));
		}.bind(this));

		// group fields option
		if (rule.getGroupFields() && cedent.displayGroupButton()) {
			// group fields confirm
			$(cedent.getCSSGroupFieldsConfirmID()).addEvent('click', function (event) {
				this.ARBuilder.getARManager().groupFields(cedent);
				event.stop();
			}.bind(this));
		}
	},
	
	registerAddCoefficientFormEventHandler: function (field) { 
		// submit
		var elementSubmit = $('add-coefficient-form').getElement('input[type=submit]');
		elementSubmit.addEvent('click', function (event) {
			var elementSelect = $('add-coefficient-select');
			var coefficientName = elementSelect.options[elementSelect.selectedIndex].value;
			if (coefficientName === 'One category') {
				var coefficientCategory = $('add-coefficient-category').value;
				this.ARBuilder.getARManager().addCoefficient(field, coefficientName, coefficientCategory);
			} else {
				var coefficientMinlength = $('add-coefficient-minlength').value;
				var coefficientMaxlength = $('add-coefficient-maxlength').value;
				this.ARBuilder.getARManager().addCoefficient(field, coefficientName, coefficientMinlength, coefficientMaxlength);
			}
			event.stop();
		}.bind(this));
		
		// change coefficient
		var elementSelect = $('add-coefficient-select');
		elementSelect.addEvent('change', function (event) {
			event.stop();
			this.ARBuilder.getARManager().updateAddCoefficientAutocomplete(field, elementSelect.options[elementSelect.selectedIndex].value);
		}.bind(this));
		
		// close
		var elementClose = $('add-coefficient-close');
		elementClose.addEvent('click', function (event) {
			this.ARBuilder.getARManager().closeAddCoefficientWindow();
			this.ARBuilder.getARManager().removeField(field);
			event.stop();
		}.bind(this));
	},
	
	registerEditCoefficientEventHandler: function (field) {
		$(field.getEditCoefficientCSSID()).addEvent('click', function (event) {
			this.ARBuilder.getARManager().openEditCoefficientWindow(field);
			event.stop();
		}.bind(this));
	},
	
	registerEditCoefficientFormEventHandler: function (field) { 
		// submit
		var elementSubmit = $('edit-coefficient-form').getElement('input[type=submit]');
		elementSubmit.addEvent('click', function (event) {
			var elementSelect = $('edit-coefficient-select');
			var coefficientName = elementSelect.options[elementSelect.selectedIndex].value;
			if (coefficientName === 'One category') {
				var coefficientCategory = $('edit-coefficient-category').value;
				this.ARBuilder.getARManager().editCoefficient(field, coefficientName, coefficientCategory);
			} else {
				var coefficientMinlength = $('edit-coefficient-minlength').value;
				var coefficientMaxlength = $('edit-coefficient-maxlength').value;
				this.ARBuilder.getARManager().editCoefficient(field, coefficientName, coefficientMinlength, coefficientMaxlength);
			}
			event.stop();
		}.bind(this));
		
		// change coefficient
		var elementSelect = $('edit-coefficient-select');
		elementSelect.addEvent('change', function (event) {
			event.stop();
			this.ARBuilder.getARManager().updateEditCoefficientAutocomplete(field, elementSelect.options[elementSelect.selectedIndex].value);
		}.bind(this));
		
		// close
		var elementClose = $('edit-coefficient-close');
		elementClose.addEvent('click', function (event) {
			this.ARBuilder.getARManager().closeEditCoefficientWindow();
			event.stop();
		}.bind(this));
	},
	
	registerEditConnectiveFormEventHandler: function(cedent) {
		// submit
		var elementSubmit = $('edit-connective-form').getElement('input[type=submit]');
		elementSubmit.addEvent('click', function (event) {
			event.stop();
            var elementSelect = $('edit-connective-select');
			if (elementSelect) {
                var connectiveName = elementSelect.options[elementSelect.selectedIndex].value;
			    this.ARBuilder.getARManager().editConnective(cedent, connectiveName);
            }
		}.bind(this));
		
		// close
		var elementClose = $('edit-connective-close');
		elementClose.addEvent('click', function (event) {
			event.stop();
			this.ARBuilder.getARManager().closeEditConnectiveWindow();
		}.bind(this));
	},
	
	registerFieldAREventHandlers: function (field, cedent) {
		// remove field
		var elementField = $(field.getCSSRemoveID());
		elementField.addEvent('click', function (event) {
			this.ARBuilder.getARManager().removeField(field);
			event.stop();
		}.bind(this));
		
		// change field sign
		$(field.getCSSChangeSignID()).addEvent('click', function (event) {
			this.ARBuilder.getARManager().changeFieldSign(field);
			event.stop();
		}.bind(this));
		
		var elMark = $(field.getCSSMarkID());
		if (cedent.getNumFields(cedent.getLevel()) > 1 && elMark) {
			// mark / unmark rule
			elMark.addEvent('click', function (event) {
				this.ARBuilder.getARManager().changeMark(field);
				event.stop();
			}.bind(this));
		}
		
		// drag & drop
		$(field.getCSSDragID()).addEvent('mousedown', function (event) {
            event.stop();
            if (event.rightClick) { return false; } // disable right click drag & drop

            var draggable = this.$dragDropHelper.createDraggable($(field.getCSSDragID()));
            var droppable = $$('div.cedent');
            var drag = this.$dragDropHelper.createDrag(draggable, droppable, {color: this.$colorHelper.getCedentBackgroundColor(), borderColor: this.$colorHelper.getCedentBorderColor(), highlightColor: this.$colorHelper.getCedentHighlightBackgroundColor(), highlightBorderColor: this.$colorHelper.getCedentHighlightBorderColor(), enterColor: this.$colorHelper.getCedentEnterBackgroundColor(), callback: function(element) { if (element !== $(cedent.getCSSID())) { element.fireEvent('addFieldAR', field); }}});

			drag.start(event);
            this.UIColorizer.tween(droppable, this.$colorHelper.getCedentHighlightBackgroundColor());
            this.UIColorizer.tween(droppable, this.$colorHelper.getCedentHighlightBorderColor(), 'border-color');
		}.bind(this));
	},

	registerFoundRuleEventHandlers: function(FR, autoSearch) {
		if (!autoSearch) { // ask background knowledge
			$(FR.getRule().getFoundRuleCSSBKID()).addEvent('click', function (e) {
				e.stop();
				this.ARBuilder.getFRManager().askBK(FR);
			}.bind(this));		
		}
		
		// mark
		$(FR.getRule().getFoundRuleCSSMarkID()).addEvent('click', function (event) {
			event.stop();
			this.ARBuilder.getFRManager().markFoundRule(FR);
		}.bind(this));
		
		// remove
		$(FR.getRule().getFoundRuleCSSRemoveID()).addEvent('click', function (event) {
			event.stop();
			this.ARBuilder.getFRManager().removeFoundRule(FR);
		}.bind(this));
	},
	
	registerMarkedRuleEventHandlers: function (FR) {
		$(FR.getRule().getMarkedRuleCSSRemoveID()).addEvent('click', function (event) {
			this.ARBuilder.getFRManager().removeMarkedRule(FR);
			event.stop();
		}.bind(this));
	}
	
});