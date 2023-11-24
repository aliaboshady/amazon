import { cart, DeleteItemFromCart, ClearCart } from '../data/cart.js';
import { products } from '../data/products.js';
import { FormatCurrency } from './utils/money.js';

const taxFactor = 0.1;
const shippingMeduim = 499;
const shippingFast = 999;
const shippingDaysSlow = 7;
const shippingDaysMedium = 3;
const shippingDaysFast = 1;

const options = { weekday: 'long', month: 'long', day: 'numeric' };
const today = new Date();
const shippingDateSlow = new Date(today);
const shippingDateMedium = new Date(today);
const shippingDateFast = new Date(today);

shippingDateSlow.setDate(today.getDate() + shippingDaysSlow);
shippingDateMedium.setDate(today.getDate() + shippingDaysMedium);
shippingDateFast.setDate(today.getDate() + shippingDaysFast);

let itemsTotalPrice = 0;
let itemsSubtotalPrice = 0;
let itemsSubtotalPriceWithShipping = 0;
let itemsQuantity = 0;
let totalShipping = 0;

let orderSummaryElement = document.querySelector('.js-order-summary');
let paymentSummaryElement = document.querySelector('.js-payment-summary');

function updateCartInfo() {
  itemsTotalPrice = 0;
  itemsSubtotalPrice = 0;
  itemsQuantity = 0;

  cart.forEach((item) => {
    const product = products.find((prod) => prod.id === item.productId);
    itemsQuantity += item.quantity;
    itemsSubtotalPrice += product.priceCents * item.quantity;
  });

  UpdateTotalShipping();
  itemsSubtotalPriceWithShipping = itemsSubtotalPrice + totalShipping;
  itemsTotalPrice =
    itemsSubtotalPriceWithShipping + itemsSubtotalPriceWithShipping * taxFactor;
}

function UpdatePaymentSummary() {
  updateCartInfo();

  paymentSummaryElement.innerHTML = `
    <div class="payment-summary-title">Order Summary</div>

    <div class="payment-summary-row">
      <div>Items (${itemsQuantity}):</div>
      <div class="payment-summary-money">$${FormatCurrency(
        itemsSubtotalPrice
      )}</div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">$${FormatCurrency(totalShipping)}</div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">$${FormatCurrency(
        itemsSubtotalPriceWithShipping
      )}</div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">$${FormatCurrency(
        itemsSubtotalPriceWithShipping * taxFactor
      )}</div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">$${FormatCurrency(
        itemsTotalPrice
      )}</div>
    </div>

    <a href="orders.html">
      <button ${
        cart.length > 0 ? '' : 'disabled'
      } id="placeOrderButton" class="place-order-button ${
    cart.length > 0 ? 'button-primary' : 'button-disabled'
  }" >
        Place your order
      </button>
    </a>
  `;
}

function UpdateCartSummary() {
  orderSummaryElement.innerHTML = '';
  let cartSummaryHTML = '';

  cart.forEach((item) => {
    const product = products.find((prod) => prod.id === item.productId);
    itemsQuantity += item.quantity;
    itemsSubtotalPrice += product.priceCents;

    cartSummaryHTML += `
      <div class="js-cart-item-container-${product.id} cart-item-container">
        <div class="cart-item-details-grid">
          <img class="product-image"
            src="${product.image}">
  
          <div class="cart-item-details">
            <div class="product-name">
              ${product.name}
            </div>
            <div class="product-price">
              $${FormatCurrency(product.priceCents)}
            </div>
            <div class="product-quantity">
              <span>
                Quantity: <span class="quantity-label">${item.quantity}</span>
              </span>
              <span data-cart-item-id="${
                item.productId
              }" class="js-delete-quantity-link delete-quantity-link link-primary">
                Delete
              </span>
            </div>
          </div>
  
          <div class="delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>
            <div class="delivery-option">
              <input type="radio" checked
                class="delivery-option-input"
                name="delivery-option-${product.id}"
                value=0>
              <div>
                <div class="delivery-option-date">
                  ${shippingDateSlow.toLocaleDateString('en-US', options)}
                </div>
                <div class="deliver y-option-price">
                  FREE Shipping
                </div>
              </div>
            </div>
            <div class="delivery-option">
              <input type="radio"
                class="delivery-option-input"
                name="delivery-option-${product.id}"
                value=${shippingMeduim}>
              <div>
                <div class="delivery-option-date">
                  ${shippingDateMedium.toLocaleDateString('en-US', options)}
                </div>
                <div class="delivery-option-price">
                  $${FormatCurrency(shippingMeduim)} - Shipping
                </div>
              </div>
            </div>
            <div class="delivery-option">
              <input type="radio"
                class="delivery-option-input"
                name="delivery-option-${product.id}"
                value=${shippingFast}>
              <div>
                <div class="delivery-option-date">
                  ${shippingDateFast.toLocaleDateString('en-US', options)}
                </div>
                <div class="delivery-option-price">
                  $${FormatCurrency(shippingFast)} - Shipping
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  orderSummaryElement.innerHTML = cartSummaryHTML;

  UpdatePaymentSummary();
}

UpdateCartSummary();
const placeOrderButtonElement = document.getElementById('placeOrderButton');
placeOrderButtonElement.addEventListener('click', handlePlaceOrder);
// placeOrderButtonElement.disabled = true;

const clearCartButtonElement = document.getElementById('clearButton');
clearCartButtonElement.addEventListener('click', handleClearCart);

// Binding Delete Buttons
const allDeleteButtons = document.querySelectorAll('.js-delete-quantity-link');
allDeleteButtons.forEach((deleteButton) => {
  const cartItemID = deleteButton.dataset.cartItemId;

  deleteButton.addEventListener('click', () => {
    DeleteItemFromCart(cartItemID);

    const container = document.querySelector(
      `.js-cart-item-container-${cartItemID}`
    );
    container.remove();
    UpdatePaymentSummary();
  });
});

// Get Shipping Price
document.querySelectorAll('.delivery-option-input').forEach((radioOption) => {
  radioOption.addEventListener('change', () => {
    UpdateTotalShipping();
    UpdatePaymentSummary();
  });
});

function UpdateTotalShipping() {
  totalShipping = 0;

  document.querySelectorAll('.delivery-option-input').forEach((radioOption) => {
    if (radioOption.checked) {
      totalShipping += Number(radioOption.value);
    }
  });
}

function handlePlaceOrder() {
  ClearCart();
  UpdateCartSummary();
}

function handleClearCart() {
  ClearCart();
  UpdateCartSummary();
}
