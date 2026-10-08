sap.ui.define([], function () {
  "use strict";

  class AdminOrderService {
    constructor(adminModel) {
      this.adminModel = adminModel;
    }
    async changeStatus(orderId, status) {
      const operation = this.adminModel.bindContext("/ChangeOrderStatus(...)");
      operation.setParameter("OrderId", orderId);
      operation.setParameter("Status", status);
      await operation.invoke();
    }
  }
  return AdminOrderService;
});
//# sourceMappingURL=AdminOrderService-dbg.js.map
