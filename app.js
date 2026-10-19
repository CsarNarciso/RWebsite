// REGAMSA MEDICAL — concept interactions (no framework)
(async function () {
  var sections = Array.from(document.querySelectorAll("template[data-src]"));

  try {
    var content = await Promise.all(sections.map(async function (section) {
      var response = await fetch(section.dataset.src);
      if (!response.ok) {
        throw new Error("Unable to load " + section.dataset.src + ": " + response.status);
      }
      return response.text();
    }));

    sections.forEach(function (section, index) {
      var template = document.createElement("template");
      template.innerHTML = content[index];
      section.replaceWith(template.content);
    });
  } catch (error) {
    console.error("Unable to load page sections.", error);
    var message = document.createElement("p");
    message.className = "wrap";
    message.setAttribute("role", "alert");
    message.textContent = "No se pudo cargar el contenido. Por favor, recarga la página.";
    document.getElementById("inicio").replaceChildren(message);
    return;
  }

  var navbar = document.getElementById("navbar");
  var navToggle = document.getElementById("navToggle");
  var mobileMenu = document.getElementById("mobileMenu");
  var drawer = document.getElementById("quoteDrawer");
  var backdrop = document.getElementById("drawerBackdrop");
  var quoteList = document.getElementById("quoteList");
  var quoteCount = document.getElementById("quoteCount");
  var formProducts = document.getElementById("formProducts");
  var toast = document.getElementById("toast");

  var KEY = "regamsa_quote_v1";

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch (e) { return []; }
  }
  function save(items) {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) {}
  }

  var toastTimer = null;
  function showToast(msg) {
    toast.textContent = msg;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.hidden = true; }, 2600);
  }

  function render() {
    var items = load();
    quoteCount.textContent = String(items.length);
    quoteList.innerHTML = "";
    if (!items.length) {
      var li = document.createElement("li");
      li.className = "drawer-empty";
      li.textContent = "Tu carrito se encuentra vacio";
      quoteList.appendChild(li);
    } else {
      items.forEach(function (name, i) {
        var li = document.createElement("li");
        var span = document.createElement("span");
        span.textContent = name;
        var btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = "Quitar";
        btn.setAttribute("aria-label", "Quitar " + name);
        btn.addEventListener("click", function () {
          var next = load();
          next.splice(i, 1);
          save(next); render();
        });
        li.appendChild(span);
        li.appendChild(btn);
        quoteList.appendChild(li);
      });
    }
    if (formProducts) formProducts.value = items.join(" · ");
  }

  function openDrawer() {
    render();
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    backdrop.hidden = false;
  }
  function closeDrawer() {
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    backdrop.hidden = true;
  }

  document.querySelectorAll("[data-add-quote]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var name = btn.getAttribute("data-add-quote");
      var items = load();
      if (items.indexOf(name) === -1) {
        items.push(name);
        save(items);
        showToast("Agregado a tu lista de cotización");
      } else {
        showToast("Ya está en tu lista");
      }
      render();
      openDrawer();
    });
  });

  document.getElementById("openQuote").addEventListener("click", openDrawer);
  document.getElementById("openQuote2").addEventListener("click", openDrawer);
  document.getElementById("closeQuote").addEventListener("click", closeDrawer);
  backdrop.addEventListener("click", closeDrawer);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeDrawer(); });

  document.getElementById("clearQuote").addEventListener("click", function () {
    save([]); render(); showToast("Lista vaciada");
  });

  document.getElementById("goContact").addEventListener("click", function () {
    closeDrawer();
    document.getElementById("contacto").scrollIntoView({ behavior: "smooth" });
  });

  // Mobile menu
  navToggle.addEventListener("click", function () {
    var open = mobileMenu.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  mobileMenu.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      mobileMenu.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  var navLinks = document.getElementById("navLinks");
  var desktopLinks = Array.from(navLinks.querySelectorAll("a[href^='#']"));
  var headerLinks = desktopLinks.concat(Array.from(mobileMenu.querySelectorAll("a[href^='#']")));
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var inkLinks = [navbar.querySelector(".brand")].concat(headerLinks);

  inkLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      if (reducedMotion.matches) return;
      var bounds = link.getBoundingClientRect();
      var x = event.detail === 0 ? bounds.width / 2 : event.clientX - bounds.left;
      var y = event.detail === 0 ? bounds.height / 2 : event.clientY - bounds.top;
      var diameter = 2 * Math.hypot(Math.max(x, bounds.width - x), Math.max(y, bounds.height - y));
      var ink = document.createElement("span");
      ink.className = "nav-ink";
      ink.setAttribute("aria-hidden", "true");
      ink.style.setProperty("--ink-x", x + "px");
      ink.style.setProperty("--ink-y", y + "px");
      ink.style.setProperty("--ink-size", diameter + "px");
      link.appendChild(ink);
      var cleanupTimer = setTimeout(removeInk, 850);
      function removeInk() {
        clearTimeout(cleanupTimer);
        ink.remove();
      }
      ink.addEventListener("animationend", removeInk, { once: true });
      ink.addEventListener("animationcancel", removeInk, { once: true });
    }, { capture: true });
  });

  var navSections = desktopLinks.map(function (link) {
    return { link: link, section: document.getElementById(link.hash.slice(1)) };
  }).filter(function (item) { return item.section; });
  var activeLink = null;
  var hoveredLink = null;
  var navFrame = null;

  function positionNavLine() {
    var focusedLink = desktopLinks.indexOf(document.activeElement) !== -1 && document.activeElement.matches(":focus-visible") ? document.activeElement : null;
    var link = hoveredLink || focusedLink || activeLink;
    if (!link || !navLinks.getClientRects().length) {
      navLinks.style.setProperty("--nav-line-opacity", "0");
      return;
    }
    var bounds = link.getBoundingClientRect();
    var navBounds = navLinks.getBoundingClientRect();
    navLinks.style.setProperty("--nav-line-x", (bounds.left - navBounds.left) + "px");
    navLinks.style.setProperty("--nav-line-width", bounds.width + "px");
    navLinks.style.setProperty("--nav-line-opacity", "1");
  }

  function updateNavSection() {
    navFrame = null;
    navbar.classList.toggle("scrolled", window.scrollY > 8);
    var threshold = navbar.querySelector(".nav-inner").getBoundingClientRect().height + Math.min(160, window.innerHeight * .2);
    var current = null;
    navSections.forEach(function (item) {
      if (item.section.getBoundingClientRect().top <= threshold) current = item.link;
    });
    if (navSections.length && window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
      current = navSections[navSections.length - 1].link;
    }
    activeLink = current;
    headerLinks.forEach(function (link) {
      if (current && link.hash === current.hash) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
    positionNavLine();
  }

  function scheduleNavUpdate() {
    if (navFrame === null) navFrame = requestAnimationFrame(updateNavSection);
  }

  desktopLinks.forEach(function (link) {
    link.addEventListener("mouseenter", function () {
      hoveredLink = link;
      positionNavLine();
    });
    link.addEventListener("focus", positionNavLine);
    link.addEventListener("blur", scheduleNavUpdate);
  });
  navLinks.addEventListener("mouseleave", function () {
    hoveredLink = null;
    positionNavLine();
  });
  window.addEventListener("scroll", scheduleNavUpdate, { passive: true });
  window.addEventListener("resize", scheduleNavUpdate);
  window.addEventListener("load", scheduleNavUpdate);
  var navResizeObserver = new ResizeObserver(scheduleNavUpdate);
  navResizeObserver.observe(document.getElementById("inicio"));
  navResizeObserver.observe(navbar.querySelector(".nav-inner"));
  if (document.fonts) document.fonts.ready.then(scheduleNavUpdate);
  updateNavSection();

  // Concept form (no backend)
  document.getElementById("quoteForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = document.getElementById("formOk");
    ok.hidden = false;
    showToast("Solicitud registrada (concepto)");
    ok.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  document.getElementById("year").textContent = String(new Date().getFullYear());
  render();

  if (window.location.hash) {
    var target = document.getElementById(window.location.hash.slice(1));
    if (target) target.scrollIntoView();
  }
})();
