define([
	'dojo/_base/declare',
	'dijit/_WidgetBase',
	'dojo/request',
	'dijit/form/Button',
	'dojo/on',
	'dijit/ConfirmDialog',
	'dojo/dom-construct',
	'dijit/form/Select',
	'dstore/Memory',
	'dgrid/OnDemandGrid',
	'dijit/_TemplatedMixin',
	'dojo/dom-style',
	'dijit/Dialog',
	'rgrid/mixins/_EventDriven'
], (declare,
	_WidgetBase,
	request,
	Button,
	on,
	ConfirmDialog,
	domConstruct,
	Select,
	Memory,
	OnDemandGrid,
	_TemplatedMixin,
	domStyle,
	Dialog,
	_EventDriven) => {
	return declare('PasteInput', [_WidgetBase, _EventDriven], {
		_targetUri: null,
		_rowDelimeter: "\n",
		_dataDelimeter: "\t",
		_validator: null,
		_noId: false,
		_fieldsToUpload: null,
		_hasHeaderLine: false,

		constructor: function (params) {
			if (typeof params.storeUrl === 'string') {
				this._targetUri = params.storeUrl;
			} else {
				throw new Error('targetUri is not set or isn`t a string');
			}
			if (typeof params.validator === 'function') {
				this._validator = params.validator;
			}
			if (typeof params.noId === 'boolean') {
				this._noId = params.noId;
			}
			if (typeof params.fieldsToUpload === 'object') {
				this._fieldsToUpload = params.fieldsToUpload;
			}
			if (typeof params.hasHeaderLine === 'object') {
				this._hasHeaderLine = params.hasHeaderLine;
			}
		},

		buildRendering: function () {
			this.inherited(arguments);
			this._actionButton = new Button({
				label: 'Добавить данные'
			});
			this._actionButton.placeAt(this.domNode, 'last');
		},

		postCreate: function () {
			on(this._actionButton.domNode, 'click', () => {
				this.openUploadDialog();
			});

			this.handleEvent('gridLoadedContent', (event) => {
				this._gridColumns = event.columns;
			});
		},

		openUploadDialog: function () {
			this._uploadDialog = new ConfirmDialog({
				title: 'Введите данные, которые нужно загрузить',
				content: this._getUploadDialogContent(),
				style: 'max-width: 50%; min-width: 25%',
				execute: () => {
					let validated = false;
					const processedInput = this._parseInput();
					try {
						this._validateInput(processedInput);
						validated = true;
					}
					catch (error) {
						this._uploadDialog.hide().then(() => {
							this._openFailDialog(error);
						});
					}
					if (validated) {
						this._writeDataToStore(processedInput);
						this._uploadDialog.hide();
						this._openSuccessDialog();
					}
				}
			});
			this._uploadDialog.startup();
			this._uploadDialog.show();
		},

		_getUploadDialogContent: function () {
			const uploadWindowContent = new (declare([_WidgetBase, _TemplatedMixin], {
				templateString: `
				<div>
				<div class="alert alert-danger" role="alert" 
				data-dojo-attach-point="alert"
				style="display: none;"></div>
					<div class="row">
						<div class="col-md-6">
							<div class="input-group">
								<span class="input-group-addon">Выберте раделитель строк</span>
								<select id="r-row-delim-select" class="form-control"
								data-dojo-attach-point="row_delim_select" 
								data-dojo-type="dijit/form/Select">
									<option value="\n" selected="selected">Перенос строки</option>
									<option value="\t">Табуляция</option>
								</select>
							</div>
						</div>
						<div class="col-md-6">
							<div class="input-group">
								<span class="input-group-addon">Выберте раделитель данных в строке</span>
								<select id="r-data-delim-select" class="form-control" 
								data-dojo-attach-point="data_delim_select"
								data-dojo-type="dijit/form/Select">
    								<option value="\t" selected="selected">Табуляция</option>
    								<option value=",">Запятая</option>
    								<option value=";">Точка с запятой</option>
								</select>				
							</div>
						</div>
					</div>
					<div style="padding-top: 5px;"> 
						<textarea id="r-data-input-field" class="form-control" 
						data-dojo-type="dijit/form/Textarea"
						data-dojo-attach-point="input_field"  
						placeholder="Введите данные сюда"
						style="width:100%; min-height: 20em"></textarea>
					</div>
				</div>`
			}))();
			on(uploadWindowContent.row_delim_select, 'change', () => {
				this._rowDelimeter = uploadWindowContent.row_delim_select.value;
			});
			on(uploadWindowContent.data_delim_select, 'change', () => {
				this._dataDelimeter = uploadWindowContent.data_delim_select.value;
			});
			on(uploadWindowContent.input_field, 'change', () => {
				this._inputData = uploadWindowContent.input_field.value;
			});
			on(uploadWindowContent.input_field, 'paste', () => {
				this._inputData = uploadWindowContent.input_field.value;
			});
			return uploadWindowContent;
		},

		_parseInput: function () {
			const parsedValue = [],
				value = this._inputData.split(this._rowDelimeter),
				tableColumns = this._fieldsToUpload || this._getGridColumns();
			for (const dataRow of value) {
				let rowItems = dataRow.split(this._dataDelimeter), result = {};
				for (const index in tableColumns) {
					if (tableColumns.hasOwnProperty(index)) {
						result[tableColumns[index]] = (rowItems[index] === undefined ? "" : rowItems[index]);
					}
				}
				parsedValue.push(result);
			}
			return parsedValue;
		},

		_getGridColumns: function () {
			const gridColumnNames = [],
				gridColumnsArray = Object.assign([], this._gridColumns);
			for (const columnConfig of gridColumnsArray) {
				gridColumnNames.push(columnConfig.field);
			}
			if (this._noid === true) {
				gridColumnNames.shift();
			}
			return gridColumnNames;
		},

		_validateInput: function (parsedInput) {
			if (this._validator) {
				this.validator(parsedInput);
			}
		},

		_writeDataToStore: function (processedInput) {
			const promises = [];
			for (const item of processedInput) {
				const request = new Request(this._targetUri, {
					body: JSON.stringify(item),
					method: 'POST',
					headers: new Headers([
						['Content-Type', 'application/json'],
						['Accept', 'application/json']
					]),
				});
				promises.push(fetch(request));
			}
			Promise.all(promises).then(() => {
				this.emit('loadGridContent');
			});
		},

		_openSuccessDialog: function () {
			if (!this._successDialog) {
				this._successDialog = new Dialog({
					title: 'Готово!',
					content: '<div class="alert alert-success" role="alert" style="width: 100%">' +
					'Данные были успешно добавлены</div>',
					style: 'max-width: 50%; min-width: 25%',
				});
				this._successDialog.startup();
			}
			this._successDialog.show();
		},

		_openFailDialog: function (error) {
			let errorMessage;
			if (typeof error === 'string') {
				errorMessage = error;
			}
			if (typeof error === 'object') {
				errorMessage = error.message;
			} else {
				errorMessage = 'Проверьте правильность ввода';
			}
			if (!this._errorDialog) {
				this._errorDialog = new Dialog({
					title: 'Неправильные данные',
					content: `<div class="alert alert-danger">${errorMessage}</div>`,
					onHide: () => {
						this._uploadDialog.show();
					},
					style: 'min-width: 20%'
				});
				this._errorDialog.startup();
			} else {
				this._errorDialog.set('content', `<div class="alert alert-danger">${errorMessage}</div>`);
			}
			this._errorDialog.show();
		},

	});
});