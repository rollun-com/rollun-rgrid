define(
	[
		'dojo/_base/declare',
		'dojo/dom',
		'dojo/dom-class',
		'dojo/_base/window',
		'rgrid/Composite/RComposite',
		'rgrid/Composite/WidgetFactory',
		'rgrid/Composite/TemplateWidgetPlacer',
		'rgrid/prefabs/ConditionsInMenu',
		'rgrid/prefabs/Pagination',
		'rgrid/prefabs/Rgrid',
		'rgrid/prefabs/Search',
		'dstore/Memory',
		'dojo/text!rgrid-examples/testTemplate.html',
		'config/RgridConfig'
	], function (
		declare,
		dom,
		domClass,
		win,
		RComposite,
		WidgetFactory,
		WidgetPlacer,
		ConditionsInMenu,
		PaginationPrefab,
		RgridPrefab,
		SearchPrefab,
		Memory,
		template,
		config
	) {
		return declare(null, {
			_appParams: null,
			_startPage: null,
			_nodeId: null,
			constructor: function (params) {
				if (typeof params.configString === 'string') {
					try {
						this._appParams = JSON.parse(params.configString);
					} catch (error) {
						throw new Error('Invalid configString. Reason: ' + error.message);
					}
				} else {
					throw new Error('configString is missing or invalid');
				}
				if (params.startPage === null || typeof params.startPage === 'number' || params.startPage === 'last') {
					this._startPage = params.startPage;
				} else {
					throw new Error('startPage is missing or invalid');
				}
				if (dom.byId( params.nodeId)) {
					this._nodeId = params.nodeId;
				}else {
					throw new Error('nodeId is missing or invalid');
				}
			},
			render: function () {
				domClass.add(win.body(), 'flat');
				const factory = new WidgetFactory(),
					placer = new WidgetPlacer();
				config.push(...this._appParams);
				const configStore = new Memory({data: config}),
					composite = new RComposite({
						widgetFactory: factory,
						widgetPlacer: placer,
						configStore: configStore,
						templateString: template
					}),
					prefabs = [
						new RgridPrefab(),
						new ConditionsInMenu(),
						new PaginationPrefab({startingPage: this._startPage}),
						new SearchPrefab()
					];
				composite.addComponents(prefabs);
				composite.placeAt(dom.byId(this._nodeId));
				composite.startup();
			}
		});
	}
);
