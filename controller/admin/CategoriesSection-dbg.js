sap.ui.define(["sap/ui/core/Fragment", "../../service/DraftService"], function (Fragment, __DraftService) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const DraftService = _interopRequireDefault(__DraftService);
  class CategoriesSection {
    constructor(controller) {
      this.controller = controller;
    }
    onNewCategory = async () => {
      try {
        const draft = await this.controller.runBusy(() => this.draftService().createDraft(this.getTableBinding(), {
          Active: true
        }));
        await this.openDialog(draft);
      } catch (error) {
        this.controller.handleError(error, "categoryCreateError");
      }
    };
    onEditCategory = async event => {
      const context = this.contextOf(event);
      try {
        const draft = context.getProperty("IsActiveEntity") === false ? context : await this.controller.runBusy(() => this.draftService().editDraft(context));
        await this.openDialog(draft);
      } catch (error) {
        this.controller.handleError(error, "categoryEditError");
      }
    };
    onDeleteCategory = async event => {
      const context = this.contextOf(event);
      if (!(await this.controller.confirm("confirmDeleteCategory", [context.getProperty("Name") ?? ""]))) {
        return;
      }
      try {
        await this.controller.runBusy(() => context.delete());
        this.controller.showToast("categoryDeleted");
      } catch (error) {
        this.getTableBinding().refresh();
        this.controller.handleError(error, "categoryDeleteError");
      }
    };
    onSaveCategory = async () => {
      try {
        await this.controller.runBusy(() => this.draftService().activateDraft(this.getDialogContext()));
        this.closeDialog();
        this.controller.showToast("categorySaved");
      } catch (error) {
        this.controller.handleError(error, "categorySaveError");
      }
    };
    onCancelCategory = async () => {
      try {
        await this.draftService().discardDraft(this.getDialogContext());
      } catch (error) {
        this.controller.handleError(error, "categoryCancelError");
      } finally {
        this.closeDialog();
      }
    };
    closeDialog() {
      this.dialog?.close();
      this.dialog?.unbindElement();
      this.getTableBinding().refresh();
    }
    async openDialog(draft) {
      const dialog = await this.getDialog();
      dialog.setBindingContext(draft);
      dialog.open();
    }
    getDialogContext() {
      return this.dialog?.getBindingContext();
    }
    contextOf(event) {
      return event.getSource().getBindingContext();
    }
    draftService() {
      return new DraftService(this.controller.getAdminModel());
    }
    getTableBinding() {
      return this.controller.byControlId("categoriesTable").getBinding("items");
    }
    async getDialog() {
      if (!this.dialog) {
        const view = this.controller.getView();
        this.dialog = await Fragment.load({
          id: view?.getId(),
          name: "apps.dflc.benditalook.view.fragments.CategoryDialog",
          controller: this.controller
        });
        view?.addDependent(this.dialog);
      }
      return this.dialog;
    }
  }
  return CategoriesSection;
});
//# sourceMappingURL=CategoriesSection-dbg.js.map
