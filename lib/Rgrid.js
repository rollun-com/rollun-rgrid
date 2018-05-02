define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'Rscript/extensions/Store/QueryableStore',
    'Rscript/extensions/Grid/FilterGrid',
    'dojo/when',
    'dojo/dom-construct',
], function (declare,
             _WidgetBase,
             QueryableStore,
             FilterGrid,
             when,
             domConstruct) {
    return declare('Rgrid', [_WidgetBase], {
        _configStore: null,
        _dataSourceStoreName: null,
        _widgets: [],
        _started: false,

        constructor: function (params) {
            if (typeof params.configStore === 'object') {
                this._configStore = params.configStore;
            } else {
                throw new TypeError('configStore isn`t set or isn`t an object');
            }
            if (typeof params.dataSourceStoreName === 'string') {
                this._dataSourceStoreName = params.dataSourceStoreName;
            } else throw new TypeError('dataSourceStoreName isn`t set or isn`t a string');
            if (typeof params.widgets === 'object') {
                this.addMultipleWidgets(params.widgets)
            }
        },

        addMultipleWidgets: function (widgets) {
            var rgrid = this;
            widgets.forEach(function (widget, index) {
                if (widget.widgetConstructor && widget.position) {
                    var widgetParams = widget.widgetParams || {};
                    rgrid.addWidget(widget.widgetConstructor, widget.position, widgetParams)
                } else {
                    throw new Error('Widget params with index "' + index + '" is invalid')
                }
            })
        },

        addWidget: function (widgetConstructor, position, widgetParams = null) {
            if (this._started) {
                throw new Error('Can`t add new widgets to Rgrid after startup')
            }
            if (position !== 1 && position !== -1) {
                throw new Error('Invalid position index')
            }
            widgetParams = widgetParams || {};
            this._widgets.push({
                widgetConstructor: widgetConstructor,
                position: position,
                widgetParams: widgetParams
            })
        },

        startup: function () {
            var gridNode = domConstruct.place('<div id = rgrid-grid></div>', this.domNode);
            this._createGrid(gridNode);
            this._createWidgets();
        },

        /**
         * @param domNode {object} - node that will contain the grid
         */
        _createGrid: function (domNode) {
            var rgrid = this,
                gridConfig = this._configStore.get('gridConfig'),
                dataSourceStoreData = this._configStore.get(this._dataSourceStoreName);
            when(gridConfig, function (gridConfig) {
                gridConfig.configStore = rgrid._configStore;
                when(dataSourceStoreData, function (dataSourceStoreData) {
                    gridConfig.collection = new QueryableStore({target: dataSourceStoreData.url});
                    rgrid._grid = new FilterGrid(gridConfig, domNode);
                })
            });
        },

        _createWidgets: function () {
            var rgrid = this;
            this._widgets.forEach(function (widgetConfig) {
                var domNode = domConstruct.create('div'),
                    widget = rgrid._createWidget(widgetConfig, domNode);
                rgrid._placeWidget(widget, widgetConfig)
            })
        },

        _createWidget: function (config, domNode) {
            var widgetParams = config.widgetParams;
            widgetParams.grid = this._grid;
            widgetParams.configStore = this._configStore;
            widgetParams.domNode = domNode;
            return new config.widgetConstructor(widgetParams);
        },

        _placeWidget: function (widget, config) {
            var gridNode = this._grid.domNode,
                positionIndex = config.position,
                getWidgetPosition = function (positionIndex) {
                switch (positionIndex){
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

        getWidgetList: function () {
            return Object.assign([], this._widgets);
        }
    })
});