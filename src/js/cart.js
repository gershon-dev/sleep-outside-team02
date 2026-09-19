import { loadHeaderFooter } from "./utils.mjs";
import ShoppingCart from "./ShoppingCart.mjs";

loadHeaderFooter();

const cartElement = document.querySelector(".product-list");
const myCart = new ShoppingCart("so-cart", cartElement);
myCart.init();