/**
 * Created by root on 20.05.16.
 */
define([
        'dojo/_base/declare',
        'dojo/_base/lang',
        'dojo/_base/array',
        'dojo/aspect',
        "dojo/dom",
        "dojo/dom-construct",
        'dojo/on',
        "dojo/query",
        "dijit/Menu",
        "dijit/MenuItem",
        "dijit/CheckedMenuItem",
        "dijit/MenuSeparator",
        "dijit/PopupMenuItem",
        "dijit/form/Form",
        "dijit/form/DateTextBox",
        "dijit/form/Button",
        "dijit/form/Select",
        "dojox/layout/TableContainer",
        "dijit/ConfirmDialog",
        "dijit/form/TextBox",
        "./util/FilterParser",
        "./Entity/SmartFilterNode",
        "./widget/FilterEditor",
    "dijit/registry",
    "dijit"
    ],
    function (declare,
              lang,
              array,
              aspect,
              dom,
              domConstruct,
              on,
              query,
              Menu,
              MenuItem,
              CheckedMenuItem,
              MenuSeparator,
              PopupMenuItem,
              Form,
              DateTextBox,
              Button,
              Select,
              TableContainer,
              ConfirmDialog,
              TextBox,
              FilterParser,
              SmartFilterNode,
              FilterEditor,
              registry,
              dijit) {
        return declare([], {

            conditionEditorDialog: null,
            menu: null,
            filterEditor: null,
            __addFilter: null,
            __onCancel: null,
            filteredStoreDataOption: null,
            name: null,

            editor: {
                name: null,
                type: null,
                value: null,
                valueType: null
            },

            constructor: function (conf, domNode, filteredStoreDataOption) {
                this.filter = new FilterEditor(conf);
                this.filter.startup();
                dom.byId(domNode).appendChild(this.filter.domNode);

                if (filteredStoreDataOption !== undefined) {
                    this.filteredStoreDataOption = filteredStoreDataOption;
                }
                this._conditionEditDialogInit();
                this._filterMenuInit();

                //this.filter._setConditionEditorHandler = this._setConditionEditorHandler;
                //this.filter.showConditionEditForm = this.showConditionEditForm;
                var self = this;
                on(this.filter, "show-condition-edit-form", function (e) {
                    self.showConditionEditForm();
                });

                on(this.filter, "set-condition-editor-handler", function (e) {
                    var onOk = e.onOk !== null && e.onOk !== undefined ? e.onOk : null;
                    var onCancel = e.onCancel !== null && e.onCancel !== undefined ? e.onCancel : null;
                    self._setConditionEditorHandler(onOk, onCancel);
                });

                on(this.menu, "_openMyself", function (event){
                    var tn = dijit.getEnclosingWidget(event.target);
                    console.debug(tn);
                });


                self.conditionEditorDialogFormId = "filterCreateDialogForm" + self.id;
                self.conditionEditorDialogId = "filterCreateDialog" + self.id;
                //aspect.around(this.filter, "showConditionEditForm", lang.hitch(this, "showConditionEditForm"), true);
                //aspect.around(this.filter, "_setConditionEditorHandler", lang.hitch(this, "_setConditionEditorHandler"), true);
            },
            _filterMenuInit: function () {
                var self = this;
                if (this.menu === null) {

                    this.menu = new Menu({
                        targetNodeIds: [self.filter.filterTreeNode.id],
                        onFocus: function () {
                            var selected = self.filter.getSelected();
                            // do stuff here like:
                            array.forEach(this.getChildren(), function (child) {
                                this.removeChild(child);
                                child.targetNode = selected;
                                this.addChild(child);
                            }, this);
                        }
                    });

                    this.menu.startup();
                    this.menu.addChild(new MenuItem({
                        label: "Добавить Условие",
                        targetNode: null,
                        onClick: function (event) {
                            if (this.targetNode) {
                                if (this.targetNode.mayHawChild) {
                                    var targetNode = this.targetNode;
                                    self._setConditionEditorHandler(function (filter) {
                                        filter.mayHawChild = false;
                                        self.filter._store.add(filter, {parent: targetNode});
                                    });

                                    self.showConditionEditForm();
                                } else {
                                    alert('Условние не может иметь детей');
                                }
                            } else {
                                alert('You may select filter item');
                            }

                        }
                    }));

                    this.menu.addChild(new MenuItem({
                        label: "Изменить Условие",
                        targetNode: null,
                        onClick: function (event) {
                            if (this.targetNode) {
                                if (!this.targetNode.mayHawChild) {
                                    var targetNode = this.targetNode;
                                    self._setConditionEditorHandler(function (filter) {
                                        targetNode.name = filter.name;
                                        targetNode.value = filter.value;
                                        targetNode.type = filter.type;
                                        self.filter._store.put(targetNode, {parent: targetNode});
                                    });

                                    self.showConditionEditForm(targetNode);
                                } else {
                                    alert('You may select condition item');
                                }
                            } else {
                                alert('You may select filter item');
                            }

                        }
                    }));

                    this.menu.addChild(new MenuItem({
                        label: "Удалить Условие",
                        targetNode: null,
                        onClick: function (event) {

                            if (this.targetNode) {
                                if (this.targetNode.parentID !== null) {
                                    self.filter._store.remove(this.targetNode.id);
                                } else {
                                    alert("You can't remove root node");
                                }
                            } else {
                                alert('You may select filter item');
                            }
                        }
                    }));

                    this.menu.addChild(new MenuSeparator());

                    var filterEditLogicSubMenu = new Menu({
                        onFocus: function () {
                            var selected = self.filter.getSelected();
                            // do stuff here like:
                            array.forEach(this.getChildren(), function (child) {
                                this.removeChild(child);
                                child.targetNode = selected;
                                this.addChild(child);
                            }, this);
                        }
                    });

                    filterEditLogicSubMenu.addChild(new MenuItem({
                        label: "'AND' / 'И' ",
                        targetNode: null,
                        onClick: function (event) {

                            if (this.targetNode) {

                                var filter = new SmartFilterNode('and');
                                self.filter._store.add(filter, {parent: this.targetNode});

                            } else {
                                alert('You may select filter item');
                            }
                        }
                    }));

                    filterEditLogicSubMenu.addChild(new MenuItem({
                        label: "'OR' / 'ИЛИ' ",
                        targetNode: null,
                        onClick: function (event) {

                            if (this.targetNode) {

                                var filter = new SmartFilterNode('or');
                                self.filter._store.add(filter, {parent: this.targetNode});

                            } else {
                                alert('You may select filter item');
                            }
                        }
                    }));

                    this.menu.addChild(new PopupMenuItem({
                        label: "Добавиь обьеденение ",
                        popup: filterEditLogicSubMenu,
                    }));

                }
                this.menu.startup()
            },

            _setConditionEditorHandler: function (onOk, onCancel) {
                var self = this;
                self.__addFilter = onOk;
                if (onCancel !== undefined && onCancel !== null) {
                    self.__onCancel = onCancel;
                }
            },

            showConditionEditForm: function (data) {
                var self = this;
                if (self.conditionEditorDialog) {
                    if (data !== null && data !== undefined) {
                        if(self.editor.name !== null && self.editor.name !== undefined &&
                            self.editor.type !== null && self.editor.type !== undefined &&
                        self.editor.value !== null && self.editor.value !== undefined){
                            self.editor.name.set('value', data.name);
                            //self.editor.valueType.set('value', data.name);
                            self.editor.type.set('value', data.type);
                            self.editor.value.set('value', data.value);
                        }
                    }
                    self.conditionEditorDialog.show();
                }
            },

            _conditionEditDialogInit: function () {
                var self = this;

                if (!self.conditionEditorDialog) {
                    //domConstruct.destroy(self.conditionEditorDialogFormId);

                    var getValue = function (param) {
                        var self = this;

                        switch (param.value.field.type) {
                            case 'Select': {
                                return new Select({
                                    //id: "formWithFilterValue",
                                    label: "Значение",
                                    name: "value",
                                    options: param.value.field.option
                                });
                            }
                            case 'TextBox': {
                                return new TextBox({
                                    //id: "formWithFilterValue",
                                    label: "Значение",
                                    name: "value"
                                });
                            }
                        }

                    };

                    var parser = function (value, type) {
                        switch (type) {
                            case 'string': {
                                return value + '';
                            }
                            case 'int': {
                                return parseInt(value);
                            }
                            case 'float': {
                                return parseFloat(value);
                            }
                        }
                    };

                    self.conditionEditorDialogForm = new Form({
                        id: self.conditionEditorDialogFormId,
                        doLayout: true
                    });

                    var selectOptions = [];

                    array.forEach(self.filteredStoreDataOption, function (item, i) {
                        selectOptions.push({id: i, label: item.label, value: item.value.name});
                    }, self);

                    var formContainer = new TableContainer(
                        {
                            cols: 1,
                            customClass: "labelsAndFields",
                            "labelWidth": "200"
                        }
                    );



                    if (self.filteredStoreDataOption) {
                        self.editor.name = new Select({
                            //id: "formWithFilterName",
                            label: "Поле",
                            name: "field",
                            options: selectOptions
                        });

                        self.editor.name.on('change', function () {
                            var name = this.get("value");
                            var param = null;
                            array.forEach(self.filteredStoreDataOption, function (item, i) {
                                if (item.value.name == name) {
                                    param = item;
                                    return 0;
                                }
                            }, self);

                            self.editor.type.set("options", param.filter);
                            //var index = formContainer.getIndexOfChild(value);
                            formContainer.removeChild(self.editor.value);
                            self.editor.value.destroy();
                            self.editor.value = getValue(param);
                            formContainer.addChild(self.editor.value);
                        });
                    } else {
                        self.editor.name = new TextBox({
                            //id: "formWithFilterName",
                            label: "Поле",
                            name: "field",
                        });
                        self.editor.valueType = new TextBox({
                            //id: "formWithFilterValueType",
                            label: "Тип значения",
                            name: "type",
                        });

                    }

                    //todo create load filter by config if set
                        self.editor.type = new Select({
                            //id: "formWithFilterType",
                        label: "Фильтр",
                        name: "filter",
                        options: [
                            {id: 0, label: "=", value: "eq"},
                            {id: 0, label: ">", value: "gt"},
                            {id: 0, label: "<", value: "lt"},
                            {id: 0, label: ">=", value: "gte"},
                            {id: 0, label: "<=", value: "lte"},
                            {id: 0, label: "!=", value: "ne"},
                            {id: 0, label: "in", value: "in"},
                            {id: 0, label: "match", value: "match"}
                        ],
                        required: false
                    });

                    self.editor.value = new TextBox({
                        //id: "formWithFilterValue",
                        label: "Значение",
                        name: "value",
                    });


                    formContainer.addChild(self.editor.name);
                    if (self.editor.valueType !== undefined && self.editor.valueType !== null) {
                        formContainer.addChild(self.editor.valueType);
                    }
                    formContainer.addChild(self.editor.type);
                    formContainer.addChild(self.editor.value);
                    formContainer.placeAt(self.conditionEditorDialogForm);


                    self.conditionEditorDialog = new ConfirmDialog({
                        id: self.conditionEditorDialogId,
                        title: "Фильтр",
                        style: 'width:600px;',
                        content: self.conditionEditorDialogForm,
                        execute: function () {


                            var f = query("#filterCreateDialogForm")[0];

                            var filter = f["filter"];
                            var field = f["field"];
                            var value = f["value"];

                            var param = f["type"] !== undefined ? f["type"] : null;

                            if (param === null || param === undefined) {
                                array.forEach(self.filteredStoreDataOption, function (item) {
                                    if (item.value.name == field.value) {
                                        param = {};
                                        param.value = item.value.type;
                                        return 0;
                                    }
                                }, self);
                            }

                            var currentFilter = new SmartFilterNode(filter.value);
                            currentFilter.mayHawChild = false;
                            currentFilter.name = field.value;
                            currentFilter.value = parser(value.value, param.value);
                            if (self.__addFilter !== null) {
                                self.__addFilter(currentFilter);
                            }
                        },
                        onCancel: function () {
                            if (self.__onCancel !== null) {
                                self.__onCancel();
                            }
                        }
                    });
                    self.conditionEditorDialogForm.startup();
                }
            },

            destroy: function () {
                var self = this;

                self.filter.destroy();
                self.filter = null;


                domConstruct.destroy(self.domNode);

                if (self.conditionEditorDialogForm !== null &&
                    self.conditionEditorDialogForm !== undefined &&
                    dom.byId(self.conditionEditorDialogFormId)) {

                    self.conditionEditorDialogForm.destroyRecursive();

                    try {
                        domConstruct.destroy(self.conditionEditorDialogFormId);
                    } catch (e) {
                    }
                }
                if (self.conditionEditorDialog !== null &&
                    self.conditionEditorDialog !== undefined &&
                    dom.byId(self.conditionEditorDialogId)) {

                    self.conditionEditorDialog.destroyRecursive();

                    try {
                        domConstruct.destroy(self.conditionEditorDialogId);
                    } catch (e) {
                    }
                }
            }
        });
    }
)
;