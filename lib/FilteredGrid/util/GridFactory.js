/**
 * Created by root on 25.05.16.
 */
/**
 * Created by root on 19.05.16.
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

        'dgrid/Grid',
        'dgrid/Keyboard',
        'dgrid/Selection',
        'dgrid/extensions/Pagination',
        'dgrid/extensions/ColumnHider',
        'dgrid/extensions/ColumnReorder',
        'dgrid/extensions/ColumnResizer',
        'dgrid/_StoreMixin',

        'dstore/Rest',
        'dstore/RequestMemory',
        'dstore/Trackable',
        'dstore/Filter',

        '../../Util/GetTableColumnWithConfig',
        '../../extensions/Grid/GridRqlFilter'
    ],
    function (declare,
              lang,
              array,
              dom,
              domConstruct,
              on,
              parser,
              Grid,
              Keyboard,
              Selection,
              Pagination,
              ColumnHider,
              ColumnReorder,
              ColumnResizer,
              _StoreMixin,
              Rest,
              RequestMemory,
              Trackable,
              Filter,
              GetTableColumnWithConfig,
              GridRqlFilter) {

        var gridMixinNameToConstructor = {
            "Grid": Grid,
            "Keyboard": Keyboard,
            "Selection": Selection,
            "Pagination": Pagination,
            "ColumnHider": ColumnHider,
            "ColumnReorder": ColumnReorder,
            "ColumnResizer": ColumnResizer,
            "_StoreMixin": _StoreMixin,
            "GridRqlFilter": GridRqlFilter
        };


        /*
         conf{
         name: "",
         configName: "",
         options: [],
         declare: [],
         domNode: node,
         }
         */
        return function (conf) {

            //configStore = store;

            var declareArray = [];
            var option = conf.options;

            var grid = null;

            array.forEach(conf.declare, function (item) {
                declareArray.push(gridMixinNameToConstructor[item]);
            });

            if (option.columns === null || option.columns === undefined) {
                var getTableConf = new GetTableColumnWithConfig({name: conf.name});
                var columnWithConf = getTableConf.getColumn(conf.configName, conf.name);
            }

            grid = new (declare(declareArray))(option, conf.domNode);

            if (option.columns === null || option.columns === undefined) {
                columnWithConf.then(function (columns) {
                    if (columns !== null) {
                        grid.set('columns', columns);
                    }
                });
            }

            return grid;
        }
    }
);