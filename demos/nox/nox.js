const products = [
  { id: "nox", name: "Collar Nox", category: "collares", price: 18000, stock: 7, sku: "NOX-001", image: "https://images.pexels.com/photos/16124744/pexels-photo-16124744.jpeg?w=850", alt: "Collar oscuro de cadena llevado sobre ropa negra, imagen de referencia", description: "Cadena protagonista · 45 cm" },
  { id: "spike-earrings", name: "Aros Spike", category: "aros", price: 16000, stock: 3, sku: "NOX-002", image: "https://images.pexels.com/photos/30936712/pexels-photo-30936712/free-photo-of-elegant-gothic-jewelry-with-intricate-details.jpeg?w=850", alt: "Joyería gótica con anillos y cadenas, imagen de referencia", description: "Un detalle que no pasa desapercibido" },
  { id: "bull-choker", name: "Choker Bull", category: "collares", price: 26000, stock: 5, sku: "NOX-003", image: "https://images.pexels.com/photos/40608221/pexels-photo-40608221/free-photo-of-gothic-fashion-portrait-with-black-dress.jpeg?w=850", alt: "Retrato de moda gótica con collar, imagen de referencia", description: "Ajuste regulable · Hecho a mano" },
  { id: "spike-bracelet", name: "Pulsera Spike", category: "pulseras", price: 18000, stock: 12, sku: "NOX-004", image: "https://images.pexels.com/photos/32305655/pexels-photo-32305655/free-photo-of-black-and-white-artistic-portrait-with-jewelry.jpeg?w=850", alt: "Retrato alternativo con anillos y pulseras, imagen de referencia", description: "Tu toque final de todos los días" },
  { id: "heart-earrings", name: "Aros Heart", category: "aros", price: 8500, stock: 9, sku: "NOX-005", image: "https://images.pexels.com/photos/30936712/pexels-photo-30936712/free-photo-of-elegant-gothic-jewelry-with-intricate-details.jpeg?w=850", alt: "Joyería gótica con anillos y cadenas, imagen de referencia", description: "Chicos en tamaño, grandes en actitud" },
  { id: "dangerous-bracelet", name: "Pulsera Dangerous", category: "pulseras", price: 11000, stock: 2, sku: "NOX-006", image: "https://images.pexels.com/photos/32305655/pexels-photo-32305655/free-photo-of-black-and-white-artistic-portrait-with-jewelry.jpeg?w=850", alt: "Retrato alternativo con anillos y pulseras, imagen de referencia", description: "Una pieza con personalidad propia" },
  { id: "thorns-choker", name: "Choker Thorns", category: "collares", price: 35000, stock: 4, sku: "NOX-007", image: "https://images.pexels.com/photos/40608221/pexels-photo-40608221/free-photo-of-gothic-fashion-portrait-with-black-dress.jpeg?w=850", alt: "Retrato de moda gótica con collar, imagen de referencia", description: "Volumen, textura y carácter" },
  { id: "thorns-bracelet", name: "Pulsera Thorns", category: "pulseras", price: 11000, stock: 16, sku: "NOX-008", image: "https://images.pexels.com/photos/30936712/pexels-photo-30936712/free-photo-of-elegant-gothic-jewelry-with-intricate-details.jpeg?w=850", alt: "Joyería gótica con anillos y cadenas, imagen de referencia", description: "Acero quirúrgico · Terminación artesanal" },
];

const orders = [
  { id: "NOX-024", date: "02 nov · 14:32", customer: "Lucía Fernández", detail: "Choker Thorns", total: 35000, status: "Pendiente" },
  { id: "NOX-023", date: "02 nov · 12:18", customer: "Mateo Ríos", detail: "Aros Spike × 2", total: 32000, status: "Preparando" },
  { id: "NOX-022", date: "01 nov · 18:47", customer: "Valentina Paz", detail: "Collar Nox + Aros Heart", total: 26500, status: "Listo" },
  { id: "NOX-021", date: "01 nov · 16:09", customer: "Tomás Vega", detail: "Pulsera Dangerous", total: 11000, status: "Pendiente" },
];

