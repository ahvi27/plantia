"use strict";
const plants = [
    { id: 1, name: "Monstera", latin: "Monstera deliciosa", price: 38, category: "Statement", art: "monstera", light: "Bright, indirect light", water: "Let the top few centimeters of soil dry between waterings.", note: "Give this climbing plant room to grow. Keep out of reach of pets and children." },
    { id: 2, name: "Snake Plant", latin: "Dracaena trifasciata", price: 24, category: "Easy care", art: "snake", light: "Indirect light; tolerates lower light", water: "Allow soil to dry before watering.", note: "An upright silhouette for shelves and corners. Keep away from pets." },
    { id: 3, name: "Pilea", latin: "Pilea peperomioides", price: 22, category: "Small spaces", art: "pilea", light: "Bright, indirect light", water: "Water when the top layer of soil feels dry.", note: "Round leaves bring a playful touch to a desk. Rotate occasionally for even growth." },
    { id: 4, name: "Rubber Plant", latin: "Ficus elastica", price: 42, category: "Statement", art: "rubber", light: "Bright, indirect light", water: "Let the top layer of soil dry between waterings.", note: "Glossy leaves and a sculptural shape. Keep out of reach of pets and children." },
    { id: 5, name: "ZZ Plant", latin: "Zamioculcas zamiifolia", price: 29, category: "Easy care", art: "zz", light: "Indirect light; tolerates lower light", water: "Allow soil to dry between waterings.", note: "A patient companion with glossy green leaves. Keep away from pets and children." },
    { id: 6, name: "Aloe Vera", latin: "Aloe barbadensis miller", price: 18, category: "Small spaces", art: "aloe", light: "Bright light; introduce direct sun gradually", water: "Let soil dry thoroughly, then water and drain.", note: "A compact succulent for a bright windowsill. Keep away from pets; intended as an ornamental plant." }
];
const $ = (selector) => document.querySelector(selector);
let cart = {};
try {
    const saved = JSON.parse(localStorage.getItem("leaf-root-cart") || "{}");
    if (saved && typeof saved === "object")
        for (const p of plants) {
            const n = saved[p.id];
            if (Number.isInteger(n) && n > 0)
                cart[p.id] = Math.min(n, 99);
        }
}
catch { }
let category = "All";
let toastTimer;
const money = (n) => "$" + n.toFixed(2);
function notify(message) { $("#toast").textContent = message; $("#toast").classList.add("visible"); clearTimeout(toastTimer); toastTimer = setTimeout(() => $("#toast").classList.remove("visible"), 2500); }
function saveCart() { try {
    localStorage.setItem("leaf-root-cart", JSON.stringify(cart));
}
catch { } $("#cart-count").textContent = String(Object.values(cart).reduce((a, b) => a + b, 0)); renderCart(); }
function add(id) { if ((cart[id] || 0) >= 99) {
    notify("Maximum quantity is 99.");
    return;
} cart[id] = (cart[id] || 0) + 1; saveCart(); notify(plants.find(p => p.id === id).name + " added to your bag"); }
function renderProducts() {
    const query = $("#search").value.trim().toLowerCase();
    const sort = $("#sort").value;
    const visible = plants.filter(p => (category === "All" || p.category === category) && (p.name + " " + p.latin).toLowerCase().includes(query));
    if (sort === "low")
        visible.sort((a, b) => a.price - b.price);
    if (sort === "high")
        visible.sort((a, b) => b.price - a.price);
    $("#result-count").textContent = visible.length + " plants to make yourself at home";
    $("#products").innerHTML = visible.length ? visible.map(p => `<article class="product"><div class="product-image"><img src="assets/${p.art}.svg" alt="Illustration of ${p.name}" loading="lazy"><span class="tag">${p.category}</span><button class="detail-button" data-details="${p.id}" aria-label="View ${p.name} care details">↗</button></div><div class="product-title"><h3>${p.name}</h3><span class="price">${money(p.price)}</span></div><p>${p.latin}</p><button class="add-button" data-add="${p.id}">Add to bag +</button></article>`).join("") : '<p class="empty">No plants found. Try another search or category.</p>';
}
function showDetails(id) { const p = plants.find(p => p.id === id); $("#plant-details").innerHTML = `<div class="detail-layout"><img src="assets/${p.art}.svg" alt="Illustration of ${p.name}"><div><p class="eyebrow">${p.category}</p><h2 id="plant-title">${p.name}</h2><p><em>${p.latin}</em></p><strong>${money(p.price)}</strong><ul><li><strong>Light:</strong> ${p.light}</li><li><strong>Water:</strong> ${p.water}</li></ul><p>${p.note}</p><button class="primary" data-add="${p.id}">Add to bag +</button></div></div>`; $("#plant-dialog").showModal(); }
function renderCart() {
    const entries = plants.filter(p => cart[p.id]);
    $("#cart-items").innerHTML = entries.length ? entries.map(p => `<div class="cart-item"><img src="assets/${p.art}.svg" alt=""><div><h3>${p.name}</h3><p>${money(p.price)} each</p><div class="quantity"><button data-change="${p.id}" data-delta="-1" aria-label="Decrease ${p.name} quantity">−</button><span aria-label="Quantity">${cart[p.id]}</span><button data-change="${p.id}" data-delta="1" aria-label="Increase ${p.name} quantity">+</button><button class="remove" data-remove="${p.id}" aria-label="Remove ${p.name}">Remove</button></div></div><strong>${money(p.price * cart[p.id])}</strong></div>`).join("") : '<p>Your bag is waiting for a little green.</p><button class="primary" data-close="cart-dialog">Explore plants ↗</button>';
    const total = entries.reduce((a, p) => a + p.price * cart[p.id], 0);
    $("#cart-summary").innerHTML = entries.length ? `<div class="total"><span>Subtotal</span><span>${money(total)}</span></div><p class="demo-note">Demo store · prices in USD. Shipping and taxes are not calculated. No payment is collected.</p><button class="primary" id="checkout">Preview order ↗</button>` : "";
}
document.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button)
        return;
    if (button.dataset.add)
        add(Number(button.dataset.add));
    if (button.dataset.details)
        showDetails(Number(button.dataset.details));
    if (button.dataset.close)
        $("#" + button.dataset.close).close();
    if (button.dataset.filter) {
        category = button.dataset.filter;
        document.querySelectorAll("[data-filter]").forEach(b => { b.classList.toggle("active", b === button); b.setAttribute("aria-pressed", String(b === button)); });
        renderProducts();
    }
    if (button.dataset.change) {
        const id = Number(button.dataset.change);
        cart[id] = Math.min(99, (cart[id] || 0) + Number(button.dataset.delta));
        if (cart[id] <= 0)
            delete cart[id];
        saveCart();
    }
    if (button.dataset.remove) {
        delete cart[button.dataset.remove];
        saveCart();
    }
    if (button.id === "checkout") {
        $("#cart-summary").innerHTML += '<p class="demo-note" role="status">Your order preview is ready above. This demo has no payment or order submission service.</p>';
        button.disabled = true;
        button.textContent = "Order preview ready ✓";
    }
});
$("#cart-button").addEventListener("click", () => { renderCart(); $("#cart-dialog").showModal(); });
$("#search").addEventListener("input", renderProducts);
$("#sort").addEventListener("change", renderProducts);
document.querySelectorAll("dialog").forEach(d => d.addEventListener("click", event => { if (event.target === d) {
    const r = d.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom)
        d.close();
} }));
$("#year").textContent = String(new Date().getFullYear());

