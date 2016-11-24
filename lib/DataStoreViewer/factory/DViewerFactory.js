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
            var grid = null;
            if (url !== null && url !== undefined) {
                var dstore = new (declare([StoreRqlFilter, Trackable]))({
                    target: url
                });


                var respData = getItem(url);
                if (respData !== null && respData !== undefined) {
                    var column = itemDataToColumn(respData);
                    if (gridConfig == null && gridConfig == undefined) {
                        gridConfig = {};
                    }
                    gridConfig.columns = column;
                    gridConfig.dstore = dstore;
                    grid = GridFactory(gridConfig);
                }
            } else {
                throw EventException("Url not set!");
            }
            return grid;
        }
    }
)
;