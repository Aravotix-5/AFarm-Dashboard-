/* ==========================================================
   A FARM — app.js
   Catalog browsing only (no cart / order submission in this version).
   All product data below is copied directly from the confirmed
   farm price list. Do NOT invent prices, photos, or descriptions.
   Anything not confirmed is marked "INFORMATION NEEDED".
   ========================================================== */

const PRODUCTS = [
  // Tomatoes
  { name: "Cherry Tomatoes", category: "Tomatoes", price: "$5.99/lb" },
  { name: "Big Boy Tomatoes", category: "Tomatoes", price: "$4.99/lb" },
  { name: "Long Tomatoes", category: "Tomatoes", price: "$5.49/lb" },
  { name: "Jelly Bean Hybrid Tomatoes", category: "Tomatoes", price: "$6.49/lb" },

  // Peppers
  { name: "Thai Chili", category: "Peppers", price: "$7.99/lb" },
  { name: "Jalapeño", category: "Peppers", price: "$4.99/lb" },
  { name: "Indian Chili", category: "Peppers", price: "$7.49/lb" },
  { name: "Sweet Bell Pepper", category: "Peppers", price: "$4.99/lb" },
  { name: "Hot Pepper Mix", category: "Peppers", price: "$6.99/lb" },
  { name: "Habanero", category: "Peppers", price: "$8.99/lb" },

  // Greens & Vegetables
  { name: "Broccoli", category: "Vegetables", price: "$4.99/lb" },
  { name: "Spinach", category: "Vegetables", price: "$5.99/lb" },
  { name: "Cauliflower", category: "Vegetables", price: "$5.99/lb" },
  { name: "Cucumber", category: "Vegetables", price: "$3.99/lb" },
  { name: "Lettuce Varieties", category: "Vegetables", price: "INFORMATION NEEDED" },

  // Alliums
  { name: "Mexican Garlic", category: "Alliums", price: "$8.99/lb" },
  { name: "American Garlic", category: "Alliums", price: "$7.99/lb" },
  { name: "Red Onion", category: "Alliums", price: "$3.99/lb" },
  { name: "White Onion", category: "Alliums", price: "$3.99/lb" },
  { name: "Texas Yellow Onion", category: "Alliums", price: "$4.49/lb" },

  // Squash & Gourds
  { name: "Yellow Squash", category: "Squash & Gourds", price: "$3.99/lb" },
  { name: "Summer Squash", category: "Squash & Gourds", price: "$3.99/lb" },
  { name: "Bottle Gourd", category: "Squash & Gourds", price: "$5.99 EACH" },
  { name: "American Zucchini", category: "Squash & Gourds", price: "$3.99/lb" },
  { name: "Indian Zucchini", category: "Squash & Gourds", price: "$4.49/lb" },
  { name: "Dark Green Zucchini", category: "Squash & Gourds", price: "$3.99/lb" },
  { name: "Black Zucchini", category: "Squash & Gourds", price: "$4.49/lb" },
  { name: "Cese Loofah Gourd", category: "Squash & Gourds", price: "$4.99/lb" },
  { name: "Early Asian Loofah", category: "Squash & Gourds", price: "$4.99/lb" },

  // Root Vegetables
  { name: "Carrot", category: "Root Vegetables", price: "$3.99/lb" },
  { name: "Red Radish", category: "Root Vegetables", price: "$4.99/lb" },
  { name: "White Radish", category: "Root Vegetables", price: "$4.99/lb" },
  { name: "Beets", category: "Root Vegetables", price: "$4.99/lb" },
  { name: "Red Potatoes", category: "Root Vegetables", price: "$3.99/lb" },
  { name: "White Potatoes", category: "Root Vegetables", price: "$3.99/lb" },

  // Herbs
  { name: "Basil", category: "Herbs", price: "$9.99/lb" },
  { name: "Cilantro", category: "Herbs", price: "$7.99/lb" },
  { name: "Coriander", category: "Herbs", price: "$7.99/lb" },
  { name: "Dill", category: "Herbs", price: "$8.99/lb" },
  { name: "Mint", category: "Herbs", price: "$8.99/lb" },
  { name: "Lavender", category: "Herbs", price: "$12.99/lb" },
  { name: "Thyme", category: "Herbs", price: "$9.99/lb" },
  { name: "Lemongrass", category: "Herbs", price: "$8.99/lb" },
  { name: "Curry Leaves", category: "Herbs", price: "$12.99/lb" },
  { name: "Moringa Leaves", category: "Herbs", price: "$9.99/lb" },
  { name: "Italian Parsley", category: "Herbs", price: "$8.99/lb" },
  { name: "Aloe Leaves", category: "Herbs", price: "$4.99/lb" },

  // Fruit
  { name: "Strawberries", category: "Fruit", price: "$6.99/lb" },
  { name: "Raspberries", category: "Fruit", price: "$9.99/lb" },
  { name: "Pear", category: "Fruit", price: "$4.99/lb" },
  { name: "Peach", category: "Fruit", price: "$5.99/lb" },
  { name: "Cantaloupe", category: "Fruit", price: "$4.99/lb" },
  { name: "Watermelon", category: "Fruit", price: "$7.99 EACH" },
  { name: "Black Diamond Watermelon", category: "Fruit", price: "$12.99 EACH" },
  { name: "Lemons", category: "Fruit", price: "$3.99/lb" },

  // Pumpkin
  { name: "Pumpkin", category: "Fruit", price: "$8.99 EACH" },

  // Okra
  { name: "Crimson Okra", category: "Vegetables", price: "$5.99/lb" },
  { name: "Emerald Okra", category: "Vegetables", price: "$5.99/lb" },

  // Beans
  { name: "Green Beans", category: "Beans", price: "$4.99/lb" },
  { name: "Lima Beans", category: "Beans", price: "$5.99/lb" },
  { name: "Guar Cluster Beans", category: "Beans", price: "$5.99/lb" },

  // Eggplant
  { name: "Bangon/Eggplant", category: "Vegetables", price: "$5.99/lb" },
  { name: "Eggplant", category: "Vegetables", price: "$4.99/lb" },

  // Seeds
  { name: "Standard Moringa Seeds", category: "Seeds", price: "$6.99/packet" },
  { name: "Matured Black Moringa Seeds", category: "Seeds", price: "$8.99/packet" },
];

