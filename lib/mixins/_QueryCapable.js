define([
	'dojo/_base/declare',
	'rgrid/RqlBuilder'
], function (declare,
			 RqlBuilder) {
	return declare('_QueryCapableMixin', null, {
		_rqlBuilder: null,

		constructor: function (params) {
			this._rqlBuilder = new RqlBuilder();
			if (typeof params.query === 'object') {
				this._rqlBuilder.setQuery(params.query);
				this._rqlBuilder.addToCache('default', params.query);

			}
		},

		setQuery: function (query) {
			this._rqlBuilder.setQuery(query);
		},

		appendQuery: function (query) {
			 this._rqlBuilder.appendQuery(query);
		},

		getQuery: function () {
			return this._rqlBuilder.getQuery();
		},

		addToCache: function (id, node) {
			this._rqlBuilder.addToCache(id, node);
		},

		removeFromCache: function (id) {
			this._rqlBuilder.removeFromCache(id);
		},

		buildQueryFromCache: function () {
			this._rqlBuilder.setQueryFromCache();
		},
	});
});