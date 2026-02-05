function Cart(localStorageKey) {
    const cart = {
        cartItems: JSON.parse(localStorage.getItem(localStorageKey)) || [],

        saveToCart: function () {
            localStorage.setItem(localStorageKey, JSON.stringify(this.cartItems));
        },

        addToCart: function (productId, productName, productPrice, productImage, quantity) {
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
        },

        removeFromCart: function (productId) {
            this.cartItems = this.cartItems.filter((cartItem) => cartItem.productId !== productId);
            this.saveToCart();
        },

        updateDeliveryOption: function (productId, deliveryOptionId) {
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
        }
    };


    return cart;
}

const cart = Cart('cart-oop');
const businessCart = Cart('cart-business');
console.log(cart)
console.log(businessCart)
export default cart;

