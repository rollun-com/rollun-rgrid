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

		deploy: function (configStore, params) {
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
			if (this._configStore.getSync('menuConfig')) {
				panes.push(new TitlePane({
						title: 'Действия',
						content: this._getActionsButtonGroup(this._configStore.getSync('menuConfig').menuConfig),
						open: false
					})
				);
			}
			return panes;
		},

		_getActionsButtonGroup: function (actionsMenuConfig) {
			const actionsButtons = [],
				resultNode = domConstruct.create('div');
			for (const config of actionsMenuConfig) {
				actionsButtons.push(new WebhookButton({
					label: config.label,
					action: this._processAction(config.action),
					class: 'rgrid-webhook-btn'
				}));
			}
			return new WebhookButtonGroup({
				buttons: actionsButtons,
				class: 'rgrid-webhook-btn-group',
				domNode: resultNode
			});
		},

		_processAction: function (action) {
			let processedAction;
			switch (typeof action) {
				case 'function': {
					processedAction = action;
					break;
				}
				case 'object': {
					if (action.action && action.params ) {
						const realAction = this._configStore.getSync(action.action).action;
						processedAction = function (row) {
							realAction(row, ...action.params);
						};
						break;
					}
				}/* falls through */
				default: {
					console.warn('Invalid action:' + action.toString());
					processedAction = () => {
						console.warn('Invalid action provided');
					};
				}
			}
			return processedAction;
		}
	});
});