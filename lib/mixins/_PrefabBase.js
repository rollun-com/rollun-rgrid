define([
	'dojo/_base/declare',
], function (declare) {
	return declare('_PrefabBase', null, {

		_funcRegex: '/func{(\w+)}/g',
		_configStore: null,

		deploy: function (configStore, params = {}) {
			this._configStore = configStore;
		},

		_getParsedConfig: function (id) {
			const config = this._configStore.getSync(id);
			if (config) {
				return this._parseConfigFragment(config);
			}
			throw new Error("config record with id = '" + id + "' is missing");
		},

		_parseConfigFragment: function (configFragment) {
			const parsedConfig = {};
			for (const key in configFragment) {
				if (configFragment.hasOwnProperty(key)) {
					if (typeof configFragment[key] === 'object') {
						parsedConfig[key] = this._parseConfigFragment(configFragment[key]);
					} else {
						this._parseValue(configFragment[key]);
					}
				}
				return parsedConfig;
			}
		},

		_parseValue: function (value) {
			if (typeof value === 'string') {
				const matches = value.match(this._funcRegex);
				if (matches) {
					return this._configStore.getSync(matches[1]);
				}
			}
		}
	});
});