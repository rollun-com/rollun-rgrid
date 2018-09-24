define([
	'dojo/_base/declare',
	'dojo/Deferred',
	'dojo/_base/lang',
	'dojo/when',
	'dojo/on',
], function (declare, Deferred, lang, when, on) {

	function emitError(err) {
		// called by _trackError in context of list/grid, if an error is encountered
		if (typeof err !== 'object') {
			// Ensure we actually have an error object, so we can attach a reference.
			err = new Error(err);
		}
		else if (err.dojoType === 'cancel') {
			// Don't fire dgrid-error events for errors due to canceled requests
			// (unfortunately, the Deferred instrumentation will still log them)
			return;
		}

		var event = on.emit(this.domNode, 'dgrid-error', {
			grid: this,
			error: err,
			cancelable: true,
			bubbles: true
		});
		if (event) {
			console.error(err);
		}
	}

	return declare(null, {
		dirty: null,
		_updating: null,

		constructor: function () {
			this.dirty = {};
			this._updating = {};
		},

		updateDirty: function (id, field, value) {
			// summary:
			//		Updates dirty data of a field for the item with the specified ID.
			let dirty = this.dirty,
				dirtyObj = dirty[id];

			if (!dirtyObj) {
				dirtyObj = dirty[id] = {};
			}
			dirtyObj[field] = value;
		},

		save: function () {
			// Keep track of the store and puts
			let self = this,
				store = this.collection,
				dirty = this.dirty,
				dfd = new Deferred(),
				results = {},
				getFunc = function (id) {
					// returns a function to pass as a step in the promise chain,
					// with the id variable closured
					var data;
					return (self.getBeforePut || !(data = self.row(id).data)) ?
						function () {
							return store.get(id);
						} :
						function () {
							return data;
						};
				};

			// function called within loop to generate a function for putting an item
			function putter(id, dirtyObj) {
				// Return a function handler
				return function (object) {
					let colsWithSet = self._columnsWithSet,
						updating = self._updating,
						key, data;

					if (typeof object.set === 'function') {
						object.set(dirtyObj);
					} else {
						// Copy dirty props to the original, applying setters if applicable
						for (key in dirtyObj) {
							object[key] = dirtyObj[key];
						}
					}

					// Apply any set methods in column definitions.
					// Note that while in the most common cases column.set is intended
					// to return transformed data for the key in question, it is also
					// possible to directly modify the object to be saved.
					for (key in colsWithSet) {
						data = colsWithSet[key].set(object);
						if (data !== undefined) {
							object[key] = data;
						}
					}

					updating[id] = true;
					// Put it in the store, returning the result/promise
					return store.put(object).then(function (result) {
						// Clear the item now that it's been confirmed updated
						delete dirty[id];
						delete updating[id];
						results[id] = result;
						return results;
					});
				};
			}

			let promise = dfd.then(function () {
				// Ensure empty object is returned even if nothing was dirty, for consistency
				return results;
			});

			// For every dirty item, grab the ID
			for (let id in dirty) {
				// Create put function to handle the saving of the the item
				let put = putter(id, dirty[id]);

				// Add this item onto the promise chain,
				// getting the item from the store first if desired.
				promise = promise.then(getFunc(id)).then(put);
			}

			// Kick off and return the promise representing all applicable get/put ops.
			// If the success callback is fired, all operations succeeded; otherwise,
			// save will stop at the first error it encounters.
			dfd.resolve();
			return promise;
		},

		revert: function () {
			// summary:
			//		Reverts any changes since the previous save.
			this.dirty = {};
			this.refresh();
		},

		_trackError: function (func) {
			// summary:
			//		Utility function to handle emitting of error events.
			// func: Function|String
			//		A function which performs some store operation, or a String identifying
			//		a function to be invoked (sans arguments) hitched against the instance.
			//		If sync, it can return a value, but may throw an error on failure.
			//		If async, it should return a promise, which would fire the error
			//		callback on failure.
			// tags:
			//		protected

			if (typeof func === 'string') {
				func = lang.hitch(this, func);
			}

			var self = this,
				promise;

			try {
				promise = when(func());
			} catch (err) {
				// report sync error
				var dfd = new Deferred();
				dfd.reject(err);
				promise = dfd.promise;
			}

			promise.otherwise(function (err) {
				emitError.call(self, err);
			});
			return promise;
		},
	});
});