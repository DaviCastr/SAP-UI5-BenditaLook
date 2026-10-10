sap.ui.define([], function () {
  "use strict";

  var DeliveryType = /*#__PURE__*/function (DeliveryType) {
    DeliveryType["UberFlash"] = "UBER_FLASH";
    DeliveryType["LocalCourier"] = "LOCAL_COURIER";
    return DeliveryType;
  }(DeliveryType || {});
  class AdminOrderService {
    constructor(adminModel) {
      this.adminModel = adminModel;
    }
    async changeStatus(orderId, status, delivery) {
      const operation = this.adminModel.bindContext("/ChangeOrderStatus(...)");
      operation.setParameter("OrderId", orderId);
      operation.setParameter("Status", status);
      if (delivery) {
        operation.setParameter("Delivery", delivery);
      }
      await operation.invoke();
    }
  }
  AdminOrderService.DeliveryType = DeliveryType;
  return AdminOrderService;
});
//# sourceMappingURL=AdminOrderService-dbg.js.map
