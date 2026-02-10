import {cart, clearCart} from "../../data/cart.js";
import {getProduct} from "../../data/products.js";
import {formatCurrency} from "../utils/money.js";
import {deliveryOptions, getDeliveryOption} from "../../data/deliveryOptions.js";
import {addOrder} from "../../data/orders.js";

export function renderPaymentSummary() {
    let productTotalCents = 0;
    let shippingcost = 0;
    let totalItems = 0;
    cart.forEach((cartItem) => {
        const product = getProduct(cartItem.productId);
        productTotalCents += product.priceCents * cartItem.quantity;
        const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
        shippingcost += deliveryOption.priceCents;
        totalItems += cartItem.quantity;


    })

    const totalBeforeTaxCents = productTotalCents + shippingcost;
    const estimatedTaxCents = (totalBeforeTaxCents * 0.1);
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
    document.querySelector('.js-place-order-btn')
        .addEventListener('click', async () => {
            try {
                const response = await fetch('https://supersimplebackend.dev/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({cart: cart})
                })
                const order = await response.json();

                addOrder(order);
                clearCart();
            } catch (error) {
                alert("failed to load orders, try again later")
            }

            window.location.href = 'orders.html'
        });
}
