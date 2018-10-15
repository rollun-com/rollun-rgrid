define(['dojo/_base/declare',
		'dijit/_WidgetBase',
		'dojo/dom-construct',
		'dojo/dom-style',
		'dojo/on',
		'rgrid/editors/JsonEditorWebComponent',
		'dojo/dom-class',
		'dojo/_base/lang',
		'dgrid/Grid',
		'dijit/popup'],
	function (declare,
			  _WidgetBase,
			  domConstruct,
			  domStyle,
			  on,
			  JsonEditorPopup,
			  domClass,
			  lang,
			  Grid,
			  dijitPopup) {
		return declare([_WidgetBase], {

			dropDownDefaultValue: '{}',

			constructor: function (params) {
				this._grid = params.grid;
				this._options = params.options;
				this._store = params.store;
			},

			buildRendering: function () {
				if (!this.domNode) {
					this.domNode = domConstruct.toDom('<div style="display: flex;flex-wrap: wrap;"></div>');
				}
				this._saveButtonNode = domConstruct.toDom('<button class="btn btn-sm btn-primary">Сохранить</button>');
				this._cancelButtonNode = domConstruct.toDom('<button class="btn btn-sm btn-secondary">Отмена</button>');
				this.domNode.appendChild(this._saveButtonNode);
				this.domNode.appendChild(this._cancelButtonNode);

			},

			postCreate: function () {
				on(this._saveButtonNode, 'mouseup', () => {
					this._saveEditorData();
					dijitPopup.close(this._editor);
					this._started = false;
				});
				on(this._cancelButtonNode, 'mouseup', () => {
					dijitPopup.close(this._editor);
					this._started = false;
				});
			},

			_saveEditorData: function () {
				const currentCell = (this._grid.cell(this.domNode)),
					updatedRowData = currentCell.row.data;
				updatedRowData[currentCell.field] = this.get('value');
				this._store.put(updatedRowData);
			},

			startup: function () {
				this.inherited(arguments);
				this.openPopup();
			},

			openPopup: function (callback) {
				this._editor = new JsonEditorPopup({
					grid: this._grid,
					options: this._options,
				});
				dijitPopup.open({
					parent: this,
					popup: this._editor,
					around: this.domNode,
					orient: ["below-centered", "above-centered"],
					onExecute: () => {
						dijitPopup.close(this._editor);
					},
					onCancel: () => {
						dijitPopup.close(this._editor);
					},
					onClose: () => {
						this._restoreCellValue();
					}
				});
			},

			_restoreCellValue() {
				const parentNode = this.domNode.parentNode,
					options = {alreadyHooked: true},
					cell = this._grid.cell(this.domNode),
					column = this._grid.column(this.domNode);
				column._editorBlurHandle.pause();
				parentNode.removeChild(this.domNode);
				domClass.remove(cell.element, 'dgrid-cell-editing');
				domConstruct.empty(parentNode);
				const customRenderedCell = column.renderCell(cell.row.data, this._grid._activeValue, parentNode,
					this._grid._activeOptions ? lang.delegate(options, this._grid._activeOptions) : options);
				Grid.appendIfNode(parentNode, customRenderedCell);
				this._grid._focusedEditorCell = this._grid._activeCell = this._grid._activeValue = this._grid._activeOptions = null;
			},

			_setValueAttr: function (value) {
				this._editor.set('value', value);
				this.value = value;
			},

			_getValueAttr: function () {
				return this._editor.get('value');
			},
		});
	});