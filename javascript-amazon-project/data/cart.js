export let cart = JSON.parse(localStorage.getItem('cart')) || [];


export function saveToCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}


export function addToCart(productId, productName, productPrice, productImage, quantity) {
    let matchingItem
    cart.forEach((cartItem) => {
        if (productId === cartItem.productId) {
            matchingItem = cartItem;
        }
    })

    if (matchingItem) {
        matchingItem.quantity += quantity
    } else {
        cart.push({
            productId: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: quantity
        })
    }
    saveToCart()

}

export function removeFromCart(productId) {
    const newCart = []
    cart.forEach((cartItem) => {
        if (cartItem.productId !== productId) {
            newCart.push(cartItem)
        }
    })

    cart = newCart
    saveToCart()

}

