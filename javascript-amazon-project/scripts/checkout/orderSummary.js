import {cart, removeFromCart, saveToCart, updateDeliveryOption} from "../../data/cart.js";
import {getProduct} from "../../data/products.js";
import {formatCurrency} from "../utils/money.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.19/esm/index.js';
import {deliveryOptions, getDeliveryOption, SkipWeekend} from "../../data/deliveryOptions.js";
import {renderPaymentSummary} from "./paymentSummary.js";
import {loadProducts} from "../../data/products.js";

const cartContent = document.querySelector('.js-checkout-grid');
const checkoutContent = document.querySelector('.js-checkout-icon');

export function renderCart() {
    if (cart.length === 0) {
        cartContent.innerHTML = `
            <div class="empty-cart">
                <h2>Your cart is empty</h2>
                <p>Add some products to get started!</p>
                <a href="amazon.html" class="continue-shopping-button button-primary">Continue Shopping</a>
            </div>
        `;
        updateCheckoutQuantity();
        return;
    }

    let checkouthtml = '';

    cart.forEach((item) => {
        const productID = item.productId;
        const matchingProduct = getProduct(productID);

        if (!matchingProduct) {
            console.error('Product not found:', productID);
            return;
        }

        const deliveryOptionId = item.deliveryOptionId || '1';
        const choosenDeliveryOption = getDeliveryOption(deliveryOptionId);

        let date = dayjs().add(choosenDeliveryOption.deliveryDays, 'day');
        date = SkipWeekend(date);
        const deliveryDate = date.format('dddd, MMMM D');

        checkouthtml += `
        <div class="cart-item-container js-cart-item-container js-cart-item-container-${productID}" data-product-id="${productID}">
          <div class="delivery-date">
            Arriving on ${deliveryDate}
          </div>

          <div class="cart-item-details-grid">
            <img class="product-image" src="${matchingProduct.image}" alt="${matchingProduct.name}">

            <div class="cart-item-details">
              <div class="product-name">${matchingProduct.name}</div>
              <div class="product-price">$${matchingProduct.getPrice()}</div>
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
              ${deliveryDateOption(matchingProduct, item)}
            </div>
          </div>
        </div>
      `;
    });

    cartContent.innerHTML = checkouthtml;

    attachDeleteListeners();
    attachUpdateListeners();
    attachDeliveryListeners();
    updateCheckoutQuantity();
}

function deliveryDateOption(matchingProduct, item) {
    let optionsHTML = '';
    deliveryOptions.forEach((option) => {
        // Calculate delivery date and skip weekends
        let date = dayjs().add(option.deliveryDays, 'day');
        date = SkipWeekend(date);
        const deliveryDate = date.format('dddd, MMMM D');

        const priceString = option.priceCents === 0
            ? 'FREE Shipping'
            : `$${formatCurrency(option.priceCents)} - Shipping`;

        const isChecked = option.id === item.deliveryOptionId;

        optionsHTML += `
            <div class="delivery-option js-delivery-option"
                 data-product-id="${matchingProduct.id}"
                 data-delivery-option-id="${option.id}">
              <input type="radio" 
                ${isChecked ? 'checked' : ''}
                class="delivery-option-input"
                name="delivery-option-${matchingProduct.id}">
              <div>
                <div class="delivery-option-date">${deliveryDate}</div>
                <div class="delivery-option-price">${priceString}</div>
              </div>
            </div>
        `;
    });
    return optionsHTML;
}

function attachDeleteListeners() {
    document.querySelectorAll('.js-delete-btn').forEach((button) => {
        button.addEventListener('click', () => {
            const productID = button.dataset.productId;
            removeFromCart(productID);
            renderCart();
            renderPaymentSummary();
        });
    });
}

function attachUpdateListeners() {
    document.querySelectorAll('.js-update-btn').forEach((button) => {
        button.addEventListener('click', () => {
            const productID = button.dataset.productId;
            const cartItem = cart.find(item => item.productId === productID);
            const currentQuantity = cartItem ? cartItem.quantity : 1;

            const quantityContainer = document.querySelector(`.js-quantity-container-${productID}`);
            if (quantityContainer) {
                quantityContainer.innerHTML = `
                    <input type="number" class="quantity-input js-quantity-input-${productID}" value="${currentQuantity}" min="1">
                    <span class="save-quantity-link link-primary js-save-quantity" data-product-id="${productID}">Save</span>
                    <span class="cancel-quantity-link link-primary js-cancel-quantity" data-product-id="${productID}">Cancel</span>
                `;

                // Attach save listener
                document.querySelector(`.js-save-quantity`).addEventListener('click', () => {
                    const inputElement = document.querySelector(`.js-quantity-input-${productID}`);
                    const newQuantity = Number(inputElement.value);

                    if (newQuantity > 0) {
                        const cartItem = cart.find(item => item.productId === productID);
                        if (cartItem) {
                            cartItem.quantity = newQuantity;
                            saveToCart();
                            renderCart();
                            renderPaymentSummary();
                        }
                    } else {
                        alert("Min Quantity must be 1!");
                    }
                });

                // Attach cancel listener
                document.querySelector(`.js-cancel-quantity`).addEventListener('click', () => {
                    renderCart();
                });
            }
        });
    });
}

function attachDeliveryListeners() {
    document.querySelectorAll('.js-delivery-option').forEach((element) => {
        element.addEventListener('click', () => {
            const productId = element.dataset.productId;
            const deliveryOptionId = element.dataset.deliveryOptionId;

            updateDeliveryOption(productId, deliveryOptionId);
            renderCart();
            renderPaymentSummary();
        });
    });
}

function updateCheckoutQuantity() {
    let totalItems = 0;
    cart.forEach((item) => {
        totalItems += Number(item.quantity);
    });

    if (checkoutContent) {
        if (totalItems === 0) {
            checkoutContent.innerHTML = `Checkout`;
        } else {
            checkoutContent.innerHTML = `Checkout (<a class="return-to-home-link" href="amazon.html">${totalItems} items</a>)`;
        }
    }
}