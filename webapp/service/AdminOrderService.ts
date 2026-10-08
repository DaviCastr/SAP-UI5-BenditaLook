import type ODataModel from "sap/ui/model/odata/v4/ODataModel";
import { OrderStatus } from "../model/formatter";

export default class AdminOrderService {

    constructor(private readonly adminModel: ODataModel) { }

    public async changeStatus(orderId: string, status: OrderStatus): Promise<void> {
        const operation = this.adminModel.bindContext("/ChangeOrderStatus(...)");

        operation.setParameter("OrderId", orderId);
        operation.setParameter("Status", status);

        await operation.invoke();
    }

}
