sap.ui.define(["sap/ui/model/json/JSONModel", "./BaseController", "./admin/OrdersSection", "./admin/ProductsSection", "./admin/CategoriesSection", "./admin/BackupSection", "./admin/ReportsSection", "../auth/AuthenticationService"], function (JSONModel, __BaseController, __OrdersSection, __ProductsSection, __CategoriesSection, __BackupSection, __ReportsSection, ___auth_AuthenticationService) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const BaseController = _interopRequireDefault(__BaseController);
  const OrdersSection = _interopRequireDefault(__OrdersSection);
  const ProductsSection = _interopRequireDefault(__ProductsSection);
  const CategoriesSection = _interopRequireDefault(__CategoriesSection);
  const BackupSection = _interopRequireDefault(__BackupSection);
  const ReportsSection = _interopRequireDefault(__ReportsSection);
  const AuthenticationService = ___auth_AuthenticationService["AuthenticationService"];
  const DEFAULT_TAB = "orders";
  const REPORTS_TAB = "reports";

  /**
   * @namespace apps.dflc.benditalook.controller
   */
  const Admin = BaseController.extend("apps.dflc.benditalook.controller.Admin", {
    constructor: function constructor() {
      BaseController.prototype.constructor.apply(this, arguments);
      this.orders = new OrdersSection(this);
      this.products = new ProductsSection(this);
      this.categories = new CategoriesSection(this);
      this.backup = new BackupSection(this);
      this.reports = new ReportsSection(this);
    },
    onInit: function _onInit() {
      this.viewModel = new JSONModel({
        tab: DEFAULT_TAB,
        userName: ""
      });
      this.getView()?.setModel(this.viewModel, "adminView");
      this.getView()?.setModel(this.reports.model, "report");
      this.getRouter().getRoute("admin")?.attachPatternMatched(event => this.onRouteMatched(event));
    },
    onTabSelect: function _onTabSelect(event) {
      this.navTo("admin", {
        tab: event.getParameter("key")
      }, true);
    },
    onOpenStore: function _onOpenStore() {
      this.navTo("catalog");
    },
    onLogout: async function _onLogout() {
      await AuthenticationService.logout();
      this.navTo("catalog", {}, true);
    },
    byControlId: function _byControlId(id) {
      return this.byId(id);
    },
    onRouteMatched: async function _onRouteMatched(event) {
      const {
        tab
      } = event.getParameter("arguments");
      const adminModel = await this.ensureAdminModel();
      if (!adminModel) {
        this.navTo("login", {}, true);
        return;
      }
      const selectedTab = tab || DEFAULT_TAB;
      this.viewModel.setProperty("/tab", selectedTab);
      this.viewModel.setProperty("/userName", AuthenticationService.getSession()?.userName ?? "");
      this.products.refresh();
      if (selectedTab === REPORTS_TAB) {
        await this.reports.load();
      }
    }
  });
  return Admin;
});
//# sourceMappingURL=Admin-dbg.controller.js.map
