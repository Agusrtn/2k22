const STORAGE_KEY = "2k22-content";
const USER_SESSION_KEY = "2k22-user-session";
const USERS_KEY = "2k22-users";

const CREATOR_ACCOUNT = {
  name: "2K22",
  password: "Aguselguay",
  email: "creator@2k22.local",
  role: "creator",
};

const placeholderWide =
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1500&q=80";
const placeholderEvent =
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80";
const placeholderStream =
  "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80";
const placeholderReview =
  "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=300&q=80";
const placeholderTeam =
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=80";

const initialData = {
  slides: [
    {
      id: crypto.randomUUID(),
      title: "Noche urbana 2k22",
      caption: "Un recorrido visual por los ultimos highlights en vivo.",
      imageUrl: placeholderWide,
    },
  ],
  events: [
    {
      id: crypto.randomUUID(),
      title: "Sunset Beats Festival",
      date: "2026-06-22",
      location: "Barcelona - Puerto Olimpico",
      price: 45,
      description: "Festival al aire libre con artistas nacionales e internacionales.",
      imageUrl: placeholderEvent,
    },
    {
      id: crypto.randomUUID(),
      title: "Tech Summit Madrid",
      date: "2026-07-10",
      location: "Madrid - IFEMA",
      price: 30,
      description: "Conferencias sobre IA, software y liderazgo digital.",
      imageUrl:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
    },
  ],
  streams: [
    {
      id: crypto.randomUUID(),
      title: "Backstage Live: Sunset Beats",
      datetime: "2026-06-20T21:00",
      platform: "YouTube",
      url: "https://youtube.com",
      imageUrl: placeholderStream,
    },
  ],
  reviews: [
    {
      id: crypto.randomUUID(),
      author: "Lucia M.",
      event: "Urban Lights 2025",
      rating: 5,
      comment: "Sonido impecable, produccion top y acceso rapidisimo con la app.",
      imageUrl: placeholderReview,
    },
  ],
  team: [
    {
      id: crypto.randomUUID(),
      name: "Clara Mendez",
      role: "Directora de Operaciones",
      area: "Coordina logistica integral de eventos y partners.",
      imageUrl:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: crypto.randomUUID(),
      name: "Javier Paredes",
      role: "Administrador de Eventos",
      area: "Publica cartelera, entradas y contenido oficial.",
      imageUrl:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
    },
  ],
};

let selectedEvent = null;
let carouselIndex = 0;
let pendingDeleteAction = null;

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const adminNavItem = document.getElementById("adminNavItem");

const carouselImage = document.getElementById("carouselImage");
const carouselTitle = document.getElementById("carouselTitle");
const carouselCaption = document.getElementById("carouselCaption");
const carouselIndicator = document.getElementById("carouselIndicator");
const carouselPrev = document.getElementById("carouselPrev");
const carouselNext = document.getElementById("carouselNext");

const eventGrid = document.getElementById("eventGrid");
const streamGrid = document.getElementById("streamGrid");
const reviewGrid = document.getElementById("reviewGrid");
const teamGrid = document.getElementById("teamGrid");

const supportForm = document.getElementById("supportForm");
const supportFeedback = document.getElementById("supportFeedback");

const adminArea = document.getElementById("adminArea");
const adminDenied = document.getElementById("adminDenied");
const creatorRoleBlock = document.getElementById("creatorRoleBlock");
const roleSearchForm = document.getElementById("roleSearchForm");
const roleSearchResults = document.getElementById("roleSearchResults");
const roleSearchFeedback = document.getElementById("roleSearchFeedback");

const adminEventForm = document.getElementById("adminEventForm");
const adminPanelFeedback = document.getElementById("adminPanelFeedback");
const adminSlideForm = document.getElementById("adminSlideForm");
const adminStreamForm = document.getElementById("adminStreamForm");
const adminReviewForm = document.getElementById("adminReviewForm");
const adminTeamForm = document.getElementById("adminTeamForm");
const slideFeedback = document.getElementById("slideFeedback");
const streamFeedback = document.getElementById("streamFeedback");
const reviewFeedback = document.getElementById("reviewFeedback");
const teamFeedback = document.getElementById("teamFeedback");
const slideManageList = document.getElementById("slideManageList");
const eventManageList = document.getElementById("eventManageList");
const streamManageList = document.getElementById("streamManageList");
const reviewManageList = document.getElementById("reviewManageList");
const teamManageList = document.getElementById("teamManageList");
const deleteConfirmDialog = document.getElementById("deleteConfirmDialog");
const deleteConfirmText = document.getElementById("deleteConfirmText");
const cancelDeleteButton = document.getElementById("cancelDeleteButton");
const confirmDeleteButton = document.getElementById("confirmDeleteButton");

const ticketDialog = document.getElementById("ticketDialog");
const closeTicketDialog = document.getElementById("closeTicketDialog");
const ticketForm = document.getElementById("ticketForm");
const ticketFeedback = document.getElementById("ticketFeedback");
const ticketEventName = document.getElementById("ticketEventName");

