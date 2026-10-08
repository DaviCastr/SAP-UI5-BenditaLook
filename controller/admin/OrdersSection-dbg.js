sap.ui.define(["sap/ui/core/Fragment", "sap/ui/model/Filter", "sap/ui/model/FilterOperator", "../../service/AdminOrderService", "../../model/formatter"], function (Fragment, Filter, FilterOperator, __AdminOrderService, __formatter) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const AdminOrderService = _interopRequireDefault(__AdminOrderService);
  const formatter = _interopRequireDefault(__formatter);
  const OrderStatus = __formatter["OrderStatus"];
  const ALL_STATUSES = "ALL";
  class OrdersSection {
    constructor(controller) {
      this.controller = controller;
    }
    onStatusFilter = event => {
      const status = event.getParameter("item")?.getKey() ?? ALL_STATUSES;
      const filters = status === ALL_STATUSES ? [] : [new Filter("Status", FilterOperator.EQ, status)];
      this.getTableBinding().filter(filters);
    };
    onRefresh = () => {
      this.getTableBinding().refresh();
    };
    onOrderPress = async event => {
      const context = event.getSource().getBindingContext();
      const dialog = await this.getDialog();
      dialog.bindElement({
        path: context.getPath(),
        parameters: {
          $expand: "Items"
        }
      });
      dialog.open();
    };
    onCloseDialog = () => {
      this.dialog?.close();
    };
    onStartService = () => this.changeStatus(OrderStatus.InService, "orderStatusChanged");
    onComplete = () => this.changeStatus(OrderStatus.Completed, "orderStatusChanged");
    onCancel = async () => {
      if (await this.controller.confirm("confirmCancelOrder", [this.getDialogOrder().Number])) {
        await this.changeStatus(OrderStatus.Cancelled, "orderCancelled");
      }
    };
    onWhatsapp = () => {
      const order = this.getDialogOrder();
      const message = this.controller.getText("whatsappCustomerMessage", [order.CustomerName, order.Number]);
      window.open(formatter.whatsappUrl(order.CustomerPhone, message), "_blank");
    };
    async changeStatus(status, successKey) {
      const order = this.getDialogOrder();
      try {
        await this.controller.runBusy(() => new AdminOrderService(this.controller.getAdminModel()).changeStatus(order.ID, status));
        this.controller.showToast(successKey, [order.Number]);
        this.dialog?.getElementBinding()?.refresh();
        this.getTableBinding().refresh();
      } catch (error) {
        this.controller.handleError(error, "orderStatusError");
      }
    }
    getDialogOrder() {
      return this.dialog?.getBindingContext()?.getObject();
    }
    getTableBinding() {
      return this.controller.byControlId("ordersTable").getBinding("items");
    }
    async getDialog() {
      if (!this.dialog) {
        const view = this.controller.getView();
        this.dialog = await Fragment.load({
          id: view?.getId(),
          name: "apps.dflc.benditalook.view.fragments.OrderDialog",
          controller: this.controller
        });
        view?.addDependent(this.dialog);
      }
      return this.dialog;
    }
  }
  return OrdersSection;
});
//# sourceMappingURL=OrdersSection-dbg.js.map
