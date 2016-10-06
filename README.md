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
            "title": "Таблица пользователей",   // указываем title элемента 
            "name": "usersProfile",             // указываем name элемента 
            "options": {                        // Указываем опции для фильтров
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
Точно так же как мы создавали таблицу, мы можем создать график.
Создадим Rest DataStore (Вы должны иметь [backend](https://github.com/avz-cmf/zaboy-dojo "backend") )
```javascript 
    var centralDataStore = new (declare([StoreRqlFilter, Trackable]))({
                'headers': {
                    'Accept': 'application/json'
                },
                'useRangeHeaders': true,
                "target": "/rest/sin"
            });
```

Теперь создадим Char.
В данном случаче мы будем сторить синусоиду, по этому Chart type будет Lines

```javascript 
    var filterChartOption = {
            "title": "Гистограмма цены выставленных товаров", // Указываем title элемента 
            "name": "plotPublishPrice", // Указываем name элемента 
            "store": centralDataStore, // Указываем хранилище 
            "type": Lines, // Указываем тип чарта 
            "xAxisLabel": 'Ось абсцисс',    // Указываем лейбл для 
            "yAxisLabel": 'Ось ординат'     // Указываем тип чарта 
        };
    
    var filterChart = new Chart(filterChartOption);
```

Теперь можно так же добавить поддержку панели управления фльтрами.
Сконфигурируем и создадим саму панель фильтров для нашего графика
```javascript
        var chartFilterControlPanel = new FilterControlPanel({
            "title": "Панель управления фильтрами ", // Указываем title который будет ввиден как заголовок элемента
            "id": "chartFilter", // указываем id  элемента 
            "name": "plotPublishPrice", // указываем name  элемента 
            "columns": [ // Передаем перечень колнок для таблици фильтров(колонки совместимы с колонками dgrid)
                {"label": "id", "field": "id"}, 
                {
                    "label": "Название",
                    "field": "name",
                    "editor": "text",
                    "editOn": "dblclick",
                    "autoSave": true
                }
            ],
            "filteredStoreDataOption": [  // Указываем опции для фильтров
                {
                    "label": "Ось абсцисс",  // Указываем label для фильтрованого параметра
                    "value": { // Указываем параметры значения 
                        "type": "string", // Указываем тип значения 
                        "name": "x", // Указываем фактическое имя 
                        "field": {
                            'type': "TextBox" // Указываем editor для поля
                        }
                    },
                    "filter": [ // Указываем списко доступных фильтров для поля
                        {"id": 0, "label": "=", "value": "eq"}, 
                        {"id": 0, "label": ">", "value": "gt"},
                        {"id": 0, "label": "<", "value": "lt"},
                        {"id": 0, "label": ">=", "value": "gte"},
                        {"id": 0, "label": "<=", "value": "lte"},
                        {"id": 0, "label": "!=", "value": "ne"}
                    ]
                },
                {
                    "label": "Ось ординат",
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
            ],
            "store": new (declare([Rest, RequestMemory, Trackable]))({ // Указываем сторе дл яхранения фильтров
                'headers': {
                    'Accept': 'application/json'
                },
                "target": "/rest/filters_list"
            })
        });

```

Соеденим панель фильтров и chart 
DataPreviewControlPanel - обертка над таблицей которая дает возможность подключать панель фильтров к таблице.

```javascript
    var chartDataPreviewControlPanel = new DataPreviewControlPanel({
            title: "Функция f(x) = sin(x) (Синусоида)",
            filterControlPanel: chartFilterControlPanel,
            dataViewer: filterChart
        });
```

### Использование модуля Composite

Теперь давайте обьеденим наш виджет Chart и виодет FilteredGrid.
Сам по себе, обьект Composite может содержать любое количество дочерних элементов групируя 
их в одном виджете для удобного управления и взаимодейсвия этими элементами.
```javascript
     var composite = new Composite({
            components: [tableDataPreviewControlPanel,
                chartDataPreviewControlPanel
            ]
        }).placeAt(dom.byId('grid'));
        
        composite.startup();
```

### Поддерживаемый RQL

* query
    * LogicOperator
        * and() - содержит множество нод условий которые должны быть обьеденены по И
        * or() - содержит множество нод условий которые должны быть обьеденены по ИИЛ
        * not() - содержит множество нод условий которые должны быть инвертированы в НЕ
    * ArrayOperator
        * in() - нода для проверки вхождения значения в указаное перечсление
        * out() - нода для проверки не наличия значений в указаном перечсление
    * ScalarOperator
        * eq() - нода равенста
        * ne() - нода не равенста
        * ge() - нода больше или равно
        * gt() - нода больше
        * le() - нода меньше или равно
        * lt() - нода меньше
        * like() - нода проверки значения по маске
* select
    * Aggregate func
        * count() - агрегатная функция для подсчета количесва значений
        * max() - агрегатная функция для подсчета максимального значения
        * min() - агрегатная функция для подсчета минимального значения
        * groupby() - агрегатная функция для групирования значений
* sort() - нода для указания сортировки
* limit(limit, offset) - нода для указания лимита и оффсета выборки

Пример фильтра в rql();
`and(and(eq(q,null()),ne(q,null()),le(q,r),ge(q,u)),or(lt(q,t),gt(q,y),in(q,(a,s,d,f,g))))
&limit(20,30)&sort(-q)
&select(q,max(q),min(q),count(q))`

####Отправка rql запросов
При отправке запроса нужно использовать зголовок 
`'Accept': 'application/json'` для получения данных в JSON формате.
Так же вы можете комбинировать limit() для запрпоса указывая фактичиский лимит на поулчения данный в самом rql, 
а ограничивать выборку нужно в заголовке.
При таком подходе данные будут сначала отлимитированы по limit указаному в rql, 
а после на них будет наложен фильтр который указан в заголовках.

Отправленый rql `limit(37)`
Отправленые заголовки
`'Range':   'items=0-14'`
`'X-Range': 'items=0-14'`

В ответе будет содержатся заголовки 
`'Content-Range':     'items 0-13/37'`

Как видно, заголовок ответа содержит наш лимит отпрвленый в rql
Работает как основной фильтр выборки 'items 0-13/<font color='red'>37</font>' -> limit(<font color='red'>37</font>)
А лимиты отправлены в заголовках, действуют как фильтр поверх тех данных что мы получили на предыдущем шаге
'items <font color='red'>0-13</font>/37' -> 'Range':   'items=<font color='red'>0-14</font>'

Подобные query запросы нужно отправлять методом GET.

Если мы хотим добавить даные в сторе, мы можем отправить POST запрос для того что бы добавить новый обект
или отправить PUT запрос что бы удалить его.
Так же мы можем отправить DELETE запрос что бы удалить нужный элемент.

#####POST

В теле запроса мы должны указать либо один обькет лбо массив обьектов которые мы хотим добавить.
```json
{ 
    "id": "1",
    "name": "Test",
    "surname": "Test"
}
```
#####PUT
В теле запроса мы должны указать либо один обькет который хотим изменить. Обязательно указать id.
Указать нужено либо в теле обьекта либо как часть REST запроса.
```json
{ 
    "id": "1",
    "name": "Test",
    "surname": "Test"
}
```
#####DELETE


## License
Copyright (c) 2016 victorynox
Licensed under the GNU license.
