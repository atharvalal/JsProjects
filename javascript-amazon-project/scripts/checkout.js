import {renderCart} from "./checkout/orderSummary.js";
import {renderPaymentSummary} from "./checkout/paymentSummary.js";
import "../data/cart-class.js";
import {loadProductsFetch, loadProducts} from "../data/products.js";
import {loadCart} from "../data/cart.js";


async function loadPage() {
    try {

        await loadProductsFetch()
        const value = await new Promise((resolve, reject) => {
            loadCart(() => {
                // reject('error loading cart')
                resolve()
            })
        })

    } catch (error) {
        alert('error loading products, please try again later')
    }
    renderCart();
    renderPaymentSummary();

}

loadPage();


/*
Promise.all([
    loadProductsFetch(),
    new Promise((resolve) => {
        loadCart(() => {
            resolve()
        })
    })

]).then((values) => {
    console.log(values)
    console.log('finished loading cart')
    renderCart();
    renderPaymentSummary();
})
 */
/*
new Promise((resolve) => {
    console.log('start promise')
    loadProducts(() => {
        console.log('finished loading products')
        resolve('value1')
    })
}).then((value) => {
    console.log(value)
    return new Promise((resolve) => {
        loadCart(() => {
            resolve()
        })
    }).then(() => {
        console.log('finished loading cart')
        renderCart();
        renderPaymentSummary();
    })

})
*/