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

  registerBRBaseEventHandler: function () {
    $('showBRBase').addEvent('click', function (event) {
      event.stop();
      this.ARBuilder.openBRBaseDialog();
    }.bind(this));
  },

  registerAttributeEventHandler: function (attribute, showEditAttribute, showRemoveAttribute) {
    // drag & drop
    $(attribute.getCSSID()).addEvent('mousedown', function (event) {
      event.stop();
      if (event.rightClick) {
        return false;
      } // disable right click drag & drop

      var draggable = this.$dragDropHelper.createDraggable($(attribute.getCSSID()));
      var droppable = $$('#active-rule div.cedent');
      var drag = this.$dragDropHelper.createDrag(draggable, droppable, {
        color: this.$colorHelper.getCedentBackgroundColor(),
        borderColor: this.$colorHelper.getCedentBorderColor(),
        highlightColor: this.$colorHelper.getCedentHighlightBackgroundColor(),
        highlightBorderColor: this.$colorHelper.getCedentHighlightBorderColor(),
        enterColor: this.$colorHelper.getCedentEnterBackgroundColor(),
        callback: function (element) {
          element.fireEvent('addAttribute', attribute);
        }
      });

      drag.start(event);
      this.UIColorizer.tween(droppable, this.$colorHelper.getCedentHighlightBackgroundColor());
      this.UIColorizer.tween(droppable, this.$colorHelper.getCedentHighlightBorderColor(), 'border-color');
    }.bind(this));

    $(attribute.getCSSAddID()).addEvent('click', function (event) {
      event.stop();
      //this.ARBuilder.getARManager().addAttributeToCedent(attribute);
      this.ARBuilder.openClickAddAttributeWindow(attribute);
    }.bind(this));

    if (showEditAttribute) { // edit
      $(attribute.getCSSEditID()).addEvent('click', function (event) {
        event.stop();
        this.ARBuilder.openEditAttributeWindow(attribute);
      }.bind(this));
    }

    if (showRemoveAttribute) { // remove
      $(attribute.getCSSRemoveID()).addEvent('click', function (event) {
        event.stop();
        this.ARBuilder.removeAttribute(attribute);
      }.bind(this));
    }

    // show histogram
    $(attribute.getCSSShowHistogramID()).addEvent('click', function (event) {
      event.stop();
      this.ARBuilder.openShowHistogramWindow(attribute.getName(), 'attribute');
    }.bind(this));
  },

  registerDataFieldEventHandler: function (field) {
    // drag & drop
    $(field.getCSSID()).addEvent('mousedown', function (event) {
      event.stop();
      if (event.rightClick) {
        return false;
      } // disable right click drag & drop

      var draggable = this.$dragDropHelper.createDraggable($(field.getCSSID()).getFirst('span'));
      var droppable = $('attributes');
      var drag = this.$dragDropHelper.createDrag(draggable, droppable, {
        color: this.$colorHelper.getAttributesBackgroundColor(),
        highlightColor: this.$colorHelper.getAttributesHighlightBackgroundColor(),
        enterColor: this.$colorHelper.getAttributesEnterBackgroundColor(),
        callback: function () {
          this.ARBuilder.openAddAttributeWindow(field);
        },
        scope: this
      });

      drag.start(event);
      this.UIColorizer.tween(droppable, this.$colorHelper.getAttributesHighlightBackgroundColor());
    }.bind(this));

    // add to attributes
    $(field.getCSSAddID()).addEvent('click', function (event) {
      event.stop();
      this.ARBuilder.openAddAttributeWindow(field);
    }.bind(this));

    // show histogram
    $(field.getCSSShowHistogramID()).addEvent('click', function (event) {
      event.stop();
      this.ARBuilder.openShowHistogramWindow(field.getName(), 'datafield');
    }.bind(this));
  },

  registerReportEventHandler: function (report) {
    $('report' + report.id).addEvent('click', function (event) {
      event.stop();
      this.ARBuilder.openReportWindow(report.id, report.name);
    }.bind(this));
  },

  registerFieldEventHandler: function (field) {
    $(field.getCSSID()).addEvent('mousedown', function (event) {
      event.stop();
      if (event.rightClick) {
        return false;
      } // disable right click drag & drop

      var draggable = this.$dragDropHelper.createDraggable($(field.getCSSID()));
      var droppable = $$('#active-rule div.cedent');
      var drag = this.$dragDropHelper.createDrag(draggable, droppable, {
        color: this.$colorHelper.getCedentBackgroundColor(),
        borderColor: this.$colorHelper.getCedentBorderColor(),
        highlightColor: this.$colorHelper.getCedentHighlightBackgroundColor(),
        highlightBorderColor: this.$colorHelper.getCedentHighlightBorderColor(),
        enterColor: this.$colorHelper.getCedentEnterBackgroundColor(),
        callback: function (element) {
          element.fireEvent('addField', field);
        }
      });

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
      var mineRulesConfirm=$('mine-rules-confirm');
      if (mineRulesConfirm){
        mineRulesConfirm.addEvent('click', function (event) {
          event.stop();
          this.ARBuilder.getARManager().mineRulesConfirm();
        }.bind(this));
      }
      var startMining=$('start-mining');
      if (startMining){
        startMining.addEvent('click', function (event) {
          event.stop();
          this.ARBuilder.getARManager().mineRulesConfirm();
        }.bind(this));
      }

    }
    if (this.ARBuilder.getARManager().miningInProgress()){
      // stop mining
      $('stop-mining').addEvent('click', function (event) {
        event.stop();
        this.ARBuilder.getMiningManager().stopMining();
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
    // vars used fot submit and change IM value
    var elementSelect = $(action + '-im-select');
    var validator = new IMValidator();

    // submit
    var elementSubmit = $(action + '-im-form').getElement('input[type=submit]');
    elementSubmit.addEvent('click', function (event) {
      event.stop();
      var IMName = elementSelect.options[elementSelect.selectedIndex].value;
      var IM = this.ARBuilder.getARManager().getIMPrototype(IMName);

      /*if (IM.getName() === 'SUPP') {
       var valid = true;
       } else {*/
      var valid = validator.validate(IM, action, this.ARBuilder.$i18n.translate('Invalid value'));
      //}

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

    // change IM value
    var elementInput = $(action + '-im-threshold-value');
    if (elementInput) {
      elementInput.addEvent('blur', function (e) {
        //e.stop();
        var IMName = elementSelect.options[elementSelect.selectedIndex].value;
        var IM = this.ARBuilder.getARManager().getIMPrototype(IMName);
        var valid = validator.validate(IM, action, this.ARBuilder.$i18n.translate('Invalid value'));
      }.bind(this));
    }
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
      var coefficientLocalizedName = elementSelect.options[elementSelect.selectedIndex].get('text');
      if (coefficientName === 'One category') {
        var coefficientCategory = $('add-coefficient-category').value;
        this.ARBuilder.getARManager().addCoefficient(field, coefficientName, coefficientLocalizedName, coefficientCategory);
      } else {
        var coefficientMinlength = $('add-coefficient-minlength').value;
        var coefficientMaxlength = $('add-coefficient-maxlength').value;
        this.ARBuilder.getARManager().addCoefficient(field, coefficientName, coefficientLocalizedName, coefficientMinlength, coefficientMaxlength);
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
      this.UIPainter.hideOverlay();
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
      var coefficientLocalizedName = elementSelect.options[elementSelect.selectedIndex].get('text');
      if (coefficientName === 'One category') {
        var coefficientCategory = $('edit-coefficient-category').value;
        this.ARBuilder.getARManager().editCoefficient(field, coefficientName, coefficientLocalizedName, coefficientCategory);
      } else {
        var coefficientMinlength = $('edit-coefficient-minlength').value;
        var coefficientMaxlength = $('edit-coefficient-maxlength').value;
        this.ARBuilder.getARManager().editCoefficient(field, coefficientName, coefficientLocalizedName, coefficientMinlength, coefficientMaxlength);
      }
      event.stop();
    }.bind(this));

    // change coefficient
    var elementSelect = $('edit-coefficient-select');
    elementSelect.addEvent('change', function (event) {
      event.stop();
      this.ARBuilder.getARManager().updateEditCoefficientAutocomplete(field, elementSelect.options[elementSelect.selectedIndex].value);
    }.bind(this));
  },

  registerClickAddAttributeFormEventHandler: function (field) {
    // submit
    var elementSubmit = $('click-add-attribute-form').getElement('input[type=submit]');
    elementSubmit.addEvent('click', function (event) {
      event.stop();
      var elementSelect = $('click-add-attribute-select');
      if (elementSelect) {
        var cedentName = elementSelect.options[elementSelect.selectedIndex].value;
        var cedent = (cedentName == 'antecedent') ? (this.ARBuilder.getARManager().getActiveRule().getAntecedent()) : (this.ARBuilder.getARManager().getActiveRule().getSuccedent());
        this.UIPainter.hideOverlay();
        this.ARBuilder.getARManager().addAttribute(cedent, field);
      }
    }.bind(this));
  },

  registerEditConnectiveFormEventHandler: function (cedent) {
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
      if (event.rightClick) {
        return false;
      } // disable right click drag & drop

      var draggable = this.$dragDropHelper.createDraggable($(field.getCSSDragID()));
      var droppable = $$('#active-rule div.cedent');
      var drag = this.$dragDropHelper.createDrag(draggable, droppable, {
        color: this.$colorHelper.getCedentBackgroundColor(),
        borderColor: this.$colorHelper.getCedentBorderColor(),
        highlightColor: this.$colorHelper.getCedentHighlightBackgroundColor(),
        highlightBorderColor: this.$colorHelper.getCedentHighlightBorderColor(),
        enterColor: this.$colorHelper.getCedentEnterBackgroundColor(),
        callback: function (element) {
          if (element !== $(cedent.getCSSID())) {
            element.fireEvent('addFieldAR', field);
          }
        }
      });

      drag.start(event);
      this.UIColorizer.tween(droppable, this.$colorHelper.getCedentHighlightBackgroundColor());
      this.UIColorizer.tween(droppable, this.$colorHelper.getCedentHighlightBorderColor(), 'border-color');
    }.bind(this));
  },

  registerFoundRuleEventHandlers: function (foundRule) {
    var el;
    var FRManager = this.ARBuilder.getFRManager();
    /*region checkbox*/
    var checkbox=$(foundRule.getCSSID()+'-checkbox');
    if (checkbox){
      checkbox.addEvent('click', function(){
        this.checkFoundRulesSelectedCheckboxes();
      }.bind(this));
    }
    /*endregion checkbox*/
    /*region mark*/
    var markLink = $(foundRule.getMarkCSSID());
    if (markLink) {
      markLink.addEvent('click', function (event) {
        event.stop();
        FRManager.markFoundRule(foundRule);
      }.bind(FRManager));
    }
    /*endregion mark*/
    /*region unmark*/
    var unmarkLink = $(foundRule.getUnmarkCSSID());
    if (unmarkLink) {
      unmarkLink.addEvent('click', function (event) {
        event.stop();
        FRManager.unmarkFoundRule(foundRule);
      }.bind(FRManager));
    }
    /*endregion unmark*/
    /*region details*/
    var detailsLink = $(foundRule.getDetailsCSSID());
    if (detailsLink) {
      detailsLink.addEvent('click', function (event) {
        event.stop();
        this.UIPainter.renderRuleDetailsDialog(foundRule.getTaskId(),foundRule.getId(true));
      }.bind(this));
    }
    /*endregion details*/
  },

  checkFoundRulesSelectedCheckboxes : function(){
    //function for checking of checkboxes selection
    var foundRulesRules=$('found-rules-rules');
    var multiControls=$('found-rules-multi-controls');
    var markAction=(foundRulesRules.getElements('.found-rule-checkbox:checked').length);
    var unmarkAction=(foundRulesRules.getElements('.selected .found-rule-checkbox:checked').length);
    markAction=((markAction-unmarkAction)>0);
    unmarkAction=(unmarkAction>0);

    if (markAction){
      multiControls.getElements('.actions .mark').addClass('visible');
    }else{
      multiControls.getElements('.actions .mark').removeClass('visible');
    }
    if (unmarkAction){
      multiControls.getElements('.actions .unmark').addClass('visible');
    }else{
      multiControls.getElements('.actions .unmark').removeClass('visible');
    }
  },

  getFoundRulesSelectedIds: function(){
    var selectedCheckboxes=$$('#found-rules-rules .found-rule-checkbox:checked');
    if (selectedCheckboxes.length>0){
      var result=[];
      Array.each(selectedCheckboxes,function(checkbox){
        result.push(checkbox.get('id'));
      }.bind(result))
    }
    return result;
  },

  registerFoundRulesEventHandlers: function(FRManager){
    var taskNameElement=$('found-rules-task-name');
    if (!taskNameElement){return;}
    var renameTaskLink=taskNameElement.getElements('.rename-task');
    var taskId=FRManager.getTaskId();
    var taskName=FRManager.getTaskName();
    renameTaskLink.addEvent('click',function(event){
      event.stop();
      this.ARBuilder.getARManager().openRenameTaskWindow(taskId,taskName);
    }.bind(this));
  },

  registerFoundRulesMultiControlsEventHandlers: function () {
    var multiControls = $('found-rules-multi-controls');
    if (multiControls){
      //events for multi-controls links

      multiControls.getElements('.all').addEvent('click',function(event){
        //select all checkboxes
        event.stop();
        $('found-rules-rules').getElements('.found-rule-checkbox').each(function(checkbox){
          checkbox.checked=true;
        });
        this.checkFoundRulesSelectedCheckboxes();
      }.bind(this));
      multiControls.getElements('.none').addEvent('click',function(event){
        //select all checkboxes
        event.stop();
        $('found-rules-rules').getElements('.found-rule-checkbox').each(function(checkbox){
          checkbox.checked=false;
        });
        this.checkFoundRulesSelectedCheckboxes();
      }.bind(this));
      multiControls.getElements('.invert').addEvent('click',function(event){
        //select all checkboxes
        event.stop();
        $('found-rules-rules').getElements('.found-rule-checkbox').each(function(checkbox){
          checkbox.checked=!checkbox.checked;
        });
        this.checkFoundRulesSelectedCheckboxes();
      }.bind(this));

      multiControls.getElements('.actions .mark').addEvent('click',function(event){
        event.stop();
        var selectedFoundRulesIds = [];
        var FRManager = this.ARBuilder.getFRManager();
        FRManager.multiMarkFoundRules(this.getFoundRulesSelectedIds());
        $('found-rules-rules').getElements('.found-rule-checkbox').each(function(checkbox){
          checkbox.checked=false;
        });
        this.checkFoundRulesSelectedCheckboxes();
      }.bind(this));

      multiControls.getElements('.actions .unmark').addEvent('click',function(event){
        event.stop();
        var FRManager = this.ARBuilder.getFRManager();
        FRManager.multiUnmarkFoundRules(this.getFoundRulesSelectedIds());
        $('found-rules-rules').getElements('.found-rule-checkbox').each(function(checkbox){
          checkbox.checked=false;
        });
        this.checkFoundRulesSelectedCheckboxes();
      }.bind(this));

      this.checkFoundRulesSelectedCheckboxes();
    }
  },

  registerMarkedRuleEventHandlers: function (FR) {
    var me = this;

    $(FR.getRule().getMarkedRuleCSSRemoveID()).addEvent('click', function (event) {
      me.ARBuilder.getFRManager().removeMarkedRule(FR);
      event.stop();
    });
  },

  registerMarkedRulesTaskEventHandlers: function (taskId) {
    var me = this;

    $('createReport-' + taskId).addEvent('click', function (event) {
      event.stop();
      me.ARBuilder.createReport(taskId);
    });

    $('exportBusinessRules-' + taskId).addEvent('click', function (event) {
      event.stop();
      //me.ARBuilder.openExportBusinessRulesDialog(taskId);
      me.ARBuilder.exportRulesToBRBase(taskId);//TODO standa
    });

    $('modelTester-' + taskId).addEvent('click', function (event) {
      event.stop();
      me.ARBuilder.openModelTesterDialog(taskId);
    });

    // Task renaming
    $('rename-task-' + taskId).addEvent('click', function (event) {
      event.stop();
      me.ARBuilder.getARManager().openRenameTaskWindow(taskId);
    });
  },

  registerTaskRenameEventHandlers: function () {
    // Submit (rename)
    $$('#rename-task-form input[type=submit]').addEvent('click', function (e) {
      e.stop();

      var newTaskName = $('rename-task-input')
        .value
        .trim();
      var taskId = $('rename-task-id').value;

      // Check that the name is valid
      if (newTaskName.trim().length == 0) {
        this.ARBuilder.getARManager().displayError(
          'rename-task-input',
          'rename-task-error',
          this.ARBuilder.$i18n.translate('Please enter a valid task name.')
        );
        return;
      }

      // Proceed with renaming
      this.ARBuilder.getARManager().renameTask(taskId, newTaskName);
      this.UIPainter.hideOverlay();

    }.bind(this));
  },

  registerOverlayEventHandlers: function () {
    // Close window (cancel)
    $('overlay-close').addEvent('click', function (e) {
      e.stop();
      this.UIPainter.hideOverlay();
    }.bind(this));
  }
});