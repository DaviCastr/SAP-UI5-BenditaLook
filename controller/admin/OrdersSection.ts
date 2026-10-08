import Fragment from "sap/ui/core/Fragment";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import type Dialog from "sap/m/Dialog";
import type Table from "sap/m/Table";
import type Control from "sap/ui/core/Control";
import type Event from "sap/ui/base/Event";
import type Context from "sap/ui/model/odata/v4/Context";
import type ODataListBinding from "sap/ui/model/odata/v4/ODataListBinding";
import type { SegmentedButton$SelectionChangeEvent } from "sap/m/SegmentedButton";
import type Admin from "../Admin.controller";
import AdminOrderService from "../../service/AdminOrderService";
import formatter, { OrderStatus } from "../../model/formatter";

const ALL_STATUSES = "ALL";

export default class OrdersSection {

    private dialog?: Dialog;

    constructor(private readonly controller: Admin) { }

    public onStatusFilter = (event: SegmentedButton$SelectionChangeEvent): void => {
        const status = event.getParameter("item")?.getKey() ?? ALL_STATUSES;
        const filters = status === ALL_STATUSES ? [] : [new Filter("Status", FilterOperator.EQ, status)];

        this.getTableBinding().filter(filters);
    };

    public onRefresh = (): void => {
        this.getTableBinding().refresh();
    };

    public onOrderPress = async (event: Event): Promise<void> => {
        const context = (event.getSource() as Control).getBindingContext() as Context;
        const dialog = await this.getDialog();

        dialog.bindElement({ path: context.getPath(), parameters: { $expand: "Items" } });
        dialog.open();
    };

    public onCloseDialog = (): void => {
        this.dialog?.close();
    };

    public onStartService = (): Promise<void> => this.changeStatus(OrderStatus.InService, "orderStatusChanged");

    public onComplete = (): Promise<void> => this.changeStatus(OrderStatus.Completed, "orderStatusChanged");

    public onCancel = async (): Promise<void> => {
        if (await this.controller.confirm("confirmCancelOrder", [this.getDialogOrder().Number])) {
            await this.changeStatus(OrderStatus.Cancelled, "orderCancelled");
        }
    };

    public onWhatsapp = (): void => {
        const order = this.getDialogOrder();
        const message = this.controller.getText("whatsappCustomerMessage", [order.CustomerName, order.Number]);

        window.open(formatter.whatsappUrl(order.CustomerPhone, message), "_blank");
    };

    private async changeStatus(status: OrderStatus, successKey: string): Promise<void> {
        const order = this.getDialogOrder();

        try {
            await this.controller.runBusy(() => new AdminOrderService(this.controller.getAdminModel()).changeStatus(order.ID, status));

            this.controller.showToast(successKey, [order.Number]);
            this.dialog?.getElementBinding()?.refresh();
            this.getTableBinding().refresh();
        } catch (error) {
            this.controller.handleError(error, "orderStatusError");
        }
    }

    private getDialogOrder(): { ID: string; Number: number; CustomerName: string; CustomerPhone: string } {
        return this.dialog?.getBindingContext()?.getObject() as { ID: string; Number: number; CustomerName: string; CustomerPhone: string };
    }

    private getTableBinding(): ODataListBinding {
        return this.controller.byControlId<Table>("ordersTable").getBinding("items") as ODataListBinding;
    }

    private async getDialog(): Promise<Dialog> {
        if (!this.dialog) {
            const view = this.controller.getView();

            this.dialog = await Fragment.load({
                id: view?.getId(),
                name: "apps.dflc.benditalook.view.fragments.OrderDialog",
                controller: this.controller
            }) as Dialog;

            view?.addDependent(this.dialog);
        }

        return this.dialog;
    }

}
