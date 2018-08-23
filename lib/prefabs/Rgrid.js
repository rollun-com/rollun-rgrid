define([
	'dojo/_base/declare',
	'rgrid/Rgrid',
	'rgrid/store/QueryableStore',
	'rql/query',
	'rgrid/mixins/_PrefabBase'
], function (declare,
			 Rgrid,
			 QueryableStore,
			 Query,
			 _PrefabBase) {
	return declare('RgridPrefab', [_PrefabBase], {

		_configKey: 'rgrid',
		_gridTargetKey: 'gridTarget',
		_initialQueryKey: 'initialQuery',
		_columnsConfigKey: 'columnsConfig',
		_columnParamsKey: 'columnParams',

		//  {
		//	  'id': 'gridTarget',
		//	  'url': 'api/datastore/test1_csv'
		//  },
		//	{
		// 	'id': 'columnsConfig',
		// 	'columnParams': {
		// 		'products': { //column name
		// 			get: 'prettyStringify', //ConfigStore contains record with this id
		// 			formatter: 'prettyJsonFormatter',
		// 			renderCell: 'contentInTitlePane',
		// 			width: 700
		// 		},
		// 		'datetime': { //column name
		// 			formatter: 'datetimeConverter'
		// 		}
		// 	  }
		// },

		deploy: function (configStore, params) {
			this.inherited(arguments);
			const parsedConfig = this._getParsedConfig(),
				dataStore = new QueryableStore({
					target: configStore.getSync(this._gridTargetKey).url
				}),
				columnsConfig = parsedConfig(this._columnsConfigKey);
			return new Rgrid({
				collection: dataStore,
				query: this._getInitQuery(parsedConfig),
				attachPoint: 'rgrid-grid',
				class: 'dgrid-autoheight',
				columnsConfig: columnsConfig[this._columnParamsKey]
			});
		},

		_getInitQuery: function (config) {
			let initQuery = config[this._initialQueryKey];
			if (!initQuery) {
				initQuery = new Query.Query({
					name: 'limit',
					args: [20, 0]
				});
			}
			return initQuery;
		},
	});
});