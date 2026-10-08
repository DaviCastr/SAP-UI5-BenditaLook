sap.ui.define(["sap/ui/model/json/JSONModel", "sap/ui/util/Storage"], function (JSONModel, Storage) {
  "use strict";

  const STORAGE_KEY = "benditaLook.cart";
  const MAX_QUANTITY_PER_ITEM = 20;
  class CartModel extends JSONModel {
    storage = new Storage(Storage.Type.local);
    constructor() {
      super({
        items: [],
        count: 0,
        total: 0
      });
      this.setItems(this.storage.get(STORAGE_KEY) ?? []);
    }
    getItems() {
      return this.getProperty("/items").map(item => ({
        ...item
      }));
    }
    addItem(newItem) {
      const items = this.getItems();
      const existing = items.find(item => item.VariantId === newItem.VariantId);
      if (existing) {
        existing.Quantity = this.limitQuantity(existing.Quantity + newItem.Quantity, newItem.MaxQuantity);
        existing.MaxQuantity = newItem.MaxQuantity;
      } else {
        items.push({
          ...newItem,
          Quantity: this.limitQuantity(newItem.Quantity, newItem.MaxQuantity)
        });
      }
      this.setItems(items);
      return (existing ?? items[items.length - 1]).Quantity;
    }
    updateQuantity(variantId, quantity) {
      this.setItems(this.getItems().map(item => item.VariantId === variantId ? {
        ...item,
        Quantity: this.limitQuantity(quantity, item.MaxQuantity)
      } : item));
    }
    removeItem(variantId) {
      this.setItems(this.getItems().filter(item => item.VariantId !== variantId));
    }
    clear() {
      this.setItems([]);
    }
    limitQuantity(quantity, maxQuantity) {
      return Math.max(1, Math.min(quantity, maxQuantity, MAX_QUANTITY_PER_ITEM));
    }
    setItems(items) {
      this.setData({
        items,
        count: items.reduce((count, item) => count + item.Quantity, 0),
        total: Math.round(items.reduce((total, item) => total + item.UnitPrice * item.Quantity, 0) * 100) / 100
      });
      this.storage.put(STORAGE_KEY, items);
    }
  }
  return CartModel;
});
//# sourceMappingURL=CartModel-dbg.js.map
