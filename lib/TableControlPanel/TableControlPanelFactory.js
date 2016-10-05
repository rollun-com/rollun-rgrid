/**
 * Created by root on 25.05.16.
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
        './widget/TableControlPanel',
        './data/tables',

        'dstore/Store',
        'dstore/Memory',
        'dstore/Request',
        'dstore/Rest',
        'dstore/RequestMemory',
        'dstore/LocalDB',
        'dstore/Cache',
        'dstore/Tree',
        'dstore/Trackable',

        '../FilteredGrid/util/GridFactory',
        '../extensions/Store/StoreRqlFilter',
    ],
    function (declare,
              lang,
              array,
              dom,
              domConstruct,
              on,
              parser,
              TableControlPanel,
              tables,
              Store,
              Memory,
              Request,
              Rest,
              RequestMemory,
              LocalDB,
              Cache,
              Tree,
              Trackable,
              GridFactory,
              StoreRqlFilter
    ) {

        var storeNameToConstructor = {
            "Memory": Memory,
            "Request": Request,
            "Rest": Rest,
            "RequestMemory": RequestMemory,
            "LocalDB": LocalDB,
            "Cache": Cache,
            "Tree": Tree,
            "Trackable": Trackable,
            "Store": Store,
            "StoreRqlFilter":StoreRqlFilter

        };

        function createStore(storeConfig) {

            var declareArray = [];

            array.forEach(storeConfig['declare'], function (item) {
                declareArray.push(storeNameToConstructor[item]);
            });

            return new (declare(declareArray))(storeConfig.options);
        }

        /**
         * gridStore non require store for grid
         */
        return function (name, gridStore) {
            //TODO create check exist table in config

            var filteredGridOption = {};

            if (tables[name]["filteredGridOption"]["grid"]["options"] !== null &&
                tables[name]["filteredGridOption"]["grid"]["options"] !== undefined) {
                //noinspection JSDuplicatedDeclaration
                filteredGridOption["options"] = tables[name]["filteredGridOption"]["grid"]["options"];

                /*for (var index in tables[name]["filteredGridOption"]["grid"]["options"]) {
                    if (tables[name]["filteredGridOption"]["grid"]["options"].hasOwnProperty(index)) {
                        filteredGridOption["options"][index] = tables[name]["filteredGridOption"]["grid"]["options"][index];
                    }
                }*/
            }

            if (tables[name]["filteredGridOption"]["grid"]["declare"] !== null &&
                tables[name]["filteredGridOption"]["grid"]["declare"] !== undefined) {
                filteredGridOption["declare"] = tables[name]["filteredGridOption"]["grid"]["declare"];
                /*array.forEach(tables[name]["filteredGridOption"]["grid"]["declare"], function (item) {
                    filteredGridOption["declare"].push(item);
                });*/
            }

            if(gridStore !== null && gridStore !== undefined && gridStore instanceof Store){
                filteredGridOption["options"]["collection"] = gridStore;
            }else{
                filteredGridOption["options"]["collection"] = createStore(tables[name]["filteredGridOption"]["store"]);
            }



            //======================================================================================

            var filterControlPanelOption = {
                "store": createStore(tables[name]["filterControlPanelOption"]["store"])
            };

            if (tables[name]["filterControlPanelOption"]["options"] !== null &&
                tables[name]["filterControlPanelOption"]["options"] !== undefined) {
                //noinspection JSDuplicatedDeclaration
                for (var index in tables[name]["filterControlPanelOption"]["options"]) {
                    if (tables[name]["filterControlPanelOption"]["options"].hasOwnProperty(index)) {
                        filterControlPanelOption[index] = tables[name]["filterControlPanelOption"]["options"][index];
                    }
                }
            }

            return new TableControlPanel({
                "name": tables[name]["name"],
                "title": tables[name]["title"],
                "filteredGridOption": filteredGridOption,
                "filterControlPanelOption": filterControlPanelOption
            });
        }
    });