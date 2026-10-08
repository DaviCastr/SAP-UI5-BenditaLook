sap.ui.define(["../../service/BackupService"], function (__BackupService) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const BackupService = _interopRequireDefault(__BackupService);
  class BackupSection {
    constructor(controller) {
      this.controller = controller;
    }
    onExport = async () => {
      try {
        const backup = await this.controller.runBusy(() => BackupService.exportBackup());
        const today = new Date().toISOString().slice(0, 10);
        BackupService.download(backup, `BenditaLook-backup-${today}.zip`);
        this.controller.showToast("backupExported");
      } catch (error) {
        this.controller.handleError(error, "backupExportError");
      }
    };
    onImportFileChange = async event => {
      const uploader = event.getSource();
      const file = event.getParameter("files")?.[0];
      uploader.clear();
      if (!file || !(await this.controller.confirm("confirmImportBackup", [file.name]))) {
        return;
      }
      try {
        await this.controller.runBusy(() => BackupService.importBackup(file));
        this.controller.getAdminModel().refresh();
        this.controller.showToast("backupImported");
      } catch (error) {
        this.controller.handleError(error, "backupImportError");
      }
    };
  }
  return BackupSection;
});
//# sourceMappingURL=BackupSection-dbg.js.map
