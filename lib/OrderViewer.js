define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/TitlePane',
    'dojo/dom-construct'],
  function (declare,
            WidgetBase,
            TitlePane,
            domConstruct) {
    return declare([WidgetBase], {
      _data: null,
      _openInvoiceNumber: null,
      _openPartNumber: null,
      _openAllOrders: null,
      _itemNodeRenderer: null,
      _orderNodeRenderer: null,

      constructor: function (params) {
        if (Array.isArray(params.data)) {
          this._data = params.data;
        } else {
          throw new Error('"data" isn`t set or isn`t an array');
        }
        if (params.openInvoiceNumber) {
          this._openInvoiceNumber = params.openInvoiceNumber;
        }
        if (params.openInvoiceNumber && params.openPartNumber) {
          this._openPartNumber = params.openPartNumber;
        }
        if (params.openAllOrders) {
          this._openAllOrders = params.openAllOrders;
        }
        if (params.itemRenderer) {
          this._itemNodeRenderer = params.itemRenderer;
        }
        if (params.orderRenderer) {
          this._orderNodeRenderer = params.orderRenderer;
        }
      },

      buildRendering: function () {
        if (!this.domNode) {
          this.domNode = domConstruct.toDom('<div></div>');
        }
        this.domNode.appendChild(this._createNodesFromData(this._data));
      },

      _createNodesFromData: function (data) {
        const resultingNode = domConstruct.toDom(`<div class="orders-container" style="max-width: 700px"><div>`);
        data.forEach((invoiceInfo) => {
          const invoiceNode = this._createOrderNode(invoiceInfo);
          resultingNode.appendChild(invoiceNode);
        });
        return resultingNode;
      },

      _createOrderNode: function (orderData) {
        let orderNode;
        if (this._orderNodeRenderer) { // if order renderer is present, use it
          orderNode = this._orderNodeRenderer(orderData, this._itemNodeRenderer);
        } else {
          let openThisOrderPane = (orderData.invoice === this._openInvoiceNumber);
          let itemsNode;
          if (orderData.items && orderData.items.length > 0) {
            itemsNode = this._createItemsWithoutPackagesNode(orderData.items);
          } else {
            itemsNode = domConstruct.toDom(`<div class="">No items</div>`);
          }
          const orderContsntsNode = domConstruct.toDom(`
            <div class="p-1 order">
                <div>Invoice Number: ${orderData.invoice}</div>
                <div>Track Numbers: ${orderData.track_numbers}</div>
            </div>`);
          orderContsntsNode.appendChild(itemsNode);
          if (this._openAllOrders) {
            openThisOrderPane = true;
          }
          const orderWidget = new TitlePane({
            title: `Order #${orderData.invoice} / Track Numbers: ${orderData.track_numbers}`,
            content: orderContsntsNode,
            open: openThisOrderPane,
          });
          orderNode = orderWidget.domNode;
        }
        return orderNode;
      },

      _createItemsWithoutPackagesNode: function (items) {
        let openThisItemsPane = false;
        const itemsNode = domConstruct.toDom(`<div class="order-items"></div>`);
        items.forEach((item) => {
          if (!openThisItemsPane) {// if item that is needed  was not found yet
            openThisItemsPane = (item.part_number === this._openPartNumber);
          }
          itemsNode.appendChild(this._createItemNode(item));
        });
        const itemsTitlePane = new TitlePane({
          title: `Items in this order: ${items.length}`,
          content: itemsNode,
          open: openThisItemsPane,
        });
        return itemsTitlePane.domNode;
      },

      _createItemNode: function (itemData) {
        let resultNode;
        if (this._itemNodeRenderer) {
          resultNode = this._itemNodeRenderer(itemData); // if item renderer is present, use it
        } else {
          const shortDetailsNode = domConstruct.toDom(`
            <div class="pb-1 d-flex flex-row">
                <div class="mr-2">Part Number: ${itemData.part_number}</div>
                <div>QTY: ${itemData.quantity}</div>
            </div>`);
          const moreDetailsNode = domConstruct.toDom(`
            <div class="row p-1">
                <div class="col-md-6">
                    <div>Title: ${itemData.title}</div>
                    <div>Part Number: ${itemData.part_number}</div>
                    <div>Height: ${itemData.height}</div>
                    <div>Width: ${itemData.width}</div>
                    <div>Quantity: ${itemData.quantity}</div>
                    <div>Depth: ${itemData.depth}</div>
                    <div>Weight: ${itemData.weight}</div>
                </div>
                <div class="col-md-6">
                    <div class="p-2">
                        <img src="${itemData.picture}">
                    </div>
                </div>
            </div>`);
          const moreDetailsPane = new TitlePane({
            title: 'Details',
            open: false,
            content: moreDetailsNode,
          });
          resultNode = domConstruct.toDom(`<div class="item-info-card border p-1 mb-1"></div>`);
          resultNode.appendChild(shortDetailsNode);
          resultNode.appendChild(moreDetailsPane.domNode);
        }
        return resultNode;
      },
    });
  });
