define([
  'dojo/_base/declare',
  'dojo/Evented',
  'rql/parser',
], function (declare,
             Evented,
             Parser) {
  return declare([Evented], {
    _store: null,
    _schema: null,
    totalCount: null,

    /* schema example:
    {
       datetime: {//field name
         pre: (value) => {value will be passed to this function BEFORE being processed by the store
          //...
          //do something with value
          return newValue;
        },
        post: (value) => {value will be passed to this function AFTER being processed by the store
          //...
          //do something with value
          return newValue;
        },
      }
    }
    */
    constructor: function (params) {
      this._store = params.store;
      this._schema = params.schema;
    },

    postCreate: function () {
      this._store.on('failedQuery, missingTotalCount', (event) => {
        this.emit(event.type, event);
      });
    },

    query: function (query) {
      if (typeof query === 'string') {
        query = Parser.parse(query);
      }
      const processedQuery = this._applySchemaToQuery(query);
      return new Promise((resolve, reject) => {
        this._store.query(processedQuery)
          .then((rawQueryResults) => {
              this.totalCount = this._store.totalCount;
              resolve(this._applySchemaToQueryResults(rawQueryResults));
            },
            (error) => {
              reject(error);
            });
      });
    },

    _applySchemaToQuery: function (query) {
      for (const argument of query.args) {
        if (typeof argument === 'object' && 'args' in argument) {
          this._applySchemaToQuery(argument);
        } else {
          const [propertyName, ...propertyValues] = query.args;
          // eslint-disable-next-line max-len
          if ((Object.keys(this._schema)).indexOf(propertyName) >= 0) { // if property is specified in schema
            const newPropertyValues = propertyValues.map(// map all arguments according to schema
              currentValue => this._schema[propertyName].pre(currentValue)
            );
            newPropertyValues.unshift(propertyName);// add property name to form full query args
            query.args = newPropertyValues;
          }
        }
      }
      return query;
    },

    _applySchemaToQueryResults: function (queryResults) {
      const processedQueryResults = [];
      for (const item of queryResults) {
        const processedItem = this._postApplySchemaToItem(item);
        processedQueryResults.push(processedItem);
      }
      return processedQueryResults;
    },

    fetch: function () {
      return new Promise((resolve, reject) => {
        this._store.fetch()
          .then(
            (rawFetchResult) => {
              resolve(this._applySchemaToQueryResults(rawFetchResult));
            }, (error) => {
              reject(error);
            }
          );
      });
    },

    get: function (id) {
      return new Promise((resolve, reject) => {
        this._store.get(id)
          .then(
            (item) => {
              resolve(this._postApplySchemaToItem(item));
            }, (error) => {
              reject(error);
            }
          );
      });
    },

    put: function (item, directives) {
      const processedItem = this._preApplySchemaToItem(item);
      const originalPromise = this._store.put(processedItem, directives);
      return new Promise((resolve, reject) => {
        originalPromise.then((putItem) => {
            resolve(this._postApplySchemaToItem(putItem));
          },
          (error) => {
            reject(error);
          });
      });
    },

    add: function (item, directives) {
      // add() calls put() internally, so there`s no need to aspect
      return this._store.add(item, directives);
    },

    _preApplySchemaToItem: function (item) {
      const processedItem = {};
      for (const [property, value] of Object.entries(item)) {
        if (this._schema.hasOwnProperty(property)) {
          processedItem[property] = this._schema[property].pre(value);
        } else {
          processedItem[property] = value;
        }
      }
      return processedItem;
    },

    _postApplySchemaToItem: function (item) {
      const processedItem = {};
      for (const [property, value] of Object.entries(item)) {
        if (this._schema.hasOwnProperty(property)) {
          processedItem[property] = this._schema[property].post(value);
        } else {
          processedItem[property] = value;
        }
      }
      return processedItem;
    },
  });
});
