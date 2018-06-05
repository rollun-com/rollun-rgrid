# Rgrid
[dgrid](http://dgrid.io/) based modular grid, where components communicate through
events and RQL. Comes with decent DnD filter editor. All docs are currently only in russian.

## Быстрый старт
Установите библиотеку используя `npm`: `npm install rgrid`. Затем установите
все зависимости, выполнив команду `npm install`.

Потом создайте HTML файл на оодном уровне с папкой `node_modules` файл с именем
`rgridTestPage.html`

Для получения минимального работоспособного приложения нужно:
* Подключить загрузчик Dojo, предваритеьно зарегистрировав нужные пакеты.
Для этого добавьте в файл следующие строки:
```
<script>
var dojoConfig = {
			async: true,
			isDebug: true,
			packages: [
				{
					name: "rgrid",
					location: 'https://cdn.jsdelivr.net/npm/rgrid@0/lib'
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
					location: 'https://cdn.jsdelivr.net/npm/rollun-rql'
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
			]
		};
</script>
<script src="https://cdn.jsdelivr.net/npm/dojo@1.13.0/dojo.js"></script>
```
* Добавить CSS.Для этого добавьте в `<head>` вашего файла следующие строки:
```
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/rgrid@0/lib/css/rgrid.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/rgrid@0/themes/flat/flat.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/rgrid@0/lib/css/FilterEditor.css">
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
* Создать хранилище с данными, которое работает с [rollun-rql](https://github.com/rollun-com/rollun-rql)
Query обьектом.
    * Подробнее узнать о QueryableStore можно [тут](./docs/QueryableStore.md).
* Передать это хранилище в таблицу.
* Запустить таблицу.
Чтобы сделать вышеописанное, добавьт в файл следующее:
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
Теперь запустите тестовый сервер, выполнив `node node_modules/rgrid/example/mockServer.js`
и перейдите по адресу `localhost:8080/test`. В итоге выйдет таблица, которая
отрисовывает первые 15 записей из хранилища.

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
		(Rgrid,
		 QueryableStore,
		 Pagination,
		 dom,
		 EventScope,
		 SearchBar) => {
			const eventScope = new EventScope(),
				grid = new Rgrid({
					collection: new QueryableStore({target: 'my/datastore'}),
					class: 'dgrid-autoheight'
				}, 'grid'),
				pagination = new Pagination({domNode: dom.byId('pagination')}),
				searchBar = new SearchBar({
				});
			searchBar.placeAt(dom.byId('search'));
			eventScope.registerMultiple([grid, pagination, searchBar]);
			grid.loadContent();
		});
</script>
<div id='pagination'></div>
<div id='search'></div>
<div id='grid'></div>
```
Теперь два компонента общаются через полностью закрытую событийную среду,
которая знает о компонентах содержащихся в ней.

Подробнее о работе с Rgrid и компонентами - [тут](./docs/Rgrid.md)

## RComposite
RComposite нужен для стандартизации и облегчения работы с компонентами.

Он предоставляет общий алгоритм для создания компонентов, их настройки,
помещения в общий `EventScope` и размещения на странице.
* Конкретная логика создания и размещения делегирутеся специальным обьектам
* Обьединяет компоненты внутри с помощью общего EventScope

Подробнее о RComposite - [тут](./docs/Rcopmosite.md).



