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
        "dojo/Deferred",
        "dstore/Rest",
        'dstore/Trackable',
        'Rscript/extensions/Store/StoreRqlFilter',
        "./GridFactory"
    ], function (declare,
                 lang,
                 array,
                 dom,
                 domConstruct,
                 on,
                 query,
                 Deferred,
                 Rest,
                 Trackable,
                 StoreRqlFilter,
                 GridFactory) {
        //get one item from dataStore for check it valid
        var getItem = function (url) {
            var xhr = new XMLHttpRequest();
            var rql = 'limit(1)';
            xhr.open('GET', url + '?' + rql, false);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Accept', 'application/json');
            xhr.send();
            if (xhr.status == 200) {
                var jsonResp;
                try {
                    jsonResp = JSON.parse(xhr.responseText);
                } catch (e) {
                    jsonResp = null;
                }
            } else {
                //error handle;
                jsonResp = null;
            }

            return jsonResp;
        };

        //generate grid columns from item.
        var itemDataToColumn = function (itemData) {
            var columns = [];
            var respObj = itemData[0];
            for (var column in respObj) {
                if (respObj.hasOwnProperty(column)) {
                    columns.push({label: column, field: column});
                }
            }
            return columns;
        };

        // Build dstore and grid.
        return function (url, gridConfig) {
            var def = new Deferred();
            var grid = null;
            if (url !== null && url !== undefined) {
                var dstore = new (declare([StoreRqlFilter, Trackable]))({
                    target: url
                });
                dstore.fetchRange({
                    start: 0,
                    end: 1
                }).then(function (result) {
                    if (result !== null && result !== undefined) {
                        var column = itemDataToColumn(result);
                        if (gridConfig == null && gridConfig == undefined) {
                            gridConfig = {};
                        }
                        gridConfig.columns = column;
                        gridConfig.dstore = dstore;
                        grid = GridFactory(gridConfig);
                        def.resolve(grid);
                    }
                }, function (error) {
                    def.reject(error);
                });
            } else {
                def.reject("Url not set!");
            }
            return def;
        }
    }
);