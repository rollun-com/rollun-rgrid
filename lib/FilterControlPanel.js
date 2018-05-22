define(
    [
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
        "dojo/text!./templates/FilterControlPanel.html",
        'dgrid/Grid',
        'dgrid/OnDemandGrid',
        'dgrid/Keyboard',
        'dgrid/Selection',
        'dgrid/Editor',
        'dgrid/extensions/Pagination',
        'dgrid/extensions/ColumnHider',
        'dgrid/extensions/ColumnReorder',
        'dgrid/extensions/ColumnResizer',
        'dgrid/_StoreMixin',
        'rgrid/FilterEditor/FilterEditorForm',
        'rql/parser',
        'dojo/when',
        'dgrid/extensions/DijitRegistry',
        'dojo/Deferred'
    ],
    function (declare,
              lang,
              array,
              dom,
              domConstruct,
              on,
              parser,
              _WidgetBase,
              _TemplatedMixin,
              Button,
              templates,
              Grid,
              OnDemandGrid,
              Keyboard,
              Selection,
              Editor,
              Pagination,
              ColumnHider,
              ColumnReorder,
              ColumnResizer,
              _StoreMixin,
              FilterEditor,
              Parser,
              when,
              DijitRegistry,
              Deferred) {
        return declare([_WidgetBase, _TemplatedMixin], {
            name: "no name",
            templateString: templates,
            baseClass: "filteredGrid",
            filteredStoreDataOption: null,
            store: null,
            columns: [
                {
                    "label": "Название",
                    "field": "name",
                    "editor": "text",
                    "editOn": "dblclick",
                    "autoSave": true
                },
                {
                    "label": "RQL",
                    "field": "filter",
                    "editor": "text",
                    "editOn": "dblclick",
                    "autoSave": true
                }
            ],
            selectionMode: "single",
            _rowSelected: null,
            _columnsConfig: null,
            eventBus: null,

            constructor: function (object) {
                this.inherited(arguments);
                if (typeof object.store === 'object') {
                    this.store = object.store;
                }
                if (typeof object.columnsConfig === 'object') {
                    this._columnsConfig = object.columnsConfig;
                }
                this._obtainFilterEditorData();
            },

            _obtainFilterEditorData: function () {
                const filterManager = this;
                let columns;
                if (this._columnsConfig) {
                    columns = this._columnsConfig;
                } else {
                    columns = this._getColumnsFromGrid();
                }
                when(columns, filterManager._parseFilterData(columns));
            },

            _getColumnsFromGrid: function () {
                const deferred = new Deferred();
                on.once(this.eventBus, 'gridColumnNames', function (event) {
                    deferred.resolve(event.columnNames);
                });
                this.eventBus.emit('getGridColumnNames');
                return deferred.promise;
            },

            _parseFilterData: function (columns) {
                var filterData = [];
                for (var columnIndex in columns) {
                    if (columns.hasOwnProperty(columnIndex)) {
                        var column = columns[columnIndex];
                        filterData.push({
                            "label": column.label,
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
                this.filteredStoreDataOption = filterData;
            },

            buildRendering: function () {
                this.inherited(arguments);
                const self = this;
                /**
                 * onClick emit new-filter notification
                 */
                this.newFilterBtn = new Button({
                    label: "Новый фильтр",
                    iconClass: "flat-add",
                    class: "alt-success"
                }, self.newFilterBtnNode);

                /**
                 * onClick emit remove-filter notification
                 */
                this.removeFilterBtn = new Button({
                    label: "Удалить фильтр",
                    iconClass: "flat-delete",
                    class: "alt-danger"
                }, self.removeFilterBtnNode);

                /**
                 * onClick emit set-filter notification
                 */
                this.setFilterBtn = new Button({
                    label: "Применить фильтр к таблице",
                    iconClass: "flat-check",
                    class: "alt-primary"
                }, self.setFilterBtnNode);

                this.filterListGrid = new (declare([OnDemandGrid, DijitRegistry, Selection, Editor, ColumnResizer, ColumnHider]))({
                    collection: this.store,
                    columns: self.columns,
                    selectionMode: self.selectionMode,

                }, self.filterListGridNode);
                this.filterListGrid.startup();
            },

            postCreate: function () {
                const self = this,
                    domNode = this.domNode;
                this.inherited(arguments);
                this.own(
                    on(self.newFilterBtn, "click", lang.hitch(self, function (e) {
                        self.store.add({
                            name: "Фильтр " + self._generateFilterName(),
                        });
                        self.filterListGrid.refresh();
                        self.filterListGrid.resize();
                    })),
                    on(self.removeFilterBtn, "click", lang.hitch(self, function (e) {
                        if (self.getSelectedRow() !== null) {
                            self.store.remove(self.getSelectedRow().id);
                            self.filterListGrid.refresh();
                        } else {
                            alert("Фильтр для удаления не выбраны");
                        }
                    })),
                    on(self.filterListGrid, "dgrid-select", function (event) {
                        self.filterListGrid.resize();
                        self._rowSelected = event.rows[0].data;
                        self.filterEditorNode.innerHTMl = '';
                        if (self.filterEditor) {
                            self.filterEditor.destroy();
                            self.filterEditor = null;
                        }
                        self.filterEditor = new FilterEditor({
                            name: self.getSelectedRow().name,
                            filter: {
                                name: self.getSelectedRow().name,
                                rql: self.getSelectedRow().filter
                            }
                        }, self.filterEditorNode, self.filteredStoreDataOption);
                        on(self.filterEditor.filter, "save-filter", function (event) {
                            if (event !== null &&
                                event !== undefined &&
                                event.filter !== null &&
                                event.filter !== undefined &&
                                event.filter.rql !== null &&
                                event.filter.rql !== undefined
                            ) {
                                var selectedRow = self.getSelectedRow();
                                var rql = event.filter.rql;
                                if (selectedRow.id === "search") {
                                    self._writeCopyOfFilterToStore(selectedRow, rql);
                                } else {
                                    self._writeFilterToStore(selectedRow, rql)
                                }
                                self.filterListGrid.refresh();
                            } else {
                                console.log("not set field in event");
                            }
                        });
                    }),

                    on(self.setFilterBtn, "click", function (e) {
                        self._applySelectedFilter(self.getSelectedRow());
                        self.emit("set-filter", e);
                        self.filterListGrid.refresh();
                    }),

                    on(self.filterListGrid, "dgrid-deselect", function (event) {
                        self.filterEditorNode.innerHTMl = '';
                        if (self.filterEditor) {
                            self.filterEditor.destroy();
                            self.filterEditor = null;
                        }
                    })
                );
            },

            _generateFilterName: function () {
                var firstPart = (Math.random() * 46656) | 0;
                var secondPart = (Math.random() * 46656) | 0;
                firstPart = ("000" + firstPart.toString(36)).slice(-3);
                secondPart = ("000" + secondPart.toString(36)).slice(-3);
                return firstPart + secondPart;
            },

            _writeCopyOfFilterToStore: function (filterRow, rql) {
                var newFilter = {
                    name: filterRow.name + " " + this._generateFilterName(),
                    filter: rql
                };
                this.store.add(newFilter);
            },

            _writeFilterToStore: function (filterRow, rql) {
                var newFilter = {
                    id: filterRow.id,
                    name: filterRow.name,
                    filter: rql
                };
                this.store.put(newFilter, {overwrite: true});
            },

            _applySelectedFilter: function (filterRow) {
                if (typeof filterRow === 'object') {
                    let queryObject = Parser.parse(filterRow.filter);
                    this.eventBus.emit('loadGridContentForQuery', {query: queryObject});
                } else {
                    alert("Фильтр не выбран");
                }
            },

            startup: function () {
                this.inherited(arguments);
                this.filterListGrid.startup();
            },

            getSelectedRow: function () {
                return this._rowSelected;
            },

            destroy: function () {
                this.inherited(arguments);

                var self = this;
                if (self.newFilterBtn !== undefined) {
                    self.newFilterBtn.destroy();
                    if (dom.byId(self.newFilterBtn.domNode)) {
                        domConstruct.destroy(dom.byId(self.newFilterBtn.domNode));
                    }
                }
                if (self.removeFilterBtn !== undefined) {
                    self.removeFilterBtn.destroy();
                    if (dom.byId(self.removeFilterBtn.domNode)) {
                        domConstruct.destroy(dom.byId(self.removeFilterBtn.domNode));
                    }
                }
                if (self.setFilterBtn !== undefined) {
                    self.setFilterBtn.destroy();
                    if (dom.byId(self.setFilterBtn.domNode)) {
                        domConstruct.destroy(dom.byId(self.setFilterBtn.domNode));
                    }
                }
                if (self.filterListGrid !== undefined) {
                    self.filterListGrid.destroy();
                    if (dom.byId(self.filterListGrid.domNode)) {
                        domConstruct.destroy(dom.byId(self.filterListGrid.domNode));
                    }
                }
                if (self.filterEditor !== undefined) {
                    self.filterEditor.destroy();
                    if (dom.byId(self.filterEditor.domNode)) {
                        domConstruct.destroy(dom.byId(self.filterEditor.domNode));
                    }
                }
            }
        });
    }
);