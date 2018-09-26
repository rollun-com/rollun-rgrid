define([
	'dojo/_base/declare',
	'rql/parser'
], function (declare, Parser) {
	return declare('_PrefabBase', null, {

		_funcRegex: /func{(\w+)}/,
		_rqlRegex: /rql{(\S+)}/,
		_configStore: null,

		deploy: function (configStore, params = {}) {
			this._configStore = configStore;
		},

		_getParsedConfig: function (id) {
			const config = this._configStore.getSync(id);
			let result = null;
			if (config) {
				result = this._parseConfigFragment(config);
			}
			return result;
		},

		_parseConfigFragment: function (configFragment) {
			const parsedConfig = {};
			for (const key in configFragment) {
				if (configFragment.hasOwnProperty(key)) {
					if (typeof configFragment[key] === 'object') {
						parsedConfig[key] = this._parseConfigFragment(configFragment[key]);
					} else {
						parsedConfig[key] = this._parseValue(configFragment[key], key);
					}
				}
			}
			return parsedConfig;
		},

		_parseValue: function (value, key) {
			let parsedValue;
			if (typeof value === 'string') {
				const funcMatches = value.match(this._funcRegex),
					rqlMatches = value.match(this._rqlRegex);
				switch (true) {
					case Boolean(funcMatches): {
						const valueFound = this._configStore.getSync(funcMatches[1]);
						if (valueFound && typeof valueFound.func === 'function') {
							parsedValue = valueFound;
						}
						break;
					}
					case Boolean(rqlMatches): {
						try {
							parsedValue = Parser.parse(rqlMatches[1]);
						} catch (error) {
							throw new Error(`Can't parse config with key '${key}. Reason: ${error.message}'`);
						}
						break;
					}
					default: {
						parsedValue = value;
					}
				}
			}
			return parsedValue;
		}
	});
});