import type Context from "sap/ui/model/odata/v4/Context";
import type ODataListBinding from "sap/ui/model/odata/v4/ODataListBinding";
import type ODataModel from "sap/ui/model/odata/v4/ODataModel";

const SERVICE_NAMESPACE = "BenditaLook";

export default class DraftService {

    constructor(private readonly adminModel: ODataModel) { }

    public async createDraft(listBinding: ODataListBinding, data: object): Promise<Context> {
        const draftContext = listBinding.create(data, true);

        await draftContext.created();

        return draftContext;
    }

    public async editDraft(activeContext: Context): Promise<Context> {
        const operation = this.adminModel.bindContext(`${SERVICE_NAMESPACE}.draftEdit(...)`, activeContext, {
            $$inheritExpandSelect: true
        });

        operation.setParameter("PreserveChanges", true);

        return await operation.invoke() as Context;
    }

    public async activateDraft(draftContext: Context): Promise<Context> {
        await this.submitPendingChanges();

        const operation = this.adminModel.bindContext(`${SERVICE_NAMESPACE}.draftActivate(...)`, draftContext, {
            $$inheritExpandSelect: true
        });

        return await operation.invoke() as Context;
    }

    public async discardDraft(draftContext: Context): Promise<void> {
        this.adminModel.resetChanges();

        await draftContext.delete();
    }

    public async submitPendingChanges(): Promise<void> {
        if (this.adminModel.hasPendingChanges()) {
            await this.adminModel.submitBatch(this.adminModel.getUpdateGroupId());
        }
    }

}
