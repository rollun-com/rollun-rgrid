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
	'dojo/dom',
	'rgrid/store/QueryableStore'
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
	dom,
	QueryableStore) => {
	return declare('CsvUploader', [_WidgetBase], {
		_removeNumberOfRows: null,
		_uploadDialog: null,
		_confirmUploadDialog: null,
		_fileDataStore: null,
		_destinationDataStore: null,
		_delimeter: ',',

		constructor: function (params) {
			if (typeof params.storeUrl === 'string') {
				this._destinationDataStore = new QueryableStore({target: params.storeUrl});
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
				label: 'Добавить данные из csv файла'
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
					content: this._getUploadDialogContent(),
					style: 'max-width: 25%;'
				});
				this._uploadDialog.startup();
			}
			this._uploadDialog.show();
		},

		_getUploadDialogContent: function () {
			const contentNode = domConstruct.create('div'),
				delimLabel = domConstruct.create('span', {
					innerHTML: 'Выберите разделитель'
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
						{
							label: 'Табуляция',
							value: '\t'
						},
					],
					onChange: () => {
						this._delimeter = delimSelect.get('value');
					},
					'class': 'form-control'
				}),
				continueButton = new Button({
					label: 'Продолжить',
					'class': 'flat-primary',
				});
			on(continueButton.domNode, 'click', () => {
				this._showConfirmDialog();
			});
			domConstruct.place("<div class='input-group rgrid-file-upload-input'>" +
				"<span class='input-group-addon'>Добавьте файл</span>" +
				"<input type='file' id='rgrid-file-input' class='form-control'> " +
				"</div>", contentNode);
			const selectorContainer = domConstruct.toDom("<div class='input-group'>" +
				"<span class='input-group-addon'>Выберите разделитель</span>" +
				"</div>");
			delimSelect.placeAt(selectorContainer, 'last');
			domConstruct.place(selectorContainer, contentNode, 'last');
			domConstruct.place("<div class='input-group rgrid-file-upload-input'>" +
				"<span class='input-group-addon'>Сколько строк пропустить?</span>" +
				"<input type='number' id='rgrid-skip-rows-input' class='form-control'  min='0'> " +
				"</div>", contentNode);
			continueButton.placeAt(contentNode, 'last');
			return contentNode;
		},

		_showConfirmDialog: function () {
			const addedFile = dom.byId('rgrid-file-input').files[0],
				fileReader = new FileReader(),
				MemoryCsv = declare([Memory, _Csv]),
				contentNode = domConstruct.create('div');
			fileReader.onload = (() => {
				this._fileDataStore = new MemoryCsv({
					data: this._prepareRows(fileReader.result),
					delimeter: this._delimeter,
					newline: '\n'
				});
				const grid = new OnDemandGrid({
					collection: this._fileDataStore,
					columns: this._getFieldsForConfirmGrid()
				}, contentNode);
				this._confirmUploadDialog = new ConfirmDialog({
					title: 'Проверьте правильность данных',
					execute: () => {
						this._sendData();
					},
					onCancel: () => {
						this._confirmUploadDialog.hide();
						this._uploadDialog.show();
					},
					style: {
						'min-width': '35em',
						'width': '60%'
					}
				});
				this._uploadDialog.hide().then(() => {
					grid.startup();
					this._confirmUploadDialog.set('content', contentNode);
					this._confirmUploadDialog.startup();
					this._confirmUploadDialog.show();
					grid.resize();
				});
			});
			fileReader.readAsText(addedFile);
		},

		_prepareRows: function (data) {
			const dataArray = data.split('\n'),
			removeNumberOfRows = dom.byId('rgrid-skip-rows-input').value || this._removeNumberOfRows;
			dataArray.splice(0, removeNumberOfRows);
			return dataArray.join('\n');
		},

		_getFieldsForConfirmGrid: function () {
			let fields = [];
			for (let fieldName of this._fileDataStore.fieldNames) {
				fields.push({
					field: fieldName,
					label: fieldName
				});
			}
			return fields;
		},

		_sendData: function () {
			for (const item of this._fileDataStore.fetchSync()) {
				this._destinationDataStore.add(item);
			}
		},
	});
});