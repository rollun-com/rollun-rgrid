define([
    'dojo/_base/declare'
], function (declare) {
    return declare('PositionWidgetPlacer', [], {
        _gridNode: null,
        _dom: new DocumentFragment(),

        constructor: function (params) {

        },

        placeGrid: function (grid) {
            this._gridNode = grid.domNode;
            this._dom.appendChild(grid.domNode);
        },

        placeWidget: function (widget, config) {
            var gridNode = this._gridNode,
                positionIndex = config.position,
                getWidgetPosition = function (positionIndex) {
                    switch (positionIndex) {
                        case -1: {
                            return 'before'
                        }
                        case 1: {
                            return 'after'
                        }
                        default: {
                            throw new Error('Invalid position index')
                        }
                    }
                };
            widget.placeAt(gridNode, getWidgetPosition(positionIndex)).startup()
        },

        getResultingDom: function () {
            return this._dom;
        }
    })
});

