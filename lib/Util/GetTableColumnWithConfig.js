/**
 * Created by root on 27.05.16.
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
        'dstore/Store',
        'dstore/Rest',
        'dstore/RequestMemory',
        'dstore/Trackable',
        'dstore/Filter',
        "dojo/Deferred",
    ],
    function (declare,
              lang,
              array,
              dom,
              domConstruct,
              on,
              parser,
              Store,
              Rest,
              RequestMemory,
              Trackable,
              Filter,
              Deferred) {
        var configStore = new (declare([Rest, Trackable]))({
            target: "/rest/configuration"
        });

        return declare([], {
            name: null,
            _store: configStore,

            constructor: function (object) {
                var self = this;

                if (object !== null && object !== undefined) {
                    for (var index in object) {
                        if (object.hasOwnProperty(index)) {
                            self[index] = object[index];
                        }
                    }
                }
            },

            getColumn: function (name, tableName) {
                var columns = null;

                var filter = (new Filter()).and((new Filter()).eq("tableName", tableName), (new Filter()).eq("name", name));

                var async = function () {
                    var def = new Deferred();
                    configStore.filter(filter).fetch().then(function (items) {
                        var col = items;
                        if(col !== null && col !== undefined &&
                            col[0] !== null && col[0] !== undefined &&
                            col[0].preference !== null && col[0].preference !== undefined){
                            var colum = JSON.parse(col[0].preference);
                            def.resolve(colum);
                        }else{
                            def.reject();
                        }
                    });
                    return def.promise;
                };


                return async();
            },

            setStore: function (store) {
                var self = this;
                if(store instanceof Store){
                    self._store = store;
                }
            },

            getStore: function () {
                var self = this;
                return self._store;
            }
        });
    }
);