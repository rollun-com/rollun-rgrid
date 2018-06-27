define([
		'dojo/_base/declare',
		'dojo/on',
		'dojo/dom-construct',
		'dojo/_base/lang',
		'dijit/_WidgetBase',
		'dojo/query',
		'dojo/dom-class',
		'dojo/when',
		'rql/query',
		'rgrid/mixins/_EventDriven'
	],
	function (declare,
			  on,
			  domConstruct,
			  lang,
			  _WidgetBase,
			  query,
			  domClass,
			  when,
			  Query,
			  _EventDriven) {
		return declare("Pagination", [_WidgetBase, _EventDriven], {
			pagingTextBox: true,
			previousNextArrows: true,
			firstLastArrows: true,
			pagingLinks: 2,
			pageSizeOptions: [20, 50, 100, 200, 500, 1000],
			_currentPage: 1,
			rowsPerPage: 20,
			class: 'items-right-aligned',

			constructor: function (params) {
				this.inherited(arguments);
				if (params) {
					if (typeof params.domNode === 'object') {
						this.domNode = params.domNode;
					}
					if (params.startingPage === 'last' || typeof parseInt(params.startingPage) === 'number') {
						this._startingPage = params.startingPage;
					}
				}
			},

			buildRendering: function () {
				const paginationNode = this.paginationNode = domConstruct.create('div', {className: 'dgrid-pagination'}, this.domNode),
					statusNode = this.paginationStatusNode = domConstruct.create('div', {className: 'dgrid-status'}, paginationNode);
				let navigationNode,
					node;
				statusNode.tabIndex = 0;
				this._paginationSizeSelect = domConstruct.create('select', {
					className: 'dgrid-page-size'
				}, this.paginationNode);
				// Initialize UI based on pageSizeOptions and rowsPerPage
				this._updatePaginationSizeSelect();
				this._updateRowsPerPageOption();

				navigationNode = this.paginationNavigationNode =
					domConstruct.create('div', {className: 'dgrid-navigation'}, paginationNode);

				if (this.firstLastArrows) {
					// create a first-page link
					node = this.paginationFirstNode = domConstruct.create('span', {
						className: 'dgrid-page-link dgrid-first',
						innerHTML: '<i class="fa fa-angle-double-left"></i>',
						tabIndex: 0
					}, navigationNode);
				}
				if (this.previousNextArrows) {
					// create a previous link
					node = this.paginationPreviousNode = domConstruct.create('span', {
						className: 'dgrid-page-link dgrid-previous',
						innerHTML: '<i class="fa fa-angle-left"></i>',
						tabIndex: 0
					}, navigationNode);
				}
				this.paginationLinksNode = domConstruct.create('span', {
					className: 'dgrid-pagination-links'
				}, navigationNode);
				if (this.previousNextArrows) {
					// create a next link
					node = this.paginationNextNode = domConstruct.create('span', {
						className: 'dgrid-page-link dgrid-next',
						innerHTML: '<i class="fa fa-angle-right"></i>',
						tabIndex: 0
					}, navigationNode);
				}
				if (this.firstLastArrows) {
					// create a last-page link
					node = this.paginationLastNode = domConstruct.create('span', {
						className: 'dgrid-page-link dgrid-last',
						innerHTML: '<i class="fa fa-angle-double-right"></i>',
						tabIndex: 0
					}, navigationNode);
				}
			},

			_updatePaginationSizeSelect: function () {
				var pageSizeOptions = this.pageSizeOptions,
					paginationSizeSelect = this._paginationSizeSelect;
				if (pageSizeOptions && pageSizeOptions.length) {
					paginationSizeSelect.options.length = 0;
					for (var i = 0; i < pageSizeOptions.length; i++) {
						domConstruct.create('option', {
							innerHTML: pageSizeOptions[i],
							selected: this.rowsPerPage === pageSizeOptions[i],
							value: pageSizeOptions[i]
						}, paginationSizeSelect);
					}
					this._updateRowsPerPageOption();
				}
				else if (!(pageSizeOptions && pageSizeOptions.length) && paginationSizeSelect) {
					domConstruct.destroy(paginationSizeSelect);
					this._paginationSizeSelect = null;
					this._paginationSizeChangeHandle.remove();
				}
			},

			_updateRowsPerPageOption: function () {
				var rowsPerPage = this.rowsPerPage,
					pageSizeOptions = this.pageSizeOptions,
					paginationSizeSelect = this.paginationSizeSelect;
				if (paginationSizeSelect) {
					if (arrayUtil.indexOf(pageSizeOptions, rowsPerPage) < 0) {
						this._setPageSizeOptions(pageSizeOptions.concat([rowsPerPage]));
					}
					else {
						paginationSizeSelect.value = '' + rowsPerPage;
					}
				}
			},

			/**
			 * @param total {number}
			 * @private
			 */
			_updatePaginationStatus: function (total) {
				var count = this.rowsPerPage,
					start = Math.min(total, (this._currentPage - 1) * count + 1);
				this.paginationStatusNode.innerHTML =
					`Показаны записи  ${start}-${Math.min(total, (start + count - 1))} из ${total}`;
			},

			postCreate: function () {
				const pagination = this;
				this._paginationSizeChangeHandle = on(pagination._paginationSizeSelect, 'change', lang.hitch(this, function () {
					this.set('rowsPerPage', +this._paginationSizeSelect.value);
					this.gotoPage(1);
				}));
				on(this.paginationNavigationNode, '.dgrid-page-link:click,.dgrid-page-link:keydown', function (event) {
					// For keyboard events, only respond to enter
					if (event.type === 'keydown' && event.keyCode !== 13) {
						return;
					}
					const cls = this.className;
					if (pagination._isLoading || cls.indexOf('dgrid-page-disabled') > -1) {
						return;
					}
					let curr = pagination._currentPage,
						max = Math.ceil(pagination._total / pagination._rowsPerPage);

					// determine navigation target based on clicked link's class
					if (this === pagination.paginationPreviousNode) {
						pagination.gotoPage(curr - 1);
					}
					else if (this === pagination.paginationNextNode) {
						pagination.gotoPage(curr + 1);
					}
					else if (this === pagination.paginationFirstNode) {
						pagination.gotoPage(1);
					}
					else if (this === pagination.paginationLastNode) {
						pagination.gotoPage(max);
					}
					else if (cls === 'dgrid-page-link') {
						pagination.gotoPage(+this.innerHTML); // the innerHTML has the page number
					}
				});
				this.handleEvent('gridLoadedContent', (event) => {
					this._updatePaginationStatus(event.totalCount);
					this._updateNavigation(event.totalCount);
					if (!this._didStartPage && this._startingPage) {
						this._didStartPage = true;
						if (this._startingPage === 'last') {
							this.gotoPage(Math.ceil(event.totalCount / this.rowsPerPage));
						} else {
							this.gotoPage(this._startingPage);
						}

					}
				});
				this._requestStatusUpdate();
			},

			reconfigure: function () {
				this._requestStatusUpdate();
			},

			_requestStatusUpdate: function () {
				this.handleEventOnce('gridTotalCount', (event) => {
					this._updatePaginationStatus(event.totalCount);
					this._updateNavigation(event.totalCount);
				});
				this.emit('getGridTotalCount');
			},

			/**
			 * @param total {integer}
			 * @private
			 */
			_updateNavigation: function (total) {
				var grid = this,
					linksNode = this.paginationLinksNode,
					currentPage = this._currentPage,
					pagingLinks = this.pagingLinks,
					paginationNavigationNode = this.paginationNavigationNode,
					end = Math.ceil(total / this.rowsPerPage),
					pagingTextBoxHandle = this._pagingTextBoxHandle,
					focused = document.activeElement,
					focusedPage,
					lastFocusablePageLink,
					focusableNodes;

				function pageLink(page, addSpace) {
					let link,
						disabled;
					if (grid.pagingTextBox && page === currentPage && end > 1) {
						// use a paging text box if enabled instead of just a number
						link = domConstruct.create('input', {
							className: 'dgrid-page-input',
							type: 'text',
							value: currentPage
						}, linksNode);
						grid._pagingTextBoxHandle = on(link, 'change', function () {
							var value = +this.value;
							if (!isNaN(value) && value > 0 && value <= end) {
								grid.gotoPage(+this.value);
							}
						});
						if (focused && focused.tagName === 'INPUT') {
							link.focus();
						}
					}
					else {
						// normal link
						disabled = page === currentPage;
						link = domConstruct.create('span', {
							className: 'dgrid-page-link' + (disabled ? ' dgrid-page-disabled' : ''),
							innerHTML: page + (addSpace ? ' ' : ''),
							tabIndex: disabled ? -1 : 0
						}, linksNode);

						// Try to restore focus if applicable;
						// if we need to but can't, try on the previous or next page,
						// depending on whether we're at the end
						if (focusedPage === page) {
							if (!disabled) {
								link.focus();
							}
							else if (page < end) {
								focusedPage++;
							}
							else {
								lastFocusablePageLink.focus();
							}
						}

						if (!disabled) {
							lastFocusablePageLink = link;
						}
					}
				}

				function setDisabled(link, disabled) {
					domClass.toggle(link, 'dgrid-page-disabled', disabled);
					link.tabIndex = disabled ? -1 : 0;
				}

				function addSkipNode() {
					// Adds visual indication of skipped page numbers in navigation area
					domConstruct.create('span', {
						className: 'dgrid-page-skip',
						innerHTML: '...'
					}, linksNode);
				}

				if (!focused || !this.paginationNavigationNode.contains(focused)) {
					focused = null;
				}
				else if (focused.className === 'dgrid-page-link') {
					focusedPage = +focused.innerHTML;
				}

				if (pagingTextBoxHandle) {
					pagingTextBoxHandle.remove();
				}
				linksNode.innerHTML = '';
				query('.dgrid-first, .dgrid-previous', paginationNavigationNode).forEach(function (link) {
					setDisabled(link, currentPage === 1);
				});
				query('.dgrid-last, .dgrid-next', paginationNavigationNode).forEach(function (link) {
					setDisabled(link, currentPage >= end);
				});
				if (pagingLinks && end > 0) {
					// always include the first page (back to the beginning)
					pageLink(1, true);
					var start = currentPage - pagingLinks;
					if (start > 2) {
						addSkipNode();
					}
					else {
						start = 2;
					}
					// now iterate through all the page links we should show
					for (var i = start; i < Math.min(currentPage + pagingLinks + 1, end); i++) {
						pageLink(i, true);
					}
					if (currentPage + pagingLinks + 1 < end) {
						addSkipNode();
					}
					// last link
					if (end > 1) {
						pageLink(end);
					}
				}
				else if (grid.pagingTextBox) {
					pageLink(currentPage);
				}
				if (focused && focused.tabIndex === -1) {
					// One of the first/last or prev/next links was focused but
					// is now disabled, so find something focusable
					focusableNodes = query('[tabindex="0"]', this.paginationNavigationNode);
					if (focused === this.paginationPreviousNode || focused === this.paginationFirstNode) {
						focused = focusableNodes[0];
					}
					else if (focusableNodes.length) {
						focused = focusableNodes[focusableNodes.length - 1];
					}
					if (focused) {
						focused.focus();
					}
				}
			},

			/**
			 * @param pageNumber {number}
			 */
			gotoPage: function (pageNumber) {
				this.set('_currentPage', pageNumber);
				const limit = this.rowsPerPage,
					offset = parseInt((pageNumber - 1) * limit),
					limitNode = new Query.Query({
						name: 'limit',
						args: [limit, offset]
					});
				this.emit('appendQuery', {query: limitNode});
				this.emit('loadGridContent');
			},
		});
	});