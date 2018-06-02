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
        'rgrid/mixins/_EventDriven',

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
			  _EventDriven,
              template) {
        return declare([_WidgetBase, _TemplatedMixin, _EventDriven], {
            name: "searchBar",
            templateString: template,
            filterStore: null,
            class: 'rgrid-search-bar, items-right-aligned',

            constructor: function (params) {
                this.inherited(arguments);
                if (params) {
                    if (typeof params.filterStore === 'object') {
                        this.filterStore = params.filterStore;
                    }
                }
            },

            buildRendering: function () {
                this.inherited(arguments);
                this.own(
                    this.searchTextfield = new TextBox({
                        placeholder: "Поиск по таблице",
                        class: 'form-control'
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
                on(this.searchButton, "click", lang.hitch(self, function () {
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
                    columnNames = this._getColumnNames(),
                    search = this;
                when(columnNames, function (columns) {
                    if (!Array.isArray(columns)){
                        columns = Object.assign([], columns);
                    }
                    const searchQuery = search._buildSearchQuery(searchValue, columns);
                    search.emit('loadGridContentForQuery', {query: searchQuery});
                    if (search.filterStore) {
                        search.filterStore.put({
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
                this.handleEvent('gridColumns', function (event) {
					deferred.resolve(event.columns);
				});
                this.emit('getGridColumns');
                return deferred.promise;
            },

            /**
             * @param {string} searchValue
             * @param {array} columns
             * @return {string}
             */
            _buildSearchQuery: function (searchValue, columns) {
                const searchQueryArgs = [],
                    searchQuery = new Query.Query({name: 'or', args: []});
                for (let count = 0; count < columns.length; count++) {
                    const column = columns[count];
                    const containsNode = new Query.Query({
                        name: 'contains',
                        args: [column.field, searchValue]
                    });
                    searchQueryArgs.push(containsNode);
                }
                searchQuery.args = searchQueryArgs;
                return searchQuery;
            },


        });
    }
);