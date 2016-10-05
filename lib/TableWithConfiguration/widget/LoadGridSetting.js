/**
 * Created by root on 27.05.16.
 */

define(
    [
        'dojo/_base/declare',
        'dojo/_base/lang',
        'dojo/_base/array',
        "dojo/dom",
        "dojo/query",
        "dojo/dom-construct",
        'dojo/on',
        "dojo/parser",
        "dijit/_WidgetBase",
        "dojox/layout/TableContainer",
        "dijit/form/Form",
        "dijit/form/Select",
        "dijit/form/Button",
        "dijit/ConfirmDialog",

        "../../Util/GetTableColumnWithConfig",

    ],
    function (declare,
              lang,
              array,
              dom,
              query,
              domConstruct,
              on,
              parser,
              _WidgetBase,
              TableContainer,
              Form,
              Select,
              Button,
              ConfirmDialog,
              GetTableColumnWithConfig) {
        return declare([_WidgetBase], {
            name: "no-name",
            confirmDialog: {
                style: "width: 450px",
                title: "Загрузить настройки",
            },
            baseClass: "loadConfig",

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
            },

            buildRendering: function () {
                this.inherited(arguments);
                var self = this;

                self.loadConfigForm = new Form({
                    id: "loadConfigForm" + self.name,
                    doLayout: true
                });

                self.loadConfigConfirmDialog = new ConfirmDialog({
                    title: self.confirmDialog.title,
                    style: self.confirmDialog.style,
                    content: self.loadConfigForm,
                    execute: function () {
                        var form = query("#loadConfigForm" + self.name)[0];
                        var select = form["selectConfig"].value;
                        try{
                            select = JSON.parse(select);
                        }catch (e){}

                        var event = {
                            columns: select,
                            detail: ""
                        };
                        self.exec(select);
                        
                        //self.destroy();
                    }
                })

            },

            postCreate: function () {
                var self = this;
                // Get a DOM node reference for the
                var domNode = this.domNode;
                // Run any parent postCreate proces
                this.inherited(arguments);
                this.own(

                );
            },

            startup: function () {
                this.inherited(arguments);


            },

            destroy: function () {
                var self =this;
                domConstruct.destroy(self.domNode);

                if (self.loadConfigForm !== null &&
                    self.loadConfigForm !== undefined &&
                    dom.byId("loadConfigForm" + self.name)) {

                    self.loadConfigForm.destroyRecursive();
                    self.loadConfigForm = null;

                    try {
                        domConstruct.destroy("loadConfigForm" + self.name);
                    } catch (e) {}
                }
                if (self.loadConfigConfirmDialog !== null &&
                    self.loadConfigConfirmDialog !== undefined) {

                    self.loadConfigConfirmDialog.destroyRecursive();
                    self.loadConfigConfirmDialog = null;

                    /*try {
                        domConstruct.destroy("filterCreateDialog");
                    } catch (e) {}*/
                }
            },
            
            show: function () {
                var self = this;

                var selectOptions = [];

                var tableColumnWithConfig = new GetTableColumnWithConfig({name: self.name});

                var store = tableColumnWithConfig.getStore();

                store.fetch().then(function (results) {
                    results.forEach(function (item) {
                        selectOptions.push({
                            label: item.name,
                            value: item.preference
                        });
                    });
                });
                var formContainer = new TableContainer(
                    {
                        cols: 1,
                        customClass: "labelsAndFields",
                        "labelWidth": "200"
                    }
                );

                var selectConfig = new Select({
                    label: "Выберете сохранненую настройку",
                    name: "selectConfig",
                    options: selectOptions
                });
                formContainer.addChild(selectConfig);

                self.loadConfigForm.containerNode.innerHTML = '';

                formContainer.placeAt(self.loadConfigForm);

                self.loadConfigConfirmDialog.show();
            }

        });
    }
);