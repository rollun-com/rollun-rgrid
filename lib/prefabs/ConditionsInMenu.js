define([
	'dojo/_base/declare',
	'rgrid/EventDrivenHideablePanesMenu',
	'rgrid/ConditionControlPanel',
	'dijit/TitlePane',
	'dstore/Memory'
], (declare,
	EventDrivenHideablePanesMenu,
	ConditionControlPanel,
	TitlePane,
	Memory) => {
	return declare('ConditionsInMenuPrefab', null, {

		deploy: function (configStore) {
			return new EventDrivenHideablePanesMenu({
				panes: this._getPanes(),
				attachPoint: 'filters'
			});
		},

		_getPanes: function () {
			return [
				new TitlePane({
					title: 'Фильтры',
					content: new ConditionControlPanel({store: new Memory()}),
					open: false
				}),
				new TitlePane({
					title: 'Не фильтры',
					content: '<span>serdhgdfdgsfvr \n adasdsggggggggtttttttttttttt</span>',
					open: false
				})
			];
		},
	});
});