import { cart, AddToCart } from '../data/cart.js';
import { products } from '../data/products.js';
import { FormatCurrency } from './utils/money.js';

let productsHTML = '';
UpdateProductsList('');
UpdateCartQuantity();

function UpdateProductsList(searchPhrase = '') {
  let filteredProducts;
  productsHTML = '';

  if (searchPhrase === '') {
    filteredProducts = products;
  } else {
    filteredProducts = products.filter((product) =>
      product.name.toLowerCase().includes(searchPhrase.toLowerCase())
    );
  }

  filteredProducts.forEach((product) => {
    productsHTML += `
      <div class="product-container">
        <div class="product-image-container">
          <img class="product-image"
            src="${product.image}">
        </div>
  
        <div class="product-name limit-text-to-2-lines">
        ${product.name}
        </div>
  
        <div class="product-rating-container">
          <img class="product-rating-stars"
            src="images/ratings/rating-${product.rating.stars * 10}.png">
          <div class="product-rating-count link-primary">
          ${product.rating.count}
          </div>
        </div>
  
        <div class="product-price">
          $${FormatCurrency(product.priceCents)}
        </div>
  
        <div class="product-quantity-container">
          <select id="quantity-select-${product.id}">
            <option selected value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </div>
  
        <div class="product-spacer"></div>
  
        <div class="added-to-cart">
          <img src="images/icons/checkmark.png">
          Added
        </div>
  
        <button data-product-id="${
          product.id
        }" class="js-add-to-cart add-to-cart-button button-primary">
          Add to Cart
        </button>
      </div>
    `;
  });

  document.querySelector('.js-products-grid').innerHTML = productsHTML;

  document.querySelectorAll('.js-add-to-cart').forEach((button) => {
    button.addEventListener('click', () => {
      AddToCart(button);
      UpdateCartQuantity();
    });
  });
}

// Update Cart Quantity
function UpdateCartQuantity() {
  let cartQuantity = 0;
  const cartQuantityElement = document.querySelector('.js-cart-quantity');

  cart.forEach((product) => {
    cartQuantity += product.quantity;
  });

  cartQuantityElement.innerHTML = cartQuantity;
}

// Search Bar
const searchButtonElement = document.querySelector(
  '.js-amazon-header-middle-section'
);
if (searchButtonElement) {
  searchButtonElement.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchBarElement = document.querySelector('.js-search-bar');
    if (searchBarElement) {
      UpdateProductsList(searchBarElement.value);
    }
  });
}
