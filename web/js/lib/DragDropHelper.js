/**
 * Class DragDropHelper
 * @license http://www.apache.org/licenses/LICENSE-2.0 Apache License, Version 2.0
 * @link http://github.com/kizi/easyminer-miningui
 *
 * @type Class
 */
var DragDropHelper = new Class({

    $draggableOpacity: 0.7,
    $UIColorizer: null,

    initialize: function(UIColorizer) {
        this.$UIColorizer = UIColorizer;
    },

    createDraggable: function(element) {
        var draggable = element.clone().setStyles(element.getCoordinates()).setStyles({
            opacity: this.$draggableOpacity,
            position: 'absolute',
            cursor: 'move',
            color: '#000'
        }).inject(document.body);

        return draggable;
    },

    createDrag: function(draggable, droppable, params) {
        var color = params.color,
            borderColor = params.borderColor,
            highlightColor = params.highlightColor,
            highlightBorderColor = params.highlightBorderColor,
            enterColor = params.enterColor,
            callback = params.callback,
            scope = params.scope;

        var me = this;
        var drag = new Drag.Move(draggable, {
            droppables: droppable,
            onDrop: function (dragging, element) {
                dragging.destroy();
                if (element !== null) {
                    if (scope) {
                        callback.call(scope);
                    } else {
                        callback.call(this, element);
                    }
                }
                droppable.setStyle('background-color', color);
                //me.$UIColorizer.tween(droppable, color);
                if (highlightBorderColor) {
                    droppable.setStyle('border-color', borderColor);
                    //me.$UIColorizer.tween(droppable, borderColor, 'border-color');
                }
            },

            onEnter: function (dragging, element) {
                element.setStyle('background-color', enterColor);
            },

            onLeave: function (dragging, element) {
                element.setStyle('background-color', highlightColor);
            },

            onCancel: function(dragging) {
                dragging.destroy();
                droppable.setStyle('background-color', color);
                //me.$UIColorizer.tween(droppable, color);
                if (highlightBorderColor) {
                    droppable.setStyle('border-color', borderColor);
                    //me.$UIColorizer.tween(droppable, borderColor, 'border-color');
                }
            }
        });

        return drag;
    }

});