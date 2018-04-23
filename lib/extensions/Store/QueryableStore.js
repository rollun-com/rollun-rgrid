define([
    'dojo/_base/declare',
    'dojo/request',
    'dojo/_base/lang',
    'dstore/Rest',
    'dstore/Store',
    'dstore/QueryResults',
], function (declare,
             request,
             lang,
             Rest,
             Store,
             QueryResults
             ) {
    return declare("QueryableStore", [Rest, Store], {
        totalCount: null,

        /**
         * @param {object} params - contains following:
         *        {string} target - url that leads to the datastore that supports rql
         *        {object} additionalHeaders  - additional headers that will be sent with every request
         */
        constructor: function (params) {
            this.inherited(arguments);
            if (typeof params.target !== 'string') {
                throw new TypeError('target is not a string');
            }
            if (this._isValidStore(params.target)) {
                this.target = params.target;
            } else {
                throw new Error('Provided URL does not belong to a valid store')
            }
            this.headers = params.additionalHeaders || {};
        },

        /**
         * Placeholder for a proper store validator
         * @param url
         * @private
         */
        _isValidStore: function (url) {
            return true;
        },

        /**
         * @param queryObject {object} - rollun-rql query object
         */
        query: function (queryObject) {
            if (typeof queryObject !== 'object') {
                throw new TypeError('queryObject is not an object')
            }
            var store = this;
            var headers = lang.mixin({
                'Accept': 'application/json',
            }, this.headers);
            try {
                var rqlQuery = queryObject.toString();
            } catch (exception) {
                throw new Error('Unable to parse query object: ' + exception.message)
            }
            var rawResponse = request(this.target, {
                method: 'GET',
                headers: headers,
                query: rqlQuery,
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
            this.totalCount = parseInt(rangeHeader.slice(-2));
        }
    })
});