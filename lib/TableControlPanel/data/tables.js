/**
 * Created by root on 25.05.16.
 */
define([], function () {
    return {
        "_default" : {
            "title": "__",
            "name": "__",
            "filteredGridOption": {
                "store": {

                },
                "grid": {
                    "options": {
                        "selectionMode": "single",
                        "pagingLinks": false,
                        "pagingTextBox": true,
                        "firstLastArrows": true,
                        "rowsPerPage": 15,
                        "pageSizeOptions": [10, 15, 25]
                    },
                    "declare": [
                        "Grid",
                        "Keyboard",
                        "Selection",
                        "Pagination",
                        "ColumnHider",
                        "ColumnResizer",
                        "GridRqlFilter"
                    ]
                }
            },
            "filterControlPanelOption": {
                "store": {
                    "options": {
                        'headers': {
                            'Accept': 'application/json'
                        },
                        "target": "/rest/filters_list"
                    },
                    "declare": [
                        "Rest",
                        "RequestMemory",
                        "Trackable"
                    ]
                },
                "options": {

                }
            }
        },
        "typeNotification": {
            "title": "Уведомления Ebay",
            "name": "typeNotification",
            "filteredGridOption": {
                "store": {
                    "options": {
                        "target": "/rest/typeNotification",
                        "useRangeHeaders": true,
                        'headers': {
                            'Accept': 'application/json',
                        }
                        //"data": null
                    },
                    "declare": [
                        //"Rest",
                        "StoreRqlFilter",
                        "Trackable"
                    ]
                },
                "grid": {
                    "options": {
                        "columns": [
                           /* {"label": "id", "field": "id"},
                            {"label": "Дата создания", "field": "add_date"},
                            {"label": "Тип уведомления", "field": "type"}*/
                        ],
                        "selectionMode": "single",
                        "pagingLinks": false,
                        "pagingTextBox": true,
                        "firstLastArrows": true,
                        "rowsPerPage": 15,
                        "pageSizeOptions": [10, 15, 25]
                    },
                    "declare": [
                        "Grid",
                        "Keyboard",
                        "Selection",
                        "Pagination",
                        "ColumnHider",
                        "ColumnResizer",
                        "GridRqlFilter"
                        //"_StoreMixin"
                    ]
                }

            },
            "filterControlPanelOption": {
                "store": {
                    "options": {
                        "target": "/rest/filters_list",
                        'headers': {
                            'Accept': 'application/json',
                        }
                        //"data": null,
                    },
                    "declare": [
                        "Rest",
                        "RequestMemory",
                        "Trackable"
                    ]
                },

                "options": {
                    "columns": [
                        {"label": "id", "field": "id"},
                        {
                            "label": "Название",
                            "field": "name",
                            "editor": "text",
                            "editOn": "dblclick",
                            "autoSave": true
                        }
                    ],
                    "filteredStoreDataOption": [
                        {
                            "label": "Тип уведомления",
                            "value": {
                                "type": "string",
                                "name": "soapaction",
                                "field": {
                                    'type': "Select",
                                    'option': [
                                        {"id": 0, "label": "ItemListed", "value": "ItemListed"},
                                        {"id": 1, "label": "ERROR", "value": "ERROR"}
                                    ]
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },
                        {
                            "label": "Дата создания",
                            "value": {
                                "type": "string",
                                "name": "add_date",
                                "field": {
                                    'type': "TextBox",
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        }
                    ]
                }

            }
        },
        "ItemListed": {
            "title": "Уведомления Ebay",
            "name": "ItemListed",
            "filteredGridOption": {
                "store": {
                    "options": {
                        "target": "/rest/ItemListed",
                        "useRangeHeaders": true,
                        'headers': {
                            'Accept': 'application/json',
                        }
                        //"data": null
                    },
                    "declare": [
                        //"Rest",
                        "StoreRqlFilter",
                        "Trackable"
                    ]
                },
                "grid": {
                    "options": {
                        "columns": [
                           /* {"label": "id", "field": "id"},
                            {"label": "Дата создания", "field": "add_date"},
                            {"label": "Тип уведомления", "field": "type"}*/
                        ],
                        "selectionMode": "single",
                        "pagingLinks": false,
                        "pagingTextBox": true,
                        "firstLastArrows": true,
                        "rowsPerPage": 15,
                        "pageSizeOptions": [10, 15, 25]
                    },
                    "declare": [
                        "Grid",
                        "Keyboard",
                        "Selection",
                        "Pagination",
                        "ColumnHider",
                        "ColumnResizer",
                        //"_StoreMixin"
                        "GridRqlFilter"
                    ]
                }

            },
            "filterControlPanelOption": {
                "store": {
                    "options": {
                        "target": "/rest/filters_list",
                        'headers': {
                            'Accept': 'application/json',
                        }
                        //"data": null,
                    },
                    "declare": [
                        "Rest",
                        "RequestMemory",
                        "Trackable"
                    ]
                },

                "options": {
                    "columns": [
                        {"label": "id", "field": "id"},
                        {
                            "label": "Название",
                            "field": "name",
                            "editor": "text",
                            "editOn": "dblclick",
                            "autoSave": true
                        }
                    ],
                    "filteredStoreDataOption": [
                        {
                            "label": "Тип уведомления",
                            "value": {
                                "type": "string",
                                "name": "soapaction",
                                "field": {
                                    'type': "Select",
                                    'option': [
                                        {"id": 0, "label": "ItemListed", "value": "ItemListed"},
                                        {"id": 1, "label": "ERROR", "value": "ERROR"}
                                    ]
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },
                        {
                            "label": "Дата создания",
                            "value": {
                                "type": "string",
                                "name": "add_date",
                                "field": {
                                    'type': "TextBox",
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        }
                    ]
                }

            }
        },
        "plotPublishPrice" : {
            "title": "Гистограмма цены выставленных товаров",
            "name": "plotPublishPrice",
            "filteredGridOption": {
                "store": {

                },
                "grid": {
                    "options": {
                        "columns": [
                            {"label": "id", "field": "id"},
                            {"label": "Логарифм по основанию 10 от цены выставленного товара", "field": "x"},
                            {"label": "Количество выставленных товаров из данного ценового интервалая", "field": "y"}
                        ],
                        "selectionMode": "single",
                        "pagingLinks": false,
                        "pagingTextBox": true,
                        "firstLastArrows": true,
                        "rowsPerPage": 15,
                        "pageSizeOptions": [10, 15, 25]
                    },
                    "declare": [
                        "Grid",
                        "Keyboard",
                        "Selection",
                        "Pagination",
                        "ColumnHider",
                        "ColumnResizer",
                        "GridRqlFilter"
                        //"_StoreMixin"
                    ]
                }

            },
            "filterControlPanelOption": {
                "store": {
                    "options": {
                        'headers': {
                            'Accept': 'application/json'
                        },
                        "target": "/rest/filters_list"
                        //"data": null,
                    },

                    "declare": [
                        "Rest",
                        "RequestMemory",
                        "Trackable"
                    ]
                },

                "options": {
                    "columns": [
                        {"label": "id", "field": "id"},
                        {
                            "label": "Название",
                            "field": "name",
                            "editor": "text",
                            "editOn": "dblclick",
                            "autoSave": true
                        }
                    ],
                    "filteredStoreDataOption": [
                        {
                            "label": "Логарифм по основанию 10 от цены выставленного товара",
                            "value": {
                                "type": "string",
                                "name": "x",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },
                        {
                            "label": "Количество выставленных товаров из данного ценового интервалая",
                            "value": {
                                "type": "string",
                                "name": "y",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        }
                    ]
                }

            },

            "filterChart": {
                "store": {},

                "series": {

                },
                "axis": {

                },




            }
        },
        "plotSoldPrice" : {
            "title": "Гистограмма цены проданых товаров",
            "name": "plotSoldPrice",
            "filteredGridOption": {
                "store": {

                },
                "grid": {
                    "options": {
                        "columns": [
                            {"label": "id", "field": "id"},
                            {"label": "Логарифм по основанию 10 от цены выставленного товара", "field": "x"},
                            {"label": "Количество проданных товаров из данного ценового интервала", "field": "y"}
                        ],
                        "selectionMode": "single",
                        "pagingLinks": false,
                        "pagingTextBox": true,
                        "firstLastArrows": true,
                        "rowsPerPage": 15,
                        "pageSizeOptions": [10, 15, 25]
                    },
                    "declare": [
                        "Grid",
                        "Keyboard",
                        "Selection",
                        "Pagination",
                        "ColumnHider",
                        "ColumnResizer",
                        "GridRqlFilter"
                        //"_StoreMixin"
                    ]
                }

            },
            "filterControlPanelOption": {
                "store": {
                    "options": {
                        "target": "/rest/filters_list",
                        //"data": null,
                        'headers': {
                            'Accept': 'application/json'
                        },
                    },

                    "declare": [
                        "Rest",
                        "RequestMemory",
                        "Trackable"
                    ]
                },

                "options": {
                    "columns": [
                        {"label": "id", "field": "id"},
                        {
                            "label": "Название",
                            "field": "name",
                            "editor": "text",
                            "editOn": "dblclick",
                            "autoSave": true
                        }
                    ],
                    "filteredStoreDataOption": [
                        {
                            "label": "Логарифм по основанию 10 от цены выставленного товара",
                            "value": {
                                "type": "string",
                                "name": "x",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },
                        {
                            "label": "Количество проданных товаров из данного ценового интервала",
                            "value": {
                                "type": "string",
                                "name": "y",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        }
                    ]
                }

            }
        },
        "plotProbPrice" : {
            "title": "График вероятности продажи товара из заданной ценовой категории",
            "name": "plotProbPrice",
            "filteredGridOption": {
                "store": {

                },
                "grid": {
                    "options": {
                        "columns": [
                            {"label": "id", "field": "id"},
                            {"label": "Логарифм по основанию 10 от цены выставленного товара", "field": "x"},
                            {"label": "Оценка вероятности продажи товара из данной ценовой категории", "field": "y"}
                        ],
                        "selectionMode": "single",
                        "pagingLinks": false,
                        "pagingTextBox": true,
                        "firstLastArrows": true,
                        "rowsPerPage": 15,
                        "pageSizeOptions": [10, 15, 25]
                    },
                    "declare": [
                        "Grid",
                        "Keyboard",
                        "Selection",
                        "Pagination",
                        "ColumnHider",
                        "ColumnResizer",
                        "GridRqlFilter"
                        //"_StoreMixin"
                    ]
                }

            },
            "filterControlPanelOption": {
                "store": {
                    "options": {
                        'headers': {
                            'Accept': 'application/json'
                        },
                        "target": "/rest/filters_list"
                        //"data": null,
                    },

                    "declare": [
                        "Rest",
                        "RequestMemory",
                        "Trackable"
                    ]
                },

                "options": {
                    "columns": [
                        {"label": "id", "field": "id"},
                        {
                            "label": "Название",
                            "field": "name",
                            "editor": "text",
                            "editOn": "dblclick",
                            "autoSave": true
                        }
                    ],
                    "filteredStoreDataOption": [
                        {
                            "label": "Логарифм по основанию 10 от цены выставленного товара",
                            "value": {
                                "type": "string",
                                "name": "x",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },
                        {
                            "label": "Оценка вероятности продажи товара из данной ценовой категории",
                            "value": {
                                "type": "string",
                                "name": "y",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        }
                    ]
                }

            }
        },
        "plotProfPrice" : {
            "title": "График прибыли от одного выставления товара из заданой ценовой категории",
            "name": "plotProfPrice",
            "filteredGridOption": {
                "store": {

                },
                "grid": {
                    "options": {
                        "columns": [
                            {"label": "id", "field": "id"},
                            {"label": "Логарифм по основанию 10 от цены выставленного товара", "field": "x"},
                            {"label": "Оценка прибыли от одного выставления товара из заданой ценовой категории", "field": "y"}
                        ],
                        "selectionMode": "single",
                        "pagingLinks": false,
                        "pagingTextBox": true,
                        "firstLastArrows": true,
                        "rowsPerPage": 15,
                        "pageSizeOptions": [10, 15, 25]
                    },
                    "declare": [
                        "Grid",
                        "Keyboard",
                        "Selection",
                        "Pagination",
                        "ColumnHider",
                        "ColumnResizer",
                        "GridRqlFilter"
                        //"_StoreMixin"
                    ]
                }

            },
            "filterControlPanelOption": {
                "store": {
                    "options": {
                        'headers': {
                            'Accept': 'application/json'
                        },
                        "target": "/rest/filters_list"
                        //"data": null,
                    },

                    "declare": [
                        "Rest",
                        "RequestMemory",
                        "Trackable"
                    ]
                },

                "options": {
                    "columns": [
                        {"label": "id", "field": "id"},
                        {
                            "label": "Название",
                            "field": "name",
                            "editor": "text",
                            "editOn": "dblclick",
                            "autoSave": true
                        }
                    ],
                    "filteredStoreDataOption": [
                        {
                            "label": "Логарифм по основанию 10 от цены выставленного товара",
                            "value": {
                                "type": "string",
                                "name": "x",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },
                        {
                            "label": "Оценка прибыли от одного выставления товара из заданой ценовой категории",
                            "value": {
                                "type": "string",
                                "name": "y",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        }
                    ]
                }

            }
        },
        "plotPublishDay" : {
            "title": "Гистограмма количества выставлений по дням недели",
            "name": "plotPublishDay",
            "filteredGridOption": {
                "store": {
                },
                "grid": {
                    "options": {
                        "columns": [
                            {"label": "id", "field": "id"},
                            {"label": "День недели", "field": "x"},
                            {"label": "Количество товаров которые были выставленый в данный день недели", "field": "y"}
                        ],
                        "selectionMode": "single",
                        "pagingLinks": false,
                        "pagingTextBox": true,
                        "firstLastArrows": true,
                        "rowsPerPage": 15,
                        "pageSizeOptions": [10, 15, 25]
                    },
                    "declare": [
                        "Grid",
                        "Keyboard",
                        "Selection",
                        "Pagination",
                        "ColumnHider",
                        "ColumnResizer",
                        "GridRqlFilter"
                        //"_StoreMixin"
                    ]
                }

            },
            "filterControlPanelOption": {
                "store": {
                    "options": {
                        'headers': {
                            'Accept': 'application/json'
                        },
                        "target": "/rest/filters_list"
                        //"data": null,
                    },

                    "declare": [
                        "Rest",
                        "RequestMemory",
                        "Trackable"
                    ]
                },

                "options": {
                    "columns": [
                        {"label": "id", "field": "id"},
                        {
                            "label": "Название",
                            "field": "name",
                            "editor": "text",
                            "editOn": "dblclick",
                            "autoSave": true
                        }
                    ],
                    "filteredStoreDataOption": [
                        {
                            "label": "День недели",
                            "value": {
                                "type": "string",
                                "name": "x",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },
                        {
                            "label": "Количество товаров которые были выставленый в данный день недели",
                            "value": {
                                "type": "string",
                                "name": "y",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        }
                    ]
                }

            }
        },
        "plotSoldDay" : {
            "title": "Гистограмма количества породаж в зависимости от дня выставления",
            "name": "plotSoldDay",
            "filteredGridOption": {
                "store": {
                },
                "grid": {
                    "options": {
                        "columns": [
                            {"label": "id", "field": "id"},
                            {"label": "День недели", "field": "x"},
                            {"label": "Количество проданых товаров которые были выставлены в данный день недели", "field": "y"}
                        ],
                        "selectionMode": "single",
                        "pagingLinks": false,
                        "pagingTextBox": true,
                        "firstLastArrows": true,
                        "rowsPerPage": 15,
                        "pageSizeOptions": [10, 15, 25]
                    },
                    "declare": [
                        "Grid",
                        "Keyboard",
                        "Selection",
                        "Pagination",
                        "ColumnHider",
                        "ColumnResizer",
                        "GridRqlFilter"
                        //"_StoreMixin"
                    ]
                }

            },
            "filterControlPanelOption": {
                "store": {
                    "options": {
                        'headers': {
                            'Accept': 'application/json'
                        },
                        "target": "/rest/filters_list"
                        //"data": null,
                    },

                    "declare": [
                        "Rest",
                        "RequestMemory",
                        "Trackable"
                    ]
                },

                "options": {
                    "columns": [
                        {"label": "id", "field": "id"},
                        {
                            "label": "Название",
                            "field": "name",
                            "editor": "text",
                            "editOn": "dblclick",
                            "autoSave": true
                        }
                    ],
                    "filteredStoreDataOption": [
                        {
                            "label": "День недели",
                            "value": {
                                "type": "string",
                                "name": "x",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },
                        {
                            "label": "Количество проданых товаров которые были выставлены в данный день недели",
                            "value": {
                                "type": "string",
                                "name": "y",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        }
                    ]
                }

            }
        },
        "plotProbDay" : {
            "title": "График вероятности продажи товара выставленного в заданый день недели",
            "name": "plotProbDay",
            "filteredGridOption": {
                "store": {

                },
                "grid": {
                    "options": {
                        "columns": [
                            {"label": "id", "field": "id"},
                            {"label": "День недели", "field": "x"},
                            {"label": "Количество проданых товаров которые были выставлены в данный день недели", "field": "y"}
                        ],
                        "selectionMode": "single",
                        "pagingLinks": false,
                        "pagingTextBox": true,
                        "firstLastArrows": true,
                        "rowsPerPage": 15,
                        "pageSizeOptions": [10, 15, 25]
                    },
                    "declare": [
                        "Grid",
                        "Keyboard",
                        "Selection",
                        "Pagination",
                        "ColumnHider",
                        "ColumnResizer",
                        "GridRqlFilter"
                        //"_StoreMixin"
                    ]
                }

            },
            "filterControlPanelOption": {
                "store": {
                    "options": {
                        'headers': {
                            'Accept': 'application/json'
                        },
                        "target": "/rest/filters_list"
                        //"data": null,
                    },

                    "declare": [
                        "Rest",
                        "RequestMemory",
                        "Trackable"
                    ]
                },

                "options": {
                    "columns": [
                        {"label": "id", "field": "id"},
                        {
                            "label": "Название",
                            "field": "name",
                            "editor": "text",
                            "editOn": "dblclick",
                            "autoSave": true
                        }
                    ],
                    "filteredStoreDataOption": [
                        {
                            "label": "День недели",
                            "value": {
                                "type": "string",
                                "name": "x",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },
                        {
                            "label": "Количество проданых товаров которые были выставлены в данный день недели",
                            "value": {
                                "type": "string",
                                "name": "y",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        }
                    ]
                }

            }
        },
        "plotCreatedDay" : {
            "title": "Гистограмма количества продаж в каждый день недели",
            "name": "plotCreatedDay",
            "filteredGridOption": {
                "store": {

                },
                "grid": {
                    "options": {
                        "columns": [
                            {"label": "id", "field": "id"},
                            {"label": "День недели", "field": "x"},
                            {"label": "Количество товаров проданых в данный день", "field": "y"}
                        ],
                        "selectionMode": "single",
                        "pagingLinks": false,
                        "pagingTextBox": true,
                        "firstLastArrows": true,
                        "rowsPerPage": 15,
                        "pageSizeOptions": [10, 15, 25]
                    },
                    "declare": [
                        "Grid",
                        "Keyboard",
                        "Selection",
                        "Pagination",
                        "ColumnHider",
                        "ColumnResizer",
                        "GridRqlFilter"
                        //"_StoreMixin"
                    ]
                }

            },
            "filterControlPanelOption": {
                "store": {
                    "options": {
                        "target": "/rest/filters_list"
                        //"data": null,
                    },
                    'headers': {
                        'Accept': 'application/json'
                    },
                    "declare": [
                        "Rest",
                        "RequestMemory",
                        "Trackable"
                    ]
                },

                "options": {
                    "columns": [
                        {"label": "id", "field": "id"},
                        {
                            "label": "Название",
                            "field": "name",
                            "editor": "text",
                            "editOn": "dblclick",
                            "autoSave": true
                        }
                    ],
                    "filteredStoreDataOption": [
                        {
                            "label": "День недели",
                            "value": {
                                "type": "string",
                                "name": "x",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },
                        {
                            "label": "Количество товаров проданых в данный день",
                            "value": {
                                "type": "string",
                                "name": "y",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        }
                    ]
                }

            }
        },
        "plotPublishTime" : {
            "title": "Гистограмма количества выставлений в каждый часв течении дня",
            "name": "plotPublishTime",
            "filteredGridOption": {
                "store": {

                },
                "grid": {
                    "options": {
                        "columns": [
                            {"label": "id", "field": "id"},
                            {"label": "Время суток(час)", "field": "x"},
                            {"label": "Количество выставленых в заданый чвс товаров", "field": "y"}
                        ],
                        "selectionMode": "single",
                        "pagingLinks": false,
                        "pagingTextBox": true,
                        "firstLastArrows": true,
                        "rowsPerPage": 15,
                        "pageSizeOptions": [10, 15, 25]
                    },
                    "declare": [
                        "Grid",
                        "Keyboard",
                        "Selection",
                        "Pagination",
                        "ColumnHider",
                        "ColumnResizer",
                        "GridRqlFilter"
                        //"_StoreMixin"
                    ]
                }

            },
            "filterControlPanelOption": {
                "store": {
                    "options": {
                        'headers': {
                            'Accept': 'application/json'
                        },
                        "target": "/rest/filters_list"
                        //"data": null,
                    },

                    "declare": [
                        "Rest",
                        "RequestMemory",
                        "Trackable"
                    ]
                },

                "options": {
                    "columns": [
                        {"label": "id", "field": "id"},
                        {
                            "label": "Название",
                            "field": "name",
                            "editor": "text",
                            "editOn": "dblclick",
                            "autoSave": true
                        }
                    ],
                    "filteredStoreDataOption": [
                        {
                            "label": "Время суток(час)",
                            "value": {
                                "type": "string",
                                "name": "x",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },
                        {
                            "label": "Количество выставленых в заданый чвс товаров",
                            "value": {
                                "type": "string",
                                "name": "y",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        }
                    ]
                }

            }
        },
        "plotSoldTime" : {
            "title": "Гистограмма количества проданных товаров выставленых в заданое время",
            "name": "plotSoldTime",
            "filteredGridOption": {
                "store": {

                },
                "grid": {
                    "options": {
                        "columns": [
                            {"label": "id", "field": "id"},
                            {"label": "Время суток(час)", "field": "x"},
                            {"label": "Количество проданных товаров которые были выставлены в заданое время", "field": "y"}
                        ],
                        "selectionMode": "single",
                        "pagingLinks": false,
                        "pagingTextBox": true,
                        "firstLastArrows": true,
                        "rowsPerPage": 15,
                        "pageSizeOptions": [10, 15, 25]
                    },
                    "declare": [
                        "Grid",
                        "Keyboard",
                        "Selection",
                        "Pagination",
                        "ColumnHider",
                        "ColumnResizer",
                        "GridRqlFilter"
                        //"_StoreMixin"
                    ]
                }

            },
            "filterControlPanelOption": {
                "store": {
                    "options": {
                        "target": "/rest/filters_list"
                        //"data": null,
                    },
                    'headers': {
                        'Accept': 'application/json'
                    },
                    "declare": [
                        "Rest",
                        "RequestMemory",
                        "Trackable"
                    ]
                },

                "options": {
                    "columns": [
                        {"label": "id", "field": "id"},
                        {
                            "label": "Название",
                            "field": "name",
                            "editor": "text",
                            "editOn": "dblclick",
                            "autoSave": true
                        }
                    ],
                    "filteredStoreDataOption": [
                        {
                            "label": "Время суток(час)",
                            "value": {
                                "type": "string",
                                "name": "x",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },
                        {
                            "label": "Количество проданных товаров которые были выставлены в заданое время",
                            "value": {
                                "type": "string",
                                "name": "y",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        }
                    ]
                }

            }
        },
        "plotProbTime" : {
            "title": "График вероятности продажи товара выставленного в заданое время суток",
            "name": "plotProbTime",
            "filteredGridOption": {
                "store": {

                },
                "grid": {
                    "options": {
                        "columns": [
                            {"label": "id", "field": "id"},
                            {"label": "Время суток(час)", "field": "x"},
                            {"label": "Оценка вероятности продажи товара выставленого заданое время суток", "field": "y"}
                        ],
                        "selectionMode": "single",
                        "pagingLinks": false,
                        "pagingTextBox": true,
                        "firstLastArrows": true,
                        "rowsPerPage": 15,
                        "pageSizeOptions": [10, 15, 25]
                    },
                    "declare": [
                        "Grid",
                        "Keyboard",
                        "Selection",
                        "Pagination",
                        "ColumnHider",
                        "ColumnResizer",
                        "GridRqlFilter"
                        //"_StoreMixin"
                    ]
                }

            },
            "filterControlPanelOption": {
                "store": {
                    "options": {
                        'headers': {
                            'Accept': 'application/json'
                        },
                        "target": "/rest/filters_list"
                        //"data": null,
                    },

                    "declare": [
                        "Rest",
                        "RequestMemory",
                        "Trackable"
                    ]
                },

                "options": {
                    "columns": [
                        {"label": "id", "field": "id"},
                        {
                            "label": "Название",
                            "field": "name",
                            "editor": "text",
                            "editOn": "dblclick",
                            "autoSave": true
                        }
                    ],
                    "filteredStoreDataOption": [
                        {
                            "label": "Время суток(час)",
                            "value": {
                                "type": "string",
                                "name": "x",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },
                        {
                            "label": "Оценка вероятности продажи товара выставленого заданое время суток",
                            "value": {
                                "type": "string",
                                "name": "y",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        }
                    ]
                }

            }
        },
        "plotCreatedTime" : {
            "title": "Гистограмма количетва продаж в каждый час дня",
            "name": "plotCreatedTime",
            "filteredGridOption": {
                "store": {
                    "options": {
                        "target": "/rest/ebay_notification",
                        "useRangeHeaders": true,
                        'headers': {
                            'Accept': 'application/json'
                        }
                    },
                    "declare": [
                        "StoreRqlFilter",
                        "Trackable"
                    ]
                },
                "grid": {
                    "options": {
                        "columns": [
                            {"label": "id", "field": "id"},
                            {"label": "Время суток(час)", "field": "x"},
                            {"label": "Количество продынных товаров в заданое время суток", "field": "y"}
                        ],
                        "selectionMode": "single",
                        "pagingLinks": false,
                        "pagingTextBox": true,
                        "firstLastArrows": true,
                        "rowsPerPage": 15,
                        "pageSizeOptions": [10, 15, 25]
                    },
                    "declare": [
                        "Grid",
                        "Keyboard",
                        "Selection",
                        "Pagination",
                        "ColumnHider",
                        "ColumnResizer",
                        "GridRqlFilter"
                        //"_StoreMixin"
                    ]
                }

            },
            "filterControlPanelOption": {
                "store": {
                    "options": {
                        "target": "/rest/filters_list"
                        //"data": null,
                    },
                    'headers': {
                        'Accept': 'application/json'
                    },
                    "declare": [
                        "Rest",
                        "RequestMemory",
                        "Trackable"
                    ]
                },

                "options": {
                    "columns": [
                        {"label": "id", "field": "id"},
                        {
                            "label": "Название",
                            "field": "name",
                            "editor": "text",
                            "editOn": "dblclick",
                            "autoSave": true
                        }
                    ],
                    "filteredStoreDataOption": [
                        {
                            "label": "Время суток(час)",
                            "value": {
                                "type": "string",
                                "name": "x",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },
                        {
                            "label": "Количество продынных товаров в заданое время суток",
                            "value": {
                                "type": "string",
                                "name": "y",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        }
                    ]
                }

            }
        },
        "plotCreatedTimeWithTZ" : {
            "title": "Гистограмма количества продаж в каждый час дня с учетом часовых почсов",
            "name": "plotCreatedTimeWithTZ",
            "filteredGridOption": {
                "store": {
                },
                "grid": {
                    "options": {
                        "columns": [
                            {"label": "id", "field": "id"},
                            {"label": "Время суток в штате где выло куплено товар", "field": "x"},
                            {"label": "Количество продынных товаров в заданое время суток с учетом часовых поясов", "field": "y"}
                        ],
                        "selectionMode": "single",
                        "pagingLinks": false,
                        "pagingTextBox": true,
                        "firstLastArrows": true,
                        "rowsPerPage": 15,
                        "pageSizeOptions": [10, 15, 25]
                    },
                    "declare": [
                        "Grid",
                        "Keyboard",
                        "Selection",
                        "Pagination",
                        "ColumnHider",
                        "ColumnResizer",
                        "GridRqlFilter"
                        //"_StoreMixin"
                    ]
                }

            },
            "filterControlPanelOption": {
                "store": {
                    "options": {
                        'headers': {
                            'Accept': 'application/json'
                        },
                        "target": "/rest/filters_list"
                        //"data": null,
                    },

                    "declare": [
                        "Rest",
                        "RequestMemory",
                        "Trackable"
                    ]
                },

                "options": {
                    "columns": [
                        {"label": "id", "field": "id"},
                        {
                            "label": "Название",
                            "field": "name",
                            "editor": "text",
                            "editOn": "dblclick",
                            "autoSave": true
                        }
                    ],
                    "filteredStoreDataOption": [
                        {
                            "label": "Время суток в штате где выло куплено товар",
                            "value": {
                                "type": "string",
                                "name": "x",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },
                        {
                            "label": "Количество продынных товаров в заданое время суток с учетом часовых поясов",
                            "value": {
                                "type": "string",
                                "name": "y",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        }
                    ]
                }

            }
        },
        "tableCategoryPrice" : {
            "title": "Таблица частот по ценовым категориям товаров",
            "name": "tableCategoryPrice",
            "filteredGridOption": {
                "store": {

                },
                "grid": {
                    "options": {
                        "columns": [
                            {"label": "id", "field": "id"},
                            {"label": "Ценовая категория", "field": "category_price"},
                            {"label": "Количество проданных", "field": "count_sold"},
                            {"label": "Количество выставленых", "field": "count_push"},
                            {"label": "Оценка вероятности продажи", "field": "prob"},
                            {"label": "Оценка прибыли за месяц", "field": "prof_mounth"},
                            {"label": "Оценка вероятности продажи при выставлениия на 10 дней", "field": "new_prob"},
                            {"label": "Оценка прибыли за месяц при выставлении на 10 дней", "field": "new_prof_mounth"},
                            {"label": "Разница в прибыли", "field": "delta_prof_mounth"}
                        ],
                        "selectionMode": "single",
                        "pagingLinks": false,
                        "pagingTextBox": true,
                        "firstLastArrows": true,
                        "rowsPerPage": 15,
                        "pageSizeOptions": [10, 15, 25]
                    },
                    "declare": [
                        "Grid",
                        "Keyboard",
                        "Selection",
                        "Pagination",
                        "ColumnHider",
                        "ColumnResizer",
                        "GridRqlFilter"
                        //"_StoreMixin"
                    ]
                }

            },
            "filterControlPanelOption": {
                "store": {
                    "options": {
                        'headers': {
                            'Accept': 'application/json'
                        },
                        "target": "/rest/filters_list"
                        //"data": null,
                    },

                    "declare": [
                        "Rest",
                        "RequestMemory",
                        "Trackable"
                    ]
                },

                "options": {
                    "columns": [
                        {"label": "id", "field": "id"},
                        {
                            "label": "Название",
                            "field": "name",
                            "editor": "text",
                            "editOn": "dblclick",
                            "autoSave": true
                        }
                    ],
                    "filteredStoreDataOption": [
                        {
                            "label": "Ценовая категория",
                            "value": {
                                "type": "string",
                                "name": "category_price",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },
                        {
                            "label": "Количество проданных",
                            "value": {
                                "type": "string",
                                "name": "count_sold",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },
                        {
                            "label": "Количество выставленых",
                            "value": {
                                "type": "string",
                                "name": "count_push",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },
                        {
                            "label": "Оценка вероятности продажи",
                            "value": {
                                "type": "string",
                                "name": "prob",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },
                        {
                            "label": "Оценка прибыли за месяц",
                            "value": {
                                "type": "string",
                                "name": "prof_mounth",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },
                        {
                            "label": "Оценка вероятности продажи при выставлениия на 10 дней",
                            "value": {
                                "type": "string",
                                "name": "new_prob",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },
                        {
                            "label": "Оценка прибыли за месяц при выставлении на 10 дней",
                            "value": {
                                "type": "string",
                                "name": "new_prof_mounth",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },
                        {
                            "label": "Разница в прибыли",
                            "value": {
                                "type": "float",
                                "name": "delta_prof_mounth",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        }
                    ]
                }

            }
        },
        "tableCategoryID" : {
            "title": "Таблица частот по категориям товаров",
            "name": "tableCategoryID",
            "filteredGridOption": {
                "store": {

                },
                "grid": {
                    "options": {
                        "columns": [
                            {"label": "id", "field": "id"},
                            {"label": "Номер категории", "field": "ebaycategory_id"},
                            {"label": "Количество приданных", "field": "count_sold"},
                            {"label": "Количество выставленных", "field": "count_push"},
                            {"label": "Средняя цена по категории", "field": "mean_price"},
                            {"label": "Оценка вероятности продажи", "field": "prob"},
                            {"label": "Оценка прибыли за месяц", "field": "prof_mounth"},
                            {"label": "Оценка вероятности продажи при выставлении на 10 дней", "field": "new_prob"},
                            {"label": "Оценка прибыли за месяц при выставлении на 10 дней", "field": "new_prof_mounth"},
                            {"label": "Разница в прибыли", "field": "delta_prof_mounth"}
                        ],
                        "selectionMode": "single",
                        "pagingLinks": false,
                        "pagingTextBox": true,
                        "firstLastArrows": true,
                        "rowsPerPage": 15,
                        "pageSizeOptions": [10, 15, 25]
                    },
                    "declare": [
                        "Grid",
                        "Keyboard",
                        "Selection",
                        "Pagination",
                        "ColumnHider",
                        "ColumnResizer",
                        "GridRqlFilter"
                        //"_StoreMixin"
                    ]
                }

            },
            "filterControlPanelOption": {
                "store": {
                    "options": {
                        'headers': {
                            'Accept': 'application/json'
                        },
                        "target": "/rest/filters_list"
                        //"data": null,
                    },

                    "declare": [
                        "Rest",
                        "RequestMemory",
                        "Trackable"
                    ]
                },

                "options": {
                    "columns": [
                        {"label": "id", "field": "id"},
                        {
                            "label": "Название",
                            "field": "name",
                            "editor": "text",
                            "editOn": "dblclick",
                            "autoSave": true
                        }
                    ],
                    "filteredStoreDataOption": [
                        {
                            "label": "Номер категории",
                            "value": {
                                "type": "string",
                                "name": "ebaycategory_id",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },
                        {
                            "label": "Количество приданных",
                            "value": {
                                "type": "string",
                                "name": "count_sold",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },
                        {
                            "label": "Количество выставленных",
                            "value": {
                                "type": "string",
                                "name": "count_push",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },
                        {
                            "label": "Средняя цена по категории",
                            "value": {
                                "type": "string",
                                "name": "mean_price",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },
                        {
                            "label": "Оценка вероятности продажи",
                            "value": {
                                "type": "string",
                                "name": "prob",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },
                        {
                            "label": "Оценка прибыли за месяц",
                            "value": {
                                "type": "string",
                                "name": "prof_mounth",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },
                        {
                            "label": "Оценка вероятности продажи при выставлении на 10 дней",
                            "value": {
                                "type": "string",
                                "name": "new_prob",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },
                        {
                            "label": "Оценка прибыли за месяц при выставлении на 10 дней",
                            "value": {
                                "type": "float",
                                "name": "new_prof_mounth",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },
                        {
                            "label": "Разница в прибыли",
                            "value": {
                                "type": "float",
                                "name": "delta_prof_mounth",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        }
                    ]
                }

            }
        },
        "tableProduct" : {
            "title": "Таблица частот по отдельным товарам",
            "name": "tableProduct",
            "filteredGridOption": {
                "store": {

                },
                "grid": {
                    "options": {
                        "columns": [
                            {"label": "id", "field": "id"},

                            {"label": "ProductID", "field": "ProductID"},

                            {"label": "Количество проданных", "field": "count_sold"},
                            {"label": "Количество выставленных", "field": "count_push"},

                            {"label": "Цена товара", "field": "price"},

                            {"label": "Оценка вероятности продажи", "field": "prob"},
                            {"label": "Оценка прибыли за месяц", "field": "prof_mounth"},
                            {"label": "Оценка вероятности продажи при выставлении на 10 дней", "field": "new_prob"},
                            {"label": "Оценка прибыли за месяц при выставлении на 10 дней", "field": "new_prof_mounth"},
                            {"label": "Разница в прибыли", "field": "delta_prof_mounth"}
                        ],
                        "selectionMode": "single",
                        "pagingLinks": false,
                        "pagingTextBox": true,
                        "firstLastArrows": true,
                        "rowsPerPage": 15,
                        "pageSizeOptions": [10, 15, 25]
                    },
                    "declare": [
                        "Grid",
                        "Keyboard",
                        "Selection",
                        "Pagination",
                        "ColumnHider",
                        "ColumnResizer",
                        "GridRqlFilter"
                        //"_StoreMixin"
                    ]
                }

            },
            "filterControlPanelOption": {
                "store": {
                    "options": {
                        'headers': {
                            'Accept': 'application/json'
                        },
                        "target": "/rest/filters_list"
                        //"data": null,
                    },

                    "declare": [
                        "Rest",
                        "RequestMemory",
                        "Trackable"
                    ]
                },

                "options": {
                    "columns": [
                        {"label": "id", "field": "id"},
                        {
                            "label": "Название",
                            "field": "name",
                            "editor": "text",
                            "editOn": "dblclick",
                            "autoSave": true
                        }
                    ],
                    "filteredStoreDataOption": [
                        {
                            "label": "ProductID",
                            "value": {
                                "type": "string",
                                "name": "ProductID",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },
                        {
                            "label": "Количество приданных",
                            "value": {
                                "type": "string",
                                "name": "count_sold",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },
                        {
                            "label": "Количество выставленных",
                            "value": {
                                "type": "string",
                                "name": "count_push",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },
                        {
                            "label": "Цена товара",
                            "value": {
                                "type": "string",
                                "name": "price",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },
                        {
                            "label": "Оценка вероятности продажи",
                            "value": {
                                "type": "string",
                                "name": "prob",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },
                        {
                            "label": "Оценка прибыли за месяц",
                            "value": {
                                "type": "string",
                                "name": "prof_mounth",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },
                        {
                            "label": "Оценка вероятности продажи при выставлении на 10 дней",
                            "value": {
                                "type": "string",
                                "name": "new_prob",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },
                        {
                            "label": "Оценка прибыли за месяц при выставлении на 10 дней",
                            "value": {
                                "type": "float",
                                "name": "new_prof_mounth",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },
                        {
                            "label": "Разница в прибыли",
                            "value": {
                                "type": "float",
                                "name": "delta_prof_mounth",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        }
                    ]
                }

            }
        },
        "tableModel" : {
            "title": "Таблица популярности каждой из марок мотоциклов",
            "name": "tableModel",
            "filteredGridOption": {
                "store": {

                },
                "grid": {
                    "options": {
                        "columns": [
                            {"label": "id", "field": "id"},

                            {"label": "id марки мотоцикла", "field": "vehicle_id"},
                            {"label": "Mаркa мотоцикла", "field": "vehicle"},

                            {"label": "Количество проданных товаров которые подходят данной марке", "field": "count_sold"},
                            {"label": "Количество выставленных товаров которые подходят данной марке", "field": "count_publish"},
                        ],
                        "selectionMode": "single",
                        "pagingLinks": false,
                        "pagingTextBox": true,
                        "firstLastArrows": true,
                        "rowsPerPage": 15,
                        "pageSizeOptions": [10, 15, 25]
                    },
                    "declare": [
                        "Grid",
                        "Keyboard",
                        "Selection",
                        "Pagination",
                        "ColumnHider",
                        "ColumnResizer",
                        "GridRqlFilter"
                        //"_StoreMixin"
                    ]
                }

            },
            "filterControlPanelOption": {
                "store": {
                    "options": {
                        'headers': {
                            'Accept': 'application/json'
                        },
                        "target": "/rest/filters_list"
                        //"data": null,
                    },

                    "declare": [
                        "Rest",
                        "RequestMemory",
                        "Trackable"
                    ]
                },

                "options": {
                    "columns": [
                        {"label": "id", "field": "id"},
                        {
                            "label": "Название",
                            "field": "name",
                            "editor": "text",
                            "editOn": "dblclick",
                            "autoSave": true
                        }
                    ],
                    "filteredStoreDataOption": [
                        {
                            "label": "id марки мотоцикла",
                            "value": {
                                "type": "string",
                                "name": "vehicle_id",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        }, {
                            "label": "Mаркa мотоцикла",
                            "value": {
                                "type": "string",
                                "name": "vehicle",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },
                        {
                            "label": "Количество проданных товаров которые подходят данной марке",
                            "value": {
                                "type": "string",
                                "name": "count_sold",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },
                        {
                            "label": "Количество выставленных товаров которые подходят данной марке",
                            "value": {
                                "type": "string",
                                "name": "count_publish",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },

                    ]
                }

            }
        },
        "tableProductModel" : {
            "title": "Таблица популярности деталей по маркам которым она подходит",
            "name": "tableProductModel",
            "filteredGridOption": {
                "store": {

                },
                "grid": {
                    "options": {
                        "columns": [
                            {"label": "id", "field": "id"},

                            {"label": "ProductID", "field": "ProductID"},

                            {"label": "Количество проданых товаров которы подходят тем же маркам мотоциклов", "field": "count_model_sold"},
                            {"label": "Количество выставленных товаров которые подходят тем же маркам мотоцыклов", "field": "count_model_publish"},
                            {"label": "Оценка вероятности продажи товара который подходит тем же маркам мотоциклов", "field": "prob"},
                        ],
                        "selectionMode": "single",
                        "pagingLinks": false,
                        "pagingTextBox": true,
                        "firstLastArrows": true,
                        "rowsPerPage": 15,
                        "pageSizeOptions": [10, 15, 25]
                    },
                    "declare": [
                        "Grid",
                        "Keyboard",
                        "Selection",
                        "Pagination",
                        "ColumnHider",
                        "ColumnResizer"
                        //"_StoreMixin"
                    ]
                }

            },
            "filterControlPanelOption": {
                "store": {
                    "options": {
                        'headers': {
                            'Accept': 'application/json'
                        },
                        "target": "/rest/filters_list"
                        //"data": null,
                    },

                    "declare": [
                        "Rest",
                        "RequestMemory",
                        "Trackable"
                    ]
                },

                "options": {
                    "columns": [
                        {"label": "id", "field": "id"},
                        {
                            "label": "Название",
                            "field": "name",
                            "editor": "text",
                            "editOn": "dblclick",
                            "autoSave": true
                        }
                    ],
                    "filteredStoreDataOption": [
                        {
                            "label": "ProductID",
                            "value": {
                                "type": "string",
                                "name": "ProductID",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },
                        {
                            "label": "Количество проданых товаров которы подходят тем же маркам мотоциклов",
                            "value": {
                                "type": "string",
                                "name": "count_model_sold",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },
                        {
                            "label": "Количество выставленных товаров которые подходят тем же маркам мотоцыклов",
                            "value": {
                                "type": "string",
                                "name": "count_model_publish",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },
                        {
                            "label": "Оценка вероятности продажи товара который подходит тем же маркам мотоциклов",
                            "value": {
                                "type": "string",
                                "name": "prob",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        }
                    ]
                }

            }
        },
        "bestProducts" : {
            "title": "Список товаров которые продались больше всего на ebay",
            "name": "bestProducts",
            "filteredGridOption": {
                "store": {

                },
                "grid": {
                    "options": {
                        "columns": [
                            {"label": "id строки", "field": "id"},

                            {"label": "Тайтл товара", "field": "title"},

                            {"label": "Количество продаж данного товара начиная с 2016-01-22", "field": "count_sold"},
                        ],
                        "selectionMode": "single",
                        "pagingLinks": false,
                        "pagingTextBox": true,
                        "firstLastArrows": true,
                        "rowsPerPage": 15,
                        "pageSizeOptions": [10, 15, 25]
                    },
                    "declare": [
                        "Grid",
                        "Keyboard",
                        "Selection",
                        "Pagination",
                        "ColumnHider",
                        "ColumnResizer",
                        "GridRqlFilter"
                        //"_StoreMixin"
                    ]
                }

            },
            "filterControlPanelOption": {
                "store": {
                    "options": {
                        'headers': {
                            'Accept': 'application/json'
                        },
                        "target": "/rest/filters_list"
                        //"data": null,
                    },

                    "declare": [
                        "Rest",
                        "RequestMemory",
                        "Trackable"
                    ]
                },

                "options": {
                    "columns": [
                        {"label": "id", "field": "id"},
                        {
                            "label": "Название",
                            "field": "name",
                            "editor": "text",
                            "editOn": "dblclick",
                            "autoSave": true
                        }
                    ],
                    "filteredStoreDataOption": [
                        {
                            "label": "Тайтл товара",
                            "value": {
                                "type": "string",
                                "name": "title",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },
                        {
                            "label": "Количество продаж данного товара начиная с 2016-01-22",
                            "value": {
                                "type": "string",
                                "name": "count_sold",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        }
                    ]
                }

            }
        },
        "bestCompetitor" : {
            "title": "Список продавцов и количество продаж этих продавцов",
            "name": "bestCompetitor",
            "filteredGridOption": {
                "store": {

                },
                "grid": {
                    "options": {
                        "columns": [
                            {"label": "id строки", "field": "id"},

                            {"label": "Ник продавца", "field": "seller_name"},

                            {"label": "Количество продаж данного товара начиная с 2016-01-22", "field": "count_sold"},
                        ],
                        "selectionMode": "single",
                        "pagingLinks": false,
                        "pagingTextBox": true,
                        "firstLastArrows": true,
                        "rowsPerPage": 15,
                        "pageSizeOptions": [10, 15, 25]
                    },
                    "declare": [
                        "Grid",
                        "Keyboard",
                        "Selection",
                        "Pagination",
                        "ColumnHider",
                        "ColumnResizer",
                        "GridRqlFilter"
                        //"_StoreMixin"
                    ]
                }

            },
            "filterControlPanelOption": {
                "store": {
                    "options": {
                        'headers': {
                            'Accept': 'application/json'
                        },
                        "target": "/rest/filters_list"
                        //"data": null,
                    },

                    "declare": [
                        "Rest",
                        "RequestMemory",
                        "Trackable"
                    ]
                },

                "options": {
                    "columns": [
                        {"label": "id", "field": "id"},
                        {
                            "label": "Название",
                            "field": "name",
                            "editor": "text",
                            "editOn": "dblclick",
                            "autoSave": true
                        }
                    ],
                    "filteredStoreDataOption": [
                        {
                            "label": "Ник продавца",
                            "value": {
                                "type": "string",
                                "name": "seller_name",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },
                        {
                            "label": "Количество продаж данного товара начиная с 2016-01-22",
                            "value": {
                                "type": "string",
                                "name": "count_sold",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        }
                    ]
                }

            }
        },
        "NN" : {
            "title": "Гистограмма цен выставленных товаров с задаными словами",
            "name": "NN",
            "filteredGridOption": {
                "store": {

                },
                "grid": {
                    "options": {
                        "columns": [
                            {"label": "id", "field": "id"},
                            {"label": "Логарифм по основанию 10 от цены товара", "field": "x"},
                            {"label": "Количество продаж", "field": "y"}
                        ],
                        "selectionMode": "single",
                        "pagingLinks": false,
                        "pagingTextBox": true,
                        "firstLastArrows": true,
                        "rowsPerPage": 15,
                        "pageSizeOptions": [10, 15, 25]
                    },
                    "declare": [
                        "Grid",
                        "Keyboard",
                        "Selection",
                        "Pagination",
                        "ColumnHider",
                        "ColumnResizer",
                        "GridRqlFilter"
                        //"_StoreMixin"
                    ]
                }

            },
            "filterControlPanelOption": {
                "store": {
                    "options": {
                        'headers': {
                            'Accept': 'application/json'
                        },
                        "target": "/rest/filters_list"
                        //"data": null,
                    },

                    "declare": [
                        "Rest",
                        "RequestMemory",
                        "Trackable"
                    ]
                },

                "options": {
                    "columns": [
                        {"label": "id", "field": "id"},
                        {
                            "label": "Название",
                            "field": "name",
                            "editor": "text",
                            "editOn": "dblclick",
                            "autoSave": true
                        }
                    ],
                    "filteredStoreDataOption": [
                        {
                            "label": "Логарифм по основанию 10 от цены товара",
                            "value": {
                                "type": "string",
                                "name": "x",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },
                        {
                            "label": "Количество проданных",
                            "value": {
                                "type": "string",
                                "name": "y",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        }
                    ]
                }

            }
        },
        "NNSold" : {
            "title": "Гистограмма цен проданых товаров с задаными словами",
            "name": "NNSold",
            "filteredGridOption": {
                "store": {

                },
                "grid": {
                    "options": {
                        "columns": [
                            {"label": "id", "field": "id"},
                            {"label": "Логарифм по основанию 10 от цены товара", "field": "x"},
                            {"label": "Количество продаж", "field": "y"}
                        ],
                        "selectionMode": "single",
                        "pagingLinks": false,
                        "pagingTextBox": true,
                        "firstLastArrows": true,
                        "rowsPerPage": 15,
                        "pageSizeOptions": [10, 15, 25]
                    },
                    "declare": [
                        "Grid",
                        "Keyboard",
                        "Selection",
                        "Pagination",
                        "ColumnHider",
                        "ColumnResizer",
                        "GridRqlFilter"
                        //"_StoreMixin"
                    ]
                }

            },
            "filterControlPanelOption": {
                "store": {
                    "options": {
                        'headers': {
                            'Accept': 'application/json'
                        },
                        "target": "/rest/filters_list"
                        //"data": null,
                    },

                    "declare": [
                        "Rest",
                        "RequestMemory",
                        "Trackable"
                    ]
                },

                "options": {
                    "columns": [
                        {"label": "id", "field": "id"},
                        {
                            "label": "Название",
                            "field": "name",
                            "editor": "text",
                            "editOn": "dblclick",
                            "autoSave": true
                        }
                    ],
                    "filteredStoreDataOption": [
                        {
                            "label": "Логарифм по основанию 10 от цены товара",
                            "value": {
                                "type": "string",
                                "name": "x",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },
                        {
                            "label": "Количество проданных",
                            "value": {
                                "type": "string",
                                "name": "y",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        }
                    ]
                }

            }
        },
        "soldProducts" : {
            "title": "Таблица количества продаж каждого из товаров",
            "name": "soldProducts",
            "filteredGridOption": {
                "store": {

                },
                "grid": {
                    "options": {
                        "columns": [
                            {"label": "id", "field": "id"},
                            {"label": "ProductID", "field": "ProductID"},
                            {"label": "Количество продаж", "field": "count_sold"}
                        ],
                        "selectionMode": "single",
                        "pagingLinks": false,
                        "pagingTextBox": true,
                        "firstLastArrows": true,
                        "rowsPerPage": 15,
                        "pageSizeOptions": [10, 15, 25]
                    },
                    "declare": [
                        "Grid",
                        "Keyboard",
                        "Selection",
                        "Pagination",
                        "ColumnHider",
                        "ColumnResizer",
                        "GridRqlFilter"
                        //"_StoreMixin"
                    ]
                }

            },
            "filterControlPanelOption": {
                "store": {
                    "options": {
                        'headers': {
                            'Accept': 'application/json'
                        },
                        "target": "/rest/filters_list"
                        //"data": null,
                    },

                    "declare": [
                        "Rest",
                        "RequestMemory",
                        "Trackable"
                    ]
                },

                "options": {
                    "columns": [
                        {"label": "id", "field": "id"},
                        {
                            "label": "Название",
                            "field": "name",
                            "editor": "text",
                            "editOn": "dblclick",
                            "autoSave": true
                        }
                    ],
                    "filteredStoreDataOption": [
                        {
                            "label": "ProductID",
                            "value": {
                                "type": "string",
                                "name": "ProductID",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },
                        {
                            "label": "Количество продаж",
                            "value": {
                                "type": "string",
                                "name": "count_sold",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        }
                    ]
                }

            }
        },
        "soldView" : {
            "title": "Таблица соотношений покупок и просмотров лотов",
            "name": "soldView",
            "filteredGridOption": {
                "store": {

                },
                "grid": {
                    "options": {
                        "columns": [
                            {"label": "id", "field": "id"},
                            {"label": "ItemID", "field": "ItemID"},
                            {"label": "Количество продаж", "field": "count_sold"},
                            {"label": "Количество просмотров лота", "field": "count_view"},
                            {"label": "Вероятность продажи товара на который зашли", "field": "prob"}
                        ],
                        "selectionMode": "single",
                        "pagingLinks": false,
                        "pagingTextBox": true,
                        "firstLastArrows": true,
                        "rowsPerPage": 15,
                        "pageSizeOptions": [10, 15, 25]
                    },
                    "declare": [
                        "Grid",
                        "Keyboard",
                        "Selection",
                        "Pagination",
                        "ColumnHider",
                        "ColumnResizer",
                        "GridRqlFilter"
                        //"_StoreMixin"
                    ]
                }

            },
            "filterControlPanelOption": {
                "store": {
                    "options": {
                        'headers': {
                            'Accept': 'application/json'
                        },
                        "target": "/rest/filters_list"
                        //"data": null,
                    },

                    "declare": [
                        "Rest",
                        "RequestMemory",
                        "Trackable"
                    ]
                },

                "options": {
                    "columns": [
                        {"label": "id", "field": "id"},
                        {
                            "label": "Название",
                            "field": "name",
                            "editor": "text",
                            "editOn": "dblclick",
                            "autoSave": true
                        }
                    ],
                    "filteredStoreDataOption": [
                        {
                            "label": "Количество продаж",
                            "value": {
                                "type": "string",
                                "name": "count_sold",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },
                        {
                            "label": "Количество просмотров лота",
                            "value": {
                                "type": "string",
                                "name": "count_view",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },
                        {
                            "label": "Вероятность продажи товара на который зашли",
                            "value": {
                                "type": "string",
                                "name": "prob",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        }
                    ]
                }
            }
        },
        "tablePublishTime" : {
            "title": "Таблица количества выставлений на каждый час недели",
            "name": "tablePublishTime",
            "filteredGridOption": {
                "store": {

                },
                "grid": {
                    "options": {
                        "columns": [
                            {"label": "id", "field": "id"},
                            {"label": "Monday", "field": "Monday"},
                            {"label": "Tuesday", "field": "Tuesday"},
                            {"label": "Wednesday", "field": "Wednesday"},
                            {"label": "Thursday", "field": "Thursday"},
                            {"label": "Friday", "field": "Friday"},
                            {"label": "Saturday", "field": "Saturday"},
                            {"label": "Sunday", "field": "Sunday"}
                        ],
                        "selectionMode": "single",
                        "pagingLinks": false,
                        "pagingTextBox": true,
                        "firstLastArrows": true,
                        "rowsPerPage": 15,
                        "pageSizeOptions": [10, 15, 25]
                    },
                    "declare": [
                        "Grid",
                        "Keyboard",
                        "Selection",
                        "Pagination",
                        "ColumnHider",
                        "ColumnResizer",
                        "GridRqlFilter"
                        //"_StoreMixin"
                    ]
                }

            },
            "filterControlPanelOption": {
                "store": {
                    "options": {
                        'headers': {
                            'Accept': 'application/json'
                        },
                        "target": "/rest/filters_list"
                        //"data": null,
                    },

                    "declare": [
                        "Rest",
                        "RequestMemory",
                        "Trackable"
                    ]
                },

                "options": {
                    "columns": [
                        {"label": "id", "field": "id"},
                        {
                            "label": "Название",
                            "field": "name",
                            "editor": "text",
                            "editOn": "dblclick",
                            "autoSave": true
                        }
                    ],
                    "filteredStoreDataOption": [
                        {
                            "label": "Monday",
                            "value": {
                                "type": "string",
                                "name": "Monday",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },{
                            "label": "Tuesday",
                            "value": {
                                "type": "string",
                                "name": "Tuesday",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },{
                            "label": "Wednesday",
                            "value": {
                                "type": "string",
                                "name": "Wednesday",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },{
                            "label": "Thursday",
                            "value": {
                                "type": "string",
                                "name": "Thursday",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },{
                            "label": "Friday",
                            "value": {
                                "type": "string",
                                "name": "Friday",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },{
                            "label": "Saturday",
                            "value": {
                                "type": "string",
                                "name": "Saturday",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },{
                            "label": "Sunday",
                            "value": {
                                "type": "string",
                                "name": "Sunday",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        }
                    ]
                }

            }
        },
        "tablePublishTimeWithFactory" : {
            "title": "Таблица количества выставлений на каждый час недели",
            "name": "tablePublishTimeWithFactory",
            "filteredGridOption": {
                "store": {

                },
                "grid": {
                    "options": {
                        "columns": [
                            {"label": "id", "field": "id"},
                            {"label": "Monday", "field": "Monday"},
                            {"label": "Tuesday", "field": "Tuesday"},
                            {"label": "Wednesday", "field": "Wednesday"},
                            {"label": "Thursday", "field": "Thursday"},
                            {"label": "Friday", "field": "Friday"},
                            {"label": "Saturday", "field": "Saturday"},
                            {"label": "Sunday", "field": "Sunday"}
                        ],
                        "selectionMode": "single",
                        "pagingLinks": false,
                        "pagingTextBox": true,
                        "firstLastArrows": true,
                        "rowsPerPage": 15,
                        "pageSizeOptions": [10, 15, 25]
                    },
                    "declare": [
                        "Grid",
                        "Keyboard",
                        "Selection",
                        "Pagination",
                        "ColumnHider",
                        "ColumnResizer",
                        "GridRqlFilter"
                        //"_StoreMixin"
                    ]
                }

            },
            "filterControlPanelOption": {
                "store": {
                    "options": {
                        'headers': {
                            'Accept': 'application/json'
                        },
                        "target": "/rest/filters_list"
                        //"data": null,
                    },

                    "declare": [
                        "Rest",
                        "RequestMemory",
                        "Trackable"
                    ]
                },

                "options": {
                    "columns": [
                        {"label": "id", "field": "id"},
                        {
                            "label": "Название",
                            "field": "name",
                            "editor": "text",
                            "editOn": "dblclick",
                            "autoSave": true
                        }
                    ],
                    "filteredStoreDataOption": [
                        {
                            "label": "Monday",
                            "value": {
                                "type": "string",
                                "name": "Monday",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },{
                            "label": "Tuesday",
                            "value": {
                                "type": "string",
                                "name": "Tuesday",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },{
                            "label": "Wednesday",
                            "value": {
                                "type": "string",
                                "name": "Wednesday",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },{
                            "label": "Thursday",
                            "value": {
                                "type": "string",
                                "name": "Thursday",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },{
                            "label": "Friday",
                            "value": {
                                "type": "string",
                                "name": "Friday",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },{
                            "label": "Saturday",
                            "value": {
                                "type": "string",
                                "name": "Saturday",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        },{
                            "label": "Sunday",
                            "value": {
                                "type": "string",
                                "name": "Sunday",
                                "field": {
                                    'type': "TextBox"
                                }
                            },
                            "filter": [
                                {"id": 0, "label": "=", "value": "eq"},
                                {"id": 0, "label": ">", "value": "gt"},
                                {"id": 0, "label": "<", "value": "lt"},
                                {"id": 0, "label": ">=", "value": "gte"},
                                {"id": 0, "label": "<=", "value": "lte"},
                                {"id": 0, "label": "!=", "value": "ne"}
                            ]
                        }
                    ]
                }

            }
        },
    }
});