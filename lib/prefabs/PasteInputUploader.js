define([
	'dojo/_base/declare',
	'rgrid/PasteInputUploader'
], (declare,
	PasteInputUploader) => {
	return declare(null, {
		configKey: 'pasteInputUploader',
		attachPointName: 'paste-input-uploader',
	// {
	// 	 'id' : 'pasteInputUploader',
	// 	 'storeUrl': 'api/datastore/test1_csv',
	// 	 'validator': function () {return true;},
	// 	 'noId': true,
	// 	 'fieldsToUpload': null,
	// 	 'hasHeaderLine': false,
	// }
		deploy: function (configStore, params) {
			const widgetConfig = configStore.getSync(this.configKey);
			if (widgetConfig && widgetConfig.storeUrl) {
				return new PasteInputUploader({
					storeUrl: widgetConfig.storeUrl,
					validator: widgetConfig.validator,
					noId: widgetConfig.noId,
					fieldsToUpload: widgetConfig.fieldsToUpload,
					hasHeaderLine: widgetConfig.hasHeaderLine,
					attachPoint: this.attachPointName
				});
			}
			throw new Error('pasteInputUploader config is missing or invalid');
		}
	});
});