import {cart, removeFromCart, saveToCart, updateDeliveryOption} from "../../data/cart.js";
import {products} from "../../data/products.js";
import {formatCurrency} from "../utils/money.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.19/esm/index.js';
import {deliveryOptions} from "../../data/deliveryOptions.js";

const today = dayjs();
let fastDate = today.add(1, "day");
let thirdDate = fastDate.format('dddd, MMMM D');
let secondDate = today.add(3, "days").format('dddd, MMMM D');
const freeDeliveryDate = today.add(7, 'days');
let freeDate = (freeDeliveryDate.format('dddd, MMMM D'));
const cartContent = document.querySelector('.js-checkout-grid');
const checkoutContent = document.querySelector('.js-checkout-icon');



export function renderCart() {
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
        

        // Find which delivery speed the user selected
const chosenDelivery = deliveryOptions.find((option) => {
  return option.id === item.deliveryOptionId;
}) || deliveryOptions[0]; // Default to first option if not found

// Calculate when it arrives
      const today = dayjs();
      const deliveryDate = today.add(chosenDelivery.deliveryDays, 'day').format('dddd, MMMM D');
        checkouthtml += `
        <div class="cart-item-container js-cart-item-container-${productID}" data-product-id="${productID}">
          <div class="delivery-date">
            Arriving on ${deliveryDate}
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
              <div class="delivery-options-title">
              Choose a delivery option:
              </div>
            ${deliveryDateOption(matchingProduct,item)}
  
              
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

function deliveryDateOption(matchingProduct, item) {
  let optionsHTML = '';
  deliveryOptions.forEach((option) => {
    const today = dayjs();
    const deliveryDate = today.add(option.deliveryDays, 'day').format('dddd, MMMM D');

    const priceString = option.priceCents === 0 ? 'FREE Shipping' : `$${formatCurrency(option.priceCents)} - Shipping`;
    const isChecked = option.id === item.deliveryOptionId; 
    optionsHTML += `
              <div class="delivery-option">
                <input type="radio" 
                ${isChecked ? 'checked' : ''}
                class="delivery-option-input js-delivery-option"
                  name="delivery-option-${matchingProduct.id}"
                  data-price="${option.priceCents}"
                  data-date="${deliveryDate}"
                  data-option-id="${option.id}"
                  data-product-id="${matchingProduct.id}">
                <div>
                  <div class="delivery-option-date">${deliveryDate}</div>
                  <div class="delivery-option-price">${priceString}</div>
                </div>
              </div>`
  })
  return optionsHTML;
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
    document.querySelectorAll('.js-delivery-option').forEach((input) => {
        input.addEventListener('click', () => {
          const productId = input.dataset.productId;
          const deliveryOptionId = input.dataset.optionId;
          const selectedDate = input.dataset.date;
          
          // Update the cart data
          updateDeliveryOption(productId, deliveryOptionId);
          
          // Update the delivery date display
          renderCart(); // Re-render the cart to update the delivery date and shipping cost
          
          // Recalculate the order summary with new shipping costs
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
