var ElementFilter = new Class({

/* Source: http://davidwalsh.name/plugin-element-filter */

  //implements
	Implements: [Options,Events],

	//options
	options: {
		cache: true,
    caseSensitive: false,
    ignoreKeys: [13, 27, 32, 37, 38, 39, 40],
    matchAnywhere: true,
    property: 'text',
    trigger: 'mouseup',
    onStart: null,
    onShow: null,
    onHide: null,
    onComplete: null
	},

	//initialization
	initialize: function(observeElement,elements,options) {
		//set options
    this.setOptions(options);
    //set elements and element
    this.observeElement = document.id(observeElement);
    this.elements = $$(elements);
    this.matches = this.elements;
		this.misses = [];
    //start the listener
    this.listen();
	},
	
	//adds a listener to the element (if there's a value and if the event code shouldn't be ignored)
	listen: function() {
		//add the requested event
    this.observeElement.addEvent(this.options.trigger,function(e) {
      //if there's a value in the box...
			if(this.observeElement.value.length) {
				//if the key should not be ignored...
				if(!this.options.ignoreKeys.contains(e.code)) {
					this.fireEvent('start');
					this.findMatches(this.options.cache ? this.matches : this.elements);
					this.fireEvent('complete');
				}
			}
			else{
				//show all of the elements
				this.findMatches(this.elements,false);
			}
    }.bind(this));
	},

	//check for matches within specified elements
	findMatches: function(elements,matchOverride) {
		//settings
    var value = this.observeElement.value;
    var regExpPattern = this.options.matchAnywhere ? value : '^' + value;
    var regExpAttrs = this.options.caseSensitive ? '' : 'i';
		var filter = new RegExp(regExpPattern, regExpAttrs);
		var matches = [];				
    //recurse
    elements.each(function(el){
        alert("ahoj");
        var match = filter.test(el.get(this.options.property));
			//if this element matches, store it...
			if(match) { 
				if(!el.retrieve('showing')){
					this.fireEvent('show',[el]);
				}
				matches.push(el); 
				el.store('showing',true);
			}
			else {
				if(matchOverride == undefined) {
					this.fireEvent('hide',[el]);
				}
        else{
            this.fireEvent('show',[el]);
        }
				el.store('showing',false);
			}
			return true;
        }.bind(this));
		return matches;
	}

});