define([
	'dojo/_base/declare',
	'dijit/_WidgetBase',
	'dojo/dom-construct',
	"dijit/MenuBar",
	"dijit/Menu",
	"dijit/MenuItem",
	"dijit/DropDownMenu",
	'dijit/MenuBarItem',
	'dijit/PopupMenuBarItem',
	"dijit/PopupMenuItem"
], (declare,
	_WidgetBase,
	domConstruct,
	MenuBar,
	Menu,
	MenuItem,
	DropDownMenu,
	MenuBarItem,
	PopupMenuBarItem,
	PopupMenuItem
) => {
	return declare('NavMenu', [_WidgetBase], {
		_layoutConfig: null,

		/* config example:
		 	[
					{
						label: 'menu 1',
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
			if (Array.isArray(params.menuConfig)) {
				this._layoutConfig = params.menuConfig;
			} else {
				throw new Error('layoutConfig isn`t set or isn`t an array');
			}
		},

		buildRendering: function () {
			if (!this.domNode) {
				this.domNode = domConstruct.create('div');
			}
			const menu = new MenuBar({style: {'color': '#fff',
			'background-color': '#343a40'}});
			this._createMenuBarFromConfig(this._layoutConfig, menu);
			menu.placeAt(this.domNode).startup();
		},

		_createMenuBarFromConfig: function (configFragment, menu) {
			for (const {label, content, uri} of configFragment) {
				if (uri) {
					const menuButton = new MenuBarItem({
						label: label,
						onClick: () => {
							window.open(uri, '_self');
						}
					});
					menu.addChild(menuButton);
				} else {
					if (content) {
						const dropDownMenuButton = this._createDropdownMenuButton(label, content);
						menu.addChild(dropDownMenuButton);
					}
					else {
						throw new Error('Invalid config fragment encountered');
					}
				}
			}
		},

		_createDropdownMenuButton: function (menuLabel, configFragment) {
			const dropdownMenu = new DropDownMenu({});
			for (const {label, content, uri} of configFragment) {
				if (uri) {
					const menuButton = new MenuItem({
						label: label,
						onClick: () => {
							window.open(uri, '_self');
						}
					});
					dropdownMenu.addChild(menuButton);
				} else {
					if (content) {//создать меню с дропдауном и добавить в него все кнопки
						const dropLeftMenu = this._createDropLeftMenu(label, content);
						dropdownMenu.addChild(dropLeftMenu);
					}
					else {
						throw new Error('Invalid config fragment encountered');
					}
				}
			}
			return new PopupMenuBarItem({
				label: menuLabel,
				popup: dropdownMenu
			});

		},

		_createDropLeftMenu: function (menuLabel, contentConfig) {
			const dropLeftMenu = new DropDownMenu({});
			for (const {label, uri} of contentConfig) {
				const menuButton = new MenuItem({
					label: label,
					onClick: () => {
						window.open(uri, '_self');
					}
				});
				dropLeftMenu.addChild(menuButton);
			}
			return new PopupMenuItem({
				label: menuLabel,
				popup: dropLeftMenu
			});
		},

	});
});