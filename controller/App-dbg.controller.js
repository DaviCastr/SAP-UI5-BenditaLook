sap.ui.define(["./BaseController"], function (__BaseController) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const BaseController = _interopRequireDefault(__BaseController);
  /**
   * @namespace apps.dflc.benditalook.controller
   */
  const App = BaseController.extend("apps.dflc.benditalook.controller.App", {
    onInit: function _onInit() {
      this.getView()?.addStyleClass("blApp");
    }
  });
  return App;
});
//# sourceMappingURL=App-dbg.controller.js.map