/* ==========================================================
   State
   ========================================================== */
let activeCategory = "All";
let searchTerm = "";

/* ==========================================================
   Init
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  renderCategoryNav();
  renderProducts();

  document.getElementById("searchInput").addEventListener("input", (e) => {
    searchTerm = e.target.value.trim().toLowerCase();
    renderProducts();
  });

  document.getElementById("modalClose").addEventListener("click", closeModal);
  document.getElementById("modalBackdrop").addEventListener("click", closeModal);
});

/* ==========================================================
   Category Nav
   ========================================================== */
function renderCategoryNav() {
  const nav = document.getElementById("categoryNav");
  const categories = ["All", ...new Set(PRODUCTS.map((p) => p.category))];

  nav.innerHTML = "";
  categories.forEach((cat) => {
    const pill = document.createElement("button");
    pill.className = "category-pill" + (cat === activeCategory ? " active" : "");
    pill.textContent = cat;
    pill.addEventListener("click", () => {
      activeCategory = cat;
      renderCategoryNav();
      renderProducts();
    });
    nav.appendChild(pill);
  });
}

/* ==========================================================
   Product Grid
   ========================================================== */
function renderProducts() {
  const grid = document.getElementById("productGrid");
  const noResults = document.getElementById("noResults");
  const resultsCount = document.getElementById("resultsCount");

  let filtered = PRODUCTS.filter((p) => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  grid.innerHTML = "";

  if (filtered.length === 0) {
    noResults.hidden = false;
    resultsCount.textContent = "";
    return;
  }

  noResults.hidden = true;
  resultsCount.textContent = `${filtered.length} product${filtered.length === 1 ? "" : "s"}`;

  filtered.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-media-placeholder">Real photo coming soon</div>
      <div class="product-info">
        <div class="product-name">${escapeHTML(product.name)}</div>
        <div class="product-category">${escapeHTML(product.category)}</div>
        <div class="product-price">${escapeHTML(product.price)}</div>
      </div>
    `;
    card.addEventListener("click", () => openModal(product));
    grid.appendChild(card);
  });
}

/* ==========================================================
   Modal
   ========================================================== */
function openModal(product) {
  document.getElementById("modalName").textContent = product.name;
  document.getElementById("modalCategory").textContent = product.category;
  document.getElementById("modalPrice").textContent = product.price;
  document.getElementById("productModal").hidden = false;
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("productModal").hidden = true;
  document.body.style.overflow = "";
}

/* ==========================================================
   Utility
   ========================================================== */
function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
