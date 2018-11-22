define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/aspect',
    'dojo/dom',
    'dojo/dom-construct',
    'dojo/on',
    'dojo/parser',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/form/Button',
    'dojo/dnd/Source',
    'rgrid/ConditionEditor/Tree',
    './ConditionParser',
    './ConditionNode',
    'dstore/RequestMemory',
    'dstore/Filter',
    'dstore/Memory',
    'dstore/Rest',
    'dstore/Trackable',
    'dojo/Deferred',

    'dojo/text!rgrid/templates/ConditionEditor.html'
  ],
  function (declare,
            lang,
            array,
            aspect,
            dom,
            domConstructor,
            on,
            parser,
            _WidgetBase,
            _TemplatedMixin,
            Button,
            Source,
            STree,
            FilterParser,
            SmartFilterNode,
            RequestMemory,
            Filter,
            Memory,
            Rest,
            Trackable,
            Deferred,
            templates) {
    return declare([_WidgetBase, _TemplatedMixin], {
      templateString: templates,
      filter: {
        name: 'new Filter',
        rql: '',
        filter: null,
        stackFilterObject: [],
      },
      baseClass: 'filter-editor',
      filteredStoreDataOption: null,
      _store: null,

      constructor: function (object) {
        this.inherited(arguments);
        var self = this;

        if (object !== null && object !== undefined) {
          for (var index in object) {
            if (object.hasOwnProperty(index)) {
              self[index] = object[index];
            }
          }

          if (object.filter !== null && object.filter !== undefined) {
            if (this.filter === null || this.filter === undefined) {
              this.filter = object.filter;
            }
          }
        }
      },

      buildRendering: function () {
        this.inherited(arguments);

        this.saveFilterBtn = new Button({
          label: 'Save filter',
          iconClass: 'flat-save',
          class: 'alt-primary'
        }, this.saveFilterBtnNode);

        this.controlPanel = new Source(this.controlPanelNode, {
          copyOnly: true,
          selfCopy: true,
          selfAccept: false,
        });

        this.controlPanel.insertNodes(false, [
          {
            data: '<div class="text-center"><span class="fa fa-times controller-tree-icons"><p>and</p></span></div>',
            type: ['and']
          },
          {
            data: '<div class="text-center"><i class=" fa fa-plus controller-tree-icons"></i><p>or</p></div>',
            type: ['or']
          },
          {
            data: '<div class="text-center"><i class="controller-tree-icons fas fa-filter"></i><p>condition</p></div>',
            type: ['filter']
          }
        ]);

        const filterParser = new FilterParser();
        let root,
          filters;
        switch (true) {
          case (this.filter.rql !== null &&
            this.filter.rql !== undefined &&
            this.filter.rql.length > 5): {
            filters = filterParser.parseRQLToData(this.filter.rql, 1, 0);
            root = new;
            SmartFilterNode('and', 0, null);
            root.name = 'Root node, ' + this.filter.name;
            filters.push(root);
            break;
          }
          case (
            this.filter.filter !== null &&
            this.filter.filter !== undefined &&
            this.filter.filter instanceof Filter
          ): {
            filters = filterParser.parse(this.filter.filter, 1, 0);
            root = new;
            SmartFilterNode('and', 0, null);
            root.name = 'Root node , ' + this.filter.name;
            filters.push(root);
            break;
          }
          case(
            this.filter.stackFilterObject !== null &&
            this.filter.stackFilterObject !== undefined &&
            Array.isArray(this.filter.stackFilterObject) &&
            this.filter.stackFilterObject.length > 0
          ): {
            filters = this.filter.stackFilterObject;
            break;
          }
          default: {
            const filter = new SmartFilterNode('and', 0, null);
            filter.name = 'Root node, ' + this.filter.name;
            filters = [filter];
          }
        }

        this._store = new (declare([Memory, Trackable]))({
          data: filters,
          getChildren: function (object, onComplete) {
            this.filter({ 'parentID': object.id })
              .fetch()
              .then(function (objects) {
                onComplete(objects);
              });
          },
          mayHaveChildren: function (item) {
            return item.mayHawChild;
          },
          getRoot: function (onItem, onError) {
            // there should be only a single object in (the root of) this collection,
            // so we just return that
            this.get(0)
              .then(onItem);
          },
          getLabel: function (object) {
            if (!object.name) {
              return object.type ? object.type : 'non filter';
            } else {
              return object.name;
            }
          },
          isItem: function (item) {
            if (item !== null) {
              return item instanceof SmartFilterNode;
            } else {
              return false;
            }
          }
        });

        this.filterTree = new STree({
          model: this._store,
          getTooltip: function (object) {
            if (!object.name) {
              return object.type ? object.type : 'non filter';
            } else {
              switch (object.type) {
                case 'eq': {
                  return object.name + ' = ' + object.value;
                }
                case 'ne': {
                  return object.name + ' != ' + object.value;
                }
                case 'lt': {
                  return object.name + ' < ' + object.value;
                }
                case 'le': {
                  return object.name + ' <= ' + object.value;
                }
                case 'gt': {
                  return object.name + ' > ' + object.value;
                }
                case 'ge': {
                  return object.name + ' >= ' + object.value;
                }
                case 'in': {
                  return object.name + ' in ' + object.value;
                }
                case 'match': {
                  return object.name + ' /' + object.value + '/';
                }
                case 'contains': {
                  return object.name + ' contains ' + object.value;
                }
                default: {
                  return object.name;
                }
              }
            }
          },
          getIconClass: function (item, opened) {
            if (item) {
              switch (item.type) {
                case 'and': {
                  return 'fa fa-times';
                }
                case 'or': {
                  return 'fa fa-plus';
                }
                case 'eq': {
                  return 'icons eq';
                }
                case 'ne': {
                  return 'icons ne';
                }
                case 'lt': {
                  return 'icons lt';
                }
                case 'le': {
                  return 'icons le';
                }
                case 'gt': {
                  return 'icons gt';
                }
                case 'ge': {
                  return 'icons ge';
                }
                default: {
                  return 'glyphicon glyphicon-filter';
                }
              }
            }
          },
        }, this.filterTreeNode);
      },

      postCreate: function () {
        this.inherited(arguments);
        var self = this;
        this.own(
          aspect.around(self._store, 'add', lang.hitch(this, function (originalPut) {
            var self = this;
            return function (obj, options) {
              if (options && options.parent) {
                obj.parentID = options.parent.id;
                var data = self._store.data;
                var max = 0;
                data.forEach(function (element) {
                  if (max < element.id) {
                    max = element.id;
                  }
                });
                obj.id = max + 1;
              }
              return originalPut.call(self._store, obj, options);
            };
          })),
          aspect.around(self._store, 'put', lang.hitch(this, function (originalPut) {
            return function (obj, options) {
              if (options && options.parent && options.oldParent) {
                if (obj.parentID !== options.parent.id) {
                  obj.parentID = options.parent.id;

                }
              } else if (options && options.parent) {
                if (obj.id === null || obj.id === -1 || obj.id === undefined) {
                  obj.parentID = options.parent.id;
                  var data = self._store.data;
                  var index = [];
                  data.forEach(function (element) {
                    index.push(element.id);
                  });
                  index.sort();
                  obj.id = index[index.length - 1] + 1;
                }
              }
              return originalPut.call(self._store, obj, options);
            };
          })),
          on(this.saveFilterBtn, 'click', lang.hitch(this, function (e) {
            this.saveFilter(e);
          })),
          aspect.around(self._store, 'itemCreator', lang.hitch(this, function (originalItemCreator) {
            return function (nodes, target, source) {
              var sourceItem = source.getItem(nodes[0].id);
              var filter = null;
              if (sourceItem) {
                if (Array.isArray(sourceItem.type)) {
                  switch (sourceItem.type[0]) {
                    case 'and': {
                      filter = new SmartFilterNode('and');
                      return [filter];
                    }
                    case 'or': {
                      filter = new SmartFilterNode('or');
                      return [filter];
                    }
                    case 'filter': {
                      self.emit('set-condition-editor-handler', {
                        onOk: function (filter) {
                          self._store.filter({ 'type': 'proxy' })
                            .forEach(function (item) {
                              filter.id = item.id;
                              filter.parentID = item.parentID;
                              self._store.put(filter, {
                                parent: parent,
                                overwrite: true
                              });
                            });
                        },
                        onCancel: function () {
                          self._store.filter({ 'type': 'proxy' })
                            .forEach(function (item) {
                              self._store.remove(item.id);
                            });
                        }
                      });
                      self.emit('show-condition-edit-form', {});
                      filter = new SmartFilterNode('proxy');
                      filter.name = 'new Condition';
                      filter.mayHawChild = false;
                      return [filter];
                    }
                  }
                }
              }
            };
          }))
        );
      },

      saveFilter: function (event) {
        event = event || {};
        var parser = new FilterParser();
        this._store.get(0)
          .then((root) => {
            var filter = parser.getAllChild(this._store, root);
            filter = parser.optimiseFilter(filter, filter.type);
            var lastElementIndex = filter.length - 1;
            event.filter = {
              name: this.filter.name,
              rql: parser.parseDataToRQL(filter[lastElementIndex])
            };
            event.detail = '';
            this.emit('save-filter', event);
          });
      },

      startup: function () {
        this.inherited(arguments);
      },

      getSmatrFilters: function () {
        var filterParser = new FilterParser();
        var node = null;
        this._store.get(0)
          .then(function (item) {
            node = filterParser.getAllChild(filterStore, item);
            node = filterParser.optimiseFilter(node, null);
          });
        return node;
      },

      getSelected: function () {
        return this.filterTree.selectedItem;
      },

      destroy: function () {
        this.inherited(arguments);
        this.saveFilter();

        var self = this;

        if (self.saveFilterBtn !== null && self.saveFilterBtn !== undefined) {
          self.saveFilterBtn.destroy();
          self.saveFilterBtn = null;
          try {
            domConstructor.destroy(self.saveFilterBtn.domNode);
          } catch (e) {
          }
          try {
            domConstructor.destroy(self.saveFilterBtnNode);
          } catch (e) {
          }
          self.saveFilterBtnNode = null;
        }
        if (self.controlPanel !== null && self.controlPanel !== undefined) {
          self.controlPanel.destroy();
          self.controlPanel = null;
          try {
            domConstructor.destroy(self.controlPanel.domNode);
          } catch (e) {
          }
          try {
            domConstructor.destroy(self.controlPanelNode);
          } catch (e) {
          }
          self.controlPanelNode = null;
        }
        if (self.filterTree !== null && self.filterTree !== undefined) {
          self.filterTree.destroy();
          domConstructor.destroy(self.filterTree.domNode);
          domConstructor.destroy(self.filterTreeNode);
          self.filterTreeNode = null;
          self.filterTree = null;
        }
        domConstructor.destroy(self.domNode);
      }
    });
  });
