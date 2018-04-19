define([
        'dojo/_base/declare',
        'dojo/on',
        'dojo/dom-construct',
        'dojo/_base/lang'
    ],
    function (
              declare,
              on,
              domConstruct,
              lang,
    ) {
        return declare("Pagination", [], {
            pagingTextBox: true,
            previousNextArrows: true,
            firstLastArrows: true,
            pagingLinks: 2,
            pageSizeOptions: [20,50,100,200],
            _currentPage: 1,
            _grid: null,
            rowsPerPage: 20,

            constructor: function (params) {
                if (typeof params.grid !== 'object') {
                    throw {
                        name: 'PaginationWithoutGrid',
                        message: 'Pagination requires a grid to operate'
                    }
                }
                this._grid = params.grid;
                this.domNode = params.domNode;
                this.inherited(arguments);
            },

            buildRendering: function () {
                var grid = this._grid,
                    paginationNode = this.paginationNode = domConstruct.create('div', { className: 'dgrid-pagination' }, this.domNode),
                    statusNode = this.paginationStatusNode = domConstruct.create('div', { className: 'dgrid-status' }, paginationNode),
                    navigationNode,
                    node;
                statusNode.tabIndex = 0;
                // Initialize UI based on pageSizeOptions and rowsPerPage
                this._updatePaginationSizeSelect();
                this._updateRowsPerPageOption();
                this._updatePaginationStatus(this._grid.getTotalCount());

                navigationNode = this.paginationNavigationNode =
                    domConstruct.create('div', { className: 'dgrid-navigation' }, paginationNode);

                if (this.firstLastArrows) {
                    // create a first-page link
                    node = this.paginationFirstNode = domConstruct.create('span', {
                        className: 'dgrid-first dgrid-page-link',
                        innerHTML: '«',
                        tabIndex: 0
                    }, navigationNode);
                }
                if (this.previousNextArrows) {
                    // create a previous link
                    node = this.paginationPreviousNode = domConstruct.create('span', {
                        className: 'dgrid-previous dgrid-page-link',
                        innerHTML: '‹',
                        tabIndex: 0
                    }, navigationNode);
                }
                this.paginationLinksNode = domConstruct.create('span', {
                    className: 'dgrid-pagination-links'
                }, navigationNode);

                if (this.previousNextArrows) {
                    // create a next link
                    node = this.paginationNextNode = domConstruct.create('span', {
                        className: 'dgrid-next dgrid-page-link',
                        innerHTML: '›',
                        tabIndex: 0
                    }, navigationNode);
                }
                if (this.firstLastArrows) {
                    // create a last-page link
                    node = this.paginationLastNode = domConstruct.create('span', {
                        className: 'dgrid-last dgrid-page-link',
                        innerHTML: '»',
                        tabIndex: 0
                    }, navigationNode);
                }
            },

            _updatePaginationSizeSelect: function () {
                var pageSizeOptions = this.pageSizeOptions,
                    paginationSizeSelect = this._paginationSizeSelect,
                    handle;
                if (pageSizeOptions && pageSizeOptions.length) {
                    if (!paginationSizeSelect) {
                        // First time setting page options; create the select
                        paginationSizeSelect = this._paginationSizeSelect = domConstruct.create('select', {
                            className: 'dgrid-page-size'
                        }, this.paginationNode);
                        handle = this._paginationSizeChangeHandle =
                            on(paginationSizeSelect, 'change', lang.hitch(this, function () {
                                this.set('rowsPerPage', +this._paginationSizeSelect.value);
                            }));
                    }
                    paginationSizeSelect.options.length = 0;
                    for (var i = 0; i < pageSizeOptions.length; i++) {
                        domConstruct.create('option', {
                            innerHTML: pageSizeOptions[i],
                            selected: this.rowsPerPage === pageSizeOptions[i],
                            value: pageSizeOptions[i]
                        }, paginationSizeSelect);
                    }
                    this._updateRowsPerPageOption();
                }
                else if (!(pageSizeOptions && pageSizeOptions.length) && paginationSizeSelect) {
                    domConstruct.destroy(paginationSizeSelect);
                    this._paginationSizeSelect = null;
                    this._paginationSizeChangeHandle.remove();
                }
            },

            _updateRowsPerPageOption: function () {
                var rowsPerPage = this.rowsPerPage,
                    pageSizeOptions = this.pageSizeOptions,
                    paginationSizeSelect = this.paginationSizeSelect;
                if (paginationSizeSelect) {
                    if (arrayUtil.indexOf(pageSizeOptions, rowsPerPage) < 0) {
                        this._setPageSizeOptions(pageSizeOptions.concat([rowsPerPage]));
                    }
                    else {
                        paginationSizeSelect.value = '' + rowsPerPage;
                    }
                }
            },

            _updatePaginationStatus: function (total) {
                var count = this.rowsPerPage;
                var start = Math.min(total, (this._currentPage - 1) * count + 1);
                this.paginationStatusNode.innerHTML = "start: " + start + " end: " + Math.min(total, start + count - 1) + " total: " + total;
            },

            postCreate: function () {
                var grid = this._grid;
                on(this.paginationNavigationNode, '.dgrid-page-link:click,.dgrid-page-link:keydown', function (event) {
                    // For keyboard events, only respond to enter
                    if (event.type === 'keydown' && event.keyCode !== 13) {
                        return;
                    }
                    var cls = this.className,
                        curr,
                        max;
                    if (grid._isLoading || cls.indexOf('dgrid-page-disabled') > -1) {
                        return;
                    }
                    curr = grid._currentPage;
                    max = Math.ceil(grid._total / grid.rowsPerPage);

                    // determine navigation target based on clicked link's class
                    if (this === grid.paginationPreviousNode) {
                        grid.gotoPage(curr - 1);
                    }
                    else if (this === grid.paginationNextNode) {
                        grid.gotoPage(curr + 1);
                    }
                    else if (this === grid.paginationFirstNode) {
                        grid.gotoPage(1);
                    }
                    else if (this === grid.paginationLastNode) {
                        grid.gotoPage(max);
                    }
                    else if (cls === 'dgrid-page-link') {
                        grid.gotoPage(+this.innerHTML); // the innerHTML has the page number
                    }
                });
            },

            gotoPage: function (pageNumber) {

            },
        })
    });