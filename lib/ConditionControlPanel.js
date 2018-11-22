/* eslint-disable linebreak-style */
define(
  [
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/dom',
    'dojo/dom-construct',
    'dojo/parser',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/form/Button',
    'dojo/text!./templates/ConditionControlPanel.html',
    'dgrid/Grid',
    'dgrid/OnDemandGrid',
    'dgrid/Keyboard',
    'dgrid/Selection',
    'dgrid/Editor',
    'dgrid/extensions/Pagination',
    'dgrid/extensions/ColumnHider',
    'dgrid/extensions/ColumnReorder',
    'dgrid/extensions/ColumnResizer',
    'dgrid/_StoreMixin',
    'rgrid/ConditionEditor/ConditionEditorForm',
    'rql/parser',
    'dojo/when',
    'dgrid/extensions/DijitRegistry',
    'dojo/Deferred',
    'rgrid/mixins/_EventDriven',
    'dojo/on',
  ],
  function (declare,
            lang,
            array,
            dom,
            domConstruct,
            parser,
            _WidgetBase,
            _TemplatedMixin,
            Button,
            template,
            Grid,
            OnDemandGrid,
            Keyboard,
            Selection,
            Editor,
            Pagination,
            ColumnHider,
            ColumnReorder,
            ColumnResizer,
            _StoreMixin,
            FilterEditor,
            Parser,
            when,
            DijitRegistry,
            Deferred,
            _EventDriven,
            on) {
    return declare([_WidgetBase, _TemplatedMixin, _EventDriven], {
      templateString: template,
      baseClass: 'filteredGrid',
      filteredStoreDataOption: null,
      store: null,
      filterListGrid: null,
      columns: null,
      selectionMode: 'single',
      _rowSelected: null,
      _columnsConfig: null,

      constructor: function (object) {
        object = object || {};
        this.inherited(arguments);
        if (typeof object.store === 'object') {
          this.store = object.store;
        }
        if (typeof object.columnsConfig === 'object') {
          this._columnsConfig = object.columnsConfig;
        }
        if (typeof object.domNode === 'object') {
          this.domNode = object.domNode;
        }
        this.columns = [
          {
            label: 'Name',
            field: 'name',
            editor: 'text',
            editOn: 'dblclick',
            autoSave: true,
          },
          {
            label: 'RQL',
            field: 'rql',
            editor: 'text',
            editOn: 'dblclick',
            autoSave: true,
          },
        ];
      },

      _obtainFilterEditorData: function () {
        if (this._columnsConfig) {
          this._parseFilterData(this._columnsConfig);
        } else {
          this._getColumnsFromGrid();
        }
      },

      _getColumnsFromGrid: function () {
        this.handleEventOnce('gridColumns', (event) => {
          this._parseFilterData(event.columns);
        });
        this.emit('getGridColumns');
      },

      _parseFilterData: function (columns) {
        const filterData = [];
        for (const column of columns) {
          filterData.push({
            label: column.label || column.field,
            value: {
              type: 'string',
              name: column.field,
              field: {
                type: 'TextBox',
              },
            },
            filter: [
              {
                id: 0,
                label: '=',
                value: 'eq',
              },
              {
                id: 0,
                label: '>',
                value: 'gt',
              },
              {
                id: 0,
                label: '<',
                value: 'lt',
              },
              {
                id: 0,
                label: '>=',
                value: 'ge',
              },
              {
                id: 0,
                label: '<=',
                value: 'le',
              },
              {
                id: 0,
                label: '!=',
                value: 'ne',
              },
              {
                id: 0,
                label: 'in',
                value: 'in',
              },
              {
                id: 0,
                label: 'match',
                value: 'match',
              },
            ],
          });
        }
        this.filteredStoreDataOption = filterData;
      },

      buildRendering: function () {
        this.inherited(arguments);
        const self = this;

        this.newFilterBtn = new Button({
          label: 'New fitler',
          iconClass: 'flat-add',
          class: 'alt-success',
        }, self.newFilterBtnNode);

        this.removeFilterBtn = new Button({
          label: 'Delete filter',
          iconClass: 'flat-delete',
          class: 'alt-danger',
        }, self.removeFilterBtnNode);

        this.setFilterBtn = new Button({
          label: 'Apply filter',
          iconClass: 'flat-check',
          class: 'alt-primary',
        }, self.setFilterBtnNode);

        this.filterListGrid = new (
          declare([OnDemandGrid, DijitRegistry, Selection, Editor, ColumnResizer, ColumnHider])
        )({
          collection: this.store,
          columns: self.columns,
          selectionMode: self.selectionMode,

        }, self.filterListGridNode);
        this.filterListGrid.startup();
      },

      postCreate: function () {
        const self = this;
        this.inherited(arguments);

        on(self.newFilterBtn, 'click', lang.hitch(self, function (e) {
          self.store.add({
            name: `Filter ${self._generateFilterName()}`,
          })
            .then(() => {
              self.filterListGrid.refresh();
            });
        }));
        on(self.removeFilterBtn, 'click', lang.hitch(self, function (e) {
          if (self.getSelectedRow() !== null) {
            self.store.remove(self.getSelectedRow().id)
              .then(() => {
                self.filterListGrid.refresh();
              });
          } else {
            alert('No filter selected');
          }
        }));
        on(self.filterListGrid, 'dgrid-select', function (event) {
          self._buildConditionEditor(event);
        });
        on(self.filterListGrid, 'dgrid-datachange', function (event) {
          self._buildConditionEditor(event);
        });
        on(self.setFilterBtn, 'click', function (e) {
          self.filterEditor.filter.saveFilter.call(self.filterEditor.filter);
          const filter = self.store.get(self.getSelectedRow().id);
          filter.then((filterObject) => {
            self._applySelectedFilter(filterObject);
            self.filterListGrid.refresh();
          });
        });
        on(self.filterListGrid, 'dgrid-deselect', function () {
            self.filterEditorNode.innerHTMl = '';
            if (self.filterEditor) {
              self.filterEditor.destroy();
              self.filterEditor = null;
            }
          });
      },

      _buildConditionEditor: function (event) {
        const self = this;
        if (event.type === 'dgrid-datachange') { // if function was called because of rql string being edited
          self._rowSelected[event.cell.column.field] = event.value;
        } else {
          self._rowSelected = event.rows[0].data;
        }
        self.filterEditorNode.innerHTMl = '';
        if (self.filterEditor) {
          self.filterEditor.destroy();
          self.filterEditor = null;
        }
        self._obtainFilterEditorData();
        self.filterEditor = new FilterEditor({
          name: self.getSelectedRow().name,
          filter: {
            name: self.getSelectedRow().name,
            rql: self.getSelectedRow().rql,
          },
        }, self.filterEditorNode, self.filteredStoreDataOption);
        on(self.filterEditor.filter, 'save-filter', function (event) {
          if (event !== null
            && event !== undefined
            && event.filter !== null
            && event.filter !== undefined
            && event.filter.rql !== null
            && event.filter.rql !== undefined
          ) {
            const selectedRow = self.getSelectedRow();
            const rql = event.filter.rql;
            if (selectedRow.id === 'search') {
              self._writeCopyOfFilterToStore(selectedRow, rql);
            } else {
              self._writeFilterToStore(selectedRow, rql);
            }
          } else {
            console.warn('not set field in event');
          }
        });
      },

      _generateFilterName: function () {
        let firstPart = (Math.random() * 46656) | 0;
        let secondPart = (Math.random() * 46656) | 0;
        firstPart = (`000${firstPart.toString(36)}`).slice(-3);
        secondPart = (`000${secondPart.toString(36)}`).slice(-3);
        return firstPart + secondPart;
      },

      _writeCopyOfFilterToStore: function (filterRow, rql) {
        const newFilter = {
          name: `${filterRow.name} ${this._generateFilterName()}`,
          rql: rql,
        };
        this.store.add(newFilter)
          .then(() => {
            this.filterListGrid.refresh();
          });
      },

      _writeFilterToStore: function (filterRow, rql) {
        const newFilter = {
          id: filterRow.id,
          name: filterRow.name,
          rql: rql,
        };
        this.store.put(newFilter, { overwrite: true })
          .then(() => {
            this.filterListGrid.refresh();
          });
      },

      _applySelectedFilter: function (filterRow) {
        if (typeof filterRow === 'object') {
          const queryObject = Parser.parse(filterRow.rql);
          this.emit('loadGridContentForQuery', {
            query: this._fixQuery(queryObject),
            label: filterRow.name,
          });
        } else {
          alert('No filter selected');
        }
      },

      _fixQuery: function (query) {
        if ((query.name === 'and' || query.name === 'or') && query.args.length === 1) {
          return query.args[0];
        }
          return query;
      },

      startup: function () {
        this.inherited(arguments);
        this.filterListGrid.startup();
      },

      getSelectedRow: function () {
        return this._rowSelected;
      },

      reconfigure: function () {
      },

      resize: function () {
        this.inherited(arguments);
        this.filterListGrid.resize();
      },
    });
  }
);
