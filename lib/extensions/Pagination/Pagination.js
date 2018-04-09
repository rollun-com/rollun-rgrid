define([
    'dgrid/extensions/Pagination',
    'dojo/_base/declare',
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",

    "dojo/text!./Pagination.html"
], function (Pagination,
             declare,
             ) {
    declare('rgrid/Pagination', Pagination, {
        _grid: null,
        templateString: template,

        constructor: function (grid) {
            if (typeof grid !== 'object') {
                throw {
                    name: 'PaginationWithoutGrid',
                    message: 'Pagination requires a grid to operate'
                }
            }
            this._grid = grid;
        },
        buildRendering: function () {
            this.inherited(arguments);

            var grid = this.grid,
                paginationNode = domConstruct.create('div', {className: 'dgrid-pagination'}, this.paginationNode),
                statusNode = this.paginationStatusNode = domConstruct.create('div', {className: 'dgrid-status'}, paginationNode),
                navigationNode,
                node;
            statusNode.tabIndex = 0;
            // Initialize UI based on pageSizeOptions and rowsPerPage
            this._updatePaginationSizeSelect();
            this._updateRowsPerPageOption();
            // initialize some content into paginationStatusNode, to ensure
            // accurate results on initial resize call
            this._updatePaginationStatus(this._total);
            navigationNode = this.paginationNavigationNode =
                domConstruct.create('div', {className: 'dgrid-navigation'}, paginationNode);
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
            /* jshint maxlen: 121 */
            this._listeners.push(on(navigationNode, '.dgrid-page-link:click,.dgrid-page-link:keydown', function (event) {
                // For keyboard events, only respond to enter
                if (event.type === 'keydown' && event.keyCode !== 13) {
                    return;
                }
                var cls = this.className,
                    curr, max;

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
            }));
        },

        gotoPage: function (page) {
            // summary:
            //		Loads the given page.  Note that page numbers start at 1.
            var grid = this.grid,
                start = (this._currentPage - 1) * this.rowsPerPage;
            if (!this._renderedCollection) {
                console.warn('Pagination requires a collection to operate.');
                return when([]);
            }
            if (this._renderedCollection.releaseRange) {
                this._renderedCollection.releaseRange(start, start + this.rowsPerPage);
            }
            return this._trackError(function () {
                var limit = grid.rowsPerPage,
                    offset = (page - 1) * count,
                    contentNode = grid.contentNode,
                    loadingNode,
                    oldNodes,
                    children,
                    i,
                    len;

                if (grid.showLoadingMessage) {
                    cleanupContent(grid);
                    loadingNode = grid.loadingNode = domConstruct.create('div', {
                        className: 'dgrid-loading',
                        innerHTML: grid.loadingMessage
                    }, contentNode);
                }
                else {
                    // Reference nodes to be cleared later, rather than now;
                    // iterate manually since IE < 9 doesn't like slicing HTMLCollections
                    grid._oldPageNodes = oldNodes = {};
                    children = contentNode.children;
                    for (i = 0, len = children.length; i < len; i++) {
                        oldNodes[children[i].id] = children[i];
                    }
                }
                // set flag to deactivate pagination event handlers until loaded
                grid._isLoading = true;
                grid.setPagination(start, count);
                grid.refresh();
                cleanupLoading(grid);
            });
        }
    })
});