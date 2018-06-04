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
                packages: [
                    {
                        name: 'rgrid',
                        location: '../rgrid/lib'
                    },
                    {
                        name: 'dstore',
                        location: '../dojo-dstore'
                    },
                    {
                        name: 'promised-io',
                        location: '../promised-io'
                    },
                    {
                        name: 'rql',
                        location: '../rollun-rql'
                    },
                    {
                        name: 'dgrid',
                        location: '../dgrid'
                    },
                    {
                        name: 'dijit',
                        location: '../dijit'
                    },
                    {
                        name: 'dojox',
                        location: '../dojox'
                    },
                ]
            };
</script>
<script src="node_modules/dojo/dojo.js">
```
* Создать хранилище с данными, которое работает с [rollun-rql](https://github.com/rollun-com/rollun-rql)
Query обьектом.
    * Подробнее узнать о QueryableStore можно [тут](./docs/QueryableStore.md).
* Передать это хранилище в таблицу.
* Запустить таблицу. Для этого добавьт в файл следующее:
```
<script>
require(['rgrid/Rgrid','rgrid/store/QueryableStore'], (Rgrid, queryableStore) => {
    const grid = new Rgrid({
        collection: new QueryableStore({target: 'my/datastore'})
        }, 'grid')
    grid.loadContent();
})
</script>
<div id="grid"></div>
```
Теперь запустите тестовый сервер и перейдите по адресу страницы. В итоге
выйдет таблица, которая отрисовывает первые 15 записей из хранилища.

Чтобы управлять тем, какие данные отрисовывает таблица, нужно менять обьект
Query, который она содержит.
* Выбор полей - нода select, количество строк - нода limit.
* Для фильтрациии данных добавляйте в Query дополнительные условия.
Для иллюстрации удалите из кода выше вызов функции `loadContent` и добавьте
вместо него следующие строки:
```
Query = require('rql/query').Query;
grid.appendQuery(new Query({name: 'select', args: ['id', 'name']);
grid.loadContent();
```
Этот код добавит к Query таблицы ноду `select` и загрузит содержимое согласно обновлённому Query.
В итоге таблица отрисует 15 записей с полями 'id', 'name'.

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
        'dojo/dom'],
        (Rgrid,
        QueryableStore,
        Pagination,
        dom,
        EventScope) => {
    const eventScope = new EventScope(),
        grid = new Rgrid({
            collection: new QueryableStore({target: 'my/datastore'})
         }, 'grid'),
        pagination = new Pagination({domNode: dom.byId('pagination')});
    eventScope.registerComponents([grid, pagination]);
    grid.loadContent();
</script>
<div id='pagination'></div>
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



