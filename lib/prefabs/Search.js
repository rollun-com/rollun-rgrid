define([
	'dojo/_base/declare',
	'rgrid/SearchBar',
	'dojo/dom-construct',
	'rgrid/mixins/_PrefabBase'
], function (declare,
			 SearchBar,
			 domConstruct,
			 _PrefabBase) {
	return declare('SearchPrefab', [_PrefabBase], {
		deploy: function (configStore, params) {
			this.inherited(arguments);
			return new SearchBar({domNode: domConstruct.create('div'), attachPoint: 'search'});
		}
	});
});