const categoryNames = { collares: "Collares", aros: "Aros", pulseras: "Pulseras" };
const currency = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
const cart = new Map();
const railProductIds = ["nox", "spike-earrings", "bull-choker", "spike-bracelet"];
let activeFilter = "todos";
let activeOrderFilter = "todos";
let activeRailProductId = railProductIds[0];
let toastTimeout;

const storeView = document.getElementById("store-view");
const adminView = document.getElementById("admin-view");
const productGrid = document.querySelector("[data-product-grid]");
const cartDialog = document.querySelector("[data-cart-dialog]");
const cartLines = document.querySelector("[data-cart-lines]");
const toast = document.querySelector("[data-toast]");

function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function setToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

function renderStoreProducts() {
  productGrid.replaceChildren();
  const visible = products.filter((product) => activeFilter === "todos" || product.category === activeFilter);
  visible.forEach((product) => {
    const card = makeElement("article", "product-card");
    card.dataset.productCard = product.id;

    const photo = makeElement("div", "product-photo");
    const image = makeElement("img");
    image.src = product.image;
    image.alt = product.alt;
    image.loading = "lazy";
    image.decoding = "async";
    const tag = makeElement("span", "product-tag", categoryNames[product.category]);
    const addButton = makeElement("button", "product-add", "Agregar a mi bolsa  +");
    addButton.type = "button";
    addButton.dataset.addProduct = product.id;
    addButton.setAttribute("aria-label", `Agregar ${product.name} a la bolsa`);
    photo.append(image, tag, addButton);

    const details = makeElement("div", "product-details");
    const meta = makeElement("div", "product-meta");
    meta.append(makeElement("h3", "product-name", product.name), makeElement("strong", "product-price", currency.format(product.price)));
    details.append(meta, makeElement("p", "product-description", product.description));
    const stockNote = makeElement("small", "product-stock", product.stock === 0 ? "Sin stock por el momento" : "Hecho a mano · Acero quirúrgico");
    details.append(stockNote);
    card.append(photo, details);
    productGrid.append(card);
  });
  document.querySelector("[data-visible-count]").textContent = String(visible.length).padStart(2, "0");
  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.filter === activeFilter));
  });
}

function renderJewelryRail(selectedId = activeRailProductId) {
  const rail = document.querySelector("[data-jewelry-rail]");
  const railProducts = railProductIds.map((id) => products.find((product) => product.id === id)).filter(Boolean);
  if (!railProducts.length) return;

  rail.replaceChildren();
  railProducts.forEach((product, index) => {
    const item = makeElement("button", "jewelry-rail-item");
    item.type = "button";
    item.dataset.railItem = product.id;
    item.setAttribute("aria-label", `Mostrar ${product.name}, ${currency.format(product.price)}`);
    item.setAttribute("aria-pressed", String(product.id === selectedId));

    const image = makeElement("img");
    image.src = product.image;
    image.alt = "";
    image.loading = "lazy";
    image.decoding = "async";
    item.append(image);

    const name = makeElement("span", "jewelry-rail-item-name", product.name);
    const category = makeElement("span", "jewelry-rail-item-category", `${String(index + 1).padStart(2, "0")} · ${categoryNames[product.category]}`);
    item.append(name, category);
    rail.append(item);
  });

  selectRailProduct(railProducts.some((product) => product.id === selectedId) ? selectedId : railProducts[0].id);
}

