define([
	'dojo/_base/declare',
	'rgrid/Rtree'
], (declare,
	Rtree) => {
	return declare('RtreePrefab', null, {
		deploy: function (configStore, params) {
			return new Rtree();
		}
	});
});