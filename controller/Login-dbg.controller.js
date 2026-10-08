sap.ui.define(["./BaseController", "../auth/AuthenticationService"], function (__BaseController, ___auth_AuthenticationService) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const BaseController = _interopRequireDefault(__BaseController);
  const AuthenticationService = ___auth_AuthenticationService["AuthenticationService"];
  /**
   * @namespace apps.dflc.benditalook.controller
   */
  const Login = BaseController.extend("apps.dflc.benditalook.controller.Login", {
    onInit: function _onInit() {
      this.getRouter().getRoute("login")?.attachPatternMatched(() => this.redirectWhenAuthenticated());
    },
    onLogin: async function _onLogin() {
      try {
        await AuthenticationService.login();
        await this.redirectWhenAuthenticated();
      } catch (error) {
        this.handleError(error, "loginError");
      }
    },
    redirectWhenAuthenticated: async function _redirectWhenAuthenticated() {
      if (await AuthenticationService.isAuthenticated()) {
        this.navTo("admin", {}, true);
      }
    }
  });
  return Login;
});
//# sourceMappingURL=Login-dbg.controller.js.map