const authButton = document.getElementById("authButton");
const userLoginDialog = document.getElementById("userLoginDialog");
const closeUserLoginDialog = document.getElementById("closeUserLoginDialog");
const userLoginForm = document.getElementById("userLoginForm");
const userLoginFeedback = document.getElementById("userLoginFeedback");

function on(element, event, handler) {
  if (element) {
    element.addEventListener(event, handler);
  }
}

function normalizeRole(value) {
  const role = String(value || "user").toLowerCase();
  if (role === "creator" || role === "admin") {
    return role;
  }
  return "user";
}

function isAdminOrCreator(session) {
  if (!session) {
    return false;
  }
  return session.role === "admin" || session.role === "creator";
}

function isFixedCreatorAccount(user) {
  if (!user) {
    return false;
  }
  return (
    String(user.name || "").toLowerCase() === CREATOR_ACCOUNT.name.toLowerCase() &&
    String(user.email || "").toLowerCase() === CREATOR_ACCOUNT.email.toLowerCase()
  );
}

function readUsers() {
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.map((user) => ({
      id: String(user.id || crypto.randomUUID()),
      name: String(user.name || "Usuario"),
      email: String(user.email || "").toLowerCase(),
      password: String(user.password || ""),
      role: normalizeRole(user.role),
    }));
  } catch (_error) {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function ensureCreatorAccount() {
  const users = readUsers();
  const creatorIndex = users.findIndex((user) => user.name.toLowerCase() === CREATOR_ACCOUNT.name.toLowerCase());

  if (creatorIndex >= 0) {
    users[creatorIndex] = {
      ...users[creatorIndex],
      name: CREATOR_ACCOUNT.name,
      email: CREATOR_ACCOUNT.email,
      password: CREATOR_ACCOUNT.password,
      role: "creator",
    };
    saveUsers(users);
    return;
  }

  users.push({
    id: crypto.randomUUID(),
    name: CREATOR_ACCOUNT.name,
    email: CREATOR_ACCOUNT.email,
    password: CREATOR_ACCOUNT.password,
    role: "creator",
  });
  saveUsers(users);
}

function readUserSession() {
  const raw = localStorage.getItem(USER_SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.name !== "string" || typeof parsed.email !== "string") {
      return null;
    }
    return {
      name: parsed.name,
      email: parsed.email,
      role: normalizeRole(parsed.role),
    };
  } catch (_error) {
    return null;
  }
}

function saveUserSession(session) {
  localStorage.setItem(USER_SESSION_KEY, JSON.stringify(session));
}

function clearUserSession() {
  localStorage.removeItem(USER_SESSION_KEY);
}

