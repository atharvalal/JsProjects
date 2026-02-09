class Cart {
    #localStorageKey = undefined;

    constructor(localStorageKey) {
        this.#localStorageKey = localStorageKey

    }

    cartItems = JSON.parse(localStorage.getItem(this.#localStorageKey)) || [];
    saveToCart = function () {
        localStorage.setItem(this.#localStorageKey, JSON.stringify(this.cartItems));
    };
    addToCart = function (productId, productName, productPrice, productImage, quantity) {
        let matchingItem;
        this.cartItems.forEach((cartItem) => {
            if (productId === cartItem.productId) {
                matchingItem = cartItem;
            }
        });

        if (matchingItem) {
            matchingItem.quantity += quantity;
        } else {
            this.cartItems.push({
                productId: productId,
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: quantity,
                deliveryOptionId: '1'
            });
        }
        this.saveToCart();
    }
    removeFromCart = function (productId) {
        this.cartItems = this.cartItems.filter((cartItem) => cartItem.productId !== productId);
        this.saveToCart();
    }
    updateDeliveryOption = function (productId, deliveryOptionId) {
        let matchingItem;
        this.cartItems.forEach((cartItem) => {
            if (cartItem.productId === productId) {
                matchingItem = cartItem;
            }
        });

        if (matchingItem) {
            matchingItem.deliveryOptionId = deliveryOptionId;
            this.saveToCart();
        }
    };

}

const cart = new Cart('cart-oop')
const businessCart = new Cart('cart-business')
cart.addToCart('83d4ca15-0f35-48f5-b7a3-1ea210004f2e', 'test', '100', 'test', 1)

export default cart;

