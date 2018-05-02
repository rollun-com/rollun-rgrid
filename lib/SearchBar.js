define([
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dijit/form/Button",
        "dijit/form/TextBox",
        "dojo/on",
        "dojo/keys",
        'rql/query',

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
              Query,
              template) {
        return declare([_WidgetBase, _TemplatedMixin], {
            name: "searchBar",
            templateString: template,
            grid: null,
            filterStore: null,

            constructor: function (params) {
                this.inherited(arguments);
                if (typeof params.grid === 'object') {
                    this.grid = params.grid;
                } else throw new TypeError('grid passed to searchBar is not an object');
                if (typeof params.configStore === 'object') {
                    this.configStore = params.configStore;
                }
                if (typeof params.filterStore === 'object') {
                    this.filterStore = params.filterStore;
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
                        iconClass: "flat-search",
                        class: "alt-info"
                    }, this.searchButtonNode)
                )
            },

            postCreate: function () {
                var self = this;
                on(this.searchButton, "click", lang.hitch(self, function (evt) {
                    self.doSearch();
                }));
                on(this.searchTextfield, "keypress", lang.hitch(self, function (evt) {
                    if (evt.charOrCode === keys.ENTER) {
                        self.doSearch();
                    }
                }));
            },

            doSearch: function () {
                var searchValue = this.searchTextfield.textbox.value;
                var columnNames = this._getColumnNames();
                var searchQuery = this._buildSearchQuery(searchValue, columnNames);
                this.grid.setFilter(searchQuery);
                this.grid.loadContent();
                if (this.filterStore) {
                    this.filterStore.put({
                        id: "search",
                        name: "Поиск",
                        filter: searchQuery.toString(),
                    })
                }
            },

            _getColumnNames: function () {
                var columnNames;
                if (this._configStore) {
                    columnNames = this._configStore.get('gridColumnNames');
                } else {
                    columnNames = this._getColumnNamesFromGrid();
                }
                return columnNames;
            },

            _getColumnNamesFromGrid: function () {
                var columns = this.grid.get('columns'),
                    columnNames = [];
                for (var column of columns) {
                    if (columns.hasOwnProperty(column)) {
                        var columnName = columns[column].field;
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
                var searchQuery = new Query.Query({name: 'or', args: []});
                for (var count = 0; count < columnNames.length; count++) {
                    searchQuery = searchQuery.contains(columnNames[count], searchValue)
                }
                searchQuery.name = 'or';//TODO: вынять костыль, вставить решение
                return searchQuery;
            },
        })
    }
);