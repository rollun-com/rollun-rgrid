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
        const resultingNode = domConstruct.toDom(`<div class=""><div>`);
        data.forEach((invoiceInfo) => {
          const invoiceWidget = this._createOrderWidget(invoiceInfo);
          resultingNode.appendChild(invoiceWidget.domNode);
        });
        return resultingNode;
      },

      _createOrderWidget: function (orderData) {
        const openThisOrderPane = (orderData.invoice === this._openInvoiceNumber);
        const packagesNode = domConstruct.toDom(`<div class=""></div>`);
        if (orderData.packages && orderData.packages.length > 0) {
          orderData.packages.forEach((packageInfo) => {
            const packageWidget = this._createPackageWidget(packageInfo);
            packagesNode.appendChild(packageWidget.domNode);
          });
        }
        const invoiceNode = domConstruct.toDom(`
            <div class="">
                <div>Invoice Number: ${orderData.invoice}</div>
                <div>Creation Date: ${orderData.createDate}</div>
                <div>Packages in this order:</div>
            </div>`);
        invoiceNode.appendChild(packagesNode);
        return new TitlePane({
          title: `Invoice #${orderData.invoice}`,
          content: invoiceNode,
          open: openThisOrderPane,
        });
      },

      _createPackageWidget: function (packageData) {
        let openThisPackagePane = (packageData.trackNumber === this._openPackageNumber);
        const packageItemsNode = domConstruct.toDom(`<div class=""></div>`);
        if (packageData.items && packageData.items.length > 0) {
          packageData.items.forEach((item) => {
            openThisPackagePane = (item.partNumber === this._openItemNumber);
            packageItemsNode.appendChild(this._createItemNode(item));
          });
        }
        const packageNode = domConstruct.toDom(`
            <div class="">
                <div>Track Number: ${packageData.trackNumber}</div>
                <div>Ship Date: ${packageData.shipDate}</div>
            </div>`);
        const packageItemsPane = new TitlePane({
          title: 'Items in this package',
          content: packageItemsNode,
          open: openThisPackagePane,
        });
        packageNode.appendChild(packageItemsPane.domNode);
        return new TitlePane({
          title: `Package #${packageData.trackNumber}`,
          content: packageNode,
          open: false,
        });
      },

      _createItemNode: function (itemData) {
        return domConstruct.toDom(`
            <div class="row p-1 m-1 border">
                <div class="col-md-6">
                    <div>Title: ${itemData.title}</div>
                    <div>Part Number ${itemData.partNumber}</div>
                    <div>Height: ${itemData.height}</div>
                    <div>Width: ${itemData.width}</div>
                    <div>Depth: ${itemData.depth}</div>
                    <div>Weight: ${itemData.weight}</div>
                </div>
                <div class="col-md-6">
                    <div>Picture: ${itemData.picture}</div>
                </div>
            </div>`);
      },
    });
  });
