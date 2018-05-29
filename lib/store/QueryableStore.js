define([
    'dojo/_base/declare',
    'dojo/request',
    'dojo/_base/lang',
    'dstore/Rest',
    'dstore/Store',
    'rql/parser'
], function (declare,
             request,
             lang,
             Rest,
             Store,
             Parser
             ) {
    return declare("QueryableStore", [Rest, Store], {
        _totalCount: null,

        /**
         * @param params {{target: string, ?additionalHeaders: object}}
         *        target - url that leads to the datastore that supports rql
         *        additionalHeaders  - additional headers that will be sent with every request
         */
        constructor: function (params) {
            this.inherited(arguments);
            if (typeof params.target !== 'string') {
                throw new TypeError('target is not a string');
            }
            if (this._isValidStore(params.target)) {
                this.target = params.target;
            } else {
                throw new Error('Provided URL does not belong to a valid store');
            }
            this.headers = params.additionalHeaders || {};
        },

        /**
         * Placeholder for a proper store validator
         * @param url
         * @private
         */
        _isValidStore: function () {
            return true;
        },

        /**
         * @param query {object|string} - a rollun-rql query object or a valid rql string
         */
        query: function (query) {//TODO: сделать адекватную систему работы с ошибками
            var store = this,
                parsedQuery;
            var headers = lang.mixin({
                'Accept': 'application/json',
            }, this.headers);
            if (typeof query === 'object') {
                try {
                    parsedQuery = query.toString();
                } catch (exception) {
                    throw new Error('Unable to parse query object: ' + exception.message);
                }
            } else if (typeof query === 'string') {
                try {
                    Parser.parse(query);
                } catch (exception) {
                    throw new Error('Invalid query string: ' + exception.message);
                }
                parsedQuery = query;
            } else {
                throw new Error('Query must be a rollun-rql query object or a valid rql string');
            }
            var rawResponse = request(this.target, {
                method: 'GET',
                headers: headers,
                query: parsedQuery,
                handleAs: 'json',
            });
            var event = {target: store};
            return rawResponse.response.then(
                function (data) {
                    var result = store._restore(JSON.parse(data.text), true);
                    store._extractTotalCount(data.getHeader('Content-Range'));
                    store.emit('successfulQuery', event);
                    return result;
                },
                function (error) {
                    event.error = error;
                    store.emit('failedQuery', event);
                });
        },

        _extractTotalCount: function (rangeHeader) {
            var pieces = rangeHeader.split('/');
            this.totalCount = parseInt(pieces[(pieces.length-1)]);
        }
    });
});