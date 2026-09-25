import { renderListWithTemplate } from "./utils.mjs";

function cartItemTemplate(item) {
  return `<li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img src="${item.Images.PrimaryMedium}" alt="${item.Name}" />
    </a>
    <a href="#">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${item.Colors[0].ColorName}</p>
    <p class="cart-card__quantity">qty: ${item.Quantity || 1}</p>
    <p class="cart-card__price">$${item.FinalPrice}</p>
  </li>`;
}

export default class ShoppingCart {
  constructor(key, parentElement) {
    this.key = key;
    this.parentElement = parentElement;
  }

  init() {
    const cartItems = JSON.parse(localStorage.getItem(this.key)) || [];
    this.renderCartContents(cartItems);
    this.calculateTotal(cartItems);
  }

  renderCartContents(cartItems) {
    renderListWithTemplate(cartItemTemplate, this.parentElement, cartItems, "afterbegin", true);
  }

  calculateTotal(cartItems) {
    const total = cartItems.reduce(
      (sum, item) => sum + item.FinalPrice * (item.Quantity || 1),
      0
    );
    document.querySelector("#cart-total").textContent = `$${total.toFixed(2)}`;
  }
}