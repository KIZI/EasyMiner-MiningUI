var Pager = new Class({
    Implements: [Options, Events],
    
    innerElement: '.scroller',
    transition: Fx.Transitions.Cubic.easeOut,
    duration: 500,
    rules: [],
    numPages: 0,
    currentPage: 0,
    perPage: 10,
    lineHeight: 50,
    prevSymbol: '<',
    nextSymbol: '>',
    elControlType: 'span',
    
    // labels
    textInit: '',
    textProgress: '',
    textFinished: '',
    textNoRules: '',
    
    initialize: function(label, paging, container, clear, textInit, textProgress, textFinished, textNoRules) {
    	this.label = label;
    	this.paging = paging;
    	this.container = container;
    	this.clear = clear;
    	this.textInit = textInit;
    	this.textProgress = textProgress;
    	this.textFinished = textFinished;
    	this.textNoRules = textNoRules;
    	this.content = this.container.getElement(this.innerElement);
    	this.content.set('tween', {transition: this.transition, duration: this.duration});
    	
    	this.reset();
    },
    
    reset: function () {
    	this.label.removeProperty('class');
    	this.label.addClass('mining-not-started');
    	this.label.set('text', this.textInit);
    	
    	this.rules = [];
    	this.numPages = 1;
    	this.currentPage = 1;
    	this.container.setStyles({display: 'none'});
    	this.clear.setStyles({display: 'none'});
    	this.content.empty();
    	this.paging.empty();
	},
	
	setInProgress: function () {
		this.reset();
		
    	this.label.removeProperty('class');
    	this.label.addClass('mining-in-progress');
    	this.label.set('text', this.textProgress);
	},
	
	setFinished: function () {
    	this.label.removeProperty('class');
    	this.label.addClass('mining-finished');
    	this.label.set('text', this.textFinished);
	},

	setNoRules: function () {
		this.label.removeProperty('class');
    	this.label.addClass('mining-norules');
    	this.label.set('text', this.textNoRules);
	},
	
	add: function (rules) {
		Array.each(rules, function (r, key) {
			this.rules.push(r);
		}.bind(this));
		
		this.numPages = Math.ceil(this.rules.length / this.perPage);
		this.createControls();
		this.render(rules);
	},
	
	remove: function (loc) {
		var el = $(loc);
		this.rules.erase(el);
		el.destroy();
		
		this.numPages = Math.max(Math.ceil(this.rules.length / this.perPage), 1);
		if (this.numPages < this.currentPage) { // scroll to last page
			this.currentPage = this.numPages;
			this.gotoPage(this.currentPage);
		}
		this.createControls();
	},
	
	createControls: function () {
		this.paging.empty();
        this.paging.grab(new Element(this.elControlType, {
            'class': 'pager-prev ' + (this.currentPage === 1 ? 'in' : '') + 'active',
            text: this.prevSymbol,
            events: 
            	this.currentPage !== 1 ? {
	                click: function (e) {
	                    this.gotoPage(e);
	                }.bind(this)} : {}
        }).store('page', 'prev'));
        
        for (i = 1; i <= this.numPages; i++) {
            this.paging.grab(new Element(this.elControlType, {
                'class': 'pager-actuator',
                text: i,
                events: {
                    click: function(e) {
                        this.gotoPage(e);
                    }.bind(this)
                }
            }).store('page', i));
        }
        
        this.paging.grab(new Element(this.elControlType, {
            'class': 'pager-next ' + (this.currentPage === this.numPages ? 'in' : '') + 'active',
            text: this.nextSymbol,
            events:
            	this.currentPage !== this.numPages ? {
	                click: function (e) {
	                    this.gotoPage(e);
	                }.bind(this)} : {}
        }).store('page', 'next'));
        
        this.paging.getElements('.pager-actuator')[this.currentPage - 1].addClass('active');
	},
	
	render: function (rules) {
		this.container.setStyles({display: 'block'});
		this.clear.setStyles({display: 'block'});
		Array.each(rules, function (r, key) {
			this.content.grab(r);
		}.bind(this));
	},
    
    gotoPage: function(locator) {
    	if (typeof locator === 'object') {
    		var page = $(locator.target).retrieve('page');
    		if (page === 'next') {
    			this.currentPage++;
    		} else if (page === 'prev') {
    			this.currentPage--;
    		} else {
    			this.currentPage = page;
    		}
    	} else {
    		this.currentPage = locator;
    	}
        
        var scrollTo = (this.lineHeight * this.perPage) * (this.currentPage - 1);
        this.paging.getElements('.pager-actuator')[this.currentPage - 1].addClass('active').getSiblings('.pager-actuator').removeClass('active');
        this.content.tween('margin-top', "-" + scrollTo + "px");
        this.fireEvent('onScroll', this.currentPage);
        
        this.createControls();
    }
    
});