function selectRailProduct(id, scrollToItem = false) {
  const index = railProductIds.indexOf(id);
  const product = products.find((item) => item.id === id);
  if (index < 0 || !product) return;

  activeRailProductId = id;
  const image = document.querySelector("[data-rail-feature-image]");
  image.classList.add("is-changing");
  image.src = product.image;
  image.alt = product.alt;
  window.requestAnimationFrame(() => image.classList.remove("is-changing"));

  document.querySelector("[data-rail-category]").textContent = categoryNames[product.category];
  document.querySelector("[data-rail-name]").textContent = product.name;
  document.querySelector("[data-rail-description]").textContent = product.description;
  document.querySelector("[data-rail-price]").textContent = currency.format(product.price);
  document.querySelector("[data-rail-feature-index]").textContent = `${String(index + 1).padStart(2, "0")} / ${String(railProductIds.length).padStart(2, "0")}`;
  document.querySelector("[data-rail-position]").textContent = `${String(index + 1).padStart(2, "0")} / ${String(railProductIds.length).padStart(2, "0")}`;
  document.querySelector(".jewelry-rail-add").dataset.addProduct = product.id;

  document.querySelectorAll("[data-rail-item]").forEach((item) => {
    item.setAttribute("aria-pressed", String(item.dataset.railItem === id));
  });
  if (scrollToItem) {
    document.querySelector(`[data-rail-item="${CSS.escape(id)}"]`).scrollIntoView({
      block: "nearest",
      inline: "center",
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  }
}

function renderCart() {
  cartLines.replaceChildren();
  let count = 0;
  let total = 0;
  cart.forEach((quantity, id) => {
    const product = products.find((item) => item.id === id);
    if (!product) return;
    count += quantity;
    total += product.price * quantity;
    const line = makeElement("article", "cart-line");
    const image = makeElement("img");
    image.src = product.image;
    image.alt = "";
    const detail = makeElement("div");
    detail.append(makeElement("h3", "", product.name), makeElement("p", "", `${quantity} × ${currency.format(product.price)}`));
    const remove = makeElement("button", "cart-remove", "Quitar");
    remove.type = "button";
    remove.dataset.removeProduct = id;
    remove.setAttribute("aria-label", `Quitar ${product.name} de la bolsa`);
    const amount = makeElement("strong", "", currency.format(product.price * quantity));
    line.append(image, detail, amount);
    detail.append(remove);
    cartLines.append(line);
  });
  document.querySelectorAll("[data-cart-count]").forEach((countElement) => {
    countElement.textContent = String(count);
  });
  document.querySelector("[data-open-cart]").setAttribute("aria-label", `Abrir bolsa, ${count} ${count === 1 ? "producto" : "productos"}`);
  document.querySelector("[data-cart-total]").textContent = currency.format(total);
  document.querySelector("[data-cart-empty]").hidden = count > 0;
  document.querySelector("[data-cart-footer]").hidden = count === 0;
}

function renderOrders() {
  const query = document.querySelector("[data-order-search]").value.trim().toLocaleLowerCase("es");
  const rows = orders.filter((order) => {
    const matchesStatus = activeOrderFilter === "todos" || order.status === activeOrderFilter;
    const matchesQuery = `${order.id} ${order.customer} ${order.detail}`.toLocaleLowerCase("es").includes(query);
    return matchesStatus && matchesQuery;
  });

  const createOrderRow = (order, recent = false) => {
    const row = makeElement("tr");
    const idCell = makeElement("td");
    idCell.append(makeElement("span", "order-id", `#${order.id.slice(-3)}`));
    if (!recent) row.append(idCell, makeElement("td", "", order.date));
    else row.append(idCell);
    row.append(makeElement("td", "", order.customer), makeElement("td", "", order.detail), makeElement("td", "", currency.format(order.total)));
    const statusCell = makeElement("td");
    const status = makeElement("span", "order-badge", order.status);
    status.dataset.status = order.status;
    statusCell.append(status);
    if (!recent) {
      const select = makeElement("select", "order-select");
      select.dataset.orderStatus = order.id;
      select.setAttribute("aria-label", `Estado del pedido ${order.id}`);
      ["Pendiente", "Preparando", "Listo"].forEach((value) => {
        const option = makeElement("option", "", value);
        option.value = value;
        option.selected = value === order.status;
        select.append(option);
      });
      statusCell.append(document.createElement("br"), select);
    }
    row.append(statusCell);
    return row;
  };

  const orderTable = document.querySelector("[data-order-list]");
  orderTable.replaceChildren(...rows.map((order) => createOrderRow(order)));
  document.querySelector("[data-order-empty]").hidden = rows.length > 0;
  document.querySelector("[data-recent-orders]").replaceChildren(...orders.slice(0, 3).map((order) => createOrderRow(order, true)));
  document.querySelectorAll("[data-order-filter]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.orderFilter === activeOrderFilter));
  });
  const pending = orders.filter((order) => order.status === "Pendiente").length;
  document.querySelector("[data-pending-badge]").textContent = String(pending);
  document.querySelector("[data-metric-orders]").textContent = String(orders.filter((order) => order.status !== "Listo").length);
}

function renderProductsAdmin() {
  const productRows = products.map((product) => {
    const row = makeElement("tr");
    const productCell = makeElement("td");
    const productName = makeElement("div", "admin-product-name");
    const image = makeElement("img");
    image.src = product.image;
    image.alt = "";
    image.loading = "lazy";
    const title = makeElement("div");
    title.append(makeElement("strong", "", product.name), makeElement("small", "", product.sku));
    productName.append(image, title);
    productCell.append(productName);
    row.append(productCell, makeElement("td", "", categoryNames[product.category]));
    const priceCell = makeElement("td");
    const priceForm = makeElement("form", "inline-editor");
    priceForm.dataset.priceForm = product.id;
    const priceInput = makeElement("input");
    priceInput.type = "number";
    priceInput.min = "1";
    priceInput.step = "1";
    priceInput.required = true;
    priceInput.value = String(product.price);
    priceInput.setAttribute("aria-label", `Precio de ${product.name}`);
    const priceButton = makeElement("button", "", "Guardar");
    priceButton.type = "submit";
    priceForm.append(priceInput, priceButton);
    priceCell.append(priceForm);
    const stockCell = makeElement("td");
    const level = makeElement("span", `stock-level${product.stock <= 5 ? " is-low" : ""}`, product.stock <= 5 ? "Revisar pronto" : "Disponible");
    stockCell.append(level);
    row.append(priceCell, stockCell, makeElement("td", "", "Visible"));
    return row;
  });
  document.querySelector("[data-product-list]").replaceChildren(...productRows);

  const stockRows = products.map((product) => {
    const row = makeElement("tr");
    row.append(makeElement("td", "", product.name), makeElement("td", "", categoryNames[product.category]), makeElement("td", "order-id", product.sku));
    const quantity = makeElement("td");
    const input = makeElement("input", "admin-stock-input");
    input.type = "number";
    input.min = "0";
    input.step = "1";
    input.required = true;
    input.value = String(product.stock);
    input.setAttribute("aria-label", `Unidades de ${product.name}`);
    input.dataset.stockInput = product.id;
    quantity.append(input);
    const action = makeElement("td");
    const button = makeElement("button", "inline-editor button", "Actualizar");
    button.type = "button";
    button.dataset.stockSave = product.id;
    action.append(button);
    row.append(quantity, action);
    return row;
  });
  document.querySelector("[data-stock-list]").replaceChildren(...stockRows);

  document.querySelector("[data-metric-products]").textContent = String(products.length);
  document.querySelector("[data-metric-low]").textContent = String(products.filter((product) => product.stock <= 5).length);
  renderLowStock();
}

function renderLowStock() {
  const lowProducts = products.filter((product) => product.stock <= 5).slice(0, 4);
  const items = lowProducts.map((product) => {
    const row = makeElement("div", "low-stock-item");
    const text = makeElement("div");
    text.append(makeElement("strong", "", product.name), makeElement("small", "", categoryNames[product.category]));
    row.append(text, makeElement("span", "low-stock-qty", `${product.stock} ${product.stock === 1 ? "unidad" : "unidades"}`));
    return row;
  });
  document.querySelector("[data-low-stock-list]").replaceChildren(...items);
}

function updateProduct(id, key, value) {
  const product = products.find((item) => item.id === id);
  if (!product) return;
  product[key] = value;
  renderStoreProducts();
  if (railProductIds.includes(id)) renderJewelryRail(id);
  renderProductsAdmin();
}

function showView(view) {
  const isAdmin = view === "admin";
  storeView.hidden = isAdmin;
  adminView.hidden = !isAdmin;
  window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  if (isAdmin) {
    renderOrders();
    renderProductsAdmin();
  }
}

function showAdminSection(name) {
  document.querySelectorAll("[data-admin-section]").forEach((section) => {
    section.hidden = section.dataset.adminSection !== name;
  });
  document.querySelectorAll("[data-admin-nav]").forEach((link) => {
    const current = link.dataset.adminNav === name;
    link.classList.toggle("is-current", current);
    if (current) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  document.querySelector("[data-admin-crumb]").textContent = name[0].toLocaleUpperCase("es") + name.slice(1);
  if (name === "pedidos") renderOrders();
  if (name === "productos" || name === "stock") renderProductsAdmin();
  document.querySelector(".admin-topbar").scrollIntoView({ block: "start" });
}

document.addEventListener("click", (event) => {
  const viewButton = event.target.closest("[data-view]");
  if (viewButton) {
    showView(viewButton.dataset.view);
    return;
  }

  const filter = event.target.closest("[data-filter]");
  if (filter) {
    activeFilter = filter.dataset.filter;
    renderStoreProducts();
    return;
  }

  const railItem = event.target.closest("[data-rail-item]");
  if (railItem) {
    selectRailProduct(railItem.dataset.railItem, true);
    return;
  }

  const railDirection = event.target.closest("[data-rail-previous], [data-rail-next]");
  if (railDirection) {
    const currentIndex = railProductIds.indexOf(activeRailProductId);
    const offset = railDirection.hasAttribute("data-rail-next") ? 1 : -1;
    const nextIndex = (currentIndex + offset + railProductIds.length) % railProductIds.length;
    selectRailProduct(railProductIds[nextIndex], true);
    return;
  }

  const categoryLink = event.target.closest("[data-category-link]");
  if (categoryLink) {
    activeFilter = categoryLink.dataset.categoryLink;
    renderStoreProducts();
    return;
  }

  const addButton = event.target.closest("[data-add-product]");
  if (addButton) {
    const product = products.find((item) => item.id === addButton.dataset.addProduct);
    if (!product || product.stock < 1) {
      setToast("Esta pieza no tiene unidades disponibles en la demo.");
      return;
    }
    cart.set(product.id, (cart.get(product.id) || 0) + 1);
    renderCart();
    setToast(`${product.name} se agregó a tu bolsa de muestra.`);
    return;
  }

  if (event.target.closest("[data-open-cart]")) {
    cartDialog.showModal();
    return;
  }
  if (event.target.closest("[data-close-cart]")) {
    cartDialog.close();
    return;
  }
  const removeButton = event.target.closest("[data-remove-product]");
  if (removeButton) {
    cart.delete(removeButton.dataset.removeProduct);
    renderCart();
    return;
  }
  if (event.target.closest("[data-demo-checkout]")) {
    setToast("El checkout es ilustrativo: esta demo no procesa compras ni pagos.");
    return;
  }

  const orderFilter = event.target.closest("[data-order-filter]");
  if (orderFilter) {
    activeOrderFilter = orderFilter.dataset.orderFilter;
    renderOrders();
    return;
  }
  const nav = event.target.closest("[data-admin-nav]");
  if (nav) {
    event.preventDefault();
    showAdminSection(nav.dataset.adminNav);
    return;
  }
  const jump = event.target.closest("[data-jump]");
  if (jump) {
    showAdminSection(jump.dataset.jump);
    return;
  }
  const stockButton = event.target.closest("[data-stock-save]");
  if (stockButton) {
    const input = document.querySelector(`[data-stock-input="${CSS.escape(stockButton.dataset.stockSave)}"]`);
    const amount = Number(input.value);
    if (!input.value.trim() || !Number.isInteger(amount) || amount < 0) {
      input.setCustomValidity("Ingresá una cantidad entera de cero o más.");
      input.reportValidity();
      return;
    }
    input.setCustomValidity("");
    updateProduct(stockButton.dataset.stockSave, "stock", amount);
    setToast("Stock actualizado en esta sesión de muestra.");
  }
});

document.addEventListener("input", (event) => {
  if (event.target.matches("[data-order-search]")) renderOrders();
  if (event.target.matches("[data-stock-input]")) event.target.setCustomValidity("");
});

document.addEventListener("change", (event) => {
  const select = event.target.closest("[data-order-status]");
  if (!select) return;
  const order = orders.find((item) => item.id === select.dataset.orderStatus);
  if (!order) return;
  order.status = select.value;
  renderOrders();
  setToast(`Pedido ${order.id} actualizado en esta sesión.`);
});

document.addEventListener("submit", (event) => {
  const priceForm = event.target.closest("[data-price-form]");
  if (priceForm) {
    event.preventDefault();
    const amount = Number(priceForm.querySelector("input").value);
    if (!Number.isFinite(amount) || amount <= 0) {
      priceForm.querySelector("input").reportValidity();
      return;
    }
    updateProduct(priceForm.dataset.priceForm, "price", amount);
    setToast("Precio actualizado en esta sesión de muestra.");
    return;
  }

  const productForm = event.target.closest("[data-product-form]");
  if (!productForm) return;
  event.preventDefault();
  const formData = new FormData(productForm);
  const name = String(formData.get("name")).trim();
  const category = String(formData.get("category"));
  const price = Number(formData.get("price"));
  const stock = Number(formData.get("stock"));
  const image = String(formData.get("image")).trim();
  const feedback = document.querySelector("[data-product-feedback]");
  if (!name || !categoryNames[category] || !Number.isFinite(price) || price <= 0 || !Number.isInteger(stock) || stock < 0) {
    feedback.textContent = "Revisá el nombre, la categoría, el precio y el stock.";
    return;
  }
  if (image && !image.startsWith("https://")) {
    feedback.textContent = "La imagen debe usar una dirección HTTPS.";
    return;
  }
  const slug = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const id = `${slug || "pieza"}-${Date.now()}`;
  products.push({
    id,
    name,
    category,
    price,
    stock,
    sku: `NOX-${String(products.length + 1).padStart(3, "0")}`,
    image: image || "https://images.pexels.com/photos/30936712/pexels-photo-30936712/free-photo-of-elegant-gothic-jewelry-with-intricate-details.jpeg?w=850",
    alt: `Imagen ilustrativa de ${name}`,
    description: "Pieza de muestra · Acero quirúrgico",
  });
  productForm.reset();
  feedback.textContent = `${name} se agregó al catálogo local.`;
  activeFilter = "todos";
  renderStoreProducts();
  renderProductsAdmin();
  setToast("Producto añadido a la demo; no se guardó en un servidor.");
});

document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
  button.addEventListener("click", () => {
    const isLight = document.documentElement.dataset.theme !== "light";
    document.documentElement.dataset.theme = isLight ? "light" : "dark";
    button.setAttribute("aria-pressed", String(isLight));
    button.setAttribute("aria-label", `Cambiar a tema ${isLight ? "oscuro" : "claro"}`);
    document.querySelector("[data-theme-label]").textContent = isLight ? "Claro" : "Oscuro";
  });
});

document.querySelectorAll("[data-audio-toggle]").forEach((button) => {
  let audioContext;
  let masterGain;
  let oscillators = [];
  button.addEventListener("click", async () => {
    if (audioContext && audioContext.state === "running") {
      oscillators.forEach((oscillator) => oscillator.stop());
      oscillators = [];
      await audioContext.close();
      audioContext = null;
      button.setAttribute("aria-pressed", "false");
      button.setAttribute("aria-label", "Activar audio ambiente");
      document.querySelector("[data-audio-label]").textContent = "Audio off";
      return;
    }
    try {
      const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextConstructor) throw new Error("Audio no disponible en este navegador.");
      audioContext = new AudioContextConstructor();
      await audioContext.resume();
      masterGain = audioContext.createGain();
      masterGain.gain.value = 0.035;
      masterGain.connect(audioContext.destination);
      [110, 164.81, 220].forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator();
        const voiceGain = audioContext.createGain();
        oscillator.type = index === 1 ? "triangle" : "sine";
        oscillator.frequency.value = frequency;
        voiceGain.gain.value = index === 0 ? 0.28 : 0.16;
        oscillator.connect(voiceGain);
        voiceGain.connect(masterGain);
        oscillator.start();
        oscillators.push(oscillator);
      });
      button.setAttribute("aria-pressed", "true");
      button.setAttribute("aria-label", "Desactivar audio ambiente");
      document.querySelector("[data-audio-label]").textContent = "Audio on";
    } catch (error) {
      setToast(error instanceof Error ? error.message : "No se pudo activar el audio ambiente.");
    }
  });
});

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
if (!reducedMotion.matches) {
  document.documentElement.classList.add("motion-enabled");
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((element) => {
    element.dataset.reveal = "";
    observer.observe(element);
  });
}

let progressQueued = false;
window.addEventListener("scroll", () => {
  if (progressQueued) return;
  progressQueued = true;
  requestAnimationFrame(() => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    document.querySelector("[data-progress]").style.transform = `scaleX(${maxScroll > 0 ? window.scrollY / maxScroll : 0})`;
    progressQueued = false;
  });
}, { passive: true });

renderStoreProducts();
renderJewelryRail();
renderCart();
renderOrders();
renderProductsAdmin();
