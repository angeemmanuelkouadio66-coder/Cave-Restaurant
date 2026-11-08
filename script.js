/* ====== CONFIGURATION ======
   Numéro WhatsApp du vendeur : indicatif pays (225 = Côte d'Ivoire) + numéro, sans + ni espaces.
   Autre numéro du restaurant : 07 12 51 93 69 -> "2250712519369" */
const WHATSAPP_NUMBER = "2250507678179";
const RESTAURANT_NAME = "Cave Restaurant Paillote";

/* ====== DONNÉES DU MENU ======
   options : [libellé, prix]   |   prep : modes de préparation au choix   */
const MENU = [
  {
    id: "volailles", title: "Volailles", items: [
      { name: "Poulet local", prep: ["Grillé", "Soupe", "Braisé"], options: [["Entier", 9000], ["Demi", 5000]] },
      { name: "Poulet de chair", prep: ["Grillé", "Soupe", "Braisé"], options: [["Entier", 5000], ["Demi", 3000]] },
      { name: "Poulet pondeuse", prep: ["Grillé", "Soupe", "Braisé"], options: [["Entier", 8000], ["Demi", 4500]] },
      { name: "Pintade", prep: ["Grillée", "Soupe", "Sautée"], options: [["Entière", 10000], ["Demi", 5500]] },
      { name: "Caille", prep: ["Grillée", "Soupe", "Braisée"], options: [["Entière", 2000]] }
    ]
  },
  {
    id: "viandes", title: "Viandes", items: [
      { name: "Bœuf", prep: ["Steak"], options: [["Portion", 4000]] },
      { name: "Soupe de tripes", options: [["Portion", 4000]] },
      { name: "Agneau", prep: ["Grillé", "Soupe", "Sauce tomate"], options: [["Portion", 5000]] },
      { name: "Gigot aux légumes", options: [["Portion", 10000]] },
      { name: "Cabri", note: "À partir de 2 000 F", prep: ["Sauté", "Soupe"], options: [["Portion", 2000]] },
      { name: "Gésier", prep: ["Grillé", "Braisé"], options: [["Assiette", 2000]] },
      { name: "Lapin", prep: ["Sauce arachide", "Sauté"], options: [["Entier", 12000], ["Demi", 6500]] }
    ]
  },
  {
    id: "poissons", title: "Poissons & fruits de mer", items: [
      { name: "Poisson", note: "Capitaine / Carpe / Sosso · à partir de 3 000 F", prep: ["Grillé", "Sauce claire"], options: [["Portion", 3000]] },
      { name: "Escargot", prep: ["Sauté", "Sauce claire piquante"], options: [["Portion", 4000]] },
      { name: "Soupe du pêcheur", options: [["Taler", 6000]] }
    ]
  },
  {
    id: "riz", title: "Riz & placali", items: [
      { name: "Riz soumbara – Pintade", options: [["Entier", 11000], ["Demi", 6000]] },
      { name: "Riz soumbara – Poulet de chair", options: [["Entier", 6000], ["Demi", 3500]] },
      { name: "Riz yassa – Poulet de chair", options: [["Entier", 6000], ["Demi", 3500]] },
      { name: "Riz gras", options: [["Entier", 6000], ["Demi", 3500]] },
      { name: "Placali", options: [["Taler", 1000]] }
    ]
  },
  {
    id: "accompagnements", title: "Accompagnements", items: [
      { name: "Riz blanc", options: [["Portion", 500]] },
      { name: "Foutou", options: [["Portion", 500]] },
      { name: "Légumes sautés", options: [["Portion", 1000]] },
      { name: "Aloco", options: [["Portion", 1000]] },
      { name: "Igname", options: [["Portion", 1000]] },
      { name: "Attiéké", options: [["Portion", 200]] }
    ]
  },
  {
    id: "jus", title: "Jus naturels", green: true, items: [
      { name: "Jus de gingembre", options: [["Verre", 1000]] },
      { name: "Jus de bissap", options: [["Verre", 1000]] },
      { name: "Jus de tamarin", options: [["Verre", 1000]] },
      { name: "Jus de baobab", options: [["Verre", 1500]] },
      { name: "Jus de mil", options: [["Verre", 1500]] },
      { name: "Jus d'ananas", options: [["Verre", 1500]] },
      { name: "Cocktail de fruits", options: [["Verre", 2000]] },
      { name: "Cocktail alcoolisé", options: [["Verre", 3000]] }
    ]
  },
  {
    id: "desserts", title: "Desserts", items: [
      { name: "Dègué", options: [["Gobelet moyen", 1500]] },
      { name: "Salade de fruits", options: [["Portion", 2000]] },
      { name: "Ananas frais", options: [["Portion", 1000]] },
      { name: "Papaye fraîche", options: [["Portion", 1000]] },
      { name: "Pastèque fraîche", options: [["Portion", 1000]] }
    ]
  },
  {
    id: "chaud", title: "Cafés & boissons chaudes", items: [
      { name: "Café instantané (stick)", options: [["Tasse", 1000]] },
      { name: "Espresso (capsule)", options: [["Tasse", 2000]] },
      { name: "Cappuccino (capsule)", options: [["Tasse", 2500]] },
      { name: "Chocolat chaud", options: [["Tasse", 1500]] }
    ]
  }
];

