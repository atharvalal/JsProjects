import {cart, removeFromCart} from "../data/cart.js";
import {products} from "../data/products.js";
import {formatCurrency} from "./utils/money.js";

const cartContent = document.querySelector('.js-checkout-grid');
const checkoutContent = document.querySelector('.js-checkout-icon');

function renderCart() {
    if (cart.length === 0) {
        cartContent.innerHTML = `
      <div class="empty-cart">
        <h2>Your cart is empty</h2>
        <p>Add some products to get started!</p>
        <a href="//amazon.html" class="continue-shopping-button button-primary">Continue Shopping</a>
      </div>
    `;
        checkoutContent.innerHTML = 'Checkout: 0';
    } else {
        let checkouthtml = '';

        cart.forEach((item) => {
            const productID = item.productId
            let matchingProduct
            products.forEach((product) => {
                if (product.id === productID) {
                    matchingProduct = product;
                }

            })
            checkouthtml += `
        <div class="cart-item-container js-cart-item-container-${productID}"   data-product-id="${productID}">
          <div class="delivery-date">
            Delivery date: Tuesday, June 21
          </div>

          <div class="cart-item-details-grid">
            <img class="product-image" src="${matchingProduct.image}" alt="${item.name}">

            <div class="cart-item-details">
              <div class="product-name">${matchingProduct.name}</div>
              <div class="product-price">$${formatCurrency(matchingProduct.priceCents)}</div>
              <div class="product-quantity">
                <span>
                  Quantity: <span class="quantity-label">${item.quantity}</span>
                </span>
                <span class="update-quantity-link link-primary">Update</span>
                <span class="delete-quantity-link link-primary js-delete-btn" data-product-id="${productID}">Delete</span>
                
              </div>
            </div>

            <div class="delivery-options">
              <div class="delivery-options-title">Choose a delivery option:</div>
              <div class="delivery-option">
                <input type="radio" checked class="delivery-option-input js-delivery-option"
                  name="delivery-option-${productID}"
                  data-price="0"
                  data-product-id="${productID}">
                <div>
                  <div class="delivery-option-date">Tuesday, June 21</div>
                  <div class="delivery-option-price">FREE Shipping</div>
                </div>
              </div>
              <div class="delivery-option">
                <input type="radio" class="delivery-option-input js-delivery-option"
                  name="delivery-option-${productID}"
                  data-price="499"
                  data-product-id="${productID}">
                <div>
                  <div class="delivery-option-date">Wednesday, June 15</div>
                  <div class="delivery-option-price">$4.99 - Shipping</div>
                </div>
              </div>
              <div class="delivery-option">
                <input type="radio" class="delivery-option-input js-delivery-option"
                  name="delivery-option-${productID}"
                  data-price="999"
                  data-product-id="${productID}">
                <div>
                  <div class="delivery-option-date">Monday, June 13</div>
                  <div class="delivery-option-price">$9.99 - Shipping</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
        });

        // Add payment summary outside the loop
        checkouthtml += `
      <div class="payment-summary">
        <div class="payment-summary-title">
          Order Summary
        </div>

        <div class="payment-summary-row">
          <div>Items (<span class="js-total-items">0</span>):</div>
          <div class="payment-summary-money js-items-total">$0.00</div>
        </div>

        <div class="payment-summary-row">
          <div>Shipping &amp; handling:</div>
          <div class="payment-summary-money js-shipping-cost">$0.00</div>
        </div>

        <div class="payment-summary-row subtotal-row">
          <div>Total before tax:</div>
          <div class="payment-summary-money js-subtotal">$0.00</div>
        </div>

        <div class="payment-summary-row">
          <div>Estimated tax (10%):</div>
          <div class="payment-summary-money js-tax">$0.00</div>
        </div>

        <div class="payment-summary-row total-row">
          <div>Order total:</div>
          <div class="payment-summary-money js-order-total">$0.00</div>
        </div>

        <button class="place-order-button button-primary js-place-order">
          Place your order
        </button>
      </div>
    `;

        cartContent.innerHTML = checkouthtml;

        attachDeleteListeners();
        attachPlaceOrderListener();
        updateOrderSummary();
        checkoutQuantity();
    }
}

//remove btn from checkout
function attachDeleteListeners() {
    document.querySelectorAll('.js-delete-btn').forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const productID = link.dataset.productId;
            removeFromCart(productID);

            const container = document.querySelector(`.js-cart-item-container-${productID}`);
            container.remove();

            updateOrderSummary();
            checkoutQuantity();
        });
    });
}


function attachPlaceOrderListener() {
    const placeOrderBtn = document.querySelector('.js-place-order');

    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', () => {
            window.location.href = 'orders.html';
        });
    }
}

function updateOrderSummary() {
    // Calculate items total
    let itemsTotal = 0;
    let totalItems = 0;

    cart.forEach((item) => {
        itemsTotal += (item.price * item.quantity);
        totalItems += Number(item.quantity);
    });

    // Calculate shipping total
    let shippingTotal = 0;
    const selectedDeliveryOptions = document.querySelectorAll('.js-delivery-option:checked');

    selectedDeliveryOptions.forEach((option) => {
        shippingTotal += Number(option.dataset.price);
    });

    // Calculate subtotal
    const subtotal = itemsTotal + shippingTotal;

    // Calculate tax (10%)
    const tax = subtotal * 0.1;

    // Calculate order total
    const orderTotal = subtotal + tax;

    // Update the DOM
    document.querySelector('.js-total-items').textContent = totalItems;
    document.querySelector('.js-items-total').textContent = `$${(itemsTotal / 100).toFixed(2)}`;
    document.querySelector('.js-shipping-cost').textContent = `$${(shippingTotal / 100).toFixed(2)}`;
    document.querySelector('.js-subtotal').textContent = `$${(subtotal / 100).toFixed(2)}`;
    document.querySelector('.js-tax').textContent = `$${(tax / 100).toFixed(2)}`;
    document.querySelector('.js-order-total').textContent = `$${(orderTotal / 100).toFixed(2)}`;
}


function checkoutQuantity() {
    let totalItems = 0;
    cart.forEach((item) => {
        totalItems += Number(item.quantity);
    });
    checkoutContent.innerHTML = `Checkout: ${totalItems}`;
}

// Initial render
renderCart();