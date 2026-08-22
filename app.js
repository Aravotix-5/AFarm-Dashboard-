/* ==========================================================================
   A FARM — APP LOGIC
   Plain JS, no dependencies. All data lives in PRODUCTS / CATEGORIES below
   so the catalog can be edited easily. No backend, no payments.
   ========================================================================== */

/* ---------------------------------------------------------------------
   CATEGORY METADATA
--------------------------------------------------------------------- */
const CATEGORIES = [
  { key: "vegetables", label: "Vegetables",        emoji: "🥦" },
  { key: "tomatoes",   label: "Tomatoes",           emoji: "🍅" },
  { key: "peppers",    label: "Peppers & Chilies",  emoji: "🌶️" },
  { key: "root",       label: "Root Vegetables",    emoji: "🥕" },
  { key: "squash",     label: "Squash & Zucchini",  emoji: "🥒" },
  { key: "gourds",     label: "Gourds",              emoji: "🧺" },
  { key: "beans",      label: "Beans",               emoji: "🫘" },
  { key: "okra",       label: "Okra",                emoji: "🌾" },
  { key: "potatoes",   label: "Potatoes",            emoji: "🥔" },
  { key: "herbs",      label: "Herbs & Leaves",      emoji: "🌿" },
  { key: "fruits",     label: "Fruits",              emoji: "🍑" },
  { key: "flowers",    label: "Flowers",             emoji: "🌸" },
  { key: "seeds",      label: "Seeds",               emoji: "🌰" },
  { key: "baskets",    label: "Baskets",             emoji: "🧺" }
];
function categoryLabel(key){
  const c = CATEGORIES.find(c => c.key === key);
  return c ? c.label : key;
}