/* ====== OUTILS ====== */
const $ = (id) => document.getElementById(id);
const fmt = (n) => n.toLocaleString("fr-FR").replace(/\u202f|\u00a0/g, " ") + " F";

let cart = []; // { key, name, option, prep, price, qty }

/* ====== AFFICHAGE DU MENU (une catégorie à la fois) ====== */
function renderMenu() {
  const tabs = $("tabs");
  const menu = $("menu");

  MENU.forEach((cat, ci) => {
    const tab = document.createElement("button");
    tab.textContent = cat.title;
    tab.addEventListener("click", () => showCategory(ci, true));
    tabs.appendChild(tab);
  });

  menu.addEventListener("click", (e) => {
    const btn = e.target.closest(".add");
    if (!btn) return;
    const { c, i, o } = btn.dataset;
    const item = MENU[c].items[i];
    const [option, price] = item.options[o];
    const sel = document.getElementById(`prep-${c}-${i}`);
    addToCart(item.name, option, sel ? sel.value : "", price);

    btn.classList.add("added");
    btn.textContent = "Ajouté ✓";
    setTimeout(() => { btn.classList.remove("added"); btn.textContent = "Ajouter"; }, 900);
  });

  showCategory(0, false);
}

function showCategory(ci, scroll) {
  const cat = MENU[ci];
  const tabButtons = $("tabs").querySelectorAll("button");
  tabButtons.forEach((b, idx) => b.classList.toggle("active", idx === ci));
  tabButtons[ci].scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });

  let html = `<h2 class="${cat.green ? "green" : ""}">${cat.title}</h2><div class="grid">`;
  cat.items.forEach((item, ii) => {
    html += `<article class="item"><h3>${item.name}</h3>`;
    if (item.note) html += `<p class="note">${item.note}</p>`;

    if (item.prep) {
      const opts = item.prep.map((p) => `<option>${p}</option>`).join("");
      html += `<div class="prep"><label for="prep-${ci}-${ii}">Préparation</label>
               <select id="prep-${ci}-${ii}">${opts}</select></div>`;
    }

    item.options.forEach(([label, price], oi) => {
      html += `<div class="opt">
        <span class="label">${label}<span class="price">${fmt(price)}</span></span>
        <button class="add" data-c="${ci}" data-i="${ii}" data-o="${oi}">Ajouter</button>
      </div>`;
    });
    html += `</article>`;
  });
  html += `</div>`;
  $("menu").innerHTML = html;

  if (scroll) window.scrollTo({ top: $("tabs").offsetTop, behavior: "smooth" });
}

