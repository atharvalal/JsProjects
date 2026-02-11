import {getProduct, loadProductsFetch} from './products.js';
import {orders} from './orders.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.19/esm/index.js';

export function renderTrackingPage() {
    const url = new URL(window.location.href);
    const orderId = url.searchParams.get('orderId');
    const productId = url.searchParams.get('productId');

    if (!orderId || !productId) {
        document.querySelector('.main').innerHTML = `
            <div class="error-message">
                <h2>Tracking Information Not Found</h2>
                <p>Please ensure you have a valid order ID and product ID.</p>
                <a href="orders.html" class="button-primary">View Orders</a>
            </div>
        `;
        return;
    }

    // Find the specific order
    const order = orders.find(o => o.id === orderId);
    if (!order) {
        document.querySelector('.main').innerHTML = `
            <div class="error-message">
                <h2>Order Not Found</h2>
                <p>Order ID: ${orderId} could not be found.</p>
                <a href="orders.html" class="button-primary">View Orders</a>
            </div>
        `;
        return;
    }

    // Find the specific product in the order
    const orderProduct = order.products.find(p => p.productId === productId);
    if (!orderProduct) {
        document.querySelector('.main').innerHTML = `
            <div class="error-message">
                <h2>Product Not Found in Order</h2>
                <p>This product was not found in order ${orderId}.</p>
                <a href="orders.html" class="button-primary">View Orders</a>
            </div>
        `;
        return;
    }

    // Get product details
    const product = getProduct(productId);
    if (!product) {
        document.querySelector('.main').innerHTML = `
            <div class="error-message">
                <h2>Product Not Found</h2>
                <p>Product details could not be loaded.</p>
                <a href="orders.html" class="button-primary">View Orders</a>
            </div>
        `;
        return;
    }

    // Calculate delivery status based on dates
    const orderDate = dayjs(order.orderTime);
    const deliveryDate = dayjs(orderProduct.estimatedDeliveryTime);
    const currentDate = dayjs();

    // Determine delivery status
    let deliveryStatus = 'Preparing';
    let progressPercentage = 0;

    if (currentDate.isAfter(deliveryDate)) {
        deliveryStatus = 'Delivered';
        progressPercentage = 100;
    } else if (currentDate.isAfter(orderDate.add(1, 'day'))) {
        deliveryStatus = 'Shipped';
        progressPercentage = 66;
    } else {
        deliveryStatus = 'Preparing';
        progressPercentage = 33;
    }

    // Format dates
    const deliveryDateFormatted = deliveryDate.format('dddd, MMMM D');
    const orderDateFormatted = orderDate.format('MMMM D');

    // Render the tracking information
    document.querySelector('.main').innerHTML = `
        <div class="order-tracking">
            <a class="back-to-orders-link link-primary" href="orders.html">
                View all orders
            </a>

            <div class="delivery-date">
                Arriving on ${deliveryDateFormatted}
            </div>

            <div class="product-info">
                ${product.name}
            </div>

            <div class="product-info">
                Quantity: ${orderProduct.quantity}
            </div>

            <div class="product-info">
                Order placed on ${orderDateFormatted}
            </div>

            <img class="product-image" src="${product.image}">

            <div class="progress-labels-container">
                <div class="progress-label ${deliveryStatus === 'Preparing' ? 'current-status' : ''}">
                    Preparing
                </div>
                <div class="progress-label ${deliveryStatus === 'Shipped' ? 'current-status' : ''}">
                    Shipped
                </div>
                <div class="progress-label ${deliveryStatus === 'Delivered' ? 'current-status' : ''}">
                    Delivered
                </div>
            </div>

            <div class="progress-bar-container">
                <div class="progress-bar" style="width: ${progressPercentage}%"></div>
            </div>

            <div class="tracking-details">
                <h3>Tracking Details</h3>
                <div class="tracking-info">
                    <p><strong>Order ID:</strong> ${orderId}</p>
                    <p><strong>Product ID:</strong> ${productId}</p>
                    <p><strong>Estimated Delivery:</strong> ${deliveryDateFormatted}</p>
                    <p><strong>Current Status:</strong> ${deliveryStatus}</p>
                </div>
            </div>
        </div>
    `;
}

// Initialize the tracking page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadProductsFetch().then(() => {
        renderTrackingPage();
    });
});