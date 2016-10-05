/**
 * Created by root on 07.06.16.
 */
define([
    'dojo/_base/declare',
    'dojo/_base/array',
    'dojo/_base/lang',
    'dojo/aspect',
    'dojo/dom-construct',
    'dojo/dom-class',
    'dojo/on',
    'dojo/query',
    'dojo/string',
    'dojo/has',
    'dojo/when',
    'dgrid/extensions/Pagination',
], function (declare,
             array,
             lang,
             aspect,
             domConstruct,
             domClass,
             on,
             query,
             string,
             has,
             when,
             Pagination) {
    var BreakException = {};

    function cleanupContent(grid) {
        // Remove any currently-rendered rows, or noDataMessage
        if (grid.noDataNode) {
            domConstruct.destroy(grid.noDataNode);
            delete grid.noDataNode;
        }
        else {
            grid.cleanup();
        }
        grid.contentNode.innerHTML = '';
    }
    function cleanupLoading(grid) {
        if (grid.loadingNode) {
            domConstruct.destroy(grid.loadingNode);
            delete grid.loadingNode;
        }
        else if (grid._oldPageNodes) {
            // If cleaning up after a load w/ showLoadingMessage: false,
            // be careful to only clean up rows from the old page, not the new one
            for (var id in grid._oldPageNodes) {
                grid.removeRow(grid._oldPageNodes[id]);
            }
            delete grid._oldPageNodes;
        }
        delete grid._isLoading;
    }

    return declare([Pagination], {

        benchmarkColumns: null,
        newReceivedColumns: null,
        rqlFilter: null,
        setRqlFilter: function (rqlFilter) {
            this.rqlFilter = rqlFilter
        },

        gotoPage: function (page) {
            var self = this;
            // summary:
            //		Loads the given page.  Note that page numbers start at 1.
            var grid = this,
                start = (this._currentPage - 1) * this.rowsPerPage;

            if (!this._renderedCollection) {
                console.warn('Pagination requires a collection to operate.');
                return when([]);
            }

            if (this._renderedCollection.releaseRange) {
                this._renderedCollection.releaseRange(start, start + this.rowsPerPage);
            }

            return this._trackError(function () {
                var count = grid.rowsPerPage,
                    start = (page - 1) * count,
                    options = {
                        start: start,
                        count: count
                    },
                    results,
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

                results = grid._renderedCollection.fetchRange({
                    start: start,
                    end: start + count,
                    queryParams: {rql: self.rqlFilter }
                });

                return grid.renderQueryResults(results, null, options).then(function (rows) {
                    cleanupLoading(grid);
                    // Reset scroll Y-position now that new page is loaded.
                    grid.scrollTo({ y: 0 });

                    if (grid._rows) {
                        grid._rows.min = start;
                        grid._rows.max = start + count - 1;
                    }

                    results.totalLength.then(function (total) {
                        if (!total) {
                            if (grid.noDataNode) {
                                domConstruct.destroy(grid.noDataNode);
                                delete grid.noDataNode;
                            }
                            grid._insertNoDataNode();
                        }

                        // Update status text based on now-current page and total.
                        grid._total = total;
                        grid._currentPage = page;
                        grid._rowsOnPage = rows.length;
                        grid._updatePaginationStatus(total);

                        // It's especially important that _updateNavigation is called only
                        // after renderQueryResults is resolved as well (to prevent jumping).
                        grid._updateNavigation(total);
                    });

                    return results;
                }, function (error) {
                    cleanupLoading(grid);
                    throw error;
                });
            });
        }
    });
});


/*

 */