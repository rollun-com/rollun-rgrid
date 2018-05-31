define([
	'dojo/_base/declare',
	'rgrid/Pagination',
	'dojo/dom-construct',
], function (declare, Pagination, domConstruct) {
	return declare('PaginationPrefab', null, {
		deploy: function (configStore, params) {
			return new Pagination({domNode: domConstruct.create('div'), attachPoint: 'pagination'});
		},
	});
});