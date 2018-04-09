define([
    'dojo/_base/declare',
    'dojo/request',
    'dojo/_base/lang',
    'dojo/when',
    'dstore/Rest',
    'dstore/Request'
], function (declare,
             request,
             lang,
             Rest,
             Request,
             when) {
    return declare("QueryableStore", [Rest, Request], {

        constructor: function (params) {
            if (!params.target) {
                throw new Error('Target URl is not set')
            }
            this.target = params.target;
            this.headers = lang.mixin(this.headers, params.headers);
        },

        /**
         * @param queryObject {object} rollun-rql query object
         * @param options {object}
         */
        query: function (queryObject, options) {
            if (typeof queryObject !== 'object') {
                throw new TypeError('queryObject is not an object')
            }
            var store = this;
            options = options || {};
            var headers = lang.mixin({
                'Accept': 'application/json',
            }, this.headers, options.headers);
            try {
                var rqlQuery = queryObject.toString();
            } catch (exception) {
                throw  {
                    name: 'ParsingException',
                    message: 'Unable to parse query object: ' + exception.message
                };
            }
            var rawResponse = request(this.target, {
                method: 'GET',
                headers: headers,
                query: rqlQuery
            });
            return rawResponse.then(function (response) {
                var event = {target: store};
                var result = store._restore(JSON.parse(response), true);
                when(rawResponse.response, function (httpResponse) {
                    if (httpResponse.status === 200) {
                        event.message = '';
                        store.emit('successfulQuery', event);
                    }
                    if (httpResponse.status === 500) {
                        event.message = 'Server error occured';
                        store.emit('failedQuery', event);
                    }
                    if (httpResponse.status === 404) {
                        event.message = "Datastore not found, check the 'target' parameter";
                        store.emit('failedQuery', event);
                    }
                });
                return result;
            });
        },
    })
});