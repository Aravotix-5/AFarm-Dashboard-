/* ==========================================================================
   A FARM — APP LOGIC
   Plain JS, no dependencies. The product catalog (PRODUCTS/CATEGORIES)
   lives in products-data.js, loaded before this file. No backend, no
   payments — everything here is localStorage.
   ========================================================================== */

const PRODUCT_MAP = {};
PRODUCTS.forEach(p => PRODUCT_MAP[p.id] = p);

/* ---------------------------------------------------------------------
   ADMIN OVERRIDES (price / in-stock changes made from admin.html)
   Stored separately from the catalog itself, layered on top at read
   time. This is how the admin panel changes a price or marks something
   out of stock without editing code — everything stays localStorage.
--------------------------------------------------------------------- */
function getOverrides(){
  try{
    return JSON.parse(localStorage.getItem("afarm_admin_overrides")) || {};
  }catch(e){ return {}; }
}
function getProduct(id){
  const base = PRODUCT_MAP[id];
  if(!base) return null;
  const ov = getOverrides()[id];
  return ov ? { ...base, ...ov } : base;
}
/* Full catalog with admin overrides applied — use this (not the raw
   PRODUCTS array) anywhere prices/stock need to reflect admin changes. */
function liveProducts(){
  return PRODUCTS.map(p => getProduct(p.id));
}

/* The $30 Farm Basket is a fixed flat price — not customer-adjustable.
   Capacity is a fixed 10 spaces (see BASKET_CAPACITY below). */
const BASKET_PRICE = 30;
const BASKET_CAPACITY = 10;

function basketCapacity(){
  return BASKET_CAPACITY;
}

/* Loyalty rewards ladder — intentionally empty. The farm hasn't set
   reward rules yet, so we track points but don't invent what they're
   worth. Add tiers here once the farm decides, e.g.:
   { points: 100, reward: "$10 off your next visit" } */
const REWARD_TIERS = [];

/* ---------------------------------------------------------------------
   STATE + LOCAL STORAGE
--------------------------------------------------------------------- */
const state = {
  cart: loadJSON("afarm_cart", []),        // [{id, qty}]
  basket: loadJSON("afarm_basket", []),    // [{id, qty}]
  basketPrice: BASKET_PRICE,
  account: loadJSON("afarm_account", { name: "", phone: "", email: "", address: "", points: 0, history: [] }),
  recentlyViewed: loadJSON("afarm_recent", []),
  view: "home",
  shopFilter: "all",
  basketFilter: "all",
  searchTerm: ""
};

function loadJSON(key, fallback){
  try{
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  }catch(e){ return fallback; }
}
function saveState(){
  try{
    localStorage.setItem("afarm_cart", JSON.stringify(state.cart));
    localStorage.setItem("afarm_basket", JSON.stringify(state.basket));
    localStorage.setItem("afarm_account", JSON.stringify(state.account));
    localStorage.setItem("afarm_recent", JSON.stringify(state.recentlyViewed));
  }catch(e){ /* localStorage unavailable — app still works, just won't persist */ }
}

/* ---------------------------------------------------------------------
   HELPERS
--------------------------------------------------------------------- */
function money(n){ return "$" + n.toFixed(2); }

function priceLabel(p){
  if(p.price == null) return null;
  return money(p.price) + (p.unit === "each" ? " each" : p.unit === "packet" ? "/packet" : p.unit === "basket" ? "" : "/" + p.unit);
}

/* The catalog now only contains what's actually being sold, so plain
   per-item availability is all that's needed (no separate "orderable
   group" restriction like before the catalog was trimmed). */
function isAvailable(p){
  if(p.isBasketProduct) return true;
  return p.available === true;
}

function mediaPlaceholderText(p){
  return "Photo coming soon";
}

/* Fills a container with the product's real photo/video when available,
   autoplaying muted video if present, falling back to a text placeholder. */
function fillMediaEl(container, p, opts){
  opts = opts || {};
  container.innerHTML = "";
  if(p.video){
    const v = document.createElement("video");
    v.src = p.video;
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    v.autoplay = true;
    v.setAttribute("aria-label", p.name);
    if(opts.controls) v.controls = true;
    container.appendChild(v);
  } else if(p.image){
    const img = document.createElement("img");
    img.src = p.image;
    img.alt = p.name;
    img.loading = "lazy";
    container.appendChild(img);
  } else {
    container.appendChild(el("span", "media-placeholder", mediaPlaceholderText(p)));
  }
}

function el(tag, className, html){
  const e = document.createElement(tag);
  if(className) e.className = className;
  if(html != null) e.innerHTML = html;
  return e;
}

function toast(msg){
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => t.classList.remove("show"), 2200);
}

