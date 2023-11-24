export let cart = JSON.parse(localStorage.getItem('cart'));
if (!cart) cart = [];

function SaveCartToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function AddToCart(button) {
  const productID = button.dataset.productId;
  const product = cart.find((prod) => prod.productId === productID);

  const quantityElement = document.getElementById(
    `quantity-select-${productID}`
  );
  const quantity = Number(quantityElement.value);

  if (product) {
    product.quantity += quantity;
  } else {
    cart.push({
      productId: productID,
      quantity: quantity,
    });
  }

  SaveCartToStorage();
}

export function DeleteItemFromCart(cartItemID) {
  cart = cart.filter((cartItem) => cartItem.productId !== cartItemID);
  SaveCartToStorage();
}

export function ClearCart() {
  cart = [];
  SaveCartToStorage();
}
