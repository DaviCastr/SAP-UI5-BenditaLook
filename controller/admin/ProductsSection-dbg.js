sap.ui.define(["../../service/DraftService"], function (__DraftService) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const DraftService = _interopRequireDefault(__DraftService);
  class ProductsSection {
    constructor(controller) {
      this.controller = controller;
    }
    onNewProduct = async () => {
      try {
        const draft = await this.controller.runBusy(() => this.draftService().createDraft(this.getTableBinding(), {
          Active: true
        }));
        this.openEditor(draft);
      } catch (error) {
        this.controller.handleError(error, "productCreateError");
      }
    };
    onProductPress = async event => {
      const context = this.contextOf(event);
      if (context.getProperty("IsActiveEntity") === false) {
        this.openEditor(context);
        return;
      }
      try {
        const draft = await this.controller.runBusy(() => this.draftService().editDraft(context));
        this.openEditor(draft);
      } catch (error) {
        this.controller.handleError(error, "productEditError");
      }
    };
    onDeleteProduct = async event => {
      const context = this.contextOf(event);
      if (!(await this.controller.confirm("confirmDeleteProduct", [context.getProperty("Name") ?? ""]))) {
        return;
      }
      try {
        await this.controller.runBusy(() => context.delete());
        this.controller.showToast("productDeleted");
      } catch (error) {
        this.controller.handleError(error, "productDeleteError");
      }
    };
    refresh() {
      this.getTableBinding()?.refresh();
    }
    openEditor(draft) {
      this.controller.navTo("adminProduct", {
        productId: draft.getProperty("ID")
      });
    }
    contextOf(event) {
      return event.getSource().getBindingContext();
    }
    draftService() {
      return new DraftService(this.controller.getAdminModel());
    }
    getTableBinding() {
      return this.controller.byControlId("productsTable").getBinding("items");
    }
  }
  return ProductsSection;
});
//# sourceMappingURL=ProductsSection-dbg.js.map
