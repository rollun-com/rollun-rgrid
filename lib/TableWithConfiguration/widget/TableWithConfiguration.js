/**
 * Created by root on 15.08.16.
 */
define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/Deferred',
    'dojo/aspect',
    'dojo/dom-construct',
    'dojo/has',
    'dojo/dom',
    'dojo/on',
    'dojo/when',
    "dojox/charting/Chart",
    "dijit/form/Button",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    '../../Util/GetTableColumnWithConfig',

    './LoadGridSetting',
    './SaveGridSetting',

    "dojo/text!./templates/TableWithConfiguration.html"

], function (declare,
             lang,
             array,
             Deferred,
             aspect,
             domConstruct,
             has,
             dom,
             on,
             when,
             Chart,
             Button,
             _WidgetBase,
             _TemplatedMixin,
             GetTableColumnWithConfig,
             LoadGridSetting,
             SaveGridSetting,
             templates) {

    return declare([_WidgetBase, _TemplatedMixin], {
        name: "no-name",

        title: "No Name Table",

        templateString: templates,

        baseClass: "filteredGrid",
        /**
         * Table with
         */
        table: null,

        rql: null,

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

            self.tableColumnWithConfig = new GetTableColumnWithConfig({name: self.name})
        },

        buildRendering: function () {
            this.inherited(arguments);
            var self = this;
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

            self.saveGridSettingDialog = new SaveGridSetting({name: self.name});

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

            self.loadGridSettingDialog = new LoadGridSetting({name: self.name});

            self.loadGridSettingDialog.exec = function (columns) {
                self.table.setColumns(columns);
            };
            domConstruct.place(self.table.domNode, self.tableNode, "only");
        },

        postCreate: function () {
            this.inherited(arguments);
            var self = this;
            self.own(
                on(self.saveGridSettingBtn, "click", function () {
                    self.saveGridSettingDialog.show();
                }),
                on(self.loadGridSettingBtn, "click", function () {
                    self.loadGridSettingDialog.show();
                }),
                on(self.table, "dgrid-select", function (e) {
                    on.emit(self, "dgrid-select", e);
                }),
                on(self.table, "dgrid-deselect", function (e) {
                    on.emit(self, "dgrid-deselect", e);
                })
            );
        },

        startup: function () {
            this.inherited(arguments);
            var self = this;
            self.table.startup();

        },

        destroyRecursive: function () {
            this.inherited(arguments);
            var self = this;

            self.saveGridSettingBtn.destroyRecursive();
            if (dom.byId(self.saveGridSettingBtn.domNode)) {
                domConstruct.destroy(dom.byId(self.saveGridSettingBtn.domNode));
            }
            self.loadGridSettingBtn.destroyRecursive();
            if (dom.byId(self.loadGridSettingBtn.domNode)) {
                domConstruct.destroy(dom.byId(self.loadGridSettingBtn.domNode));
            }
            self.saveGridSettingDialog.destroyRecursive();
            if (dom.byId(self.saveGridSettingDialog.domNode)) {
                domConstruct.destroy(dom.byId(self.saveGridSettingDialog.domNode));
            }
            self.loadGridSettingDialog.destroyRecursive();
            if (dom.byId(self.loadGridSettingDialog.domNode)) {
                domConstruct.destroy(dom.byId(self.loadGridSettingDialog.domNode));
            }
        },

        refresh: function (filter) {
            return this.table.refresh(filter)
        },
        clear: function () {
            return this.table.clear()
        },
        getConfig: function () {
            return this.table.getConfig()
        },
        setColumns: function (columns) {
            this.table.setColumns(columns)
        },
        setRqlFilter: function (filter) {
            this.table.setRqlFilter(filter)
        },

    })
});