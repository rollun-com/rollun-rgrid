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

        "../factory/DViewerFactory",

        "dijit/ConfirmDialog",
        "dijit/form/TextBox",
        "dijit/form/Form",
        "dojo/text!../templates/initQuery.html"
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
                 DViewerFactory,
                 ConfirmDialog,
                 TextBox,
                 Form,
                 templates) {
        return declare([_WidgetBase, _TemplatedMixin], {
            templateString: templates,
            grid: null,
            form: null,
            createGridDialog: null,
            //Has conf for change store filter
            gridConfig: null,


            constructor: function (object) {
                this.inherited(arguments);

                //init fields if any were set;
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
                        id: 'urlGetDialog',
                        title: 'Url for data',
                        content: self.form,
                        style: 'width:600px;',
                        execute: function () {
                            //get form
                            var f = query("#formUrlGet")[0];
                            //get url value;
                            var url = f['url'].value;
                            //destroy grid if it exist;
                            if (self.grid) {
                                self.grid.destroyRecursive();
                            }
                            //generate Grid with dstore
                            self.grid = DViewerFactory(url, self.gridConfig);
                            //place grid to DOM
                            self.grid.placeAt(self.gridNode);
                            //startup grid
                            self.grid.startup();
                        },
                        onCancel: function () {
                        }
                    });
                }
            },

            postCreate: function () {
                var self = this;
                this.inherited(arguments);
                //set click button handler
                this.own(
                    on(self.setUrlButtonNode, "click", function () {
                        self.createGridDialog.show();
                    })
                );
            },

            startup: function () {
                this.inherited(arguments);
            },

            destroyRecursive: function () {
                this.inherited(arguments);
                var self = this;

                //destroy widget
                self.form.destroyRecursive();
                self.createGridDialog.destroyRecursive();
                self.grid.destroyRecursive();
            }
        });
    }
)
;