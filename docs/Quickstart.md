## Быстрый старт
Установите библиотеку используя `npm`: `npm install rgrid`. Затем установите
все зависимости, выполнив команду `npm install`.

Потом создайте HTML файл на оодном уровне с папкой `node_modules` файл с именем
`rgridTestPage.html`

Для получения минимального работоспособного приложения нужно:
1) Подключить загрузчик Dojo, предварительно зарегистрировав нужные пакеты.
Для этого добавьте в `<head>` файла следующие строки:
```
<script>
var dojoConfig = {
	async: true,
	packages: [
		{
			name: "rgrid",
			location: 'https://cdn.jsdelivr.net/npm/rgrid@0.5/lib'
		},
		{
			name: "dstore",
			location: 'https://cdn.jsdelivr.net/npm/dojo-dstore'
		},
		{
			name: "promised-io",
			location: 'https://cdn.jsdelivr.net/npm/promised-io'
		},
		{
			name: "rql",
			location: 'https://cdn.jsdelivr.net/npm/rollun-rql@0.3'
		},
		{
			name: "dgrid",
			location: 'https://cdn.jsdelivr.net/npm/dgrid'
		},
		{
			name: "dijit",
			location: 'https://cdn.jsdelivr.net/npm/dijit'
		},
		{
			name: "dojox",
			location: 'https://cdn.jsdelivr.net/npm/dojox'
		},
		{
        	name: "rgrid-example",
        	location: 'https://cdn.jsdelivr.net/npm/rgrid@0.5/example'
        },
	]
};
</script>
<script src="https://cdn.jsdelivr.net/npm/dojo@1.13.0/dojo.js"></script>
```
2) Добавить CSS. Для этого добавьте в `<head>` вашего файла следующие строки:
```
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/rgrid@0.5/lib/css/rgrid.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/rgrid@0.5/themes/flat/flat.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/rgrid@0.5/lib/css/FilterEditor.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/dojox/highlight/resources/highlight.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/dojox/highlight/resources/pygments/colorful.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/dgrid/css/dgrid.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/dojox/grid/enhanced/resources/EnhancedGrid_rtl.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/dojo@1.13.0/resources/dojo.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/dojo@1.13.0/resources/dnd.css">
```
И присвойте `<body>` класс flat:
```
<body class='flat'>
```
3) Создать хранилище с данными, которое работает с [rollun-rql](https://github.com/rollun-com/rollun-rql)
Query обьектом.
    * Подробнее узнать о QueryableStore можно [тут](./docs/utilities/QueryableStore.md).
4) Передать это хранилище в таблицу и запустить её.

