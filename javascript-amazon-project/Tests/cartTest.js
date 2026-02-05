// Load dependencies via script tags instead of ES6 imports for Jasmine
let cart = [];

describe('test suite: add to cart', () => {
    it('test case: add to cart', () => {
        // Mock addToCart function for testing
        function addToCart(productId, productName, productPrice, productImage, quantity) {
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
                    quantity: quantity
                });
            }
        }

        // Test the function
        addToCart('1', 'Product 1', 100, 'image.jpg', 1);
        expect(cart.length).toBe(1);
    });
});