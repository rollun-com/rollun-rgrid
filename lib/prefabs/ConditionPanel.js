define(['dojo/_base/declare',
		'rgrid/ConditionControlPanel',
		'dstore/Memory',
		'dijit/TitlePane'],
	function (declare,
			  ConditionControlPanel,
			  Memory,
			  TitlePane) {
		return declare('ConditionPanelPrefab', null, {
			deploy: function (configStore) {
				 return new ConditionControlPanel({store: new Memory(), attachPoint: 'filters'});
			}
		});
	});