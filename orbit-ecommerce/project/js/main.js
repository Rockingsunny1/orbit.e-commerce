/* =========================================================
   ORBIT — Shared UI + per-page rendering
   This file runs on every page. Each render function checks
   whether its target element exists before doing anything,
   so one script can safely serve all six pages.
   ========================================================= */

function formatPrice(amount) {
  return "₹" + Number(amount).toLocaleString("en-IN");
}

function qs(sel, scope = document) {
  return scope.querySelector(sel);
}
function qsa(sel, scope = document) {
  return [...scope.querySelectorAll(sel)];
}

/* ---------- Header: cart badge, nav toggle, theme ---------- */
function initHeader() {
  const countEls = qsa("[data-cart-count]");
  countEls.forEach((el) => (el.textContent = Cart.count()));

  const navToggle = qs(".nav-toggle");
  const mainNav = qs(".main-nav");
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => mainNav.classList.toggle("open"));
  }

  const themeToggle = qs(".theme-toggle");
  const root = document.documentElement;
  const savedTheme = localStorage.getItem("orbit_theme");
  if (savedTheme === "dark") {
    root.setAttribute("data-theme", "dark");
    if (themeToggle) themeToggle.textContent = "☀️";
  }
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isDark = root.getAttribute("data-theme") === "dark";
      if (isDark) {
        root.removeAttribute("data-theme");
        localStorage.setItem("orbit_theme", "light");
        themeToggle.textContent = "🌙";
      } else {
        root.setAttribute("data-theme", "dark");
        localStorage.setItem("orbit_theme", "dark");
        themeToggle.textContent = "☀️";
      }
    });
  }

  const yearEl = qs("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ---------- Toast ---------- */
function showToast(message) {
  let toast = qs(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

/* ---------- Product card markup ---------- */
function productCardHTML(p) {
  return `
    <article class="product-card">
      <a class="product-media" href="product-details.html?id=${p.id}">
        ${p.tag ? `<span class="product-tag">${p.tag}</span>` : ""}
        <img src="${p.image}" alt="${p.name}" loading="lazy">
      </a>
      <div class="product-body">
        <span class="product-cat">${p.category}</span>
        <h3 class="product-name"><a href="product-details.html?id=${p.id}">${p.name}</a></h3>
        <div class="product-price">${formatPrice(p.price)}</div>
        <div class="product-actions">
          <button class="btn btn-dark" data-add-to-cart="${p.id}">Add to cart</button>
          <a class="icon-btn" href="product-details.html?id=${p.id}" title="View details">↗</a>
        </div>
      </div>
    </article>
  `;
}

function bindAddToCartButtons(scope = document) {
  qsa("[data-add-to-cart]", scope).forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.getAttribute("data-add-to-cart"));
      const qty = Number(btn.getAttribute("data-qty")) || 1;
      Cart.add(id, qty);
      qsa("[data-cart-count]").forEach((el) => (el.textContent = Cart.count()));
      const product = getProductById(id);
      showToast(`Added "${product.name}" to cart`);
    });
  });
}

/* ---------- Home page ---------- */
function renderHome() {
  const grid = qs("#featured-grid");
  if (!grid) return;
  const featured = PRODUCTS.filter((p) => p.tag).concat(
    PRODUCTS.filter((p) => !p.tag)
  ).slice(0, 4);
  grid.innerHTML = featured.map(productCardHTML).join("");
  bindAddToCartButtons(grid);
}

/* ---------- Products page ---------- */
function renderProductsPage() {
  const grid = qs("#products-grid");
  if (!grid) return;

  const searchInput = qs("#product-search");
  const chips = qsa(".chip[data-category]");
  const emptyState = qs("#empty-state");
  let activeCategory = "All";

  function draw() {
    const query = (searchInput?.value || "").trim().toLowerCase();
    const results = PRODUCTS.filter((p) => {
      const matchesCategory = activeCategory === "All" || p.category === activeCategory;
      const matchesQuery = p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
    grid.innerHTML = results.map(productCardHTML).join("");
    bindAddToCartButtons(grid);
    if (emptyState) emptyState.style.display = results.length ? "none" : "block";
  }

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      activeCategory = chip.getAttribute("data-category");
      draw();
    });
  });

  if (searchInput) searchInput.addEventListener("input", draw);

  draw();
}

