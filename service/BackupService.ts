import { adminRequest } from "../util/http";

const BACKUP_CONTENT_TYPE = "application/zip";

export default class BackupService {

    public static async exportBackup(): Promise<Blob> {
        const response = await adminRequest("ExportBackup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: "{}"
        });

        const { data: backupId } = await response.json() as { data: string };
        const download = await adminRequest(`Backups(ID=${backupId},IsActiveEntity=true)/Backup`);

        return download.blob();
    }

    public static async importBackup(file: Blob): Promise<void> {
        const createResponse = await adminRequest("Backups", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: "{}"
        });

        const { ID: draftId } = await createResponse.json() as { ID: string };
        const draftPath = `Backups(ID=${draftId},IsActiveEntity=false)`;

        await adminRequest(`${draftPath}/Backup`, {
            method: "PUT",
            headers: { "Content-Type": BACKUP_CONTENT_TYPE },
            body: file
        });

        await adminRequest(`${draftPath}/BenditaLook.draftActivate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: "{}"
        });
    }

    public static download(blob: Blob, fileName: string): void {
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
