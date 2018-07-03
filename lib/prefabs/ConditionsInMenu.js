define([
	'dojo/_base/declare',
	'rgrid/EventDrivenHideablePanesMenu',
	'rgrid/ConditionControlPanel',
	'dijit/TitlePane',
	'dstore/Memory',
	'rgrid/WebhookButton',
	'rgrid/WebhookButtonGroup',
	'dojo/dom-construct',
	'rgrid/prefabs/ConditionPanel',
	'dojo/on'
], (declare,
	EventDrivenHideablePanesMenu,
	ConditionControlPanel,
	TitlePane,
	Memory,
	WebhookButton,
	WebhookButtonGroup,
	domConstruct,
	ConditionPanelPrefab,
	on) => {
	return declare('ConditionsInMenuPrefab', null, {
	// {
	// 		"id": "menuConfig",
	// 		"menuConfig": [
		// 		{
	// 				"label": "Do Something", // will be displayed on button label
	// 				"action": {
	// 					"action": "SomethingAction", // ConfigStore contains item with this name
	// 					"params": ["/webhook/doSomethingAction"] //Will be passed into action function after first param
	// 				}
	// 			}
		// ]
	// },
		deploy: function (configStore, params) {
			this._configStore = configStore;
			return new EventDrivenHideablePanesMenu({
				panes: this._getPanes(),
				attachPoint: 'filters'
			});
		},

		_getPanes: function () {
			let panes = [];
			const filterPane = new TitlePane({
				title: 'Фильтры',
				content: (new ConditionPanelPrefab()).deploy(this._configStore),
				open: false
			});
			on.once(filterPane.domNode, 'click', () => filterPane.content.resize());
			panes.push(filterPane);
			if (this._configStore.getSync('menuConfig')) {
				panes.push(new TitlePane({
						title: 'Действия',
						content: this._getActionsButtonGroup(),
						open: false
					})
				);
			}
			return panes;
		},

		_getValueFromStore: function (id) {
			if (id) {
				let value = this._configStore.getSync(id);
				if (value) {
					return value[id];
				}
			}
			return null;
		},

		_getActionsButtonGroup: function () {
			const actionsMenuConfig = this._getValueFromStore('menuConfig'),
				actionsButtons = [],
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
					if (action.action && action.params) {
						const realAction = this._getValueFromStore(action.action);
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