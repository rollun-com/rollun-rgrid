/**
 * Created by victorsecuring on 25.11.16.
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

        "dijit/ConfirmDialog",
        "dijit/form/TextBox",
        "dijit/form/Form"
    ], function (declare,
                 lang,
                 array,
                 dom,
                 domConstruct,
                 on,
                 query,
                 _WidgetBase,
                 ConfirmDialog,
                 TextBox,
                 Form) {
        return declare([_WidgetBase], {
            form: null,
            createGridDialog: null,

            constructor: function (object) {
                this.inherited(arguments);
                //init fields if any were set;
                var self = this;
                self._beingDestroyed = false;
            },

            buildRendering: function () {
                this.inherited(arguments);
                var self = this;
                //create form for get url;
                self.form = new Form({
                    id: 'formUrlGet',
                });

                //create textBox and add in form;
                new TextBox({
                    name: 'url',
                    placeHolder: "http://",
                }).placeAt(self.form.containerNode);

                // create dialog if he dosn't  created before.
                if (!self.createGridDialog) {
                    self.createGridDialog = new ConfirmDialog({
                        title: 'Url for data',
                        content: self.form,
                        style: 'width:600px;',
                        execute: function () {
                            //get form
                            var f = query("#formUrlGet")[0];
                            //get url value;
                            var url = f['url'].value;
                            self.sentUrl(url);
                        },
                        onCancel: function () {

                        }
                    });
                }
            },

            sentUrl: function(url)
            {
                var self = this;
                self.emit("setUrl", {
                    url: url,
                    detail: {},
                    cancelable: false,
                });
            },

            show: function()
            {
                this.createGridDialog.show();
            },

            postCreate: function () {
                var self = this;
                this.inherited(arguments);
                self._started = true;
            },

            startup: function () {
                this.inherited(arguments);
            },

            destroyRecursive: function () {
                this.inherited(arguments);
                var self = this;
                this._beingDestroyed = true;
                //destroy widget
                self.form.destroyRecursive();
                self.createGridDialog.destroyRecursive();
            }
        });
    }
)
;