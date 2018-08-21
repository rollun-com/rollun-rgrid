define(['dojo/_base/declare',
		'rgrid/ConditionControlPanel',
		'dstore/Memory',
		'rgrid/store/QueryableStore',
		'rgrid/mixins/_PrefabBase',],
	function (declare,
			  ConditionControlPanel,
			  Memory,
			  QueryStore,
			  _PrefabBase) {
		return declare('ConditionPanelPrefab', [_PrefabBase], {
			_configKey: 'conditionsStore',
			_urlKey: 'url',

		// {
		// 	'id': 'conditionsStore',
		// 	'url': 'my/store/with/conditions'
		// }
			deploy: function (configStore, params = {}) {
				this.inherited(arguments);
				return new ConditionControlPanel({
					store: this._getConfigStore(),
					attachPoint: 'filters'
				});
			},

			_getConfigStore: function () {
				let config = this._getParsedConfig(this._configKey),
					store;
				if (config[this._urlKey]) {
					store = new QueryStore({
						target: config[this._urlKey],
					});
				} else {
					store = new Memory();
				}
				return store;
			},
		});
	});