define([
	'dojo/_base/declare',
	'rgrid/mixins/_EventDriven',
	'dijit/form/Button',
	'dijit/ConfirmDialog'
], function (declare,
			 _EventDriven,
			 Button) {
	return declare('WebhookButton', [Button, _EventDriven], {
		_action: null,

		constructor: function (params) {
			this._action = params.action;
		},

		postCreate: function () {
			this.handleEvent('gridSelect', (event) => {
				this._handleSelect(event.rows);
			});
			this.handleEvent('gridDeselect', (event) => {
				this._handleDeselect(event.rows);
			});
			this.on('click', () => {
				this.executeAction();
			});
		},

		_handleSelect: function (rows) {
			this._selectedRows = rows;
		},

		_handleDeselect: function () {

		},

		//execute action for selected rows
		executeAction: function () {
			if (this._selectedRows) {
				for (const row of this._selectedRows) {
					this._action.call(this, row);
				}
				this.emit('loadGridContent');
			} else {
				alert('Сначала выберите строку таблицы');
			}

		}
	});
});