import type ODataModel from "sap/ui/model/odata/v4/ODataModel";

export interface StoreInfo {
    StoreName: string;
    Whatsapp?: string;
    ContactEmail?: string;
    Instagram?: string;
}

export default class StoreService {

    constructor(private readonly catalogModel: ODataModel) { }

    public async storeInfo(): Promise<StoreInfo> {
        const operation = this.catalogModel.bindContext("/StoreInfo(...)");

        await operation.invoke();

        return operation.getBoundContext().getObject() as StoreInfo;
    }

}
