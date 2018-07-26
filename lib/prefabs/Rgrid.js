define([
	'dojo/_base/declare',
	'rgrid/Rgrid',
	'rgrid/store/QueryableStore',
	'rql/query',
], function (declare,
			 Rgrid,
			 QueryableStore,
			 Query) {
	return declare('RgridPrefab', null, {

	//  {
	//	  'id': 'gridTarget',
	//	  'url': 'api/datastore/test1_csv'
	//  },
	//	{
	// 	'id': 'columnsConfig',
	// 	'columnsConfig': {
	// 		'products': { //column name
	// 			get: 'prettyStringify', //ConfigStore contains record with this id
	// 			formatter: 'prettyJsonFormatter',
	// 			renderCell: 'contentInTitlePane',
	// 			width: 700
	// 		},
	// 		'datetime': { //column name
	// 			formatter: 'datetimeConverter'
	// 		}
	// 	}
	// },
		deploy: function (configStore, params) {
			this._configStore = configStore;
			const dataStore = new QueryableStore({
					target: configStore.getSync('gridTarget').url
				}),
				columnsConfig = this._getValueFromStore('columnsConfig'),
			realColumnsConfig = this._processColumnsConfig(columnsConfig);
			return new Rgrid({
				collection: dataStore,
				query: this._getInitQuery(),
				attachPoint: 'rgrid-grid',
				class: 'dgrid-autoheight',
				columnsConfig: realColumnsConfig
			});
		},

		_processColumnsConfig: function (columnsConfig) {
			if (!columnsConfig) {
				return null;
			}
			for (const columnName in columnsConfig) {
				if (columnsConfig.hasOwnProperty(columnName)) {
					columnsConfig[columnName].formatter = this._getValueFromStore(columnsConfig[columnName].formatter);
					columnsConfig[columnName].renderCell = this._getValueFromStore(columnsConfig[columnName].renderCell);
					columnsConfig[columnName].get = this._getValueFromStore(columnsConfig[columnName].get);
					columnsConfig[columnName].renderHeaderCell = this._getValueFromStore(columnsConfig[columnName].renderHeaderCell);
				}
			}
			return columnsConfig;
		},

		_getValueFromStore: function (id) {
			if (id) {
				let value = this._configStore.getSync(id);
				if (value) {
					return value[id];
				}
			}
			return null;
		},

		_getInitQuery: function () {
			let initQuery,
				 initQueryId = this._getValueFromStore('initialQuery');
			if (initQueryId) {
				initQuery = this._getValueFromStore(initQueryId);
			} else {
				initQuery = new Query.Query({
					name: 'limit',
					args: [20, 0]
				});
			}
			return initQuery;
		},
	});
});