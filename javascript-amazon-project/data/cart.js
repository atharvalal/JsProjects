export let cart =[]

export function addToCart(productId,productName,productPrice,productImage,quantity){
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

}