define([
        'dojo/_base/declare',
        'dojo/_base/lang',
        'dojo/_base/array',
        'dojo/aspect',
        "dojo/dom",
        "dojo/dom-construct",
        'dojo/on',
        "dojo/query",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "../factory/DViewerFactory",
        "dojo/text!../templates/initDataViewer.html"
    ], function (declare,
                 lang,
                 array,
                 aspect,
                 dom,
                 domConstruct,
                 on,
                 query,
                 _WidgetBase,
                 _TemplatedMixin,
                 DViewerFactory,
                 templates) {
        return declare([_WidgetBase, _TemplatedMixin], {
            templateString: templates,
            grid: null,
            url: null,
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
            },
            renderGrid: function (url) {
                var self = this;
                //destroy grid if it exist;
                if (self.grid) {
                    self.grid.destroyRecursive();
                }
                var def = DViewerFactory(url, self.gridConfig);
                def.then(function (grid) {
                    console.log(url+'render grid');
                    //generate Grid with dstore
                    self.grid = grid;
                    //place grid to DOM
                    self.grid.placeAt(self.gridNode);
                    //startup grid
                    self.grid.startup();
                }, function (error) {
                    alert("REMOTE DATASTORE ERROR!\n" + error);
                    throw EventException(error);
                });
            },
            startup: function () {
                this.inherited(arguments);
                this.renderGrid(this.url);
            },

            destroyRecursive: function () {
                this.inherited(arguments);
                var self = this;

                //destroy widget
                self.urlGetDialog.destroyRecursive();
                self.grid.destroyRecursive();
            }
        });
    }
);