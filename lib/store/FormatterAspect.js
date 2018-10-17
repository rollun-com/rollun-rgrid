define([
	'dojo/_base/declare'
], function (declare) {
	return declare(null, {
		_store: null,
		_schema: null,

		/*schema example:
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

		query: function (query) {
			const processedQuery = this._applySchemaToQuery(query),
				rawQueryResults = this._store.query(processedQuery);
			return this._applySchemaToQueryResults(rawQueryResults);
		},

		_applySchemaToQuery: function (query) {
			for (const argument of query.args) {
				if ('args' in argument) {
					this._applySchemaToQuery(argument);
				} else {
					const [propertyName, ...propertyValues] = query.args;
					if ((this._schema.keys()).indexOf(propertyName)) {//if property is specified in schema
						const newPropertyValues = propertyValues.map((currentValue) => this._schema[propertyName].pre(currentValue));//map all arguments according to schema
						newPropertyValues.unshift(propertyName);//add property name to form full query args
						query.args = newPropertyValues;
					}
				}
			}
			return query;
		},

		_applySchemaToQueryResults: function (queryResults) {
			let processedQueryResults = [];
			for (const item of queryResults) {
				const processedItem = this._postApplySchemaToItem(item);
				processedQueryResults.push(processedItem);
			}
			return processedQueryResults;
		},

		get: function (id) {
			return new Promise((resolve, reject) => {
				this._store.get(id).then(
					(item) => {
						resolve(this._postApplySchemaToItem(item));
					}, (error) => {
						reject(error);
					});

			});
		},

		getSync: function (id) {
			this._postApplySchemaToItem(this._store.get(id));
		},

		put: function (item, directives) {
			const processedItem = this._preApplySchemaToItem(item),
				originalPromise = this._store.put(processedItem, directives);
			return new Promise((resolve, reject) => {
				originalPromise.then((item) => {
						resolve(this._postApplySchemaToItem(item));
					},
					(error) => {
						reject(error);
					});
			});
		},

		add: function (item, directives) {
			//add() calls put() internally, so there`s no need to aspect
			return this._store.add(item, directives);
		},

		_preApplySchemaToItem: function (item) {
			let processedItem = {};
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
			let processedItem = {};
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