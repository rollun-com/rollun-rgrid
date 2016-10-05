/**
 * Created by root on 09.08.16.
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
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",

    "dojox/widget/TitleGroup",
    "dijit/TitlePane",

    "dojo/text!./templates/Composite.html"

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
             _WidgetBase,
             _TemplatedMixin,
             TitleGroup,
             TitlePane,
             templates) {

    return declare([_WidgetBase, _TemplatedMixin], {
        name: "no name",
        templateString: templates,
        components: [],

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
            //titleGroupNode
            self.titleGroup = new TitleGroup();

            dom.byId(self.titleGroupNode).appendChild(self.titleGroup.domNode);


            for (var key in self.components) {
                if (self.components.hasOwnProperty(key)) {
                    var component = self.components[key];
                    var title;

                    switch (true){
                        case (component.title !== null && component.title !== undefined && component.title !== '') :
                            title = component.title;
                            break;
                        case (component.name !== null && component.name !== undefined && component.name !== '') :
                            title = component.name;
                            break;
                        case (component.label !== null && component.label !== undefined && component.label !== '') :
                            title = component.label;
                            break;
                        default :
                            title = "Component №" + key;
                    }

                    self.titleGroup.addChild(new TitlePane({
                        open: false,
                        title: title,
                        content: component.domNode
                    }));
                }
            }
        },

        postCreate: function () {
            this.inherited(arguments);
            var self = this;

            this.own();
        },

        startup: function () {
            var self = this;
            for (var key in self.components) {
                if (self.components.hasOwnProperty(key)) {
                    var component = self.components[key];
                    component.startup();
                }
            }

            this.inherited(arguments);
        },

        addComponent: function (component) {
            var self = this;
            return self.titleGroup.addChild(new TitlePane({
                open: false,
                title: title,
                content: component.domNode
            }));
        },
        addTitlePane: function(titlePane){
            return this.titleGroup.addChild(titlePane);
        },

        removeChild: function(component){
            return this.titleGroup.removeChild(component);
        },
        selectChild: function(component){
            return this.titleGroup.selectChild(component);
        },

        destroyRecursive: function () {
            var self = this ;
            for (var key in self.components) {
                if (self.components.hasOwnProperty(key)) {
                    var component = self.components[key];
                    component.destroyRecursive();
                }
            }
        }
    });
});

