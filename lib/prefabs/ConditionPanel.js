define(['dojo/_base/declare',
		'rgrid/ConditionControlPanel',
		'dstore/Memory'],
	function (declare,
			  ConditionControlPanel,
			  Memory) {
		return declare('ConditionPanelPrefab', null, {
			deploy: function (configStore) {
				return new ConditionControlPanel({store: new Memory(), attachPoint: 'filters'});
			}
		});
	});