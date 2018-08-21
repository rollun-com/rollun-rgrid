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
	'dojo/on',
	'rgrid/CsvUploader',
	'rgrid/mixins/_PrefabBase'
], (declare,
	EventDrivenHideablePanesMenu,
	ConditionControlPanel,
	TitlePane,
	Memory,
	WebhookButton,
	WebhookButtonGroup,
	domConstruct,
	ConditionPanelPrefab,
	on,
	CsvUploader,
	_PrefabBase) => {
	return declare('ConditionsInMenuPrefab', [_PrefabBase], {

		_configKey: 'conditionsInMenu',
		_actionsMenuConfigKey: 'actionMenuConfig',
		_fileActionKey: 'fileActions',
		_fileToDatastoreUploadKey: 'fileToDatastore',

		// {
		// 		"id": "conditionsInMenu",
		// 		"actionMenuConfig": [
		// 		{
		// 				"label": "Do Something", // will be displayed on button label
		// 				"action": {
		// 					"action": "func{myActionFunction}", // ConfigStore contains item with this id
		// 					"params": ["/webhook/doSomethingAction"] //Will be passed into action function after first param
		// 				}
		// 			}
		// ]
		// },
		deploy: function (configStore, params) {
			this.inherited(arguments);
			return new EventDrivenHideablePanesMenu({
				panes: this._getPanes(),
				attachPoint: 'filters'
			});
		},

		_getPanes: function () {
			const panes = [],
				parsedConfig = this._getParsedConfig(this._configKey);
			const filterPane = new TitlePane({
				title: 'Фильтры',
				content: (new ConditionPanelPrefab()).deploy(this._configStore),
				open: false
			});
			on.once(filterPane.domNode, 'click', () => filterPane.content.resize());
			panes.push(filterPane);
			if (parsedConfig[this._actionsMenuConfigKey]) {
				panes.push(new TitlePane({
						title: 'Задачи',
						content: this._getActionsButtonGroup(),
						open: false
					})
				);
			}
			if (parsedConfig[this._fileActionKey]) {
				panes.push(new TitlePane({
						title: 'Файлы',
						content: this._getFileButtonGroup(),
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
					if (action.action && action.params) {
						processedAction = function (row) {
							action.action(row, ...action.params);
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
		},

		_getFileButtonGroup: function (fileActionsConfig) {
			const uploaderParams = fileActionsConfig[this._fileToDatastoreUploadKey];
			if (typeof uploaderParams.storeUrl === 'string') {
				return new CsvUploader({
					storeUrl: uploaderParams.storeUrl,
					removeNumberOfRows: uploaderParams.removeNumberOfRows || 0
				});
			}
			throw new Error('Invalid fileActions config');
		}
	});
});