/* ---------------------------------------------------------------------
   PRODUCT CATALOG
   image / video left empty until real farm media is supplied.
   price: number, or null when not yet provided (see priceNote).
   available: true/false only when confirmed; otherwise availabilityNote.
   basketEligible + basketSpace configure the $30 Basket feature.
--------------------------------------------------------------------- */
const PRODUCTS = [
  // ---- TOMATOES ----
  { id:"tom-cherry",  name:"Cherry Tomatoes",         category:"tomatoes", price:5.99, unit:"lb",     available:true, featured:true,  basketEligible:true, basketSpace:2 },
  { id:"tom-bigboy",  name:"Big Boy Tomatoes",        category:"tomatoes", price:4.99, unit:"lb",     available:true, basketEligible:true, basketSpace:2 },
  { id:"tom-long",    name:"Long Tomatoes",           category:"tomatoes", price:5.49, unit:"lb",     available:true, basketEligible:true, basketSpace:2 },
  { id:"tom-jelly",   name:"Jelly Bean Hybrid Tomatoes", category:"tomatoes", price:6.49, unit:"lb",  available:true, basketEligible:true, basketSpace:2 },

  // ---- PEPPERS & CHILIES ----
  { id:"pep-thai",     name:"Thai Chili",         category:"peppers", price:7.99, unit:"lb", available:true, basketEligible:true, basketSpace:1 },
  { id:"pep-jalapeno", name:"Jalapeño",           category:"peppers", price:4.99, unit:"lb", available:true, featured:true, basketEligible:true, basketSpace:1 },
  { id:"pep-indian",   name:"Indian Chili",       category:"peppers", price:7.49, unit:"lb", available:true, basketEligible:true, basketSpace:1 },
  { id:"pep-bell",     name:"Sweet Bell Pepper",  category:"peppers", price:4.99, unit:"lb", available:true, featured:true, basketEligible:true, basketSpace:1 },
  { id:"pep-hotmix",   name:"Hot Pepper Mix",     category:"peppers", price:6.99, unit:"lb", available:true, basketEligible:true, basketSpace:1 },
  { id:"pep-habanero", name:"Habanero",           category:"peppers", price:8.99, unit:"lb", available:true, basketEligible:true, basketSpace:1 },
  { id:"pep-green",    name:"Green Chili",        category:"peppers", price:null, unit:"lb", priceNote:"Price information needed", availabilityNote:"INFORMATION NEEDED", basketEligible:false },

  // ---- VEGETABLES / GREENS ----
  { id:"veg-broccoli",   name:"Broccoli",              category:"vegetables", price:4.99, unit:"lb", available:true, seasonal:true, basketEligible:true, basketSpace:2 },
  { id:"veg-spinach",    name:"Spinach",               category:"vegetables", price:5.99, unit:"lb", available:true, basketEligible:true, basketSpace:1 },
  { id:"veg-cauliflower",name:"Cauliflower",           category:"vegetables", price:5.99, unit:"lb", available:true, basketEligible:true, basketSpace:2 },
  { id:"veg-cucumber",   name:"Cucumber",              category:"vegetables", price:3.99, unit:"lb", available:true, featured:true, basketEligible:true, basketSpace:2 },
  { id:"veg-lettuce",    name:"Lettuce Varieties",     category:"vegetables", price:null, unit:"lb", priceNote:"Price information needed", availabilityNote:"INFORMATION NEEDED", basketEligible:false },
  { id:"veg-cabbage",    name:"Cabbage",               category:"vegetables", price:null, unit:"lb", priceNote:"Price information needed", availabilityNote:"INFORMATION NEEDED", basketEligible:false },

  // ---- ONIONS & GARLIC (organized under Vegetables) ----
  { id:"veg-garlic-mex",   name:"Mexican Garlic",     category:"vegetables", price:8.99, unit:"lb", available:true, basketEligible:true, basketSpace:1 },
  { id:"veg-garlic-am",    name:"American Garlic",    category:"vegetables", price:7.99, unit:"lb", available:true, basketEligible:true, basketSpace:1 },
  { id:"veg-onion-red",    name:"Red Onion",          category:"vegetables", price:3.99, unit:"lb", available:true, basketEligible:true, basketSpace:1 },
  { id:"veg-onion-white",  name:"White Onion",        category:"vegetables", price:3.99, unit:"lb", available:true, basketEligible:true, basketSpace:1 },
  { id:"veg-onion-texas",  name:"Texas Yellow Onion", category:"vegetables", price:4.49, unit:"lb", available:true, basketEligible:true, basketSpace:1 },

  // ---- EGGPLANT (organized under Vegetables) ----
  { id:"veg-bangon",   name:"Bangon / Eggplant", category:"vegetables", price:5.99, unit:"lb", available:true, basketEligible:true, basketSpace:2 },
  { id:"veg-eggplant", name:"Eggplant",          category:"vegetables", price:4.99, unit:"lb", available:true, basketEligible:true, basketSpace:2 },

  // ---- SQUASH & ZUCCHINI ----
  { id:"sq-yellow",   name:"Yellow Squash",        category:"squash", price:3.99, unit:"lb", available:true, basketEligible:true, basketSpace:2 },
  { id:"sq-summer",   name:"Summer Squash",        category:"squash", price:3.99, unit:"lb", available:true, basketEligible:true, basketSpace:2 },
  { id:"sq-bottle",   name:"Bottle Gourd",         category:"squash", price:5.99, unit:"each", available:true, basketEligible:true, basketSpace:4 },
  { id:"zuc-american",name:"American Zucchini",    category:"squash", price:3.99, unit:"lb", available:true, seasonal:true, basketEligible:true, basketSpace:2 },
  { id:"zuc-indian",  name:"Indian Zucchini",       category:"squash", price:4.49, unit:"lb", available:true, basketEligible:true, basketSpace:2 },
  { id:"zuc-darkgreen",name:"Dark Green Zucchini",  category:"squash", price:3.99, unit:"lb", available:true, basketEligible:true, basketSpace:2 },
  { id:"zuc-black",   name:"Black Zucchini",        category:"squash", price:4.49, unit:"lb", available:true, basketEligible:true, basketSpace:2 },

  // ---- GOURDS ----
  { id:"gou-cese",   name:"Cese Loofah Gourd",      category:"gourds", price:4.99, unit:"lb", available:true, basketEligible:true, basketSpace:2 },
  { id:"gou-asian",  name:"Early Asian Loofah",     category:"gourds", price:4.99, unit:"lb", available:true, basketEligible:true, basketSpace:2 },

  // ---- ROOT VEGETABLES ----
  { id:"root-carrot", name:"Carrot",     category:"root", price:3.99, unit:"lb", available:true, featured:true, basketEligible:true, basketSpace:2 },
  { id:"root-radred", name:"Red Radish", category:"root", price:4.99, unit:"lb", available:true, basketEligible:true, basketSpace:1 },
  { id:"root-radwhite",name:"White Radish", category:"root", price:4.99, unit:"lb", available:true, basketEligible:true, basketSpace:1 },
  { id:"root-beets",  name:"Beets",      category:"root", price:4.99, unit:"lb", available:true, basketEligible:true, basketSpace:2 },

  // ---- HERBS & LEAVES ----
  { id:"herb-basil",    name:"Basil",           category:"herbs", price:9.99,  unit:"lb", available:true, featured:true, basketEligible:true, basketSpace:1 },
  { id:"herb-cilantro", name:"Cilantro",        category:"herbs", price:7.99,  unit:"lb", available:true, basketEligible:true, basketSpace:1 },
  { id:"herb-coriander",name:"Coriander",       category:"herbs", price:7.99,  unit:"lb", available:true, basketEligible:true, basketSpace:1 },
  { id:"herb-dill",     name:"Dill",            category:"herbs", price:8.99,  unit:"lb", available:true, basketEligible:true, basketSpace:1 },
  { id:"herb-mint",     name:"Mint",            category:"herbs", price:8.99,  unit:"lb", available:true, basketEligible:true, basketSpace:1 },
  { id:"herb-lavender", name:"Lavender",        category:"herbs", price:12.99, unit:"lb", available:true, basketEligible:true, basketSpace:1 },
  { id:"herb-thyme",    name:"Thyme",           category:"herbs", price:9.99,  unit:"lb", available:true, basketEligible:true, basketSpace:1 },
  { id:"herb-lemongrass",name:"Lemongrass",     category:"herbs", price:8.99,  unit:"lb", available:true, basketEligible:true, basketSpace:1 },
  { id:"herb-curry",    name:"Curry Leaves",    category:"herbs", price:12.99, unit:"lb", available:true, basketEligible:true, basketSpace:1 },
  { id:"herb-moringa",  name:"Moringa Leaves",  category:"herbs", price:9.99,  unit:"lb", available:true, basketEligible:true, basketSpace:1 },
  { id:"herb-parsley",  name:"Italian Parsley", category:"herbs", price:8.99,  unit:"lb", available:true, basketEligible:true, basketSpace:1 },
  { id:"herb-aloe",     name:"Aloe Leaves",     category:"herbs", price:4.99,  unit:"lb", available:true, basketEligible:true, basketSpace:1 },

  // ---- FRUITS ----
  { id:"fr-strawberry", name:"Strawberries",         category:"fruits", price:6.99,  unit:"lb",   available:true, featured:true, basketEligible:true, basketSpace:2 },
  { id:"fr-raspberry",  name:"Raspberries",          category:"fruits", price:9.99,  unit:"lb",   available:true, basketEligible:true, basketSpace:2 },
  { id:"fr-pear",       name:"Pear",                 category:"fruits", price:4.99,  unit:"lb",   available:true, basketEligible:true, basketSpace:2 },
  { id:"fr-peach",      name:"Peach",                category:"fruits", price:5.99,  unit:"lb",   available:true, seasonal:true, basketEligible:true, basketSpace:2 },
  { id:"fr-cantaloupe", name:"Cantaloupe",           category:"fruits", price:4.99,  unit:"lb",   available:true, seasonal:true, basketEligible:true, basketSpace:3 },
  { id:"fr-watermelon", name:"Watermelon",           category:"fruits", price:7.99,  unit:"each", available:true, featured:true, basketEligible:true, basketSpace:4 },
  { id:"fr-blackdiamond",name:"Black Diamond Watermelon", category:"fruits", price:12.99, unit:"each", available:true, basketEligible:true, basketSpace:4 },
  { id:"fr-pumpkin",    name:"Pumpkin",              category:"fruits", price:8.99,  unit:"each", available:true, basketEligible:true, basketSpace:4 },
  { id:"fr-lemon",      name:"Lemons",               category:"fruits", price:3.99,  unit:"lb",   available:true, basketEligible:true, basketSpace:1 },

  // ---- OKRA ----
  { id:"okra-crimson", name:"Crimson Okra", category:"okra", price:5.99, unit:"lb", available:true, seasonal:true, basketEligible:true, basketSpace:2 },
  { id:"okra-emerald", name:"Emerald Okra", category:"okra", price:5.99, unit:"lb", available:true, basketEligible:true, basketSpace:2 },

  // ---- POTATOES ----
  { id:"pot-red",   name:"Red Potatoes",   category:"potatoes", price:3.99, unit:"lb", available:true, basketEligible:true, basketSpace:2 },
  { id:"pot-white", name:"White Potatoes", category:"potatoes", price:3.99, unit:"lb", available:true, basketEligible:true, basketSpace:2 },

  // ---- BEANS ----
  { id:"bean-green", name:"Green Beans",         category:"beans", price:4.99, unit:"lb", available:true, seasonal:true, basketEligible:true, basketSpace:1 },
  { id:"bean-lima",  name:"Lima Beans",          category:"beans", price:5.99, unit:"lb", available:true, basketEligible:true, basketSpace:1 },
  { id:"bean-guar",  name:"Guar Cluster Beans",  category:"beans", price:5.99, unit:"lb", available:true, basketEligible:true, basketSpace:1 },

  // ---- SEEDS (not basket-eligible) ----
  { id:"seed-moringa-std", name:"Standard Moringa Seeds",        category:"seeds", price:6.99, unit:"packet", available:true, basketEligible:false },
  { id:"seed-moringa-black",name:"Matured Black Moringa Seeds",  category:"seeds", price:8.99, unit:"packet", available:true, basketEligible:false },

  // ---- FLOWERS (no invented prices; not confirmed as currently grown) ----
  { id:"fl-roses",     name:"Roses",                 category:"flowers", price:null, priceNote:"Price available at farm", availabilityNote:"INFORMATION NEEDED", basketEligible:false },
  { id:"fl-sunflowers",name:"Sunflowers",             category:"flowers", price:null, priceNote:"Price available at farm", availabilityNote:"INFORMATION NEEDED", basketEligible:false },
  { id:"fl-marigolds", name:"Marigolds",              category:"flowers", price:null, priceNote:"Price available at farm", availabilityNote:"INFORMATION NEEDED", basketEligible:false },
  { id:"fl-zinnias",   name:"Zinnias",                category:"flowers", price:null, priceNote:"Price available at farm", availabilityNote:"INFORMATION NEEDED", basketEligible:false },
  { id:"fl-cosmos",    name:"Cosmos",                 category:"flowers", price:null, priceNote:"Price available at farm", availabilityNote:"INFORMATION NEEDED", basketEligible:false },
  { id:"fl-dahlias",   name:"Dahlias",                category:"flowers", price:null, priceNote:"Price available at farm", availabilityNote:"INFORMATION NEEDED", basketEligible:false },
  { id:"fl-lavenderfl",name:"Lavender Flowers",       category:"flowers", price:null, priceNote:"Price available at farm", availabilityNote:"INFORMATION NEEDED", basketEligible:false },
  { id:"fl-wildflowers",name:"Wildflowers",           category:"flowers", price:null, priceNote:"Price available at farm", availabilityNote:"INFORMATION NEEDED", basketEligible:false },
  { id:"fl-bouquets",  name:"Mixed Flower Bouquets",  category:"flowers", price:null, priceNote:"Price available at farm", availabilityNote:"INFORMATION NEEDED", basketEligible:false },
  { id:"fl-seasonal",  name:"Seasonal Flowers",       category:"flowers", price:null, priceNote:"Price available at farm", availabilityNote:"INFORMATION NEEDED", basketEligible:false },
  { id:"fl-bundles",   name:"Flower Bundles",         category:"flowers", price:null, priceNote:"Price available at farm", availabilityNote:"INFORMATION NEEDED", basketEligible:false },

  // ---- BASKETS ----
  { id:"basket-custom", name:"Farm Basket (You Choose the Price)", category:"baskets", price:null, priceNote:"Starts at $10 — you pick the price", unit:"basket", available:true, basketEligible:false, isBasketProduct:true }
];

