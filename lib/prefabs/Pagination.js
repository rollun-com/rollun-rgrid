define([
	'dojo/_base/declare',
	'rgrid/Pagination',
	'dojo/dom-construct',
], function (declare, Pagination, domConstruct) {

	return declare('PaginationPrefab', null, {
		constructor: function (params) {
			if (params) {
				if (params.startingPage) {
					this._startingPage = params.startingPage;
				}
			}
		},

		deploy: function (configStore, params) {
			return new Pagination({
				domNode: domConstruct.create('div'),
				attachPoint: 'pagination',
				pagingLinks: 2,
				startingPage: this._startingPage
			});
		},
	});
});