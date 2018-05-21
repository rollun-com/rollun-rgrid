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
        'dojo/when',
        'dojo/Deferred',

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
              when,
              Deferred,
              template) {
        return declare([_WidgetBase, _TemplatedMixin], {
            name: "searchBar",
            templateString: template,
            filterStore: null,
            class: 'rgrid-search-bar, items-right-aligned',

            constructor: function (params) {
                this.inherited(arguments);
                if (typeof params.filterStore === 'object') {
                    this.filterStore = params.filterStore;
                }
            },

            buildRendering: function () {
                this.inherited(arguments);
                this.own(
                    this.searchTextfield = new TextBox({
                        placeholder: "Поиск по таблице",
                        clas: 'form-control'
                    }, this.searchBarNode),
                    this.searchButton = new Button({
                        label: "Искать",
                        iconClass: "flat-search",
                        class: "alt-info"
                    }, this.searchButtonNode)
                );
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
                const searchValue = this.searchTextfield.textbox.value,
                    columnNames = this._getColumnNames();
                when(columnNames, function (columnNames) {
                    const searchQuery = this._buildSearchQuery(searchValue, columnNames);
                    this._eventBus.emit('loadGridContentForQuery', {query: searchQuery});
                    if (this.filterStore) {
                        this.filterStore.put({
                            id: "search",
                            name: "Поиск",
                            filter: searchQuery.toString(),
                        });
                    }
                });
            },

            _getColumnNames: function () {
                let columnNames;
                if (this._columnNames) {
                    columnNames = this._columnNames;
                } else {
                    columnNames = this._getColumnNamesFromGrid();
                }
                return columnNames;
            },

            _getColumnNamesFromGrid: function () {
                const deferred = new Deferred();
                on(this._eventBus, 'gridColumnNames', function (event) {
                    deferred.resolve(event.columnNames);
                });
                this._eventBus.emit('getGridColumnNames');
                return deferred.promise;
            },

            /**
             * @param {string} searchValue
             * @param {array} columnNames
             * @return {string}
             */
            _buildSearchQuery: function (searchValue, columnNames) {
                const searchQueryArgs = [],
                    searchQuery = new Query.Query({name: 'or', args: []});
                for (let count = 0; count < columnNames.length; count++) {
                    const containsNode = new Query.Query({
                        name: 'contains',
                        args: [columnNames[count], searchValue]
                    });
                    searchQueryArgs.push(containsNode);
                }
                searchQuery.args = searchQueryArgs;
                return searchQuery;
            },
        });
    }
);