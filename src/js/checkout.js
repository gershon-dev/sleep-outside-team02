import { loadHeaderFooter, alertMessage, setLocalStorage } from './utils.mjs';
import CheckoutProcess from './CheckoutProcess.mjs';

loadHeaderFooter();

const checkoutProcess = new CheckoutProcess('so-cart', '.order-summary');
checkoutProcess.init();

document.querySelector('#zip').addEventListener('blur', () => {
  checkoutProcess.calculateOrderTotal();
});

document.forms['checkout'].addEventListener('submit', (event) => {
  event.preventDefault();

  const form = event.target;
  const isValid = form.checkValidity();
  if (!isValid) {
    form.reportValidity();
    return;
  }

  checkoutProcess
    .checkout(form)
    .then(() => {
      setLocalStorage('so-cart', []);
      window.location.href = '../checkout/success.html';
    })
    .catch((err) => {
      console.error(err);
      const message =
        err?.message?.message || err?.message || 'Something went wrong with your order. Please try again.';
      alertMessage(message);
    });
});