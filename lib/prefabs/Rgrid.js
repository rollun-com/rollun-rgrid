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
			const dataStore = new QueryableStore({
					target: configStore.getSync('gridTarget').url
				}),
				initQuery = new Query.Query({
					name: 'limit',
					args: [15, 0]
				}),
				columnsConfig = (configStore.getSync('columnsConfig')) ? configStore.getSync('columnsConfig').columnsConfig : null;
			return new Rgrid({
				collection: dataStore,
				query: initQuery,
				attachPoint: 'rgrid-grid',
				class: 'dgrid-autoheight',
				columnsConfig: columnsConfig
			});
		}
	});
});