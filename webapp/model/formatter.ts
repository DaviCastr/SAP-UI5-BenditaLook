import formatMessage from "sap/base/strings/formatMessage";
import { ValueState } from "sap/ui/core/library";
import { XsuaaAuthHelper } from "../auth/providers/XsuaaAuthHelper";

export enum OrderStatus {
    New = "NEW",
    InService = "IN_SERVICE",
    Completed = "COMPLETED",
    Cancelled = "CANCELLED"
}

interface ImageReference {
    ID: string;
    SortOrder?: number | null;
}

interface StockReference {
    Stock?: number | null;
}

const PLACEHOLDER_IMAGE = "img/placeholder.svg";

const currencyFormatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" });

const STATUS_STATES: Record<string, ValueState> = {
    [OrderStatus.New]: ValueState.Information,
    [OrderStatus.InService]: ValueState.Warning,
    [OrderStatus.Completed]: ValueState.Success,
    [OrderStatus.Cancelled]: ValueState.Error
};

function catalogImageUrl(imageId: string | null | undefined): string {
    return imageId
        ? `${XsuaaAuthHelper.getConfig().catalogService}ProductImages(${imageId})/Image`
        : PLACEHOLDER_IMAGE;
}

function totalStock(variants: StockReference[] | null | undefined): number {
    return (variants ?? []).reduce((total, variant) => total + (variant.Stock ?? 0), 0);
}

export default {

    currency(value: number | string | null | undefined): string {
        return currencyFormatter.format(Number(value ?? 0));
    },

    message(pattern: string, ...values: unknown[]): string {
        return formatMessage(pattern, values);
    },

    stockMessage(inStockPattern: string, soldOutText: string, stock: number): string {
        return stock > 0 ? formatMessage(inStockPattern, [stock]) : soldOutText;
    },

    variantDescription(...parts: Array<string | null | undefined>): string {
        return parts.filter(Boolean).join(" / ");
    },

    dateTime(value: string | null | undefined): string {
        return value ? dateTimeFormatter.format(new Date(value)) : "";
    },

    catalogImageUrl,

    totalStock,

    coverImageUrl(images: ImageReference[] | null | undefined): string {
        const cover = [...(images ?? [])].sort((first, second) => (first.SortOrder ?? 0) - (second.SortOrder ?? 0))[0];
        return catalogImageUrl(cover?.ID);
    },

    isSoldOut(variants: StockReference[] | null | undefined): boolean {
        return totalStock(variants) === 0;
    },

    statusState(status: string | null | undefined): ValueState {
        return STATUS_STATES[status ?? ""] ?? ValueState.None;
    },

    whatsappUrl(phone: string | null | undefined, message?: string): string {
        const digits = (phone ?? "").replace(/\D/g, "");
        const fullNumber = digits.length <= 11 ? `55${digits}` : digits;
        const text = message ? `?text=${encodeURIComponent(message)}` : "";

        return `https://wa.me/${fullNumber}${text}`;
    }

};
