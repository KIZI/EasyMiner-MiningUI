var UIListener = new Class({
	
	ARBuilder: null,
	ARManager: null,
	FRManager: null,
	UIColorizer: null,
	UIPainter: null,
	
	initialize: function (ARBuilder, ARManager, FRManager, UIColorizer) {
		this.ARBuilder = ARBuilder;
		this.ARManager = ARManager;
		this.FRManager = FRManager;
		this.UIColorizer = UIColorizer;
	},
	
	setUIPainter: function (UIPainter) {
		this.UIPainter = UIPainter;
	},
	
	registerSettingsEventHandlers: function () {
		$('settings-open').addEvent('click', function (event) {
			event.stop();
			this.ARBuilder.openSettingsWindow();
		}.bind(this));
	},
	
	registerSettingsWindowEventHandlers: function (ASPossible) {
		// change FL
		var elSelect = $('fl-select');
		elSelect.addEvent('change', function (e) {
			e.stop();
			var FLName = elSelect.options[elSelect.selectedIndex].value;
			this.ARBuilder.updateSettingsWindow(FLName);
		}.bind(this));
		
		// change autoFilter
		var elAutoFilter = $('autofilter');
		elAutoFilter.addEvent('click', function (e) {
			e.stop();
			this.ARBuilder.changeSettingsAutoFilter(elAutoFilter);
		}.bind(this));
		
		// change attribute suggestion
		if (ASPossible) {
			var elAS = $('as');
			elAS.addEvent('click', function (e) {
				e.stop();
				this.ARBuilder.changeSettingsAS(elAS);
			}.bind(this));
		}
		
		// save
		var elSubmit = $('settings-form').getElement('input[type=submit]');
		elSubmit.removeEvent('click');
		elSubmit.addEvent('click', function (e) {
			e.stop();
			var elRulesCnt = $('rules-cnt'); if (!elRulesCnt) { return; } // TODO odprasit
			var rulesCnt = $('rules-cnt').value;
			var elSelect = $('fl-select');
			var FLName = elSelect.options[elSelect.selectedIndex].value;
			var autoSearch = $('autofilter').hasClass('autofilter-on');
			var autoSuggest = $('as').hasClass('autosuggest-on');
			
			this.ARBuilder.saveSettings(rulesCnt, FLName, autoSearch, autoSuggest);
			
		}.bind(this));
		
		// close
		var elClose = $('settings-close');
		elClose.addEvent('click', function (e) {
			this.ARBuilder.closeSettingsWindow();
			e.stop();
		}.bind(this));
	},
	
	registerNavigationEventHandlers: function () {
		var elAttrDropdown = $$('#attributes a.dropdown')[0];
		elAttrDropdown.addEvent('click', function (event) {
			event.stop();
			var elAttrToggle = $$('#attributes > div')[0];
			elAttrToggle.toggle();
		}.bind(this));
		
		if (this.ARManager.getAttributesByGroup()) {
			// attributes by list
			$('attributes-by-list').addEvent('click', function (event) {
				event.stop();
				this.ARManager.displayAttributesByList();
			}.bind(this));
		} else {
			// attributes by group
			$('attributes-by-group').addEvent('click', function (event) {
				this.ARManager.displayAttributesByGroup();
				event.stop();
			}.bind(this));
		}
	},
	
	registerAttributeEventHandler: function (attribute) {
		$(attribute.getCSSID()).addEvent('mousedown', function (event) {
			event.stop();
			
			// disable right click drag & drop
			if (event.rightClick) {
				return false;
			}
			
			var draggedAttribute = $(attribute.getCSSID());
			var clone = draggedAttribute.clone().setStyles(draggedAttribute.getCoordinates()).setStyles({
					opacity: 0.7,
					position: 'absolute'
			    }).inject(document.body);
			
		    var drag = new Drag.Move(clone, {
		        droppables: $$('div.cedent'),

		        onDrop: function (dragging, cedent) {
		        	dragging.destroy();
		        	if (cedent !== null) {
		        		cedent.fireEvent('addAttribute', attribute);
		        		this.UIColorizer.cedentDragDrop(cedent);
		        	}
		        }.bind(this),
		        
		        onEnter: function (dragging, cedent) {
		        	this.UIColorizer.cedentDragEnter(cedent);
		        }.bind(this),
		        
		        onLeave: function (dragging, cedent) {
		        	this.UIColorizer.cedentDragLeave(cedent);
		        }.bind(this),
		        
		        onCancel: function (dragging) {
		        	dragging.destroy();
		        }
		    });
		    
		    drag.start(event);
		    
		}.bind(this));
	},
	
	registerFieldEventHandler: function (field) {
		$(field.getCSSID()).addEvent('mousedown', function (event) {
			event.stop();
			
			// disable right click drag & drop
			if (event.rightClick) {
				return false;
			}
			
			var draggedField = $(field.getCSSID());
			var clone = draggedField.clone().setStyles(draggedField.getCoordinates()).setStyles({
				opacity: 0.7,
				position: 'absolute'
		    }).inject(document.body);

		    var drag = new Drag.Move(clone, {
		        droppables: $$('div.cedent'),

		        onDrop: function (dragging, elementCedent) {
		        	dragging.destroy();
		        	if (elementCedent !== null) {
		        		elementCedent.fireEvent('addField', field);
		        		this.UIColorizer.cedentDragDrop(elementCedent);
		        	}
		        }.bind(this),
		        
		        onEnter: function (dragging, elementCedent) {
		        	this.UIColorizer.cedentDragEnter(elementCedent);
		        }.bind(this),
		        
		        onLeave: function (dragging, elementCedent) {
		        	this.UIColorizer.cedentDragLeave(elementCedent);
		        }.bind(this),
		        
		        onCancel: function (dragging) {
		        	dragging.destroy();
		        }
		    });
			
			drag.start(event);
			
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
		        		this.UIColorizer.cedentDragDrop(elementCedent);
		        	}
		        }.bind(this),
		        
		        onEnter: function (dragging, elementCedent) {
		        	this.UIColorizer.cedentDragEnter(elementCedent);
		        }.bind(this),
		        
		        onLeave: function (dragging, elementCedent) {
		        	this.UIColorizer.cedentDragLeave(elementCedent);
		        }.bind(this),
		        
		        onCancel: function (dragging) {
		        	dragging.destroy();
		        }
		    });
			
			drag.start(event);
			
		}.bind(this));
	},
	
	registerMarkedRuleEventHandlers: function (rule) {
		$(rule.getMarkedRuleCSSRemoveID()).addEvent('click', function (event) {
			this.FRManager.removeMarkedRule(rule);
			event.stop();
		}.bind(this));
	},

	registerActiveRuleEventHandlers: function (rule) {
		if (this.ARManager.hasPossibleIMs()) {
			// open add IM window
			$('add-im').addEvent('click', function (event) {
				event.stop();
				this.ARManager.openAddIMWindow();
			}.bind(this));
		}
		
		if (this.ARManager.display4ftTaskBox()) {
			$('mine-rules-confirm').addEvent('click', function (event) {
				event.stop();
				this.ARManager.mineRulesConfirm();
			}.bind(this));
		}
		
		if (this.ARManager.displayETreeTaskBox()) {
			$('recommend-attributes-confirm').addEvent('click', function (event) {
				event.stop();
				this.ARManager.recommendAttributesConfirm();
			}.bind(this));
		}
	},
	
	registerIMEventHandler: function (IM) {
		// edit
		$(IM.getCSSEditID()).addEvent('click', function (e) {
			e.stop();
			this.ARManager.openEditIMWindow(IM);
		}.bind(this));
		
		// remove
		$(IM.getCSSRemoveID()).addEvent('click', function (e) {
			e.stop();
			this.ARManager.removeIM(IM);
		}.bind(this));
	},
	
	registerIMFormEventHandler: function (action) {
		// submit
		var elementSubmit = $(action + '-im-form').getElement('input[type=submit]');
		elementSubmit.addEvent('click', function (event) {
			event.stop();
			var elementSelect = $(action + '-im-select');
			var IMName = elementSelect.options[elementSelect.selectedIndex].value;
			var IM = this.ARManager.getIMPrototype(IMName);

			var validator = new IMValidator();
			var valid = validator.validate(IM, action);
			if (valid) {
				var thresholdValue = IM.hasThreshold() ? $(action + '-im-threshold-value').value : null;
				var alphaValue = IM.hasAlpha() ? $(action + '-im-alpha-value').value : null;
				if (action === 'add') {
					var IM = this.ARManager.addIM(IM, thresholdValue, alphaValue);
				} else {
					var IM = this.ARManager.editIM(IM, thresholdValue, alphaValue);
				}
			}
		}.bind(this));
		
		// change IM
		var elementSelect = $(action + '-im-select');
		elementSelect.addEvent('change', function (e) {
			e.stop();
			var IMName = elementSelect.options[elementSelect.selectedIndex].value;
			var IM = this.ARManager.getIMPrototype(IMName);
			this.UIPainter.renderIMAutocomplete(action, IM);
		}.bind(this));
		
		// close
		var elementClose = $(action + '-im-close');
		elementClose.addEvent('click', function (event) {
			this.ARManager.closeIMWindow();
			event.stop();
		}.bind(this));
	},
	
	registerCedentEventHandlers: function (cedent, rule) {
		// add attribute (fired by drag & drop)
		$(cedent.getCSSID()).addEvent('addAttribute', function (attribute) {
			this.ARManager.addAttribute(cedent, attribute);
		}.bind(this));
		
		// add preset field (fired by drag & drop)
		$(cedent.getCSSID()).addEvent('addField', function (field) {
			this.ARManager.addField(field, cedent);
		}.bind(this));
		
		// add preset field group
		$(cedent.getCSSID()).addEvent('addFieldGroup', function (FG) {
			this.ARManager.addFieldGroup(FG, cedent);
		}.bind(this));
		
		// add field (fired by drag & drop)
		$(cedent.getCSSID()).addEvent('addFieldAR', function (field) {
			this.ARManager.addFieldAR(field, cedent);
		}.bind(this));
		
		// edit connective
		var elCons = $$('#' + cedent.getCSSID() + ' a.edit-connective');
		Array.each(elCons, function (elCon) {
			elCon.addEvent('click', function (e) {
				e.stop();
				// TODO called twice, how to stop propagation???
				if (!$('edit-connective-window')) {
					this.ARManager.openEditConnectiveWindow(cedent);
				}
			}.bind(this));
		}.bind(this));
		
		// change cedent sign
		if (cedent.displayChangeSign()) {
			$(cedent.getCSSChangeSignID()).addEvent('click', function (event) {
				this.ARManager.changeCedentSign(cedent);
				event.stop();
			}.bind(this));
		}
		
		// group fields option
		if (rule.getGroupFields() && cedent.displayGroupButton()) {
			// group fields confirm
			$(cedent.getCSSGroupFieldsConfirmID()).addEvent('click', function (event) {
				this.ARManager.groupFields(cedent);
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
				this.ARManager.addCoefficient(field, coefficientName, coefficientCategory);
			} else {
				var coefficientMinlength = $('add-coefficient-minlength').value;
				var coefficientMaxlength = $('add-coefficient-maxlength').value;
				this.ARManager.addCoefficient(field, coefficientName, coefficientMinlength, coefficientMaxlength);
			}
			event.stop();
		}.bind(this));
		
		// change coefficient
		var elementSelect = $('add-coefficient-select');
		elementSelect.addEvent('change', function (event) {
			event.stop();
			this.ARManager.updateAddCoefficientAutocomplete(field, elementSelect.options[elementSelect.selectedIndex].value);
		}.bind(this));
		
		// close
		var elementClose = $('add-coefficient-close');
		elementClose.addEvent('click', function (event) {
			this.ARManager.closeAddCoefficientWindow();
			this.ARManager.removeField(field);
			event.stop();
		}.bind(this));
	},
	
	registerEditCoefficientEventHandler: function (field) {
		$(field.getEditCoefficientCSSID()).addEvent('click', function (event) {
			this.ARManager.openEditCoefficientWindow(field);
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
				this.ARManager.editCoefficient(field, coefficientName, coefficientCategory);
			} else {
				var coefficientMinlength = $('edit-coefficient-minlength').value;
				var coefficientMaxlength = $('edit-coefficient-maxlength').value;
				this.ARManager.editCoefficient(field, coefficientName, coefficientMinlength, coefficientMaxlength);
			}
			event.stop();
		}.bind(this));
		
		// change coefficient
		var elementSelect = $('edit-coefficient-select');
		elementSelect.addEvent('change', function (event) {
			event.stop();
			this.ARManager.updateEditCoefficientAutocomplete(field, elementSelect.options[elementSelect.selectedIndex].value)
		}.bind(this));
		
		// close
		var elementClose = $('edit-coefficient-close');
		elementClose.addEvent('click', function (event) {
			this.ARManager.closeEditCoefficientWindow();
			event.stop();
		}.bind(this));
	},
	
	registerEditConnectiveFormEventHandler: function(cedent) {
		// submit
		var elementSubmit = $('edit-connective-form').getElement('input[type=submit]');
		elementSubmit.addEvent('click', function (event) {
			var elementSelect = $('edit-connective-select');
			var connectiveName = elementSelect.options[elementSelect.selectedIndex].value;
			this.ARManager.editConnective(cedent, connectiveName);
			event.stop();
		}.bind(this));
		
		// close
		var elementClose = $('edit-connective-close');
		elementClose.addEvent('click', function (event) {
			this.ARManager.closeEditConnectiveWindow();
			event.stop();
		}.bind(this));
	},
	
	registerFieldAREventHandlers: function (field, cedent) {
		// remove field
		var elementField = $(field.getCSSRemoveID());
		elementField.addEvent('click', function (event) {
			this.ARManager.removeField(field);
			event.stop();
		}.bind(this));
		
		// change field sign
		$(field.getCSSChangeSignID()).addEvent('click', function (event) {
			this.ARManager.changeFieldSign(field);
			event.stop();
		}.bind(this));
		
		var elMark = $(field.getCSSMarkID());
		if (cedent.getNumLiteralRefs() > 1 && elMark) {
			// mark / unmark rule
			elMark.addEvent('click', function (event) {
				this.ARManager.changeMark(field);
				event.stop();
			}.bind(this));
		}
		
		// drag & drop
		$(field.getCSSDragID()).addEvent('mousedown', function (event) {
			event.stop();
			
			// disable right click drag & drop
			if (event.rightClick) {
				return false;
			}
			
			var draggedField = $(field.getCSSDragID());
			var clone = draggedField.clone().setStyles(draggedField.getCoordinates()).setStyles({
				opacity: 0.7,
				position: 'absolute'
			}).inject(document.body);
			
		    var drag = new Drag.Move(clone, {
		    	droppables: $$('div.cedent'),
		        //droppables: $$('div.cedent:not(div#' + cedent.getCSSID() + ')'),
	
		        onDrop: function (dragging, elementCedent) {
		        	dragging.destroy();
		        	if (elementCedent === $(cedent.getCSSID())) { return; };
		        	
		        	if (elementCedent !== null) {
		        		elementCedent.fireEvent('addFieldAR', field);
		        		this.UIColorizer.cedentDragDrop(elementCedent);
		        	}
		        }.bind(this),
		        
		        onEnter: function (dragging, elementCedent) {
		        	if (elementCedent === $(cedent.getCSSID())) { return; };
		        	this.UIColorizer.cedentDragEnter(elementCedent);
		        }.bind(this),
		        
		        onLeave: function (dragging, elementCedent) {
		        	if (elementCedent === $(cedent.getCSSID())) { return; };
		        	this.UIColorizer.cedentDragLeave(elementCedent);
		        }.bind(this),
		        
		        onCancel: function (dragging) {
		        	dragging.destroy();
		        }
		    });
			
			drag.start(event);
		}.bind(this));
	},
	
	registerFoundRuleEventHandlers: function(FR, autoSearch) {
		if (!autoSearch) { // ask background knowledge
			$(FR.getRule().getFoundRuleCSSBKID()).addEvent('click', function (e) {
				e.stop();
				this.FRManager.askBK(FR);
			}.bind(this));		
		}
		
		// mark
		$(FR.getRule().getFoundRuleCSSMarkID()).addEvent('click', function (event) {
			event.stop();
			this.FRManager.markFoundRule(FR);
		}.bind(this));
		
		// remove
		$(FR.getRule().getFoundRuleCSSRemoveID()).addEvent('click', function (event) {
			event.stop();
			this.FRManager.removeFoundRule(FR);
		}.bind(this));
		
		// clear
		$('pager-clear').addEvent('click', function (e) {
			e.stop();
			this.FRManager.clearFoundRules();
		}.bind(this));
	},
	
	registerMarkedRulesEventHandlers: function () {
		var elDropdown = $$('#marked-rules a.dropdown')[0];
		elDropdown.addEvent('click', function (event) {
			event.stop();
			
			var elToggle = $$('#marked-rules > div')[0];
			elToggle.toggle();
		}.bind(this));
	}
	
});