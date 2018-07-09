# Rgrid
### Алгоритм работы appendQuery()
Алгоритм заменяет ноды select, sort, limit новыми нодами с такими же именами, если они есть.
После он удаляет все ноды, кроме выше упомянутых ( ноды 'eq', 'contains', ...)
и добавляет новые условия

### Типы событий, с которыми работает Rgrid, и реакция на них
* `setQuery` - заменить Query таблицы значением свойства `query` из обьекта события.
* `getQuery` - выпустить событие типа `gridQuery`, которое содержит копию
текущего Query таблицы в свойстве `query`.
* `gridQuery` - нет реакции.
* `appendQuery` - дополнить Query таблицы значением свойства `query` из обьекта
запроса (см. `appendQuery()`).
* `loadGridContent` - загрузить новое содержимое таблицы согласно Query.
* `loadGridContentForQuery` - идентично `appendQuery` + `loadGridContent`.
* `getGridTotalCount` - выпускает событие `gridTotalCount`, которое в свойстве
`count` содержит количество записей, которые может отрисовать таблица
* `gridTotalCount` - нет реакции.
* `getGridColumns` - выпускает событие `gridColumns`. Событие содержит свойство `columns`, в котором лежит массив обьектов,
описвающих колонки (`column definition objects` из dgrid)
* `gridColumns` - нет реакции.