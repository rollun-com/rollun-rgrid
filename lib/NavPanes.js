define([
	'dojo/_base/declare',
	'dijit/_WidgetBase',
	'dijit/TitlePane',
	'dojo/dom-construct'
], (declare,
	_WidgetBase,
	TitlePane,
	domConstruct) => {
	return declare('NavPaneMenu', [_WidgetBase], {
		_layoutConfig: null,

		/* config example:
		 	[
					{
						label: 'pane 1',
						content: [
							{
								label: 'service 1',
								uri: 'service/1/uri'
							},
							{
								label: 'service 2',
								uri: 'service/2/uri'
							},
							{
								label: 'pane for services v2',
								content: [
									{
										label: 'service v2/1',
										uri: 'service/v2/1/uri'
									},
									{
										label: 'service v2/2',
										uri: 'service/v2/2/uri'
									},
								]
							}
						]
					}
				],*/

		constructor: function (params) {
			if (Array.isArray(params.layoutConfig)) {
				this._layoutConfig = params.layoutConfig;
			} else {
				throw new Error('layoutConfig isn`t set or isn`t an array');
			}
		},

		buildRendering: function () {
			if (!this.domNode) {
				this.domNode = domConstruct.toDom('<div class="r-lsb-panes"></div>');
			}
			this.domNode.appendChild(this._parseConfigFragment(this._layoutConfig));
		},

		_parseConfigFragment: function (configFragment) {
			const resultingNode = domConstruct.create('div');
			for (const {label, content, uri} of configFragment) {
				if (uri) {
					const routeButtonNode = this._createRouteButton(uri, label);
					resultingNode.appendChild(routeButtonNode);
				} else {
					if (content) {
						const titlePane = this._createTitlePane(label, this._parseConfigFragment(content));
						titlePane.placeAt(resultingNode);
					}
					else {
						throw new Error('Invalid config fragment encountered');
					}
				}
			}
			return resultingNode;
		},
		_createRouteButton: function (route, label) {
			return domConstruct.toDom(`<a href="${route}" class="btn btn-sm" style="width: 100%">${label}</a>`);
		},

		_createTitlePane: function (label, contentNode) {
			return new TitlePane({
				title: label,
				content: contentNode,
				open: false,
			});
		}
	});
});