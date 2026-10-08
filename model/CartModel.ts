import JSONModel from "sap/ui/model/json/JSONModel";
import Storage from "sap/ui/util/Storage";

export interface CartItem {
    VariantId: string;
    ProductId: string;
    ProductName: string;
    ColorName: string;
    Size: string;
    UnitPrice: number;
    Quantity: number;
    MaxQuantity: number;
    ImageId: string;
}

interface CartState {
    items: CartItem[];
    count: number;
    total: number;
}

const STORAGE_KEY = "benditaLook.cart";
const MAX_QUANTITY_PER_ITEM = 20;

export default class CartModel extends JSONModel {

    private readonly storage = new Storage(Storage.Type.local);

    constructor() {
        super({ items: [], count: 0, total: 0 } as CartState);
        this.setItems((this.storage.get(STORAGE_KEY) as CartItem[] | null) ?? []);
    }

    public getItems(): CartItem[] {
        return (this.getProperty("/items") as CartItem[]).map((item) => ({ ...item }));
    }

    public addItem(newItem: CartItem): number {
        const items = this.getItems();
        const existing = items.find((item) => item.VariantId === newItem.VariantId);

        if (existing) {
            existing.Quantity = this.limitQuantity(existing.Quantity + newItem.Quantity, newItem.MaxQuantity);
            existing.MaxQuantity = newItem.MaxQuantity;
        } else {
            items.push({ ...newItem, Quantity: this.limitQuantity(newItem.Quantity, newItem.MaxQuantity) });
        }

        this.setItems(items);

        return (existing ?? items[items.length - 1]).Quantity;
    }

    public updateQuantity(variantId: string, quantity: number): void {
        this.setItems(this.getItems().map((item) => item.VariantId === variantId
            ? { ...item, Quantity: this.limitQuantity(quantity, item.MaxQuantity) }
            : item));
    }

    public removeItem(variantId: string): void {
        this.setItems(this.getItems().filter((item) => item.VariantId !== variantId));
    }

    public clear(): void {
        this.setItems([]);
    }

    private limitQuantity(quantity: number, maxQuantity: number): number {
        return Math.max(1, Math.min(quantity, maxQuantity, MAX_QUANTITY_PER_ITEM));
    }

    private setItems(items: CartItem[]): void {
        this.setData({
            items,
            count: items.reduce((count, item) => count + item.Quantity, 0),
            total: Math.round(items.reduce((total, item) => total + item.UnitPrice * item.Quantity, 0) * 100) / 100
        } as CartState);

        this.storage.put(STORAGE_KEY, items);
    }

}