* Чтобы сделать вышеописанное, добавьте в файл следующее:
```
<script>
require(['rgrid/Rgrid','rgrid/store/QueryableStore'], (Rgrid, QueryableStore) => {
    const grid = new Rgrid({
        collection: new QueryableStore({target: 'my/datastore'}),
        class: 'dgrid-autoheight'
        }, 'grid')
    grid.loadContent();
})
</script>
<div id="grid"></div>
```
5) Запустить тестовый сервер. Для этого нужно выполнить команду `node node_modules/rgrid/example/mockServer.js`
из директории проекта

     В данной версии туториала сервер поддерживает не все фичи приложения.
     Для полного ознакомления используйте [rollun-datastore]((https://github.com/rollun-com/rollun-datastore))

    * Эта команда запустит тестовый сервер для илюстрации данного туториала.
    * Сервер не является полноценным бэкендом. Полноценный бэкенд доступен [здесь](https://github.com/rollun-com/rollun-datastore)
6) Ознакомиться с результатом. Для этого перейдите по адресу `localhost:8080/test`.
В итоге выйдет таблица, которая отрисовывает первые 15 записей из хранилища.

Чтобы управлять тем, какие данные отрисовывает таблица, нужно менять обьект
Query, который она содержит.
* Выбор полей - нода select, количество строк - нода limit.
* Для фильтрациии данных добавляйте в Query дополнительные условия.
Для иллюстрации удалите из кода выше вызов функции `loadContent` и добавьте
вместо него следующие строки:
```
const Query = require('rql/query').Query;
grid.appendQuery(new Query({name: 'select', args: ['id', 'name']}));
grid.appendQuery(new Query({name: 'limit', args: [10]}));
grid.loadContent();
```
Этот код добавит к Query таблицы ноду `select` и загрузит содержимое согласно обновлённому Query.
В итоге таблица отрисует 10 записей с полями 'id', 'name'.

Методы таблицы для работы с Query:
* `setQuery(query)` - заменить внутренний Query новым
* `getQuery()` - получить **копию** Query из таблицы
* `appendQuery(query)` - дополнить Query новыми нодами, заменяя совпадения новым

## Работа с модулями
### Базовый вариант
Обьединять компоненты в одну систему можно при помощи общей шины событий.

        Все наши компоненты содежат миксин `_EventDriven`, который предоставляет методы для
        работы с событиями.

Для простейшего оюбьединения достаточно передать двум компонентам общую шину событий.
Для этого передайте в конструкторы модулей общий эмитер событий в свойстве `eventBus`.

**Но** мы рекомендуем применять `EventScope`.

### Обьединение компонентов с помощью `EventScope`
`EventScope` - закрытое пространство событий для связи группы компонентов между собой.
Компоненты слушают свой EventScope на предмет нужных им данных, и эмитят в него
результаты своей работы.

Чтобы добавить к таблице модули, поместите их в один EventScope с таблицей.
* Компоненты, которые используют EventScope, обязаны содержать `_EventDrivenMixin`.
* Таблица будет слушать EventScope на предмет событий, меняющих её состояние.
* Модули будут эмитить эти события, используя методы из `_EventDrivenMixin`
* Получают информацию так же
* Посредством EventScope можно обьединить два любых модуля, способных работать с событиями

        Например, два Store или две таблицы, размещённые в разных местах на странице

```
<script>
	require(['rgrid/Rgrid',
			'rgrid/store/QueryableStore',
			'rgrid/Pagination',
			'dojo/dom',
			'rgrid/EventScope',
			'rgrid/SearchBar',],
		function (
		 Rgrid,
		 QueryableStore,
		 Pagination,
		 dom,
		 EventScope,
		 SearchBar) {
			const eventScope = new EventScope(),
				grid = new Rgrid({
					collection: new QueryableStore({target: 'my/datastore'}),
					class: 'dgrid-autoheight'
				}, 'grid'),
				pagination = new Pagination({domNode: dom.byId('pagination')}),
				searchBar = new SearchBar();
			searchBar.placeAt(dom.byId('search'));
			eventScope.registerMultiple([grid, pagination, searchBar]);
			grid.loadContent();
		});
</script>
<div style='display: flex; justify-content: space-between;'>
    <span id='pagination'></span>
    <span id='search'></span>
</div>
<div id='grid'></div>
```
Теперь два компонента общаются через полностью закрытую событийную среду,
которая знает о компонентах содержащихся в ней.

## RComposite
RComposite нужен для стандартизации и облегчения работы с компонентами.

Он предоставляет общий алгоритм для создания компонентов, их настройки,
помещения в общий `EventScope` и размещения на странице.

* Конкретная логика создания и размещения делегирутеся специальным обьектам
* Обьединяет компоненты внутри с помощью общего EventScope
* Все компоненты, с которыми он работает, должны быть представлены в виде
*префабов* - инкапсулированых фабрик, создающих виджеты dojo, используя
локальные инастройки и внутренню логику.

Подробнее о префабах и их использовании написанно [здесь](./docs/composite/Prefabs.md)

Для того, чтобы базово использовать RComposite, нужно:
1) Выполнить пункты 1) и 2) из предыдущего туториала
2) Добавить в файл следующие строки:
```
<script>
require([
            'dojo/dom',
            'rgrid/Composite/RComposite',
            'rgrid/Composite/WidgetFactory',
            'rgrid/Composite/TemplateWidgetPlacer',
            'rgrid/prefabs/ConditionPanel',
            'rgrid/prefabs/Pagination',
            'rgrid/prefabs/Rgrid',
            'rgrid/prefabs/Search',
            'dstore/Memory',
            'dojo/text!rgrid-example/testTemplate.html'
      ], function (
              dom,
              RComposite,
              WidgetFactory,
              TemplateWidgetPlacer,
              ConditionPanelPrefab,
              PaginationPrefab,
              RgridPrefab,
              SearchPrefab,
              Memory,
              template
              ) {
              const factory = new WidgetFactory(),
              placer = new TemplateWidgetPlacer(),
              configStore = new Memory({data: [{id: 'rgrid', gridTarget: '/my/datastore'}]}),
              composite = new RComposite({
                  widgetFactory: factory,
                  widgetPlacer: placer,
                  configStore: configStore,
                  templateString: template
              });
              composite.addComponents([new RgridPrefab(),
                                       new PaginationPrefab({startPage: null}),
                                       new SearchPrefab()]);
              composite.placeAt(dom.byId('composite'));
              composite.startup();
          }
   );
</script>
<div id='composite'></div>
```
Этот фрагмент кода собирает rgrid c пагинацией и поисковой строкой, и размещает
их согласно шаблону из файла testTemplate.html. Готовый фрагмент документа
заменит собой ДОМ ноду композита.

