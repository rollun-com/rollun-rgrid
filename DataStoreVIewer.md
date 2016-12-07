# DataStoreViewer

DataStoreViewer - компонент позволяющьй отображать различные удаленные dstaStore в табличном виде.  
Данный компонент дает возможность так же фильтровать данные. 

Для того что бы использовать его, вам нужно: 

1) Установить пакет dojo-rql и его зависимоти.
    
    > Установить данный пакет можно используя npm напрямую, а можно воспользоватся плагином `fxp/composer-asset-plugin`
    
    ## Установка npm зависимостей используя плагин `fxp/composer-asset-plugin`
       
    1) [Следуйте инструкции](https://github.com/avz-cmf/zaboy-dojo#%D0%A3%D1%81%D1%82%D0%B0%D0%BD%D0%BE%D0%B2%D0%B8%D1%82%D1%8C-npm-%D0%97%D0%B0%D0%B2%D0%B8%D1%81%D0%B8%D0%BC%D0%BE%D1%81%D1%82%D0%B8) 
    
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
<script>
   /*<a>FOR READ DOC - GO TO "https://github.com/avz-cmf/dojo-rql/blob/master/DataStoreVIewer.md"</a>*/
      require([
          "dojo/dom",
          "Rscript/DataStoreViewer/widget/DataStoreViewer",
      ], function (dom,
                   DataStoreViewer) {
          var dataStoreViewer = new DataStoreViewer();
          dataStoreViewer.placeAt(dom.byId('DataStoreViewer')).startup();
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

7) Вам тобразится ваше хранилище, теперь вы можете просматривать его содержимое, 
так же доступна панель фильтров с помощью которой вы можете фильтровтаь данные в хранилище.