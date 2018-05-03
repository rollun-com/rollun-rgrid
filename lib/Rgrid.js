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
             domConstruct,
             DefaultWidgetPlacer) {
    return declare('Rgrid', [_WidgetBase], {
        _configStore: null,
        _dataSourceStoreName: null,
        _widgets: [],
        _started: false,
        _templateName: null,
        _widgetPlacer: null,

        constructor: function (params) {
            if (typeof params.configStore === 'object') {
                this._configStore = params.configStore;
            } else {
                throw new TypeError('configStore isn`t set or isn`t an object');
            }
            if (typeof params.dataSourceStoreName === 'string') {
                this._dataSourceStoreName = params.dataSourceStoreName;
            } else {
                throw new TypeError('dataSourceStoreName isn`t set or isn`t a string');
            }
            if (typeof params.widgetPlacerConfig === 'object') {
                var config = params.widgetPlacerConfig;
                this._widgetPlacer = new config.widgetPlacer(config.params);
            } else {
                throw new TypeError('widgetPlacerConfig isn`t set or isn`t an object');
            }
        },

        addMultipleWidgets: function (widgets) {
            var rgrid = this;
            widgets.forEach(function (widget, index) {
                    rgrid.addWidget(widget)
            })
        },

        addWidget: function (widget) {
            if (this._started) {
                throw new Error('Can`t add new widgets to Rgrid after startup')
            }
            this._widgets.push(widget)
        },

        startup: function () {
            this._started = true;
            this._createGrid();
            this._createWidgets();
            this._finalizeCreation()
        },

        _createGrid: function () {
            var rgrid = this,
                gridNode = domConstruct.create('div'),
                gridConfig = this._configStore.get('gridConfig'),
                dataSourceStoreData = this._configStore.get(this._dataSourceStoreName);
            when(gridConfig, function (gridConfig) {
                gridConfig.configStore = rgrid._configStore;
                when(dataSourceStoreData, function (dataSourceStoreData) {
                    gridConfig.collection = new QueryableStore({target: dataSourceStoreData.url});
                    rgrid._grid = new FilterGrid(gridConfig, gridNode);
                    rgrid._widgetPlacer.placeGrid(rgrid._grid);
                    rgrid._grid.startup()
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
            this._widgetPlacer.placeWidget(widget, config);
        },

        _finalizeCreation: function () {
            var finalDom = this._widgetPlacer.getResultingDom();
            this.domNode.appendChild(finalDom)
        },

        getWidgetList: function () {
            return Object.assign([], this._widgets);
        }
    })
});