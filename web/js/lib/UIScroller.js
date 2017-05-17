/**
 * Class UIScroller
 * @license http://www.apache.org/licenses/LICENSE-2.0 Apache License, Version 2.0
 * @link http://github.com/kizi/easyminer-miningui
 *
 * @type Class
 */
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