Содержимое файла `testTemplate.html` приведено ниже:
```
<div>
    <div data-dojo-attach-point="filters"></div>
    <div style="display: flex; justify-content: space-between;">
        <span data-dojo-attach-point="pagination"></span>
        <span data-dojo-attach-point="search"></span>
    </div>
    <div data-dojo-attach-point="rgrid-grid"></div>
    <div data-dojo-attach-point="vehicle-processor-data-inserter"></div>
</div>
```
Здесь при помощи атрибута `data-dojo-attach-point` указаны точки крепления
виджетов.

В процессе работы все виджеты будут созданы из префабов с предопределёнными
настройками, а недостающие данные будут получены из `configStore`. После
создания композит поместит все виджеты в один `EventScope` и разместит их
согласно информации об их точке крепления.

Подробнее о RComposite - [тут](./docs/composite/RComosite.md).

## ConditionControlPanel

rgrid содержит продвинутую систему создания услвий для запросов к datastore -
`ConditionControlPanel`. Она позволяет создавать даже самые сложные запросы
с помощью довольно простого UI,  сохранять их для повторного использования. Cоздаётся она с помощью префаба `ConditionsInMenu`,
торый создаст этот виджет в скрываемой панели.
* `ConditionsInMenu` также создаёт меню для других инструментов Rgrid. Подробнее об этом можно прочитать
[здесь](./docs/composite/Prefabs.md).

Работает это довольно просто. Вам всего лишь нужно добавить префаб `ConditionsInMenu`
регистрируемым префабам (и указать `url` удалённого `datastore`, если
вы хотите сохранять условия в него):
```
<script>
	require([
			'dojo/dom',
			'rgrid/Composite/RComposite',
			'rgrid/Composite/WidgetFactory',
			'rgrid/Composite/TemplateWidgetPlacer',
			'rgrid/prefabs/ConditionsInMenu',
			'rgrid/prefabs/Pagination',
			'rgrid/prefabs/Rgrid',
			'rgrid/prefabs/Search',
			'dstore/Memory',
			'dojo/text!rgrid-example/testTemplate.html'
		], function (
		dom,
		RComposite,
		WidgetFactory,
		TemplateWidgetPlacer,
		ConditionsInMenu,
		PaginationPrefab,
		RgridPrefab,
		SearchPrefab,
		Memory,
		template
		) {
		const factory = new WidgetFactory(),
			config = [
				{id: 'rgrid', gridTarget: '/my/datastore'},
				{id: 'conditionsStore', url: '/my/datastore/for/conditions'}//опциональный параметр
			],
			placer = new TemplateWidgetPlacer();
		const configStore = new Memory({data: config}),
			composite = new RComposite({
				widgetFactory: factory,
				widgetPlacer: placer,
				configStore: configStore,
				templateString: template
			}),
			prefabs = [
				new RgridPrefab(),
				new ConditionsInMenu(),
				new PaginationPrefab({startingPage: null}),
				new SearchPrefab()
			];
		composite.addComponents(prefabs);
		composite.placeAt(dom.byId('composite'));
		composite.startup();
		}
	);
</script>
<div id='composite'></div>
```
