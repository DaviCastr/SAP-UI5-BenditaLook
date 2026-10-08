sap.ui.define([], function () {
  "use strict";

  class OrderService {
    constructor(catalogModel) {
      this.catalogModel = catalogModel;
    }
    async submitOrder(contact, items) {
      const operation = this.catalogModel.bindContext("/SubmitOrder(...)");
      operation.setParameter("Order", {
        ...contact,
        Items: items.map(item => ({
          Variant_ID: item.VariantId,
          Quantity: item.Quantity
        }))
      });
      await operation.invoke();
      return operation.getBoundContext().getObject();
    }
    async trackOrder(orderNumber, accessCode) {
      const operation = this.catalogModel.bindContext("/TrackOrder(...)");
      operation.setParameter("Number", orderNumber);
      operation.setParameter("AccessCode", accessCode);
      await operation.invoke();
      return operation.getBoundContext().getObject();
    }
  }
  return OrderService;
});
//# sourceMappingURL=OrderService-dbg.js.map
