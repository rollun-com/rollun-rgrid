define([
  'dojo/_base/declare',
  'dojo/request',
  'dojo/_base/lang',
  'dstore/Rest',
  'dstore/Store',
  'rql/parser',
], function (declare,
             request,
             lang,
             Rest,
             Store,
             Parser) {
  return declare('QueryableStore', [Rest, Store], {

    totalCount: null,

    /**
     * @param params {{target: string, ?additionalHeaders: object}}
     *        target - url that leads to the datastore that supports rql
     *        additionalHeaders  - additional headers that will be sent with every request
     */
    constructor: function (params) {
      params = params || {};
      if (this._isValidStore(params.target)) {
        this.target = params.target;
      } else {
        throw new Error('Provided URL does not belong to a valid store');
      }
      this.headers = lang.mixin({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }, (params.additionalHeaders || {}));
    },

    /**
     * Placeholder for a proper store validator
     * @private
     */
    _isValidStore: function (target) {
      return typeof target === 'string';
    },

    /**
     * @param query {object|string} - rollun-rql query object or a valid rql string
     */
    query: function (query) {
      let parsedQuery;
      if (typeof query === 'object') {
        try {
          parsedQuery = query.toString();
        } catch (exception) {
          throw new Error(`Unable to parse query object: ${exception.message}`);
        }
      } else if (typeof query === 'string') {
        try {
          Parser.parse(query);
        } catch (exception) {
          throw new Error(`Invalid query string: ${exception.message}`);
        }
        parsedQuery = query;
      } else {
        throw new Error('Query must be a rollun-rql query object or a valid rql string');
      }
      const rawResponse = request(this.target, {
        method: 'GET',
        headers: this.headers,
        query: parsedQuery,
        handleAs: 'json',
      });
      return rawResponse.response.then(
        responseData => this._handleResponse(responseData),
        (error) => {
          this._handleError(error);
        }
      );
    },
    _extractTotalCount: function (rangeHeader) {
      const pieces = rangeHeader.split('/');
      this.totalCount = parseInt(pieces[(pieces.length - 1)], 10);
      if (this.totalCount !== 0 && !(this.totalCount)) {
        this.emit('missingTotalCount');
      }
    },

    _handleResponse: function (responseData) {
      const event = {};
      this._extractTotalCount(responseData.getHeader('Content-Range'));
      this.emit('successfulQuery', event);
      return this._restore(JSON.parse(responseData.text), true);
    },
    _handleError: function (error) {
      const status = error.response.status;
      const event = {};
      switch (true) {
        case (status >= 400 && status < 500):
          event.message = 'Resource not found';
          event.response = error.response;
          this.emit('failedQuery', event);
          break;
        case (status >= 500 && status < 600):
          event.message = 'Internal server error';
          event.response = error.response;
          this.emit('failedQuery', event);
          break;
        default:
          event.message = 'Internal server error';
          event.response = error.response;
          this.emit('failedQuery', event);
          break;
      }
    },
  });
});
