/**
 * Created by root on 24.05.16.
 */
/**
 * Created by root on 23.05.16.
 */

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
        "dijit/TitlePane",
        "dojo/text!./templates/TableControlPanel.html",
        '../../FilterControlPanel/widget/FilterControlPanel',
        '../../FilteredGrid/widget/FilteredGrid',
        '../../FilterEditor/util/FilterParser',
        '../../Util/GetTableColumnWithConfig',
        './LoadGridSetting',
        './SaveGridSetting'
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
              TitlePane,
              templates,
              FilterControlPanel,
              FilteredGrid,
              FilterParser,
              GetTableColumnWithConfig,
              LoadGridSetting,
              SaveGridSetting) {
        return declare([_WidgetBase, _TemplatedMixin], {
            name: "no-name",

            title: "No Name Table",

            templateString: templates,

            baseClass: "filteredGrid",

            filteredGridOption: {
                store: null,
                columns: null,

            },
            filterControlPanelOption: {
                store: null,
                columns: null,
            },
            _rowSelected: null,

            constructor: function (object) {
                this.inherited(arguments);

                var self = this;

                if (object !== null && object !== undefined) {
                    for (var index in object) {
                        if (object.hasOwnProperty(index)) {
                            self[index] = object[index];
                        }
                    }
                }

                self.filterControlPanelOption.name = self.name;
                self.filteredGridOption.name = self.name;
                self.tableColumnWithConfig = new GetTableColumnWithConfig({name: self.name})
            },

            buildRendering: function () {
                this.inherited(arguments);
                var self = this;

                self.table = new FilteredGrid(self.filteredGridOption);

                dom.byId(self.tableNode).appendChild(self.table.domNode);

                self.filterControlPanel = new FilterControlPanel(self.filterControlPanelOption);

                self.filtersTP = new TitlePane({
                    title: "Фильтры",
                    open: false,
                    content: self.filterControlPanel.domNode
                });

                /**
                 * onClick emit set-filter notification
                 */
                this.saveGridSettingBtn = new Button({
                    label: "Сохранить натсройки таблици",
                }, self.saveGridSettingBtnNode);

                /**
                 * onClick emit remove-filter notification
                 */
                this.loadGridSettingBtn = new Button({
                    label: "Загрузить натсройки таблици",
                }, self.loadGridSettingBtnNode);

                self.topPageMenuNode.appendChild(self.filtersTP.domNode);

                self.saveGridSettingDialog = new SaveGridSetting({name:self.name});
                self.saveGridSettingDialog.exec = function (configName) {
                    var store = self.tableColumnWithConfig.getStore();
                    var columns = self.table.getConfig();
                    array.forEach(columns, function (column) {
                        delete column.grid;
                        delete column.headerNode;
                    });
                    var preference = JSON.stringify(columns);
                    store.add({
                        name: configName,
                        tableName: self.name,
                        preference: preference,
                    });
                };
                self.loadGridSettingDialog = new LoadGridSetting({name:self.name});
                self.loadGridSettingDialog.exec  = function (columns) {
                    self.table.setColumns(columns);
                };
            },

            postCreate: function () {
                var self = this;
                // Get a DOM node reference for the
                var domNode = this.domNode;
                // Run any parent postCreate proces
                this.inherited(arguments);
                this.own(
                    on(self.filterControlPanel, "set-filter", function (e) {
                        try {
                            var selectedRow = e.selectRow;
                        } catch (e) {
                            alert("Фильтр не выбран");
                        }
                        if (selectedRow !== null && selectedRow !== undefined) {
                            var filterParser = new FilterParser();

                            /* var data = filterParser.parseRQLToData(selectedRow.filter, 0, null);
                            var dataObject = filterParser.stackToObject(data);
                            dataObject = filterParser.optimiseFilter(dataObject, dataObject.type);
                            var filter = filterParser.filterParse(dataObject[0], 0, null);
                            self.table.refresh({
                                name: selectedRow.name,
                                filter: filter
                            });*/
                            //selectedRow.filter += "&select(id,count(id),max(id),min(id))";
                            self.table.setRqlFilter(selectedRow);
                        } else {
                            alert("Фильтр не выбран");
                        }
                    }),

                    on(self.saveGridSettingBtn, "click", function () {
                        self.saveGridSettingDialog.show();
                    }),

                    on(self.loadGridSettingBtn, "click", function () {
                        self.loadGridSettingDialog.show();
                    }),
                    on(self.table, "dgrid-select", function (event) {
                        self.emit("dgrid-select", event);
                    })
                    /*self.saveGridSettingDialog.on("save-config", function (event) {
                        if (event !== null &&
                            event !== undefined &&
                            event.configName !== null &&
                            event.configName !== undefined) {

                            var store = self.tableColumnWithConfig.getStore();
                            var columns = self.table.getConfig();
                            store.add({
                                name: event.configName,
                                tableName: self.name,
                                preference: JSON.stringify(columns)
                            });
                        }
                    }),
                    self.loadGridSettingDialog.on("load-config", function (event) {
                        if (event !== null &&
                            event !== undefined &&
                            event.columns !== null &&
                            event.columns !== undefined) {

                            var columns = event.columns;
                            self.table.setColumns(columns);
                        }
                    })*/
                );
            },

            startup: function () {
                this.inherited(arguments);

                this.table.startup();
                this.filterControlPanel.startup();
                this.filtersTP.startup();
            },

            destroy: function () {
                var self = this;
                self.filtersTP.destroyRecursive();
                self.saveGridSettingBtn.destroyRecursive();
                self.loadGridSettingBtn.destroyRecursive();
                self.saveGridSettingDialog.destroyRecursive();
                self.loadGridSettingDialog.destroyRecursive();

                // /domConstruct.destroy("someId");
            }

        });
    }
);