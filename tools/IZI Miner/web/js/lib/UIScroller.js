var UIScroller = new Class({

    $rootElement: null,

    initialize: function(rootElement) {
        this.$rootElement = rootElement;
    },

    scrollTo: function(x, y) {
        x = x || 0;
        y = y || 0;
        this.$rootElement.scrollTo(x, y);
    }

});