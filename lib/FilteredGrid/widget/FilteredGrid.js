/**
 * Created by root on 18.05.16.
 */
define([
        'dojo/_base/declare',
        'dojo/_base/lang',
        'dojo/_base/array',
        "dojo/dom",
        "dojo/dom-construct",
        'dojo/on',
        "dojo/parser",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dijit/form/Button",
        'dstore/Filter',
        "./DefaultGrid",
        "../util/GridFactory",
        "dojo/text!./templates/FilteredGrid.html"
    ],
    function (declare,
              lang,
              array,
              dom,
              domConstructor,
              on,
              parser,
              _WidgetBase,
              _TemplatedMixin,
              Button,
              Filter,
              DefaultGrid,
              GridFactory,
              templates) {
        return declare([_WidgetBase, _TemplatedMixin], {
            name: "no name",

            templateString: templates,

            baseClass: "filteredGrid",

            store: null,

            //==========================
            options: {
                "selectionMode": "single",
                "pagingLinks": false,
                "pagingTextBox": true,
                "firstLastArrows": true,
                "rowsPerPage": 15,
                "pageSizeOptions": [10, 15, 25]
            },
            declare: [
                "Grid",
                "Keyboard",
                "Selection",
                "Pagination",
                "ColumnHider",
                "ColumnResizer",
                "GridRqlFilter"
            ],
            //==========================

            grid: null,

            constructor: function (object) {
                this.inherited(arguments);

                var self = this;
                if (object !== null && object !== undefined) {
                    for (var index in object) {
                        if (object.hasOwnProperty(index)) {
                            self[index] = object[index];
                        }
                    }

                    if (object.collection !== null &&
                        object.collection !== undefined) {
                        if (this.store === null || this.store === undefined) {
                            this.store = object.collection;
                            self.options.collection = object.collection
                        }
                    }
                }
            },

            buildRendering: function () {
                this.inherited(arguments);

                var self = this;

                self.grid = GridFactory({
                    name: self.name,
                    configName: "_default",
                    options: self.options,
                    declare: self.declare,
                    domNode: self.gridNode
                });

            },

            postCreate: function () {
                var self = this;

                // Get a DOM node reference for the root of our widget

                // Run any parent postCreate processes - can be done at any point
                this.inherited(arguments);

                this.own(
                    on(self.grid, "dgrid-select", function (e) {
                        on.emit(self, "dgrid-select", e);
                    }),

                    on(self.grid, "dgrid-deselect", function (e) {
                        on.emit(self, "dgrid-deselect", e);
                    })
                );
            },

            startup: function () {
                this.inherited(arguments);
                this.grid.startup();
            },

            refresh: function (filter) {
                var self = this;
                var store = null;

                if (filter !== null &&
                    filter !== undefined &&
                    filter.name !== null &&
                    filter.name !== undefined &&
                    filter.filter !== null &&
                    filter.filter !== undefined &&
                    filter.filter instanceof Filter) {

                    self._setFilterBlock(filter.name);

                    store = self.store.filter(filter.filter);
                }

                if (store !== null && store !== undefined) {
                    self.grid.set('collection', store)
                }
            },

            clear: function () {
                var self = this;
                //
                self.grid.setRqlFilter(null);

                if(self.grid.benchmarkColumns !== undefined &&
                    self.grid.benchmarkColumns !== null){
                    self.grid.refresh();
                    self.setColumns(self.grid.benchmarkColumns);
                }else{
                    self.grid.set('collection', self.store);
                }
            },

            getConfig: function () {
                var self = this;
                var columns = self.grid.get('columns');
                return columns;
            },

            setColumns: function (columns) {
                var self = this;
                self.grid.set('columns', columns);
            },

            setRqlFilter: function (filter) {
                if (filter !== null &&
                    filter.name !== null &&
                    filter.name !== undefined &&
                    filter.filter !== null &&
                    filter.filter !== undefined
                ) {
                    var self = this;
                    self.grid.setRqlFilter(filter.filter);
                    self.grid.newReceivedColumns = null;
                    self.grid.refresh();

                    setTimeout(function () {
                        if (self.grid.newReceivedColumns) {
                            self.setColumns(self.grid.newReceivedColumns);
                        }
                        self._setFilterBlock(filter.name);
                    }, 100);
                }
            },

            _setFilterBlock: function (filterName) {
                var self = this;
                var filterNode = domConstructor.create('button', {'class': "btn btn-success filter_active"});
                on(filterNode, "click", function () {
                        self.clear();
                        self.filterActiveNode.innerHTML = "";
                    }
                );
                domConstructor.place("<span class='glyphicon glyphicon-remove' style='float:right;'></span><p>" + filterName + "</p>", filterNode);
                self.filterActiveNode.innerHTML = "";
                self.filterActiveNode.appendChild(filterNode);
            },

            destroyRecursive: function () {
                this.inherited(arguments);
                var self = this;
                self.grid.destroy();
            }

        });
    }
);