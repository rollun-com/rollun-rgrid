define([
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dijit/form/Button",
        "dijit/form/TextBox",
        "dojo/on",
        "dojo/keys",

        "dojo/text!./templates/SearchBar.html"
    ],
    function (declare,
              lang,
              _WidgetBase,
              _TemplatedMixin,
              Button,
              TextBox,
              on,
              keys,
              templates) {
        return declare([_WidgetBase, _TemplatedMixin], {
            name: "searchBar",
            context: null,
            templateString: templates,

            constructor: function (paramsObject) {
                this.inherited(arguments);
                if (paramsObject !== null && paramsObject !== undefined) {
                    for (var index in paramsObject) {
                        if (paramsObject.hasOwnProperty(index)) {
                            this[index] = paramsObject[index];
                        }
                    }
                }
            },

            buildRendering: function () {
                this.inherited(arguments);
                this.own(
                    this.searchTextfield = new TextBox({
                        placeholder: "Поиск по таблице",
                    }, this.searchBarNode),
                    this.searchButton = new Button({
                        label: "Искать",
                    }, this.searchButtonNode)
                )
            },

            postCreate: function () {
                var self = this;
                on(this.searchButton, "click", lang.hitch(self, function (evt) {
                    self.doSearch(evt);
                }));
                on(this.searchTextfield, "keypress", lang.hitch(self, function (evt) {
                    if (evt.charOrCode === keys.ENTER) {
                        self.doSearch(evt);
                    }
                }));
            },

            doSearch: function (clickEvent) {
                var searchValue = this.searchTextfield.textbox.value;
                var columnNames = this._getColumnNames(this.context.grid);
                var searchRql = "or(" + this._buildSearchQuery(searchValue, columnNames);
                searchRql = searchRql.replace(/,+$/, '');
                searchRql += ")";
                var searchFilter = {
                    id: "search",
                    name: "Поиск",
                    filter: searchRql,
                };
                this.context.setRqlFilter(searchFilter);
                clickEvent.filter = searchFilter;
                clickEvent.detail = '';
                on.emit(this.searchButton.domNode, "search", clickEvent);
            },

            /**
             * @param {object} grid - dgrid grid object
             */
            _getColumnNames: function (grid) {
                var columnNames = [];
                for (var column in grid.columns) {
                    if (grid.columns.hasOwnProperty(column)) {
                        var columnName = grid.columns[column].field;
                        columnNames.push(columnName)
                    }
                }
                return columnNames;
            },

            /**
             * @param {string} searchValue
             * @param {array} columnNames
             * @return {string}
             */
            _buildSearchQuery: function (searchValue, columnNames) {
                var searchQuery = '';
                for (var count = 0; count < columnNames.length; count++) {
                    var columnName = columnNames[count];
                    searchQuery += "contains(" + columnName + "," + searchValue + "),"
                }
                return searchQuery;
            },
        })
    }
);