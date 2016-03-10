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

  registerBRBaseEventHandler: function () {//TODO???
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
      droppable.setStyle('background-color', this.$colorHelper.getCedentHighlightBackgroundColor());
      droppable.setStyle('border-color', this.$colorHelper.getCedentHighlightBorderColor());
      //this.UIColorizer.tween(droppable, this.$colorHelper.getCedentHighlightBackgroundColor());
      //this.UIColorizer.tween(droppable, this.$colorHelper.getCedentHighlightBorderColor(), 'border-color');
    }.bind(this));

    // change checkbox status
    $(attribute.getCSSCheckboxID()).addEvent('click', function (event) {
      this.checkAttributesSelectedCheckboxes();
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
      this.ARBuilder.openShowHistogramWindow(attribute.getId(), 'attribute');
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
      droppable.setStyle('background-color', this.$colorHelper.getAttributesHighlightBackgroundColor());
      //this.UIColorizer.tween(droppable, this.$colorHelper.getAttributesHighlightBackgroundColor());
    }.bind(this));

    // change checkbox status
    $(field.getCSSCheckboxID()).addEvent('click', function (event) {
      this.checkDataFieldsSelectedCheckboxes();
    }.bind(this));

    // add to attributes
    $(field.getCSSAddID()).addEvent('click', function (event) {
      event.stop();
      this.ARBuilder.openAddAttributeWindow(field);
    }.bind(this));

    // show histogram
    $(field.getCSSShowHistogramID()).addEvent('click', function (event) {
      event.stop();
      this.ARBuilder.openShowHistogramWindow(field.getId(), 'field');
    }.bind(this));
  },

  checkAttributesSelectedCheckboxes : function(){
    //function for checking of checkboxes selection
    var attributesBox = $('attributes'),
        selectedAttributes = attributesBox.getElements('.attribute-checkbox:checked').length,
        linkAddSelected = attributesBox.getElements('#add-selected-attributes'),
        linkAddUnused = attributesBox.getElements('#add-all-unused-attributes');
    if (selectedAttributes > 0){
      linkAddSelected.show();
      attributesBox.addClass('with-checkboxes-actions');
      linkAddUnused.hide();
    }else{
      linkAddSelected.hide();
      attributesBox.removeClass('with-checkboxes-actions');
      this.ARBuilder.UIPainter.showAddAllUnusedAttributesLink();
    }
  },

  checkDataFieldsSelectedCheckboxes : function(){
    //function for checking of checkboxes selection
    var dataFieldsBox = $('data-fields'),
        selectedDataFields = dataFieldsBox.getElements('.data-field-checkbox:checked').length,
        linkAddSelected = dataFieldsBox.getElements('#add-selected-data-fields');
    if (selectedDataFields > 0){
      dataFieldsBox.addClass('with-checkboxes-actions');
      linkAddSelected.show();
    }else{
      dataFieldsBox.removeClass('with-checkboxes-actions');
      linkAddSelected.hide();
    }
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
      droppable.setStyle('background-color', this.$colorHelper.getCedentHighlightBackgroundColor());
      droppable.setStyle('border-color', this.$colorHelper.getCedentHighlightBorderColor());
      //this.UIColorizer.tween(droppable, this.$colorHelper.getCedentHighlightBackgroundColor());
      //this.UIColorizer.tween(droppable, this.$colorHelper.getCedentHighlightBorderColor(), 'border-color');
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
      var startMiningWithPruning=$('start-mining-with-pruning');
      if (startMiningWithPruning){
        startMiningWithPruning.addEvent('click', function (event) {
          this.ARBuilder.getARManager().enableRulePruning(startMiningWithPruning.checked);
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

    $('empty-antecedent').addEvent('click', function (event) {
      event.stop();
      this.ARBuilder.getARManager().getActiveRule().getAntecedent().emptyCedent();
      this.UIPainter.renderActiveRule();
      this.ARBuilder.getARManager().sortAttributes();
    }.bind(this));

    $('empty-succedent').addEvent('click', function (event) {
      event.stop();
      this.ARBuilder.getARManager().getActiveRule().getSuccedent().emptyCedent();
      this.UIPainter.renderActiveRule();
      this.ARBuilder.getARManager().sortAttributes();
    }.bind(this));
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

    // group fields option
    if (rule.getGroupFields() && cedent.displayGroupButton()) {
      // group fields confirm
      $(cedent.getCSSGroupFieldsConfirmID()).addEvent('click', function (event) {
        this.ARBuilder.getARManager().groupFields(cedent);
        event.stop();
      }.bind(this));
    }
  },

    registerCedentConnectiveEventHandlers: function (cedent) {
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

    // Close window on click outside of overlay content
    $('overlay-inner').addEvent('mousedown', function(e){
      if(e.target.id === 'overlay-inner'){
        if($('overlay-inner').getElement('#add-coefficient-close') != null){
          $('overlay-inner').getElement('#add-coefficient-close').click();
        }
      }
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

        var ARManager = this.ARBuilder.getARManager();
        if(typeOf(field) === 'array'){
          Array.each(field, function (fieldName) {
            //automatické přidání všech vybraných atributů do vybraného hlavního cedentu
            var activeRule= ARManager.getActiveRule();
            var attributeNameFilter=this.ARBuilder.attributesFilter.prepareTestRegExp();
            var attribute = this.ARBuilder.getDD().getAttributeByName(fieldName);
            //povolujeme atribut na obou stranách pravidla... if (activeRule.isAttributeUsed(attribute)){return;/*atribut je už použit*/}
            if (!attributeNameFilter.test(fieldName)){return;/*jméno atributu neodpovídá aktivnímu filtru*/}
            if ((attribute.isHidden())){return;/*jde o skrytý atribut*/}
            ARManager.addAttributeToCedent(attribute, cedent);
          }.bind(this));
        }else if(this.ARBuilder.getConfig().getAutoShowAttributeBinningDialog()){
          ARManager.addAttributeToCedent(field, cedent);
        }else{
          ARManager.addAttribute(cedent, field);
        }

      }
    }.bind(this));

    // enter submit
    var elementSelect = $('click-add-attribute-form');
    elementSelect.addEvent('keydown', function(event){
      if(event.key == 'enter'){
        event.preventDefault();
        elementSubmit.click();
      }
    });
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

  registerAddRulesetFormEventHandler: function () {
    // reset
    var elementStorno = $('add-ruleset-storno');
    elementStorno.addEvent('click', function (event) {
      event.stop();
      this.UIPainter.removeAddRulesetForm();
      //this.UIPainter.$UIStructurePainter.resizeApplication();
    }.bind(this));
    // submit
    var elementSubmit = $('add-ruleset-submit');
    elementSubmit.addEvent('click', function (event) {
      event.stop();
      var rulesetName = $('add-ruleset-name').value,
          rulesetDesc = $('add-ruleset-description').value;
      if(rulesetName.length > 0){
        var url = this.ARBuilder.$config.getKnowledgeBaseAddRuleSetUrl(rulesetName,rulesetDesc),
            errorMsg = this.ARBuilder.$i18n.translate('Unable to add new ruleset! Try it again later.');

        //region vložení nového rulesetu
        new Request.JSON({
          url: url,
          secure: true,
          onSuccess: function (responseJSON, responseText) {
            this.ARBuilder.$MRManager.loadKnowledgeBase(responseJSON.rule_set_id);
            this.UIPainter.hideOverlay();
          }.bind(this),
          onError: function () {
            alert(errorMsg);
          }.bind(this),
          onFailure: function () {
            alert(errorMsg);
          }.bind(this),
          onException: function () {
            alert(errorMsg);
          }.bind(this),
          onTimeout: function () {
            alert(errorMsg);
          }.bind(this)
        }).get();
        //endregion
      } else{
        alert(this.ARBuilder.$i18n.translate('Name is required!'));
      }
    }.bind(this));
  },

  registerChangeRulesetEventHandler: function () {
    // click on current ruleset
    $('current-ruleset').getElement('a').addEvent('click', function (event) {
      event.stop();
      this.UIPainter.hideOverlay();
    }.bind(this));
    // click on other ruleset
    var elements = $('change-ruleset-list').getElements('a');
    elements.addEvent('click', function (event) {
      event.stop();
      var elm = event.target,
          elmId = elm.get('rel');
      if(elmId != null){
        var url = this.ARBuilder.$config.getKnowledgeBaseSetMinerRuleSetUrl(elmId),
            errorMsg = this.ARBuilder.$i18n.translate('Unable to change ruleset! Try it again later.');

        //region uložení rulesetu pro aktuální miner
        new Request.JSON({
          url: url,
          secure: true,
          onSuccess: function (responseJSON, responseText) {
            this.ARBuilder.$MRManager.loadKnowledgeBase(elmId);
          }.bind(this),
          onError: function () {
            alert(errorMsg);
          }.bind(this),
          onFailure: function () {
            alert(errorMsg);
          }.bind(this),
          onException: function () {
            alert(errorMsg);
          }.bind(this),
          onTimeout: function () {
            alert(errorMsg);
          }.bind(this)
        }).get();
        //endregion
        this.UIPainter.hideOverlay();
      }
    }.bind(this));
    // submit
    var elementSubmit = $('add-ruleset');
    elementSubmit.addEvent('click', function (event) {
      event.stop();
      this.UIPainter.renderAddRulesetForm();
      this.UIPainter.$UIStructurePainter.resizeApplication();
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
      // drag&drop between rules cedents
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
      droppable.setStyle('background-color', this.$colorHelper.getCedentHighlightBackgroundColor());
      droppable.setStyle('border-color', this.$colorHelper.getCedentHighlightBorderColor());
      //this.UIColorizer.tween(droppable, this.$colorHelper.getCedentHighlightBackgroundColor());
      //this.UIColorizer.tween(droppable, this.$colorHelper.getCedentHighlightBorderColor(), 'border-color');

      var ARManager = this.ARBuilder.getARManager();
      var attributes = $('attributes');
      // field can be dropped to palette to remove it
      var dragA = this.$dragDropHelper.createDrag(draggable, attributes, {
        color: this.$colorHelper.getAttributesBackgroundColor(),
        highlightColor: this.$colorHelper.getAttributesHighlightBackgroundColor(),
        enterColor: this.$colorHelper.getAttributesEnterBackgroundColor(),
        callback: function (element) {
          ARManager.removeField(field);
        }
      });

      dragA.start(event);
      attributes.setStyle('background-color', this.$colorHelper.getAttributesHighlightBackgroundColor());
      //this.UIColorizer.tween(attributes, this.$colorHelper.getAttributesHighlightBackgroundColor());
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
    /*region knowledge base*/
    var kbAddPositiveLink = $(foundRule.getKBAddPositiveCSSID());
    if (kbAddPositiveLink) {
      if (kbAddPositiveLink.hasClass("kbAddPositive")){
        kbAddPositiveLink.addEvent('click', function (event) {
          event.stop();
          FRManager.kbAddRule(foundRule,"positive");
        }.bind(FRManager));
      }else{
        kbAddPositiveLink.addEvent('click', function (event) {
          event.stop();
          FRManager.kbRemoveRule(foundRule);
        }.bind(FRManager));
      }
    }
    var kbAddNegativeLink = $(foundRule.getKBAddNegativeCSSID());
    if (kbAddNegativeLink) {
      if (kbAddNegativeLink.hasClass("kbAddNegative")){
        kbAddNegativeLink.addEvent('click', function (event) {
          event.stop();
          FRManager.kbAddRule(foundRule,"negative");
        }.bind(FRManager));
      }else{
        kbAddNegativeLink.addEvent('click', function (event) {
          event.stop();
          FRManager.kbRemoveRule(foundRule);
        }.bind(FRManager));
      }
    }
    /*endregion knowledge base*/
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
    var kbAddPositiveAction=(foundRulesRules.getElements('.KBpositive .found-rule-checkbox:checked').length);
    var kbAddNegativeAction=(foundRulesRules.getElements('.KBnegative .found-rule-checkbox:checked').length);
    kbAddPositiveAction=((markAction-kbAddPositiveAction)>0);
    kbAddNegativeAction=((markAction-kbAddNegativeAction)>0);
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
    if (kbAddPositiveAction){
      multiControls.getElements('.actions .kbAddPositive').addClass('visible');
    }else{
      multiControls.getElements('.actions .kbAddPositive').removeClass('visible');
    }
    if (kbAddNegativeAction){
      multiControls.getElements('.actions .kbAddNegative').addClass('visible');
    }else{
      multiControls.getElements('.actions .kbAddNegative').removeClass('visible');
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
    var //controls = $$('.found-rules-controls')[0],
        multiControls = $('found-rules-multi-controls');

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
        //unselect all checkboxes
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


      multiControls.getElements('.actions .kbAddPositive').addEvent('click',function(event){
        event.stop();
        var FRManager = this.ARBuilder.getFRManager();
        FRManager.multiKBAddRules(this.getFoundRulesSelectedIds(),'positive');
        $('found-rules-rules').getElements('.found-rule-checkbox').each(function(checkbox){
          checkbox.checked=false;
        });
        this.checkFoundRulesSelectedCheckboxes();
      }.bind(this));

      multiControls.getElements('.actions .kbAddNegative').addEvent('click',function(event){
        event.stop();
        var FRManager = this.ARBuilder.getFRManager();
        FRManager.multiKBAddRules(this.getFoundRulesSelectedIds(),'negative');
        $('found-rules-rules').getElements('.found-rule-checkbox').each(function(checkbox){
          checkbox.checked=false;
        });
        this.checkFoundRulesSelectedCheckboxes();
      }.bind(this));

      multiControls.getElements('.task-actions .mark-all').addEvent('click',function(event){
        event.stop();
        //odkaz není aktivní
        if (event.target.hasClass('disabled')){return;}
        //odkaz je aktivní, pokračujeme ve zpracování
        var FRManager = this.ARBuilder.getFRManager();
        FRManager.markAllFoundRules();
        $('found-rules-rules').getElements('.found-rule-checkbox').each(function(checkbox){
          checkbox.checked=false;
        });
        this.checkFoundRulesSelectedCheckboxes();
      }.bind(this));

      multiControls.getElements('.task-actions .task-details').addEvent('click',function(event){
        event.stop();
        //odkaz není aktivní
        if (event.target.hasClass('disabled')){alert('ne');return;}
        //odkaz je aktivní, pokračujeme ve zpracování
        var FRManager = this.ARBuilder.getFRManager();
        var reportManager = this.ARBuilder.getReportManager();
        reportManager.showTaskDetails(FRManager.getTaskId());
      }.bind(this));

      multiControls.getElements('.task-actions .task-export').addEvent('click',function(event){
        event.stop();
        //odkaz není aktivní
        if (event.target.hasClass('disabled')){return;}
        //odkaz je aktivní, pokračujeme ve zpracování
        var FRManager = this.ARBuilder.getFRManager();
        var reportManager = this.ARBuilder.getReportManager();
        this.UIPainter.renderExportWindow(FRManager.getTaskId(),'discovered',FRManager.miningInProgress,FRManager.importInProgress);
      }.bind(this));

      this.checkFoundRulesSelectedCheckboxes();
    }
  },

  /*
  registerMarkedRuleEventHandlers: function (FR) {
    var me = this;

    $(FR.getRule().getMarkedRuleCSSRemoveID()).addEvent('click', function (event) {
      me.ARBuilder.getFRManager().removeMarkedRule(FR);
      event.stop();
    });
  },*/

  // same as registerFoundRulesEventHandlers, only ids differences TODO merge
  registerMarkedRulesEventHandlers: function(task){
    var taskElm = $('task-'+task.id),
        taskNameElement = taskElm.getElement('.marked-rules-task-name');
    if (!taskNameElement){return;}
    var renameTaskLink = taskNameElement.getElements('.rename-task'),
        removeTaskLink = taskNameElement.getElements('.remove-task');
    renameTaskLink.addEvent('click',function(event){
      event.stop();
      if(task.isBase){
        this.UIPainter.renderRenameRulesetWindow(task.id,task.name,task.desc);
      } else{
        this.UIPainter.renderRenameTaskWindow(task.id,task.name);
      }
    }.bind(this));
    removeTaskLink.addEvent('click',function(event){
      event.stop();
      this.ARBuilder.getMRManager().removeCompleteTask(task);
    }.bind(this));

    taskNameElement.getElements('.toggle').addEvent('click', function (event) {
      event.stop();
      if(taskElm.hasClass('maximize')){ task.reload(); }
      taskElm.toggleClass('minimize'); taskElm.toggleClass('maximize');
    }.bind(this));
  },

  // same as registerFoundRuleEventHandlers, only ids differences TODO merge
  registerMarkedRuleEventHandlers: function (foundRule) {
    var FRManager = this.ARBuilder.getMRManager();
    /*region checkbox*/
    var checkbox=$(foundRule.getCSSID()+'-checkbox');
    if (checkbox){
      checkbox.addEvent('click', function(){
        this.checkMarkedRulesSelectedCheckboxes(foundRule.getTaskId());
      }.bind(this));
    }
    /*endregion checkbox*/
    /*region mark*
    var markLink = $(foundRule.getMarkCSSID());
    if (markLink) {
      markLink.addEvent('click', function (event) {
        event.stop();
        FRManager.markFoundRule(foundRule);
      }.bind(FRManager));
    }
    *endregion mark*/
    /*region unmark*/
    var unmarkLink = $(foundRule.getUnmarkCSSID());
    if (unmarkLink) {
      unmarkLink.addEvent('click', function (event) {
        event.stop();
        FRManager.unmarkMarkedRule(foundRule);
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
    /*region thumb up*/
    var kbAddLink = $(foundRule.getUpCSSID());
    if (kbAddLink) {
      kbAddLink.addEvent('click', function (event) {
        event.stop();
        FRManager.kbAddRule(foundRule, 'positive');
      }.bind(this));
    }
    /*endregion thumb up*/
    /*region thumb down*/
    var kbAddLink = $(foundRule.getDownCSSID());
    if (kbAddLink) {
      kbAddLink.addEvent('click', function (event) {
        event.stop();
        FRManager.kbAddRule(foundRule, 'negative');
      }.bind(this));
    }
    /*endregion thumb down*/
    /*region thumb down*/
    var kbRemoveLink = $(foundRule.getKBRemoveCSSID());
    if (kbRemoveLink) {
      kbRemoveLink.addEvent('click', function (event) {
        event.stop();
        FRManager.kbRemoveRule(foundRule);
      }.bind(this));
    }
    /*endregion thumb down*/
  },

  // same as checkFoundRulesSelectedCheckboxes, only ids differences TODO merge
  checkMarkedRulesSelectedCheckboxes : function(taskId){
    //function for checking of checkboxes selection
    var taskElm = $('task-'+taskId),
        rulesElm = taskElm.getElement('ul'),
        multiControls = taskElm.getElement('.marked-rules-multi-controls');
    /*var foundRulesRules=$('found-rules-rules');
    var multiControls=$('found-rules-multi-controls');
    var markAction=(foundRulesRules.getElements('.found-rule-checkbox:checked').length);*/
    var unmarkAction=(rulesElm.getElements('.marked-rule-checkbox:checked').length);
    //markAction=((markAction-unmarkAction)>0);
    unmarkAction=(unmarkAction>0);

    /*if (markAction){
      multiControls.getElements('.actions .mark').addClass('visible');
    }else{
      multiControls.getElements('.actions .mark').removeClass('visible');
    }*/
    if (unmarkAction){
      multiControls.getElements('.actions .unmark').addClass('visible');
      multiControls.getElements('.actions .kb-add').addClass('visible');
      multiControls.getElements('.actions .kb-unmark').addClass('visible');
    }else{
      multiControls.getElements('.actions .unmark').removeClass('visible');
      multiControls.getElements('.actions .kb-add').removeClass('visible');
      multiControls.getElements('.actions .kb-unmark').removeClass('visible');
    }
  },

  // same as getFoundRulesSelectedIds, only ids differences TODO merge
  getMarkedRulesSelectedIds: function(rulesElm){
    var selectedCheckboxes = rulesElm.getElements('.marked-rule-checkbox:checked');
    if (selectedCheckboxes.length > 0){
      var result = [];
      Array.each(selectedCheckboxes, function(checkbox){
        result.push(checkbox.get('id'));
      }.bind(result))
    }
    return result;
  },

  // same as registerFoundRulesMultiControlsEventHandlers, only ids differences TODO merge
  registerMarkedRulesMultiControlsEventHandlers: function (taskId) {
    var task = this.ARBuilder.$MRManager.tasks[taskId],
        taskElm = $('task-'+taskId),
        rulesElm = taskElm.getElement('ul'),
        //controls = taskElm.getElement('.marked-rules-controls'),
        multiControls = taskElm.getElement('.marked-rules-multi-controls');

    if (multiControls){
      //events for multi-controls links

      multiControls.getElements('.all').addEvent('click',function(event){
        //select all checkboxes
        event.stop();
        rulesElm.getElements('.marked-rule-checkbox').each(function(checkbox){
          checkbox.checked=true;
        });
        this.checkMarkedRulesSelectedCheckboxes(taskId);
      }.bind(this));
      multiControls.getElements('.none').addEvent('click',function(event){
        //select all checkboxes
        event.stop();
        rulesElm.getElements('.marked-rule-checkbox').each(function(checkbox){
          checkbox.checked=false;
        });
        this.checkMarkedRulesSelectedCheckboxes(taskId);
      }.bind(this));
      multiControls.getElements('.invert').addEvent('click',function(event){
        //select all checkboxes
        event.stop();
        rulesElm.getElements('.marked-rule-checkbox').each(function(checkbox){
          checkbox.checked=!checkbox.checked;
        });
        this.checkMarkedRulesSelectedCheckboxes(taskId);
      }.bind(this));

      multiControls.getElements('.actions .unmark').addEvent('click',function(event){
        event.stop();
        var FRManager = this.ARBuilder.getMRManager();
        FRManager.multiUnmarkFoundRules(this.getMarkedRulesSelectedIds(rulesElm), taskId);
        rulesElm.getElements('.marked-rule-checkbox').each(function(checkbox){
          checkbox.checked=false;
        });
        this.checkMarkedRulesSelectedCheckboxes(taskId);
      }.bind(this));

      multiControls.getElements('.actions .kb-add').addEvent('click',function(event){
        event.stop();
        var FRManager = this.ARBuilder.getMRManager();
        FRManager.multiKBAddRule(this.getMarkedRulesSelectedIds(rulesElm), taskId, event.target.get('rel'));
        rulesElm.getElements('.marked-rule-checkbox').each(function(checkbox){
          checkbox.checked=false;
        });
        this.checkMarkedRulesSelectedCheckboxes(taskId);
      }.bind(this));

      multiControls.getElements('.actions .kb-unmark').addEvent('click',function(event){
        event.stop();
        var FRManager = this.ARBuilder.getMRManager();
        FRManager.multiKBRemoveRule(this.getMarkedRulesSelectedIds(rulesElm), taskId);
        rulesElm.getElements('.marked-rule-checkbox').each(function(checkbox){
          checkbox.checked=false;
        });
        this.checkMarkedRulesSelectedCheckboxes(taskId);
      }.bind(this));

      multiControls.getElements('.task-actions .task-details').addEvent('click',function(event){
        event.stop();
        //odkaz není aktivní
        if (event.target.hasClass('disabled')){return;}
        //odkaz je aktivní, pokračujeme ve zpracování
        var reportManager = this.ARBuilder.getReportManager();
        reportManager.showTaskDetails(taskId);
      }.bind(this));

      multiControls.getElements('.task-actions .task-export').addEvent('click',function(event){
        event.stop();
        //odkaz není aktivní
        if (event.target.hasClass('disabled')){return;}
        //odkaz je aktivní, pokračujeme ve zpracování
        this.UIPainter.renderExportWindow(taskId,event.target.get('rel'),task.isMiningInProgress(),task.isImportInProgress());
      }.bind(this));

      this.checkMarkedRulesSelectedCheckboxes(taskId);
    }
  },

  /*
  registerMarkedRulesTaskEventHandlers: function (taskId) {
    var me = this;

    $('createReport-' + taskId).addEvent('click', function (event) {
      event.stop();
      me.ARBuilder.createReport(taskId);
    });

    $('exportBusinessRules-' + taskId).addEvent('click', function (event) {
      event.stop();
      //me.ARBuilder.openExportBusinessRulesDialog(taskId);
      me.ARBuilder.exportRulesToBRBase(taskId);
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
  },*/

  registerTaskRenameEventHandlers: function () {
    // Submit (rename)
    $$('#rename-task-form input[type=submit]').addEvent('click', function (e) {
      e.stop();

      var taskId = $('rename-task-id').value,
          newTaskDesc = $('rename-task-input-desc'),
          newTaskName = $('rename-task-input').value.trim();

      // Check that the name is valid
      if (newTaskName.length == 0) {
        this.ARBuilder.getARManager().displayError(
          'rename-task-input',
          'rename-task-error',
          this.ARBuilder.$i18n.translate('Please enter a valid task name.')
        );
        return;
      }

      // Proceed with renaming
      if(newTaskDesc != null){ // it should be ruleset renaming
        this.ARBuilder.getMRManager().editRuleset(taskId, newTaskName, newTaskDesc.value.trim())
      } else{
        this.ARBuilder.getARManager().renameTask(taskId, newTaskName);
      }

      this.UIPainter.hideOverlay();


    }.bind(this));
  },

  registerOverlayEventHandlers: function () {
    // Close window (cancel)
    $('overlay-close').addEvent('click', function (e) {
      e.stop();
      this.UIPainter.hideOverlay();
    }.bind(this));

    // Close window on click outside of overlay content
    $('overlay-inner').addEvent('mousedown', function(e){
      if(e.target.id === 'overlay-inner'){
        if($('overlay-inner').getElement('#overlay-close') != null){
          $('overlay-inner').getElement('#overlay-close').click();
        }
      }
    }.bind(this));
  }
});