sap.ui.define(["./MockAuthenticationProvider", "./XsuaaAuthenticationProvider", "./XsuaaAuthHelper"], function (___MockAuthenticationProvider, ___XsuaaAuthenticationProvider, ___XsuaaAuthHelper) {
  "use strict";

  const MockAuthenticationProvider = ___MockAuthenticationProvider["MockAuthenticationProvider"];
  const XsuaaAuthenticationProvider = ___XsuaaAuthenticationProvider["XsuaaAuthenticationProvider"];
  const XsuaaAuthHelper = ___XsuaaAuthHelper["XsuaaAuthHelper"];
  class AuthenticatedProviderFactory {
    static create() {
      return XsuaaAuthHelper.getConfig().auth ? new XsuaaAuthenticationProvider() : new MockAuthenticationProvider();
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.AuthenticatedProviderFactory = AuthenticatedProviderFactory;
  return __exports;
});
//# sourceMappingURL=AuthenticatedProviderFactory-dbg.js.map
