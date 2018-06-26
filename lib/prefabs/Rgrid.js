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
		deploy: function (configStore, params) {
			params = params || {};
			this._configStore = configStore;
			const dataStore = new QueryableStore({
					target: configStore.getSync('gridTarget').url
				}),
				initQuery = new Query.Query({
					name: 'limit',
					args: [15, 0]
				}),
				columnsConfig = configStore.getSync('columnsConfig').columnsConfig,
			realColumnsConfig = this._processColumnsConfig(columnsConfig);
			return new Rgrid({
				collection: dataStore,
				query: initQuery,
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
				return this._configStore.getSync(id)[id];
			}
			return undefined;
		}
	});
});