const myCheckout = new CheckoutProcess("so-cart", ".order-summary");
myCheckout.init();

document.querySelector("#checkoutSubmit").addEventListener("click", (e) => {
  e.preventDefault();
  const myForm = document.querySelector("#checkoutForm");
  const chk_status = myForm.checkValidity();
  myForm.reportValidity();

  if (chk_status) {
    myCheckout.checkout();
  }
});