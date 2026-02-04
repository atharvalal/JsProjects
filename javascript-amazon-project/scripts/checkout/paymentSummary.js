import {cart} from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import { deliveryOptions, getDeliveryOption } from "../../data/deliveryOptions.js";
export function renderPaymentSummary() {
    let productTotalCents = 0;
    let shippingcost =0;
    let totalItems =0;
    cart.forEach((cartItem) => {
    const product =  getProduct(cartItem.productId);
    productTotalCents += product.priceCents * cartItem.quantity;
    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    shippingcost += deliveryOption.priceCents;
    totalItems += cartItem.quantity;
    
    
    })
    
    const totalBeforeTaxCents = productTotalCents + shippingcost;
    const estimatedTaxCents = Math.round(totalBeforeTaxCents * 0.1);
    const orderTotalCents = totalBeforeTaxCents + estimatedTaxCents;
    let paymentSummaryHTML = `
    <div class="payment-summary-item">
        <span>Items (${totalItems}):</span>
        <span>$${formatCurrency(productTotalCents)}</span>
    </div>
    <div class="payment-summary-item">
        <span>Shipping & Handling:</span>
        <span>$${formatCurrency(shippingcost)}</span>
    </div>
    <div class="payment-summary-item">
        <span>Total before tax:</span>
        <span>$${formatCurrency(totalBeforeTaxCents)}</span>
    </div>
    <div class="payment-summary-item">
        <span>Estimated Tax:</span>
        <span>$${formatCurrency(estimatedTaxCents)}</span>
    </div>
    <div class="payment-summary-total">
        <span>Order Total:</span>
        <span>$${formatCurrency(orderTotalCents)}</span>
    </div>
    <button class="place-order-button button-primary js-place-order-btn">Place your order</button>
    `;
    const paymentSummaryContainer = document.querySelector('.js-payment-summary');
    paymentSummaryContainer.innerHTML = paymentSummaryHTML;
    
    // Add click listener for place order button
    document.querySelector('.js-place-order-btn').addEventListener('click', () => {
        window.location.href = 'orders.html';
    });
}
