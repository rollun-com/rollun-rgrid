/**
 * Created by root on 07.06.16.
 */
define([
    'dojo/request',
    'dojo/_base/declare',
    'dojo/_base/array',
    'dojo/_base/lang',
    'dojo/aspect',
    'dojo/dom-construct',
    'dojo/dom-class',
    'dojo/on',
    'dojo/query',
    'dojo/string',
    'dojo/has',
    'dstore/Request',
    'dstore/Rest',
    'dojo/when',
    'dstore/QueryResults'
], function (request,
             declare,
             array,
             lang,
             aspect,
             domConstruct,
             domClass,
             on,
             query,
             string,
             has,
             Request,
             Rest,
             when,
             QueryResults) {
    var push = [].push;

    return declare(Rest, {

        //реализщация базоый рйл в случае если подключать к шерокому сторе узкий элемент
        //наложение фильтров на дата строе будет происходить через виджет датасторе
        //реализовать перебрасывание филтра в чарт

        rqlFilter: null,
        fetchRange: function (kwArgs) {
            var start = kwArgs.start,
                end = kwArgs.end,
                requestArgs = {};
            requestArgs.queryParams = kwArgs.queryParams;
            if (this.useRangeHeaders) {
                requestArgs.headers = lang.mixin(this._renderRangeHeaders(start, end), kwArgs.headers);
            } else {
                requestArgs.queryParams.requestParams = this._renderRangeParams(start, end);
                if (kwArgs.headers) {
                    requestArgs.headers = kwArgs.headers;
                }
            }

            var results = this._request(requestArgs);
            return new QueryResults(results.data, {
                totalLength: results.total,
                response: results.response
            });
        },

        unionQuery: function (rqlQuery, queryParams) {
            var selectRegx = /(^select\([\w\W]+\))/,
                limitRegx = /(^limit\(([0-9]+)\,?([0-9]+)?\))/,
                sortRegx = /(^sort\([\w\W]+\))/;

            if (queryParams && Array.isArray(queryParams), queryParams.length > 0) {
                array.forEach(queryParams, function (item) {
                    if (item.match(selectRegx)) {
                        //rqlQuery.select = item;

                    } else if (item.match(limitRegx)) {
                        var limitQueryArr = item.match(limitRegx);
                        //todo переписать слияние ноды limit()
                        if (rqlQuery.limit !== undefined &&
                            rqlQuery.limit !== null) {

                            var limitRqlArr = item.match(rqlQuery.limit);

                            var limit, offset;

                            var limitQuery = limitQueryArr[2];
                            if (limitQueryArr[3] !== undefined) {
                                var offsetQuery = limitQueryArr[3];
                            }

                            if (limitRqlArr) {
                                var limitRql = limitRqlArr[2];
                                limit = limitRql < limitQuery ? limitRql : limitQuery;
                                if (limitRqlArr[3] !== undefined) {
                                    var offsetRql = limitRqlArr[3];
                                    offset = offsetRql + offsetQuery;
                                }

                            } else {
                                limit = limitQuery;
                                if (offsetQuery !== undefined) {
                                    offset = offsetQuery;
                                }
                            }
                            if (offset !== undefined) {
                                rqlQuery.limit = "limit(" + limit + "," + offset + ")";
                            } else {
                                rqlQuery.limit = "limit(" + limit + ")";
                            }
                        } else {
                            if (limitQueryArr[3] !== undefined) {
                                rqlQuery.limit = "limit(" + limitQueryArr[2] + "," + limitQueryArr[3] + ")";
                            } else {
                                rqlQuery.limit = "limit(" + limitQueryArr[2] + ")";
                            }
                        }

                    } else if (item.match(sortRegx)) {
                        //rqlQuery.sort = item;
                    } else {
                        if (rqlQuery.query !== undefined &&
                            rqlQuery.query !== null) {
                            rqlQuery.query = 'and(' + rqlQuery.query + ',' + item + ")";
                        }
                    }
                });

            }
            return rqlQuery;
        },
        //todo написать отправку в заголовке запроса rql строку без ноды limit
        _renderUrl: function (kwArgs) {
            var self = this;
            var queryParams = this._renderQueryParams(),
                requestUrl = this.target;

            var selectRegx = /(^select\([\w\W]+\))/,
                limitRegx = /(^limit\(([0-9]+)\,?([0-9]+)?\))/,
                sortRegx = /(^sort\([\w\W]+\))/;

            var rqlQuery = {
                initState: false,
                length: 0,
                init: function (initArray) {
                    var self = this;
                    array.forEach(initArray, function (item) {
                        if (item.match(selectRegx)) {
                            self.select = item;
                            self.length += 1;

                        } else if (item.match(limitRegx)) {
                            self.limit = item;
                            self.length += 1;

                        } else if (item.match(sortRegx)) {
                            self.sort = item;
                            self.length += 1;

                        } else {
                            self.query = item;
                            self.length += 1;
                        }
                    });
                    self.initState = true;
                },
                join: function (separator) {
                    var str = '';
                    /* var str =  rqlQuery.query + separator +
                     rqlQuery.limit + separator +
                     rqlQuery.sort + separator +
                     rqlQuery.select + separator;*/
                    //todo переделать под цикл
                    if (rqlQuery.query !== null &&
                        rqlQuery.query !== undefined) {
                        str += rqlQuery.query + separator;
                    }

                    if (rqlQuery.limit !== null &&
                        rqlQuery.limit !== undefined) {
                        str += rqlQuery.limit + separator;
                    }

                    if (rqlQuery.sort !== null &&
                        rqlQuery.sort !== undefined) {
                        str += rqlQuery.sort + separator;
                    }

                    if (rqlQuery.select !== null &&
                        rqlQuery.select !== undefined) {
                        str += rqlQuery.select + separator;
                    }
                    str = str.slice(0, str.length - 1);
                    return str;

                }
            };


            if (self.rqlFilter !== null && self.rqlFilter !== undefined) {
                tempArr = self.rqlFilter.split("&");

                if (!rqlQuery.initState) {
                    rqlQuery.init(tempArr);
                } else {
                    rqlQuery = self.unionQuery(rqlQuery, tempArr);
                }
            }

            if (kwArgs !== null && kwArgs !== undefined) {
                if (kwArgs.requestParams) {
                    push.apply(queryParams, kwArgs.requestParams);
                }

                if (kwArgs.rql !== null && kwArgs.rql !== undefined) {
                    var tempArr = kwArgs.rql.split("&");

                    if (!rqlQuery.initState) {
                        rqlQuery.init(tempArr);
                    } else {
                        rqlQuery = self.unionQuery(rqlQuery, tempArr);
                    }

                    rqlQuery = self.unionQuery(rqlQuery, queryParams);
                } else {
                    if (!rqlQuery.initState) {
                        rqlQuery.init(queryParams);
                    } else {
                        rqlQuery = self.unionQuery(rqlQuery, queryParams);
                    }
                }
            }

            if (!rqlQuery.initState) {
                rqlQuery.init(queryParams);
            } else {
                rqlQuery = self.unionQuery(rqlQuery, queryParams);
            }

            if (rqlQuery.length > 0) {
                requestUrl += (this._targetContainsQueryString ? '&' : '?') + rqlQuery.join('&');
            }

            return requestUrl;
        },

        _request: function (kwArgs) {

            var self = this;

            kwArgs = kwArgs || {};

            // perform the actual query
            var headers = lang.delegate(this.headers, {Accept: this.accepts});

            if ('headers' in kwArgs) {
                lang.mixin(headers, kwArgs.headers);
            }

            var requestUrl = self._renderUrl(kwArgs.queryParams);

            var response = request(requestUrl, {
                method: 'GET',
                headers: headers
            });
            var collection = this;
            var parsedResponse = response.then(function (response) {
                return collection.parse(response);
            });

            this.emit("data-received", {parsedResponse: parsedResponse});

            return {
                data: parsedResponse.then(function (data) {
                    // support items in the results
                    var results = data.items || data;
                    for (var i = 0, l = results.length; i < l; i++) {
                        results[i] = collection._restore(results[i], true);
                    }
                    return results;
                }),
                total: parsedResponse.then(function (data) {
                    // check for a total property
                    var total = data.total;
                    if (total > -1) {
                        // if we have a valid positive number from the data,
                        // we can use that
                        return total;
                    }
                    // else use headers
                    return response.response.then(function (response) {
                        var range = response.getHeader('Content-Range');
                        return range && (range = range.match(/\/(.*)/)) && +range[1];
                    });
                }),
                response: response.response
            };
        },

        setRqlFilter: function (filter) {
            this.rqlFilter = filter
        }

    });
});