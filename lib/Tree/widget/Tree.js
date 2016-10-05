/**
 * Created by root on 19.05.16.
 */
/**
 * Created by root on 19.05.16.
 */
define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/Deferred',
    'dojo/aspect',
    'dojo/dom-construct',
    'dojo/has',
    'dojo/on',
    'dojo/when',
    "dijit",
    "dijit/Tree",
    "dijit/tree/dndSource",
], function (declare,
             lang,
             array,
             Deferred,
             aspect,
             domConstruct,
             has,
             on,
             when,
             dijit,
             Tree,
             dndSource) {

    var dndController = declare([dndSource], {
        checkItemAcceptance: function (target, source, position) {
            var item = dijit.getEnclosingWidget(target);
            item = item.item;

            return this.tree.model.mayHaveChildren(item);
        },

        itemCreator: function (nodes, target, source) {
            try {
                return this.tree.model.itemCreator(nodes, target, source);
            } catch (e) {
                return array.map(nodes, function (node) {
                    return {
                        "id": node.id,
                        "name": node.textContent || node.innerText || ""
                    };
                });
            }
        }
    });

    return declare([Tree], {
        dndController: dndController,

        postCreate: function () {
            var self = this;
            this.inherited(arguments);

            this.own(
                on(this.model, "update", lang.hitch(this, function (event) {
                    //noinspection JSPotentiallyInvalidUsageOfThis
                    this._onItemChange(event.target);

                })),
                on(this.model, "add, update", lang.hitch(this, function (event) {
                    //noinspection JSPotentiallyInvalidUsageOfThis
                    this.model.get(event.target.parentID).then(function (item) {
                        self.model.getChildren(item, function (objects) {
                            self._onItemChildrenChange(item, objects);
                        });
                    });

                })),
                on(this.model, "delete", lang.hitch(this, function (event) {
                    //noinspection JSPotentiallyInvalidUsageOfThis
                    this._onItemDelete(event.target);

                })),

                aspect.around(this.model, "newItem", lang.hitch(this.model,
                    function (originalNewItem) {
                        var self = this;
                        return function (args, /*Item*/ parent, insertIndex, /*Item*/ before) {
                            return self.add(args, {
                                parent: parent,
                                before: before
                            });
                        }
                }), true),
                aspect.around(this.model, "pasteItem", lang.hitch(this, function (originalPasteItem) {
                    var self = this;
                    return function (/*Item*/ childItem, /*Item*/ oldParentItem, /*Item*/ newParentItem,
                                     /*Boolean*/ bCopy, /*int?*/ insertIndex, /*Item*/ before) {
                        // summary:
                        //		Move or copy an item from one parent item to another.
                        //		Used in drag & drop.

                        var d = new Deferred();

                        if(oldParentItem === newParentItem && !bCopy && !before){
                            // Avoid problem when items visually disappear when dropped onto their parent.
                            // Happens because the (no-op) store.put() call doesn't generate any notification
                            // that the childItem was added/moved.
                            d.resolve(true);
                            return d;
                        }

                        if(oldParentItem && !bCopy){
                            // In order for DnD moves to work correctly, childItem needs to be orphaned from oldParentItem
                            // before being adopted by newParentItem.   That way, the TreeNode is moved rather than
                            // an additional TreeNode being created, and the old TreeNode subsequently being deleted.
                            // The latter loses information such as selection and opened/closed children TreeNodes.
                            // Unfortunately simply calling this.store.put() will send notifications in a random order, based
                            // on when the TreeNodes in question originally appeared, and not based on the drag-from
                            // TreeNode vs. the drop-onto TreeNode.

                            self.model.getChildren(oldParentItem, lang.hitch(this, function(oldParentChildren){
                                oldParentChildren = [].concat(oldParentChildren); // concat to make copy
                                var index = array.indexOf(oldParentChildren, childItem);
                                oldParentChildren.splice(index, 1);
                                self._onItemChildrenChange(oldParentItem, oldParentChildren);

                                d.resolve(self.model.put(childItem, {
                                    overwrite: true,
                                    parent: newParentItem,
                                    oldParent: oldParentItem,
                                    before: before
                                }));

                            }));
                        }else{
                            var newItem = lang.clone(childItem);
                            d.resolve(self.model.add(newItem, {
                                parent: newParentItem,
                            }));
                        }

                        return d;
                    }
                }))
                
            );
        }
    });
});
