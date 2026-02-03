import {cart, removeFromCart, saveToCart} from "../data/cart.js";
import {products} from "../data/products.js";
import {formatCurrency} from "./utils/money.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.19/esm/index.js';

const today = dayjs();
let thirdDate = today.format('dddd, MMMM D');
let secondDate = today.add(3, "days").format('dddd, MMMM D');
const freeDeliveryDate = today.add(7, 'days');
let freeDate = (freeDeliveryDate.format('dddd, MMMM D'));
const cartContent = document.querySelector('.js-checkout-grid');
const checkoutContent = document.querySelector('.js-checkout-icon');



function renderCart() {
    if ( cart.length === 0) {
        cartContent.innerHTML = `
      <div class="empty-cart">
        <h2>Your cart is empty</h2>
        <p>Add some products to get started!</p>
        <a href="amazon.html" class="continue-shopping-button button-primary">Continue Shopping</a>
      </div>
    `;
        checkoutQuantity(); // Update the checkout header to show 0
        return; // Exit early
    }
    
    let checkouthtml = '';

    cart.forEach((item) => {
        const productID = item.productId;
        const matchingProduct = products.find(product => product.id === productID);
        
        if (!matchingProduct) {
            console.error('Product not found:', productID);
            return; // Skip this item
        }
        
        checkouthtml += `
        <div class="cart-item-container js-cart-item-container-${productID}" data-product-id="${productID}">
          <div class="delivery-date">
            Delivery date: Tuesday, June 21
          </div>

          <div class="cart-item-details-grid">
            <img class="product-image" src="${matchingProduct.image}" alt="${matchingProduct.name}">

            <div class="cart-item-details">
              <div class="product-name">${matchingProduct.name}</div>
              <div class="product-price">$${formatCurrency(matchingProduct.priceCents)}</div>
              <div class="product-quantity js-quantity-container-${productID}">
                <span>
                  Quantity: <span class="quantity-label js-quantity-label-${productID}">${item.quantity}</span>
                </span>
                <span class="update-quantity-link link-primary js-update-btn" data-product-id="${productID}">Update</span>
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
                  <div class="delivery-option-date">${freeDate}</div>
                  <div class="delivery-option-price">FREE Shipping</div>
                </div>
              </div>
              <div class="delivery-option">
                <input type="radio" class="delivery-option-input js-delivery-option"
                  name="delivery-option-${productID}"
                  data-price="499"
                  data-product-id="${productID}">
                <div>
                  <div class="delivery-option-date">${secondDate}</div>
                  <div class="delivery-option-price">$4.99 - Shipping</div>
                </div>
              </div>
              <div class="delivery-option">
                <input type="radio" class="delivery-option-input js-delivery-option"
                  name="delivery-option-${productID}"
                  data-price="999"
                  data-product-id="${productID}">
                <div>
                  <div class="delivery-option-date">${thirdDate}</div>
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

    // Call these after DOM is updated
    attachDeliveryListeners();
    attachPlaceOrderListener();
    updateOrderSummary();
    checkoutQuantity();
}

// Use event delegation on the parent container
cartContent.addEventListener('click', (e) => {
    // Handle delete button
    if (e.target.classList.contains('js-delete-btn')) {
        e.preventDefault();
        const productID = e.target.dataset.productId;
        removeFromCart(productID);

        const container = document.querySelector(`.js-cart-item-container-${productID}`);
        if (container) {
            container.remove();
        }

        updateOrderSummary();
        checkoutQuantity();
        
        // Re-render if cart is empty
        if (cart.length === 0) {
            renderCart();
        }
    }

    // Handle update button
    if (e.target.classList.contains('js-update-btn')) {
        e.preventDefault();
        const productID = e.target.dataset.productId;

        // Find the current quantity
        let currentQuantity = 1;
        const cartItem = cart.find(item => item.productId === productID);
        if (cartItem) {
            currentQuantity = cartItem.quantity;
        }

        // Show input field
        const quantityContainer = document.querySelector(`.js-quantity-container-${productID}`);
        if (quantityContainer) {
            quantityContainer.innerHTML = `
                <input type="number" class="quantity-input js-quantity-input-${productID}" value="${currentQuantity}" min="1">
                <span class="save-quantity-link link-primary js-save-quantity" data-product-id="${productID}">Save</span>
                <span class="cancel-quantity-link link-primary js-cancel-quantity" data-product-id="${productID}">Cancel</span>
            `;
        }
    }

    // Handle save button
    if (e.target.classList.contains('js-save-quantity')) {
        e.preventDefault();
        const productID = e.target.dataset.productId;
        const inputElement = document.querySelector(`.js-quantity-input-${productID}`);
        
        if (!inputElement) return;
        
        const newQuantity = Number(inputElement.value);

        if (newQuantity > 0) {
            // Update the quantity in cart
            const cartItem = cart.find(item => item.productId === productID);
            if (cartItem) {
                cartItem.quantity = newQuantity;
            }

            // Save to localStorage
            saveToCart();

            // Update the display
            const quantityContainer = document.querySelector(`.js-quantity-container-${productID}`);
            if (quantityContainer) {
                quantityContainer.innerHTML = `
                    <span>
                      Quantity: <span class="quantity-label js-quantity-label-${productID}">${newQuantity}</span>
                    </span>
                    <span class="update-quantity-link link-primary js-update-btn" data-product-id="${productID}">Update</span>
                    <span class="delete-quantity-link link-primary js-delete-btn" data-product-id="${productID}">Delete</span>
                `;
            }

            updateOrderSummary();
            checkoutQuantity();
        } else {
            alert("Min Quantity must be 1!");
        }
    }

    // Handle cancel button
    if (e.target.classList.contains('js-cancel-quantity')) {
        e.preventDefault();
        const productID = e.target.dataset.productId;

        // Find the current quantity
        let currentQuantity = 1;
        const cartItem = cart.find(item => item.productId === productID);
        if (cartItem) {
            currentQuantity = cartItem.quantity;
        }

        // Restore the original display
        const quantityContainer = document.querySelector(`.js-quantity-container-${productID}`);
        if (quantityContainer) {
            quantityContainer.innerHTML = `
                <span>
                  Quantity: <span class="quantity-label js-quantity-label-${productID}">${currentQuantity}</span>
                </span>
                <span class="update-quantity-link link-primary js-update-btn" data-product-id="${productID}">Update</span>
                <span class="delete-quantity-link link-primary js-delete-btn" data-product-id="${productID}">Delete</span>
            `;
        }
    }
});

function attachDeliveryListeners() {
    document.querySelectorAll('.js-delivery-option').forEach((radio) => {
        radio.addEventListener('change', () => {
            updateOrderSummary();
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
        const matchingProduct = products.find(p => p.id === item.productId);
        if (matchingProduct) {
            itemsTotal += (matchingProduct.priceCents * item.quantity);
        }
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

    // Update the DOM safely
    const totalItemsEl = document.querySelector('.js-total-items');
    const itemsTotalEl = document.querySelector('.js-items-total');
    const shippingCostEl = document.querySelector('.js-shipping-cost');
    const subtotalEl = document.querySelector('.js-subtotal');
    const taxEl = document.querySelector('.js-tax');
    const orderTotalEl = document.querySelector('.js-order-total');

    if (totalItemsEl) totalItemsEl.textContent = totalItems;
    if (itemsTotalEl) itemsTotalEl.textContent = `$${(itemsTotal / 100).toFixed(2)}`;
    if (shippingCostEl) shippingCostEl.textContent = `$${(shippingTotal / 100).toFixed(2)}`;
    if (subtotalEl) subtotalEl.textContent = `$${(subtotal / 100).toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${(tax / 100).toFixed(2)}`;
    if (orderTotalEl) orderTotalEl.textContent = `$${(orderTotal / 100).toFixed(2)}`;
}

function checkoutQuantity() {
    let totalItems = 0;
    cart.forEach((item) => {
        totalItems += Number(item.quantity);
    });
    if (checkoutContent) {
        if (totalItems === 0) {
            checkoutContent.innerHTML = `Checkout`;
        } else {
            checkoutContent.innerHTML = `Checkout (${totalItems})`;
        }
    }
}

// Initial render
renderCart();