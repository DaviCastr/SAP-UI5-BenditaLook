import type ODataModel from "sap/ui/model/odata/v4/ODataModel";
import type { CartItem } from "../model/CartModel";

export interface CustomerContact {
    CustomerName: string;
    CustomerEmail: string;
    CustomerPhone: string;
    Address: string;
    District: string;
    City: string;
    ZipCode: string;
    Notes: string;
}

export interface SubmittedOrder {
    Number: number;
    AccessCode: string;
}

export interface TrackedOrderItem {
    ProductName: string;
    ColorName: string;
    Size: string;
    Quantity: number;
    UnitPrice: number;
    TotalPrice: number;
}

export interface TrackedOrder {
    Number: number;
    Status: string;
    CustomerName: string;
    TotalAmount: number;
    createdAt: string;
    modifiedAt: string;
    Items: TrackedOrderItem[];
}

export default class OrderService {

    constructor(private readonly catalogModel: ODataModel) { }

    public async submitOrder(contact: CustomerContact, items: CartItem[]): Promise<SubmittedOrder> {
        const operation = this.catalogModel.bindContext("/SubmitOrder(...)");

        operation.setParameter("Order", {
            ...contact,
            Items: items.map((item) => ({ Variant_ID: item.VariantId, Quantity: item.Quantity }))
        });

        await operation.invoke();

        return operation.getBoundContext().getObject() as SubmittedOrder;
    }

    public async trackOrder(orderNumber: number, accessCode: string): Promise<TrackedOrder> {
        const operation = this.catalogModel.bindContext("/TrackOrder(...)");

        operation.setParameter("Number", orderNumber);
        operation.setParameter("AccessCode", accessCode);

        await operation.invoke();

        return operation.getBoundContext().getObject() as TrackedOrder;
    }

}
