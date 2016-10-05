# Smart

The best project ever.
#dojo-rql Module
Модуль для отображения данных с иcпользованием умных(разширеных) фильтров
 - `Chart` - модуль для поддержки фильтров в графиках
 - `Composite` - модуль для компоновки виджетов
 - `DataPreviewControlPanel` - модуль для обьеденения панели управления фильтрами и виджетом с поддержкой фильтров для вывода данных
 - `FilterControlPanel` - модуль панели управления фильтрами 
 - `FilteredGrid` - модуль для поддержки фильтров в таблицах
 - `FilterEditor` - модуль для редактирования фильтров
 - `TableWithConfiguration` - модуль для поддержки сохранения и загрузки настроек в таблицах
 - `Tree` - модуль для поддержки деревьями dstore
 - `Util` - модуль с вспомагательными утилитами 
 - `extensions/GridRqlFilter` - модуль с вспомагательными утилитами 
 - `extensions/StoreRqlFilter` - модуль с вспомагательными утилитами 
 
 
## Что бы начать
Установите библиотеку командой: `npm install dojo-rql`

> Что бы быстро приступить к использованию библиотеки следуйте следуще иструкции

Создаем Rest DataStore (вы должны иметь [backend](https://github.com/avz-cmf/zaboy-dojo "backend") )
```javascript 

    var centralDataStore = new (declare([StoreRqlFilter, Trackable]))({
                'headers': {
                    'Accept': 'application/json'
                },
                'useRangeHeaders': true,
                "target": "/rest/users"
            });

```

Далее создаем таблицу с поддержкой фильтров
```javcscript
        var filteredGridOption = {
            "title": "Таблица пользователей",
            "name": "usersProfile",
            "options": {
                "columns": [
                    {"label": "id", "field": "id"},
                    {"label": "Имя", "field": "name"},
                    {"label": "Фамилия", "field": "surname"}
                ],
                "collection": centralDataStore,
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
                "ColumnHider",
                "ColumnResizer",
                "GridRqlFilter"
            ]
        };
        var filterGrid = new FilteredGrid(filteredGridOption);
```

Таблица уже поддежривает фильтры, но что бы мы могли ими управлять нам нужно добавить панель управлени фильтрами

```javascript

     var tableFilterControlPanel = new FilterControlPanel({
                "title": "Панель управления фильтрами ",
                "id": "tableFilter",
                "name": "plotPublishPrice",
    
                "filteredStoreDataOption": [
                    {
                        "label": "Имя",
                        "value": {
                            "type": "string",
                            "name": "name",
                            "field": {
                                'type': "TextBox"
                            }
                        },
                        "filter": [
                            {"id": 0, "label": "=", "value": "eq"},
                            {"id": 0, "label": "!=", "value": "ne"}
                        ]
                    },
                    {
                        "label": "Фамилия",
                        "value": {
                            "type": "string",
                            "name": "surname",
                            "field": {
                                'type': "TextBox"
                            }
                        },
                        "filter": [
                            {"id": 0, "label": "=", "value": "eq"},
                            {"id": 0, "label": "!=", "value": "ne"}
                        ]
                    }
                ],
                "store": new (declare([Rest, RequestMemory, Trackable]))({
                    'headers': {
                        'Accept': 'application/json'
                    },
                    "target": "/rest/filters_list"
                })
            });
            
            var tableDataPreviewControlPanel = new DataPreviewControlPanel({
                        title: "Таблица профилей пользователей",
                        filterControlPanel: tableFilterControlPanel,
                        dataViewer: filterGrid
                    });
    
```
## Докуменация
_(Coming soon)_

## Примеры

### Использование модуля Chart
### Использование модуля Composite
### Поддерживаемый RQL

* query
    * LogicOperator
        * and()
        * or()
        * not()
    * ArrayOperator
        * in()
        * out()
    * ScalarOperator
        * eq()
        * ne()
        * ge()
        * gt()
        * le()
        * lt()
        * like()
* select
    * Aggregate func
        * count()
        * max()
        * min()
        * groupby()
* sort()
* limit(limit, offset)
`and(and(eq(q,null()),ne(q,null()),le(q,r),ge(q,u)),or(lt(q,t),gt(q,y),in(q,(a,s,d,f,g))))
&limit(20,30)&sort(-q)
&select(q,max(q),min(q),count(q))`


## License
Copyright (c) 2016 victorynox
Licensed under the GNU license.
