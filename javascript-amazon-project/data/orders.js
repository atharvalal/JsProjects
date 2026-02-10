import {getProduct, loadProductsFetch} from './products.js';
import {addToCart, cart} from './cart.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.19/esm/index.js';

export let orders = JSON.parse(localStorage.getItem('orders')) || [];

export function addOrder(order) {
    orders.unshift(order);
    saveToStorage();
}

function saveToStorage() {
    localStorage.setItem('orders', JSON.stringify(orders));
}

export function renderOrders() {
    const orderContainer = document.querySelector('.js-orders-grid');

    if (!orderContainer) return;

    if (orders.length === 0) {
        orderContainer.innerHTML = `
            <div class="no-orders">
                <h2>No orders yet</h2>
                <p>Start shopping to see your orders here!</p>
                <a href="amazon.html" class="button-primary">Continue Shopping</a>
            </div>
        `;
        return;
    }

    let orderContainerHTML = '';

    orders.forEach(order => {
        const orderDate = dayjs(order.orderTime).format('MMMM D');

        orderContainerHTML += `
            <div class="order-container">
                <div class="order-header">
                    <div class="order-header-left-section">
                        <div class="order-date">
                            <div class="order-header-label">Order Placed:</div>
                            <div>${orderDate}</div>
                        </div>
                        <div class="order-total">
                            <div class="order-header-label">Total:</div>
                            <div>$${(order.totalCostCents / 100).toFixed(2)}</div>
                        </div>
                    </div>
                    <div class="order-header-right-section">
                        <div class="order-header-label">Order ID:</div>
                        <div>${order.id}</div>
                    </div>
                </div>
                <div class="order-details-grid">
                    ${order.products.map(product => {
            const productData = getProduct(product.productId);
            if (!productData) return '';

            const deliveryDate = dayjs(product.estimatedDeliveryTime).format('MMMM D');

            return `
                            <div class="product-image-container">
                                <img src="${productData.image}" alt="${productData.name}">
                            </div>
                            <div class="product-details">
                                <div class="product-name">${productData.name}</div>
                                <div class="product-delivery-date">Arriving on: ${deliveryDate}</div>
                                <div class="product-quantity">Quantity: ${product.quantity}</div>
                                <button class="buy-again-button button-primary js-buy-again" 
                                        data-product-id="${product.productId}">
                                    <img class="buy-again-icon" src="images/icons/buy-again.png">
                                    <span class="buy-again-message">Buy it again</span>
                                </button>
                            </div>
                            <div class="product-actions">
                                <a href="tracking.html?orderId=${order.id}&productId=${product.productId}">
                                    <button class="track-package-button button-secondary">Track package</button>
                                </a>
                            </div>
                        `;
        }).join('')}
                </div>
            </div>
        `;
    });

    orderContainer.innerHTML = orderContainerHTML;
    attachBuyAgainListeners();
}

function updateCartQuantity() {
    const cartQuantityElement = document.querySelector('.js-cart-quantity');
    if (cartQuantityElement) {
        const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartQuantityElement.innerHTML = totalQuantity;
    }
}

function attachBuyAgainListeners() {
    document.querySelectorAll('.js-buy-again').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.dataset.productId;
            const product = getProduct(productId);

            if (product) {
                addToCart(productId, product.name, product.priceCents, product.image, 1);
                updateCartQuantity(); // Update cart quantity immediately
            }

            button.textContent = 'Added!';
            setTimeout(() => {
                button.innerHTML = `
                    <img class="buy-again-icon" src="images/icons/buy-again.png">
                    <span class="buy-again-message">Buy it again</span>
                `;
            }, 1000);
        });
    });
}

loadProductsFetch().then(() => {
    renderOrders();
    updateCartQuantity(); // Use the same function for consistency
})



