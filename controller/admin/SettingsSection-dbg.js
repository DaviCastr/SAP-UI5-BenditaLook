sap.ui.define(["sap/ui/model/json/JSONModel", "../../service/DraftService"], function (JSONModel, __DraftService) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const DraftService = _interopRequireDefault(__DraftService);
  const SETTINGS_FILTER = "IsActiveEntity eq false or SiblingEntity/IsActiveEntity eq null";
  class SettingsSection {
    model = new JSONModel({
      editing: false,
      loaded: false
    });
    constructor(controller) {
      this.controller = controller;
    }
    onEdit = async () => {
      try {
        const draft = await this.controller.runBusy(() => this.draftService().editDraft(this.getContext()));
        this.showContext(draft);
      } catch (error) {
        this.controller.handleError(error, "settingsEditError");
      }
    };
    onSave = async () => {
      try {
        await this.controller.runBusy(() => this.draftService().activateDraft(this.getContext()));
        this.controller.showToast("settingsSaved");
        await this.load();
        await this.controller.refreshStoreInfo();
      } catch (error) {
        this.controller.handleError(error, "settingsSaveError");
      }
    };
    onCancel = async () => {
      try {
        await this.draftService().discardDraft(this.getContext());
      } catch (error) {
        this.controller.handleError(error, "settingsCancelError");
      } finally {
        await this.load();
      }
    };
    async load() {
      try {
        const contexts = await this.controller.runBusy(() => this.controller.getAdminModel().bindList("/StoreSettings", undefined, undefined, undefined, {
          $filter: SETTINGS_FILTER
        }).requestContexts(0, 1));
        this.showContext(contexts[0]);
      } catch (error) {
        this.controller.handleError(error, "settingsLoadError");
      }
    }
    showContext(context) {
      this.getForm().setBindingContext(context);
      this.model.setData({
        editing: context.getProperty("IsActiveEntity") === false,
        loaded: true
      });
    }
    getContext() {
      return this.getForm().getBindingContext();
    }
    getForm() {
      return this.controller.byControlId("settingsForm");
    }
    draftService() {
      return new DraftService(this.controller.getAdminModel());
    }
  }
  return SettingsSection;
});
//# sourceMappingURL=SettingsSection-dbg.js.map
