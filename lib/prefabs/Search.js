define([
	'dojo/_base/declare',
	'rgrid/SearchBar',
	'dojo/dom-construct'
], function (declare,
			 SearchBar,
			 domConstruct) {
	return declare('SearchPrefab', null, {
		deploy: function (configStore) {
			return new SearchBar({domNode: domConstruct.create('div'), attachPoint: 'search'});
		}
	});
});