/* ---------- Product details page ---------- */
function renderProductDetails() {
  const container = qs("#product-details");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id"));
  const product = getProductById(id);

  if (!product) {
    container.innerHTML = `<div class="empty-state"><h2>Product not found</h2><p>It may have been removed.</p><a class="btn btn-dark" href="products.html">Back to shop</a></div>`;
    return;
  }

  document.title = `${product.name} — ORBIT`;
  let qty = 1;

  container.innerHTML = `
    <div class="breadcrumb"><a href="index.html">Home</a> / <a href="products.html">Shop</a> / ${product.name}</div>
    <div class="details-grid">
      <div class="details-media"><img src="${product.image}" alt="${product.name}"></div>
      <div>
        <div class="details-cat">${product.category}</div>
        <h1>${product.name}</h1>
        <div class="details-price">${formatPrice(product.price)}</div>
        <p class="details-desc">${product.description}</p>
        <div class="qty-row">
          <span class="muted">Quantity</span>
          <div class="qty-stepper">
            <button id="qty-minus" aria-label="Decrease quantity">−</button>
            <span id="qty-value">1</span>
            <button id="qty-plus" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <div class="details-actions">
          <button class="btn btn-primary" id="details-add-btn">Add to cart</button>
          <a class="btn btn-outline" style="color:var(--text); border-color:var(--line);" href="cart.html">View cart</a>
        </div>
        <ul class="spec-list">
          ${product.specs.map(([k, v]) => `<li><span>${k}</span><strong>${v}</strong></li>`).join("")}
        </ul>
      </div>
    </div>
  `;

  const qtyValue = qs("#qty-value");
  qs("#qty-minus").addEventListener("click", () => {
    qty = Math.max(1, qty - 1);
    qtyValue.textContent = qty;
  });
  qs("#qty-plus").addEventListener("click", () => {
    qty = Math.min(10, qty + 1);
    qtyValue.textContent = qty;
  });
  qs("#details-add-btn").addEventListener("click", () => {
    Cart.add(product.id, qty);
    qsa("[data-cart-count]").forEach((el) => (el.textContent = Cart.count()));
    showToast(`Added ${qty} × "${product.name}" to cart`);
  });
}

/* ---------- Cart page ---------- */
function renderCartPage() {
  const list = qs("#cart-list");
  if (!list) return;

  function draw() {
    const items = Cart.detailedItems();
    const summarySubtotal = qs("#summary-subtotal");
    const summaryShipping = qs("#summary-shipping");
    const summaryTotal = qs("#summary-total");
    const checkoutBtn = qs("#checkout-btn");

    if (!items.length) {
      list.innerHTML = `
        <div class="empty-state">
          <h2>Your cart is empty</h2>
          <p>Browse the shop and add something you like.</p>
          <a class="btn btn-dark" href="products.html">Continue shopping</a>
        </div>`;
    } else {
      list.innerHTML = items
        .map(
          (i) => `
        <div class="cart-item" data-row="${i.id}">
          <img src="${i.image}" alt="${i.name}">
          <div>
            <h4>${i.name}</h4>
            <div class="muted">${formatPrice(i.price)} each</div>
            <div class="qty-stepper" style="margin-top:8px;">
              <button data-decrease="${i.id}" aria-label="Decrease quantity">−</button>
              <span>${i.qty}</span>
              <button data-increase="${i.id}" aria-label="Increase quantity">+</button>
            </div>
            <a href="#" class="remove-link" data-remove="${i.id}">Remove</a>
          </div>
          <div class="cart-item-price">${formatPrice(i.lineTotal)}</div>
        </div>`
        )
        .join("");
    }

    if (summarySubtotal) summarySubtotal.textContent = formatPrice(Cart.subtotal());
    if (summaryShipping) summaryShipping.textContent = Cart.subtotal() === 0 ? "—" : Cart.shipping() === 0 ? "Free" : formatPrice(Cart.shipping());
    if (summaryTotal) summaryTotal.textContent = formatPrice(Cart.total());
    if (checkoutBtn) checkoutBtn.toggleAttribute("disabled", items.length === 0);

    qsa("[data-increase]", list).forEach((btn) =>
      btn.addEventListener("click", () => {
        const id = Number(btn.getAttribute("data-increase"));
        const item = Cart.getItems().find((i) => i.id === id);
        Cart.updateQty(id, item.qty + 1);
        qsa("[data-cart-count]").forEach((el) => (el.textContent = Cart.count()));
        draw();
      })
    );
    qsa("[data-decrease]", list).forEach((btn) =>
      btn.addEventListener("click", () => {
        const id = Number(btn.getAttribute("data-decrease"));
        const item = Cart.getItems().find((i) => i.id === id);
        Cart.updateQty(id, item.qty - 1);
        qsa("[data-cart-count]").forEach((el) => (el.textContent = Cart.count()));
        draw();
      })
    );
    qsa("[data-remove]", list).forEach((btn) =>
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const id = Number(btn.getAttribute("data-remove"));
        Cart.remove(id);
        qsa("[data-cart-count]").forEach((el) => (el.textContent = Cart.count()));
        draw();
      })
    );
  }

  draw();
}

