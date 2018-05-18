/**
 * Created by root on 09.08.16.
 */
/**
 * Created by root on 19.05.16.
 */
/**
 * Created by root on 19.05.16.
 */
define([
    'dojo/_base/declare',
    'dojo/dom-geometry',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/Deferred',
    'dojo/aspect',
    'dojo/dom-construct',
    'dojo/dom',
    'dojo/has',
    'dojo/on',
    'dojo/when',
    "dojox/charting/Chart",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",

    "dstore/legacy/DstoreAdapter",
    'dstore/charting/StoreSeries',
    "dojox/charting/themes/MiamiNice",
    "dojox/charting/axis2d/Default",
    "dojox/charting/plot2d/Columns",
    "dojox/charting/plot2d/Lines",
    "dojox/charting/plot2d/common",
    "dojox/charting/action2d/Tooltip",
    "dojox/charting/action2d/Highlight",
    "dojox/charting/plot2d/Markers",

    "dojox/gfx",

    "dojo/text!./templates/Chart.html"
], function (declare,
             domGeom,
             lang,
             array,
             Deferred,
             aspect,
             domConstruct,
             dom,
             has,
             on,
             when,
             Chart,
             _WidgetBase,
             _TemplatedMixin,
             DstoreAdapter,
             StoreSeries,
             MiamiNice,
             Default,
             Columns,
             Lines,
             common,
             Tooltip,
             Highlight,
             Markers,
             g,
             templates) {

    return declare([_WidgetBase, _TemplatedMixin], {
        name: "no name",

        templateString: templates,
        baseClass: "chart",
        store: null,

        width: 800,
        height: 600,


        //==========================

        title: null,
        titlePos: "top",
        titleGap: 25,
        titleFont: "normal normal normal 15pt Arial",
        titleFontColor: "orange",

        type: null,
        lines: true,
        areas: true,
        markers: true,
        //tension: "S",
        minBarSize: 10,
        maxBarSize: 500,
        gap: 0.1,


        yAxisLabel: '',
        xAxisLabel: '',
        //==========================
        rqlFilter: null,

        constructor: function (object) {
            this.inherited(arguments);
            var self = this;

            if (object !== null && object !== undefined) {
                for (var index in object) {
                    if (object.hasOwnProperty(index)) {
                        self[index] = object[index];
                    }
                }

                self.StoreSeries = declare([StoreSeries], {
                    fetch: function () {
                        // summary:
                        //		Fetches data from the store and updates a chart.
                        var collection = this.collection,
                            update = lang.hitch(this, this._update);

                        collection.fetch({queryParams: {rql: self.rqlFilter}}).then(lang.hitch(this, function (results) {
                            this.objects = results;

                            update();
                            if (collection.tracking) {
                                collection.on('add, update, delete', update);
                            }
                        }));
                    },
                });

                /*self.Chart = declare([Chart], {
                    constructor: function(/!* DOMNode *!/node, /!* __ChartCtorArgs? *!/kwArgs){
                        // summary:
                        //		The constructor for a new Chart.  Initializes all parameters used for a chart.
                        // returns: dojox/charting/Chart
                        //		The newly created chart.

                        // initialize parameters
                        if(!kwArgs){ kwArgs = {}; }
                        this.margins   = kwArgs.margins ? kwArgs.margins : {l: 10, t: 10, r: 10, b: 10};
                        this.stroke    = kwArgs.stroke;
                        this.fill      = kwArgs.fill;
                        this.delayInMs = kwArgs.delayInMs || 200;
                        this.title     = kwArgs.title;
                        this.titleGap  = kwArgs.titleGap;
                        this.titlePos  = kwArgs.titlePos;
                        this.titleFont = kwArgs.titleFont;
                        this.titleFontColor = kwArgs.titleFontColor;
                        this.chartTitle = null;
                        this.htmlLabels = true;
                        if("htmlLabels" in kwArgs){
                            this.htmlLabels = kwArgs.htmlLabels;
                        }

                        // default initialization
                        this.theme = null;
                        this.axes = {};		// map of axes
                        this.stack = [];	// stack of plotters
                        this.plots = {};	// map of plotter indices
                        this.series = [];	// stack of data runs
                        this.runs = {};		// map of data run indices
                        this.dirty = true;

                        // create a surface
                        this.node = dom.byId(node);
                        var box = domGeom.getMarginBox(node);
                        this.surface = g.createSurface(this.node, box.w || self.width, box.h || self.height);
                        if(this.surface.declaredClass.indexOf("vml") == -1){
                            // except if vml use native clipping
                            this._nativeClip = true;
                        }
                    }
                });*/
            }
        },

        autoResize: function(){
            var self = this;
            var box = domGeom.getMarginBox(self.chartNode);

            return self.chart.resize(box.w || self.width, box.h || self.height);
        },

        buildRendering: function () {
            var self = this;
            this.inherited(arguments);

            var yAxisLabel = "";

            //var words = settings.axis.yAxis.split(" ");
            var words = self.yAxisLabel.split(" ");

            for (var i = 0; i < words.length; ++i) {
                yAxisLabel += " " + words[i];
                if (i % 3 == 0) {
                    yAxisLabel += "\n";
                }
            }

            this.chart = new Chart(self.chartNode, {
                title: self.title,
                titlePos: self.titlePos,
                titleGap: self.titleGap,
                titleFont: self.titleFont,
                titleFontColor: self.titleFontColor,
            });

            self.series = new self.StoreSeries(self.store,
                function (item) {
                    //return {x: item.x, y: item.y};
                    return item.y;
                });

            this.chart.addPlot("columnsPlot", {
                type: self.type,
                lines: self.lines,
                areas: self.areas,
                markers: self.markers,
                //tension: "S",
                minBarSize: self.minBarSize,
                maxBarSize: self.maxBarSize,
                gap: self.gap,
            });

            this.chart.setTheme(MiamiNice);

            this.chart.addAxis("x", {
                majorTickStep: 1,
                minorTicks: false,
                title: "",
                titleOrientation: "away",
                labelFunc: function (index) {
                    var column = self.series.objects[index - 1].x;
                    return column;
                },
                font: "normal normal normal 10pt Arial"
            });


            this.chart.addAxis(
                "y", {
                    vertical: true,
                    min: 0,
                    title: yAxisLabel,
                    titleFont: "normal normal normal 9pt Arial"
                });

            this.chart.addSeries(
                "Series 1",
                self.series, {
                    plot: "columnsPlot",
                    stroke: {
                        color: "red",
                        width: 1
                    },
                    fill: [255, 128, 0, 0.7]
                });

            new Tooltip(this.chart, "columnsPlot", {
                text: function (chartItem) {
                    var str = "id: " + chartItem.run.source.objects[chartItem.index].id + '<br>';
                    str += self.xAxisLabel + ": " + chartItem.y + '<br>';
                    var log10Reg = new RegExp("(Логарифм по основанию 10 от цены)", "i");

                    if (log10Reg.exec(self.xAxisLabel)) {
                        var price = Math.pow(10, chartItem.run.source.objects[chartItem.index].x);
                        str += "Цена: " + price.toFixed(2);
                    } else {
                        str += self.xAxisLabel + ": " + chartItem.run.source.objects[chartItem.index].x;
                    }

                    return str;
                }
            });
            new Highlight(this.chart, "columnsPlot");

        },

        postCreate: function () {
            var self = this;
            this.inherited(arguments);

            this.own(
            )


        },

        startup: function () {
            this.inherited(arguments);

            this.chart.render();
        },
        setRqlFilter: function (filter) {
            if (filter !== null &&
                filter.name !== null &&
                filter.name !== undefined &&
                filter.filter !== null &&
                filter.filter !== undefined
            ) {
                var self = this;
                self.rqlFilter = filter.filter;
                self.series.fetch();
                self.chart.updateSeries(
                    "Series 1",
                    self.series, {
                        plot: "columnsPlot",
                        stroke: {
                            color: "red",
                            width: 1
                        },
                        fill: [255, 128, 0, 0.7]
                    }
                );
                setTimeout(function () {
                    self._setFilterBlock(filter.name);
                }, 100);
            }
        },

        _setFilterBlock: function (filterName) {
            var self = this;
            var filterNode = domConstruct.create('button', {'class': "btn btn-success filter_active"});
            on(filterNode, "click", function () {
                    self.clear();
                }
            );

            domConstruct.place("<span class='glyphicon glyphicon-remove' style='float:right;'></span><p>" + filterName + "</p>", filterNode);

            self.filterActiveNode.innerHTML = "";
            self.filterActiveNode.appendChild(filterNode);
        },

        clear: function () {
            var self = this;
            self.rqlFilter = null;
            self.series = new self.StoreSeries(self.store,
                function (item) {
                    //return {x: item.x, y: item.y};
                    return item.y;
                });
            self.chart.updateSeries(
                "Series 1",
                self.series, {
                    plot: "columnsPlot",
                    stroke: {
                        color: "red",
                        width: 1
                    },
                    fill: [255, 128, 0, 0.7]
                }
            );
            self.filterActiveNode.innerHTML = "";
        }
    });
});
