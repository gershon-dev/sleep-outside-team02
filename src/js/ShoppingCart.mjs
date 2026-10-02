import {
  getLocalStorage,
  renderListWithTemplate,
  setLocalStorage,
} from './utils.mjs';

function cartItemTemplate(item, index) {
  const quantity = item.Quantity || 1;

  return `<li class="cart-card divider">
    <button
      type="button"
      class="cart-card__remove"
      data-id="${item.Id}"
      data-index="${index}"
      aria-label="Remove item ${index + 1} from cart"
    >&times;</button>

    <a href="#" class="cart-card__image">
      <img
        src="${item.Images?.PrimaryMedium || item.Image}"
        alt="${item.Name}"
      />
    </a>

    <a href="#">
      <h2 class="card__name">${item.Name}</h2>
    </a>

    <p class="cart-card__color">${item.Colors[0].ColorName}</p>

    <div class="cart-card__quantity">
      <span>Qty:</span>

      <button
        type="button"
        class="cart-card__quantity-button"
        data-id="${item.Id}"
        data-action="decrease"
        aria-label="Decrease quantity of ${item.Name}"
      >
        -
      </button>

      <span class="cart-card__quantity-value">${quantity}</span>

      <button
        type="button"
        class="cart-card__quantity-button"
        data-id="${item.Id}"
        data-action="increase"
        aria-label="Increase quantity of ${item.Name}"
      >
        +
      </button>
    </div>

    <p class="cart-card__price">$${item.FinalPrice}</p>
  </li>`;
}

export default class ShoppingCart {
  constructor(key, parentElement) {
    this.key = key;
    this.parentElement = parentElement;
  }

  init() {
    const cartItems = getLocalStorage(this.key) || [];
    this.renderCartContents(cartItems);
  }

  renderCartContents(cartItems) {
    const footerElement = document.querySelector('.cart-footer');
    const totalElement = document.querySelector('.cart-total');

    if (cartItems.length > 0) {
      if (footerElement) {
        footerElement.classList.remove('hide');
      }

      if (totalElement) {
        const total = cartItems.reduce(
          (sum, item) => sum + item.FinalPrice * (item.Quantity || 1),
          0,
        );

        totalElement.innerText = `Total: $${total.toFixed(2)}`;
      }
    } else {
      if (footerElement) {
        footerElement.classList.add('hide');
      }
    }

    renderListWithTemplate(
      cartItemTemplate,
      this.parentElement,
      cartItems,
      'afterbegin',
      true,
    );

    // Remove buttons
    this.parentElement
      .querySelectorAll('.cart-card__remove')
      .forEach((button) => {
        button.addEventListener('click', (event) => this.removeItem(event));
      });

    // Quantity buttons
    this.parentElement
      .querySelectorAll('.cart-card__quantity-button')
      .forEach((button) => {
        button.addEventListener('click', (event) =>
          this.changeQuantity(event),
        );
      });
  }

  changeQuantity(event) {
    const button = event.currentTarget;
    const productId = button.dataset.id;
    const action = button.dataset.action;

    const cartItems = getLocalStorage(this.key) || [];

    const item = cartItems.find((cartItem) => cartItem.Id === productId);

    if (!item) return;

    const currentQuantity = item.Quantity || 1;

    if (action === 'increase') {
      item.Quantity = currentQuantity + 1;
    }

    if (action === 'decrease') {
      item.Quantity = Math.max(1, currentQuantity - 1);
    }

    setLocalStorage(this.key, cartItems);
    this.renderCartContents(cartItems);
  }

  removeItem(event) {
    const button = event.currentTarget;
    const index = Number(button.dataset.index);
    const cartItems = getLocalStorage(this.key) || [];

    if (cartItems[index]?.Id !== button.dataset.id) {
      this.renderCartContents(cartItems);
      return;
    }

    cartItems.splice(index, 1);

    setLocalStorage(this.key, cartItems);

    this.renderCartContents(cartItems);

    const remainingButtons =
      this.parentElement.querySelectorAll('.cart-card__remove');

    const nextButton =
      remainingButtons[Math.min(index, remainingButtons.length - 1)];

    if (nextButton) {
      nextButton.focus();
    } else {
      document.querySelector('.logo a')?.focus();
    }
  }
}