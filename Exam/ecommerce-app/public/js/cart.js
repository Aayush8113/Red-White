let cart = JSON.parse(localStorage.getItem('evostore_cart')) || [];

function saveCart() {
    localStorage.setItem('evostore_cart', JSON.stringify(cart));
    updateCartBadge();
    if (typeof renderCart === 'function') {
        renderCart();
    }
}

function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
        const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
        badge.innerText = totalItems;
        badge.style.display = totalItems > 0 ? 'inline-block' : 'none';
    }
}

function addToCart(productId, title, price, imageUrl) {
    const existing = cart.find(item => item.productId === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ productId, title, price, imageUrl, quantity: 1 });
    }
    saveCart();
    alert(`${title} added to cart!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.productId !== productId);
    saveCart();
}

function updateQuantity(productId, quantity) {
    const existing = cart.find(item => item.productId === productId);
    if (existing) {
        existing.quantity = parseInt(quantity);
        if (existing.quantity <= 0) removeFromCart(productId);
        else saveCart();
    }
}

function clearCart() {
    cart = [];
    saveCart();
}

document.addEventListener('DOMContentLoaded', updateCartBadge);
