define(['dojo/_base/declare',
		'rgrid/ConditionControlPanel',
		'dstore/Memory',
		'rgrid/store/QueryableStore',],
	function (declare,
			  ConditionControlPanel,
			  Memory,
			  QueryStore) {
		return declare('ConditionPanelPrefab', null, {
			deploy: function (configStore) {
				this._configStore = configStore;
				return new ConditionControlPanel({
					store: this._getConfigStore(),
					attachPoint: 'filters'
				});
			},

			_getConfigStore: function () {
				let storeUrl = this._getValueFromStore('conditionsStoreUrl'),
					store;
				if (storeUrl) {
					store = new QueryStore({
						target: storeUrl,
					});
				} else {
					store = new Memory();
				}
				return store;
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
		});
	});