/**
 * Created by root on 23.08.16.
 */
define(
    [
        '../../../dojo/dojo/_base/declare',
        'dojo/_base/lang',
        'dojo/_base/array',
        "dojo/dom",
        "dojo/dom-construct",
        'dojo/on',
        "dojo/parser",
        "../data/tables",
        "Rscript/Smart/Composite/widget/Composite",
        'Rscript/Smart/FilterControlPanel/widget/FilterControlPanel',
        'Rscript/Smart/FilteredGrid/widget/FilteredGrid',
        'Rscript/Smart/TableWithConfiguration/widget/TableWithConfiguration',
        'Rscript/Smart/DataPreviewControlPanel/widget/DataPreviewControlPanel',
        'Rscript/Smart/Chart/widget/Chart',
        "dojox/charting/plot2d/Columns",
        'dstore/Memory',
        'dstore/Trackable',
        'dstore/Store',
        'dstore/Rest',
        "Rscript/Smart/extensions/Store/StoreRqlFilter",

    ],
    function (declare,
              lang,
              array,
              dom,
              domConstruct,
              on,
              parser,
              tables,
              Composite,
              FilterControlPanel,
              FilteredGrid,
              TableWithConfiguration,
              DataPreviewControlPanel,
              Chart,
              Columns,
              Memory,
              Trackable,
              Store,
              Rest,
              StoreRqlFilter) {
        return function (name, store, withPlot) {
            var self = this;

            var gridFilterControlPanel;
            var filterGrid;
            var composite;
            var tempOptions;

            var concreteConf = tables[name];

            if (concreteConf === null || concreteConf === undefined) {
                concreteConf = tables['_default'];
            }

            if (!concreteConf['filterControlPanelOption']) {
                gridFilterControlPanel = new FilterControlPanel({
                    "title": "Панель управления фильтрами ",
                    "id": "gridFilter",
                    "name": "tempFilterGrid",
                    "store": new (declare([Rest, Trackable]))({
                        'headers': {
                            'Accept': 'application/json'
                        },
                        "target": "/rest/filters_list"
                    })
                });
            } else {
                tempOptions = JSON.parse(JSON.stringify(concreteConf['filterControlPanelOption']['options']));
                if (!tempOptions.store) {
                    tempOptions.store = new (declare([Rest, Trackable]))({
                        'headers': {
                            'Accept': 'application/json'
                        },
                        "target": "/rest/filters_list"
                    });
                }
                if (!tempOptions.title) {
                    tempOptions.title = concreteConf['filterControlPanelOption']['title']
                        ? concreteConf['filterControlPanelOption']['title'] : "Панель управления фильтрами ";
                }
                if (!tempOptions.id) {

                    tempOptions.id = concreteConf['filterControlPanelOption']['id']
                        ? concreteConf['filterControlPanelOption']['id'] : "gridFilter";
                }
                if (!tempOptions.name) {
                    tempOptions.name = concreteConf['filterControlPanelOption']['name']
                        ? concreteConf['filterControlPanelOption']['name'] : "tempFilterGrid";
                }

                gridFilterControlPanel = new FilterControlPanel(tempOptions);
                tempOptions = null;
            }


            if (!concreteConf['filteredGridOption']) {
                filterGrid = new FilteredGrid({
                    title: concreteConf['title'] + "(табличное предствление)",
                    name: concreteConf['name'] + "FilterGrid",
                    collection: store
                });
            } else {
                tempOptions = JSON.parse(JSON.stringify(concreteConf['filteredGridOption']['grid']));

                if (!tempOptions.options.collection && !tempOptions.collection) {
                    tempOptions.collection = store;
                }

                if (!tempOptions.title) {
                    tempOptions.title = concreteConf['filteredGridOption']['title']
                        ? concreteConf['filteredGridOption']['title'] : concreteConf['title'] + "(табличное предствление)";
                }

                if (!tempOptions.name) {
                    tempOptions.name = concreteConf['filteredGridOption']['name']
                        ? concreteConf['filteredGridOption']['name'] : concreteConf['name'] + "FilterGrid";
                }

                filterGrid = new FilteredGrid(tempOptions);

                tempOptions = null;

            }


            var filterGridTableWithConfiguration = new TableWithConfiguration({
                title: concreteConf['title'] + "(табличное предствление)",
                table: filterGrid
            });

            var tableDataPreviewControlPanel = new DataPreviewControlPanel({
                title: concreteConf['title'] + "(табличное предствление)",
                filterControlPanel: gridFilterControlPanel,
                dataViewer: filterGridTableWithConfiguration
            });

            if (withPlot === true) {
                var chartFilterControlPanel;
                var filterChartOption;

                if (!concreteConf['filterControlPanelOption']) {
                    chartFilterControlPanel = new FilterControlPanel({
                        "title": "Панель управления фильтрами ",
                        "id": "chartFilter",
                        "name": "tempFilterChart",
                        "store": new (declare([Rest, Trackable]))({
                            'headers': {
                                'Accept': 'application/json'
                            },
                            "target": "/rest/filters_list"
                        })
                    });
                } else {
                    tempOptions = JSON.parse(JSON.stringify(concreteConf['filterControlPanelOption']['options']));
                    if (!tempOptions.store) {
                        tempOptions.store = new (declare([Rest, Trackable]))({
                            'headers': {
                                'Accept': 'application/json'
                            },
                            "target": "/rest/filters_list"
                        });
                    }
                    if (!tempOptions.title) {
                        tempOptions.title = concreteConf['filterControlPanelOption']['title']
                            ? concreteConf['filterControlPanelOption']['title'] : "Панель управления фильтрами ";
                    }

                    if (!tempOptions.id) {
                        if(dom.byId("chartFilter")){
                            domConstruct.destroy(dom.byId("chartFilter"));
                        }
                        tempOptions.id = concreteConf['filterControlPanelOption']['id']
                            ? concreteConf['filterControlPanelOption']['id'] : "chartFilter";
                    }
                    if (!tempOptions.name) {
                        tempOptions.name = concreteConf['filterControlPanelOption']['name']
                            ? concreteConf['filterControlPanelOption']['name'] : "tempFilterChart";
                    }
                    chartFilterControlPanel = new FilterControlPanel(tempOptions);
                }

                var filterChart;

                if (!concreteConf['filterChartOption']) {
                    filterChart = new Chart({
                        "title": "",
                        "name": "",
                        "store": store,
                        "type": Columns,
                        "xAxisLabel": 'x',
                        "yAxisLabel": 'y'
                    });
                } else {
                    tempOptions = JSON.parse(JSON.stringify(concreteConf['filterChartOption']));

                    if (!tempOptions.store) {
                        tempOptions.store = store;
                    }
                    if (!tempOptions.title) {
                        tempOptions.title =  concreteConf['title'];
                    }
                    if (!tempOptions.name) {
                        tempOptions.name = concreteConf['name'] + "ChartGrid";
                    }
                    if (!tempOptions.xAxisLabel) {
                        tempOptions.xAxisLabel = "X";
                    }
                    if (!tempOptions.yAxisLabel) {
                        tempOptions.yAxisLabel = "Y";
                    }

                    filterChart = new Chart(tempOptions);
                }

                var chartDataPreviewControlPanel = new DataPreviewControlPanel({
                    title: "Гистограмма цены выставленных товаров",
                    filterControlPanel: chartFilterControlPanel,
                    dataViewer: filterChart
                });
                composite = new Composite({
                    components: [tableDataPreviewControlPanel, chartDataPreviewControlPanel]
                })
            } else {
                composite = new Composite({
                    components: [tableDataPreviewControlPanel]
                })
            }

            return composite;
        }

    });