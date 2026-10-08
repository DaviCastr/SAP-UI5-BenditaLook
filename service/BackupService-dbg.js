sap.ui.define(["../util/http"], function (___util_http) {
  "use strict";

  const adminRequest = ___util_http["adminRequest"];
  const BACKUP_CONTENT_TYPE = "application/zip";
  class BackupService {
    static async exportBackup() {
      const response = await adminRequest("ExportBackup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: "{}"
      });
      const {
        data: backupId
      } = await response.json();
      const download = await adminRequest(`Backups(ID=${backupId},IsActiveEntity=true)/Backup`);
      return download.blob();
    }
    static async importBackup(file) {
      const createResponse = await adminRequest("Backups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: "{}"
      });
      const {
        ID: draftId
      } = await createResponse.json();
      const draftPath = `Backups(ID=${draftId},IsActiveEntity=false)`;
      await adminRequest(`${draftPath}/Backup`, {
        method: "PUT",
        headers: {
          "Content-Type": BACKUP_CONTENT_TYPE
        },
        body: file
      });
      await adminRequest(`${draftPath}/BenditaLook.draftActivate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: "{}"
      });
    }
    static download(blob, fileName) {
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    }
  }
  return BackupService;
});
//# sourceMappingURL=BackupService-dbg.js.map