/* ---------- Order / checkout page ---------- */
function renderOrderPage() {
  const form = qs("#order-form");
  if (!form) return;

  const items = Cart.detailedItems();
  const miniList = qs("#mini-order-list");
  const miniTotal = qs("#mini-order-total");

  if (!items.length) {
    qs("#checkout-layout").innerHTML = `
      <div class="empty-state">
        <h2>Nothing to check out yet</h2>
        <p>Add a product to your cart before placing an order.</p>
        <a class="btn btn-dark" href="products.html">Continue shopping</a>
      </div>`;
    return;
  }

  if (miniList) {
    miniList.innerHTML = items
      .map((i) => `<div class="mini-item"><span>${i.name} × ${i.qty}</span><span>${formatPrice(i.lineTotal)}</span></div>`)
      .join("");
  }
  if (miniTotal) miniTotal.textContent = formatPrice(Cart.total());

  qsa(".pay-option").forEach((opt) => {
    opt.addEventListener("click", () => {
      qsa(".pay-option").forEach((o) => o.classList.remove("checked"));
      opt.classList.add("checked");
      qs("input", opt).checked = true;
    });
  });
  const firstPay = qs(".pay-option");
  if (firstPay) firstPay.classList.add("checked");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;
    const requiredFields = ["order-name", "order-phone", "order-address"];
    requiredFields.forEach((id) => {
      const field = qs("#" + id);
      const wrapper = field.closest(".field");
      if (!field.value.trim()) {
        wrapper.classList.add("invalid");
        valid = false;
      } else {
        wrapper.classList.remove("invalid");
      }
    });

    const phoneField = qs("#order-phone");
    if (phoneField.value.trim() && !/^[0-9+\-\s]{7,15}$/.test(phoneField.value.trim())) {
      phoneField.closest(".field").classList.add("invalid");
      qs("#order-phone-error").textContent = "Enter a valid phone number.";
      valid = false;
    }

    if (!valid) return;

    const payment = qs('input[name="payment"]:checked')?.value || "Cash on Delivery";
    const order = {
      id: "ORB" + Math.floor(100000 + Math.random() * 900000),
      name: qs("#order-name").value.trim(),
      phone: qs("#order-phone").value.trim(),
      address: qs("#order-address").value.trim(),
      payment,
      items,
      subtotal: Cart.subtotal(),
      shipping: Cart.shipping(),
      total: Cart.total(),
      date: new Date().toISOString()
    };
    Cart.saveLastOrder(order);
    Cart.clear();
    window.location.href = "success.html";
  });
}

/* ---------- Success page ---------- */
function renderSuccessPage() {
  const container = qs("#success-content");
  if (!container) return;
  const order = Cart.getLastOrder();

  if (!order) {
    container.innerHTML = `
      <div class="success-wrap">
        <h2>No recent order found</h2>
        <p class="details-desc" style="margin:0 auto 20px;">Place an order first to see a confirmation here.</p>
        <a class="btn btn-dark" href="products.html">Go to shop</a>
      </div>`;
    return;
  }

  qs("#order-id").textContent = order.id;
  qs("#order-name-out").textContent = order.name;
  qs("#order-address-out").textContent = order.address;
  qs("#order-payment-out").textContent = order.payment;
  qs("#order-total-out").textContent = formatPrice(order.total);
  qs("#order-items-out").innerHTML = order.items
    .map((i) => `<div class="mini-item"><span>${i.name} × ${i.qty}</span><span>${formatPrice(i.lineTotal)}</span></div>`)
    .join("");
}

/* ---------- Boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  renderHome();
  renderProductsPage();
  renderProductDetails();
  renderCartPage();
  renderOrderPage();
  renderSuccessPage();
});
