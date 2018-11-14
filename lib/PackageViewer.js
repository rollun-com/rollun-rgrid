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
      _openPackageNumber: null,
      _openItemNumber: null,

      constructor: function (params) {
        if (Array.isArray(params.data)) {
          this._data = params.data;
        } else {
          throw new Error('data isn`t set or isn`t an array');
        }
        if (params.openInvoice) {
          this._openInvoiceNumber = params.openInvoiceNumber;
        }
        if (params.openInvoiceNumber && params.openPackageNumber) {
          this._openPackageNumber = params.openPackageNumber;
        }
        if (params.openInvoiceNumber && params.openPackageNumber && params.openItemNumber) {
          this._openItemNumber = params.openItemNumber;
        }
      },

      buildRendering: function () {
        if (!this.domNode) {
          this.domNode = domConstruct.toDom('<div></div>');
        }
        this.domNode.appendChild(this._createNodesFromData(this._data));
      },

      _createNodesFromData: function (data) {
        const resultingNode = domConstruct.toDom(`<div class="" style="max-width: 700px"><div>`);
        data.forEach((invoiceInfo) => {
          const invoiceWidget = this._createOrderWidget(invoiceInfo);
          resultingNode.appendChild(invoiceWidget.domNode);
        });
        return resultingNode;
      },

      _createOrderWidget: function (orderData) {
        let openThisOrderPane = (orderData.invoice === this._openInvoiceNumber);
        let itemsNode;
        if (orderData.items && orderData.items.length > 0) {
          itemsNode = this._createItemsWithoutPackagesNode(orderData.items);
        } else {
          itemsNode = domConstruct.toDom(`<div class="">No items</div>`);
        }
        const orderNode = domConstruct.toDom(`
            <div class="p-1">
                <div>Invoice Number: ${orderData.invoice}</div>
                <div>Creation Date: ${orderData.createDate}</div>
                <div>Track Number: ${orderData.trackNumber}</div>
                <div>Ship Date: ${orderData.shipDate}</div>
            </div>`);
        orderNode.appendChild(itemsNode);
        return new TitlePane({
          title: `Invoice #${orderData.invoice}`,
          content: orderNode,
          open: openThisOrderPane,
        });
      },

      _createItemsWithoutPackagesNode: function (items) {
        let openThisItemsPane = false;
        const itemsNode = domConstruct.toDom(`<div class=""></div>`);
        items.forEach((item) => {
          openThisItemsPane = (item.partNumber === this._openItemNumber);
          itemsNode.appendChild(this._createItemNode(item));
        });
        const resultNode = domConstruct.toDom(`<div class=""></div>`);
        const itemsTitlePane = new TitlePane({
          title: 'Items in this order',
          content: itemsNode,
          open: openThisItemsPane,
        });
        return itemsTitlePane.domNode;
      },

      _createItemNode: function (itemData) {
        return domConstruct.toDom(`
            <div class="row p-1 m-1 border">
                <div class="col-md-6">
                    <div>Title: ${itemData.title}</div>
                    <div>Part Number: ${itemData.partNumber}</div>
                    <div>Height: ${itemData.height}</div>
                    <div>Width: ${itemData.width}</div>
                    <div>Depth: ${itemData.depth}</div>
                    <div>Weight: ${itemData.weight}</div>
                </div>
                <div class="col-md-6">
                    <div class="p-2">
                        <img src="${itemData.picture}">
                    </div>
                </div>
            </div>`);
      },
    });
  });
