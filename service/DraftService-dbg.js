sap.ui.define([], function () {
  "use strict";

  const SERVICE_NAMESPACE = "BenditaLook";
  class DraftService {
    constructor(adminModel) {
      this.adminModel = adminModel;
    }
    async createDraft(listBinding, data) {
      const draftContext = listBinding.create(data, true);
      await draftContext.created();
      return draftContext;
    }
    async editDraft(activeContext) {
      const operation = this.adminModel.bindContext(`${SERVICE_NAMESPACE}.draftEdit(...)`, activeContext, {
        $$inheritExpandSelect: true
      });
      operation.setParameter("PreserveChanges", true);
      return await operation.invoke();
    }
    async activateDraft(draftContext) {
      await this.submitPendingChanges();
      const operation = this.adminModel.bindContext(`${SERVICE_NAMESPACE}.draftActivate(...)`, draftContext, {
        $$inheritExpandSelect: true
      });
      return await operation.invoke();
    }
    async discardDraft(draftContext) {
      this.adminModel.resetChanges();
      await draftContext.delete();
    }
    async submitPendingChanges() {
      if (this.adminModel.hasPendingChanges()) {
        await this.adminModel.submitBatch(this.adminModel.getUpdateGroupId());
      }
    }
  }
  return DraftService;
});
//# sourceMappingURL=DraftService-dbg.js.map
