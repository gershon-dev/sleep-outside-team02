import { alertMessage, removeAllFromLocalStorage } from "./utils.mjs";
import ExternalServices from "./Externalservices.mjs";

const services = new ExternalServices();

function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const convertedJSON = {};
  formData.forEach((value, key) => {
    convertedJSON[key] = value;
  });
  return convertedJSON;
}

function packageItems(items) {
  return items.map((item) => ({
    id: item.Id,
    price: item.FinalPrice,
    name: item.Name,
    quantity: 1,
  }));
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = JSON.parse(localStorage.getItem(this.key)) || [];
    this.calculateItemSummary();
  }

  calculateItemSummary() {
    const summaryElement = document.querySelector(this.outputSelector);
    if (!summaryElement) return;

    this.itemTotal = this.list.reduce((sum, item) => sum + item.FinalPrice, 0);
    this.shipping = this.list.length > 0 ? 10 + (this.list.length - 1) * 2 : 0;
    this.tax = this.itemTotal * 0.06;
    this.orderTotal = this.itemTotal + this.shipping + this.tax;

    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const summaryElement = document.querySelector(this.outputSelector);
    if (summaryElement) {
      summaryElement.innerHTML = `
        <p>Item Subtotal: $${this.itemTotal.toFixed(2)}</p>
        <p>Shipping Estimate: $${this.shipping.toFixed(2)}</p>
        <p>Tax: $${this.tax.toFixed(2)}</p>
        <p><strong>Order Total: $${this.orderTotal.toFixed(2)}</strong></p>
      `;
    }
  }

  async checkout() {
    const formElement = document.forms[0];
    const json = formDataToJSON(formElement);

    json.orderDate = new Date().toISOString();
    json.orderTotal = this.orderTotal.toFixed(2);
    json.tax = this.tax.toFixed(2);
    json.shipping = this.shipping;
    json.items = packageItems(this.list);

    try {
      const res = await services.checkout(json);
      removeAllFromLocalStorage(this.key);
      location.assign("/checkout/success.html");
    } catch (err) {
      if (err.name === "servicesError") {
        document.querySelectorAll(".alert").forEach((a) => a.remove());
        for (const message in err.message) {
          alertMessage(err.message[message]);
        }
      } else {
        alertMessage("An error occurred during checkout. Please try again.");
      }
    }
  }
}