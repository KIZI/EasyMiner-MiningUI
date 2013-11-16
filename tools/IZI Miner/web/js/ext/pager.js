var Pager = new Class({
    Implements: [Options, Events],
    
    innerElement: '.scroller',
    transition: Fx.Transitions.Cubic.easeOut,
    duration: 500,
    rules: [],
    numPages: 0,
    currentPage: 0,
    perPage: 10,
    lineHeight: 55,
    prevSymbol: '<',
    nextSymbol: '>',
    elControlType: 'span',
    
    // labels
    textInit: '',
    textProgress: '',
    textFinished: '',
    textNoRules: '',
    $textStopped: '',
    $textError: '',
    
    initialize: function(label, paging, container, clear, textInit, textProgress, textFinished, textNoRules, textStopped, textError) {
    	this.label = label;
    	this.paging = paging;
    	this.container = container;
    	this.clear = clear;
    	this.textInit = textInit;
    	this.textProgress = textProgress;
    	this.textFinished = textFinished;
    	this.textNoRules = textNoRules;
        this.$textStopped = textStopped;
        this.$textError = textError;
    	this.content = this.container.getElement(this.innerElement);
    	this.content.set('tween', {transition: this.transition, duration: this.duration});
    	
    	this.reset();
    },
    
    reset: function () {
    	this.setInitialized();

    	this.rules = [];
    	this.numPages = 1;
    	this.currentPage = 1;
    	this.container.setStyles({display: 'none'});
    	this.clear.setStyles({display: 'none'});
    	this.content.empty();
    	this.paging.empty();
	},

    setInitialized: function() {
        this.label.removeProperty('class');
        this.label.addClass('mining-not-started');
        this.label.set('text', this.textInit);
    },
	
	setInProgress: function () {
		this.reset();
		this.content.tween('margin-top', "-0px");
        this.fireEvent('onScroll', this.currentPage);
		
    	this.label.removeProperty('class');
    	this.label.addClass('mining-in-progress');
    	this.label.set('text', this.textProgress);
	},

    setInterrupted: function(limit) {
        this.label.removeProperty('class');
        this.label.addClass('mining-stopped');
        this.label.set('text', 'Mining has been stopped, because maximum number of hypotheses has been found (' + limit + ')'); // TODO: Localize
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

    setStopped: function() {
        this.label.removeProperty('class');
        this.label.addClass('mining-stopped');
        this.label.set('text', this.$textStopped);
    },

    setError: function() {
        this.label.removeProperty('class');
        this.label.addClass('mining-error');
        this.label.set('text', this.$textError);
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

        // page 1
        this.paging.grab(this.createControlItem(1));
        if (this.currentPage > 4) {
            this.paging.grab(this.createEmptyControlItem());
            this.paging.grab(this.createControlItem(this.currentPage - 2));
            this.paging.grab(this.createControlItem(this.currentPage - 1));
        } else if (this.currentPage > 3) {
            this.paging.grab(this.createControlItem(this.currentPage - 2));
            this.paging.grab(this.createControlItem(this.currentPage - 1));
        } else if (this.currentPage > 2) {
            this.paging.grab(this.createControlItem(this.currentPage - 1));
        }

        // current page
        if (this.currentPage > 1) {
            this.paging.grab(this.createControlItem(this.currentPage));
        }

        // next page
        if ((this.currentPage + 3) < this.numPages) {
            this.paging.grab(this.createControlItem(this.currentPage + 1));
            this.paging.grab(this.createControlItem(this.currentPage + 2));
            this.paging.grab(this.createEmptyControlItem());
        } else if ((this.currentPage + 2) < this.numPages) {
            this.paging.grab(this.createControlItem(this.currentPage + 1));
            this.paging.grab(this.createControlItem(this.currentPage + 2));
        } else if ((this.currentPage + 1) < this.numPages) {
            this.paging.grab(this.createControlItem(this.currentPage + 1));
        }

        // last page
        if (this.currentPage < this.numPages) {
            this.paging.grab(this.createControlItem(this.numPages));
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
	},

    createControlItem: function(pageId) {
        var item = new Element(this.elControlType, {
            'class': 'pager-actuator' + (this.currentPage === pageId ? ' active' : ''),
            text: pageId,
            events: {
                click: function(e) {
                    this.gotoPage(e);
                }.bind(this)
            }
        }).store('page', pageId);

        return item;
    },

    createEmptyControlItem: function() {
        var item = new Element(this.elControlType, {
            'class': 'pager-actuator-empty',
            text: '...'
        }).store('page', '...');

        return item;
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

        var scrollTo = Math.max((this.lineHeight * this.perPage) * (this.currentPage - 1) - (2 * (this.currentPage - 1)), 0);
        this.createControls();
        this.content.tween('margin-top', "-" + scrollTo + "px");
        this.fireEvent('onScroll', this.currentPage);
        
        this.createControls();
    }
    
});
