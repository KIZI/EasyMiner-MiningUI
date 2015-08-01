var UIScroller = new Class({

  $rootElement: null,
  lastPositionTop: 0,
  lastPositionLeft: 0,

  initialize: function (rootElement) {
    //this.$rootElement = rootElement;
    this.$rootElement = $$('html')[0];
  },

  scrollTo: function (x, y) {
    x = x || 0;
    y = y || 0;
    this.$rootElement.scrollTo(x, y);
  },

  rememberLastScroll: function () {
    this.lastPositionTop=this.$rootElement.getScrollTop();
    this.lastPositionLeft=this.$rootElement.getScrollLeft();
  },

  restoreLastScroll: function () {
    this.scrollTo(this.lastPositionLeft,this.lastPositionTop)
  }

});