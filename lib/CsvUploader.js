define([
	'dojo/_base/declare',
	'dijit/_WidgetBase',
	'dijit/form/Button',
	'dijit/ConfirmDialog',
	'dgrid/OnDemandGrid',
	'dstore/Memory',
	'dstore/Csv',
	'dojo/on',
	'dijit/Dialog',
	'dojo/dom-construct',
	'dijit/form/Select',
	'dojo/dom'
], (declare,
	_WidgetBase,
	Button,
	ConfirmDialog,
	OnDemandGrid,
	Memory,
	_Csv,
	on,
	Dialog,
	domConstruct,
	Select,
	dom) => {
	return declare('CsvUploader', [_WidgetBase], {
		_storeUrl: null,
		_removeNumberOfRows: null,
		_uploadDialog: null,
		_confirmUploadDialog: null,
		_fileDataStore: null,

		constructor: function (params) {
			if (typeof params.storeUrl === 'string') {
				this._storeUrl = params.storeUrl;
			} else {
				throw new Error('storeUrl is not set or isn`t a string');
			}
			if (typeof params.removeNumberOfRows === 'number') {
				this._removeNumberOfRows = parseInt(params.removeNumberOfRows);
			} else {
				throw new Error('removeNumberOfRows is not set or isn`t a number');
			}
		},

		buildRendering: function () {
			this.inherited(arguments);
			this._actionButton = new Button({
				label: 'Добавить данные из файла'
			});
			this._actionButton.placeAt(this.domNode, 'last');
		},

		postCreate: function () {
			on(this._actionButton.domNode, 'click', () => {
				this.openUploadDialog();
			});
		},

		openUploadDialog: function () {
			if (!this._uploadDialog) {
				this._uploadDialog = new Dialog({
					title: 'Выберите файл для загрузки',
					content: this._getUploadDialogContent()
				});
				this._uploadDialog.startup();
			}
			this._uploadDialog.show();
		},

		_getUploadDialogContent: function () {
			const contentNode = domConstruct.create('div'),
				inputLabel = domConstruct.create('label', {
					'for': 'rgrid-file-input',
					innerText: 'Добавьте файл'
				}),
				input = domConstruct.create('input', {
					type: 'file',
					id: 'rgrid-file-input'
				}),
				delimLabel = domConstruct.create('label', {
					'for': 'rgrid-file-delim',
					innerText: 'Выберите разделитель'
				}),
				delimSelect = new Select({
					name: 'Разделитель',
					options: [
						{
							label: 'Запятая',
							value: ',',
							selected: true
						},
						{
							label: 'Точка с запятой',
							value: ';'
						},
					]
				}),
				continueButton = new Button({
					label: 'Продолжить',
					'class': 'flat-primary',
					'style': {width: '100%'}
				});
			on(continueButton.domNode, 'click', () => {
				this._showConfirmDialog();
			});
			contentNode.appendChild(inputLabel);
			contentNode.appendChild(input);
			contentNode.appendChild(delimLabel);
			delimSelect.placeAt(contentNode);
			continueButton.placeAt(inputLabel);
			return contentNode;
		},

		_showConfirmDialog: function () {
			this._confirmUploadDialog = new ConfirmDialog({
				label: 'Проверьте правильность данных',
				content: this._getConfirmUploadDialogContent(),
				onOk: () => {
					this._sendData();
				},
				onCancel: () => {
					this._confirmUploadDialog.hide();
					this._uploadDialog.show();
				}
			});
			this._uploadDialog.hide().then(() => {
				this._confirmUploadDialog.startup();
				this._confirmUploadDialog.show();
			});
		},

		_getConfirmUploadDialogContent: function () {
			const addedFile = dom.byId('rgrid-file-input').files[0],
				fileReader = new FileReader(),
				MemoryCsv = declare([Memory, _Csv]),
				contentNode = domConstruct.create('div');
			fileReader.onload = (() => {
				this._fileDataStore = new MemoryCsv({data: this._prepareRows(fileReader.result)});
				const grid = new OnDemandGrid({collection: this._fileDataStore}, contentNode);
				grid.startup();
			});
			fileReader.readAsText(addedFile);
			return contentNode;
		},

		_prepareRows: function (data) {
			const dataArray = data.split('\n');
			dataArray.splice(0, this._removeNumberOfRows);
			return dataArray.join('\n');
		},

		_sendData: function () {
			console.log(this._fileDataStore.fetchSync());
		},
	});
});