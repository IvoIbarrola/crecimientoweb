(() => {
  const phone = "5491168253989";

  document.querySelectorAll("[data-wa]").forEach((link) => {
    const url = new URL(`https://wa.me/${phone}`);
    url.searchParams.set("text", link.dataset.wa || "Hola, vi la demo y quiero consultar por un proyecto.");
    link.href = url.toString();
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });

  document.querySelectorAll("[data-admin-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const panel = document.getElementById(button.dataset.adminToggle);
      if (!panel) return;
      panel.hidden = !panel.hidden;
      button.setAttribute("aria-expanded", String(!panel.hidden));
      if (!panel.hidden) panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  });

  document.querySelectorAll("[data-add-menu-item]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const values = new FormData(form);
      const name = String(values.get("name") || "").trim();
      const description = String(values.get("description") || "").trim();
      const imageUrl = String(values.get("image") || "").trim();
      const price = Number(values.get("price"));
      if (!name || !description || !imageUrl || !Number.isFinite(price) || price <= 0) return;

      const card = document.createElement("article");
      card.className = "card";
      card.classList.add("menu-card");
      card.dataset.category = String(values.get("category"));
      const image = document.createElement("img");
      image.className = "card-image";
      image.src = imageUrl;
      image.alt = `Imagen ilustrativa de ${name}`;
      const body = document.createElement("div");
      body.className = "card-body";
      const tag = document.createElement("span");
      tag.className = "demo-label";
      tag.textContent = card.dataset.category;
      const title = document.createElement("h3");
      title.textContent = name;
      const text = document.createElement("p");
      text.textContent = description;
      const meta = document.createElement("div");
      meta.className = "card-meta";
      const note = document.createElement("span");
      note.textContent = "Recién agregado · ejemplo";
      const amount = document.createElement("strong");
      amount.className = "price";
      amount.textContent = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(price);
      meta.append(note, amount);
      body.append(tag, title, text, meta);
      card.append(image, body);
      document.querySelector("[data-menu-list]")?.append(card);
      form.reset();
      document.getElementById("menu-status").textContent = "El producto se agregó a esta vista de demostración.";
    });
  });

  document.querySelectorAll("[data-price-editor]").forEach((editor) => {
    editor.addEventListener("submit", (event) => {
      event.preventDefault();
      editor.querySelectorAll("[data-price-input]").forEach((input) => {
        const price = Number(input.value);
        const target = document.querySelector(`[data-price-value="${input.dataset.priceInput}"]`);
        if (target && Number.isFinite(price) && price >= 0) {
          target.textContent = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(price);
        }
      });
      const status = editor.querySelector("[data-price-status]");
      if (status) status.textContent = "Precios actualizados solo en esta demostración.";
    });
  });

  const quiz = document.getElementById("fitness-quiz");
  if (quiz) {
    quiz.addEventListener("submit", (event) => {
      event.preventDefault();
      const goal = quiz.elements.goal.value;
      const experience = quiz.elements.experience.value;
      if (!goal || !experience) return;
      const goals = {
        fuerza: "Fuerza y técnica",
        energia: "Más energía y movimiento",
        habito: "Crear un hábito saludable"
      };
      const plans = {
        fuerza: ["Plan Fuerza", "Una rutina progresiva de fuerza puede ser un buen punto de partida."],
        energia: ["Plan Movimiento", "Una combinación gradual de actividad y recuperación puede ayudarte a empezar."],
        habito: ["Plan Constancia", "Un plan flexible y gradual puede ayudarte a construir una rutina sostenible."]
      };
      const [plan, description] = plans[goal];
      document.getElementById("quiz-result-title").textContent = plan;
      document.getElementById("quiz-result-copy").textContent = `${description} Objetivo: ${goals[goal].toLowerCase()}; experiencia: ${experience}.`;
      const contact = document.getElementById("quiz-contact");
      contact.dataset.wa = `Hola, hice el test de la demo del gimnasio. Me interesa ${goals[goal].toLowerCase()} y mi experiencia es ${experience}. Quisiera conocer opciones.`;
      const url = new URL(`https://wa.me/${phone}`);
      url.searchParams.set("text", contact.dataset.wa);
      contact.href = url.toString();
      document.getElementById("quiz-result").hidden = false;
      document.getElementById("quiz-result").scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      document.querySelectorAll("[data-filter]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
      document.querySelectorAll("[data-product]").forEach((product) => {
        product.hidden = filter !== "todos" && product.dataset.product !== filter;
      });
    });
  });

  const cartItems = [];
  document.querySelectorAll("[data-add-to-cart]").forEach((button) => {
    button.addEventListener("click", () => {
      const product = button.closest("[data-product-card]");
      const size = product.querySelector("[data-selected-size]")?.textContent || "";
      const color = product.querySelector("[data-selected-color]")?.textContent || "";
      if (!size || !color) {
        product.querySelector("[data-product-status]").textContent = "Elige un talle y un color para continuar.";
        return;
      }
      cartItems.push(`${product.dataset.productName} (talle ${size}, color ${color})`);
      document.querySelectorAll("[data-cart-count]").forEach((count) => {
        count.textContent = String(cartItems.length);
      });
      product.querySelector("[data-product-status]").textContent = `${product.dataset.productName} · talle ${size} · ${color} se agregó al carrito de muestra.`;
      document.getElementById("carrito").hidden = false;
      const cartContact = document.getElementById("cart-contact");
      const url = new URL(`https://wa.me/${phone}`);
      url.searchParams.set("text", `Hola, vi la tienda de muestra y quiero consultar por: ${cartItems.join("; ")}.`);
      cartContact.href = url.toString();
    });
  });

  document.querySelectorAll("[data-choice-group]").forEach((group) => {
    group.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-choice]");
      if (!button) return;
      group.querySelectorAll("[data-choice]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
      const selected = group.closest("[data-product-card]").querySelector(`[data-selected-${group.dataset.choiceGroup}]`);
      if (selected) selected.textContent = button.dataset.choice;
    });
  });

  const orderRows = document.querySelector("[data-order-list]");
  const orderForm = document.querySelector("[data-order-form]");
  const orderFilterButtons = document.querySelectorAll("[data-order-filter]");
  const orderSearch = document.querySelector("[data-order-search]");

  function updateOrderView() {
    if (!orderRows) return;
    const activeFilter = document.querySelector("[data-order-filter][aria-pressed='true']")?.dataset.orderFilter || "todos";
    const query = orderSearch?.value.trim().toLocaleLowerCase("es") || "";
    orderRows.querySelectorAll("[data-order-row]").forEach((row) => {
      const matchesStatus = activeFilter === "todos" || row.dataset.status === activeFilter;
      const matchesSearch = !query || row.textContent.toLocaleLowerCase("es").includes(query);
      row.hidden = !(matchesStatus && matchesSearch);
    });

    const rows = [...orderRows.querySelectorAll("[data-order-row]")];
    const pending = rows.filter((row) => row.dataset.status === "Pendiente").length;
    const count = document.querySelector("[data-order-count]");
    const pendingCount = document.querySelector("[data-pending-count]");
    if (count) count.textContent = String(rows.length);
    if (pendingCount) pendingCount.textContent = String(pending);
  }

  orderSearch?.addEventListener("input", updateOrderView);
  orderFilterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      orderFilterButtons.forEach((filter) => filter.setAttribute("aria-pressed", String(filter === button)));
      updateOrderView();
    });
  });

  orderRows?.addEventListener("change", (event) => {
    const select = event.target.closest("[data-order-status]");
    if (!select) return;
    const row = select.closest("[data-order-row]");
    row.dataset.status = select.value;
    const badge = row.querySelector("[data-status-badge]");
    if (badge) {
      badge.textContent = select.value;
      badge.dataset.status = select.value;
    }
    updateOrderView();
  });

  orderForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const values = new FormData(orderForm);
    const customer = String(values.get("customer") || "").trim();
    const item = String(values.get("item") || "").trim();
    const amount = Number(values.get("amount"));
    if (!customer || !item || !Number.isFinite(amount) || amount <= 0) return;

    const row = document.createElement("tr");
    row.dataset.orderRow = "";
    row.dataset.status = "Pendiente";
    const id = `#${String(orderRows.querySelectorAll("[data-order-row]").length + 1).padStart(3, "0")}`;
    const cells = [id, customer, item, new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(amount)];
    cells.forEach((content) => {
      const cell = document.createElement("td");
      cell.textContent = content;
      row.append(cell);
    });
    const statusCell = document.createElement("td");
    const badge = document.createElement("span");
    badge.className = "status-badge";
    badge.dataset.statusBadge = "";
    badge.dataset.status = "Pendiente";
    badge.textContent = "Pendiente";
    const select = document.createElement("select");
    select.className = "row-status-select";
    select.dataset.orderStatus = "";
    [["Pendiente", "Pendiente"], ["Preparando", "Preparando"], ["Listo", "Listo"]].forEach(([value, label]) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = label;
      select.append(option);
    });
    statusCell.append(badge, select);
    row.append(statusCell);
    orderRows.prepend(row);
    orderForm.reset();
    document.querySelector("[data-order-message]").textContent = "Pedido agregado a esta simulación local.";
    updateOrderView();
  });

  document.querySelectorAll("[data-stock-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const input = form.querySelector("[data-stock-input]");
      const row = form.closest("[data-stock-row]");
      const stock = Number(input.value);
      if (!Number.isInteger(stock) || stock < 0 || !row) return;
      row.querySelector("[data-stock-value]").textContent = String(stock);
      const state = row.querySelector("[data-stock-state]");
      const isLow = stock < 5;
      state.textContent = isLow ? "Reponer" : "Disponible";
      state.dataset.low = String(isLow);
      form.querySelector("[data-stock-message]").textContent = "Stock actualizado en esta demo.";
    });
  });

  const reveals = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach((element) => observer.observe(element));
  } else {
    reveals.forEach((element) => element.classList.add("is-visible"));
  }
})();
