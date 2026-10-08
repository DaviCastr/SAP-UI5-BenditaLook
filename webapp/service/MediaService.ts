import { adminRequest } from "../util/http";

export default class MediaService {

    private static readonly objectUrls = new Map<string, string>();

    public static draftImagePath(imageId: string): string {
        return `ProductImages(ID=${imageId},IsActiveEntity=false)/Image`;
    }

    public static async loadDraftImage(imageId: string): Promise<string> {
        const cached = this.objectUrls.get(imageId);

        if (cached) {
            return cached;
        }

        const response = await adminRequest(this.draftImagePath(imageId));
        const objectUrl = URL.createObjectURL(await response.blob());

        this.objectUrls.set(imageId, objectUrl);

        return objectUrl;
    }

    public static async uploadDraftImage(imageId: string, content: Blob, contentType: string): Promise<void> {
        await adminRequest(this.draftImagePath(imageId), {
            method: "PUT",
            headers: { "Content-Type": contentType },
            body: content
        });

        this.objectUrls.set(imageId, URL.createObjectURL(content));
    }

    public static release(imageId: string): void {
        const objectUrl = this.objectUrls.get(imageId);

        if (objectUrl) {
            URL.revokeObjectURL(objectUrl);
            this.objectUrls.delete(imageId);
        }
    }

}
