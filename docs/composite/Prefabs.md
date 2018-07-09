# Префабы
//TODO: Дописать доку по префабам
Здесь описаны все префабы библиотеки.

В процессе работы все префабы берут данные из одного хранилища с настройками
(configStore), поэтому параметры для них нужно помещать в это хранилище.

## ConditionPanel Prefab
Создаёт ConditionControlPanel. Конфиг:
```
{
 	'id': 'conditionsStoreUrl',
 	// URL REST хранилища с фильтрами. Если этого параметра не будет, то фильтры
 	// будут храниться в памяти.
 	'conditionsStoreUrl': 'my/store/with/conditions'
}
```
## Pagination Prefab
Создаёт пагинатор. Не использует параметров из configStore

## Search Prefab
Создаёт поисковую строку. Не использует параметров из configStore