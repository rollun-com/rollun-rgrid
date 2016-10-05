/**
 * Created by root on 26.05.16.
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

        'dstore/Memory',
        'dstore/Request',
        'dstore/Rest',
        'dstore/RequestMemory',
        'dstore/LocalDB',
        'dstore/Cache',
        'dstore/Tree',
        'dstore/Trackable',
        '../../extensions/Store/StoreRqlFilter',
    ],
    function (declare,
              lang,
              array,
              dom,
              domConstruct,
              on,
              parser,
              Memory,
              Request,
              Rest,
              RequestMemory,
              LocalDB,
              Cache,
              Tree,
              Trackable,
              StoreRqlFilter) {

        var storeNameToConstructor = {
            "Memory": Memory,
            "Request": Request,
            "Rest": Rest,
            "RequestMemory": RequestMemory,
            "LocalDB": LocalDB,
            "Cache": Cache,
            "Tree": Tree,
            "Trackable": Trackable,
            "StoreRqlFilter": StoreRqlFilter
        };

        return function createStore(storeConfig) {

            var declareArray = [];

            array.forEach(storeConfig['declare'], function (item) {
                declareArray.push(storeNameToConstructor[item]);
            });

            return new (declare(declareArray))(storeConfig.options);
        }
    });