const PRODUCT_MAP = {};
PRODUCTS.forEach(p => PRODUCT_MAP[p.id] = p);

/* Basket price is customer-adjustable. Capacity scales with price:
   every DOLLARS_PER_SPACE dollars buys one space of room, rounded,
   with a sensible floor so a tiny basket still holds something. */
const DOLLARS_PER_SPACE = 3;
const MIN_BASKET_PRICE = 10;
const BASKET_PRICE_STEP = 5;
const DEFAULT_BASKET_PRICE = 30;
const MIN_BASKET_CAPACITY = 3;

function basketCapacity(){
  return Math.max(MIN_BASKET_CAPACITY, Math.round(state.basketPrice / DOLLARS_PER_SPACE));
}

/* Loyalty rewards ladder — starter config, easy to change later.
   1 point = $1 spent, awarded when an order is submitted. */
const REWARD_TIERS = [
  { points: 50,  reward: "$5 off your next visit" },
  { points: 100, reward: "$10 off your next visit" },
  { points: 200, reward: "A free item from Herbs & Leaves" },
  { points: 300, reward: "$25 off your next Farm Basket" }
];

/* ---------------------------------------------------------------------
   STATE + LOCAL STORAGE
--------------------------------------------------------------------- */
const state = {
  cart: loadJSON("afarm_cart", []),        // [{id, qty}]
  basket: loadJSON("afarm_basket", []),    // [{id, qty}]
  basketPrice: loadJSON("afarm_basketPrice", DEFAULT_BASKET_PRICE),
  account: loadJSON("afarm_account", { name: "", phone: "", points: 0, history: [] }),
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
    localStorage.setItem("afarm_basketPrice", JSON.stringify(state.basketPrice));
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

function isAvailable(p){
  return p.available === true;
}

function mediaPlaceholderText(p){
  return "Photo coming soon";
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
  media.appendChild(el("span", "media-placeholder", mediaPlaceholderText(p)));
  if(!isAvailable(p)){
    const badge = el("span", "unavailable-badge", p.availabilityNote ? "Ask at farm" : "Unavailable");
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

  const addBtn = el("button", "product-add", p.isBasketProduct ? "Build Basket" : (isAvailable(p) ? "Add" : "Ask at Farm"));
  addBtn.disabled = p.isBasketProduct ? false : (!isAvailable(p) || p.price == null);
  addBtn.addEventListener("click", (evt) => {
    evt.stopPropagation();
    if(p.isBasketProduct){ location.hash = "#basket"; }
    else{ addToCart(p.id, 1); }
  });
  info.appendChild(addBtn);
  card.appendChild(info);

  card.addEventListener("click", () => { if(p.isBasketProduct){ location.hash = "#basket"; } else { openDetail(p.id); } });
  card.addEventListener("keydown", (e) => { if(e.key === "Enter" || e.key === " "){ e.preventDefault(); if(p.isBasketProduct){ location.hash = "#basket"; } else { openDetail(p.id); } } });

  return card;
}

/* ---------------------------------------------------------------------
   VIEW ROUTING
--------------------------------------------------------------------- */
const VIEW_IDS = ["home","shop","flowers","basket","cart","account","about"];

function goToView(view){
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
  renderCurrentView();
}

function renderCurrentView(){
  if(state.view === "home") renderHome();
  if(state.view === "shop") renderShop();
  if(state.view === "flowers") renderFlowers();
  if(state.view === "basket") renderBasketView();
  if(state.view === "cart") renderCartView();
  if(state.view === "account") renderAccountView();
}

window.addEventListener("hashchange", () => {
  const view = (location.hash || "#home").replace("#", "");
  goToView(view);
});

/* ---------------------------------------------------------------------
   HOME VIEW
--------------------------------------------------------------------- */
function renderHome(){
  const featured = PRODUCTS.filter(p => p.featured);
  const flowers = PRODUCTS.filter(p => p.category === "flowers").slice(0, 6);
  const seasonal = PRODUCTS.filter(p => p.seasonal);

  fillRail("featuredProductsRail", featured);
  fillRail("featuredFlowersRail", flowers);
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
      if(c.key === "flowers"){ location.hash = "#flowers"; }
      else { state.shopFilter = c.key; location.hash = "#shop"; }
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
  { key: "vegetables", label: "Vegetables" },
  { key: "fruits",     label: "Fruits" },
  { key: "herbs",      label: "Herbs" },
  { key: "flowers",    label: "Flowers" },
  { key: "seeds",      label: "Seeds" },
  { key: "baskets",    label: "Baskets" }
];

function renderShopFilters(){
  const row = document.getElementById("filterRow");
  row.innerHTML = "";
  SHOP_FILTER_GROUPS.forEach(f => {
    const chip = el("button", "filter-chip" + (state.shopFilter === f.key ? " active" : ""), f.label);
    chip.addEventListener("click", () => { state.shopFilter = f.key; renderShop(); });
    row.appendChild(chip);
  });
}

function matchesShopFilter(p){
  if(state.shopFilter === "all") return true;
  if(state.shopFilter === "vegetables"){
    return ["vegetables","tomatoes","peppers","root","squash","gourds","beans","okra","potatoes"].includes(p.category);
  }
  return p.category === state.shopFilter;
}

function matchesSearch(p){
  if(!state.searchTerm) return true;
  const term = state.searchTerm.toLowerCase();
  return p.name.toLowerCase().includes(term) || categoryLabel(p.category).toLowerCase().includes(term);
}

function renderShop(){
  renderShopFilters();
  const container = document.getElementById("shopCategories");
  container.innerHTML = "";

  const visible = PRODUCTS.filter(p => matchesShopFilter(p) && matchesSearch(p));

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
   FLOWERS VIEW
--------------------------------------------------------------------- */
function renderFlowers(){
  const grid = document.getElementById("flowersGrid");
  grid.innerHTML = "";
  PRODUCTS.filter(p => p.category === "flowers" && matchesSearch(p)).forEach(p => grid.appendChild(buildProductCard(p)));
}

/* ---------------------------------------------------------------------
   SEARCH
--------------------------------------------------------------------- */
document.getElementById("searchInput").addEventListener("input", (e) => {
  state.searchTerm = e.target.value.trim();
  if(state.view === "shop") renderShop();
  else if(state.view === "flowers") renderFlowers();
  else if(state.searchTerm){ location.hash = "#shop"; }
});

/* ---------------------------------------------------------------------
   PRODUCT DETAIL SHEET
--------------------------------------------------------------------- */
function openDetail(id){
  const p = PRODUCT_MAP[id];
  if(!p) return;

  addRecentlyViewed(id);

  document.getElementById("detailCategory").textContent = categoryLabel(p.category);
  document.getElementById("detailName").textContent = p.name;

  const priceEl = document.getElementById("detailPrice");
  const pl = priceLabel(p);
  priceEl.textContent = pl ? pl : (p.priceNote || "Price available at farm");

  const availEl = document.getElementById("detailAvailability");
  if(isAvailable(p)){
    availEl.textContent = "Available now";
    availEl.style.color = "var(--leaf)";
  } else {
    availEl.textContent = p.availabilityNote === "INFORMATION NEEDED" ? "Ask at the farm for current availability" : "Currently unavailable";
    availEl.style.color = "var(--ink-soft)";
  }

  const media = document.getElementById("detailMedia");
  media.innerHTML = "";
  media.appendChild(document.createTextNode(mediaPlaceholderText(p)));

  const addBtn = document.getElementById("detailAddBtn");
  addBtn.disabled = !isAvailable(p) || p.price == null;
  addBtn.textContent = addBtn.disabled ? "Ask at Farm" : "Add to Cart";
  addBtn.onclick = () => { addToCart(p.id, 1); closeDetail(); };

  document.getElementById("detailScrim").classList.add("open");
  document.getElementById("detailSheet").classList.add("open");
}
function closeDetail(){
  document.getElementById("detailScrim").classList.remove("open");
  document.getElementById("detailSheet").classList.remove("open");
}
document.getElementById("detailScrim").addEventListener("click", closeDetail);
document.getElementById("detailCloseBtn").addEventListener("click", closeDetail);

function addRecentlyViewed(id){
  state.recentlyViewed = [id, ...state.recentlyViewed.filter(x => x !== id)].slice(0, 12);
  saveState();
}

/* ---------------------------------------------------------------------
   CART LOGIC
--------------------------------------------------------------------- */
function addToCart(id, qty){
  const p = PRODUCT_MAP[id];
  if(!p || p.price == null) return;
  const existing = state.cart.find(l => l.id === id);
  if(existing) existing.qty += qty;
  else state.cart.push({ id, qty });
  saveState();
  renderCartBadges();
  renderCartDrawer();
  if(state.view === "cart") renderCartView();
  toast(p.name + " added to cart");
}
function setCartQty(id, qty){
  const line = state.cart.find(l => l.id === id);
  if(!line) return;
  if(qty <= 0){
    state.cart = state.cart.filter(l => l.id !== id);
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
    const p = PRODUCT_MAP[l.id];
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
  const p = PRODUCT_MAP[l.id];
  if(!p) return document.createDocumentFragment();
  const line = el("div", "cart-line");

  const media = el("div", "cart-line-media");
  media.appendChild(el("span", "media-placeholder", ""));
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
  const body = document.getElementById("orderSummaryBody");
  body.innerHTML = "";

  if(state.cart.length === 0 && state.basket.length === 0){
    body.appendChild(el("p", "empty-note", "Nothing in your order yet."));
  } else {
    state.cart.forEach(l => {
      const p = PRODUCT_MAP[l.id];
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
      const items = state.basket.map(b => PRODUCT_MAP[b.id] ? PRODUCT_MAP[b.id].name + (b.qty>1?" ×"+b.qty:"") : "").filter(Boolean).join(", ");
      bRow.innerHTML = '<span class="order-line-name">Farm Basket</span><span>' + money(state.basketPrice) + '</span>';
      body.appendChild(bRow);
      body.appendChild(el("p", "cart-note", "Basket contents: " + items));
    }
  }

  const total = currentOrderValue();
  const pointsNote = document.getElementById("orderPointsNote");
  pointsNote.textContent = total > 0 ? "Submitting this order earns " + Math.floor(total) + " loyalty points." : "";
  document.getElementById("submitOrderBtn").disabled = total <= 0;

  document.getElementById("orderScrim").classList.add("open");
  document.getElementById("orderSheet").classList.add("open");
}
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
  { key: "peppers", label: "Peppers" },
  { key: "fruits",  label: "Fruits" },
  { key: "herbs",   label: "Herbs" },
  { key: "root",    label: "Root Veg" }
];

function basketSpaceUsed(){
  return state.basket.reduce((sum, b) => {
    const p = PRODUCT_MAP[b.id];
    return p ? sum + p.basketSpace * b.qty : sum;
  }, 0);
}

function addToBasket(id){
  const p = PRODUCT_MAP[id];
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

/* Changing the basket price is blocked if it would shrink capacity
   below what's already sitting in the basket — remove items first. */
function setBasketPrice(newPrice){
  newPrice = Math.max(MIN_BASKET_PRICE, Math.round(newPrice / BASKET_PRICE_STEP) * BASKET_PRICE_STEP || MIN_BASKET_PRICE);
  const wouldBeCapacity = Math.max(MIN_BASKET_CAPACITY, Math.round(newPrice / DOLLARS_PER_SPACE));
  if(wouldBeCapacity < basketSpaceUsed()){
    toast("Remove some items before lowering the price");
    document.getElementById("basketPriceInput").value = state.basketPrice;
    return;
  }
  state.basketPrice = newPrice;
  saveState();
  renderBasketView();
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

  document.getElementById("basketPriceInput").value = state.basketPrice;
  document.getElementById("basketCapacityNote").textContent = "$" + state.basketPrice + " gets you " + capacity + " space" + (capacity===1?"":"s") + " of room.";

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
      const p = PRODUCT_MAP[b.id];
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
  const eligible = PRODUCTS.filter(p => p.basketEligible && isAvailable(p) &&
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

document.getElementById("basketPriceMinus").addEventListener("click", () => setBasketPrice(state.basketPrice - BASKET_PRICE_STEP));
document.getElementById("basketPricePlus").addEventListener("click", () => setBasketPrice(state.basketPrice + BASKET_PRICE_STEP));
document.getElementById("basketPriceInput").addEventListener("change", (e) => setBasketPrice(Number(e.target.value) || DEFAULT_BASKET_PRICE));

/* ---------------------------------------------------------------------
   LOYALTY ACCOUNT
--------------------------------------------------------------------- */
function currentOrderValue(){
  return cartTotal() + (state.basket.length ? state.basketPrice : 0);
}

function nextRewardTier(){
  return REWARD_TIERS.find(t => t.points > state.account.points) || null;
}

function submitOrder(){
  const total = currentOrderValue();
  if(total <= 0){
    toast("Nothing in your order yet");
    return;
  }
  const itemsSummary = [
    ...state.cart.map(l => {
      const p = PRODUCT_MAP[l.id];
      return p ? l.qty + "× " + p.name : "";
    }),
    ...(state.basket.length ? ["Farm Basket ($" + state.basketPrice + ")"] : [])
  ].filter(Boolean).join(", ");

  const pointsEarned = Math.floor(total);
  state.account.points += pointsEarned;
  state.account.history.unshift({
    date: new Date().toISOString(),
    items: itemsSummary,
    total: total,
    pointsEarned: pointsEarned
  });
  state.account.history = state.account.history.slice(0, 30);

  state.cart = [];
  state.basket = [];
  saveState();

  renderCartBadges();
  renderCartDrawer();
  closeOrderSummary();
  toast("Order submitted — you earned " + pointsEarned + " points!");

  if(state.view === "cart") renderCartView();
  if(state.view === "basket") renderBasketView();
  if(state.view === "account") renderAccountView();
}
document.getElementById("submitOrderBtn").addEventListener("click", submitOrder);

function renderAccountView(){
  document.getElementById("pointsBalance").textContent = String(state.account.points);

  const progressWrap = document.getElementById("rewardProgress");
  const next = nextRewardTier();
  progressWrap.innerHTML = "";
  if(next){
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
  REWARD_TIERS.forEach(t => {
    const unlocked = state.account.points >= t.points;
    const item = el("li", "reward-item " + (unlocked ? "unlocked" : "locked"));
    item.innerHTML = '<span>' + t.reward + '</span><span class="reward-points">' + t.points + ' pts' + (unlocked ? " ✓" : "") + '</span>';
    list.appendChild(item);
  });

  document.getElementById("accountName").value = state.account.name || "";
  document.getElementById("accountPhone").value = state.account.phone || "";

  const historyList = document.getElementById("orderHistoryList");
  const historyEmpty = document.getElementById("orderHistoryEmpty");
  historyList.innerHTML = "";
  if(state.account.history.length === 0){
    historyEmpty.hidden = false;
  } else {
    historyEmpty.hidden = true;
    state.account.history.forEach(h => {
      const line = el("div", "order-history-line");
      const d = new Date(h.date);
      const left = el("div");
      left.appendChild(el("div", "order-history-date", d.toLocaleDateString(undefined, { month:"short", day:"numeric", year:"numeric" }) + " · +" + h.pointsEarned + " pts"));
      left.appendChild(el("div", "order-history-items", h.items));
      line.appendChild(left);
      line.appendChild(el("div", "order-history-total", money(h.total)));
      historyList.appendChild(line);
    });
  }
}

document.getElementById("saveAccountInfoBtn").addEventListener("click", () => {
  state.account.name = document.getElementById("accountName").value.trim();
  state.account.phone = document.getElementById("accountPhone").value.trim();
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
  const startView = (location.hash || "#home").replace("#", "");
  goToView(VIEW_IDS.includes(startView) ? startView : "home");
}

document.addEventListener("DOMContentLoaded", init);
