import {products} from "./products.js";

export let cart = JSON.parse(localStorage.getItem('cart')) || [];

export function saveToCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

export function addToCart(productId, productName, productPrice, productImage, quantity) {
    let matchingItem;
    cart.forEach((cartItem) => {
        if (productId === cartItem.productId) {
            matchingItem = cartItem;
        }
    });

    if (matchingItem) {
        matchingItem.quantity += quantity;
    } else {
        cart.push({
            productId: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: quantity,
            deliveryOptionId: '1' // Set default delivery option
        });
    }
    saveToCart();
}

export function removeFromCart(productId) {
    const newCart = [];
    cart.forEach((cartItem) => {
        if (cartItem.productId !== productId) {
            newCart.push(cartItem);
        }
    });

    cart = newCart;
    saveToCart();
}

export function updateDeliveryOption(productId, deliveryOptionId) {
    let matchingItem;
    cart.forEach((cartItem) => {
        if (cartItem.productId === productId) {
            matchingItem = cartItem;
        }
    });

    if (matchingItem) {
        matchingItem.deliveryOptionId = deliveryOptionId;
        saveToCart();
    }
}

export function clearCart() {
    cart = [];
    saveToCart();
}

export function loadCart(fun) {
    const xhr = new XMLHttpRequest()

    xhr.addEventListener('load', () => {
        console.log(xhr.response)
        fun();
    })
    xhr.open('GET', 'https://supersimplebackend.dev/cart')
    xhr.send();


}