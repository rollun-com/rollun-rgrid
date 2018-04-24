define([
    'dojo/_base/declare',
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    'Rscript/extensions/Store/QueryableStore',

    "dojo/text!../templates/RgridComposite.html"
], function (declare,
             _WidgetBase,
             _TemplatedMixin,
             QueryableStore,
             template) {
    declare('rgridComposite', [_WidgetBase, _TemplatedMixin], {
        templateString: template,

        constructor: function (dataStoreUrl, filterStoreUrl = '', configStoreUrl = '') {
            if (typeof dataStoreUrl === 'string') {
                this.dataStore = new QueryableStore(dataStoreUrl);
            } else {
                throw new Error('dataStoreUrl is not a string')
            }
            if (filterStoreUrl) {
                this.filterStore = new QueryableStore(filterStoreUrl);
            }
            if (configStoreUrl) {
                this.configStore =  new QueryableStore(configStoreUrl);
            }
        },


    })
});