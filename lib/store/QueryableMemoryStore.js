define([
	'dojo/_base/declare',
	'dstore/Memory',
	'rql/js-array',
	'dojo/_base/lang'
], function (declare, Memory, jsArray, lang) {
	return declare([Memory], {

		query: function (query) {
			return new Promise((resolve, reject) => {
				try {
					const queryResult = this.querySync(query);
					resolve(queryResult);
				} catch (error) {
					reject(error);
				}
			});
		},

		querySync: function (query) {
			try {
				const data = lang.clone(this.data);
				return this._restore(jsArray.query(query, {}, data), true);
			} catch (error) {
				error.message = 'Can`t execute query. Reason: ' + error.message;
				throw error;
			}
		}
	});
});