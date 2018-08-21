define([
	'dojo/_base/declare',
	'rgrid/Rtree',
	'dojo/dom-construct',
	'rgrid/store/QueryableStore',
	'rql/query',
	'rgrid/mixins/_PrefabBase',
], (declare,
	Rtree,
	domConstruct,
	QueryableStore,
	Query) => {
	return declare('RtreePrefab', [_PrefabBase], {

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
		//				...
		// 			},
		// 			mayHaveChildren: function (item) {
		// 				...
		// 			},
		// 			getRoot: function (onItem, onError) {
		// 				...
		// 			},
		// 			getLabel: function (object) {
		// 				...
		// 			}
		// 		},
		// 	 },
		//],

		deploy: function (configStore, params) {
			this.inherited(arguments);
			const moduleConfig = configStore.getSync(this._moduleConfigId);
				if (moduleConfig) {
					this._moduleConfig = moduleConfig;
					return new Rtree({
						domNode: domConstruct.create('div'),
						store: this._getDataStore(),
						query: this._getInitialQuery(),
						modelConfig: this._getModelConfig(),
						attachPoint: 'rgrid-tree',
						autoexpand: true
					});
				}
				throw new Error('rtreeConfig is missing from configStore');
		},

		_getDataStore: function () {
			const rtreeTarget = this._moduleConfig[this._targetKey];
			if (typeof rtreeTarget === 'string') {
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