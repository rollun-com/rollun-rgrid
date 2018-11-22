define([
  'dojo/_base/declare',
  'rql/query',
  'dojo/_base/lang',
], (declare,
    Query,
    lang) => {
  return declare('RqlBuilder', null, {

    _query: null,
    _nodeCache: null,

    constructor: function (params) {
      params = params || {};
      this._nodeCache = new Map();
      if (typeof params.defaultQuery === 'object') {
        const defaultQueryClone = lang.clone(params.defaultQuery);
        this.addToCache('default', defaultQueryClone);
        this.setQuery(defaultQueryClone);
      } else {
        const emptyQuery = new Query.Query();
        this.addToCache('default', emptyQuery);
        this.setQuery(emptyQuery);
      }
    },

    /**
     * @param query {object} - rollun-rql query object
     */
    setQuery: function (query) {
      this._query = Object.assign(new Query.Query(), query);
    },

    /**
     * @returns {object} - rollun-rql query object
     */
    getQuery: function () {
      return new Query.Query({
        name: this._query.name,
        args: lang.clone(this._query.args)
      });
    },

    /**
     * @param query {object} - rollun-rql query object
     */
    appendQuery: function (query) {
      if (this._isConditionNode(query)) {
        this._addConditionToQuery(query);
      } else {
        this._addNotConditionToQuery(query); // select, sort, limit nodes
      }
    },

    /**
     * @param query {object} - rollun-rql query object
     */
    _isConditionNode: function (query) {
      return !(query.name === 'select' || query.name === 'sort' || query.name === 'limit');
    },

    /**
     * @param query {object} - rollun-rql query object
     */
    _addConditionToQuery: function (query) {
      const currentQuery = this.getQuery();
      if (this._isUnionNode(currentQuery)) {
        currentQuery.args.push(query);
        this.setQuery(currentQuery);
      } else {
        this.setQuery(new Query.Query({
          name: 'and',
          args: [currentQuery, query]
        }));
      }
    },

    _isUnionNode: function (node) {
      return (node.name === 'and' || node.name === 'or');
    },

    /**
     * @param query {object} - rollun-rql query object
     */
    _addNotConditionToQuery: function (query) {
      const currentQuery = this.getQuery(),
        currentQueryArgs = currentQuery.args;
      if (this._isUnionNode(currentQuery)) {
        let didFindNode = false;
        currentQueryArgs.forEach(function (arg, index) {
          if (arg.name === query.name) {
            currentQuery.args[index] = query;
            didFindNode = true;
          }
        });
        if (!didFindNode) {
          currentQuery.args.push(query);
        }
        this.setQuery(currentQuery);
      } else if (currentQuery.name === query.name) {
        this.setQuery(query);
      } else {
        this.setQuery(new Query.Query({
          name: 'and',
          args: [currentQuery, query]
        }));
      }
    },

    addToCache: function (id, node) {
      this._nodeCache.set(id, node);
    },

    removeFromCache: function (id) {
      this._nodeCache.delete(id);
    },

    setQueryFromCache: function () {
      this.setQuery(this._nodeCache.get('default'));
      for (let [id, query] of this._nodeCache.entries()) {
        if (id !== 'default') {
          this.appendQuery(query);
        }
      }
    }
  });
});
