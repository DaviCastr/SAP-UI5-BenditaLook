sap.ui.define(["sap/base/strings/formatMessage", "sap/ui/core/library", "../auth/providers/XsuaaAuthHelper"], function (formatMessage, sap_ui_core_library, ___auth_providers_XsuaaAuthHelper) {
  "use strict";

  const ValueState = sap_ui_core_library["ValueState"];
  const XsuaaAuthHelper = ___auth_providers_XsuaaAuthHelper["XsuaaAuthHelper"];
  var OrderStatus = /*#__PURE__*/function (OrderStatus) {
    OrderStatus["New"] = "NEW";
    OrderStatus["InService"] = "IN_SERVICE";
    OrderStatus["Completed"] = "COMPLETED";
    OrderStatus["Cancelled"] = "CANCELLED";
    return OrderStatus;
  }(OrderStatus || {});
  const PLACEHOLDER_IMAGE = "img/placeholder.svg";
  const currencyFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
  const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
  });
  const STATUS_STATES = {
    [OrderStatus.New]: ValueState.Information,
    [OrderStatus.InService]: ValueState.Warning,
    [OrderStatus.Completed]: ValueState.Success,
    [OrderStatus.Cancelled]: ValueState.Error
  };
  function catalogImageUrl(imageId) {
    return imageId ? `${XsuaaAuthHelper.getConfig().catalogService}ProductImages(${imageId})/Image` : PLACEHOLDER_IMAGE;
  }
  function totalStock(variants) {
    return (variants ?? []).reduce((total, variant) => total + (variant.Stock ?? 0), 0);
  }
  var __exports = {
    currency(value) {
      return currencyFormatter.format(Number(value ?? 0));
    },
    message(pattern, ...values) {
      return formatMessage(pattern, values);
    },
    stockMessage(inStockPattern, soldOutText, stock) {
      return stock > 0 ? formatMessage(inStockPattern, [stock]) : soldOutText;
    },
    variantDescription(...parts) {
      return parts.filter(Boolean).join(" / ");
    },
    dateTime(value) {
      return value ? dateTimeFormatter.format(new Date(value)) : "";
    },
    catalogImageUrl,
    totalStock,
    coverImageUrl(images) {
      const cover = [...(images ?? [])].sort((first, second) => (first.SortOrder ?? 0) - (second.SortOrder ?? 0))[0];
      return catalogImageUrl(cover?.ID);
    },
    isSoldOut(variants) {
      return totalStock(variants) === 0;
    },
    statusState(status) {
      return STATUS_STATES[status ?? ""] ?? ValueState.None;
    },
    whatsappUrl(phone, message) {
      const digits = (phone ?? "").replace(/\D/g, "");
      const fullNumber = digits.length <= 11 ? `55${digits}` : digits;
      const text = message ? `?text=${encodeURIComponent(message)}` : "";
      return `https://wa.me/${fullNumber}${text}`;
    }
  };
  __exports.OrderStatus = OrderStatus;
  return __exports;
});
//# sourceMappingURL=formatter-dbg.js.map
