define([
	'dojo/_base/declare',
	'rgrid/mixins/_EventDriven',
	'rgrid/HideablePanesMenu'
], function (declare, _EventDriven, HideablePanesMenu) {
	return declare([_EventDriven, HideablePanesMenu], {
		setEventBus: function (eventBus) {
			this.inherited(arguments);
			for (const pane of this._panes) {
				if (pane.content.setEventBus) {
					pane.content.setEventBus(eventBus);
				}
			}
		},
		reconfigure: function () {
			this.inherited(arguments);
			for (const pane of this._panes) {
				if (pane.content.reconfigure) {
					pane.content.reconfigure();
				}
			}
		},
	});
});