/**
 * Class AttributeValuesManager
 * @license http://www.apache.org/licenses/LICENSE-2.0 Apache License, Version 2.0
 * @link http://github.com/kizi/easyminer-miningui
 *
 * @type Class
 */
var AttributeValuesManager = new Class({

	initialize: function (config) {
		this.config = config;
		this.resetAttributeValuesArr();
	},

  getAttributeValues: function(data){
		var attributeId=data.attributeId;
		var onSuccess=data.onSuccess;
		var onError=data.onError;

		if (data = this.getSavedAttributeValues(attributeId)){
		  onSuccess(data);
    }else{
		  var self = this;
      //load values from backend...
      var jsonRequest=new Request.JSON({
        url: this.config.getAttributeValuesURL(attributeId),
        onSuccess: function(data){
          self.saveAttributeValues(attributeId,data);
          onSuccess(data);
        },
        onFailure: onError,
        onError: onError
      }).get();
    }
	},

  removeAttributeValues: function(attributeId){
    delete this.attributeValuesArr[attributeId];
  },

  saveAttributeValues: function(attributeId, values){
    this.attributeValuesArr[attributeId]={values:values, loaded: Date.now()}
  },

  getSavedAttributeValues: function(attributeId){
    if (this.attributeValuesArr.hasOwnProperty(attributeId)){
      return this.attributeValuesArr[attributeId].values
    }else{
      return null;
    }
  },

	resetAttributeValuesArr: function(){
    this.attributeValuesArr={};
  }

});