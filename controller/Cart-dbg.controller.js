sap.ui.define(["sap/ui/model/json/JSONModel", "sap/m/MessageBox", "sap/ui/core/library", "./BaseController", "../service/OrderService"], function (JSONModel, MessageBox, sap_ui_core_library, __BaseController, __OrderService) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const ValueState = sap_ui_core_library["ValueState"];
  const BaseController = _interopRequireDefault(__BaseController);
  const OrderService = _interopRequireDefault(__OrderService);
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PHONE_DIGITS = {
    min: 10,
    max: 13
  };
  const NAME_MIN_LENGTH = 3;

  /**
   * @namespace apps.dflc.benditalook.controller
   */
  const Cart = BaseController.extend("apps.dflc.benditalook.controller.Cart", {
    onInit: function _onInit() {
      this.contactModel = new JSONModel(this.emptyContact());
      this.getView()?.setModel(this.contactModel, "contact");
    },
    onQuantityChange: function _onQuantityChange(event) {
      const variantId = this.variantIdOf(event);
      this.getCartModel().updateQuantity(variantId, Number(event.getParameter("value")));
    },
    onRemoveItem: function _onRemoveItem(event) {
      this.getCartModel().removeItem(this.variantIdOf(event));
    },
    onContinueShopping: function _onContinueShopping() {
      this.navTo("catalog");
    },
    onSubmitOrder: async function _onSubmitOrder() {
      const cartItems = this.getCartModel().getItems();
      if (!cartItems.length || !this.validateContact()) {
        return;
      }
      try {
        const contact = this.contactModel.getProperty("/data");
        const order = await this.runBusy(() => new OrderService(this.getCatalogModel()).submitOrder(contact, cartItems));
        this.getCartModel().clear();
        this.contactModel.setData(this.emptyContact());
        MessageBox.success(this.getText("orderSubmittedMessage", [order.Number]), {
          title: this.getText("orderSubmittedTitle"),
          onClose: () => this.navTo("order", {
            orderNumber: order.Number,
            accessCode: order.AccessCode
          }, true)
        });
      } catch (error) {
        this.getCatalogModel().refresh();
        this.handleError(error, "orderSubmitError");
      }
    },
    validateContact: function _validateContact() {
      const contact = this.contactModel.getProperty("/data");
      const validations = {
        CustomerName: contact.CustomerName.trim().length >= NAME_MIN_LENGTH,
        CustomerEmail: EMAIL_PATTERN.test(contact.CustomerEmail.trim()),
        CustomerPhone: this.isValidPhone(contact.CustomerPhone)
      };
      Object.keys(validations).forEach(field => {
        this.contactModel.setProperty(`/states/${field}`, validations[field] ? ValueState.None : ValueState.Error);
      });
      const isValid = Object.values(validations).every(Boolean);
      if (!isValid) {
        MessageBox.warning(this.getText("contactInvalid"));
      }
      return isValid;
    },
    isValidPhone: function _isValidPhone(phone) {
      const digits = phone.replace(/\D/g, "").length;
      return digits >= PHONE_DIGITS.min && digits <= PHONE_DIGITS.max;
    },
    variantIdOf: function _variantIdOf(event) {
      return event.getSource().getBindingContext("cart")?.getProperty("VariantId");
    },
    emptyContact: function _emptyContact() {
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
        },
        states: {
          CustomerName: ValueState.None,
          CustomerEmail: ValueState.None,
          CustomerPhone: ValueState.None
        }
      };
    }
  });
  return Cart;
});
//# sourceMappingURL=Cart-dbg.controller.js.map
