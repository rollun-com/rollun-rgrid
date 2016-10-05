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
        "dijit/form/TextBox",
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
              TextBox,
              Button,
              ConfirmDialog,
              GetTableColumnWithConfig) {
        return declare([_WidgetBase], {
            name: "no-name",
            confirmDialog: {
                style: "width: 450px",
                title: "Сохранить конфигурацию таблици",
            },
            baseClass: "saveConfig",

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

                self.saveConfigForm = new Form({
                    id: "saveConfigForm" + self.name,
                    doLayout: true
                });

                var formContainer = new TableContainer(
                    {
                        cols: 1,
                        customClass: "labelsAndFields",
                        "labelWidth": "200"
                    }
                );

                var configName = new TextBox({
                    label: "ВВедите название данной конфигурации",
                    name: "configName",
                });

                self.saveConfigForm.innerHTML = "";
                formContainer.addChild(configName);
                formContainer.placeAt(self.saveConfigForm);

                self.saveConfigConfirmDialog = new ConfirmDialog({
                    title: self.confirmDialog.title,
                    style: self.confirmDialog.style,
                    content: self.saveConfigForm,
                    execute: function () {
                        var form = query("#saveConfigForm" + self.name)[0];
                        var configName = form["configName"].value;
                        var event = {
                            configName: configName,
                        };
                        //self.domNode.emit("save-config", event);
                        self.exec(configName);
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
                var self = this;


                if (self.saveConfigForm !== null &&
                    self.saveConfigForm !== undefined &&
                    dom.byId("saveConfigForm" + self.name)) {

                    self.saveConfigForm.destroyRecursive();
                    self.saveConfigForm = null;

                    try {
                        domConstruct.destroy("saveConfigForm" + self.name);
                    } catch (e) {
                    }
                }
                if (self.saveConfigConfirmDialog !== null &&
                    self.saveConfigConfirmDialog !== undefined) {

                    self.saveConfigConfirmDialog.destroyRecursive();
                    self.saveConfigConfirmDialog = null;

                    /*try {
                     domConstruct.destroy("filterCreateDialog");
                     } catch (e) {}*/
                }

                domConstruct.destroy(self.domNode);
            },
            show: function () {
                var self = this;

                self.saveConfigConfirmDialog.show();
            }

        });
    }
);