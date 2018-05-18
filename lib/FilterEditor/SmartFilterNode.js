/**
 * Created by root on 29.04.16.
 */
define(
    [
        'dojo/_base/declare',
    ],
    function (declare) {
        return declare(null, {
            id: null,
            type: null,
            name: null,
            value: null,
            parentID: null,
            children: [],
            mayHawChild: true,

            constructor: function (type, id, parentID) {
                var self = this;
                self.type = type;
                self.id = id;
                self.parentID = parentID;
                self.children = [];
            }
        });
    });