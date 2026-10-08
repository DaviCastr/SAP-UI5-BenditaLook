import JSONModel from "sap/ui/model/json/JSONModel";
import MessageBox from "sap/m/MessageBox";
import { ValueState } from "sap/ui/core/library";
import type Control from "sap/ui/core/Control";
import type Event from "sap/ui/base/Event";
import type { StepInput$ChangeEvent } from "sap/m/StepInput";
import BaseController from "./BaseController";
import OrderService, { CustomerContact } from "../service/OrderService";

type ContactField = "CustomerName" | "CustomerEmail" | "CustomerPhone";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_DIGITS = { min: 10, max: 13 };
const NAME_MIN_LENGTH = 3;

/**
 * @namespace apps.dflc.benditalook.controller
 */
export default class Cart extends BaseController {

    private contactModel: JSONModel;

    public onInit(): void {
        this.contactModel = new JSONModel(this.emptyContact());
        this.getView()?.setModel(this.contactModel, "contact");
    }

    public onQuantityChange(event: StepInput$ChangeEvent): void {
        const variantId = this.variantIdOf(event);

        this.getCartModel().updateQuantity(variantId, Number(event.getParameter("value")));
    }

    public onRemoveItem(event: Event): void {
        this.getCartModel().removeItem(this.variantIdOf(event));
    }

    public onContinueShopping(): void {
        this.navTo("catalog");
    }

    public async onSubmitOrder(): Promise<void> {
        const cartItems = this.getCartModel().getItems();

        if (!cartItems.length || !this.validateContact()) {
            return;
        }

        try {
            const contact = this.contactModel.getProperty("/data") as CustomerContact;
            const order = await this.runBusy(() => new OrderService(this.getCatalogModel()).submitOrder(contact, cartItems));

            this.getCartModel().clear();
            this.contactModel.setData(this.emptyContact());

            MessageBox.success(this.getText("orderSubmittedMessage", [order.Number]), {
                title: this.getText("orderSubmittedTitle"),
                onClose: () => this.navTo("order", { orderNumber: order.Number, accessCode: order.AccessCode }, true)
            });
        } catch (error) {
            this.getCatalogModel().refresh();
            this.handleError(error, "orderSubmitError");
        }
    }

    private validateContact(): boolean {
        const contact = this.contactModel.getProperty("/data") as CustomerContact;
        const validations: Record<ContactField, boolean> = {
            CustomerName: contact.CustomerName.trim().length >= NAME_MIN_LENGTH,
            CustomerEmail: EMAIL_PATTERN.test(contact.CustomerEmail.trim()),
            CustomerPhone: this.isValidPhone(contact.CustomerPhone)
        };

        (Object.keys(validations) as ContactField[]).forEach((field) => {
            this.contactModel.setProperty(`/states/${field}`, validations[field] ? ValueState.None : ValueState.Error);
        });

        const isValid = Object.values(validations).every(Boolean);

        if (!isValid) {
            MessageBox.warning(this.getText("contactInvalid"));
        }

        return isValid;
    }

    private isValidPhone(phone: string): boolean {
        const digits = phone.replace(/\D/g, "").length;
        return digits >= PHONE_DIGITS.min && digits <= PHONE_DIGITS.max;
    }

    private variantIdOf(event: Event): string {
        return (event.getSource() as Control).getBindingContext("cart")?.getProperty("VariantId") as string;
    }

    private emptyContact(): object {
        return {
            data: {
                CustomerName: "",
                CustomerEmail: "",
                CustomerPhone: "",
                Address: "",
                District: "",
                City: "",
                ZipCode: "",
                Notes: ""
            } as CustomerContact,
            states: {
                CustomerName: ValueState.None,
                CustomerEmail: ValueState.None,
                CustomerPhone: ValueState.None
            }
        };
    }

}
