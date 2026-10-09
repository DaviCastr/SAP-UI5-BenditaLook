sap.ui.define([], function () {
  "use strict";

  class ReportService {
    constructor(adminModel) {
      this.adminModel = adminModel;
    }
    async salesReport(year) {
      const operation = this.adminModel.bindContext("/SalesReport(...)");
      operation.setParameter("Year", year);
      await operation.invoke();
      return operation.getBoundContext().getObject();
    }
  }
  return ReportService;
});
//# sourceMappingURL=ReportService-dbg.js.map
