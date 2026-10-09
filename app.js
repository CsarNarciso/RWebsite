// REGAMSA MEDICAL — interacciones del concepto (sin framework)
(function () {
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
      li.textContent = "Tu lista está vacía. Agrega la Columna Cielítica Retráctil.";
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

  // Menú móvil
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

  // Sombra del navbar
  window.addEventListener("scroll", function () {
    navbar.classList.toggle("scrolled", window.scrollY > 8);
  }, { passive: true });

  // Formulario concepto (sin backend)
  document.getElementById("quoteForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = document.getElementById("formOk");
    ok.hidden = false;
    showToast("Solicitud registrada (concepto)");
    ok.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  document.getElementById("year").textContent = String(new Date().getFullYear());
  render();
})();