// Theme handling: support `light` | `dark` | `auto` (auto switches by clock)
const THEME_KEY = "leaf-root-theme";
const themeToggle = $("#theme-toggle");
let autoWatcher = null;
function isNightHour() {
    const h = new Date().getHours();
    return (h >= 19 || h < 6); // night between 19:00-05:59
}
function applyTheme(mode) {
    // mode can be 'light', 'dark' or 'auto'
    let effective = mode === "auto" ? (isNightHour() ? "dark" : "light") : mode;
    if (effective === "dark")
        document.documentElement.classList.add("dark");
    else
        document.documentElement.classList.remove("dark");

    if (themeToggle) {
        themeToggle.dataset.mode = mode;
        themeToggle.setAttribute("aria-pressed", effective === "dark" ? "true" : "false");
        if (mode === "auto")
            themeToggle.textContent = "⟳";
        else if (effective === "dark")
            themeToggle.textContent = "🌙";
        else
            themeToggle.textContent = "☀️";
        themeToggle.title = `Theme: ${mode}`;
    }
}
function startAutoWatcher() {
    if (autoWatcher)
        return;
    // check every minute to switch at hour boundaries
    autoWatcher = setInterval(() => {
        const saved = localStorage.getItem(THEME_KEY);
        if (saved === "auto")
            applyTheme("auto");
        else
            stopAutoWatcher();
    }, 60 * 1000);
}
function stopAutoWatcher() {
    if (autoWatcher) {
        clearInterval(autoWatcher);
        autoWatcher = null;
    }
}
function initTheme() {
    try {
        const saved = localStorage.getItem(THEME_KEY);
        if (saved === "dark" || saved === "light") {
            applyTheme(saved);
            stopAutoWatcher();
        }
        else if (saved === "auto") {
            applyTheme("auto");
            startAutoWatcher();
        }
        else {
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            applyTheme(prefersDark ? "dark" : "light");
            stopAutoWatcher();
        }
    }
    catch { }

    if (themeToggle) {
        // clicking cycles: light -> dark -> auto -> light
        themeToggle.addEventListener("click", () => {
            const current = themeToggle.dataset.mode || localStorage.getItem(THEME_KEY) || (document.documentElement.classList.contains("dark") ? "dark" : "light");
            let next;
            if (current === "light")
                next = "dark";
            else if (current === "dark")
                next = "auto";
            else
                next = "light";

            applyTheme(next);
            try { localStorage.setItem(THEME_KEY, next); }
            catch { }

            if (next === "auto")
                startAutoWatcher();
            else
                stopAutoWatcher();
        });
    }
}
initTheme();

renderProducts();
saveCart();
