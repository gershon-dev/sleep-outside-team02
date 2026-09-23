import { getLocalStorage, setLocalStorage } from './utils.mjs';

function renderCartContents() {
  const cartItems = getLocalStorage('so-cart') || [];
  const htmlItems = cartItems.map((item, index) =>
    cartItemTemplate(item, index),
  );

  document.querySelector('.product-list').innerHTML = htmlItems.join('');

  document.querySelectorAll('.cart-card__remove').forEach((button) => {
    button.addEventListener('click', removeCartItem);
  });

  renderCartTotal(cartItems);
}

function renderCartTotal(cartItems) {
  const cartFooter = document.querySelector('.cart-footer');
  const cartTotal = document.querySelector('.cart-total');

  if (cartItems.length === 0) {
    cartFooter.classList.add('hide');
    cartTotal.textContent = '';
    return;
  }

  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.FinalPrice),
    0,
  );
  cartTotal.textContent = `Total: $${total.toFixed(2)}`;
  cartFooter.classList.remove('hide');
}

function removeCartItem(event) {
  const button = event.currentTarget;
  const index = Number(button.dataset.index);
  const cartItems = getLocalStorage('so-cart') || [];

  // The index identifies one entry, even when several entries share an ID.
  if (cartItems[index]?.Id !== button.dataset.id) {
    renderCartContents();
    return;
  }

  cartItems.splice(index, 1);
  setLocalStorage('so-cart', cartItems);
  renderCartContents();

  const remainingButtons = document.querySelectorAll('.cart-card__remove');
  const nextButton =
    remainingButtons[Math.min(index, remainingButtons.length - 1)];

  if (nextButton) nextButton.focus();
  else document.querySelector('.logo a').focus();
}

function cartItemTemplate(item, index) {
  const newItem = `<li class="cart-card divider">
  <button type="button" class="cart-card__remove" data-id="${item.Id}" data-index="${index}" aria-label="Remove item ${index + 1} from cart">&times;</button>
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

renderCartContents();
