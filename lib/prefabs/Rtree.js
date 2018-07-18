define([
	'dojo/_base/declare',
	'rgrid/Rtree',
	'dojo/dom-construct',
	'rgrid/store/QueryableStore',
	'rql/query',
], (declare,
	Rtree,
	domConstruct,
	QueryableStore,
	Query) => {
	return declare('RtreePrefab', null, {

		_moduleConfigId: 'rtreeConfig',
		_targetKey: 'target',
		_initialQueryKey: 'intitalQuery',
		_modelConfigKey: 'modelConfig',

		// config: [
		// 	 {
		// 		'id': 'rtreeConfig',
		// 		'target': 'my/data/store',
		// 		'intitalQuery': new Query.Query({
		// 			name: 'limit',
		// 			args: [20, 0]
		// 		}),
		// 		'modelConfig': {
		// 			getChildren: function (object, onComplete) {
		// 				return onComplete(object.children || []);
		// 			},
		// 			mayHaveChildren: function (item) {
		// 				return 'children' in item;
		// 			},
		// 			getRoot: function (onItem, onError) {
		// 				this.forEach(onItem);
		// 			},
		// 			getLabel: function (object) {
		// 				return object.name;
		// 			}
		// 		},
		// 	 },
		//],

		deploy: function (configStore, params) {
			const moduleConfig = configStore.getSync(this._moduleConfigId);
				if (moduleConfig) {
					this._moduleConfig = moduleConfig;
					return new Rtree({
						domNode: domConstruct.create('div'),
						store: this._getDataStore(),
						query: this._getInitialQuery(),
						modelConfig: this._getModelConfig(),
						attachPoint: 'rgrid-tree'
					});
				}
				throw new Error('rtreeConfig is missing from configStore');
		},

		_getDataStore: function () {
			const rtreeTarget = this._moduleConfig[this._targetKey];
			if (rtreeTarget) {
				return new QueryableStore({target: rtreeTarget});
			}
			throw new Error('Valid rtreeTarget isn`t provided in config');
		},

		_getInitialQuery: function () {
			const initQuery = this._moduleConfig[this._initialQueryKey];
			if (typeof initQuery === 'object') {
				return initQuery;
			}
			return new Query.Query({
				name: 'limit',
				args: [20, 0]
			});
		},

		_getModelConfig: function () {
			const rtreeModelConfig = this._moduleConfig[this._modelConfigKey];
			if (typeof rtreeModelConfig === 'object') {
				return rtreeModelConfig;
			}
			throw new Error('Valid rtreeModelConfig isn`t provided in config');
		},
	});
});