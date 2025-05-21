// script.js
// script.js
const cart = [];

function addToCart(productName, price) {
  cart.push({ name: productName, price: price });
  renderCart();
}

function renderCart() {
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');

  cartItems.innerHTML = '';
  let total = 0;
  cart.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.name} - ₹${item.price}`;
    cartItems.appendChild(li);
    total += item.price;
  });

  cartTotal.textContent = total;
}

document.getElementById('newsletter-form').addEventListener('submit', function(e) {
  e.preventDefault();
  alert('Thanks for subscribing to our newsletter! 🌿');
});

// Optional GSAP animations
window.addEventListener('load', () => {
  gsap.from('.hero-content', { opacity: 0, y: 50, duration: 1 });
  gsap.from('.main-nav li', { opacity: 0, y: -20, duration: 1, stagger: 0.2 });
  gsap.from('.content-section, .vision-mission, .shop-section', {
    scrollTrigger: {
      trigger: '.content-section',
      start: 'top 80%',
    },
    opacity: 0,
    y: 50,
    duration: 1,
    stagger: 0.3
  });
});