function setFeedback(element, text, state) {
  if (!element) {
    return;
  }

  element.textContent = text;
  element.classList.remove("ok", "error");
  if (state) {
    element.classList.add(state);
  }
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function createEmptyState(message) {
  const div = document.createElement("div");
  div.className = "empty-state";
  div.textContent = message;
  return div;
}

function formatDate(dateString) {
  const date = new Date(dateString + "T00:00:00");
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatDateTime(dateTimeString) {
  const date = new Date(dateTimeString);
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function renderAuthState() {
  if (!authButton) {
    return;
  }

  const session = readUserSession();
  authButton.classList.remove("logged");

  if (!session) {
    authButton.textContent = "Iniciar sesion";
  } else {
    const shortName = session.name.length > 16 ? `${session.name.slice(0, 16)}...` : session.name;
    const roleTag = session.role === "creator" ? "CREADOR" : session.role === "admin" ? "ADMIN" : "USUARIO";
    authButton.textContent = `${shortName} (${roleTag})`;
    authButton.classList.add("logged");
  }

  const hasAdmin = isAdminOrCreator(session);
  document.body.classList.toggle("has-admin-access", hasAdmin);

  if (adminNavItem) {
    adminNavItem.style.display = hasAdmin ? "list-item" : "none";
  }

  renderAdminAccess();
}

function handleUserLoginSubmit(event) {
  event.preventDefault();
  if (!userLoginForm) {
    return;
  }

  const action = event.submitter?.value === "register" ? "register" : "login";
  const data = new FormData(userLoginForm);
  const inputName = String(data.get("name") || "").trim();
  const email = String(data.get("email") || "").trim().toLowerCase();
  const password = String(data.get("password") || "").trim();

  ensureCreatorAccount();
  const users = readUsers();
  const isCreatorByName = inputName.toLowerCase() === CREATOR_ACCOUNT.name.toLowerCase();

  if (!password) {
    setFeedback(userLoginFeedback, "Completa la contrasena.", "error");
    return;
  }

  const existing = users.find((user) => user.email === email);
  if (action === "register") {
    if (!email) {
      setFeedback(userLoginFeedback, "Para crear cuenta, completa el email.", "error");
      return;
    }

    if (!inputName) {
      setFeedback(userLoginFeedback, "Para crear cuenta, completa tambien el nombre.", "error");
      return;
    }

    if (isCreatorByName && email !== CREATOR_ACCOUNT.email) {
      setFeedback(userLoginFeedback, "El nombre 2K22 esta reservado para la cuenta CREADOR.", "error");
      return;
    }

    if (existing) {
      setFeedback(userLoginFeedback, "Ya existe una cuenta con ese email. Inicia sesion.", "error");
      return;
    }

    const newUser = {
      id: crypto.randomUUID(),
      name: inputName,
      email,
      password,
      role: "user",
    };

    users.push(newUser);
    saveUsers(users);
    setFeedback(userLoginFeedback, "Cuenta creada. Ahora pulsa Entrar para iniciar sesion.", "ok");
    return;
  }

  if (isCreatorByName) {
    const creator = users.find((user) => user.role === "creator" && user.name.toLowerCase() === CREATOR_ACCOUNT.name.toLowerCase());
    if (!creator || creator.password !== password) {
      setFeedback(userLoginFeedback, "Contrasena incorrecta para CREADOR.", "error");
      return;
    }

    saveUserSession({
      name: creator.name,
      email: creator.email,
      role: creator.role,
    });

    setFeedback(userLoginFeedback, "Sesion iniciada como CREADOR.", "ok");
    renderAuthState();
    setTimeout(() => {
      if (userLoginDialog) {
        userLoginDialog.close();
      }
      userLoginForm.reset();
      setFeedback(userLoginFeedback, "", "");
    }, 250);
    return;
  }

  if (!email) {
    setFeedback(userLoginFeedback, "Completa el email para iniciar sesion.", "error");
    return;
  }

  if (!existing) {
    setFeedback(userLoginFeedback, "No existe ninguna cuenta con ese email. Crea una cuenta primero.", "error");
    return;
  }

  if (existing.password !== password) {
    setFeedback(userLoginFeedback, "Contrasena incorrecta.", "error");
    return;
  }

  saveUserSession({
    name: existing.name,
    email: existing.email,
    role: existing.role,
  });

  setFeedback(userLoginFeedback, "Sesion iniciada.", "ok");
  renderAuthState();
  setTimeout(() => {
    if (userLoginDialog) {
      userLoginDialog.close();
    }
    userLoginForm.reset();
    setFeedback(userLoginFeedback, "", "");
  }, 250);
}

function handleAuthButtonClick() {
  const session = readUserSession();
  if (!session) {
    if (userLoginDialog) {
      setFeedback(userLoginFeedback, "", "");
      userLoginDialog.showModal();
    }
    return;
  }

  clearUserSession();
  renderAuthState();
}

function readData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    return structuredClone(initialData);
  }

  try {
    const parsed = JSON.parse(raw);
    if (
      !parsed ||
      !Array.isArray(parsed.slides) ||
      !Array.isArray(parsed.events) ||
      !Array.isArray(parsed.streams) ||
      !Array.isArray(parsed.reviews)
    ) {
      throw new Error("Formato invalido");
    }

    if (!Array.isArray(parsed.team)) {
      parsed.team = structuredClone(initialData.team);
    }

    return parsed;
  } catch (_error) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    return structuredClone(initialData);
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function requireAdminContentAction(feedbackElement) {
  const session = readUserSession();
  if (!isAdminOrCreator(session)) {
    setFeedback(feedbackElement, "Necesitas rol admin o creador para esta accion.", "error");
    return false;
  }
  return true;
}

function renderCarousel() {
  if (!carouselImage || !carouselTitle || !carouselCaption || !carouselIndicator) {
    return;
  }

  const data = readData();
  if (data.slides.length === 0) {
    carouselImage.src = placeholderWide;
    carouselTitle.textContent = "Sin imagenes publicadas";
    carouselCaption.textContent = "Cuando se agreguen slides, apareceran aqui.";
    carouselIndicator.textContent = "0 / 0";
    return;
  }

  if (carouselIndex >= data.slides.length) {
    carouselIndex = 0;
  }

  const current = data.slides[carouselIndex];
  carouselImage.src = current.imageUrl || placeholderWide;
  carouselImage.alt = `Slide ${current.title}`;
  carouselTitle.textContent = current.title;
  carouselCaption.textContent = current.caption;
  carouselIndicator.textContent = `${carouselIndex + 1} / ${data.slides.length}`;
}

function renderEvents() {
  if (!eventGrid) {
    return;
  }

  const data = readData();
  const events = [...data.events].sort((a, b) => a.date.localeCompare(b.date));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  eventGrid.innerHTML = "";

  if (events.length === 0) {
    eventGrid.appendChild(createEmptyState("No hay proximos eventos publicados."));
    return;
  }

  for (const [index, event] of events.entries()) {
    const eventDate = new Date(event.date + "T00:00:00");
    const isUpcoming = eventDate >= today;
    const statusClass = isUpcoming ? "upcoming" : "past";
    const statusLabel = isUpcoming ? "Proximo" : "Finalizado";

    const card = document.createElement("article");
    card.className = `event-card ${statusClass}`;
    card.style.animationDelay = `${Math.min(index * 70, 420)}ms`;
    card.innerHTML = `
      <img class="card-image" src="${escapeHTML(event.imageUrl || placeholderEvent)}" alt="${escapeHTML(event.title)}" />
      <p class="event-status ${statusClass}">${statusLabel}</p>
      <h3>${escapeHTML(event.title)}</h3>
      <p class="event-date">${formatDate(event.date)}</p>
      <p class="event-location">${escapeHTML(event.location)}</p>
      <p class="event-description">${escapeHTML(event.description)}</p>
      <p class="event-price">Precio: ${escapeHTML(event.price)} EUR</p>
      <button class="btn btn-primary" data-event-id="${event.id}">Sacar entrada</button>
    `;

    const button = card.querySelector("button");
    on(button, "click", () => {
      if (!ticketEventName || !ticketForm || !ticketDialog) {
        return;
      }

      selectedEvent = event;
      ticketEventName.textContent = `${event.title} - ${formatDate(event.date)}`;
      setFeedback(ticketFeedback, "", "");
      ticketForm.reset();
      ticketDialog.showModal();
    });

    eventGrid.appendChild(card);
  }
}

function renderStreams() {
  if (!streamGrid) {
    return;
  }

  const data = readData();
  const streams = [...data.streams].sort((a, b) => a.datetime.localeCompare(b.datetime));
  streamGrid.innerHTML = "";

  if (streams.length === 0) {
    streamGrid.appendChild(createEmptyState("No hay streams publicados por el admin."));
    return;
  }

  for (const [index, stream] of streams.entries()) {
    const card = document.createElement("article");
    card.className = "stream-card";
    card.style.animationDelay = `${Math.min(index * 70, 420)}ms`;
    card.innerHTML = `
      <img class="card-image" src="${escapeHTML(stream.imageUrl || placeholderStream)}" alt="${escapeHTML(stream.title)}" />
      <h3>${escapeHTML(stream.title)}</h3>
      <p class="stream-date">${formatDateTime(stream.datetime)}</p>
      <p class="stream-meta">Plataforma: ${escapeHTML(stream.platform)}</p>
      <a class="stream-link" href="${escapeHTML(stream.url)}" target="_blank" rel="noreferrer">Ver directo</a>
    `;
    streamGrid.appendChild(card);
  }
}

function renderReviews() {
  if (!reviewGrid) {
    return;
  }

  const data = readData();
  reviewGrid.innerHTML = "";

  if (data.reviews.length === 0) {
    reviewGrid.appendChild(createEmptyState("No hay reviews cargadas por el admin."));
    return;
  }

  for (const [index, review] of data.reviews.entries()) {
    const stars = "★".repeat(Math.max(1, Math.min(5, Number(review.rating) || 1)));
    const card = document.createElement("article");
    card.className = "review-card";
    card.style.animationDelay = `${Math.min(index * 70, 420)}ms`;
    card.innerHTML = `
      <div class="review-header">
        <h3>${escapeHTML(review.author)}</h3>
        <img class="review-image" src="${escapeHTML(review.imageUrl || placeholderReview)}" alt="${escapeHTML(review.author)}" />
      </div>
      <p class="review-rating">${stars}</p>
      <p class="event-location">Evento: ${escapeHTML(review.event)}</p>
      <p class="review-comment">${escapeHTML(review.comment)}</p>
    `;
    reviewGrid.appendChild(card);
  }
}

function renderTeam() {
  if (!teamGrid) {
    return;
  }

  const data = readData();
  teamGrid.innerHTML = "";

  if (data.team.length === 0) {
    teamGrid.appendChild(createEmptyState("Todavia no hay miembros publicados en el team."));
    return;
  }

  for (const [index, person] of data.team.entries()) {
    const card = document.createElement("article");
    card.className = "team-card";
    card.style.animationDelay = `${Math.min(index * 80, 480)}ms`;
    card.innerHTML = `
      <img class="team-avatar" src="${escapeHTML(person.imageUrl || placeholderTeam)}" alt="${escapeHTML(person.name)}" />
      <h3>${escapeHTML(person.name)}</h3>
      <p class="team-role">${escapeHTML(person.role)}</p>
      <p>${escapeHTML(person.area)}</p>
    `;
    teamGrid.appendChild(card);
  }
}

function renderAll() {
  renderCarousel();
  renderEvents();
  renderStreams();
  renderReviews();
  renderTeam();
  renderAdminManageLists();
}

function createAdminItemRow(label, kind, itemId) {
  const row = document.createElement("article");
  row.className = "admin-item-row";
  row.innerHTML = `
    <p>${escapeHTML(label)}</p>
    <button type="button" class="btn btn-danger" data-remove-kind="${kind}" data-remove-id="${itemId}">Eliminar</button>
  `;
  return row;
}

function mountManageList(container, items, mapper) {
  if (!container) {
    return;
  }

  container.innerHTML = "";
  if (items.length === 0) {
    container.appendChild(createEmptyState("Sin elementos."));
    return;
  }

  for (const item of items) {
    const mapped = mapper(item);
    const row = createAdminItemRow(mapped.label, mapped.kind, mapped.id);
    container.appendChild(row);
  }
}

function removeContentByKind(kind, itemId) {
  const data = readData();
  const listMap = {
    slide: "slides",
    event: "events",
    stream: "streams",
    review: "reviews",
    team: "team",
  };

  const listName = listMap[kind];
  if (!listName || !Array.isArray(data[listName])) {
    return false;
  }

  const before = data[listName].length;
  data[listName] = data[listName].filter((item) => item.id !== itemId);
  if (data[listName].length === before) {
    return false;
  }

  saveData(data);
  renderAll();
  return true;
}

function handleAdminRemoveClick(event) {
  const button = event.target.closest("button[data-remove-kind]");
  if (!button) {
    return;
  }

  const session = readUserSession();
  if (!isAdminOrCreator(session)) {
    setFeedback(adminPanelFeedback, "No tienes permisos para eliminar.", "error");
    return;
  }

  const kind = button.getAttribute("data-remove-kind") || "";
  const itemId = button.getAttribute("data-remove-id") || "";
  if (!kind || !itemId) {
    return;
  }

  const labels = {
    slide: "este slide",
    event: "este evento",
    stream: "este stream",
    review: "esta review",
    team: "este miembro del team",
  };
  const targetLabel = labels[kind] || "este elemento";
  if (deleteConfirmDialog && confirmDeleteButton) {
    pendingDeleteAction = { kind, itemId };
    if (deleteConfirmText) {
      deleteConfirmText.textContent = `Vas a eliminar ${targetLabel}. Esta accion no se puede deshacer.`;
    }
    deleteConfirmDialog.showModal();
    return;
  }

  const shouldDelete = window.confirm(`Seguro que quieres eliminar ${targetLabel}? Esta accion no se puede deshacer.`);
  if (!shouldDelete) {
    return;
  }

  const ok = removeContentByKind(kind, itemId);
  if (!ok) {
    setFeedback(adminPanelFeedback, "No se pudo eliminar el elemento.", "error");
    return;
  }

  setFeedback(adminPanelFeedback, "Elemento eliminado correctamente.", "ok");
}

function handleConfirmDeleteClick() {
  if (!pendingDeleteAction) {
    return;
  }

  const session = readUserSession();
  if (!isAdminOrCreator(session)) {
    setFeedback(adminPanelFeedback, "No tienes permisos para eliminar.", "error");
    pendingDeleteAction = null;
    if (deleteConfirmDialog) {
      deleteConfirmDialog.close();
    }
    return;
  }

  const { kind, itemId } = pendingDeleteAction;
  const ok = removeContentByKind(kind, itemId);
  if (!ok) {
    setFeedback(adminPanelFeedback, "No se pudo eliminar el elemento.", "error");
  } else {
    setFeedback(adminPanelFeedback, "Elemento eliminado correctamente.", "ok");
  }

  pendingDeleteAction = null;
  if (deleteConfirmDialog) {
    deleteConfirmDialog.close();
  }
}

function renderAdminManageLists() {
  const data = readData();

  mountManageList(slideManageList, data.slides, (item) => ({
    id: item.id,
    label: item.title || "Slide sin titulo",
    kind: "slide",
  }));

  mountManageList(eventManageList, data.events, (item) => ({
    id: item.id,
    label: `${item.title || "Evento"} (${item.date || "sin fecha"})`,
    kind: "event",
  }));

  mountManageList(streamManageList, data.streams, (item) => ({
    id: item.id,
    label: `${item.title || "Stream"} - ${item.platform || "Plataforma"}`,
    kind: "stream",
  }));

  mountManageList(reviewManageList, data.reviews, (item) => ({
    id: item.id,
    label: `${item.author || "Autor"}: ${item.event || "Evento"}`,
    kind: "review",
  }));

  mountManageList(teamManageList, data.team, (item) => ({
    id: item.id,
    label: `${item.name || "Miembro"} - ${item.role || "Rol"}`,
    kind: "team",
  }));
}

function renderAdminAccess() {
  if (!adminArea && !adminDenied && !creatorRoleBlock) {
    return;
  }

  const session = readUserSession();
  const isPrivileged = isAdminOrCreator(session);

  if (adminArea) {
    adminArea.classList.toggle("visible", isPrivileged);
  }
  if (adminDenied) {
    adminDenied.classList.toggle("visible", !isPrivileged);
  }
  if (creatorRoleBlock) {
    creatorRoleBlock.classList.toggle("visible", session?.role === "creator");
  }
}

function handleSupportSubmit(event) {
  event.preventDefault();
  if (supportForm) {
    supportForm.reset();
  }
  setFeedback(supportFeedback, "Mensaje enviado. Te responderemos en menos de 24h.", "ok");
}

function handleCreateSlide(event) {
  event.preventDefault();
  if (!adminSlideForm || !requireAdminContentAction(slideFeedback)) {
    return;
  }

  const formData = new FormData(adminSlideForm);
  const slide = {
    id: crypto.randomUUID(),
    title: String(formData.get("title") || "").trim(),
    caption: String(formData.get("caption") || "").trim(),
    imageUrl: String(formData.get("imageUrl") || "").trim(),
  };

  if (!slide.title || !slide.caption || !slide.imageUrl) {
    setFeedback(slideFeedback, "Completa todos los campos del slide.", "error");
    return;
  }

  const data = readData();
  data.slides.push(slide);
  saveData(data);
  carouselIndex = data.slides.length - 1;
  renderCarousel();

  setFeedback(slideFeedback, "Slide agregado con exito.", "ok");
  adminSlideForm.reset();
}

function handleCreateEvent(event) {
  event.preventDefault();
  if (!adminEventForm || !requireAdminContentAction(adminPanelFeedback)) {
    return;
  }

  const formData = new FormData(adminEventForm);
  const newEvent = {
    id: crypto.randomUUID(),
    title: String(formData.get("title") || "").trim(),
    date: String(formData.get("date") || "").trim(),
    location: String(formData.get("location") || "").trim(),
    price: Number(formData.get("price") || 0),
    imageUrl: String(formData.get("imageUrl") || "").trim(),
    description: String(formData.get("description") || "").trim(),
  };

  if (
    !newEvent.title ||
    !newEvent.date ||
    !newEvent.location ||
    !newEvent.description ||
    !newEvent.imageUrl
  ) {
    setFeedback(adminPanelFeedback, "Completa todos los campos del evento.", "error");
    return;
  }

  if (Number.isNaN(newEvent.price) || newEvent.price < 0) {
    setFeedback(adminPanelFeedback, "El precio debe ser un numero valido.", "error");
    return;
  }

  const data = readData();
  data.events.push(newEvent);
  saveData(data);
  renderEvents();

  setFeedback(adminPanelFeedback, "Evento creado con exito.", "ok");
  adminEventForm.reset();
}

function handleCreateStream(event) {
  event.preventDefault();
  if (!adminStreamForm || !requireAdminContentAction(streamFeedback)) {
    return;
  }

  const formData = new FormData(adminStreamForm);
  const stream = {
    id: crypto.randomUUID(),
    title: String(formData.get("title") || "").trim(),
    datetime: String(formData.get("datetime") || "").trim(),
    platform: String(formData.get("platform") || "").trim(),
    url: String(formData.get("url") || "").trim(),
    imageUrl: String(formData.get("imageUrl") || "").trim(),
  };

  if (!stream.title || !stream.datetime || !stream.platform || !stream.url || !stream.imageUrl) {
    setFeedback(streamFeedback, "Completa todos los campos del stream.", "error");
    return;
  }

  const data = readData();
  data.streams.push(stream);
  saveData(data);
  renderStreams();

  setFeedback(streamFeedback, "Stream publicado correctamente.", "ok");
  adminStreamForm.reset();
}

function handleCreateReview(event) {
  event.preventDefault();
  if (!adminReviewForm || !requireAdminContentAction(reviewFeedback)) {
    return;
  }

  const formData = new FormData(adminReviewForm);
  const review = {
    id: crypto.randomUUID(),
    author: String(formData.get("author") || "").trim(),
    event: String(formData.get("event") || "").trim(),
    rating: Number(formData.get("rating") || 0),
    comment: String(formData.get("comment") || "").trim(),
    imageUrl: String(formData.get("imageUrl") || "").trim(),
  };

  if (!review.author || !review.event || !review.comment || Number.isNaN(review.rating)) {
    setFeedback(reviewFeedback, "Completa los datos obligatorios de la review.", "error");
    return;
  }

  if (review.rating < 1 || review.rating > 5) {
    setFeedback(reviewFeedback, "La puntuacion debe estar entre 1 y 5.", "error");
    return;
  }

  const data = readData();
  data.reviews.unshift(review);
  saveData(data);
  renderReviews();

  setFeedback(reviewFeedback, "Review publicada.", "ok");
  adminReviewForm.reset();
}

function handleCreateTeam(event) {
  event.preventDefault();
  if (!adminTeamForm || !requireAdminContentAction(teamFeedback)) {
    return;
  }

  const formData = new FormData(adminTeamForm);
  const member = {
    id: crypto.randomUUID(),
    name: String(formData.get("name") || "").trim(),
    role: String(formData.get("role") || "").trim(),
    area: String(formData.get("area") || "").trim(),
    imageUrl: String(formData.get("imageUrl") || "").trim(),
  };

  if (!member.name || !member.role || !member.area || !member.imageUrl) {
    setFeedback(teamFeedback, "Completa todos los campos del team.", "error");
    return;
  }

  const data = readData();
  data.team.push(member);
  saveData(data);
  renderTeam();

  setFeedback(teamFeedback, "Miembro agregado al team.", "ok");
  adminTeamForm.reset();
}

function renderRoleSearchResults(query) {
  if (!roleSearchResults) {
    return;
  }

  const users = readUsers();
  const normalizedQuery = query.toLowerCase();
  const matches = !normalizedQuery
    ? users
    : users.filter((user) =>
        user.name.toLowerCase().includes(normalizedQuery) || user.email.toLowerCase().includes(normalizedQuery)
      );

  roleSearchResults.innerHTML = "";

  if (matches.length === 0) {
    roleSearchResults.appendChild(createEmptyState("No se encontraron usuarios."));
    return;
  }

  for (const user of matches) {
    const row = document.createElement("article");
    row.className = "role-user-row";

    const isFixedCreatorUser = isFixedCreatorAccount(user);
    const selectOptions = ["user", "admin", "creator"]
      .map((role) => `<option value="${role}" ${role === user.role ? "selected" : ""}>${role.toUpperCase()}</option>`)
      .join("");

    row.innerHTML = `
      <div class="role-user-meta">
        <p><strong>${escapeHTML(user.name)}</strong></p>
        <p>${escapeHTML(user.email)}</p>
        <p class="role-user-role">Rol actual: ${escapeHTML(user.role.toUpperCase())}</p>
      </div>
      ${
        isFixedCreatorUser
          ? `<p class="role-user-role">Cuenta CREADOR fija</p>`
          : `<select data-user-id="${escapeHTML(user.id)}">${selectOptions}</select>
             <button type="button" class="btn btn-primary" data-assign-role="${escapeHTML(user.id)}">Guardar</button>`
      }
    `;

    roleSearchResults.appendChild(row);
  }

  for (const button of roleSearchResults.querySelectorAll("button[data-assign-role]")) {
    on(button, "click", () => {
      const session = readUserSession();
      if (session?.role !== "creator") {
        setFeedback(roleSearchFeedback, "Solo el CREADOR puede asignar roles.", "error");
        return;
      }

      const userId = button.getAttribute("data-assign-role");
      const select = roleSearchResults.querySelector(`select[data-user-id="${userId}"]`);
      if (!select || !userId) {
        return;
      }

      const nextRole = normalizeRole(select.value);
      const users = readUsers();
      const idx = users.findIndex((user) => user.id === userId);
      if (idx < 0) {
        setFeedback(roleSearchFeedback, "No se encontro el usuario.", "error");
        return;
      }

      users[idx].role = nextRole;
      saveUsers(users);

      const currentSession = readUserSession();
      if (currentSession && currentSession.email === users[idx].email) {
        saveUserSession({
          ...currentSession,
          role: nextRole,
        });
      }

      setFeedback(roleSearchFeedback, "Rol actualizado correctamente.", "ok");
      renderRoleSearchResults(query);
      renderAuthState();
    });
  }
}

function handleRoleSearchSubmit(event) {
  event.preventDefault();
  const session = readUserSession();
  if (session?.role !== "creator") {
    setFeedback(roleSearchFeedback, "Solo el CREADOR puede buscar y asignar roles.", "error");
    return;
  }

  if (!roleSearchForm) {
    return;
  }

  const data = new FormData(roleSearchForm);
  const query = String(data.get("query") || "").trim();

  setFeedback(roleSearchFeedback, "", "");
  renderRoleSearchResults(query);
}

function handleTicketPurchase(event) {
  event.preventDefault();

  if (!selectedEvent) {
    setFeedback(ticketFeedback, "No se encontro el evento seleccionado.", "error");
    return;
  }

  if (!ticketForm) {
    return;
  }

  const data = new FormData(ticketForm);
  const buyerName = String(data.get("buyerName") || "").trim();
  const buyerEmail = String(data.get("buyerEmail") || "").trim();
  const qty = Number(data.get("buyerQty") || 1);

  if (!buyerName || !buyerEmail || Number.isNaN(qty) || qty < 1) {
    setFeedback(ticketFeedback, "Revisa los datos para continuar.", "error");
    return;
  }

  setFeedback(ticketFeedback, "Compra confirmada. Te enviamos la entrada por email.", "ok");

  setTimeout(() => {
    if (ticketDialog) {
      ticketDialog.close();
    }
    ticketForm.reset();
    setFeedback(ticketFeedback, "", "");
  }, 700);
}

function initColorBendsBackground() {
  const canvas = document.getElementById("colorBendsCanvas");
  if (!canvas) {
    return;
  }

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) {
    return;
  }

  const settings = {
    rotation: (51 * Math.PI) / 180,
    speed: 0.35,
    autoRotate: 1,
    scale: 1,
    frequency: 1,
    warpStrength: 1.2,
    mouseInfluence: 1,
    parallax: 0.5,
    noise: 0.14,
  };

  let width = 0;
  let height = 0;
  let rafId = 0;
  let t = 0;
  const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };

  function resize() {
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function onMouseMove(event) {
    mouse.tx = event.clientX / Math.max(1, width);
    mouse.ty = event.clientY / Math.max(1, height);
  }

  function drawBand(index, total, motionX, motionY) {
    const yNorm = index / (total - 1);
    const centerY = (yNorm - 0.5) * height * 1.25;
    const amplitude = (100 + index * 13) * settings.warpStrength;
    const thickness = Math.max(120, height * 0.18 - index * 6);

    const gradient = ctx.createLinearGradient(-width, centerY - thickness, width, centerY + thickness);
    gradient.addColorStop(0, "rgba(255, 115, 0, 0)");
    gradient.addColorStop(0.25, `rgba(255, 115, 0, ${0.2 + index * 0.025})`);
    gradient.addColorStop(0.5, `rgba(255, 115, 0, ${0.34 + index * 0.03})`);
    gradient.addColorStop(0.78, `rgba(255, 115, 0, ${0.18 + index * 0.02})`);
    gradient.addColorStop(1, "rgba(255, 115, 0, 0)");

    ctx.lineWidth = thickness;
    ctx.strokeStyle = gradient;
    ctx.lineCap = "round";
    ctx.beginPath();

    const segments = 7;
    for (let s = 0; s <= segments; s += 1) {
      const x = -width * 0.7 + (s / segments) * (width * 2.4);
      const waveA = Math.sin(x * 0.0028 * settings.frequency + t * 1.7 + index * 0.9);
      const waveB = Math.cos(x * 0.0019 * settings.frequency - t * 1.15 + index * 0.7);
      const jitter =
        (Math.sin(t * 4 + s + index) + Math.cos(t * 3 - s * 0.7)) * amplitude * settings.noise * 0.5;
      const y = centerY + waveA * amplitude + waveB * amplitude * 0.45 + jitter + motionY * (25 + index * 4);
      const xx = x + motionX * (45 + index * 7);

      if (s === 0) {
        ctx.moveTo(xx, y);
      } else {
        ctx.lineTo(xx, y);
      }
    }

    ctx.stroke();
  }

  function render() {
    t += 0.008 * settings.speed;
    mouse.x += (mouse.tx - mouse.x) * 0.08;
    mouse.y += (mouse.ty - mouse.y) * 0.08;

    const motionX = (mouse.x - 0.5) * 2 * settings.mouseInfluence * settings.parallax;
    const motionY = (mouse.y - 0.5) * 2 * settings.mouseInfluence * settings.parallax;

    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.rotate(settings.rotation + t * 0.12 * settings.autoRotate);
    ctx.scale(settings.scale, settings.scale);
    ctx.translate(-width / 2, -height / 2);

    ctx.globalCompositeOperation = "lighter";
    const totalBands = 8;
    for (let i = 0; i < totalBands; i += 1) {
      drawBand(i, totalBands, motionX, motionY);
    }
    ctx.globalCompositeOperation = "source-over";
    ctx.restore();

    rafId = window.requestAnimationFrame(render);
  }

  function onVisibilityChange() {
    if (document.hidden) {
      window.cancelAnimationFrame(rafId);
      return;
    }
    window.cancelAnimationFrame(rafId);
    rafId = window.requestAnimationFrame(render);
  }

  resize();
  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("mousemove", onMouseMove, { passive: true });
  document.addEventListener("visibilitychange", onVisibilityChange);
  rafId = window.requestAnimationFrame(render);
}

on(menuToggle, "click", () => {
  if (navLinks) {
    navLinks.classList.toggle("open");
  }
});

if (navLinks) {
  for (const link of navLinks.querySelectorAll("a")) {
    on(link, "click", () => navLinks.classList.remove("open"));
  }
}

on(carouselPrev, "click", () => {
  const total = readData().slides.length;
  if (total === 0) {
    return;
  }
  carouselIndex = (carouselIndex - 1 + total) % total;
  renderCarousel();
});

on(carouselNext, "click", () => {
  const total = readData().slides.length;
  if (total === 0) {
    return;
  }
  carouselIndex = (carouselIndex + 1) % total;
  renderCarousel();
});

on(supportForm, "submit", handleSupportSubmit);
on(adminSlideForm, "submit", handleCreateSlide);
on(adminEventForm, "submit", handleCreateEvent);
on(adminStreamForm, "submit", handleCreateStream);
on(adminReviewForm, "submit", handleCreateReview);
on(adminTeamForm, "submit", handleCreateTeam);
on(roleSearchForm, "submit", handleRoleSearchSubmit);
on(slideManageList, "click", handleAdminRemoveClick);
on(eventManageList, "click", handleAdminRemoveClick);
on(streamManageList, "click", handleAdminRemoveClick);
on(reviewManageList, "click", handleAdminRemoveClick);
on(teamManageList, "click", handleAdminRemoveClick);
on(cancelDeleteButton, "click", () => {
  pendingDeleteAction = null;
  if (deleteConfirmDialog) {
    deleteConfirmDialog.close();
  }
});
on(confirmDeleteButton, "click", handleConfirmDeleteClick);
on(deleteConfirmDialog, "close", () => {
  pendingDeleteAction = null;
});

on(closeTicketDialog, "click", () => {
  if (ticketDialog) {
    ticketDialog.close();
  }
});
on(ticketForm, "submit", handleTicketPurchase);

on(authButton, "click", handleAuthButtonClick);
on(closeUserLoginDialog, "click", () => {
  if (userLoginDialog) {
    userLoginDialog.close();
  }
});
on(userLoginForm, "submit", handleUserLoginSubmit);

ensureCreatorAccount();
renderAll();
renderAuthState();
initColorBendsBackground();
