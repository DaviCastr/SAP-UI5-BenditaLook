import type Table from "sap/m/Table";
import type Control from "sap/ui/core/Control";
import type Event from "sap/ui/base/Event";
import type Context from "sap/ui/model/odata/v4/Context";
import type ODataListBinding from "sap/ui/model/odata/v4/ODataListBinding";
import type Admin from "../Admin.controller";
import DraftService from "../../service/DraftService";

export default class ProductsSection {

    constructor(private readonly controller: Admin) { }

    public onNewProduct = async (): Promise<void> => {
        try {
            const draft = await this.controller.runBusy(() => this.draftService().createDraft(this.getTableBinding(), { Active: true }));
            this.openEditor(draft);
        } catch (error) {
            this.controller.handleError(error, "productCreateError");
        }
    };

    public onProductPress = async (event: Event): Promise<void> => {
        const context = this.contextOf(event);

        if (context.getProperty("IsActiveEntity") === false) {
            this.openEditor(context);
            return;
        }

        try {
            const draft = await this.controller.runBusy(() => this.draftService().editDraft(context));
            this.openEditor(draft);
        } catch (error) {
            this.controller.handleError(error, "productEditError");
        }
    };

    public onDeleteProduct = async (event: Event): Promise<void> => {
        const context = this.contextOf(event);

        if (!await this.controller.confirm("confirmDeleteProduct", [context.getProperty("Name") ?? ""])) {
            return;
        }

        try {
            await this.controller.runBusy(() => context.delete());
            this.controller.showToast("productDeleted");
        } catch (error) {
            this.controller.handleError(error, "productDeleteError");
        }
    };

    public refresh(): void {
        this.getTableBinding()?.refresh();
    }

    private openEditor(draft: Context): void {
        this.controller.navTo("adminProduct", { productId: draft.getProperty("ID") as string });
    }

    private contextOf(event: Event): Context {
        return (event.getSource() as Control).getBindingContext() as Context;
    }

    private draftService(): DraftService {
        return new DraftService(this.controller.getAdminModel());
    }

    private getTableBinding(): ODataListBinding {
        return this.controller.byControlId<Table>("productsTable").getBinding("items") as ODataListBinding;
    }

}
