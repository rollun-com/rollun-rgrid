define(['dojo/_base/declare',
    'dijit/_WidgetBase',
    'dojo/dom-style',
    'dojo/dom-class',
    'dojo/on'],
  function (declare,
            _WidgetBase,
            domStyle,
            domClass,
            on) {
    return declare('HideablePanesMenu', [_WidgetBase], {
      _started: null,
      _panes: null,
      'class': 'p-1 bg-light border r-hideable-panes',

      constructor: function (params) {
        params = params || {};
        this._started = false;
        this._panes = [];
        if (Array.isArray(params.panes)) {
          this.addPanes(params.panes);
        }
      },

      buildRendering: function () {
        this.inherited(arguments);
        for (const pane of this._panes) {
          pane.placeAt(this.domNode);
          domStyle.set(pane.titleBarNode, {
            background: '#1e88e5',
            color: '#fff',
            'border-color': '#166fbd'
          });
          this._addHandlers(pane);
        }
      },

      startup: function () {
        this._started = true;
        this.inherited(arguments);
        for (const pane of this._panes) {
          pane.open = false;
          pane.startup();
        }
      },

      _addHandlers: function (pane) {
        on(pane.titleBarNode, 'click', (event) => {
          this._toggleAllNeighbours(pane.domNode);
        });
      },

      _toggleAllNeighbours: function (domNode) {
        let parentNode = this.domNode,
          neededNodeId = domNode.id;
        if (domNode.activated) {
          domNode.activated = false;
          domStyle.set(domNode, 'width', 'auto');
          for (const node of parentNode.children) {
            domStyle.set(node, 'display', 'block');
          }
        } else {
          domNode.activated = true;
          domStyle.set(domNode, 'width', '-webkit-fill-available');
          domStyle.set(domNode, 'width', 'available');
          for (const node of parentNode.children) {
            if (node.id !== neededNodeId) {
              domStyle.set(node, 'display', 'none');
            }
          }
        }
      },

      /**
       * @param pane {object}
       */
      addPane: function (pane) {
        if (this._started) {
          throw new Error('Can`t add new panes after start');
        }
        this._panes.push(pane);
      },

      /**
       * @param panes {array}
       */
      addPanes: function (panes) {
        for (const pane of panes) {
          this.addPane(pane);
        }
      },

      isStarted: function () {
        return this._started;
      },
    });
  });
