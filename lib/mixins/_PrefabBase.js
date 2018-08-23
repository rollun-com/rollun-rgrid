define([
	'dojo/_base/declare',
	'rql/Query'
], function (declare, Query) {
	return declare('_PrefabBase', null, {

		_funcRegex: /func{(\w+)}/,
		_rqlRegex: /rql{(\S+)}/,
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
						this._parseValue(configFragment[key], key);
					}
				}
				return parsedConfig;
			}
		},

		_parseValue: function (value, key) {
			let parsedValue = value;
			if (typeof value === 'string') {
				const funcMatches = value.match(this._funcRegex),
					rqlMatches = value.match(this._rqlRegex);
				if (funcMatches) {
					const valueFound = this._configStore.getSync(funcMatches[1]);
					if (valueFound && typeof valueFound.func === 'function'){
						parsedValue = valueFound;
					}
				}
				if (rqlMatches) {
					try {
						parsedValue = Query.parse(rqlMatches[1]);
					} catch(error) {
						throw new Error(`Can't parse config with key '${key}. Reason: ${error.message}'`);
					}
				}
			}
			return parsedValue;
		}
	});
});