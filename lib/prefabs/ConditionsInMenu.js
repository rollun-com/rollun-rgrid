define([
	'dojo/_base/declare',
	'rgrid/EventDrivenHideablePanesMenu',
	'rgrid/ConditionControlPanel',
	'dijit/TitlePane',
	'dstore/Memory',
	'rgrid/WebhookButton',
	'rgrid/WebhookButtonGroup',
	'dojo/dom-construct'
], (declare,
	EventDrivenHideablePanesMenu,
	ConditionControlPanel,
	TitlePane,
	Memory,
	WebhookButton,
	WebhookButtonGroup,
	domConstruct) => {
	return declare('ConditionsInMenuPrefab', null, {

		deploy: function (configStore) {
			this._configStore = configStore;
			return new EventDrivenHideablePanesMenu({
				panes: this._getPanes(),
				attachPoint: 'filters'
			});
		},

		_getPanes: function () {
			let panes = [
				new TitlePane({
					title: 'Фильтры',
					content: new ConditionControlPanel({store: new Memory()}),
					open: false
				})
			];
			if (window.menuConfig && window.menuConfig.length > 0) {
				panes.push(
					new TitlePane({
						title: 'Действия',
						content: this._getActionsButtonGroup(),
						open: false
					})
				);
			}
			return panes;
		},

		_getActionsButtonGroup: function () {
			const actionsButtons = [],
				buttonsConfig = window.menuConfig,
				resultNode = domConstruct.create('div');
			for (const config of buttonsConfig) {
				actionsButtons.push(new WebhookButton({
					label: config.label,
					action: config.action,
					class: 'rgrid-webhook-btn'
				}));
			}
			return new WebhookButtonGroup({
				buttons: actionsButtons,
				class: 'rgrid-webhook-btn-group',
				domNode: resultNode
			});
		},
	});
});