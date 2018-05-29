define([
	'dojo/_base/declare',
	'rgrid/Rgrid',
	'rgrid/store/QureryableStore',
	'rql/query',
], function (declare,
			 Rgrid,
			 QueryableStore,
			 Query) {
	return declare('RgridPrefab', null, {
		deploy: function (configStore, params) {
			params = params || {};
			const dataStore = new QueryableStore({
					target: configStore.get('gridTarget').url
				}),
				initQuery = new Query.Query({
					name: 'limit',
					args: [15, 0]
				});
			return new Rgrid({
				collection: dataStore,
				query: initQuery
			});
		}
	});
});