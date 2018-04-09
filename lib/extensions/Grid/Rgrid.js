define([], function () {
    declare('Rgrid', [Grid, _StoreMixin], {
        _store: null,
        _filter: {},
        _paginationLimits: {limit: 20, offset: 0},
        /**
         * @param store {object} - QueryableStore that will provide data for a grid
         */
        constructor: function (store) {
            if (typeof store === 'object') {
                this._store = store;
            } else throw new TypeError('store is not an object')
        },

        /**
         * @param filter {Query}
         */
        setFilter: function (filter) {
            this._filter = filter;
        },

        /**
         * @param limit {integer}
         * @param offset {integer}
         */
        setPagination: function (limit, offset) {
            this._paginationLimits = {limit: limit, offset: offset}
        },

        /**
         * Reload the contents according to filter and pagination
         */
        refresh: function () {
            var newData = this.store.query(this._buildQuery());
            this.set('collection', newData);
            this.emit('rgridRefresh');
        },

        /**
         * Build request query from filter and pagination limit
         * @private
         */
        _buildQuery: function () {
            var filterLimitNode = this._getLimitFromFilter(this._filter);
            var finalLimit = this._composeFinalLimit(filterLimitNode);
            return this.filter.limit(finalLimit.limit, finalLimit.offset);
        },

        /**
         * @param filter {object) - rollun-rql Query object
         * @returns {*}
         * @private
         */
        _getLimitFromFilter: function (filter) {
            for (var node in filter.args) {
                if (node.name === 'limit') {
                    return node;
                }
            }
            return {};
        },

        _composeFinalLimit: function (limitNode) {
            var finalLimit = Math.min(limitNode.args[0], this._paginationLimits.limit),
                finalOffset = limitNode.args[1] + this._paginationLimits.offset;
            return {
                limit: finalLimit,
                offset: finalOffset
            }
        }
    })
});