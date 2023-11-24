import { cart } from '../data/cart.js';

let cartQuantity = 0;

cart.forEach((item) => {
  cartQuantity += item.quantity;
});

const cartQuantityElement = document.querySelector('.js-cart-quantity');
cartQuantityElement.innerHTML = cartQuantity;
