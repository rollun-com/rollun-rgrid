/**
 * Created by victorsecuring on 15.11.16.
 */
define([
        'dojo/_base/declare',
        'dojo/_base/lang',
        'dojo/_base/array',
        "dojo/dom",
        "dojo/dom-construct",
        'dojo/on',
        "dojo/query",

        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",

        'dstore/extensions/RqlQuery',
        "dstore/Rest",
        "dstore/RequestMemory",
        'dstore/Trackable',

        "Rscript/Composite/widget/Composite",
        'Rscript/FilteredGrid/widget/FilteredGrid',
        'Rscript/FilterControlPanel/widget/FilterControlPanel',
        'Rscript/DataPreviewControlPanel/widget/DataPreviewControlPanel',
        'Rscript/extensions/Store/StoreRqlFilter',

        "dgrid/Grid",
        "dgrid/Keyboard",
        "dgrid/extensions/Pagination",
        "dgrid/extensions/ColumnHider",
        "dgrid/extensions/ColumnResizer",

        "dijit/ConfirmDialog",
        "dijit/form/TextBox",
        "dijit/form/Form",
        "dojo/text!./templates/initQuery.html"
    ], function (declare,
                 lang,
                 array,
                 dom,
                 domConstruct,
                 on,
                 query,
                 _WidgetBase,
                 _TemplatedMixin,

                 RqlQuery,
                 Rest,
                 RequestMemory,
                 Trackable,

                 Composite,
                 FilteredGrid,
                 FilterControlPanel,
                 DataPreviewControlPanel,
                 StoreRqlFilter,

                 Grid,
                 Keyboard,
                 Pagination,
                 ColumnHider,
                 ColumnResizer,
                 ConfirmDialog,
                 TextBox,
                 Form,
                 templates) {
        return declare([_WidgetBase, _TemplatedMixin], {
            templateString: templates,

            dstore: null,
            grid: null,
            _url: null,
            form: null,

            createGridDialog: null,

            constructor: function () {

            },

            buildRendering: function () {
                this.inherited(arguments);

                var self = this;

                self.form = new Form({
                    id: 'formUrlGet',
                });
                new TextBox({
                    name: 'url',
                    placeHolder: "http://",
                }).placeAt(self.form.containerNode);

                if (!self.createGridDialog) {
                    self.createGridDialog = new ConfirmDialog({
                        id: 'urlGetDialog',
                        title: 'Url for data',
                        content: self.form,
                        style: 'width:600px;',
                        execute: function () {
                            var f = query("#formUrlGet")[0];
                            self._url = f['url'].value;
                            var itemData = self._getItemData();
                            self._initDataView(itemData);
                        },
                        onCancel: function () {
                        }
                    });
                }
            },

            postCreate: function () {
                var self = this;
                this.inherited(arguments);
                this.own(
                    on(self.setUrlButtonNode, "click", function () {
                        self.createGridDialog.show();
                    })
                );
            },

            startup: function () {
                this.inherited(arguments);
            },

            _getItemData: function () {
                var xhr = new XMLHttpRequest();
                var rql = 'limit(1)';
                xhr.open('GET', this._url + '?' + rql, false);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Accept', 'application/json');
                xhr.send();
                if (xhr.status == 200) {
                    var jsonResp;
                    try {
                        jsonResp = JSON.parse(xhr.responseText);
                    } catch (e) {
                        jsonResp = null;
                    }
                } else {
                    //error handle;
                    jsonResp = null;
                }

                return jsonResp;
            },

            _initGrid: function (columns) {
                var self = this;

                /*self.grid = new (declare([Grid,
                    Keyboard,
                    Pagination,
                    ColumnHider,
                    ColumnResizer]))({
                    "collection": self.dstore,
                    "columns": columns,
                    "pagingLinks": false,
                    "pagingTextBox": true,
                    "firstLastArrows": true,
                    "rowsPerPage": 15,
                    "pageSizeOptions": [10, 15, 25]
                }, self.gridNode);*/

                var filteredGridOption = {
                    "title": "Title",   // указываем title элемента
                    "name": "dataView", // указываем name элемента
                    "options": {                        // Указываем опции для фильтров
                        "columns": columns,
                        "collection": self.dstore,
                        "selectionMode": "single",
                        "pagingLinks": false,
                        "pagingTextBox": true,
                        "firstLastArrows": true,
                        "rowsPerPage": 15,
                        "pageSizeOptions": [10, 15, 25]
                    },
                    "declare": [
                        "Grid",
                        "Keyboard",
                        "Selection",
                        "ColumnHider",
                        "ColumnResizer",
                        "GridRqlFilter"
                    ]
                };
                var filterGrid = new FilteredGrid(filteredGridOption);

                var filterData = [];

                for(var columnIndex in columns){
                    if(columns.hasOwnProperty(columnIndex)){
                        var column = columns[columnIndex];
                        filterData.push({
                            "label": column.field,
                            "value": {
                                "type": "string",
                                "name": column.field,
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        });
                    }
                }

                var tableFilterControlPanel = new FilterControlPanel({
                    "title": "Панель управления фильтрами ",
                    "id": "tableFilter",
                    "name": "dataStoreViewerFilterPanel",
                    "filteredStoreDataOption": filterData,
                    "store": new (declare([Rest, Trackable]))({
                        'headers': {
                            'Accept': 'application/json'
                        },
                        "target": "/api/v1/rest/filters"
                    })
                });

                var grid = new DataPreviewControlPanel({
                    title: "DataStoreViewer",
                    filterControlPanel: tableFilterControlPanel,
                    dataViewer: filterGrid
                });

                self.grid = new Composite({
                    components: [grid]
                }).placeAt(self.gridNode);
            },

            _initDataView: function (respItemData) {
                var self = this;
                if (self._url !== null && self._url !== undefined &&
                    respItemData !== null && respItemData !== undefined) {


                    self.dstore = new (declare([StoreRqlFilter, Trackable]))({
                        target: self._url
                    });

                    var columns = [];
                    var respObj = respItemData[0];
                    for (var column in respObj) {
                        if (respObj.hasOwnProperty(column)) {
                            columns.push({label: column, field: column});
                        }
                    }

                    if (!self.grid) {
                        self._initGrid(columns);
                    } else {
                        /*self.grid.set('collection', self.dstore);
                        self.grid.set('columns', columns);
                        self.grid.refresh();*/
                        self.grid.destroyRecursive();
                        self._initGrid(columns);
                    }


                    self.grid.startup();
                } else {
                    throw EventException("Data or url not set!");
                }
            },

            destroyRecursive: function () {
                this.inherited(arguments);
                var self = this;

                self.form.destroyRecursive();
                self.createGridDialog.destroyRecursive();
                self.grid.destroyRecursive();
            }
        });
    }
)
;