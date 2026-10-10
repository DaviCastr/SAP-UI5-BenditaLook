import type ODataModel from "sap/ui/model/odata/v4/ODataModel";
import { OrderStatus } from "../model/formatter";

export enum DeliveryType {
    UberFlash = "UBER_FLASH",
    LocalCourier = "LOCAL_COURIER"
}

export interface DeliveryInput {
    DeliveryType: DeliveryType;
    CourierName: string;
    VehiclePlate: string;
    DeliveryNotes: string;
}

export default class AdminOrderService {

    constructor(private readonly adminModel: ODataModel) { }

    public async changeStatus(orderId: string, status: OrderStatus, delivery?: DeliveryInput): Promise<void> {
        const operation = this.adminModel.bindContext("/ChangeOrderStatus(...)");

        operation.setParameter("OrderId", orderId);
        operation.setParameter("Status", status);

        if (delivery) {
            operation.setParameter("Delivery", delivery);
        }

        await operation.invoke();
    }

}
