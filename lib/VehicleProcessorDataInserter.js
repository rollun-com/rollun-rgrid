define([
	'dojo/_base/declare',
	'dijit/_WidgetBase',
	'rgrid/mixins/_EventDriven',
	'dijit/form/Button',
	'dijit/ConfirmDialog',
	'dojo/dom-construct',
	'dgrid/OnDemandGrid',
	'dstore/Memory'
], function (declare,
			 _WidgetBase,
			 _EventDriven,
			 Button,
			 ConfirmDialog,
			 domConstruct,
			 OnDemandGrid,
			 Memory) {
	return declare([_WidgetBase, _EventDriven], {
		_targetUrl: null,

		constructor: function (params) {
			if (typeof params.targetUrl === 'string') {
				this._targetUrl = params.targetUrl;
			}
		},

		buildRendering: function () {
			this.inherited(arguments);
			this._openButton = new Button({
				label: 'Добавить фильтр'
			}, this.domNode);
			this._openButton.placeAt(this.domNode, 'last');
		},

		postCreate: function () {
			this._openButton.on('click', () => {
				this._openInputForm();
			});
		},

		_openInputForm: function () {
			this._formModal = new ConfirmDialog({
				title: 'Добавление нового процессора',
				content: this._getModalContent(),
				execute: () => {
					this._sendData();
				},
				style: 'width: 50%'
			});
			this._formModal.show();
		},

		_getModalContent: function () {
			const modalContentNode = domConstruct.toDom(
				`<div class="p-1 pr-3 border-bottom">
					<div class="mb-3">
						<form class="p-3">
							<div class="form-group row">
    							<label for="vehicle-processor__processor-name" class="col-3 col-form-label">Имя процессора</label>
    							<input type="text" class="form-control col-9" id="vehicle-processor__processor-name">
  							</div>
  							<div class="form-group row">
    							<label for="vehicle-processor__processor-tpe" class="col-3 col-form-label">Тип процессора</label>
    							<input type="text" class="form-control col-9" id="vehicle-processor__processor-type" placeholder="esfgreagaegvfrgt" disabled>
  							</div>
  							<div class="form-group row">
    							<label for="vehicle-processor__processor-name" class="col-3 col-form-label">RQL</label>
    							<input type="text" class="form-control col-9" id="vehicle-processor__processor-rql">
  							</div>
  							<div class="form-group row">
    							<label for="vehicle-processor__processor-name" class="col-3 col-form-label">Приоритет</label>
    							<input type="number" class="form-control col-9" id="vehicle-processor__processor-priority" 
    							min="0" max="10" step="1">
  							</div>
  							<div class="form-group row">
    							<label for="vehicle-processor__processor-status" class="col-3 col-form-label">Статус</label>
    							<input type="number" class="form-control col-9" id="vehicle-processor__processor-status" 
    							min="0" max="1" step="1">
  							</div>
						</form>
					</div>
				</div>`
			);
			this._converterStore = new Memory();
			const gridNode = domConstruct.toDom('<div class="mb-3"></div>'),
				converterGrid = new OnDemandGrid({
					collection: this._converterStore,
					columns: [
						{
							label: 'Имя',
							field: 'id'
						},
						{
							label: 'Сервис',
							field: 'service'
						},
						{
							label: 'Приоритет',
							field: 'priority'
						},
						{
							label: 'Статус',
							field: 'status'
						},
						{
							label: 'Опции',
							field: 'options'
						}
					]
				}, gridNode),
				gridControlsNode = domConstruct.toDom(`
					<form class="p-1 pr-3">
					<h4>Добавление нового фильтра</h4>
						<div class="form-group row">
    						<label for="vehicle-processor__filter-name" class="col-3 col-form-label">Имя фильтра</label>
    						<input type="text" class="form-control col-9" id="vehicle-processor__filter-name">
  						</div>
  						<div class="form-group row">
    						<label for="vehicle-processor__filter-service" class="col-3 col-form-label">Сервис</label>
    						<input type="text" class="form-control col-9" id="vehicle-processor__filter-service">
  						</div>
  						<div class="form-group row">
    						<label for="vehicle-processor__filter-priority" class="col-3 col-form-label">Приоритет</label>
    						<input type="text" class="form-control col-9" id="vehicle-processor__filter-priority"
    						min="0" max="10" step="1">
  						</div>
  						<div class="form-group row">
    						<label for="vehicle-processor__filter-status" class="col-3 col-form-label">Статус</label>
    						<input type="number" class="form-control col-9" id="vehicle-processor__filter-status"
    						 min="0" max="1" step="1">
  						</div>
  						<div class="form-group row">
    						<label for="vehicle-processor__filter-options" class="col-3 col-form-label">Опции</label>
    						<input type="text" class="form-control col-9" id="vehicle-processor__filter-options">
  						</div>
					</form>
				`),
				addFilterBtnNode = domConstruct.create('div'),
				addNewFilterBtn = new Button({
					label: 'Добавить фильтр'
				});
			addNewFilterBtn.placeAt(addFilterBtnNode);
			addNewFilterBtn.on('click', () => {
				const filterName = document.getElementById('vehicle-processor__filter-name').value,
					filterService = document.getElementById('vehicle-processor__filter-service').value,
					filterPriority = document.getElementById('vehicle-processor__filter-priority').value,
					filterStatus = document.getElementById('vehicle-processor__filter-status').value,
					filterOptions = document.getElementById('vehicle-processor__filter-options').value;
				this._converterStore.putSync({
					id: filterName,
					service: filterService,
					priority: filterPriority,
					status: filterStatus,
					options: filterOptions
				});
				converterGrid.refresh();
				converterGrid.resize();
				document.getElementById('vehicle-processor__filter-name').value = "";
				document.getElementById('vehicle-processor__filter-service').value = "";
				document.getElementById('vehicle-processor__filter-priority').value = "";
				document.getElementById('vehicle-processor__filter-status').value = "off";
				document.getElementById('vehicle-processor__filter-status').value = "";
				document.getElementById('vehicle-processor__filter-options').value = "";
			});
			converterGrid.startup();
			modalContentNode.appendChild(gridNode);
			modalContentNode.appendChild(gridControlsNode);
			modalContentNode.appendChild(addFilterBtnNode);
			return modalContentNode;
		},

		_sendData: function () {
			const filterData = this._gatherData(),
				request = new Request(this._targetUri, {
					method: 'POST',
					body: JSON.stringify(filterData),
					headers: new Headers([
						['Content-Type', 'application/json'],
						['Accept', 'application/json']
					]),
				});
			fetch(request);
			this.emit('loadGridContent');
		},

		_gatherData: function () {
			const processorName = document.getElementById('vehicle-processor__processor-name').value,
				processorRql = document.getElementById('vehicle-processor__processor-rql').value,
				processorType = 'filter',
				processorPriority = document.getElementById('vehicle-processor__processor-priority').value,
				processorStatus = document.getElementById('vehicle-processor__processor-status').value,
				processorOptions = this._converterStore.fetchSync();
			return {
				id: processorName,
				rql: processorRql,
				processor: processorType,
				priority: processorPriority,
				status: processorStatus,
				options: processorOptions
			};
		}
	});
});