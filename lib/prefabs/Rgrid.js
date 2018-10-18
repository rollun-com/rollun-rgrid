define([
	'dojo/_base/declare',
	'rgrid/Rgrid',
	'rgrid/store/QueryableStore',
	'rql/query',
	'rgrid/mixins/_PrefabBase',
	'rgrid/editors/JsonEditorInPopup',
	'rgrid/store/FormatterAspect',
], function (declare,
			 Rgrid,
			 QueryableStore,
			 Query,
			 _PrefabBase,
			 JsonEditorInPopup,
			 FormatterAspect) {
	return declare('RgridPrefab', [_PrefabBase], {

		_configKey: 'rgrid',
		_gridTargetKey: 'gridTarget',
		_initialQueryKey: 'initialQuery',
		_columnsConfigKey: 'columnsConfig',
		_columnParamsKey: 'columnParams',
		_schemaParamsKey: 'schema',

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
				dataStore = this._getDatastore(parsedConfig),
				columnsConfig = this._addEditors(parsedConfig[this._columnParamsKey]);
			return new Rgrid({
				collection: dataStore,
				query: this._getInitQuery(parsedConfig),
				attachPoint: 'rgrid-grid',
				class: 'dgrid-autoheight',
				columnsConfig: columnsConfig
			});
		},

		_getDatastore: function (config) {
			let datastore;
			datastore = new QueryableStore({target: config[this._gridTargetKey]});
			if (this._schemaParamsKey in config) {
				datastore = new FormatterAspect({
					store: datastore,
					schema: config[this._schemaParamsKey]
				});
			}
			return datastore;
		},

		_addEditors: function (columnsConfig) {//TODO: fix this brilliance
			for (const columnName in columnsConfig) {
				if (columnsConfig.hasOwnProperty(columnName)) {
					switch (columnsConfig[columnName].editor) {
						case 'jsonEditor': {
							columnsConfig[columnName].editor = JsonEditorInPopup;
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