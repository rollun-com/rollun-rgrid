# DataStoreViewer

DataStoreViewer - компонент позволяющьй отображать различные удаленные dstaStore в табличном виде.  
Данный компонент дает возможность так же фильтровать данные. 

Для того что бы использовать его, вам нужно: 

1) Установить пакет dojo-rql и его зависимоти.
    
    > Установить данный пакет можно используя npm напрямую, а можно воспользоватся плагином `fxp/composer-asset-plugin`
    
    ## Установка npm зависимостей используя плагин `fxp/composer-asset-plugin`
       
    1) Следуйте инструкции 
    
    ## установка используя NPM
     
     1) Установите себе [npm](https://www.npmjs.com/)  

     2) Используя команду  `npm install dojo-rql --prefix {path/to/js/dir}`
     
     3) NPM создаст в дериктории папку с названием `node_modules` в ней будт находится все js зависимости.
     
 
2) Теперь создайет html страницу куда подключите модуль с зависимостями. 

Пример: 
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <link href="/resource/js/dojo/resources/dojo.css" rel="stylesheet">
    <link href="/resource/js/dijit/themes/claro/claro.css" rel="stylesheet">
    <link rel="stylesheet" href="/resource/js/dojox/highlight/resources/highlight.css"/>
    <link rel="stylesheet" href="/resource/js/dojox/highlight/resources/pygments/colorful.css"/>
    <link rel="stylesheet" href="/resource/js/dgrid/css/dgrid.css"/>
    <link rel="stylesheet" href="/resource/js/dgrid/css/skins/claro.css"/>
    <link rel="stylesheet" href="/resource/js/dgrid/css/skins/claro.css"/>
    <link rel="stylesheet" href="/resource/js/dojox/grid/enhanced/resources/claro/EnhancedGrid.css"/>
    <link rel="stylesheet" href="/resource/js/dojox/grid/enhanced/resources/EnhancedGrid_rtl.css"/>
    <link rel="stylesheet" href="/resource/js/dojo-rql/lib/FilterEditor/resources/css/FilterEditor.css"/>

    <link rel="stylesheet" href="/resource/js/dojo-rql/lib/DataStoreViewer/resource/bootstrap/css/bootstrap.css">
    <link rel="stylesheet" href="/resource/js/dojo-rql/lib/DataStoreViewer/resource/bootstrap/css/bootstrap-theme.css">
    <link rel="stylesheet" href="/resource/js/dojo-rql/lib/DataStoreViewer/resource/bootstrap/css/dashboard.css">

    <script src="/resource/js/dojo-rql/lib/DataStoreViewer/resource/bootstrap/js/bootstrap.js"></script>
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
</head>
<body class="claro">
<script>
    var dojoConfig = {
        async: true,
        isDebug: true,
        // This code registers the correct location of the "demo"
        // package so we can load Dojo from the CDN whilst still
        // being able to load local modules
        packages: [
            {
                name: "Rscript",
                location: '{/PATH/TO/YOU/JS/LIB/WITH/dojo-rql'
            },
            {
                name: "dstore",
                location: '/PATH/TO/YOU/JS/LIB/WITH/dojo-store'
            }
            //Add another lib path!
        ]
    };
</script>
<script src="resource/js/dojo/dojo.js"></script>

{#<button id="getUrl">Указать Url</button>#}
<div id="DataStoreViewer"></div>
{#<div id="util">
    <button id="setFilter">Созать фильтр</button>
    <button id="refresh">Перезагрузить таблицу(Очистить фильтры)</button>
</div>#}
<script>
    require([
        "dojo/dom",
        'dojo/_base/array',
        "dojo/query",
        'dojo/json',
        "Rscript/DataStoreViewer/DataStoreViewer",
        "dojo/on",
        "dojo/_base/window",
        'dojo/_base/declare',
        'dojo/_base/lang',
        "dojo/dom-style",
        "dojo/domReady!"
    ], function (dom,
                 array,
                 query,
                 json,
                 DataStoreViewer,
                 on,
                 window,
                 declare,
                 request,
                 lang,
                 Deferred,
                 domStyle) {
        var dataStoreViewer = new DataStoreViewer();
        dataStoreViewer.placeAt(dom.byId('DataStoreViewer'));
        dataStoreViewer.startup();
    })
</script>
</body>
</html>
```

> Измените участок с настройками путей к пакетам. в поля location - добавте свои пути.

```javascript
    var dojoConfig = {
        async: true,
        isDebug: true,
        // This code registers the correct location of the "demo"
        // package so we can load Dojo from the CDN whilst still
        // being able to load local modules
        packages: [
            {
                name: "Rscript",
                location: '{/PATH/TO/YOU/JS/LIB/WITH/dojo-rql'
            },
            {
                name: "dstore",
                location: '/PATH/TO/YOU/JS/LIB/WITH/dojo-store'
            },{
                name: "dgrid",
                location: '/PATH/TO/YOU/JS/LIB/WITH/dgrid'
            },{
                name: "dijit",
                location: '/PATH/TO/YOU/JS/LIB/WITH/dijit'
            },{
                name: "dojox",
                location: '/PATH/TO/YOU/JS/LIB/WITH/dojox'
            },{
                name: "promised-io",
                location: '/PATH/TO/YOU/JS/LIB/WITH/promised-io'
            },{
                name: "rql",
                location: '/PATH/TO/YOU/JS/LIB/WITH/rql'
            },
            //Add another lib path!
        ]
    };
```

4) Так же, вам нужно создать удаленное хранилище для фильтров. Для этого можете воспользоваться библиотекой zaboy-rest.
    > url: /api/v1/rest/filters по умолчанию
    
5) Запустите приложение.

6) Нажмите кнопку `Указать Url ресурса` в поле ввода введите url удаленного хранилища.