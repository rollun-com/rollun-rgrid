define([
	'dojo/_base/declare',
	'rgrid/Rgrid',
	'rgrid/store/QueryableStore',
	'rql/query',
	'rgrid/mixins/_PrefabBase',
	'rgrid/editors/Json'
], function (declare,
			 Rgrid,
			 QueryableStore,
			 Query,
			 _PrefabBase,
			 JsonEditor) {
	return declare('RgridPrefab', [_PrefabBase], {

		_configKey: 'rgrid',
		_gridTargetKey: 'gridTarget',
		_initialQueryKey: 'initialQuery',
		_columnsConfigKey: 'columnsConfig',
		_columnParamsKey: 'columnParams',

		//  rgrid : {
		// {
		//	  'id': 'gridTarget',
		//	  'url': 'api/datastore/test1_csv'
		//  },
		//	{
		// 	 'id': 'columnsConfig',
		// 	 'columnParams': {
		// 	 	'products': { //column name
		// 	 		get: 'prettyStringify', //ConfigStore contains record with this id
		// 	 		formatter: 'prettyJsonFormatter',
		// 	 		renderCell: 'contentInTitlePane',
		// 	 		width: 700,
		//			editor: 'jsonEditor',
		//			editOn: 'dbclick,
		//			autosave: true,
		// 	 	},
		// 	 	'datetime': { //column name
		// 	 		formatter: 'datetimeConverter'
		// 	 	}
		// 	   }
		//  }
		//  },

		deploy: function (configStore, params) {
			this.inherited(arguments);
			const parsedConfig = this._getParsedConfig(this._configKey),
				dataStore = new QueryableStore({
					target: parsedConfig[this._gridTargetKey]
				}),
				columnsConfig = this._addEditor(parsedConfig[this._columnParamsKey]);
			return new Rgrid({
				collection: dataStore,
				query: this._getInitQuery(parsedConfig),
				attachPoint: 'rgrid-grid',
				class: 'dgrid-autoheight',
				columnsConfig: columnsConfig
			});
		},

		_addEditor: function (columnsConfig) {//TODO: fix this brilliance
			for (const columnName in columnsConfig) {
				if (columnsConfig.hasOwnProperty(columnName)) {
					switch (columnsConfig[columnName].editor) {
						case 'jsonEditor': {
							columnsConfig[columnName].editor = JsonEditor;
							break;
						}
						default: {
							break;
						}
					}
				}
			}
			return columnsConfig;
		},

		_getInitQuery: function (config) {
			let initQuery = config[this._initialQueryKey];

			if (initQuery) {
				initQuery = new Query.Query({
					name: 'and',
					args: [
						initQuery,
						new Query.Query({
							name: 'limit',
							args: [20, 0]
						})]
				});
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