/* ====== PANIER ====== */
function addToCart(name, option, prep, price) {
  const key = [name, option, prep].join("|");
  const line = cart.find((l) => l.key === key);
  if (line) line.qty += 1;
  else cart.push({ key, name, option, prep, price, qty: 1 });
  updateCart();
}

function total() { return cart.reduce((s, l) => s + l.price * l.qty, 0); }
function count() { return cart.reduce((s, l) => s + l.qty, 0); }

function updateCart() {
  const n = count();
  $("cartCount").textContent = n === 0 ? "Aucun article" : n + (n > 1 ? " articles" : " article");
  $("cartTotalBar").textContent = fmt(total());
  $("cartTotal").textContent = fmt(total());

  const box = $("cartLines");
  if (!cart.length) {
    box.innerHTML = `<p class="empty">Votre commande est vide. Ajoutez des plats depuis le menu.</p>`;
    return;
  }
  box.innerHTML = cart.map((l, idx) => `
    <div class="cart-line">
      <div>
        <div class="name">${l.name}</div>
        <div class="detail">${[l.option, l.prep].filter(Boolean).join(" · ")}</div>
        <div class="qty">
          <button data-act="minus" data-idx="${idx}" aria-label="Retirer un">−</button>
          <span>${l.qty}</span>
          <button data-act="plus" data-idx="${idx}" aria-label="Ajouter un">+</button>
        </div>
      </div>
      <div class="line-price">${fmt(l.price * l.qty)}</div>
    </div>`).join("");
}

$("cartLines").addEventListener("click", (e) => {
  const b = e.target.closest("button[data-act]");
  if (!b) return;
  const line = cart[b.dataset.idx];
  line.qty += b.dataset.act === "plus" ? 1 : -1;
  if (line.qty <= 0) cart.splice(b.dataset.idx, 1);
  updateCart();
  if (!cart.length) closeDrawer();
});

/* ====== PANNEAU ====== */
function openDrawer() { $("drawer").hidden = false; $("overlay").hidden = false; }
function closeDrawer() { $("drawer").hidden = true; $("overlay").hidden = true; }
$("viewCart").addEventListener("click", openDrawer);
$("orderNow").addEventListener("click", sendOrder);
$("closeDrawer").addEventListener("click", closeDrawer);
$("overlay").addEventListener("click", closeDrawer);
$("clearCart").addEventListener("click", () => { cart = []; updateCart(); closeDrawer(); });

$("mode").addEventListener("change", () => {
  $("addressWrap").hidden = $("mode").value !== "Livraison";
});

/* ====== ENVOI WHATSAPP ====== */
function showError(text) {
  const err = $("formError");
  err.textContent = text;
  err.hidden = false;
  openDrawer();
}

function sendOrder() {
  $("formError").hidden = true;
  const name = $("name").value.trim();
  const mode = $("mode").value;
  const address = $("address").value.trim();
  const note = $("note").value.trim();

  if (!cart.length) { showError("Ajoutez au moins un plat à votre commande."); return; }
  if (mode === "Livraison" && !address) { showError("Entrez votre adresse de livraison."); $("address").focus(); return; }

  let msg = `*Nouvelle commande – ${RESTAURANT_NAME}*\n\n`;
  if (name) msg += `Nom : ${name}\n`;
  if (mode) msg += `Mode : ${mode}\n`;
  if (mode === "Livraison") msg += `Adresse : ${address}\n`;
  msg += `\n*Commande :*\n`;
  cart.forEach((l) => {
    const detail = [l.option, l.prep].filter(Boolean).join(", ");
    msg += `• ${l.qty} × ${l.name} (${detail}) – ${fmt(l.price * l.qty)}\n`;
  });
  msg += `\n*Total : ${fmt(total())}*`;
  if (note) msg += `\n\nRemarque : ${note}`;

  // Ouvre WhatsApp avec le message déjà écrit : il ne reste qu'à appuyer sur Envoyer
  window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

$("orderForm").addEventListener("submit", (e) => {
  e.preventDefault();
  sendOrder();
});

/* ====== DÉMARRAGE ====== */
renderMenu();
updateCart();
