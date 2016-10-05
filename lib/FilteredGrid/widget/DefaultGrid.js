/**
 * Created by root on 19.05.16.
 */
define(
    [
        '../../../dojo/dojo/_base/declare',
        'dgrid/Grid',
        'dgrid/Keyboard',
        'dgrid/Selection',
        'dgrid/extensions/Pagination',
        'dgrid/extensions/ColumnHider',
        'dgrid/extensions/ColumnReorder',
        'dgrid/extensions/ColumnResizer',
        'dgrid/_StoreMixin'
    ],
    function (declare,
              Grid,
              Keyboard,
              Selection,
              Pagination,
              ColumnHider,
              ColumnReorder,
              ColumnResizer,
              _StoreMixin
    ) {
        return declare([Grid, Keyboard, Selection, Pagination, ColumnHider, ColumnResizer, _StoreMixin]);
    }
);