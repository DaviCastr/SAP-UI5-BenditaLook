import type FileUploader from "sap/ui/unified/FileUploader";
import type { FileUploader$ChangeEvent } from "sap/ui/unified/FileUploader";
import type Admin from "../Admin.controller";
import BackupService from "../../service/BackupService";

export default class BackupSection {

    constructor(private readonly controller: Admin) { }

    public onExport = async (): Promise<void> => {
        try {
            const backup = await this.controller.runBusy(() => BackupService.exportBackup());
            const today = new Date().toISOString().slice(0, 10);

            BackupService.download(backup, `BenditaLook-backup-${today}.zip`);
            this.controller.showToast("backupExported");
        } catch (error) {
            this.controller.handleError(error, "backupExportError");
        }
    };

    public onImportFileChange = async (event: FileUploader$ChangeEvent): Promise<void> => {
        const uploader = event.getSource() as FileUploader;
        const file = (event.getParameter("files") as File[] | undefined)?.[0];

        uploader.clear();

        if (!file || !await this.controller.confirm("confirmImportBackup", [file.name])) {
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