/* ---------------------------------------------------------------------
   PRODUCT CARD BUILDER
--------------------------------------------------------------------- */
function buildProductCard(p){
  const card = el("div", "product-card");
  card.setAttribute("tabindex", "0");
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", "View " + p.name);

  const media = el("div", "product-media");
  fillMediaEl(media, p);
  if(!isAvailable(p)){
    const badge = el("span", "unavailable-badge", p.availabilityNote ? "Ask at Farm" : "Sold Out");
    media.appendChild(badge);
  }
  card.appendChild(media);

  const info = el("div", "product-info");
  info.appendChild(el("span", "product-cat", categoryLabel(p.category)));
  info.appendChild(el("span", "product-name", p.name));

  const pl = priceLabel(p);
  if(pl){
    const priceEl = el("span", "product-price", pl.replace(/^(\$[\d.]+)/, "$1") );
    priceEl.innerHTML = money(p.price) + (p.unit==="each" ? ' <span class="unit">each</span>' : p.unit==="packet" ? ' <span class="unit">/packet</span>' : p.unit==="basket" ? "" : ' <span class="unit">/'+p.unit+'</span>');
    info.appendChild(priceEl);
  } else {
    info.appendChild(el("span", "product-price tbd", p.priceNote || "Price available at farm"));
  }
  if(p.stockNote){
    info.appendChild(el("span", "stock-note", p.stockNote));
  }

  const addBtn = el("button", "product-add", p.isBasketProduct ? "Build Basket" : (isAvailable(p) ? "Add" : (p.availabilityNote ? "Ask at Farm" : "Sold Out")));
  addBtn.disabled = p.isBasketProduct ? false : (!isAvailable(p) || p.price == null);
  addBtn.addEventListener("click", (evt) => {
    evt.stopPropagation();
    if(p.isBasketProduct){ location.hash = "#basket"; }
    else{ addToCart(p.id, 1); }
  });
  info.appendChild(addBtn);
  card.appendChild(info);

  card.addEventListener("click", () => { if(p.isBasketProduct){ location.hash = "#basket"; } else { openProductPage(p.id); } });
  card.addEventListener("keydown", (e) => { if(e.key === "Enter" || e.key === " "){ e.preventDefault(); if(p.isBasketProduct){ location.hash = "#basket"; } else { openProductPage(p.id); } } });

  return card;
}

/* ---------------------------------------------------------------------
   VIEW ROUTING
   Most routes are plain view names (#shop, #cart, ...). Product pages
   use a two-part hash, #product/<id>, so each item is a real linkable
   page rather than a popup.
--------------------------------------------------------------------- */
const VIEW_IDS = ["home","shop","basket","cart","account","about","product"];

