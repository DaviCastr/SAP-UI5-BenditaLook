sap.ui.define([], function () {
  "use strict";

  class StoreService {
    constructor(catalogModel) {
      this.catalogModel = catalogModel;
    }
    async storeInfo() {
      const operation = this.catalogModel.bindContext("/StoreInfo(...)");
      await operation.invoke();
      return operation.getBoundContext().getObject();
    }
  }
  return StoreService;
});
//# sourceMappingURL=StoreService-dbg.js.map
