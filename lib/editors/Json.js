define([
	'dojo/_base/declare',
	'dijit/_WidgetBase',
	'dojo/dom-construct',
	'dojo/on',
	'https://cdn.jsdelivr.net/npm/jsoneditor@5.24.6/dist/jsoneditor.min.js',
	'dojo/dom-class',
	'dojo/_base/lang',
	'dgrid/Grid',
], function (declare, _WidgetBase, domConstruct, on, JsonEditor, domClass, lang, Grid) {
	return declare([_WidgetBase], {
		value: null,
		constructor: function (params) {
			this._grid = params.grid;
			this._options = params.options;
			this._store = params.store;
		},
		buildRendering: function () {
			if (!this.domNode) {
				this.domNode = domConstruct.toDom('<div style="background-color: #fff"</div>');
			}
			this._editor = new JsonEditor(this.domNode, this._options);
			this._saveButtonNode = domConstruct.toDom('<button class="btn btn-primary w-100">Сохранить</button>');
			this.domNode.appendChild(this._saveButtonNode);
		},
		postCreate: function () {
			on(this._saveButtonNode, 'click', () => {

				this._saveEditorData();
				this._restoreCellValue();

			});
		},

		_saveEditorData: function () {
			const currentCell = (this._grid.cell(this.domNode)),
				updatedRowData = currentCell.row.data;
			updatedRowData[currentCell.field] = this.get('value');
			this._store.put(updatedRowData);
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
			this._editor.set(JSON.parse(value));
			this.value = value;
		},

		_getValueAttr: function () {
			return this._editor.get();
		},

		destroy: function () {
			this._editor.destroy();
			this.inherited(arguments);
		}
	});
});