function currentRoute(){
  const raw = (location.hash || "#home").replace(/^#/, "");
  if(raw.indexOf("product/") === 0){
    return { view: "product", id: raw.slice("product/".length) };
  }
  return { view: VIEW_IDS.includes(raw) ? raw : "home", id: null };
}

function goToView(view, productId){
  if(!VIEW_IDS.includes(view)) view = "home";
  state.view = view;
  VIEW_IDS.forEach(v => {
    document.getElementById("view-" + v).classList.toggle("active", v === view);
  });
  document.querySelectorAll("[data-nav]").forEach(a => {
    a.classList.toggle("active", a.getAttribute("data-nav") === view);
  });
  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  closeNavDrawer();
  renderCurrentView(productId);
}

function renderCurrentView(productId){
  if(state.view === "home") renderHome();
  if(state.view === "shop") renderShop();
  if(state.view === "basket") renderBasketView();
  if(state.view === "cart") renderCartView();
  if(state.view === "account") renderAccountView();
  if(state.view === "product") renderProductPage(productId);
}

window.addEventListener("hashchange", () => {
  const route = currentRoute();
  goToView(route.view, route.id);
});

/* ---------------------------------------------------------------------
   HOME VIEW
--------------------------------------------------------------------- */
function renderHome(){
  const featured = liveProducts().filter(p => p.featured);
  const seasonal = liveProducts().filter(p => p.seasonal);

  fillRail("featuredProductsRail", featured);
  fillRail("seasonalRail", seasonal.length ? seasonal : featured);

  const grid = document.getElementById("homeCategoryGrid");
  grid.innerHTML = "";
  CATEGORIES.filter(c => c.key !== "baskets").forEach(c => {
    const count = PRODUCTS.filter(p => p.category === c.key).length;
    const tile = el("button", "category-tile");
    tile.innerHTML =
      '<span class="cat-emoji">' + c.emoji + '</span>' +
      '<span class="cat-name">' + c.label + '</span>' +
      '<span class="cat-count">' + count + " item" + (count === 1 ? "" : "s") + '</span>';
    tile.addEventListener("click", () => {
      state.shopFilter = c.key; location.hash = "#shop";
    });
    grid.appendChild(tile);
  });
}

function fillRail(elId, products){
  const rail = document.getElementById(elId);
  rail.innerHTML = "";
  products.forEach(p => rail.appendChild(buildProductCard(p)));
}

/* ---------------------------------------------------------------------
   SHOP VIEW
--------------------------------------------------------------------- */
const SHOP_FILTER_GROUPS = [
  { key: "all",        label: "All" },
  { key: "tomatoes",   label: "Tomatoes" },
  { key: "peppers",    label: "Peppers" },
  { key: "vegetables", label: "Vegetables" },
  { key: "squash",     label: "Squash & Zucchini" },
  { key: "beans",      label: "Beans" },
  { key: "okra",       label: "Okra" },
  { key: "herbs",      label: "Herbs" },
  { key: "baskets",    label: "Baskets" }
];

function renderShopFilters(){
  const row = document.getElementById("filterRow");
  row.innerHTML = "";
  SHOP_FILTER_GROUPS.forEach(f => {
    const isActive = !state.searchTerm && state.shopFilter === f.key;
    const chip = el("button", "filter-chip" + (isActive ? " active" : ""), f.label);
    chip.addEventListener("click", () => { state.shopFilter = f.key; state.searchTerm = ""; document.getElementById("searchInput").value = ""; renderShop(); });
    row.appendChild(chip);
  });
}

function matchesShopFilter(p){
  if(state.shopFilter === "all") return true;
  return p.category === state.shopFilter;
}

function matchesSearch(p){
  if(!state.searchTerm) return true;
  const haystack = (p.name + " " + categoryLabel(p.category)).toLowerCase();
  const words = state.searchTerm.toLowerCase().split(/\s+/).filter(Boolean);
  return words.every(w => haystack.includes(w));
}

/* A search typed in the header box searches the whole catalog —
   it overrides whatever category chip happens to be active, rather
   than staying scoped to it. */
function matchesShopFilterOrSearch(p){
  if(state.searchTerm) return matchesSearch(p);
  return matchesShopFilter(p) && matchesSearch(p);
}

function renderShop(){
  renderShopFilters();
  const container = document.getElementById("shopCategories");
  container.innerHTML = "";

  const visible = liveProducts().filter(matchesShopFilterOrSearch);

  const info = document.getElementById("resultsInfo");
  if(state.searchTerm){
    info.hidden = false;
    info.textContent = visible.length + ' result' + (visible.length===1?"":"s") + ' for "' + state.searchTerm + '"';
  } else {
    info.hidden = true;
  }

  if(visible.length === 0){
    container.appendChild(el("p", "empty-note", "Nothing matches yet. Try a different search or filter."));
    return;
  }

  const order = CATEGORIES.map(c => c.key);
  order.forEach(catKey => {
    const items = visible.filter(p => p.category === catKey);
    if(!items.length) return;
    const block = el("div", "category-block");
    block.appendChild(el("h2", "category-block-title", categoryLabel(catKey)));
    const grid = el("div", "product-grid");
    items.forEach(p => grid.appendChild(buildProductCard(p)));
    block.appendChild(grid);
    container.appendChild(block);
  });
}

/* ---------------------------------------------------------------------
   SEARCH
--------------------------------------------------------------------- */
document.getElementById("searchInput").addEventListener("input", (e) => {
  state.searchTerm = e.target.value.trim();
  if(state.view === "shop") renderShop();
  else if(state.searchTerm){ location.hash = "#shop"; }
});

/* ---------------------------------------------------------------------
   PRODUCT PAGE
   Reached via #product/<id> — a real, linkable, bookmarkable "page" for
   each item. (A static site with no server can't do a clean /product/x
   path without a host rewrite, so the hash is the direct equivalent —
   same shareable link behavior, no backend required.)
--------------------------------------------------------------------- */
function openProductPage(id){
  location.hash = "#product/" + id;
}

function renderProductPage(id){
  const p = getProduct(id);
  if(!p){ location.hash = "#shop"; return; }

  addRecentlyViewed(id);

  document.getElementById("productPageCategory").textContent = categoryLabel(p.category);
  document.getElementById("productPageName").textContent = p.name;

  const pl = priceLabel(p);
  document.getElementById("productPagePrice").textContent = pl ? pl : (p.priceNote || "Price available at farm");

  const availEl = document.getElementById("productPageAvailability");
  if(isAvailable(p)){
    availEl.textContent = "Available now" + (p.stockNote ? " · " + p.stockNote : "");
    availEl.style.color = "var(--leaf)";
  } else {
    availEl.textContent = p.availabilityNote === "INFORMATION NEEDED" ? "Ask at the farm for current availability" : "Sold out — not being offered right now";
    availEl.style.color = "var(--ink-soft)";
  }

  fillMediaEl(document.getElementById("productPageMedia"), p, { controls: !!p.video });

  const addBtn = document.getElementById("productPageAddBtn");
  addBtn.disabled = !isAvailable(p) || p.price == null;
  addBtn.textContent = addBtn.disabled ? (p.availabilityNote ? "Ask at Farm" : "Sold Out") : "Add to Cart";
  addBtn.onclick = () => addToCart(p.id, 1);

  document.title = p.name + " — A Farm";
}

document.getElementById("productBackBtn").addEventListener("click", () => {
  if(document.referrer || history.length > 1){ history.back(); }
  else { location.hash = "#shop"; }
});

function addRecentlyViewed(id){
  state.recentlyViewed = [id, ...state.recentlyViewed.filter(x => x !== id)].slice(0, 12);
  saveState();
}

/* ---------------------------------------------------------------------
   CART LOGIC
--------------------------------------------------------------------- */
/* Default per-item cap. The admin panel can set a tighter maxQty on
   any specific product (e.g. a low-stock item) — that overrides this. */
const MAX_CART_QTY = 20;

function qtyCapFor(p){
  return (p.maxQty && p.maxQty > 0) ? p.maxQty : MAX_CART_QTY;
}

function addToCart(id, qty){
  const p = getProduct(id);
  if(!p || p.price == null || !isAvailable(p)) return;
  const cap = qtyCapFor(p);
  qty = Math.max(1, Math.floor(Number(qty)) || 1);
  const existing = state.cart.find(l => l.id === id);
  if(existing){
    const wasCapped = existing.qty + qty > cap;
    existing.qty = Math.min(cap, existing.qty + qty);
    if(wasCapped) toast("Max " + cap + " per order for " + p.name);
  } else {
    state.cart.push({ id, qty: Math.min(cap, qty) });
  }
  saveState();
  renderCartBadges();
  renderCartDrawer();
  if(state.view === "cart") renderCartView();
  toast(p.name + " added to cart");
}
function setCartQty(id, qty){
  const line = state.cart.find(l => l.id === id);
  if(!line) return;
  const p = getProduct(id);
  const cap = p ? qtyCapFor(p) : MAX_CART_QTY;
  qty = Math.floor(Number(qty)) || 0;
  if(qty <= 0){
    state.cart = state.cart.filter(l => l.id !== id);
  } else if(qty > cap){
    line.qty = cap;
    toast("Max " + cap + " per order" + (p ? " for " + p.name : ""));
  } else {
    line.qty = qty;
  }
  saveState();
  renderCartBadges();
  renderCartDrawer();
  if(state.view === "cart") renderCartView();
}
function removeFromCart(id){ setCartQty(id, 0); }
function clearCart(){
  state.cart = [];
  saveState();
  renderCartBadges();
  renderCartDrawer();
  if(state.view === "cart") renderCartView();
}
function cartTotal(){
  return state.cart.reduce((sum, l) => {
    const p = getProduct(l.id);
    return p ? sum + p.price * l.qty : sum;
  }, 0);
}
function cartCount(){
  return state.cart.reduce((sum, l) => sum + l.qty, 0);
}

function renderCartBadges(){
  const count = cartCount();
  ["cartCount","tabCartCount"].forEach(id => {
    const badge = document.getElementById(id);
    badge.textContent = String(count);
    badge.hidden = count === 0;
  });
}

function buildCartLine(l, context){
  const p = getProduct(l.id);
  if(!p) return document.createDocumentFragment();
  const line = el("div", "cart-line");

  const media = el("div", "cart-line-media");
  fillMediaEl(media, p);
  line.appendChild(media);

  const info = el("div", "cart-line-info");
  info.appendChild(el("div", "cart-line-name", p.name));
  info.appendChild(el("div", "cart-line-price", money(p.price) + (p.unit==="each"?" each":p.unit==="packet"?"/packet":"/"+p.unit)));
  const removeBtn = el("button", "remove-line", "Remove");
  removeBtn.addEventListener("click", () => removeFromCart(p.id));
  info.appendChild(removeBtn);
  line.appendChild(info);

  const stepper = el("div", "qty-stepper");
  const minus = el("button", "qty-btn", "−");
  const val = el("span", "qty-val", String(l.qty));
  const plus = el("button", "qty-btn", "+");
  minus.addEventListener("click", () => setCartQty(p.id, l.qty - 1));
  plus.addEventListener("click", () => setCartQty(p.id, l.qty + 1));
  stepper.appendChild(minus); stepper.appendChild(val); stepper.appendChild(plus);
  line.appendChild(stepper);

  return line;
}

function renderCartDrawer(){
  const body = document.getElementById("cartDrawerBody");
  body.innerHTML = "";
  if(state.cart.length === 0){
    body.appendChild(el("p", "empty-note", "Your cart is empty."));
  } else {
    state.cart.forEach(l => body.appendChild(buildCartLine(l, "drawer")));
  }
  document.getElementById("drawerCartTotal").textContent = money(cartTotal());
}

function renderCartView(){
  const list = document.getElementById("cartItemsList");
  const emptyNote = document.getElementById("cartEmptyNote");
  const summary = document.getElementById("cartSummary");
  list.innerHTML = "";

  if(state.cart.length === 0){
    emptyNote.hidden = false;
    summary.hidden = true;
    return;
  }
  emptyNote.hidden = true;
  summary.hidden = false;
  const wrap = el("div", "cart-list-wrap");
  wrap.style.padding = "0 20px";
  state.cart.forEach(l => wrap.appendChild(buildCartLine(l, "page")));
  list.appendChild(wrap);
  document.getElementById("cartTotal").textContent = money(cartTotal());
}

document.getElementById("clearCartBtn").addEventListener("click", clearCart);

/* Cart drawer open/close */
function openCartDrawer(){
  renderCartDrawer();
  document.getElementById("cartScrim").classList.add("open");
  document.getElementById("cartDrawer").classList.add("open");
}
function closeCartDrawer(){
  document.getElementById("cartScrim").classList.remove("open");
  document.getElementById("cartDrawer").classList.remove("open");
}
document.getElementById("cartOpenBtn").addEventListener("click", openCartDrawer);
document.getElementById("cartCloseBtn").addEventListener("click", closeCartDrawer);
document.getElementById("cartScrim").addEventListener("click", closeCartDrawer);
document.getElementById("viewFullCartBtn").addEventListener("click", closeCartDrawer);

/* ---------------------------------------------------------------------
   ORDER SUMMARY ("Show My Order")
--------------------------------------------------------------------- */
function openOrderSummary(){
  resetCheckout();
  const body = document.getElementById("orderSummaryBody");
  body.innerHTML = "";

  if(state.cart.length === 0 && state.basket.length === 0){
    body.appendChild(el("p", "empty-note", "Nothing in your order yet."));
  } else {
    state.cart.forEach(l => {
      const p = getProduct(l.id);
      if(!p) return;
      const row = el("div", "order-line");
      row.innerHTML = '<span class="order-line-name">' + l.qty + '× ' + p.name + '</span><span>' + money(p.price * l.qty) + '</span>';
      body.appendChild(row);
    });
    if(state.cart.length){
      const totalRow = el("div", "order-line");
      totalRow.innerHTML = '<span class="order-line-name">Cart estimated total</span><strong>' + money(cartTotal()) + '</strong>';
      body.appendChild(totalRow);
    }
    if(state.basket.length){
      const bRow = el("div", "order-line");
      const items = state.basket.map(b => getProduct(b.id) ? getProduct(b.id).name + (b.qty>1?" ×"+b.qty:"") : "").filter(Boolean).join(", ");
      bRow.innerHTML = '<span class="order-line-name">Farm Basket</span><span>' + money(state.basketPrice) + '</span>';
      body.appendChild(bRow);
      body.appendChild(el("p", "cart-note", "Basket contents: " + items));
    }
  }

  document.getElementById("couponCodeInput").value = "";
  document.getElementById("couponMessage").textContent = "";
  document.getElementById("couponMessage").className = "checkout-note";

  const deliverySection = document.getElementById("deliveryOptionSection");
  if(state.account.address){
    deliverySection.hidden = false;
    document.getElementById("deliveryAddressText").textContent = state.account.address;
    document.getElementById("deliveryCheckbox").checked = false;
  } else {
    deliverySection.hidden = true;
  }

  const rate = getRedemptionRate();
  const pointsSection = document.getElementById("pointsRedeemSection");
  if(rate && state.account.points > 0 && currentOrderValue() > 0){
    pointsSection.hidden = false;
    const maxDollarsFromPoints = Math.floor(state.account.points / rate.pointsPerDollar);
    document.getElementById("applyPointsBtn").textContent =
      "Use my points for up to " + money(maxDollarsFromPoints) + " off (" + state.account.points + " pts)";
    document.getElementById("applyPointsBtn").disabled = maxDollarsFromPoints <= 0;
  } else {
    pointsSection.hidden = true;
  }
  document.getElementById("pointsMessage").textContent = "";

  refreshCheckoutTotals();

  document.getElementById("orderScrim").classList.add("open");
  document.getElementById("orderSheet").classList.add("open");
}

function refreshCheckoutTotals(){
  const subtotal = currentOrderValue();
  const discount = checkoutDiscount();
  const final = checkoutFinalTotal();

  const discountLine = document.getElementById("orderDiscountLine");
  if(discount > 0){
    discountLine.hidden = false;
    discountLine.innerHTML = '<span>Discount</span><span>-' + money(discount) + '</span>';
  } else {
    discountLine.hidden = true;
  }

  document.getElementById("orderFinalTotal").innerHTML =
    '<span>Total due at the farm</span><span>' + money(final) + '</span>';

  const pointsNote = document.getElementById("orderPointsNote");
  pointsNote.textContent = subtotal > 0 ? "Submitting this order earns " + Math.floor(final) + " loyalty points." : "";
  document.getElementById("submitOrderBtn").disabled = subtotal <= 0;
}

document.getElementById("applyCouponBtn").addEventListener("click", () => {
  const code = document.getElementById("couponCodeInput").value;
  const msg = document.getElementById("couponMessage");
  const coupon = findActiveCoupon(code);
  if(!coupon){
    checkout.couponCode = null;
    checkout.couponDiscount = 0;
    msg.textContent = code.trim() ? "That coupon code isn't valid." : "Enter a coupon code first.";
    msg.className = "checkout-note bad";
    refreshCheckoutTotals();
    return;
  }
  const subtotal = currentOrderValue();
  const rawDiscount = coupon.type === "percent" ? subtotal * (coupon.value / 100) : coupon.value;
  const remainingAfterPoints = Math.max(0, subtotal - checkout.pointsDiscount);
  checkout.couponCode = coupon.code;
  checkout.couponDiscount = Math.min(rawDiscount, remainingAfterPoints);
  msg.textContent = "Coupon " + coupon.code + " applied: -" + money(checkout.couponDiscount);
  msg.className = "checkout-note good";
  refreshCheckoutTotals();
});

document.getElementById("applyPointsBtn").addEventListener("click", () => {
  const rate = getRedemptionRate();
  if(!rate) return;
  const msg = document.getElementById("pointsMessage");
  const subtotal = currentOrderValue();
  const remainingAfterCoupon = Math.max(0, subtotal - checkout.couponDiscount);
  const maxDollarsFromPoints = Math.floor(state.account.points / rate.pointsPerDollar);
  const dollarsToUse = Math.min(maxDollarsFromPoints, remainingAfterCoupon);
  const pointsToUse = dollarsToUse * rate.pointsPerDollar;
  checkout.pointsRedeemed = pointsToUse;
  checkout.pointsDiscount = dollarsToUse;
  msg.textContent = pointsToUse > 0
    ? "Using " + pointsToUse + " points for " + money(dollarsToUse) + " off."
    : "Not enough points for a discount yet.";
  msg.className = "checkout-note good";
  document.getElementById("applyPointsBtn").disabled = true;
  refreshCheckoutTotals();
});

function closeOrderSummary(){
  document.getElementById("orderScrim").classList.remove("open");
  document.getElementById("orderSheet").classList.remove("open");
}
document.getElementById("showOrderBtn").addEventListener("click", openOrderSummary);
document.getElementById("orderCloseBtn").addEventListener("click", closeOrderSummary);
document.getElementById("orderScrim").addEventListener("click", closeOrderSummary);
document.getElementById("orderDoneBtn").addEventListener("click", closeOrderSummary);

/* ---------------------------------------------------------------------
   $30 BASKET LOGIC
--------------------------------------------------------------------- */
const BASKET_FILTER_GROUPS = [
  { key: "all",     label: "All" },
  { key: "tomatoes",label: "Tomatoes" },
  { key: "peppers", label: "Peppers" }
];

function basketSpaceUsed(){
  return state.basket.reduce((sum, b) => {
    const p = getProduct(b.id);
    return p ? sum + p.basketSpace * b.qty : sum;
  }, 0);
}

function addToBasket(id){
  const p = getProduct(id);
  if(!p || !p.basketEligible) return;
  const used = basketSpaceUsed();
  if(used + p.basketSpace > basketCapacity()){
    toast("Basket full — remove something first");
    return;
  }
  const existing = state.basket.find(l => l.id === id);
  if(existing) existing.qty += 1;
  else state.basket.push({ id, qty: 1 });
  saveState();
  renderBasketView();
  toast(p.name + " added to your basket");
}

function removeFromBasket(id){
  const existing = state.basket.find(l => l.id === id);
  if(!existing) return;
  existing.qty -= 1;
  if(existing.qty <= 0) state.basket = state.basket.filter(l => l.id !== id);
  saveState();
  renderBasketView();
}

function renderBasketFilters(){
  const row = document.getElementById("basketFilterRow");
  row.innerHTML = "";
  BASKET_FILTER_GROUPS.forEach(f => {
    const chip = el("button", "filter-chip" + (state.basketFilter === f.key ? " active" : ""), f.label);
    chip.addEventListener("click", () => { state.basketFilter = f.key; renderBasketView(); });
    row.appendChild(chip);
  });
}

function renderBasketView(){
  renderBasketFilters();

  const capacity = basketCapacity();
  const used = basketSpaceUsed();
  const remaining = Math.max(0, capacity - used);
  const pct = Math.min(100, Math.round((used / capacity) * 100));

  document.getElementById("basketMeterFill").style.width = pct + "%";
  document.getElementById("basketMeterWrap").setAttribute("aria-valuenow", String(used));
  document.getElementById("basketMeterWrap").setAttribute("aria-valuemax", String(capacity));
  document.getElementById("basketSpaceUsedLabel").textContent = "Space used: " + used + " / " + capacity;
  document.getElementById("basketSpaceRemainingLabel").textContent = "Space remaining: " + remaining;
  document.getElementById("basketFullMsg").hidden = remaining > 0;

  const contents = document.getElementById("basketContents");
  const emptyNote = document.getElementById("basketEmptyNote");
  const reviewBtn = document.getElementById("reviewBasketBtn");
  contents.innerHTML = "";

  if(state.basket.length === 0){
    contents.appendChild(el("p", "empty-note", "Your basket is empty. Add products below to get started."));
    reviewBtn.hidden = true;
  } else {
    reviewBtn.hidden = false;
    state.basket.forEach(b => {
      const p = getProduct(b.id);
      if(!p) return;
      const line = el("div", "basket-line");
      const left = el("div");
      left.appendChild(el("div", "basket-line-name", (b.qty>1 ? b.qty + "× " : "") + p.name));
      left.appendChild(el("div", "basket-line-space", (p.basketSpace * b.qty) + " space" + (p.basketSpace*b.qty===1?"":"s")));
      line.appendChild(left);
      const removeBtn = el("button", "basket-line-remove", "Remove");
      removeBtn.addEventListener("click", () => removeFromBasket(p.id));
      line.appendChild(removeBtn);
      contents.appendChild(line);
    });
  }

  const grid = document.getElementById("basketEligibleGrid");
  grid.innerHTML = "";
  const eligible = liveProducts().filter(p => p.basketEligible && isAvailable(p) &&
    (state.basketFilter === "all" || p.category === state.basketFilter));

  eligible.forEach(p => {
    const card = el("div", "product-card");
    const media = el("div", "product-media");
    media.appendChild(el("span", "media-placeholder", mediaPlaceholderText(p)));
    card.appendChild(media);

    const info = el("div", "product-info");
    info.appendChild(el("span", "product-cat", categoryLabel(p.category)));
    info.appendChild(el("span", "product-name", p.name));
    info.appendChild(el("span", "basket-line-space", p.basketSpace + " space" + (p.basketSpace===1?"":"s") + " in basket"));

    const addBtn = el("button", "product-add", "Add to Basket");
    const wouldExceed = basketSpaceUsed() + p.basketSpace > basketCapacity();
    addBtn.disabled = wouldExceed;
    addBtn.addEventListener("click", () => addToBasket(p.id));
    info.appendChild(addBtn);
    card.appendChild(info);
    grid.appendChild(card);
  });
}

document.getElementById("reviewBasketBtn").addEventListener("click", openOrderSummary);

/* ---------------------------------------------------------------------
   LOYALTY ACCOUNT
   Everything here is localStorage-only — no server, no network calls.
   Order status (Order Received -> Preparing -> Ready -> Completed) is
   tracked per order and can be updated from admin.html, which reads
   and writes the same localStorage on the same device/browser.
--------------------------------------------------------------------- */
const ORDER_STATUS_PIPELINE = ["Order Received", "Preparing", "Ready", "Completed", "Returned"];

/* ---------------------------------------------------------------------
   COUPONS + POINTS REDEMPTION
   Coupons and the points-redemption rate are both set from admin.html
   (localStorage-based) — nothing here invents a discount or a rate.
   If the farm hasn't configured a redemption rate yet, that section
   stays hidden on checkout.
--------------------------------------------------------------------- */
function getCoupons(){
  try{ return JSON.parse(localStorage.getItem("afarm_coupons")) || []; }
  catch(e){ return []; }
}
function findActiveCoupon(code){
  code = (code || "").trim().toUpperCase();
  if(!code) return null;
  return getCoupons().find(c => c.code.toUpperCase() === code && c.active) || null;
}
function getRedemptionRate(){
  try{
    const rate = JSON.parse(localStorage.getItem("afarm_redemption_rate"));
    return (rate && rate.pointsPerDollar > 0) ? rate : null;
  }catch(e){ return null; }
}

let checkout = { couponCode: null, couponDiscount: 0, pointsRedeemed: 0, pointsDiscount: 0 };

function resetCheckout(){
  checkout = { couponCode: null, couponDiscount: 0, pointsRedeemed: 0, pointsDiscount: 0 };
}

function checkoutDiscount(){
  return checkout.couponDiscount + checkout.pointsDiscount;
}
function checkoutFinalTotal(){
  return Math.max(0, currentOrderValue() - checkoutDiscount());
}

function currentOrderValue(){
  return cartTotal() + (state.basket.length ? state.basketPrice : 0);
}

function nextRewardTier(){
  return REWARD_TIERS.find(t => t.points > state.account.points) || null;
}

let orderSubmitInFlight = false;
function submitOrder(){
  if(orderSubmitInFlight) return;
  const subtotal = currentOrderValue();
  if(subtotal <= 0){
    toast("Nothing in your order yet");
    return;
  }
  const finalTotal = checkoutFinalTotal();
  const itemsSummary = [
    ...state.cart.map(l => {
      const p = getProduct(l.id);
      return p ? l.qty + "× " + p.name : "";
    }),
    ...(state.basket.length ? ["Farm Basket ($" + state.basketPrice + ")"] : [])
  ].filter(Boolean).join(", ");

  orderSubmitInFlight = true;
  const submitBtn = document.getElementById("submitOrderBtn");
  submitBtn.disabled = true;

  const pointsEarned = Math.floor(finalTotal);
  const wantsDelivery = state.account.address && document.getElementById("deliveryCheckbox").checked;
  state.account.points = Math.max(0, state.account.points - checkout.pointsRedeemed) + pointsEarned;
  state.account.history.unshift({
    orderId: Date.now(),
    date: new Date().toISOString(),
    items: itemsSummary,
    total: finalTotal,
    subtotal: subtotal,
    couponCode: checkout.couponCode,
    couponDiscount: checkout.couponDiscount,
    pointsRedeemed: checkout.pointsRedeemed,
    pointsDiscount: checkout.pointsDiscount,
    pointsEarned: pointsEarned,
    delivery: !!wantsDelivery,
    deliveryAddress: wantsDelivery ? state.account.address : "",
    status: "Order Received"
  });
  state.account.history = state.account.history.slice(0, 30);

  state.cart = [];
  state.basket = [];
  resetCheckout();
  saveState();

  renderCartBadges();
  renderCartDrawer();
  closeOrderSummary();
  toast("Order submitted — you earned " + pointsEarned + " points!");

  if(state.view === "cart") renderCartView();
  if(state.view === "basket") renderBasketView();
  if(state.view === "account") renderAccountView();

  orderSubmitInFlight = false;
  submitBtn.disabled = false;
}
document.getElementById("submitOrderBtn").addEventListener("click", submitOrder);

function renderAccountView(){
  document.getElementById("pointsBalance").textContent = String(state.account.points);

  const progressWrap = document.getElementById("rewardProgress");
  const next = nextRewardTier();
  progressWrap.innerHTML = "";
  if(REWARD_TIERS.length === 0){
    progressWrap.appendChild(el("p", "reward-progress-label", "Reward rules haven't been set up yet — points are still being tracked."));
  } else if(next){
    const prevThreshold = [...REWARD_TIERS].reverse().find(t => t.points <= state.account.points);
    const floor = prevThreshold ? prevThreshold.points : 0;
    const pct = Math.min(100, Math.round(((state.account.points - floor) / (next.points - floor)) * 100));
    const bar = el("div", "reward-progress-bar");
    bar.appendChild(el("div", "reward-progress-fill"));
    bar.firstChild.style.width = pct + "%";
    progressWrap.appendChild(bar);
    progressWrap.appendChild(el("p", "reward-progress-label", (next.points - state.account.points) + " points to: " + next.reward));
  } else {
    progressWrap.appendChild(el("p", "reward-progress-label", "All current reward tiers unlocked!"));
  }

  const list = document.getElementById("rewardsList");
  list.innerHTML = "";
  if(REWARD_TIERS.length === 0){
    list.appendChild(el("li", "reward-item locked", "No rewards configured yet — ask the farm what they'd like to offer."));
  }
  REWARD_TIERS.forEach(t => {
    const unlocked = state.account.points >= t.points;
    const item = el("li", "reward-item " + (unlocked ? "unlocked" : "locked"));
    item.innerHTML = '<span>' + t.reward + '</span><span class="reward-points">' + t.points + ' pts' + (unlocked ? " ✓" : "") + '</span>';
    list.appendChild(item);
  });

  document.getElementById("accountName").value = state.account.name || "";
  document.getElementById("accountPhone").value = state.account.phone || "";
  document.getElementById("accountEmail").value = state.account.email || "";
  document.getElementById("accountAddress").value = state.account.address || "";

  const historyList = document.getElementById("orderHistoryList");
  const historyEmpty = document.getElementById("orderHistoryEmpty");
  historyList.innerHTML = "";
  if(state.account.history.length === 0){
    historyEmpty.hidden = false;
  } else {
    historyEmpty.hidden = true;
    state.account.history.forEach((h, index) => {
      const line = el("div", "order-history-line");
      const d = new Date(h.date);
      const left = el("div");
      const statusText = h.status ? " · " + h.status : "";
      left.appendChild(el("div", "order-history-date", d.toLocaleDateString(undefined, { month:"short", day:"numeric", year:"numeric" }) + " · +" + h.pointsEarned + " pts" + statusText));
      left.appendChild(el("div", "order-history-items", h.items));
      if(h.couponCode || h.pointsRedeemed){
        const bits = [];
        if(h.couponCode) bits.push("Coupon " + h.couponCode + " (-" + money(h.couponDiscount) + ")");
        if(h.pointsRedeemed) bits.push(h.pointsRedeemed + " pts redeemed (-" + money(h.pointsDiscount) + ")");
        left.appendChild(el("div", "order-history-discount", bits.join(" · ")));
      }
      if(h.delivery){
        left.appendChild(el("div", "order-history-discount", "Delivery to: " + h.deliveryAddress));
      }
      if(h.status === "Completed"){
        const returnBtn = el("button", "order-history-return", "Request Return");
        returnBtn.addEventListener("click", () => requestReturn(index));
        left.appendChild(returnBtn);
      }
      line.appendChild(left);
      line.appendChild(el("div", "order-history-total", money(h.total)));
      historyList.appendChild(line);
    });
  }
}

function requestReturn(index){
  if(!state.account.history[index]) return;
  state.account.history[index].status = "Returned";
  saveState();
  renderAccountView();
  toast("Return requested — let the farmer know at pickup/drop-off");
}

document.getElementById("saveAccountInfoBtn").addEventListener("click", () => {
  const name = document.getElementById("accountName").value.trim();
  const phone = document.getElementById("accountPhone").value.trim();
  const email = document.getElementById("accountEmail").value.trim();
  const address = document.getElementById("accountAddress").value.trim();
  const errorEl = document.getElementById("accountInfoError");

  if(!name){
    errorEl.textContent = "Name is required.";
    return;
  }
  if(!phone && !email){
    errorEl.textContent = "Enter a phone number or an email so you can be reached.";
    return;
  }
  errorEl.textContent = "";

  state.account.name = name;
  state.account.phone = phone;
  state.account.email = email;
  state.account.address = address;
  saveState();
  toast("Your info is saved on this device");
});

/* ---------------------------------------------------------------------
   NAVIGATION DRAWER
--------------------------------------------------------------------- */
function openNavDrawer(){
  document.getElementById("navScrim").classList.add("open");
  document.getElementById("navDrawer").classList.add("open");
  document.getElementById("menuBtn").setAttribute("aria-expanded", "true");
}
function closeNavDrawer(){
  document.getElementById("navScrim").classList.remove("open");
  document.getElementById("navDrawer").classList.remove("open");
  document.getElementById("menuBtn").setAttribute("aria-expanded", "false");
}
document.getElementById("accountOpenBtn").addEventListener("click", () => { location.hash = "#account"; });
document.getElementById("menuBtn").addEventListener("click", openNavDrawer);
document.getElementById("navCloseBtn").addEventListener("click", closeNavDrawer);
document.getElementById("navScrim").addEventListener("click", closeNavDrawer);

/* Intercept nav links so filters reset sensibly and drawer/tabs stay in sync */
document.querySelectorAll("[data-nav]").forEach(link => {
  link.addEventListener("click", (e) => {
    // Native hash navigation handles the view switch via hashchange listener.
    closeNavDrawer();
  });
});

/* ---------------------------------------------------------------------
   HERO VIDEO FALLBACK
   Shows the text/pattern fallback whenever no real <source> has been
   added to the hero <video>, or if the browser can't play it.
--------------------------------------------------------------------- */
function initHeroFallback(){
  const video = document.getElementById("heroVideo");
  const fallback = document.getElementById("heroFallback");
  const hasSource = video.querySelector("source") !== null;
  if(!hasSource){
    fallback.style.display = "block";
    video.style.display = "none";
    return;
  }
  fallback.style.display = "none";
  video.addEventListener("error", () => {
    fallback.style.display = "block";
    video.style.display = "none";
  });
}

/* ---------------------------------------------------------------------
   INIT
--------------------------------------------------------------------- */
function init(){
  initHeroFallback();
  renderCartBadges();
  renderCartDrawer();
  const route = currentRoute();
  goToView(route.view, route.id);
}

document.addEventListener("DOMContentLoaded", init);
