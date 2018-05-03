define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
], function (declare,
             _WidgetBase,
             _TemplatedMixin,) {
    return declare('TemplateWidgetPlacer', [_WidgetBase, _TemplatedMixin], {
        templateString: null,
        _gridAttachPointName: 'rgrid-grid',

        constructor: function (params) {
            /*if (params.templateUrl) {
                this.templateString = require('dojo/text!' + params.templateUrl);
                this.inherited(arguments)
            } else {
                throw new Error('templateUrl isn`t set or isn`t a string')
            }*/
        },

        placeGrid: function (grid) {
            this.placeWidget(grid, {attachPoint: this._gridAttachPointName})
        },

        placeWidget: function (widget, config) {
            var attachPointName = config.attachPoint,
                attachPointNode = this[attachPointName];
            if (attachPointNode) {
                attachPointNode.appendChild(widget.domNode)
            } else throw new Error('Couldn`t find attach point "' + attachPointName + '" in template')
        },

        getResultingDom: function () {
            return this.domNode;
        }
    })
});