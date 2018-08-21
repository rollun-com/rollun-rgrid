define([
	'dojo/_base/declare',
	'rgrid/Pagination',
	'dojo/dom-construct',
	'rgrid/mixins/_PrefabBase'
], function (declare, Pagination, domConstruct, _PrefabBase) {

	return declare('PaginationPrefab', [_PrefabBase], {
		constructor: function (params) {
			if (params) {
				if (params.startingPage) {
					this._startingPage = params.startingPage;
				}
			}
		},

		deploy: function (configStore, params) {
			this.inherited(arguments);
			return new Pagination({
				domNode: domConstruct.create('div'),
				attachPoint: 'pagination',
				pagingLinks: 2,
				startingPage: this._startingPage
			});
		},
	});
});