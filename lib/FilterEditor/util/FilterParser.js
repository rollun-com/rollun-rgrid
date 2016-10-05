/**
 * Created by root on 19.05.16.
 */
define(
    [
        'dojo/_base/declare',
        "dgrid/Grid",
        'dgrid/Selection',
        'dgrid/extensions/Pagination',
        'dstore/Filter',
        "dojo/on",
        "dojo/json",
        "dojo/dom",
        'dojo/_base/array',
        '../Entity/SmartFilterNode'
    ],
    function (declare,
              Grid,
              Selection,
              Pagination,
              Filter,
              on,
              json,
              dom,
              array,
              SmartFilterNode) {

        return declare(null, {

            logic: null,

            scalar: null,

            /**
             * Create filters array of Filter object
             * @param data
             * @param id
             * @param parentID
             * @returns Filter
             */
            parse: function (data, id, parentID) {
                var self = this;

                var nodeArray = [];

                var node = new SmartFilterNode(data.type, id, parentID);

                if (self.logic.indexOf(data.type) > -1) {

                    node.name = data.args[0];
                    node.value = data.args[1];
                    node.mayHawChild = false;

                } else if (self.scalar.indexOf(data.type) > -1) {

                    var child = self.__createNodeStack(data, data.type);

                    array.forEach(child, function (item) {
                        id += 1;
                        var tempArray = self.parse(item, id, node.id);

                        array.forEach(tempArray, function (tempItem) {
                            if (id < tempItem.id) {
                                id = tempItem.id;
                            }
                        });

                        nodeArray = nodeArray.concat(tempArray);

                    }, self);

                }
                nodeArray.push(node);

                return nodeArray;
            },

            /**
             * Create stack nodes of Filter Object
             * @param filterData
             * @param type
             * @returns {Array}
             * @private
             */
            __createNodeStack: function (filterData, type) {
                var stack = [];
                var self = this;

                for (var i = 0; i < 2; i++) {
                    if (filterData.args[i].type === type) {
                        var tempArr = self.__createNodeStack(filterData.args[i], type);
                        stack = stack.concat(tempArr);
                    } else {
                        stack.push(filterData.args[i]);
                    }
                }

                return stack;
            },

            /**
             * TODO проверить работоспособность метода с болльшими цепочками
             * Create object of node stack
             * @param nodes
             * @returns {Object}
             */
            stackToObject: function (nodes) {
                var self = this;
                var root = {};
                var minID = -1;
                while (nodes.length !== 0) {
                    var node = nodes.pop();
                    if (self.scalar.indexOf(node.type) > -1) {
                        root[node.id] = node;
                        if (minID === -1) {
                            minID = node.id;
                        } else if (node.id < minID) {
                            minID = node.id;
                        }
                    }
                    if (node.parentID !== null && node.parentID !== undefined) {
                        root[node.parentID].children.push(node);
                    }else if(node.parentID === null){
                        if(root[node.id] === null || root[node.id] === undefined){
                            root[node.id] = node;
                            minID = node.id;
                        }
                    }
                }
                return root[minID];
            },

            /**
             * Create scalar Filter Object
             * @param scalarNode
             * @returns {Filter}
             * @private
             */
            __scalarFilterParser: function (scalarNode) {
                var self = this;

                if (scalarNode.children.length < 1) {
                    return null;
                }

                if (scalarNode.children.length < 2) {
                    return self.filterParse(scalarNode.children.pop());
                }

                var filter = self.__filterTypeCreate(
                    scalarNode.type,
                    self.filterParse(scalarNode.children.pop()),
                    self.filterParse(scalarNode.children.pop())
                );

                while (0 < scalarNode.children.length) {
                    var node = scalarNode.children.pop();
                    filter = self.__filterTypeCreate(scalarNode.type, filter, self.filterParse(node));
                }

                return filter;
            },

            /**
             * Create logic Filter Object
             * @param logicNode
             * @returns {Filter}
             * @private
             */
            __logicFilterParser: function (logicNode) {
                var self = this;
                return self.__filterTypeCreate(logicNode.type, logicNode.name, logicNode.value);
            },

            /**
             * Create Filter object
             * @param type
             * @param first
             * @param second
             * @private
             */
            __filterTypeCreate: function (type, first, second) {
                var filter = new Filter();
                switch (type) {
                    case "eq":
                    {
                        filter = filter.eq(first, second);
                        break;
                    }
                    case "gt":
                    {
                        filter = filter.gt(first, second);
                        break;
                    }
                    case "lt":
                    {
                        filter = filter.lt(first, second);
                        break;
                    }
                    case "gte":
                    {
                        filter = filter.gte(first, second);
                        break;
                    }
                    case "lte":
                    {
                        filter = filter.lte(first, second);
                        break;
                    }
                    case "ne":
                    {
                        filter = filter.ne(first, second);
                        break;
                    }
                    case "in":
                    {
                        filter = filter.in(first, second);
                        break;
                    }
                    case "match":
                    {
                        filter = filter.match(first, second);
                        break;
                    }
                    case "contains":
                    {
                        filter = filter.contains(first, second);
                        break;
                    }
                    case "or":
                    {
                        filter = filter.or(first, second);
                        break;
                    }
                    case "and":
                    {
                        filter = filter.and(first, second);
                        break;
                    }
                }
                return filter;
            },

            /**
             *
             * @param node
             * @returns {*|Filter}
             */
            filterParse: function (node) {
                var self = this;
                if (self.logic.indexOf(node.type) > -1) {
                    return self.__logicFilterParser(node);
                } else if (self.scalar.indexOf(node.type) > -1) {
                    return self.__scalarFilterParser(node);
                }
            },

            /**
             * get all node child
             * @param store
             * @param item
             * @returns {Array<SmartFilterNode>}
             */
            getAllChild: function (store, item) {
                var self = this;
                var node = item;
                if (store.mayHaveChildren(item)) {
                    store.getChildren(item, function (objs) {
                        objs.forEach(function (obj) {
                            obj = self.getAllChild(store, obj);
                            node.children.push(obj);
                        });
                    });
                }
                return node;
            },

            optimiseFilter: function (node, type) {
                var self = this;
                var nodes = [];

                if (self.scalar.indexOf(node.type) > -1) {
                    var children = [];
                    if(node.children.length === 1){
                        node = self.optimiseFilter(node.children[0], null);
                        node = node[0];
                    }else{
                        array.forEach(node.children, function (child) {
                            children = children.concat(self.optimiseFilter(child, node.type));
                        });
                        if (type === node.type) {
                            nodes = nodes.concat(children);
                        } else {
                            node.children = children;
                        }
                    }

                }
                nodes.push(node);

                return nodes;
            },

            constructor: function () {
                this.scalar = [
                    "and",
                    "or"
                ];
                this.logic = [
                    "eq",
                    "gt",
                    "gte",
                    "lt",
                    "lte",
                    "ne",
                    "in",
                    "match",
                    "contains"
                ];
            },

            /**
             * Create rql string with filter
             * @param node
             * @returns {string}
             */
            parseDataToRQL: function (node) {
                var self = this;
                var str = "";
                str += node.type + "(";

                if (self.logic.indexOf(node.type) > -1) {
                    str += node.name + "," + node.value;
                } else if (self.scalar.indexOf(node.type) > -1) {

                    array.forEach(node.children, function (item) {
                        str += self.parseDataToRQL(item) + ","
                    });

                    str = str.slice(0, str.length - 1);
                }
                str += ")";

                return str;
            },

            /**
             * TODO проверить работоспособность метода
             * Create filter array of rql string
             * @param rql
             * @param id
             * @param rootID
             * @returns {Array}
             */
            parseRQLToData: function (rql, id, rootID) {
                var self = this;
                var regExp = /^([^\)\,]+)\,([^\)\,]+)([\)]+)/;
                rql = rql.replace(/\)\,/g, ")(");
                var stack = rql.split('(');
                var nodes = [];
                var parentID = id;

                for (var i = 0; i < stack.length; ++i) {
                    var node = null;
                    var value = stack[i];
                    var params = regExp.exec(value);
                    if (params !== null && Array.isArray(params) && params.length > 0) {
                        node = nodes.pop();
                        node.name = params[1];
                        node.value = params[2];
                        node.mayHawChild = false;
                        nodes.push(node);
                        parentID -= params[3].length - 1;
                    } else {
                        if (i === 0) {
                            node = new SmartFilterNode(value, id, rootID);
                        } else {
                            node = new SmartFilterNode(value, id, nodes[parentID].id);
                        }
                        id += 1;
                        nodes.push(node);

                        if (self.scalar.indexOf(node.type) > -1) {
                            parentID = nodes.indexOf(node)
                        }
                    }
                }
                return nodes;
            }
        });
    });