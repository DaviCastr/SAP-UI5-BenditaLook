sap.ui.define(["sap/ui/model/json/JSONModel", "sap/ui/model/Filter", "sap/ui/model/FilterOperator", "./BaseController", "../model/formatter"], function (JSONModel, Filter, FilterOperator, __BaseController, __formatter) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const BaseController = _interopRequireDefault(__BaseController);
  const formatter = _interopRequireDefault(__formatter);
  /**
   * @namespace apps.dflc.benditalook.controller
   */
  const Catalog = BaseController.extend("apps.dflc.benditalook.controller.Catalog", {
    onInit: function _onInit() {
      this.viewModel = new JSONModel({
        categoryId: "",
        search: ""
      });
      this.getView()?.setModel(this.viewModel, "catalogView");
    },
    onCategoryPress: function _onCategoryPress(event) {
      const context = event.getSource().getBindingContext("catalog");
      this.viewModel.setProperty("/categoryId", context ? context.getProperty("ID") : "");
      this.applyFilters();
    },
    onSearch: function _onSearch(event) {
      this.viewModel.setProperty("/search", event.getParameter("query") ?? "");
      this.applyFilters();
    },
    onProductPress: function _onProductPress(event) {
      const context = event.getSource().getBindingContext("catalog");
      this.navTo("product", {
        productId: context?.getProperty("ID")
      });
    },
    onOpenAdmin: function _onOpenAdmin() {
      this.navTo("admin");
    },
    onContactWhatsapp: function _onContactWhatsapp() {
      window.open(formatter.whatsappUrl(this.getStoreModel().getProperty("/whatsapp"), this.getText("whatsappGreeting")), "_blank");
    },
    applyFilters: function _applyFilters() {
      const {
        categoryId,
        search
      } = this.viewModel.getData();
      const filters = [];
      if (categoryId) {
        filters.push(new Filter("Category_ID", FilterOperator.EQ, categoryId));
      }
      if (search.trim()) {
        filters.push(new Filter({
          path: "Name",
          operator: FilterOperator.Contains,
          value1: search.trim(),
          caseSensitive: false
        }));
      }
      this.byId("productGrid")?.getBinding("items")?.filter(filters);
    }
  });
  return Catalog;
});
//# sourceMappingURL=Catalog-dbg.controller.js.map
