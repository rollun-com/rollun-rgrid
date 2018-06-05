# RComposite
## Коротко о главном
Каркас, созданный для облегчения регистрации, создания и размещения компонентов

Определяет общий рабочий процесс. Конкретная логика создания и размещения
делегирутеся специальным обьектам.

Обьединяет компоненты внутри с помощью общего EventScope

Зависимости:
* Фабрика компонентов - инкапсулирует логику получения компонентов из префабов
* Размещатель компонентов - инкапсулирует логику размещения визуальных компонентов
* Хранилище настроек - хранит все контекстнозависимые настройки, нужные
для создания виджетов
* ДОМ нода - будет содержать результат работы композита в виде ДОМ дерева

Каждый компонент регистрируется в виде префаба.
* Префаб - фабрика, инкапсулирующая создание компонента
* Созданный компонент может быть композитом, который содержит компоненты

После запуска композит передаёт префабы и локальные настройки в фабрику.
Она сделает из этого виджеты.
* Фабрика передаст в префаб локальные настройки и общий EventScope
* Общий EventScope обьединяет все компоненты которые находятся на одном уровне в композите
* Компоненты компонентов будут иметь свой EventScope, но передать во все
композиты один EventScope можно

Потом композит передаёт виджеты размещателю, который размещает их на фрагменте
документа. Когда были созданы и размещены все виджеты, композит возьмёт у
размещателя итоговый фрагмент и добавит его в содержимое своей ДОМ ноды.

Пример использования  приведён ниже. Этот фрагмент кода собирает rgrid c
пагинацией, поисковой строкой и панелью условий, и размещает их согласно шаблону из
testTemplate.html:
```require(
           [
               'dojo/dom',
               'rgrid/Composite/RComposite',
               'rgrid/Composite/WidgetFactory',
               'rgrid/Composite/TemplateWidgetPlacer',
               'rgrid/prefabs/ConditionPanel',
               'rgrid/prefabs/Pagination',
               'rgrid/prefabs/Rgrid',
               'rgrid/prefabs/Search',
               'dstore/Memory',
               'dojo/text!rgrid/testTemplate.html'
           ], function (
               dom,
               RComposite,
               WidgetCreator,
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
               configStore = new Memory({data: [{id: 'gridTarget', url: '/my/datastore'}]}),
               composite = new RComposite({
                   widgetFactory: factory,
                   widgetPlacer: placer,
                   configStore: configStore,
                   templateString: template
               }),
               composite.addComponents([new RgridPrefab(),
                                        new ConditionPanelPrefab(),
                                        new PaginationPrefab(),
                                        new SearchPrefab()]);
               composite.placeAt(dom.byId('composite'));
               composite.startup();
           }
   );
```
Содержимое файла `testTemplate.html` приведено ниже:
```
<div>
    <div data-dojo-attach-point="filters"></div>
    <div style="display: flex; justify-content: space-between;">
        <span data-dojo-attach-point="pagination"></span>
        <span data-dojo-attach-point="search"></span>
    </div>
    <div data-dojo-attach-point="rgrid-grid"></div>
</div>
```


## Описание API
### RComposite
##### Зависимости
Конструктор принимает обьект со следующими параметрами:
* configStore: object - dstore/Store-совместимое хранилище. Хранит локальные
настройки.
Будет использовано фабрикой виджетов для иньецироваия настроек в виджеты.
* widgetFactory: object - rgrid/WidgetFactory или другой совместимый обьект.
Обрабатывает префабы, передаёт им хранилище настроек, помещает результаты работы
префабов в общий EventScope
* widgetPlacer: object - rgrid/WidgetPlacer или другой совместимый обьект.
Размещает виджеты в документе
* eventScope?: object - rgrid/EventScope или другой совместимый обьект.
Обьединяет компоненты одной событийной средой
* templateString?: string - строка с шаблоном. Инструкция, по которой widgetPlacer
разместит компоненты.
