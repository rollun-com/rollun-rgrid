define(['dojo/_base/declare', 'rgrid/mixins/_PrefabBase', 'rgrid/VehicleProcessorDataInserter'],
	function (declare, _PrefabBase, VehicleProcessorDataInserter) {
	return declare([_PrefabBase], {
		configKey: 'vehicleProcessorDataInserter',
		attachPointName: 'vehicle-processor-data-inserter',

		/*
		{
			id: 'vehicleProcessorDataInserter',
			targetUrl: 'me/cool/store'
		}
		 */
		deploy: function (configStore, params) {
			this.inherited(arguments);
			const parsedConfig = this._getParsedConfig(this.configKey);
			return new VehicleProcessorDataInserter({targetUrl: parsedConfig.targetUrl, attachPoint: this.attachPointName});
		}
	});
});