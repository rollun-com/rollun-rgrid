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
        "dojo/text!./templates/DataPreviewControlPanel.html",
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
              templates) {
        return declare([_WidgetBase, _TemplatedMixin], {
            name: "no-name",

            title: "No Name Table",

            templateString: templates,

            baseClass: "filteredGrid",

            dataViewer: null,
            filterControlPanel: null,

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
                if (self.dataViewer === null ||
                    self.filterControlPanel === null ||
                    self.dataViewer === undefined ||
                    self.filterControlPanel === undefined) {
                    throw "Table or filter control panel not set;";
                }
            },

            buildRendering: function () {
                this.inherited(arguments);
                var self = this;

                dom.byId(self.dataPreviewNode).appendChild(self.dataViewer.domNode);

                self.filtersTP = new TitlePane({
                    title: "Фильтры",
                    open: false,
                    content: self.filterControlPanel.domNode
                });

                dom.byId(self.topPageMenuNode).appendChild(self.filtersTP.domNode);
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
                            self.dataViewer.setRqlFilter(selectedRow);
                        } else {
                            alert("Фильтр не выбран");
                        }
                    })
                );
            },

            startup: function () {
                this.inherited(arguments);

                this.dataViewer.startup();
                this.filterControlPanel.startup();
                this.filtersTP.startup();
            },

            destroyRecursive: function () {
                this.inherited(arguments);
                var self = this;
                self.filtersTP.destroyRecursive();

                if(dom.byId(self.filtersTP.domNode)){
                    domConstruct.destroy(dom.byId(self.filtersTP.domNode));
                }
                self.dataViewer.destroyRecursive();
                if(dom.byId(self.dataViewer.domNode)){
                    domConstruct.destroy(dom.byId(self.dataViewer.domNode));
                }
                self.filterControlPanel.destroy();
                if(dom.byId(self.filterControlPanel.domNode)){
                    domConstruct.destroy(dom.byId(self.filterControlPanel.domNode));
                }
                // /domConstruct.destroy("someId");
            }
        });
    }
);